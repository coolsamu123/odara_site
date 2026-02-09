import React, { useState } from 'react';
import { X, Bug, Lightbulb, MessageSquare } from 'lucide-react';
import { createPost } from './api';

interface Props {
  onClose: () => void;
  onCreated: () => void;
  defaultCategory?: string;
}

const CATEGORIES = [
  { key: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400' },
  { key: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-cyan-400' },
  { key: 'discussion', label: 'Discussion', icon: MessageSquare, color: 'text-indigo-400' },
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'];

const PostForm: React.FC<Props> = ({ onClose, onCreated, defaultCategory }) => {
  const [category, setCategory] = useState(defaultCategory || 'bug');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createPost({
        category,
        title,
        body,
        priority: category === 'bug' ? priority : undefined,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-xl p-8 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-odara-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">New Post</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category selector */}
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-2">Category</label>
            <div className="flex gap-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-odara-primary text-white'
                        : 'bg-white/5 text-odara-muted border border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon size={14} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-odara-muted/50 focus:outline-none focus:border-odara-primary/50 transition-colors"
              placeholder={
                category === 'bug' ? 'Describe the bug briefly...' :
                category === 'feature' ? 'What feature would you like?' :
                'What do you want to discuss?'
              }
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Description</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-odara-muted/50 focus:outline-none focus:border-odara-primary/50 transition-colors resize-y"
              placeholder={
                category === 'bug' ? 'Steps to reproduce, expected vs actual behavior...' :
                category === 'feature' ? 'Describe the feature and why it would be useful...' :
                'Share your thoughts...'
              }
            />
          </div>

          {/* Priority (only for bugs) */}
          {category === 'bug' && (
            <div>
              <label className="block text-sm font-medium text-odara-muted mb-2">Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all
                      ${priority === p
                        ? 'bg-odara-primary text-white'
                        : 'bg-white/5 text-odara-muted border border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-white/5 text-odara-muted border border-white/10 hover:bg-white/10 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-odara-primary hover:bg-odara-primary/90 text-white font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
