import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-[#0B0E14]">
            {/* Background Elements */}
            <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-40" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-odara-primary/5 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-odara-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text */}
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
                            <span className="px-3 py-1 rounded-full bg-odara-primary/10 text-odara-primary text-xs font-bold tracking-widest uppercase border border-odara-primary/20">
                                The AI-First ETL Platform
                            </span>
                        </div>

                        <h1 className="text-8xl md:text-[9rem] font-bold tracking-tighter text-white leading-none mb-6">
                            Odara<span className="text-odara-primary">.</span>
                        </h1>

                        <h2 className="text-4xl md:text-5xl font-medium text-odara-text/90 leading-tight mb-8 tracking-tight">
                            <span className="text-odara-primary">R</span>ob<span className="text-odara-primary">ust</span> data pipelines,<br />
                            <span className="text-odara-muted">powered by Rust and AI.</span>
                        </h2>

                        <p className="text-xl text-odara-muted max-w-lg mb-10 font-light leading-relaxed border-l-2 border-white/10 pl-6">
                            You don't have to know how to code. <br />
                            Just tell Odara what you want.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-8 py-4 bg-odara-primary hover:bg-indigo-600 text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-odara-primary/20 hover:translate-y-[-2px]">
                                Download Community
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:border-odara-text hover:bg-white/10 text-odara-text rounded-lg font-mono font-medium transition-all flex items-center justify-center gap-2">
                                <Terminal className="w-5 h-5 text-odara-accent" />
                                cargo run
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Visual */}
                    <div className="relative mt-12 lg:mt-0">
                        <div className="relative z-20 transform transition-transform duration-700 hover:scale-[1.01] hover:rotate-1">
                            <div className="bg-[#0B0E14] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm group">
                                {/* Window Controls */}
                                <div className="h-10 border-b border-white/5 bg-[#151923] flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500/80 transition-colors"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/80 transition-colors"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors"></div>
                                    </div>
                                    <div className="ml-4 text-xs font-mono text-odara-muted opacity-50">Odara AI Assistant</div>
                                </div>

                                {/* Screenshot */}
                                <img
                                    src="/screenshots/hero-ai.png"
                                    alt="Odara AI Assistant generating pipeline"
                                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-20 pointer-events-none" />
                            </div>
                        </div>

                        {/* Decorative Glow */}
                        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-odara-primary/20 blur-[100px] -z-10 rounded-full mix-blend-screen"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;