import React from 'react';
import { FEATURES } from '../constants';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-odara-dark relative">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Complete Engineering Suite</h2>
            <p className="text-odara-muted max-w-2xl mx-auto">
                From visual design to production monitoring. Odara provides every tool you need to master your data lifecycle.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <div 
                key={idx} 
                className="glass-panel p-8 rounded-2xl hover:bg-odara-card/80 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-odara-primary/10 rounded-lg flex items-center justify-center mb-6 text-odara-primary group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-odara-muted mb-6 leading-relaxed">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.tags?.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-odara-muted border border-white/5">
                        {tag}
                    </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;