
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFeedback } from '../services/api';

function FeedbackPage() {
    const { sessionId } = useParams();
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const data = await getFeedback(sessionId);
                setFeedback(data);
            } catch (err) {
                console.error("Error fetching feedback:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, [sessionId]);

    const ScoreBar = ({ label, score, color = "bg-cyan-500" }) => (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-300">{label}</span>
                <span className="text-sm font-bold text-white">{score}/10</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 10}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`${color} h-2.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]`}
                />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Mock data if actual feedback is pending or simple text
    const mockScores = {
        technical: 7,
        communication: 8,
        confidence: 6,
        clarity: 8
    };

    return (
        <div className="max-w-5xl mx-auto px-4 pt-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                    Interview Assessment Report
                </h1>
                <p className="text-xl text-slate-400">
                    Comprehensive analysis of your performance.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Left Panel: Analytics */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-900/80 backdrop-blur-xl border border-white/5 p-8 rounded-[32px] shadow-2xl"
                    >
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                            <span className="text-2xl">📊</span> Performance
                        </h3>

                        <ScoreBar label="Technical Depth" score={feedback?.technical_score || 7} color="bg-cyan-500" />
                        <ScoreBar label="Communication" score={feedback?.communication_score || 8} color="bg-blue-500" />
                        <ScoreBar label="Problem Solving" score={feedback?.dsa_score || 6} color="bg-indigo-500" />
                        <ScoreBar label="Confidence" score={feedback?.confidence_score || 7} color="bg-violet-500" />

                        <div className="mt-10 p-6 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                            <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2">Final Verdict</h4>
                            <div className="text-2xl font-black text-white">
                                {feedback?.verdict || "Almost Ready 🚀"}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-600 to-cyan-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-500/20"
                    >
                        <h4 className="font-black text-sm uppercase tracking-widest mb-4 opacity-80">Quick Tip</h4>
                        <p className="text-sm font-medium leading-relaxed">
                            Focus on explaining the "Why" behind your architectural choices. Industry interviewers look for trade-off analysis.
                        </p>
                    </motion.div>
                </div>

                {/* Right Panel: Detailed Report */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -z-10" />

                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <span className="text-3xl">💡</span> Coach's Analysis
                        </h3>
                        <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Session: #{sessionId}
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <div className="text-slate-300 text-base leading-[1.8] font-medium whitespace-pre-wrap">
                            {feedback?.final_report || "Evaluating performance... This may take a moment. If it doesn't appear, please check your connection."}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="text-center pb-20">
                <Link
                    to="/"
                    className="inline-flex items-center px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/10 uppercase tracking-widest text-xs"
                >
                    ← Start New Session
                </Link>
            </div>

        </div>
    );
}

export default FeedbackPage;
