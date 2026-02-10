import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Screenshot } from './types';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % screenshots.length);
    }
  }, [lightboxIndex, screenshots.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + screenshots.length) % screenshots.length);
    }
  }, [lightboxIndex, screenshots.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, goNext, goPrev]);

  if (screenshots.length === 0) return null;

  return (
    <>
      {/* Image Grid */}
      <div className={`grid gap-4 ${screenshots.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {screenshots.map((shot, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-odara-primary/40 transition-all duration-300 bg-odara-card aspect-video"
          >
            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              className="w-full h-full object-cover object-left-top group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-xs text-white/90 font-medium">{shot.caption}</p>
            </div>
            <div className="absolute top-3 right-3 p-1.5 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 rounded-lg transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {screenshots.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-white/10 rounded-lg transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-white/10 rounded-lg transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={screenshots[lightboxIndex].src}
              alt={screenshots[lightboxIndex].alt}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center">
              <p className="text-white font-medium">{screenshots[lightboxIndex].caption}</p>
              {screenshots.length > 1 && (
                <p className="text-white/50 text-sm mt-1">{lightboxIndex + 1} / {screenshots.length}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScreenshotGallery;
