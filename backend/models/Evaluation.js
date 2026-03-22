const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' },
  technical_scores: mongoose.Schema.Types.Mixed,
  hr_scores: mongoose.Schema.Types.Mixed,
  strengths: mongoose.Schema.Types.Mixed,
  weaknesses: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
