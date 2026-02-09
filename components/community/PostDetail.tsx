import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MessageSquare, Trash2, Send } from 'lucide-react';
import { getPost, createComment, deleteComment, toggleVote, deletePost } from './api';
import StatusBadge from './StatusBadge';
import VoteButton from './VoteButton';

interface Props {
  postId: number;
  onBack: () => void;
  currentUser: any;
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

const PostDetail: React.FC<Props> = ({ postId, onBack, currentUser }) => {
  const [post, setPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      const data = await getPost(postId);
      setPost(data);
    } catch (err) {
      console.error('Failed to fetch post', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPost(); }, [postId]);

  const handleVote = async () => {
    if (!currentUser) return;
    try {
      const result = await toggleVote(postId);
      setPost((prev: any) => prev ? { ...prev, votes: result.total_votes, user_voted: result.voted } : prev);
    } catch (err) {
      console.error('Vote failed', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await createComment(postId, commentText);
      setCommentText('');
      fetchPost();
    } catch (err) {
      console.error('Comment failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      fetchPost();
    } catch (err) {
      console.error('Delete comment failed', err);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      onBack();
    } catch (err) {
      console.error('Delete post failed', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-odara-muted">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-odara-muted">
        Post not found.
        <button onClick={onBack} className="text-odara-primary hover:underline ml-2">Go back</button>
      </div>
    );
  }

  const canDelete = currentUser && (currentUser.id === post.author_id || currentUser.role === 'admin');

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-odara-muted hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to posts
      </button>

      {/* Post */}
      <div className="glass-panel rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <StatusBadge type="category" value={post.category} />
              <StatusBadge type="status" value={post.status} />
              {post.priority && <StatusBadge type="priority" value={post.priority} />}
            </div>

            <h1 className="text-2xl font-bold text-white mb-3">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-odara-muted mb-4">
              <span className="font-medium text-white/70">@{post.author_username}</span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {timeAgo(post.created_at)}
              </span>
            </div>

            <div className="text-odara-muted leading-relaxed whitespace-pre-wrap">
              {post.body}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <VoteButton
              votes={post.votes}
              voted={post.user_voted}
              onVote={handleVote}
              disabled={!currentUser}
            />
            {canDelete && (
              <button
                onClick={handleDeletePost}
                className="text-red-400/60 hover:text-red-400 transition-colors p-1"
                title="Delete post"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare size={18} />
          Comments ({post.comments.length})
        </h2>

        {post.comments.length === 0 && (
          <p className="text-odara-muted text-sm py-4">No comments yet. Be the first to reply!</p>
        )}

        <div className="space-y-3">
          {post.comments.map((comment: any) => {
            const canDeleteComment = currentUser && (currentUser.id === comment.author_id || currentUser.role === 'admin');
            return (
              <div key={comment.id} className="glass-panel rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-white">@{comment.author_username}</span>
                    <span className="text-odara-muted flex items-center gap-1">
                      <Clock size={12} />
                      {timeAgo(comment.created_at)}
                    </span>
                  </div>
                  {canDeleteComment && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-400/40 hover:text-red-400 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-odara-muted text-sm whitespace-pre-wrap">{comment.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comment form */}
      {currentUser ? (
        <form onSubmit={handleComment} className="glass-panel rounded-xl p-4 flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-odara-muted/50 focus:outline-none focus:border-odara-primary/50 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="px-4 py-2.5 rounded-lg bg-odara-primary hover:bg-odara-primary/90 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={14} />
            Send
          </button>
        </form>
      ) : (
        <div className="glass-panel rounded-xl p-4 text-center text-odara-muted text-sm">
          Sign in to comment
        </div>
      )}
    </div>
  );
};

export default PostDetail;
