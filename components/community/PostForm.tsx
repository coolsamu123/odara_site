import React, { useState, useRef, useEffect } from 'react';
import { X, Bug, Lightbulb, MessageSquare, Image as ImageIcon, Megaphone, FileText, XCircle } from 'lucide-react';
import { createPost, uploadImage } from './api';

interface Props {
  onClose: () => void;
  onCreated: () => void;
  defaultCategory?: string;
}

const CATEGORIES = [
  { key: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400' },
  { key: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-cyan-400' },
  { key: 'discussion', label: 'Discussion', icon: MessageSquare, color: 'text-indigo-400' },
  { key: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-yellow-400' },
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'];

const PostForm: React.FC<Props> = ({ onClose, onCreated, defaultCategory }) => {
  // Use a ref to always have the *current* category value available in async handlers.
  // This avoids stale-closure issues where handleSubmit reads a outdated category from the render closure.
  const [categoryState, setCategoryState] = useState(defaultCategory || 'bug');
  const categoryRef = useRef(defaultCategory || 'bug');

  useEffect(() => {
    categoryRef.current = categoryState;
  }, [categoryState]);

  const [title, setTitle] = useState('');
  const [uploadedImages, setUploadedImages] = useState<{ name: string; url: string }[]>([]);
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file);
      // Append markdown image to body
      setBody(prev => prev + `\n![Image](${url})\n`);
      setUploadedImages(prev => [...prev, { name: file.name, url }]);
    } catch (err: any) {
      setError('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedImage = (url: string) => {
    setUploadedImages(prev => prev.filter(img => img.url !== url));
    // Also remove from body
    setBody(prev => prev.replace(`\n![Image](${url})\n`, '\n'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createPost({
        category: categoryRef.current,
        title,
        body,
        priority: categoryRef.current === 'bug' ? priority : undefined,
      });
      onClose();
      onCreated();
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
                const isActive = categoryState === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => { setCategoryState(cat.key); categoryRef.current = cat.key; }}
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
                categoryState === 'bug' ? 'Describe the bug briefly...' :
                categoryState === 'feature' ? 'What feature would you like?' :
                categoryState === 'announcement' ? 'Announcement title...' :
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
                categoryState === 'bug' ? 'Steps to reproduce, expected vs actual behavior...' :
                categoryState === 'feature' ? 'Describe the feature and why it would be useful...' :
                categoryState === 'announcement' ? 'Write your announcement here...' :
                'Share your thoughts...'
              }
            />
            {/* Uploaded image chips */}
            {uploadedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedImages.map(img => (
                  <div key={img.url} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-odara-muted">
                    <FileText size={12} className="text-odara-primary" />
                    <span className="max-w-[150px] truncate">{img.name}</span>
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(img.url)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <XCircle size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 flex justify-end">
              <label className={`
                flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors
                ${uploading ? 'bg-white/5 text-odara-muted cursor-wait' : 'bg-odara-primary/10 text-odara-primary hover:bg-odara-primary/20'}
              `}>
                <ImageIcon size={14} />
                {uploading ? 'Uploading...' : 'Add Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Priority (only for bugs) */}
          {categoryState === 'bug' && (
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
