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
        # 1. Parse content directly from memory first (Reliable for Vercel)
        content = await file.read()
        try:
            parsed_text = resume_parser.parse_pdf(content)
            print(f"Successfully parsed PDF. Length: {len(parsed_text)} chars")
        except Exception as parse_error:
             print(f"PDF Parse Error: {parse_error}")
             raise HTTPException(status_code=400, detail=f"PDF Parsing Failed: {str(parse_error)}")

        if not parsed_text.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from PDF. Ensure it is a valid text PDF, not an image.")

        # 2. Try to save to tmp (Optional for Vercel, mainly for DB record)
        file_path = f"/tmp/{file.filename}"
        try:
            os.makedirs("/tmp", exist_ok=True)
            with open(file_path, "wb") as f:
                f.write(content)
        except Exception as save_error:
            print(f"Warning: Could not save file to {file_path}: {save_error}")
            file_path = "memory_upload" # Fallback so DB insert doesn't fail

        # 3. Analyze resume using orchestrator/LLM
        analysis = await orchestrator.analyze_resume(parsed_text)
        
        # 4. Save to database
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
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error processing resume upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))
