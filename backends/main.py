from fastapi import FastAPI, UploadFile, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import logging
from database import get_db, File, FileChunk
from parsers import FileParser  # Placeholder for custom parser imports
from chunks import TextProcessor, client
from dotenv import load_dotenv
import uvicorn
from functools import lru_cache


# Load environment variables
load_dotenv()

# Initialize FastAPI app and logging
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)


class AskModel(BaseModel):
    document_id: int
    question: str

class Question(BaseModel):
    question: str
    similarity_threshold: float = 0.7  # Allow configurable threshold
    chunk_limit: int = 10  # Allow configurable chunk limit

class ChunkResponse(BaseModel):
    chunk_text: str
    similarity_score: float
    file_id: int
    file_name: str




async def get_similar_chunks_across_all(question: str, db: Session,limit:int=10):
    """Fetch similar chunks for a given question and file."""
    try:
        @lru_cache(maxsize=1000)
        def get_question_embedding(q:str):
            response = client.embeddings.create(
                model="BAAI/bge-en-icl",
                input=q,
                encoding_format="float"
            )
            return response.data[0].embedding
        question_embedding = get_question_embedding(question)
        
        query = select(FileChunk).order_by(FileChunk.embedding_vector.l2_distance(question_embedding)).limit(limit)
        similar_chunks = db.scalars(query).all()
        return similar_chunks
    except Exception as e:
        logging.error(f"Error fetching similar chunks: {e}")
        raise HTTPException(status_code=500, detail="Error fetching similar chunks")

# Endpoints
@app.get("/")
async def list_uploaded_files(db: Session = Depends(get_db)):
    """List all uploaded files."""
    try:
        files = db.scalars(select(File)).all()
        return [{"file_id": file.file_id, "file_name": file.file_name} for file in files]
    except Exception as e:
        logging.error(f"Error retrieving files: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving files")

@app.post("/uploadfile/")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile, db: Session = Depends(get_db)):
    """Upload and process a file."""
    allowed_extensions = ["txt", "pdf"]
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File type not allowed")

    folder = "sources"
    os.makedirs(folder, exist_ok=True)
    file_path = os.path.join(folder, file.filename)

    try:
        # Save the file to disk
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(await file.read())

        # Parse file content
        content_parser = FileParser(filepath=file_path)
        file_text_content = content_parser.parse()
        if not file_text_content:
            raise HTTPException(status_code=400, detail="Failed to extract text from file")

        # Save to database
        new_file = File(file_name=file.filename, file_content=file_text_content)
        db.add(new_file)
        db.commit()
        db.refresh(new_file)

        # Process text in the background
        text_processor = TextProcessor(db=db, file_id=new_file.file_id)
        background_tasks.add_task(text_processor.chunk_and_embed, file_text_content)

        return {"info": "File saved", "filename": file.filename}
    except Exception as e:
        logging.error(f"Error processing file {file.filename}: {e}")
        raise HTTPException(status_code=500, detail="Error processing file")

@app.post("/ask-all/")
async def ask_question(request: Question, db: Session = Depends(get_db)):
    """Ask a question about a document."""
    if os.getenv("NEBIUS_API_KEY") is None:
        raise HTTPException(status_code=500, detail="NEBIUS API key not set")

    try:
        similar_chunks = await get_similar_chunks_across_all(request.question, db)
        second_similar_chunks = await get_similar_chunks_across_all(request.question, db, limit=10)

        context = " ".join(chunk.chunk_text for chunk in similar_chunks)
        second_context = " ".join(chunk.chunk_text for chunk in second_similar_chunks)

        # Generate responses from multiple models
        system_message = f"You are a helpful assistant. Context: {context}"
        second_system_message = f"You are a helpful assistant. Context: {second_context}"

        primary_response = client.chat.completions.create(
            model="Qwen/Qwen2.5-Coder-32B-Instruct",
            messages=[{"role": "system", "content": system_message}, {"role": "user", "content": request.question}]
        )
        secondary_response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-405B-Instruct",
            messages=[{"role": "system", "content": second_system_message}, {"role": "user", "content": request.question}]
        )

        
        # Generate final response with better prompt engineering
        final_message = (
            "Synthesize a clear, concise answer based on these model responses:\n"
            f"1. {primary_response.choices[0].message.content}\n"
            f"2. {secondary_response.choices[0].message.content}\n"
            "Focus on accuracy and relevance to the question. "
            "Provide only the synthesized answer without mentioning the sources."
        )
        final_response = client.chat.completions.create(
            model="nvidia/Llama-3.1-Nemotron-70B-Instruct-HF",
            messages=[{"role": "system", "content": final_message}, {"role": "user", "content": request.question}],
            temperature=0,
            max_tokens=1000
        )

        return {"response": final_response.choices[0].message.content}
    except Exception as e:
        logging.error(f"Error processing question: {e}")
        raise HTTPException(status_code=500, detail="Error processing question")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
