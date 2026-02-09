import React, { useState } from 'react';
import { AI_EXAMPLES } from '../constants';
import { Bot, Play, Sparkles, Copy, Check } from 'lucide-react';

const AIDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState(AI_EXAMPLES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ai" className="py-24 bg-odara-dark relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-odara-primary/10 via-odara-dark to-odara-dark pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-odara-accent font-medium mb-4">
            <Bot className="w-5 h-5" />
            <span>AI-First Engineering</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Code generated in seconds.<br />
            <span className="text-odara-muted">Not hours.</span>
          </h2>
          <p className="text-odara-muted max-w-2xl mx-auto text-lg">
            No need to memorize complex SQL syntax or Python libraries. 
            Odara's AI understands your intent and writes optimized, error-free code for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left: Prompt Selection */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-semibold text-odara-muted uppercase tracking-wider mb-4 px-2">Example Prompts</h3>
            {AI_EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setActiveExample(ex)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                  activeExample.id === ex.id
                    ? 'bg-odara-card border-odara-primary shadow-lg shadow-odara-primary/10'
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        ex.language === 'sql' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                        {ex.language.toUpperCase()}
                    </span>
                    {activeExample.id === ex.id && <Sparkles className="w-4 h-4 text-odara-primary" />}
                </div>
                <div className={`font-medium ${activeExample.id === ex.id ? 'text-white' : 'text-odara-muted group-hover:text-white'}`}>
                    "{ex.prompt}"
                </div>
              </button>
            ))}
          </div>

          {/* Right: Code Simulation */}
          <div className="lg:col-span-8">
            <div className="glass-panel rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117]">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="text-xs font-mono text-odara-muted">ai_generator_v1.rs</div>
                    <button 
                        onClick={handleCopy}
                        className="text-odara-muted hover:text-white transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-odara-success" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                {/* Input Area */}
                <div className="p-6 border-b border-white/5 bg-odara-dark/50">
                    <div className="flex gap-3 text-sm font-mono mb-2 text-odara-muted">
                        <span className="text-odara-success">user@odara:~$</span>
                        <span>odara generate "{activeExample.prompt}"</span>
                    </div>
                    <div className="flex gap-2 items-center text-odara-primary text-xs mt-3">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-odara-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-odara-primary"></span>
                        </span>
                        Analyzing schema... Generating {activeExample.language} code...
                    </div>
                </div>

                {/* Code Output */}
                <div className="p-6 bg-[#0d1117] min-h-[300px]">
                    <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                        <code className="text-gray-300">
                            {activeExample.code}
                        </code>
                    </pre>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-white/5 border-t border-white/5 flex justify-end">
                    <button className="flex items-center gap-2 text-xs font-semibold bg-odara-success/10 text-odara-success px-3 py-1.5 rounded hover:bg-odara-success/20 transition-colors border border-odara-success/20">
                        <Play className="w-3 h-3" />
                        Apply to Pipeline
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;