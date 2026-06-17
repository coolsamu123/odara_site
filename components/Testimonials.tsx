import React from 'react';
import { Quote, Linkedin, Sparkles, Wrench } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

// Per-badge icon + color. Falls back to the Early-Adopter style for unknown tags.
const BADGES: Record<string, { Icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  'Early Adopter': { Icon: Sparkles, cls: 'bg-odara-primary/15 text-odara-primary border-odara-primary/25' },
  'Contributor': { Icon: Wrench, cls: 'bg-odara-accent/15 text-odara-accent border-odara-accent/25' },
};

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Loved by <span className="gradient-text">data professionals</span>
          </h2>
          <p className="text-odara-muted max-w-2xl mx-auto">
            Practitioners who put Odara to work — from data engineering to architecture and management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="glass-panel rounded-2xl border border-white/10 p-8 flex flex-col gap-6
                         transition-colors hover:border-odara-primary/40"
            >
              <Quote className="w-8 h-8 text-odara-primary/60 flex-shrink-0" aria-hidden />
              <blockquote className="text-odara-text/90 text-lg leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-4">
                <img
                  src={`/${t.avatar}`}
                  alt={t.name}
                  loading="lazy"
                  className="w-14 h-14 rounded-full object-cover border border-white/10"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-odara-text truncate">{t.name}</div>
                  <div className="text-sm text-odara-accent truncate">{t.role}</div>
                  {t.tags && t.tags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {t.tags.map((tag) => {
                        const { Icon, cls } = BADGES[tag] ?? BADGES['Early Adopter'];
                        return (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                        text-[11px] font-medium border ${cls}`}
                          >
                            <Icon className="w-3 h-3" />
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                {t.linkedin && (
                  <a
                    href={t.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.name} on LinkedIn`}
                    className="ml-auto text-odara-muted hover:text-odara-primary transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
