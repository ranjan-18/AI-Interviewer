from fastapi import APIRouter, File, UploadFile, Depends
from ..services.stt_service import STTService
from ..services.tts_service import TTSService
import shutil
import os

router = APIRouter()
stt_service = STTService()
tts_service = TTSService()

@router.post("/input")
async def voice_input(file: UploadFile = File(...)):
    # Save Uploaded Audio
    os.makedirs("./temp_audio", exist_ok=True)
    file_path = f"./temp_audio/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Transcribe
    text = await stt_service.transcribe(file_path)
    
    # Clean up
    os.remove(file_path)
    
    return {"text": text}

@router.post("/speak")
async def text_to_speech(text: str):
    audio_path = await tts_service.speak(text)
    return {"audio_url": audio_path}
