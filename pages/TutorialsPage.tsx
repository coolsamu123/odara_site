import React, { useState } from 'react';
import { BookOpen, Play } from 'lucide-react';
import { TUTORIALS } from '../constants';
import { Tutorial } from '../types';
import TutorialCard from '../components/TutorialCard';
import VideoModal from '../components/VideoModal';

const TutorialsPage: React.FC = () => {
  const [active, setActive] = useState<Tutorial | null>(null);

  const walkthroughs = TUTORIALS.filter((t) => t.kind === 'walkthrough');
  const videos = TUTORIALS.filter((t) => t.kind !== 'walkthrough');

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
            Short videos and step-by-step walkthroughs — from your first pipeline to advanced SQL, Python, and AI workflows.
          </p>
        </div>

        {TUTORIALS.length === 0 && (
          <p className="text-odara-muted">Tutorials are on the way. Check back soon.</p>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section className="mb-20">
            <div className="flex items-baseline justify-between mb-6">
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5 text-odara-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Videos
                </h2>
                <span className="text-sm text-odara-muted">{videos.length}</span>
              </div>
              <p className="hidden md:block text-sm text-odara-muted">
                Short clips — see Odara in motion.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((t) => (
                <TutorialCard key={t.id} tutorial={t} onPlay={setActive} />
              ))}
            </div>
          </section>
        )}

        {/* Walkthroughs */}
        {walkthroughs.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-odara-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Walkthroughs
                </h2>
                <span className="text-sm text-odara-muted">{walkthroughs.length}</span>
              </div>
              <p className="hidden md:block text-sm text-odara-muted">
                Step-by-step with screenshots — read at your own pace.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {walkthroughs.map((t) => (
                <TutorialCard key={t.id} tutorial={t} onPlay={setActive} />
              ))}
            </div>
          </section>
        )}
      </div>

      {active && <VideoModal tutorial={active} onClose={() => setActive(null)} />}
    </div>
  );
};

export default TutorialsPage;
