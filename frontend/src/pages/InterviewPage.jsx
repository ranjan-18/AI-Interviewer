
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { startInterview, nextQuestion, endInterview } from '../services/api';

function InterviewPage() {
    const { resumeId } = useParams();
    const navigate = useNavigate();

    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [isUserTurn, setIsUserTurn] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [transcript, setTranscript] = useState([]);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [volume, setVolume] = useState(0);

    const recognitionRef = useRef(null);
    const finalTranscriptRef = useRef('');
    const silenceTimerRef = useRef(null);
    const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
    const audioContextRef = useRef(null);
    const analyzerRef = useRef(null);
    const streamRef = useRef(null);
    const animationFrameRef = useRef(null);
    const scrollRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let interim = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscriptRef.current += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }
                setInterimTranscript(interim);

                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = setTimeout(() => {
                    const speechSoFar = (finalTranscriptRef.current + interim).trim();
                    if (speechSoFar.length > 5) {
                        recognition.stop();
                    }
                }, 4000);
            };

            recognition.onend = () => {
                setIsListening(false);
                const finalSpeech = finalTranscriptRef.current.trim();
                if (finalSpeech && isUserTurn) {
                    processUserAnswer(finalSpeech);
                    finalTranscriptRef.current = '';
                    setInterimTranscript('');
                }
            };
            recognitionRef.current = recognition;
        }

        return () => {
            if (audioContextRef.current) audioContextRef.current.close();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (recognitionRef.current) recognitionRef.current.abort();
            window.speechSynthesis.cancel();
        };
    }, [isUserTurn]);

    // Screen Wake Lock API
    useEffect(() => {
        let wakeLock = null;
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            } catch (err) {
                console.error(`Wake Lock error: ${err.message}`);
            }
        };

        requestWakeLock();

        const handleVisibilityChange = async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            wakeLock?.release().then(() => { wakeLock = null; });
        };
    }, []);

    const setupVisualizer = async () => {
        try {
            if (!audioContextRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyzer = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyzer);
                analyzer.fftSize = 64;
                audioContextRef.current = audioContext;
                analyzerRef.current = analyzer;

                const bufferLength = analyzer.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                const updateVolume = () => {
                    analyzer.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
                    setVolume(sum / bufferLength);
                    animationFrameRef.current = requestAnimationFrame(updateVolume);
                };
                updateVolume();
            }
        } catch (err) {
            console.error("Visualizer setup failed:", err);
        }
    };

    useEffect(() => {
        if (!sessionId && resumeId) {
            const init = async () => {
                try {
                    const data = await startInterview(resumeId);
                    setSessionId(data.session_id);
                    setCurrentQuestion(data.question);
                    setTranscript([{ sender: 'AI', text: data.question }]);

                    // Manual Start: User will click the initiate button
                } catch (err) {
                    console.error("Session init failed:", err);
                }
            };
            init();
        }
    }, [resumeId, sessionId]);

    // Ensure voices are loaded
    useEffect(() => {
        const loadVoices = () => window.speechSynthesis.getVoices();
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    // HEARTBEAT: Ensure microphone stays active when it's the user's turn
    useEffect(() => {
        const heartbeat = setInterval(() => {
            if (!isInitializing && isUserTurn && !isListening && !isAISpeaking && !isProcessing) {
                startListening();
            }
        }, 1500);
        return () => clearInterval(heartbeat);
    }, [isInitializing, isUserTurn, isListening, isAISpeaking, isProcessing]);

    const playAIResponse = (text) => {
        if (!text) return;
        setIsAISpeaking(true);
        setIsProcessing(false);
        setIsUserTurn(false);

        window.speechSynthesis.cancel();
        const spokenText = text.replace(/[*#_]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(spokenText);

        let voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.includes('en-GB')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
            setIsAISpeaking(false);
            setIsUserTurn(true);
            startListening();
        };
        window.speechSynthesis.speak(utterance);
    };

    const startListening = async () => {
        if (isAISpeaking || isProcessing || isListening || !isUserTurn) return;
        try {
            await setupVisualizer();
            if (recognitionRef.current) recognitionRef.current.start();
            setIsListening(true);
        } catch (err) {
            console.error("Start listening failed:", err);
        }
    };

    const processUserAnswer = async (text) => {
        if (!text || isProcessing || !sessionId) return;
        setIsProcessing(true);
        setIsUserTurn(false);
        setTranscript(prev => [...prev, { sender: 'User', text }]);

        try {
            const data = await nextQuestion(sessionId, text, currentQuestion);
            if (data.question) {
                setCurrentQuestion(data.question);
                setTranscript(prev => [...prev, { sender: 'AI', text: data.question }]);
                playAIResponse(data.question);

                if (data.round === 'completed') {
                    setIsInterviewCompleted(true);
                }
            }
        } catch (err) {
            console.error("Next question failed:", err);
            setIsProcessing(false);
            setIsUserTurn(true);
        }
    };

    const manualToggleMic = () => {
        if (isListening) recognitionRef.current?.stop();
        else { setIsUserTurn(true); startListening(); }
    };

    const [endSessionStage, setEndSessionStage] = useState('');

    const handleEndInterview = async () => {
        if (window.confirm("End session and generate high-fidelity technical report?")) {
            setIsProcessing(true);
            setEndSessionStage('synthesizing');
            try {
                await endInterview(sessionId);
                setEndSessionStage('finalizing');
                navigate(`/feedback/${sessionId}`);
            } catch (err) {
                setIsProcessing(false);
                setEndSessionStage('');
            }
        }
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [transcript, interimTranscript]);

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans antialiased overflow-hidden">

            <AnimatePresence>
                {isInitializing && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden"
                    >
                        {/* Mesh and Grid */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute inset-0 mesh-gradient" />
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                        </div>

                        <div className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-12 relative"
                            >
                                <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full animate-pulse" />
                                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="Bot" className="w-24 h-24 relative z-10" />
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-black mb-6 italic tracking-tight">READY TO BEGIN?</h1>
                            <p className="text-slate-400 text-xs uppercase tracking-[0.5em] mb-12">Calibrating Secure Interview Environment</p>

                            <div className="flex flex-col items-center gap-12 w-full mt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4">
                                    <div className="glass-panel p-8 rounded-[36px] border-white/5 bg-slate-900/40 text-left shadow-2xl backdrop-blur-3xl">
                                        <h3 className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-6">The Protocol</h3>
                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest"><span>🛡️</span> Technical Deep-Dive (~25 Min)</li>
                                            <li className="flex items-center gap-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest"><span>💻</span> DSA & Logic Round (~25 Min)</li>
                                            <li className="flex items-center gap-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest"><span>💼</span> HR & Culture Fit (~10 Min)</li>
                                        </ul>
                                    </div>
                                    <div className="glass-panel p-8 rounded-[36px] border-white/5 bg-slate-900/40 text-left shadow-2xl backdrop-blur-3xl">
                                        <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Environment Status</h3>
                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest"><span>🎤</span> Voice Capturing Enabled</li>
                                            <li className="flex items-center gap-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest"><span>🧠</span> AI Persona Calibrated</li>
                                            <li className="flex items-center gap-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest"><span>🔒</span> Session Encrypted</li>
                                        </ul>
                                    </div>
                                </div>

                                {sessionId ? (
                                    <button
                                        onClick={() => { setIsInitializing(false); playAIResponse(currentQuestion); }}
                                        className="px-16 py-6 bg-white text-slate-950 font-black rounded-full uppercase tracking-[0.3em] text-sm hover:scale-105 active:scale-95 transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                    >
                                        Initiate Session
                                    </button>
                                ) : (
                                    <div className="flex flex-col items-center gap-5">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <p className="text-cyan-400 text-[11px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Secure Uplink...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`flex flex-col h-screen p-6 md:p-12 pt-24 md:pt-28 max-w-[1850px] mx-auto w-full transition-opacity duration-1000 ${isInitializing ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                {/* Header */}
                <header className="flex justify-between items-center mb-10 glass-panel p-8 rounded-[40px] border-white/5 bg-slate-900/40 shadow-2xl">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black italic tracking-tighter">ENCRYPTED SIGNAL</h2>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'bg-slate-600'}`} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isListening ? 'Link Active' : 'Channel Secured'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal Integrity</span>
                            <span className="text-[10px] font-mono text-cyan-500">99.8% Optimized</span>
                        </div>
                        <button onClick={handleEndInterview} className="px-8 py-3 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black tracking-[0.2em] border border-red-500/20 uppercase transition-all hover:bg-red-500 hover:text-white">End Session</button>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-8 flex-grow overflow-hidden mb-6">
                    {/* Visualizer Panel */}
                    <div className="lg:w-[20%] glass-panel rounded-[56px] border-white/5 bg-slate-900/40 flex flex-col items-center justify-center relative p-8 shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-30 pointer-events-none" />

                        <div className={`w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center glass-panel border-white/10 ${isAISpeaking ? 'border-cyan-500/30' : ''} relative shadow-2xl`}>
                            {isListening && (
                                <div className="absolute inset-[-25px] rounded-full border border-cyan-500/10 flex items-center justify-center gap-1.5">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className="w-1.5 bg-cyan-500 opacity-30 rounded-full" style={{ height: `${Math.max(6, volume * (1.5 + Math.random() * 2))}px`, transition: 'height 0.15s ease' }} />
                                    ))}
                                </div>
                            )}
                            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI Agent" className={`w-32 h-32 md:w-40 md:h-40 object-contain transition-all duration-500 ${isAISpeaking ? 'scale-110 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]' : ''}`} />
                        </div>

                        <div className="mt-14 flex flex-col items-center gap-5 text-center px-6">
                            <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.5em] transition-colors duration-500">
                                {endSessionStage === 'synthesizing' ? 'Synthesizing High-Fidelity Evaluation...' :
                                    endSessionStage === 'finalizing' ? 'Finalizing Performance Report...' :
                                        isProcessing ? 'Processing Neural Signal...' :
                                            isAISpeaking ? 'Incoming AI Audio' :
                                                isListening ? 'Capturing Voice Input' :
                                                    'Signal Synchronized'}
                            </span>
                            <AnimatePresence>
                                {isListening && interimTranscript && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="px-8 py-4 bg-white/5 backdrop-blur-3xl rounded-[24px] border border-white/10 text-[13px] italic text-cyan-200/50 max-w-sm font-medium leading-relaxed"
                                    >
                                        "{interimTranscript}..."
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-14">
                            {isInterviewCompleted ? (
                                <button
                                    onClick={handleEndInterview}
                                    className="px-12 py-6 bg-emerald-500 text-white font-black rounded-full uppercase tracking-[0.3em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-emerald-400/50"
                                >
                                    Generate Performance Report
                                </button>
                            ) : (
                                <button
                                    onClick={manualToggleMic}
                                    disabled={isProcessing || isAISpeaking}
                                    className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${isListening ? 'bg-red-500' : 'bg-white text-slate-950'} ${(isProcessing || isAISpeaking) ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]'}`}
                                >
                                    {isListening ? (
                                        <div className="w-8 h-8 bg-white rounded-md animate-pulse" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <span className="text-3xl mb-1">🎤</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">Speak</span>
                                        </div>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Transcript Panel */}
                    <div className="lg:w-[80%] glass-panel rounded-[56px] border-white/5 bg-slate-950/40 flex flex-col overflow-hidden shadow-2xl relative">
                        <div ref={scrollRef} className="flex-grow p-10 pt-24 space-y-12 overflow-y-auto scroll-smooth custom-scrollbar">
                            {transcript.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'AI' ? 'justify-start' : 'justify-end'} group`}
                                >
                                    <div className={`max-w-[92%] relative p-10 md:p-12 rounded-[52px] shadow-2xl transition-all duration-500 border-2 ${msg.sender === 'AI'
                                        ? 'bg-[#0f172a]/95 border-blue-500/20 text-slate-200 rounded-tl-none hover:border-blue-500/40'
                                        : 'bg-cyan-500/15 border-cyan-500/30 text-white rounded-tr-none hover:border-cyan-500/50'}`}>

                                        {/* Perspective Indicator */}
                                        <div className={`absolute -top-3 ${msg.sender === 'AI' ? 'left-8' : 'right-8'} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${msg.sender === 'AI' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-cyan-600 border-cyan-400 text-white'}`}>
                                            {msg.sender === 'AI' ? 'Evaluator Internal' : 'Candidate Audio In'}
                                        </div>

                                        <div className="flex items-center gap-3 mb-4 mt-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${msg.sender === 'AI' ? 'bg-blue-500 animate-pulse' : 'bg-cyan-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${msg.sender === 'AI' ? 'text-blue-400/70' : 'text-cyan-400/70'}`}>
                                                {msg.sender === 'AI' ? 'Signal Proc 1.0' : 'Transmitted Signal'}
                                            </span>
                                            <div className={`h-[1px] flex-grow ${msg.sender === 'AI' ? 'bg-blue-500/10' : 'bg-cyan-500/10'}`} />
                                        </div>
                                        <p className="text-[22px] leading-relaxed font-semibold whitespace-pre-wrap selection:bg-white/10">{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {transcript.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                                    <div className="w-12 h-12 border border-dashed border-white/20 rounded-full animate-spin" />
                                    <span className="text-[10px] uppercase font-black tracking-[0.5em]">Establishing Neural Link</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}} />
        </div >
    );
}

export default InterviewPage;
