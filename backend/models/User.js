const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, index: true },
  email: { type: String, unique: true, index: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('User', userSchema);
