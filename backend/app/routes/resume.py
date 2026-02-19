from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import resume as resume_model
from ..services.resume_parser import ResumeParser
from ..agents.orchestrator import AgentOrchestrator
from ..schemas import interview as interview_schema
import os
import shutil

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
        # Use /tmp for serverless environments (Vercel)
        upload_dir = "/tmp/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Parse resume
        try:
            parsed_text = resume_parser.parse_pdf(file_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse resume: {e}")

        # Analyze resume using orchestrator/LLM
        analysis = await orchestrator.analyze_resume(parsed_text)
        
        # Save to database
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

        return {"message": "Resume uploaded successfully", "resume_id": db_resume.id, "analysis": analysis}
    except Exception as e:
        # Log to file for production debugging if needed, or rely on FastAPI logging
        print(f"Error processing resume upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))
