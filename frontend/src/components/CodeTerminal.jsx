
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CodeTerminal = ({ isOpen, onClose, problemStatement, onCodeSubmit }) => {
    const [code, setCode] = useState('// Write your solution here...\n');

    useEffect(() => {
        if (isOpen) {
            setCode('// Write your solution here...\n');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        onCodeSubmit(code);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                >
                    <div className="w-full max-w-4xl bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-4 text-xs font-mono text-cyan-400">TERMINAL_V1.0</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                            {/* Problem Statement */}
                            <div className="md:w-1/3 p-6 border-r border-cyan-500/10 overflow-y-auto bg-slate-900/30">
                                <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4">Problem Statement</h3>
                                <p className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                                    {problemStatement || "Waiting for problem statement..."}
                                </p>
                            </div>

                            {/* Editor Area */}
                            <div className="md:w-2/3 flex flex-col bg-[#020617]">
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="flex-grow w-full p-4 bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none placeholder-slate-700 custom-scrollbar"
                                    spellCheck="false"
                                />
                                <div className="p-4 border-t border-cyan-500/20 flex justify-end gap-4 bg-slate-900/30">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-8 py-2 bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                    >
                                        Submit Solution
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CodeTerminal;
