import React from 'react';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  open: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  in_progress: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  resolved: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  closed: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  bug: { bg: 'bg-red-500/20', text: 'text-red-400' },
  feature: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  discussion: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  announcement: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  low: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  high: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  critical: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

interface Props {
  type: 'status' | 'category' | 'priority';
  value: string;
}

const StatusBadge: React.FC<Props> = ({ type, value }) => {
  const styles =
    type === 'status' ? STATUS_STYLES :
    type === 'category' ? CATEGORY_STYLES :
    PRIORITY_STYLES;

  const style = styles[value] || { bg: 'bg-gray-500/20', text: 'text-gray-400' };
  const label = value.replace('_', ' ');

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${style.bg} ${style.text}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
