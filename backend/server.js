const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express application
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/voice', require('./routes/voiceRoutes'));

app.get('/api/', (req, res) => {
  res.json({ message: 'Welcome to AI Interview Buddy API (Node.js)' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AI Interview Buddy API (Node.js)' });
});

// For Vercel Serverless Functions
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
