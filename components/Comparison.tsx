import React from 'react';
import { Check, X } from 'lucide-react';
import { COMPARISON_DATA } from '../constants';

const Comparison: React.FC = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Open Core. Enterprise Scale.</h2>
            <p className="text-odara-muted">
                Start for free with the powerful Community Edition. Upgrade when you need advanced governance and security.
            </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 glass-panel">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-white/5">
                        <th className="p-6 text-lg font-semibold border-b border-white/10">Feature</th>
                        <th className="p-6 text-lg font-semibold border-b border-white/10 text-center text-odara-accent">Community</th>
                        <th className="p-6 text-lg font-semibold border-b border-white/10 text-center text-odara-primary">Enterprise</th>
                    </tr>
                </thead>
                <tbody>
                    {COMPARISON_DATA.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                            <td className="p-4 px-6 font-medium text-odara-text/90">{row.feature}</td>
                            <td className="p-4 px-6 text-center">
                                {typeof row.community === 'boolean' ? (
                                    row.community ? <Check className="w-5 h-5 text-odara-accent mx-auto" /> : <X className="w-5 h-5 text-odara-muted/30 mx-auto" />
                                ) : (
                                    <span className="text-sm">{row.community}</span>
                                )}
                            </td>
                            <td className="p-4 px-6 text-center">
                                {typeof row.enterprise === 'boolean' ? (
                                    row.enterprise ? <Check className="w-5 h-5 text-odara-primary mx-auto" /> : <X className="w-5 h-5 text-odara-muted/30 mx-auto" />
                                ) : (
                                    <span className="text-sm">{row.enterprise}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="mt-12 text-center">
            <p className="text-odara-muted mb-4">Need Role-Based Access Control and SSO?</p>
            <button className="text-odara-text border-b border-odara-primary hover:text-odara-primary transition-colors pb-0.5">
                Contact Sales
            </button>
        </div>
      </div>
    </section>
  );
};

export default Comparison;