const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resume_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  current_round: { type: String, default: 'technical' }, // 'technical' | 'hr' | 'completed'
  current_step: { type: Number, default: 0 },
  ended_at: { type: Date, default: null }
}, { timestamps: { createdAt: 'started_at', updatedAt: false } });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
