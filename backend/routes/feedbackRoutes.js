const express = require('express');
const Feedback = require('../models/Feedback');
const InterviewSession = require('../models/InterviewSession');

const router = express.Router();

router.get('/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;
    
    const feedback = await Feedback.findOne({ session_id });
    if (!feedback) {
      const session = await InterviewSession.findById(session_id);
      if (!session) return res.status(404).json({ detail: "Interview session not found" });
      if (!session.ended_at) return res.status(400).json({ detail: "Interview not completed yet" });
      return res.status(404).json({ detail: "Feedback not found" });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
