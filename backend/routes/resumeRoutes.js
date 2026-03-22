const express = require('express');
const multer = require('multer');
const fs = require('fs');
const resumeParser = require('../services/resumeParser');
const orchestrator = require('../agents/orchestrator');
const Resume = require('../models/Resume');
const User = require('../models/User'); 

const router = express.Router();
const upload = multer({ dest: './tmp/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const userId = req.body.user_id || req.query.user_id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }

    const fileBuffer = fs.readFileSync(file.path);
    let parsedText = "";
    try {
      parsedText = await resumeParser.parsePdf(fileBuffer);
    } catch (e) {
      parsedText = "Resume parsing failed. Please ask the candidate about their background.";
    }

    if (!parsedText.trim()) {
      parsedText = "Text extraction yielded empty result.";
    }

    let analysis = {};
    try {
      analysis = await orchestrator.analyzeResume(parsedText);
    } catch (e) {
      analysis = {
        skills: [], projects: [], experience: [], achievements: [], error: e.message
      };
    }

    // Save to DB
    let user = userId ? await User.findById(userId).catch(() => null) : await User.findOne();
    if (!user) {
      user = await User.create({ name: "Demo User", email: "demo@example.com" });
    }

    const newResume = new Resume({
      user_id: user._id,
      file_path: file.path,
      parsed_text: parsedText,
      skills: analysis.skills || [],
      projects: analysis.projects || [],
      experience: analysis.experience || [],
      achievements: analysis.achievements || []
    });

    await newResume.save();

    res.json({
      message: "Resume uploaded successfully",
      resume_id: newResume._id,
      analysis: analysis
    });

  } catch (error) {
    console.error(`Unhandled Error processing resume upload: ${error}`);
    res.status(500).json({ detail: `Critical Server Error: ${error.message}` });
  }
});

module.exports = router;
