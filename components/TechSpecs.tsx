import React from 'react';
import { Cpu, Box, Database, Code2, LucideIcon } from 'lucide-react';

const STACK: { icon: LucideIcon; accent: string; title: string; desc: string }[] = [
    { icon: Cpu, accent: 'text-odara-warning', title: 'Rust Backend', desc: 'Tokio async runtime & DataFusion query engine.' },
    { icon: Database, accent: 'text-odara-success', title: 'SQLite WAL', desc: 'Embedded metadata store. Zero setup required.' },
    { icon: Box, accent: 'text-odara-accent', title: 'React Flow', desc: 'Fluid, high-performance canvas rendering.' },
    { icon: Code2, accent: 'text-odara-primary', title: 'Arrow Native', desc: 'Standardized in-memory columnar format.' },
];

const TechSpecs: React.FC = () => {
    return (
        <section id="tech" className="py-16 md:py-24 bg-odara-card/30 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Engineered for Performance</h2>
                    <p className="text-odara-muted text-lg leading-relaxed">
                        Odara isn't just a wrapper around existing tools. It's a vertically integrated data engine built in Rust, using Apache Arrow for zero-copy memory management.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {STACK.map(({ icon: Icon, accent, title, desc }) => (
                        <div key={title} className="flex flex-col gap-3 p-6 rounded-lg bg-odara-dark/50 border border-white/5">
                            <Icon className={`${accent} shrink-0`} />
                            <div>
                                <h4 className="font-bold">{title}</h4>
                                <p className="text-sm text-odara-muted">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechSpecs;
