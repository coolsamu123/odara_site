import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

// Compact social-proof strip shown right after the Hero. Clicking scrolls to
// the full Testimonials section (#testimonials) further down the page.
const TrustedBy: React.FC = () => {
  const scroll = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="border-y border-white/5 bg-white/[0.02]">
      <a
        href="#testimonials"
        onClick={scroll}
        className="container mx-auto px-6 py-5 flex items-center justify-center gap-x-4 gap-y-2
                   flex-wrap group cursor-pointer"
      >
        <div className="flex -space-x-3">
          {TESTIMONIALS.map((t) => (
            <img
              key={t.name}
              src={`/${t.avatar}`}
              alt={t.name}
              loading="lazy"
              className="w-9 h-9 rounded-full object-cover border-2 border-odara-dark ring-1 ring-white/10"
            />
          ))}
        </div>
        <span className="text-sm text-odara-muted group-hover:text-odara-text transition-colors">
          Trusted by data engineers, architects &amp; leads building on Odara
        </span>
        <ArrowRight className="w-4 h-4 text-odara-primary opacity-0 -translate-x-1
                               group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </a>
    </div>
  );
};

export default TrustedBy;
