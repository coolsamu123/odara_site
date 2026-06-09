import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Tutorial } from '../types';

interface Props {
  tutorial: Tutorial;
  onClose: () => void;
}

const VideoModal: React.FC<Props> = ({ tutorial, onClose }) => {
  // Close on Escape and lock background scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={tutorial.title}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-1.5 text-sm text-odara-muted hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
          Close
        </button>

        <div className="relative w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black aspect-video">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${tutorial.youtubeId}?autoplay=1&rel=0`}
            title={tutorial.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <h3 className="mt-4 text-lg font-bold text-white">{tutorial.title}</h3>
        <p className="mt-1 text-sm text-odara-muted leading-relaxed">{tutorial.description}</p>
      </div>
    </div>
  );
};

export default VideoModal;
