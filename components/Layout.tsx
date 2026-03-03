import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './community/AuthModal';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, showAuthModal, openAuthModal, closeAuthModal, handleAuthSuccess, handleLogout } = useAuth();

  const handleTryIt = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavClick = (item: typeof NAV_ITEMS[number]) => {
    setMobileMenuOpen(false);

    if (item.isRoute) return; // Let <Link> handle it

    // Anchor link: if we're on a sub-page, navigate home with scrollTo state
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: item.href } });
    } else {
      // On landing page: scroll programmatically (hash anchors don't work with HashRouter)
      const id = item.href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen text-odara-text selection:bg-odara-primary/30">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-odara-dark/90 backdrop-blur-md border-b border-white/5 py-4'
            : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tighter">
            Odara ETL<span className="text-odara-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm font-medium text-odara-muted hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                  className="text-sm font-medium text-odara-muted hover:text-white transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              )
            )}

            {/* Auth controls */}
            {isAuthenticated ? (
              <>
                <span className="text-sm text-odara-muted flex items-center gap-1.5">
                  <User size={14} />
                  @{user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-odara-muted hover:text-white transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 text-sm text-odara-muted hover:text-white transition-colors"
              >
                <LogIn size={14} />
                Sign In
              </button>
            )}

            <a
              href="http://65.21.199.249:5175/"
              target="_blank"
              rel="noreferrer"
              onClick={handleTryIt}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-sm font-medium transition-all"
            >
              Try it!
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0B0E14] border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto max-h-[80vh]">
            {NAV_ITEMS.map(item =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-lg font-medium text-odara-muted hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href="#"
                  className="text-lg font-medium text-odara-muted hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                >
                  {item.label}
                </a>
              )
            )}

            {/* Try it! */}
            <a
              href="http://65.21.199.249:5175/"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  openAuthModal();
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              className="text-lg font-medium text-odara-muted hover:text-white"
            >
              Try it!
            </a>

            {/* Auth controls */}
            <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-odara-muted flex items-center gap-1.5">
                    <User size={14} />
                    @{user.username}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-lg font-medium text-odara-muted hover:text-white"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="flex items-center gap-1.5 text-lg font-medium text-odara-muted hover:text-white"
                >
                  <LogIn size={16} />
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <Footer />

      {showAuthModal && (
        <AuthModal
          onClose={closeAuthModal}
          onAuth={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default Layout;
