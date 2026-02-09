import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import VoteButton from './VoteButton';

interface Post {
  id: number;
  author_username: string;
  category: string;
  title: string;
  body: string;
  status: string;
  priority: string | null;
  votes: number;
  comment_count: number;
  created_at: string;
}

interface Props {
  post: Post;
  onSelect: (id: number) => void;
  onVote: (id: number) => void;
  isLoggedIn: boolean;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr + 'Z');
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

const PostCard: React.FC<Props> = ({ post, onSelect, onVote, isLoggedIn }) => {
  return (
    <div
      className="glass-panel rounded-xl p-5 hover:border-white/10 transition-all cursor-pointer group"
      onClick={() => onSelect(post.id)}
    >
      <div className="flex items-start gap-4">
        {/* Vote column */}
        <div className="flex-shrink-0 pt-1" onClick={e => e.stopPropagation()}>
          <VoteButton
            votes={post.votes}
            voted={false}
            onVote={() => onVote(post.id)}
            disabled={!isLoggedIn}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge type="category" value={post.category} />
            <StatusBadge type="status" value={post.status} />
            {post.priority && <StatusBadge type="priority" value={post.priority} />}
          </div>

          <h3 className="text-white font-semibold text-lg group-hover:text-odara-primary transition-colors truncate">
            {post.title}
          </h3>

          <p className="text-odara-muted text-sm mt-1 line-clamp-2">
            {post.body}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-odara-muted">
            <span className="font-medium text-white/70">@{post.author_username}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {timeAgo(post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              {post.comment_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
