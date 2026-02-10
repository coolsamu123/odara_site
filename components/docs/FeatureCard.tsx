import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DocFeature } from './types';

interface FeatureCardProps {
  feature: DocFeature;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <div
      className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-odara-primary/30 hover:bg-white/[0.04] transition-all duration-300"
    >
      <div className="p-2.5 bg-odara-primary/10 rounded-lg text-odara-primary shrink-0 group-hover:bg-odara-primary/20 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
        <p className="text-sm text-odara-muted leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
