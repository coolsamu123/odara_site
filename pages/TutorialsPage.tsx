import React, { useState } from 'react';
import { TUTORIALS } from '../constants';
import { Tutorial } from '../types';
import TutorialCard from '../components/TutorialCard';
import VideoModal from '../components/VideoModal';

const TutorialsPage: React.FC = () => {
  const [active, setActive] = useState<Tutorial | null>(null);

  return (
    <div className="min-h-screen bg-[#0B0E14] pt-32 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="px-3 py-1 rounded-full bg-odara-primary/10 text-odara-primary text-xs font-bold tracking-widest uppercase border border-odara-primary/20">
            Tutorials
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-6 mb-4 tracking-tighter">
            Learn Odara.
          </h1>
          <p className="text-xl text-odara-muted font-light leading-relaxed">
            Hands-on video walkthroughs — from building your first pipeline to advanced SQL, Python, and AI workflows.
          </p>
        </div>

        {/* Grid */}
        {TUTORIALS.length === 0 ? (
          <p className="text-odara-muted">Tutorials are on the way. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TUTORIALS.map((t) => (
              <TutorialCard key={t.id} tutorial={t} onPlay={setActive} />
            ))}
          </div>
        )}
      </div>

      {active && <VideoModal tutorial={active} onClose={() => setActive(null)} />}
    </div>
  );
};

export default TutorialsPage;
