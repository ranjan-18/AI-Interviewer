
# AI Interview Buddy - Architecture

## System Overview
AI Interview Buddy is a voice-controlled mock interview platform that uses specialized agents to simulate a realistic interview experience.

## Components
1. **Frontend**: Next.js (or React) with Framer Motion for aesthetics.
2. **Backend**: FastAPI with SQLAlchemy.
3. **AI Agents**: Orchestrated multi-agent system using GitHub Models (GPT-4o).
    - **Resume Analyzer**: Plans the interview.
    - **Interviewer**: Interaction logic.
    - **Follow-up**: Deep-dive probing.
    - **Evaluators**: Scoring tools.
    - **Feedback Coach**: Report generation.

## Flow
1. User uploads Resume.
2. Resume Analyzer parses and creates plan.
3. Interview starts (Technical Round).
4. Audio input -> STT -> LLM Orchestrator.
5. Answer evaluation -> Follow-up/Next Q.
6. Switch to HR Round.
7. End -> Multi-agent evaluation -> Feedback report.
