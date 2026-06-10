import React from 'react';
import { Play, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tutorial } from '../types';

interface Props {
  tutorial: Tutorial;
  /** Called for video tutorials. Walkthroughs use react-router Link instead. */
  onPlay: (tutorial: Tutorial) => void;
}

const cardBase =
  'group text-left rounded-2xl overflow-hidden bg-odara-card border border-white/5 hover:border-odara-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-odara-primary/50 block';

const TutorialCard: React.FC<Props> = ({ tutorial, onPlay }) => {
  const isWalkthrough = tutorial.kind === 'walkthrough';

  const Thumb = (
    <div className="relative aspect-video overflow-hidden bg-black">
      {isWalkthrough ? (
        tutorial.cover ? (
          <img
            src={`/tutorials/${tutorial.slug}/${tutorial.cover}`}
            alt={tutorial.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-odara-primary/20 to-odara-accent/20" />
        )
      ) : (
        <img
          src={`https://i.ytimg.com/vi/${tutorial.youtubeId}/hqdefault.jpg`}
          alt={tutorial.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

      {/* Badge — Play for video, Read for walkthrough */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isWalkthrough ? (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-odara-primary/90 text-white text-sm font-semibold shadow-xl transition-transform duration-300 group-hover:scale-105">
            <BookOpen className="w-4 h-4" />
            Read
          </span>
        ) : (
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-odara-primary/90 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Play className="w-6 h-6 translate-x-0.5 fill-white" />
          </span>
        )}
      </div>

      {/* Bottom-right meta */}
      {isWalkthrough && tutorial.estimatedMin ? (
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
          <Clock className="w-3 h-3" /> {tutorial.estimatedMin} min
        </span>
      ) : tutorial.duration ? (
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
          {tutorial.duration}
        </span>
      ) : null}

      {/* Top-left kind chip — only on walkthroughs so they stand out from videos */}
      {isWalkthrough && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-odara-accent text-[10px] font-bold tracking-widest uppercase">
          Walkthrough
        </span>
      )}
    </div>
  );

  const Meta = (
    <div className="p-5">
      <h3 className="text-base font-bold text-white leading-snug group-hover:text-odara-primary transition-colors">
        {tutorial.title}
      </h3>
      <p className="mt-2 text-sm text-odara-muted leading-relaxed line-clamp-2">
        {tutorial.description}
      </p>
      {isWalkthrough && (
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-odara-primary">
          Open tutorial <ArrowRight className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
  );

  if (isWalkthrough && tutorial.slug) {
    return (
      <Link to={`/tutorials/${tutorial.slug}`} className={cardBase}>
        {Thumb}
        {Meta}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onPlay(tutorial)} className={cardBase}>
      {Thumb}
      {Meta}
    </button>
  );
};

export default TutorialCard;
