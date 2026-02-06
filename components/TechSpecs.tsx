import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Cpu, Box, Database, Code2 } from 'lucide-react';

const PERFORMANCE_DATA = [
  { name: 'Python ETL', throughput: 2500, color: '#94a3b8' },
  { name: 'Java ETL', throughput: 4200, color: '#94a3b8' },
  { name: 'Odara (Rust)', throughput: 8500, color: '#6366f1' },
];

const TechSpecs: React.FC = () => {
  return (
    <section id="tech" className="py-24 bg-odara-card/30 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text & Stack */}
            <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Engineered for Performance</h2>
                <p className="text-odara-muted text-lg mb-8 leading-relaxed">
                    Odara isn't just a wrapper around existing tools. It's a vertically integrated data engine built in Rust, using Apache Arrow for zero-copy memory management.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-4 p-4 rounded-lg bg-odara-dark/50 border border-white/5">
                        <Cpu className="text-odara-warning shrink-0" />
                        <div>
                            <h4 className="font-bold">Rust Backend</h4>
                            <p className="text-sm text-odara-muted">Tokio async runtime & DataFusion query engine.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-lg bg-odara-dark/50 border border-white/5">
                        <Database className="text-odara-success shrink-0" />
                        <div>
                            <h4 className="font-bold">SQLite WAL</h4>
                            <p className="text-sm text-odara-muted">Embedded metadata store. Zero setup required.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-lg bg-odara-dark/50 border border-white/5">
                        <Box className="text-odara-accent shrink-0" />
                        <div>
                            <h4 className="font-bold">React Flow</h4>
                            <p className="text-sm text-odara-muted">Fluid, high-performance canvas rendering.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-lg bg-odara-dark/50 border border-white/5">
                        <Code2 className="text-odara-primary shrink-0" />
                        <div>
                            <h4 className="font-bold">Arrow Native</h4>
                            <p className="text-sm text-odara-muted">Standardized in-memory columnar format.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Chart */}
            <div className="glass-panel p-8 rounded-2xl relative">
                <h3 className="text-xl font-bold mb-2">Throughput Comparison</h3>
                <p className="text-sm text-odara-muted mb-8">Rows processed per second (Thousands)</p>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PERFORMANCE_DATA} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                width={100}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#151923', borderColor: '#333', color: '#fff' }}
                            />
                            <Bar dataKey="throughput" radius={[0, 4, 4, 0]} barSize={30}>
                                {PERFORMANCE_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="absolute bottom-4 right-8 text-xs text-odara-muted italic">
                    * Benchmark based on standard CSV processing tasks
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default TechSpecs;