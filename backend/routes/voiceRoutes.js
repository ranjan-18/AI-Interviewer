const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sttService = require('../services/sttService');
const ttsService = require('../services/ttsService');

const router = express.Router();
const upload = multer({ dest: './temp_audio/' });

router.post('/input', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    
    const filePath = req.file.path;
    const text = await sttService.transcribe(filePath);
    
    // Clean up
    fs.unlinkSync(filePath);
    
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/speak', async (req, res) => {
  try {
    const { text } = req.body; // Using body for text instead of query string to avoid URL limit
    const audioPath = await ttsService.speak(text || req.query.text);
    res.json({ audio_url: audioPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
