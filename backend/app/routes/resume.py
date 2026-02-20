from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import resume as resume_model
from ..services.resume_parser import ResumeParser
from ..agents.orchestrator import AgentOrchestrator
from ..schemas import interview as interview_schema
import os
import shutil
import uuid
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
resume_parser = ResumeParser()
orchestrator = AgentOrchestrator()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...), 
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Received upload request for file: {file.filename}")
        
        # 1. Parse content directly from memory first (Reliable for Vercel)
        content = await file.read()
        logger.info(f"File read into memory. Size: {len(content)} bytes")
        
        parsed_text = ""
        try:
            parsed_text = resume_parser.parse_pdf(content)
            logger.info(f"Successfully parsed PDF. Length: {len(parsed_text)} chars")
        except Exception as parse_error:
             logger.error(f"PDF Parse Error: {parse_error}")
             # We will continue even if parse fails, with empty text, to see if we can at least get a response
             parsed_text = "Resume parsing failed. Please ask the candidate about their background."

        if not parsed_text.strip():
             parsed_text = "Text extraction yielded empty result."

        # 2. Try to save to tmp (Optional for Vercel, mainly for DB record)
        file_path = f"/tmp/{file.filename}"
        try:
            os.makedirs("/tmp", exist_ok=True)
            with open(file_path, "wb") as f:
                f.write(content)
        except Exception as save_error:
            logger.warning(f"Warning: Could not save file to {file_path}: {save_error}")
            file_path = "memory_upload_" + str(uuid.uuid4())

        # 3. Analyze resume using orchestrator/LLM
        analysis = {}
        try:
            analysis = await orchestrator.analyze_resume(parsed_text)
            logger.info("Resume analysis completed successfully")
        except Exception as ai_error:
            logger.error(f"AI Analysis Failed: {ai_error}")
            # FALBACK: Return success minimal structure even if AI fails
            analysis = {
                "skills": [],
                "projects": [],
                "experience": [],
                "achievements": [],
                "error": str(ai_error)
            }
        
        # 4. Save to database
        db_resume = None
        try:
            db_resume = resume_model.Resume(
                user_id=user_id,
                file_path=file_path,
                parsed_text=parsed_text,
                skills=analysis.get("skills", []),
                projects=analysis.get("projects", []),
                experience=analysis.get("experience", []),
                achievements=analysis.get("achievements", []),
            )
            db.add(db_resume)
            db.commit()
            db.refresh(db_resume)
            logger.info(f"Saved resume to DB with ID: {db_resume.id}")
            return {"message": "Resume uploaded successfully", "resume_id": db_resume.id, "analysis": analysis}
            
        except Exception as db_error:
            logger.error(f"Database Error: {db_error}")
            # SUPER SAFE MODE: Return success even if DB fails
            # This allows the frontend to proceed to 'interview setup' potentially using local state
            # Note: The interview system might fail later if it relies on DB resume_id
            return {
                "message": "Resume processed (DB Save Failed)", 
                "resume_id": 999999, # Dummy ID
                "analysis": analysis,
                "warning": f"Database save failed: {str(db_error)}" 
            }

    except Exception as e:
        logger.critical(f"Unhandled Error processing resume upload: {e}")
        # Even catch-all returns a 200 format error if possible to debug in frontend
        raise HTTPException(status_code=500, detail=f"Critical Server Error: {str(e)}")
