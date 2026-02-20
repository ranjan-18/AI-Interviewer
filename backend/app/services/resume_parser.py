import PyPDF2
from typing import Union, BinaryIO
import io

class ResumeParser:
    def parse_pdf(self, file_input: Union[str, BinaryIO, bytes]) -> str:
        text = ""
        should_close = False
        f = None
        
        try:
            if isinstance(file_input, str):
                f = open(file_input, "rb")
                should_close = True
            elif isinstance(file_input, bytes):
                f = io.BytesIO(file_input)
            else:
                f = file_input
                
            pdf_reader = PyPDF2.PdfReader(f)
            for page in pdf_reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
                    
        except Exception as e:
            print(f"Error reading PDF: {e}")
            raise e
        finally:
            if should_close and f:
                f.close()
                
        return text
