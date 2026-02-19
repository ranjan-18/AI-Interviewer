
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadResumePage from './pages/UploadResumePage';
import InterviewPage from './pages/InterviewPage';
import FeedbackPage from './pages/FeedbackPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <main className="flex-grow pb-12 relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadResumePage />} />
            <Route path="/interview/:resumeId" element={<InterviewPage />} />
            <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
          </Routes>
        </main>

        {/* Background Gradients/Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full" />
        </div>
      </div>
    </Router>
  );
}

export default App;
