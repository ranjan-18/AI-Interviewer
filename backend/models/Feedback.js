const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' },
  final_report: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Feedback', feedbackSchema);
