from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class EvaluationCreate(BaseModel):
    session_id: int
    technical_scores: Dict[str, Any]
    hr_scores: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]

class Evaluation(EvaluationCreate):
    id: int
    
    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    session_id: int
    final_report: str

class Feedback(FeedbackCreate):
    id: int
    created_at: Any
    
    class Config:
        from_attributes = True
