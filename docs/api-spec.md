
# API Specification

## Auth
- `POST /auth/register`: User registration
- `POST /auth/login`: User login

## Resume
- `POST /resume/upload`: Upload PDF, parse text, analyze skills.

## Interview
- `POST /interview/start`: Start session.
- `POST /interview/next-question`: Submit answer, get next Q.
- `POST /interview/voice-input`: Handle audio blobs.
- `POST /interview/end`: End session and trigger evaluators.

## Feedback
- `GET /feedback/{session_id}`: Retrieve final report.
