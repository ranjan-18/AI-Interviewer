from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import interview as interview_model
from ..models import question as question_model
from ..models import feedback as feedback_model
from ..agents.orchestrator import AgentOrchestrator
from ..schemas import interview as interview_schema
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
orchestrator = AgentOrchestrator()

@router.post("/start")
async def start_interview(
    resume_id: int, 
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    # Create interview session
    session = interview_model.InterviewSession(
        user_id=user_id,
        resume_id=resume_id,
        current_round="technical",
        current_step=0,
        started_at=datetime.utcnow()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # Shortened professional greeting
    first_question = (
        "Hi, thanks for joining. Let's start with a brief introduction. "
        "Can you tell me about yourself and your background?"
    )
    
    logger.info(f"Started session {session.id} for resume {resume_id}")
    return {"session_id": session.id, "question": first_question}

@router.post("/next-question")
async def next_question(
    session_id: int = Query(...), 
    user_answer: str = Body(..., embed=True),
    last_question: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    logger.info(f"Received answer for session {session_id}")
    session = db.query(interview_model.InterviewSession).filter(interview_model.InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Get Resume Context
    resume = session.resume
    resume_text = resume.parsed_text if resume else ""
    projects_list = resume.projects if resume and resume.projects else []
    exp_list = resume.experience if resume and resume.experience else []
    achievements_list = resume.achievements if resume and resume.achievements else []
    
    # Comprehensive coverage: Experience -> Projects (Achievements treated separately at end)
    all_items = exp_list + projects_list
    total_items_count = len(all_items)
    if total_items_count == 0: total_items_count = 1 

    # Get Interview History
    history = db.query(question_model.QuestionAnswer).filter(question_model.QuestionAnswer.session_id == session_id).all()
    history_list = [{"question": h.question, "answer": h.answer} for h in history]

    next_q_data = await orchestrator.generate_response(
        current_round=session.current_round,
        last_question=last_question,
        candidate_answer=user_answer,
        resume_context=resume_text,
        current_step=session.current_step,
        interview_history=history_list,
        project_count=total_items_count,
        items=all_items,
        has_achievements=len(achievements_list) > 0
    )
    
    next_q = next_q_data["response"]
    stage = next_q_data["stage"]
    
    qa = question_model.QuestionAnswer(
        session_id=session_id,
        round=session.current_round,
        question=last_question,
        answer=user_answer,
        timestamp=datetime.utcnow()
    )
    db.add(qa)
    
    if "move to the HR round" in next_q.lower() or "hr round" in next_q.lower() and session.current_round == "technical":
        session.current_round = "hr"
    
    # Check for technical session wrap-up or explicit conclusion
    if any(kw in next_q.lower() for kw in ["thank you for your time", "conclude our interview", "session is complete", "that wraps up our session", "all the best"]):
        session.current_round = "completed"
    
    session.current_step += 1
    db.commit()

    return {"question": next_q, "round": session.current_round, "stage": stage}

@router.post("/end")
async def end_interview(
    session_id: int,
    db: Session = Depends(get_db)
):
    session = db.query(interview_model.InterviewSession).filter(interview_model.InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session.ended_at = datetime.utcnow()
    session.current_round = "completed"
    db.commit()
    
    # Fetch full history for feedback
    history = db.query(question_model.QuestionAnswer).filter(question_model.QuestionAnswer.session_id == session_id).all()
    history_data = [
        {"question": h.question, "answer": h.answer, "round": h.round} 
        for h in history
    ]
    
    # Get Resume Context
    resume_text = session.resume.parsed_text if session.resume else ""
    
    # Trigger Feedback Generation
    feedback_text = await orchestrator.generate_feedback({"session_id": session_id, "history": history_data, "resume_context": resume_text})
    
    # Save feedback
    feedback = feedback_model.Feedback(
        session_id=session_id,
        final_report=feedback_text
    )
    db.add(feedback)
    db.commit()
    
    return {"message": "Interview ended", "feedback": feedback_text}
