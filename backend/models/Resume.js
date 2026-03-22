const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  file_path: String,
  parsed_text: String,
  skills: mongoose.Schema.Types.Mixed,
  projects: mongoose.Schema.Types.Mixed,
  experience: mongoose.Schema.Types.Mixed,
  achievements: mongoose.Schema.Types.Mixed,
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Resume', resumeSchema);
