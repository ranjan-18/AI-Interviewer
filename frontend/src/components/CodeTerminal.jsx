import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CodeTerminal = ({ isOpen, onClose, problemStatement, onCodeSubmit }) => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [timeLeft, setTimeLeft] = useState(480); // 8 minutes
    const timerRef = useRef(null);

    const templates = {
        javascript: `// Write your solution here\n\nfunction solve(input) {\n  // Code here\n  return input;\n}`,
        python: `# Write your solution here\n\ndef solve(input):\n    # Code here\n    return input`,
        java: `// Write your solution here\n\nclass Solution {\n    public int solve(int input) {\n        // Code here\n        return input;\n    }\n}`,
        cpp: `// Write your solution here\n\nclass Solution {\npublic:\n    int solve(int input) {\n        // Code here\n        return input;\n    }\n};`,
        c: `// Write your solution here\n\nint solve(int input) {\n    // Code here\n    return input;\n}`,
        csharp: `// Write your solution here\n\npublic class Solution {\n    public int Solve(int input) {\n        // Code here\n        return input;\n    }\n}`
    };

    useEffect(() => {
        if (isOpen) {
            setCode(templates[language] || '');
            setTimeLeft(480);
            setOutput('');
            // ... (rest of useEffect remains same) ...
        } else {
            // ...
        }
        // ...
    }, [isOpen, language]);

    // ...

    <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-[#2d2d2d] text-cyan-400 text-xs font-mono focus:outline-none cursor-pointer border border-gray-600 rounded px-2 py-1"
    >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="csharp">C#</option>
    </select>

    useEffect(() => {
        if (isOpen) {
            setCode(templates[language] || '');
            setTimeLeft(480);
            setOutput('');
            // ... (rest of useEffect remains same) ...
        } else {
            // ...
        }
        // ...
    }, [isOpen, language]);

    // ...

    <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-[#2d2d2d] text-cyan-400 text-xs font-mono focus:outline-none cursor-pointer border border-gray-600 rounded px-2 py-1"
    >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="csharp">C#</option>
    </select>

    useEffect(() => {
        if (isOpen) {
            setCode(templates[language] || '');
            setTimeLeft(480);
            setOutput('');

            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmit(); // Auto-submit
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isOpen, language]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleRun = () => {
        setOutput('Creating sandbox environment...\nRunning test cases...\n\n> Test Case 1: Passed\n> Test Case 2: Passed\n> Test Case 3: Passed\n\nExecution Time: 0.04s');
    };

    const handleSubmit = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        onCodeSubmit(code);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 text-sans pt-20"
            >
                <div className="w-full max-w-7xl h-[90vh] bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-700 flex flex-col md:flex-row overflow-hidden relative">

                    {/* Problem Statement Panel */}
                    <div className="w-full md:w-1/3 bg-[#252526] flex flex-col border-r border-gray-700">
                        <div className="p-4 border-b border-gray-700 bg-[#2d2d2d] flex justify-between items-center">
                            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                                <span className="text-green-500">⚡</span> Problem Description
                            </h3>
                            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] uppercase font-bold tracking-wider rounded border border-yellow-500/20">Medium</span>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                            <div className="prose prose-invert prose-sm max-w-none">
                                <p className="whitespace-pre-wrap leading-relaxed text-sm text-gray-300">
                                    {problemStatement || "Listen to the interviewer for the problem statement..."}
                                </p>

                                <div className="mt-6 p-4 bg-black/40 rounded-lg border border-white/5">
                                    <h5 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-3">Example Case</h5>
                                    <code className="text-xs font-mono text-green-400 block">
                                        Input: nums = [2,7,11,15], target = 9<br />
                                        Output: [0,1]
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Code Editor Panel */}
                    <div className="w-full md:w-2/3 flex flex-col bg-[#1e1e1e] relative">
                        {/* Toolbar */}
                        <div className="h-12 bg-[#2d2d2d] flex items-center px-4 justify-between border-b border-black/50 select-none">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Language:</span>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="bg-[#2d2d2d] text-white text-xs font-mono focus:outline-none cursor-pointer border border-gray-600 rounded px-2 py-1 shadow-lg"
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="c">C</option>
                                        <option value="csharp">C#</option>
                                    </select>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded border ${timeLeft < 60 ? 'bg-red-900/20 border-red-500/30' : 'bg-black/20 border-white/5'}`}>
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Time Left:</span>
                                    <span className={`text-xs font-mono font-bold ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-grow relative">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm p-6 resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-blue-500/30"
                                spellCheck="false"
                                placeholder="// Start coding here..."
                            />
                        </div>

                        {/* Output Terminal */}
                        <div className="h-48 bg-[#0f0f0f] border-t border-gray-700 flex flex-col">
                            <div className="flex justify-between items-center px-4 py-2 bg-[#181818] border-b border-white/5">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                                    <span>_</span> Console Output
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={handleRun} className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-all hover:shadow-lg">
                                        Run
                                    </button>
                                    <button onClick={handleSubmit} className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_20px_rgba(22,163,74,0.5)]">
                                        Submit
                                    </button>
                                </div>
                            </div>
                            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar font-mono text-xs">
                                <pre className={`${output ? 'text-green-400/90' : 'text-gray-600'} whitespace-pre-wrap`}>
                                    {output || "// Output will appear here after running your code..."}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CodeTerminal;
