const express = require('express');
const InterviewSession = require('../models/InterviewSession');
const QuestionAnswer = require('../models/QuestionAnswer');
const Feedback = require('../models/Feedback');
const Resume = require('../models/Resume');
const orchestrator = require('../agents/orchestrator');

const router = express.Router();

router.post('/start', async (req, res) => {
  try {
    const resume_id = req.query.resume_id || (req.body && req.body.resume_id);
    const user_id = req.query.user_id || (req.body && req.body.user_id);
    
    const session = new InterviewSession({
      user_id: user_id || null,
      resume_id: resume_id,
      current_round: 'technical',
      current_step: 0,
      started_at: new Date()
    });
    
    await session.save();

    const firstQuestion = "Hi, thanks for joining. Let's start with a brief introduction. Can you tell me about yourself and your background?";
    
    res.json({ session_id: session._id, question: firstQuestion });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.post('/next-question', async (req, res) => {
  try {
    const session_id = req.query.session_id || (req.body && req.body.session_id);
    const user_answer = req.body && req.body.user_answer;
    const last_question = req.body && req.body.last_question;

    const session = await InterviewSession.findById(session_id);
    if (!session) return res.status(404).json({ detail: "Session not found" });

    let resumeText = "";
    let projectsList = [];
    let expList = [];
    let achievementsList = [];

    if (session.resume_id) {
        const resume = await Resume.findById(session.resume_id);
        if (resume) {
            resumeText = resume.parsed_text || "";
            projectsList = resume.projects || [];
            expList = resume.experience || [];
            achievementsList = resume.achievements || [];
        }
    }
    
    const allItems = [...expList, ...projectsList];
    let totalItemsCount = allItems.length || 1;

    const historyDocs = await QuestionAnswer.find({ session_id }).sort({ timestamp: 1 });
    const historyList = historyDocs.map(h => ({ question: h.question, answer: h.answer }));

    const nextQData = await orchestrator.generateResponse({
      currentRound: session.current_round,
      lastQuestion: last_question,
      candidateAnswer: user_answer,
      resumeContext: resumeText,
      currentStep: session.current_step,
      interviewHistory: historyList,
      projectCount: totalItemsCount,
      items: allItems,
      hasAchievements: achievementsList.length > 0
    });

    const nextQ = nextQData.response;
    const stage = nextQData.stage;

    const qa = new QuestionAnswer({
      session_id,
      round: session.current_round,
      question: last_question,
      answer: user_answer,
      timestamp: new Date()
    });
    await qa.save();

    if ((nextQ.toLowerCase().includes("move to the hr round") || nextQ.toLowerCase().includes("hr round")) && session.current_round === "technical") {
      session.current_round = "hr";
    }

    const keywords = ["thank you for your time", "conclude our interview", "session is complete", "that wraps up our session", "all the best"];
    if (keywords.some(kw => nextQ.toLowerCase().includes(kw))) {
      session.current_round = "completed";
    }

    session.current_step += 1;
    await session.save();

    res.json({ question: nextQ, round: session.current_round, stage: stage });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.post('/end', async (req, res) => {
  try {
    const session_id = req.query.session_id || (req.body && req.body.session_id);
    
    const session = await InterviewSession.findById(session_id);
    if (!session) return res.status(404).json({ detail: "Session not found" });

    session.ended_at = new Date();
    session.current_round = "completed";
    await session.save();

    const historyDocs = await QuestionAnswer.find({ session_id }).sort({ timestamp: 1 });
    const historyData = historyDocs.map(h => ({ question: h.question, answer: h.answer, round: h.round }));

    let resumeText = "";
    if (session.resume_id) {
       const resume = await Resume.findById(session.resume_id);
       if (resume) resumeText = resume.parsed_text || "";
    }

    const feedbackText = await orchestrator.generateFeedback({ 
      history: historyData, 
      resumeContext: resumeText 
    });

    const feedback = new Feedback({
      session_id,
      final_report: feedbackText
    });
    await feedback.save();

    res.json({ message: "Interview ended", feedback: feedbackText });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
