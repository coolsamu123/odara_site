import React from 'react';
import { Blocks, RefreshCw, Bot, Code } from 'lucide-react';

const APISection: React.FC = () => {
    return (
        <section id="api" className="py-24 bg-odara-card/20 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        <span className="gradient-text block mb-2">Unmatched Flexibility.</span>
                        Orchestrate Anything.
                    </h2>
                    <p className="text-xl text-odara-muted leading-relaxed">
                        Odara doesn't lock you in. With its comprehensive API, you can create, run, and schedule pipelines using external tools like <span className="text-white font-medium">Apache Airflow</span>, or better yet: build <span className="text-odara-primary font-medium">your own AI Agents</span> to do the whole job for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
                        <img 
                            src="./screenshots/api-flexibility.png" 
                            alt="API and Flexibility Illustration" 
                            className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                            <div className="flex items-center gap-2 mb-2">
                                <Code className="w-5 h-5 text-odara-primary" />
                                <span className="text-sm font-mono text-odara-primary tracking-wider">REST API</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Build Your Own Ecosystem</h3>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Blocks className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">External Orchestrators</h4>
                                <p className="text-odara-muted">
                                    Trigger Odara pipelines directly from Airflow, Prefect, Dagster, or any CI/CD pipeline using simple REST calls.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">AI Agent Integration</h4>
                                <p className="text-odara-muted">
                                    Connect Odara to your custom agents. Let AI autonomously create and run data pipelines based on your business needs.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                                <RefreshCw className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Fully Programmable</h4>
                                <p className="text-odara-muted">
                                    Every action available in the UI is available via the API. Automate user provisioning, project setup, context variables, and metadata exports.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default APISection;
