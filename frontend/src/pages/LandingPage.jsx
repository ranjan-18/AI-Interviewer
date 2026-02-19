
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LandingPage() {
    return (
        <div className="relative overflow-hidden selection:bg-blue-500/30 font-['Outfit'] pb-20">

            {/* Background Layer: Dots & Orbs */}
            <div className="absolute inset-0 dots-pattern opacity-10 pointer-events-none" />
            <div className="glow-orb top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10" />
            <div className="glow-orb bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10" />
            <div className="glow-orb top-[40%] right-[10%] w-[40%] h-[40%] bg-blue-500/5" />

            {/* Decorative Connection Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0">
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 3, delay: 1 }}
                    d="M 500 200 C 800 100 1100 400 900 600"
                    stroke="url(#grad1)"
                    strokeWidth="0.5"
                    fill="none"
                    strokeDasharray="8,8"
                />
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 3, delay: 1.5 }}
                    d="M 200 600 Q 400 750 800 650"
                    stroke="url(#grad2)"
                    strokeWidth="0.5"
                    fill="none"
                    strokeDasharray="6,6"
                />
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="container mx-auto px-6 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-screen pt-32">

                {/* LEFT: Text & CTA */}
                <div className="lg:col-span-8 relative flex flex-col items-center lg:items-start text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl md:text-[6rem] font-black tracking-tight leading-[0.9] mb-8">
                            <span className="text-gradient drop-shadow-[0_0_30px_rgba(68,119,255,0.4)] block md:inline">AI</span>
                            <span className="text-white"> Interview Buddy</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-slate-400 font-medium tracking-wide max-w-2xl">
                            Your Smart Mock Interview Partner. Master any technical round with real-time AI feedback.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col items-center lg:items-start mb-12"
                    >
                        <Link to="/upload" className="btn-primary flex items-center justify-center">
                            Start Practice
                        </Link>
                        <p className="mt-4 text-slate-500 text-sm font-medium tracking-wide">
                            ✨ Free for everyone
                        </p>
                    </motion.div>
                </div>

                {/* RIGHT: Modern AI Visualizer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="lg:col-span-4 hidden lg:flex justify-center items-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
                        <div className="relative w-80 h-80 rounded-[40px] bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[120px] transition-transform group-hover:scale-110 duration-500">🤖</span>
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-0 right-0 h-1 bg-cyan-500/30 blur-sm brightness-150"
                            />
                        </div>
                        <div className="absolute top-0 -right-5 w-3 h-3 bg-blue-400 rounded-full animate-ping" />
                        <div className="absolute bottom-10 -left-5 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-700" />
                    </div>
                </motion.div>
            </div>

            {/* FEATURES SECTION */}
            <section id="features" className="py-32 relative z-10 bg-[#020617]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black mb-6"
                        >
                            Professional <span className="text-gradient">Features</span>
                        </motion.h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Harness the power of AI to transform your interview preparation into a professional success story.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Resume-Grounded Questions",
                                desc: "No generic scripts. Every question is dynamically generated based on your specific experience and technical skills.",
                                icon: "📑"
                            },
                            {
                                title: "Real-time Voice Analysis",
                                desc: "Speak naturally. Our system processes your voice in real-time to analyze clarity, confidence, and technical depth.",
                                icon: "🎙️"
                            },
                            {
                                title: "Actionable Mentorship",
                                desc: "Receive detailed, honest feedback reports with personalized tips to help you land your dream tech role.",
                                icon: "🌟"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-10 rounded-[40px] border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                            >
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS SECTION: HOW IT WORKS */}
            <section className="py-32 relative z-10 overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col items-center mb-24 text-center">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/20"
                        >
                            The Journey
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">How It <span className="text-gradient">Works</span></h2>
                        <p className="text-slate-400 max-w-xl">A seamless three-step process designed to take you from preparation to professional mastery.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -translate-y-12" />

                        {[
                            { step: "01", title: "Upload & Analysis", desc: "Upload your resume. Our agents instantly parse your skills, projects, and target role.", icon: "📂" },
                            { step: "02", title: "Active Mock Round", desc: "Engage in a live, voice-driven interview. Respond naturally to role-specific technical questions.", icon: "🎙️" },
                            { step: "03", title: "Deep Insight Report", desc: "Receive a comprehensive performance audit with technical accuracy and communication scores.", icon: "📊" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="flex flex-col items-center text-center relative z-10 group"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-4xl mb-8 shadow-2xl group-hover:border-blue-500/50 transition-colors">
                                    {item.icon}
                                </div>
                                <div className="text-blue-500 font-black text-sm mb-4 tracking-tighter opacity-50">{item.step}</div>
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed px-4">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI AGENT PANEL: MEET YOUR INTERVIEWERS */}
            <section className="py-32 relative z-10 bg-[#020617]/40">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="text-4xl md:text-6xl font-black text-white leading-tight mb-8"
                            >
                                A Panel of <br />
                                <span className="text-gradient">Specialized Agents</span>
                            </motion.h2>
                            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                                Unlike basic AI bots, we deploy a sophisticated team of specialized agents. Each one focuses on a specific dimension of your interview to ensure the highest fidelity preparation.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { name: "The Architect", role: "Technical Deep-Dive Expert", color: "bg-blue-500" },
                                    { name: "The Coach", role: "Communication & Tone Specialist", color: "bg-cyan-500" },
                                    { name: "The Strategist", role: "Behavioral & Culture Fit Lead", color: "bg-purple-500" }
                                ].map((agent, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-default"
                                    >
                                        <div className={`w-3 h-12 rounded-full ${agent.color} shadow-[0_0_15px_rgba(37,99,235,0.4)]`} />
                                        <div>
                                            <h4 className="font-bold text-xl text-white">{agent.name}</h4>
                                            <p className="text-slate-500 text-sm">{agent.role}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="glass-panel p-2 rounded-[60px] relative z-10 border-white/5 shadow-inner"
                            >
                                <img
                                    src="https://img.freepik.com/free-vector/humanoid-robot-thinking-concept-illustration_114360-15545.jpg?w=740"
                                    alt="Expert AI"
                                    className="rounded-[58px] mix-blend-screen opacity-90"
                                />
                            </motion.div>
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
                            <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="py-32 relative z-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="glass-panel p-12 md:p-20 rounded-[60px] border-white/5 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/5 blur-[100px] rounded-full" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse">
                            <div className="order-2 lg:order-1 hidden lg:block">
                                <img
                                    src="https://img.freepik.com/free-vector/ai-technology-concept-illustration_114360-7023.jpg?w=740"
                                    alt="AI Mission"
                                    className="w-full mix-blend-screen opacity-80"
                                />
                            </div>
                            <div className="order-1 lg:order-2">
                                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-white">
                                    Built for the <br />
                                    <span className="text-gradient">Future of Hiring</span>
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                                    AI Interview Buddy was born out of a simple mission: to bridge the gap between preparation and performance. We believe that everyone deserves a world-class mentor to help them navigate the challenges of modern technical interviews.
                                </p>

                                <div className="flex items-center gap-6 p-2 pr-8 rounded-full bg-slate-900 border border-white/5 w-fit">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg border border-white/10 font-bold text-white">
                                        NY
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl text-white">Naveen Kumar Yadav</h4>
                                        <p className="text-slate-500 font-medium">Developer & Founder</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 relative z-10 text-center border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="mb-10 flex flex-col items-center">
                        <div className="text-2xl font-black mb-4">
                            <span className="text-gradient">AI</span> Interview Buddy
                        </div>
                    </div>
                    <div className="text-slate-400 font-medium">
                        Developed with ❤️ by <span className="text-white">Naveen Kumar Yadav</span>
                    </div>
                    <div className="mt-8 text-slate-600 text-xs">
                        © 2026 AI Interview Buddy. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
