const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' },
  round: String,
  question: String,
  answer: String,
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

module.exports = mongoose.model('QuestionAnswer', questionAnswerSchema);
