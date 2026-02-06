import React, { useState } from 'react';
import { NODE_DATA } from '../constants';
import { Search } from 'lucide-react';

const NodeExplorer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Source' | 'Transform' | 'Target'>('Source');

  const filteredNodes = NODE_DATA.filter(n => n.category === activeCategory);

  return (
    <section id="nodes" className="py-24 relative overflow-hidden">
        {/* Background blob */}
        <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-odara-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">70+ Built-in Connectors</h2>
                <p className="text-odara-muted max-w-lg">
                    Connect to almost anything. From legacy databases to modern cloud warehouses, Odara speaks your data's language.
                </p>
            </div>
            <div className="flex p-1 bg-odara-card border border-white/5 rounded-lg">
                {(['Source', 'Transform', 'Target'] as const).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                            activeCategory === cat 
                            ? 'bg-odara-primary text-white shadow-lg' 
                            : 'text-odara-muted hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredNodes.map((node) => (
                <div key={node.id} className="bg-odara-card border border-white/5 p-6 rounded-xl hover:border-odara-primary/50 transition-colors cursor-default group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-odara-dark rounded-lg text-odara-accent group-hover:text-white group-hover:bg-odara-accent transition-colors">
                            {node.icon && <node.icon size={20} />}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-odara-muted/50">{node.category}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">{node.name}</h4>
                    <p className="text-sm text-odara-muted">{node.description}</p>
                </div>
            ))}
            <div className="bg-odara-card/30 border border-white/5 border-dashed p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <div className="text-odara-muted mb-2 font-medium">And dozens more...</div>
                <button className="text-odara-primary text-sm hover:underline">View Documentation</button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default NodeExplorer;