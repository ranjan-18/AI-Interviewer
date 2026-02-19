
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="w-full bg-[#020617]/50 backdrop-blur-2xl fixed top-0 z-[100] border-b border-white/5">
            <div className="container mx-auto px-8 py-5 flex justify-between items-center max-w-7xl">

                {/* Logo Section */}
                <Link to="/" className="flex items-center group">
                    <span className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center">
                        <span className="text-gradient">AI</span>
                        <span className="ml-1.5">Interview</span>
                    </span>
                    <span className="ml-1.5 text-slate-500 font-semibold text-sm md:text-base opacity-70">Buddy</span>
                </Link>

            </div>
            <div className="nav-line" />
        </nav>
    );
}

export default Navbar;
