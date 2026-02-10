import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Menu, X } from 'lucide-react';
import Footer from './Footer';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    }
    // If already on landing page, browser handles the hash anchor natively
  };

  return (
    <div className="min-h-screen text-odara-text selection:bg-odara-primary/30">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
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
                  href={location.pathname === '/' ? item.href : undefined}
                  onClick={
                    location.pathname !== '/'
                      ? (e) => {
                          e.preventDefault();
                          handleNavClick(item);
                        }
                      : undefined
                  }
                  className="text-sm font-medium text-odara-muted hover:text-white transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              )
            )}
            <a
              href="http://65.21.199.249:5175/"
              target="_blank"
              rel="noreferrer"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-odara-dark border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
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
                  href={location.pathname === '/' ? item.href : undefined}
                  className="text-lg font-medium text-odara-muted hover:text-white"
                  onClick={(e) => {
                    if (location.pathname !== '/') {
                      e.preventDefault();
                    }
                    handleNavClick(item);
                  }}
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
