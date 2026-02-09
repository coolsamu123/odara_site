import React from 'react';
import { ThumbsUp } from 'lucide-react';

interface Props {
  votes: number;
  voted: boolean;
  onVote: () => void;
  disabled?: boolean;
}

const VoteButton: React.FC<Props> = ({ votes, voted, onVote, disabled }) => {
  return (
    <button
      onClick={onVote}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${voted
          ? 'bg-odara-primary/20 text-odara-primary border border-odara-primary/30'
          : 'bg-white/5 text-odara-muted border border-white/10 hover:bg-white/10 hover:text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <ThumbsUp size={14} className={voted ? 'fill-current' : ''} />
      <span>{votes}</span>
    </button>
  );
};

export default VoteButton;
