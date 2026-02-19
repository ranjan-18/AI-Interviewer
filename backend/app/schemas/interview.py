from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ResumeBase(BaseModel):
    user_id: int
    parsed_text: Optional[str] = None
    skills: List[str] = []
    projects: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []

class ResumeCreate(ResumeBase):
    pass

class Resume(ResumeBase):
    id: int
    file_path: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuestionAnswerCreate(BaseModel):
    session_id: int
    round: str
    question: str
    answer: str

class QuestionAnswer(QuestionAnswerCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class InterviewSessionBase(BaseModel):
    user_id: int
    resume_id: int
    current_round: str = "technical"
    current_step: int = 0

class InterviewSessionCreate(InterviewSessionBase):
    pass

class InterviewSession(InterviewSessionBase):
    id: int
    started_at: datetime
    ended_at: Optional[datetime] = None
    questions: List[QuestionAnswer] = []

    class Config:
        from_attributes = True
