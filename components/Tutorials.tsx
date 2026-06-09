import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TUTORIALS } from '../constants';
import { Tutorial } from '../types';
import TutorialCard from './TutorialCard';
import VideoModal from './VideoModal';

const Tutorials: React.FC = () => {
  const [active, setActive] = useState<Tutorial | null>(null);
  // Landing teaser: show at most 4
  const featured = TUTORIALS.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section id="tutorials" className="py-32 relative bg-[#0B0E14]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-odara-primary/10 text-odara-primary text-xs font-bold tracking-widest uppercase border border-odara-primary/20">
              Tutorials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 mb-4 tracking-tight">
              Learn Odara in minutes.
            </h2>
            <p className="text-lg text-odara-muted font-light leading-relaxed">
              Short, hands-on videos that take you from your first pipeline to mixing SQL, Python, and AI.
            </p>
          </div>

          <Link
            to="/tutorials"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-odara-primary hover:text-indigo-400 transition-colors"
          >
            View all tutorials
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((t) => (
            <TutorialCard key={t.id} tutorial={t} onPlay={setActive} />
          ))}
        </div>
      </div>

      {active && <VideoModal tutorial={active} onClose={() => setActive(null)} />}
    </section>
  );
};

export default Tutorials;
