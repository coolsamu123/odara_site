import React, { useState, useEffect } from 'react';
import { Plus, LogIn, LogOut, User } from 'lucide-react';
import { listPosts, toggleVote, getCurrentUser, isLoggedIn, logout } from './api';
import CategoryTabs from './CategoryTabs';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import PostForm from './PostForm';
import AuthModal from './AuthModal';
import CommunityStats from './CommunityStats';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(getCurrentUser());
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await listPosts(category || undefined);
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [category]);

  const handleVote = async (postId: number) => {
    if (!isLoggedIn()) {
      setShowAuth(true);
      return;
    }
    try {
      const result = await toggleVote(postId);
      setPosts(prev =>
        prev.map(p => p.id === postId ? { ...p, votes: result.total_votes } : p)
      );
    } catch (err) {
      console.error('Vote failed', err);
    }
  };

  const handleNewPost = () => {
    if (!isLoggedIn()) {
      setShowAuth(true);
      return;
    }
    setShowPostForm(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleAuth = (userData: any) => {
    setUser(userData);
  };

  // Show post detail view
  if (selectedPostId !== null) {
    return (
      <section id="community-hub" className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <PostDetail
            postId={selectedPostId}
            onBack={() => { setSelectedPostId(null); fetchPosts(); }}
            currentUser={user}
          />
        </div>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
      </section>
    );
  }

  // Main community list view
  return (
    <section id="community-hub" className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-odara-primary/10 border border-odara-primary/20 text-sm text-odara-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-odara-primary animate-pulse"></span>
            Community
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-3">
            Odara's <span className="gradient-text">Community</span>
          </h2>
          <p className="text-odara-muted max-w-xl mx-auto">
            Report bugs, request features, share knowledge, and help shape the future of Odara.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <CommunityStats />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <CategoryTabs active={category} onChange={setCategory} />

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-odara-muted flex items-center gap-1.5">
                  <User size={14} />
                  @{user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-odara-muted bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <LogIn size={14} />
                Sign In
              </button>
            )}

            <button
              onClick={handleNewPost}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-odara-primary hover:bg-odara-primary/90 transition-all"
            >
              <Plus size={14} />
              New Post
            </button>
          </div>
        </div>

        {/* Posts list */}
        {loading ? (
          <div className="text-center py-20 text-odara-muted">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-odara-muted mb-4">No posts yet. Be the first to contribute!</p>
            <button
              onClick={handleNewPost}
              className="px-6 py-2.5 rounded-lg bg-odara-primary hover:bg-odara-primary/90 text-white font-medium transition-all"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onSelect={setSelectedPostId}
                onVote={handleVote}
                isLoggedIn={isLoggedIn()}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showPostForm && (
        <PostForm
          onClose={() => setShowPostForm(false)}
          onCreated={fetchPosts}
          defaultCategory={category || undefined}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
    </section>
  );
};

export default CommunityPage;
