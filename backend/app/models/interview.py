from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

import enum

class RoundType(str, enum.Enum):
    TECHNICAL = "technical"
    HR = "hr"
    COMPLETED = "completed"

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    current_round = Column(String, default="technical") # "technical" or "hr" or "completed"
    current_step = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", backref="interviews")
    resume = relationship("Resume", back_populates="interviews")
    questions = relationship("QuestionAnswer", back_populates="session")
    evaluation = relationship("Evaluation", back_populates="session", uselist=False)
    feedback = relationship("Feedback", back_populates="session", uselist=False)
