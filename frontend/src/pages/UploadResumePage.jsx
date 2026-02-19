
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadResume } from '../services/api';

function UploadResumePage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
            setError('');
        } else {
            setError('Please upload a PDF file.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const result = await uploadResume(file);
            // Realistic AI Processing Simulation
            setTimeout(() => {
                navigate(`/interview/${result.resume_id}`);
            }, 2500);
        } catch (err) {
            setError('Failed to upload resume. Please try again.');
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center relative overflow-hidden pt-32 container mx-auto px-6">

            {/* Background Decos to match Landing */}
            <div className="absolute inset-0 dots-pattern opacity-10" />
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-3xl glass-card rounded-[48px] p-16 relative overflow-hidden group shadow-[0_0_80px_rgba(37,99,235,0.1)] z-10"
            >
                {/* Scanning Laser Animation */}
                {uploading && (
                    <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                    />
                )}

                <div className="text-center relative z-10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-8"
                    >
                        Step 1: Resume Analysis
                    </motion.div>

                    <h2 className="text-5xl font-[900] tracking-tighter text-white mb-6">
                        Ready for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Mock Interview?</span>
                    </h2>
                    <p className="text-slate-400 text-xl mb-12 max-w-lg mx-auto leading-relaxed">
                        Upload your resume and let our specialized agents design a custom session for you.
                    </p>

                    <div className="relative group/zone">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                            disabled={uploading}
                        />
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-slate-950/50 border-2 border-dashed border-white/10 rounded-[40px] p-20 transition-all group-hover/zone:border-cyan-500/50 group-hover/zone:bg-cyan-500/5 shadow-inner"
                        >
                            <div className="text-7xl mb-8 group-hover/zone:scale-110 transition-transform duration-500">
                                {file ? "📑" : "📥"}
                            </div>
                            {file ? (
                                <div className="space-y-2">
                                    <span className="text-cyan-400 text-2xl font-black block truncate px-6 leading-tight">{file.name}</span>
                                    <span className="text-slate-500 font-medium">Click to replace file</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <span className="text-white text-2xl font-[800] block">Drag & Drop Resume</span>
                                    <span className="text-slate-500 font-medium">Standard PDF format preferred</span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-rose-400 font-bold mt-8 p-4 bg-rose-400/10 rounded-2xl border border-rose-400/20"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={`mt-12 w-full py-6 rounded-3xl text-2xl font-[900] transition-all relative overflow-hidden
              ${!file || uploading
                                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5'
                                : 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-[0_0_50px_rgba(37,99,235,0.4)] hover:shadow-[0_0_70px_rgba(37,99,235,0.6)]'
                            }`}
                    >
                        {uploading ? (
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                <span>AI Agents Analyzing...</span>
                            </div>
                        ) : "Start Interview Preparation"}
                    </motion.button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] -z-10 rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] -z-10 rounded-full" />
            </motion.div>

            {/* Visual hints matching Landing */}
            <div className="absolute bottom-10 left-10 opacity-20 hidden md:block group">
                <div className="text-4xl font-mono text-white/50">&lt;/&gt;</div>
            </div>
        </div>
    );
}

export default UploadResumePage;
