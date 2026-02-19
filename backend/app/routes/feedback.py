from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import feedback as feedback_model
from ..schemas import feedback as feedback_schema
from ..models import interview as interview_model

router = APIRouter()

@router.get("/{session_id}", response_model=feedback_schema.Feedback)
async def get_feedback(
    session_id: int, 
    db: Session = Depends(get_db)
):
    feedback = db.query(feedback_model.Feedback).filter(feedback_model.Feedback.session_id == session_id).first()
    if not feedback:
        # Check if session exists and is completed
        session = db.query(interview_model.InterviewSession).filter(interview_model.InterviewSession.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found")
        if not session.ended_at:
             raise HTTPException(status_code=400, detail="Interview not completed yet")
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback
