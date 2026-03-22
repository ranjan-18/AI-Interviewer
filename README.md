# 🤖 AI Interview Buddy

**Live Demo**: [Add your Vercel link here]  
**Backend**: https://ai-interviewer-1-fy3m.onrender.com

---

## What I Built

A fully voice-driven, AI-powered mock interview platform that conducts end-to-end technical interviews personalized to YOUR resume.

**Topic**: Technical job interviews — the most high-stakes, anxiety-inducing skill most engineers never practice properly.

## Why This Topic?

Most interview prep tools give you generic LeetCode lists or static flashcards. I wanted to build something that actually simulates the **real human dynamics** of a technical interview — an AI that asks you about YOUR specific projects, follows up intelligently, switches from technical to DSA to HR rounds, and then gives you a brutally honest performance report.

## How It Works

1. **Upload your PDF resume** → AI parses and structures your experience, projects, skills
2. **Live voice interview** → AI interviewer asks project-specific questions, DSA problems, and HR questions based on your background
3. **Performance report** → Detailed feedback with scores on technical depth, communication, and problem-solving

## Features

- 🎤 **Voice-driven conversation** — speak naturally, no typing
- 📄 **Resume-grounded questions** — every question based on YOUR specific resume
- 🧠 **Multi-stage interview** — Resume Deep Dive → DSA → HR Round
- 💻 **Code Terminal** — in-browser code editor for DSA problems
- 📊 **AI Performance Report** — detailed feedback after every session
- 🔒 **Encrypted Signal UI** — premium, immersive interview environment

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TailwindCSS + Framer Motion |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| AI | GitHub Models (GPT-4o via Azure) |
| Resume Parsing | pdf-parse |
| Voice | Web Speech API (browser-native) |
| Deployment | Vercel (frontend) + Render (backend) |

## Running Locally

```bash
# Clone the repo
git clone https://github.com/ranjan-18/AI-Interviewer.git

# Backend
cd backend
npm install
# Create .env with MONGODB_URI and GITHUB_MODELS_API_KEY
node server.js

# Frontend
cd ../frontend
npm install
npm run dev
```

## Built By

**Ranjan Kumar** — Built for the Thinkly Labs Software Engineering assignment.
