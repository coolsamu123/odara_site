import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, PRODUCT_NAV } from '../constants';
import { Menu, X, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './community/AuthModal';
import ProfileModal from './community/ProfileModal';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const productCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, showAuthModal, openAuthModal, closeAuthModal, handleAuthSuccess, handleLogout } = useAuth();

  const openProduct = () => {
    if (productCloseTimer.current) clearTimeout(productCloseTimer.current);
    setProductOpen(true);
  };
  const closeProductSoon = () => {
    if (productCloseTimer.current) clearTimeout(productCloseTimer.current);
    productCloseTimer.current = setTimeout(() => setProductOpen(false), 150);
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
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-tighter"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            Odara ETL<span className="text-odara-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={openProduct}
              onMouseLeave={closeProductSoon}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-odara-muted hover:text-white transition-colors"
                aria-haspopup="menu"
                aria-expanded={productOpen}
              >
                Product
                <ChevronDown size={14} className={`transition-transform ${productOpen ? 'rotate-180' : ''}`} />
              </button>
              {productOpen && (
                <div
                  className="absolute left-0 top-full pt-3"
                  role="menu"
                >
                  <div className="min-w-[200px] bg-[#0F1218] border border-white/10 rounded-lg shadow-2xl py-2">
                    {PRODUCT_NAV.map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setProductOpen(false);
                          handleNavClick(item);
                        }}
                        className="block px-4 py-2 text-sm text-odara-muted hover:text-white hover:bg-white/5 transition-colors"
                        role="menuitem"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                {user.role === 'admin' && (
                  <Link
                    to="/admin/downloads"
                    className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-1.5 text-sm text-odara-muted hover:text-white transition-colors"
                >
                  <User size={14} />
                  {user.name}
                </button>
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0B0E14] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl overflow-y-auto max-h-[80vh]">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-odara-muted/60">Product</span>
              {PRODUCT_NAV.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="pl-3 text-base font-medium text-odara-muted hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
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
            </div>

            {/* Auth controls */}
            <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/downloads"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-1.5 text-lg font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { setShowProfileModal(true); setMobileMenuOpen(false); }}
                    className="flex items-center gap-1.5 text-lg font-medium text-odara-muted hover:text-white"
                  >
                    <User size={16} />
                    {user.name}
                  </button>
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

      {location.pathname !== '/docs' && <Footer />}

      {showAuthModal && (
        <AuthModal
          onClose={closeAuthModal}
          onAuth={handleAuthSuccess}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default Layout;
