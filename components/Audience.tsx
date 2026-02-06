import React from 'react';
import { PERSONAS } from '../constants';
import { User, Briefcase, GraduationCap, Server, Rocket, BarChart } from 'lucide-react';

const ICONS = [Server, BarChart, Briefcase, Rocket, GraduationCap, User];

const Audience: React.FC = () => {
  return (
    <section id="users" className="py-24 relative bg-odara-card/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Who Is Odara For?</h2>
            <p className="text-odara-muted max-w-2xl mx-auto">
                Odara is designed to be accessible to everyone—from complete beginners to seasoned professionals.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERSONAS.map((persona, idx) => {
                const Icon = ICONS[idx % ICONS.length];
                return (
                    <div key={idx} className="bg-odara-card border border-white/5 p-8 rounded-2xl hover:border-odara-primary/30 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-odara-dark flex items-center justify-center border border-white/5 group-hover:border-odara-primary/50 transition-colors">
                                <Icon className="w-5 h-5 text-odara-muted group-hover:text-odara-primary" />
                            </div>
                            <h3 className="font-bold text-lg">{persona.role}</h3>
                        </div>
                        <p className="text-odara-muted mb-6 h-12">
                            {persona.description}
                        </p>
                        <ul className="space-y-2">
                            {persona.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-odara-text/80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-odara-accent mt-1.5 flex-shrink-0" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>

        <div className="mt-16 text-center">
            <div className="inline-block p-6 rounded-xl bg-odara-primary/10 border border-odara-primary/20">
                <h4 className="text-xl font-bold text-white mb-2">The Bottom Line</h4>
                <p className="text-odara-muted">
                    If you work with data, Odara is for you. Build pipelines in minutes, not months.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Audience;