import React, { useState, useEffect } from 'react';
import { Users, FileText, Bug, CheckCircle } from 'lucide-react';
import { getStats } from './api';

const CommunityStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return null;

  const items = [
    { label: 'Members', value: stats.members, icon: Users, color: 'text-odara-primary' },
    { label: 'Posts', value: stats.total_posts, icon: FileText, color: 'text-odara-accent' },
    { label: 'Open Bugs', value: stats.open_bugs, icon: Bug, color: 'text-red-400' },
    { label: 'Resolved', value: stats.resolved_bugs, icon: CheckCircle, color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="glass-panel rounded-xl p-4 text-center">
            <Icon size={20} className={`mx-auto mb-2 ${item.color}`} />
            <div className="text-2xl font-bold text-white">{item.value}</div>
            <div className="text-xs text-odara-muted mt-1">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default CommunityStats;
