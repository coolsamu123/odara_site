import React from 'react';
import { Bug, Lightbulb, MessageSquare, Megaphone } from 'lucide-react';

const TABS = [
  { key: '', label: 'All', icon: null },
  { key: 'bug', label: 'Bugs', icon: Bug },
  { key: 'feature', label: 'Features', icon: Lightbulb },
  { key: 'discussion', label: 'Discussions', icon: MessageSquare },
  { key: 'announcement', label: 'Announcements', icon: Megaphone },
];

interface Props {
  active: string;
  onChange: (category: string) => void;
}

const CategoryTabs: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map(tab => {
        const isActive = active === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isActive
                ? 'bg-odara-primary text-white'
                : 'bg-white/5 text-odara-muted border border-white/10 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            {Icon && <Icon size={14} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
