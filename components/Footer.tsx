import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Docs', to: '/docs' },
  { label: 'Tutorials', to: '/tutorials' },
  { label: 'Community', to: '/community' },
  { label: 'Download', to: '/download' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-odara-dark border-t border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
            <h4 className="text-2xl font-bold gradient-text">Odara</h4>

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-odara-muted hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <a
              href="mailto:info@odara.rs"
              className="flex items-center gap-2 text-sm text-odara-muted hover:text-white transition-colors"
            >
              <Mail size={16} />
              info@odara.rs
            </a>

            <p className="text-xs text-odara-muted">
                © 2026 Odara ETL
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;