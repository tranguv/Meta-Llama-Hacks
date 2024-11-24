import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from tqdm import tqdm

def is_valid_pdf(url):
    """
    Check if the URL points to a valid PDF file.
    """
    parsed = urlparse(url)
    return parsed.path.lower().endswith('.pdf')

def get_all_pdf_links(url, session):
    """
    Fetch all PDF links from the given URL.
    """
    try:
        response = session.get(url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return []

    soup = BeautifulSoup(response.content, 'html.parser')
    pdf_links = set()

    for link in soup.find_all('a', href=True):
        href = link['href']
        if is_valid_pdf(href):
            # Handle relative URLs
            full_url = urljoin(url, href)
            pdf_links.add(full_url)

    return list(pdf_links)

def download_pdf(pdf_url, save_dir, session):
    """
    Download a single PDF file.
    """
    try:
        response = session.get(pdf_url, stream=True)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {pdf_url}: {e}")
        return False

    # Extract the filename from the URL
    filename = os.path.basename(urlparse(pdf_url).path)
    save_path = os.path.join(save_dir, filename)

    # Handle duplicate filenames
    base, extension = os.path.splitext(filename)
    counter = 1
    while os.path.exists(save_path):
        filename = f"{base}_{counter}{extension}"
        save_path = os.path.join(save_dir, filename)
        counter += 1

    # Download with progress bar
    try:
        total_size = int(response.headers.get('content-length', 0))
        with open(save_path, 'wb') as file, tqdm(
            desc=filename,
            total=total_size,
            unit='iB',
            unit_scale=True,
            unit_divisor=1024,
        ) as bar:
            for chunk in response.iter_content(chunk_size=1024):
                size = file.write(chunk)
                bar.update(size)
        print(f"Downloaded: {save_path}")
        return True
    except Exception as e:
        print(f"Error saving {filename}: {e}")
        return False

def download_all_pdfs(target_url, save_directory):
    """
    Download all PDF files from the specified URL to the save directory.
    """
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)
        print(f"Created directory: {save_directory}")

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/58.0.3029.110 Safari/537.3'
    })

    print(f"Fetching PDF links from: {target_url}")
    pdf_links = get_all_pdf_links(target_url, session)
    if not pdf_links:
        print("No PDF links found.")
        return

    print(f"Found {len(pdf_links)} PDF files. Starting download...")

    for pdf_url in pdf_links:
        download_pdf(pdf_url, save_directory, session)

    print("Download process completed.")

def upload_file(file_path, upload_url):
    """
    Upload a single file to the specified upload URL.
    """
    filename = os.path.basename(file_path)
    try:
        with open(file_path, 'rb') as f:
            files = {'file': (filename, f, 'application/pdf')}
            response = requests.post(upload_url, files=files)
            response.raise_for_status()
            print(f"Successfully uploaded: {filename}")
            return True
    except requests.exceptions.RequestException as e:
        print(f"Failed to upload {filename}: {e}")
        return False
    except Exception as e:
        print(f"Error uploading {filename}: {e}")
        return False
    
def upload_all_pdfs(upload_url, save_directory):
    """
    Upload all PDF files from the save directory to the specified upload URL.
    """
    if not os.path.exists(save_directory):
        print(f"Directory does not exist: {save_directory}")
        return
    
    pdf_files = [f for f in os.listdir(save_directory) if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        print("No PDF files found to upload.")
        return
    
    print(f"Found {len(pdf_files)} PDF files. Starting upload...")
    
    for pdf_file in pdf_files:
        file_path = os.path.join(save_directory, pdf_file)
        upload_file(file_path, upload_url)
    
    print("Upload process completed.")


if __name__ == "__main__":
    # Example usage
    TARGET_URL = "https://alzheimer.ca/bc/en/help-support/programs-services/dementia-resources-bc/print-resources"  # Replace with your target URL
    SAVE_DIR = "downloaded_pdfs"  # Replace with your desired save directory
    UPLOAD_URL = "http://195.242.13.143:8000/uploadfile/"  # Replace with your upload endpoint

    # download_all_pdfs(TARGET_URL, SAVE_DIR)

    upload_all_pdfs(UPLOAD_URL, SAVE_DIR)

