import React from 'react';
import { Play } from 'lucide-react';
import { Tutorial } from '../types';

interface Props {
  tutorial: Tutorial;
  onPlay: (tutorial: Tutorial) => void;
}

const TutorialCard: React.FC<Props> = ({ tutorial, onPlay }) => (
  <button
    type="button"
    onClick={() => onPlay(tutorial)}
    className="group text-left rounded-2xl overflow-hidden bg-odara-card border border-white/5 hover:border-odara-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-odara-primary/50"
  >
    {/* Thumbnail */}
    <div className="relative aspect-video overflow-hidden bg-black">
      <img
        src={`https://i.ytimg.com/vi/${tutorial.youtubeId}/hqdefault.jpg`}
        alt={tutorial.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      {/* Play badge */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-odara-primary/90 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
          <Play className="w-6 h-6 translate-x-0.5 fill-white" />
        </span>
      </div>
      {tutorial.duration && (
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
          {tutorial.duration}
        </span>
      )}
    </div>

    {/* Meta */}
    <div className="p-5">
      <h3 className="text-base font-bold text-white leading-snug group-hover:text-odara-primary transition-colors">
        {tutorial.title}
      </h3>
      <p className="mt-2 text-sm text-odara-muted leading-relaxed line-clamp-2">
        {tutorial.description}
      </p>
    </div>
  </button>
);

export default TutorialCard;
