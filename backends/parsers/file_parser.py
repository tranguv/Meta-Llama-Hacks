from abc import ABC, abstractmethod
import logging
import fitz
import io
import os
from typing import Type, Dict
from pdf2image import convert_from_path
from pytesseract import image_to_string


# Base parser interface
class BaseParser(ABC):
    @abstractmethod
    def parse(self, filepath: str) -> dict:
        # abstract method to be implemented by subclasses
        pass


# Concrete parser class for text files
class TxtParser(BaseParser):
    def parse(self, filepath: str) -> str:
        try:
            with open(filepath, "r") as file:
                return file.read()
        except Exception as e:
            logging.error(f"Error while parsing file: {e}")
            return None



# Concrete parser class for PDF files
class PdfParser(BaseParser):
    # Helper Functions
    def extract_text_with_pymupdf(self,file_path: str) -> str:
        """Extract text from a PDF using PyMuPDF."""
        try:
            text = ""
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
            return text.strip()
        except Exception as e:
            logging.error(f"Error parsing PDF with PyMuPDF: {e}")
            return None

    def extract_text_with_ocr(self,file_path: str) -> str:
        """Extract text from a PDF using OCR as a fallback."""
        try:
            images = convert_from_path(file_path)
            ocr_text = ""
            for image in images:
                ocr_text += image_to_string(image)
            return ocr_text.strip()
        except Exception as e:
            logging.error(f"Error during OCR processing: {e}")
            return None

    def parse(self,file_path: str) -> str:
        """Try extracting text from a PDF, fallback to OCR if necessary."""
        logging.info(f"Attempting to parse PDF: {file_path}")
        text = self.extract_text_with_pymupdf(file_path)
        if text:
            return text

        logging.warning(f"Primary text extraction failed for {file_path}, attempting OCR")
        text = self.extract_text_with_ocr(file_path)
        if text:
            return text

        logging.error(f"Failed to extract text from {file_path} using both primary and OCR methods")
        return None

 


# Parser factory class
class ParserFactory:
    _parsers: Dict[str, Type[BaseParser]] = {}

    @classmethod
    def register_parser(cls, extension: str, parser: Type[BaseParser]):
        cls._parsers[extension] = parser

    @classmethod
    def get_parser(cls, extension: str) -> Type[BaseParser]:
        parser = cls._parsers.get(extension)
        if not parser:
            raise ValueError(f"No parser registered for extension:{extension}")
        return parser()


# Register parsers for different file extensions
ParserFactory.register_parser("txt", TxtParser)
ParserFactory.register_parser("pdf", PdfParser)


# FileParser class to parse files based on their extension
class FileParser:
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.parser = self._get_parser()

    def _get_parser(self) -> BaseParser:
        extension = self.filepath.split(".")[-1]
        if extension not in ParserFactory._parsers:
            raise ValueError(f"No parser registered for extension:{extension}")
        return ParserFactory.get_parser(extension)

    def parse(self) -> str:
        if not os.path.exists(self.filepath):
            raise FileNotFoundError(f"File not found: {self.filepath}")
        return self.parser.parse(self.filepath)
