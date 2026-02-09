import React from 'react';
import { Database, Zap, Users, CheckCircle2, Heart, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    accent: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, accent }) => (
    <div className="p-8 rounded-2xl bg-odara-card border border-white/5 hover:border-white/10 transition-colors">
        <Icon className={`w-10 h-10 mb-6 ${accent}`} />
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-odara-muted leading-relaxed">
            {description}
        </p>
    </div>
);

const CheckItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-center gap-3 text-odara-text font-medium text-lg">
        <CheckCircle2 className="w-5 h-5 text-odara-success" />
        {children}
    </div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="px-3 py-1 rounded-full bg-odara-success/10 text-odara-success text-sm font-medium border border-odara-success/20">
        {children}
    </span>
);

const FreeTier: React.FC = () => {
    return (
        <section id="free" className="py-32 relative bg-[#0B0E14]">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-odara-card/20 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">
                        Free as in <br />
                        <span className="text-odara-success">the old times.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-odara-muted leading-relaxed font-light">
                        No hidden caps. No "contact sales for more rows". <br />
                        Odara Community is the full engine. Yours forever.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <FeatureCard
                        icon={Database}
                        title="Unlimited Data"
                        description="Process 10 rows or 10 billion. The engine doesn't care, and we don't charge."
                        accent="text-odara-accent"
                    />
                    <FeatureCard
                        icon={Zap}
                        title="Unlimited Speed"
                        description="Uses all available CPU cores. No artificial throttling or performance caps."
                        accent="text-odara-warning"
                    />
                    <FeatureCard
                        icon={Users}
                        title="Unlimited Users"
                        description="Install it on your server. Give access to your whole team. No seat limits."
                        accent="text-odara-primary"
                    />
                </div>

                <div className="glass-panel p-8 md:p-12 rounded-2xl max-w-5xl mx-auto border border-odara-success/20 bg-odara-success/5">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 justify-center md:justify-start">
                                <Heart className="text-odara-danger fill-odara-danger" />
                                True Community Edition
                            </h3>
                            <p className="text-odara-muted text-lg mb-6">
                                We believe basic ETL shouldn't cost a fortune. You get the full visual editor, the full Rust backend, and the full AI generation capabilities.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <Badge>Commercial Use Allowed</Badge>
                                <Badge>No Credit Card Required</Badge>
                                <Badge>Self-Hosted</Badge>
                            </div>
                        </div>
                        <div className="w-full md:w-auto flex flex-col gap-3">
                            <CheckItem>Full Pipeline Editor</CheckItem>
                            <CheckItem>Pylons</CheckItem>
                            <CheckItem>70+ Connectors</CheckItem>
                            <CheckItem>Git Integration</CheckItem>
                            <CheckItem>Cron Scheduling</CheckItem>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FreeTier;