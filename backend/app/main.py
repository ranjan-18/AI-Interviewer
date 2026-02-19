import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import user, resume, interview, question, feedback
from .routes import resume as resume_route, interview as interview_route, feedback as feedback_route, voice as voice_route

Base.metadata.create_all(bind=engine)

# If running on Vercel, default root_path to /api to match rewrites
ROOT_PATH = os.getenv("ROOT_PATH", "/api" if os.getenv("VERCEL") else "")

app = FastAPI(title="AI Interview Buddy API", version="1.0.0", debug=True, root_path=ROOT_PATH)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_route.router, prefix="/resume", tags=["Resume"])
app.include_router(interview_route.router, prefix="/interview", tags=["Interview"])
app.include_router(feedback_route.router, prefix="/feedback", tags=["Feedback"])
app.include_router(voice_route.router, prefix="/voice", tags=["Voice"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Interview Buddy API"}
