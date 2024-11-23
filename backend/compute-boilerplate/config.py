import dotenv
import os

dotenv.load_dotenv()

class Config:
    MODEL_NAME: str = "meta-llama/Meta-Llama-3.1-405B-Instruct"
    PORT: int = 8000
    DEFAULT_MAX_TOKENS: int = 1000
    DEFAULT_TEMPERATURE: float = 0.5
    HUGGINGFACE_ACCESS_TOKEN: str = os.getenv("HUGGINGFACE_ACCESS_TOKEN", "")
