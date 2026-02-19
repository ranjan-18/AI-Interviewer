# 🤖 AI Interview Buddy — Autonomous Career Coach

AI Interview Buddy is an elite, autonomous interview simulation platform designed to provide high-fidelity, production-grade technical and behavioral mock interviews. Powered by a multi-agent backend and a cinematic frontend, it offers a "Bar Raiser" level experience to candidates aiming for top-tier product companies.

---

## ✨ Features

### 🎬 Cinematic Interview HUD
*   **Expansive 1850px Canvas**: A massive, immersive interface built for clarity and impact.
*   **80/20 Focus Layout**: 80% of the screen is dedicated to your technical dialogue, ensuring zero distractions.
*   **Elite Typography**: High-readability **22px Semibold** message bubbles with distinct perspective indicators.
*   **Glassmorphic Design**: Modern, dark-mode futuristic aesthetic with subtle blurs and neon glow accents.

### 🧠 Intelligent Multi-Agent Orchestration
*   **Item-Specific Rigor**: Enforced question limits—exactly **3 questions** per work experience item and **4 questions** per project.
*   **Direct Transition Protocol**: Skips generic small talk; acknowledges your intro and pivots immediately to your technical experience.
*   **Zero-Delay Silence Detection**: A perfectly calibrated **4.0s pause window** allows for natural technical explanations without interruption.
*   **Heartbeat Mic Control**: Ensures your signal is always active when it's your turn to peak.

### 💻 Advanced Code Terminal
*   **Multi-Language Support**: Full syntax highlighting and execution simulation for **JavaScript, Python, Java, C++, C, and C#**.
*   **Integrated Problem Solving**: Seamlessly solve DSA challenges within the interview interface.
*   **Auto-Open**: Terminal automatically engages during the DSA round for a distraction-free coding experience.

### ⚖️ High-Fidelity "Bar Raiser" Evaluation
*   **Brutally Honest Reports**: Zero sugarcoating. Professional, elite-level feedback from a "Senior Staff Engineer" persona.
*   **Strict Transcript Grounding**: All feedback is 100% derived from actual interview answers. No "fake data" or hallucinations.
*   **Gap Analysis Protocol**: Detailed comparison of "What You Said" vs "The Ideal Senior Answer" for every question.
*   **Early Finish Capability**: Flexible exit option that generates a valid partial report based on the interview progress.
*   **Synthesis HUD**: Displays real-time status during the intensive report-generation phase (Synthesizing -> Finalizing).

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion.
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite.
- **AI Engine**: Advanced Multi-Agent Orchestrator (Interviewer, Technical Evaluator, HR Coach, Feedback Coach).
- **Voice**: Web Speech API (STT/TTS) with Indian/Global English calibration.

---

## 🚀 Deployment (Vercel)

This project is configured for seamless deployment on Vercel.

1.  **Push to GitHub**: Ensure your repository is up-to-date.
2.  **Import to Vercel**: Connect your GitHub repository to Vercel.
3.  **Environment Variables**: Add your `GEMINI_API_KEY` (or other LLM keys) in the Vercel Project Settings.
4.  **Deploy**: Vercel will automatically detect the configuration in `vercel.json` and build both the frontend and backend serverless functions.

---

## 🏁 Getting Started

### 1. Backend Setup
```bash
# Install dependencies
python -m pip install -r backend/requirements.txt

# Run the server
uvicorn backend.app.main:app --reload
```
API runs at: `http://127.0.0.1:8000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Development Server: `http://localhost:5173`

---

## 📂 Project Structure

```text
AI-Interview-Buddy/
├── backend/
│   ├── app/
│   │   ├── agents/      # Specialized AI personas (Orchestrator, Evaluation)
│   │   ├── models/      # SQLAlchemy database schemas
│   │   ├── prompts/     # Elite-level AI instruction logic
│   │   └── routes/      # API endpoints (Resume, Interview, Feedback)
├── frontend/
│   ├── src/
│   │   ├── pages/       # Immersive React pages (InterviewPage, FeedbackPage)
│   │   └── services/    # API integration layer
├── vercel.json          # Deployment configuration
└── api/                 # Serverless entry point
```

---

## 🔒 Security & Privacy
*   **Encrypted Signal**: Session metadata and transcripts are handled within a secure local environment.
*   **Screen Wake Lock**: Prevents your display from sleeping during critical technical rounds.

---
*Created by [Naveen](https://github.com/naveen18112003) for the next generation of engineers.*
