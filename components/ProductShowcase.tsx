import React, { useState } from 'react';
import { Layout, Activity, FileText } from 'lucide-react';

const TABS = [
  { id: 'editor', label: 'Visual Editor', icon: Layout, image: '/screenshots/editor.png', desc: "Drag-and-drop 70+ connectors with React Flow." },
  { id: 'monitor', label: 'Production Monitor', icon: Activity, image: '/screenshots/monitor.png', desc: "Real-time execution tracking for Batch & Streaming." },
  { id: 'docs', label: 'Auto-Docs', icon: FileText, image: '/screenshots/docs.png', desc: "Pipelines document themselves automatically." },
];

const ProductShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <section className="py-24 bg-[#0B0E14] relative border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Experience the difference.</h2>
          <p className="text-odara-muted text-lg max-w-2xl mx-auto">
            Built for clarity. Designed for speed. Odara's interface gets out of your way so you can focus on the data.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                className={`text-left p-6 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                  activeTab.id === tab.id
                    ? 'bg-odara-card border-odara-primary shadow-lg'
                    : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${activeTab.id === tab.id ? 'bg-odara-primary' : 'bg-transparent'}`} />
                
                <div className="flex items-center gap-4 mb-2">
                    <tab.icon className={`w-6 h-6 ${activeTab.id === tab.id ? 'text-odara-primary' : 'text-odara-muted'}`} />
                    <h3 className={`font-bold text-lg ${activeTab.id === tab.id ? 'text-white' : 'text-odara-muted group-hover:text-white'}`}>
                        {tab.label}
                    </h3>
                </div>
                <p className="text-sm text-odara-muted pl-10">
                    {tab.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Screenshot Display */}
          <div className="w-full lg:w-2/3">
            <div className="relative rounded-xl border border-white/10 bg-[#151923] shadow-2xl overflow-hidden group aspect-[16/10]">
                <div className="absolute inset-0 bg-odara-dark/50 flex items-center justify-center z-10 transition-opacity duration-300" style={{ opacity: 0 }}>
                    {/* Placeholder loading state if needed */}
                </div>
                <img 
                    key={activeTab.image} // Force re-render for animation
                    src={activeTab.image} 
                    alt={activeTab.label}
                    className="w-full h-full object-cover object-top animate-in fade-in zoom-in-95 duration-500"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/50 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;