import React from 'react';
import { Github, Twitter, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-odara-dark border-t border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold gradient-text mb-2">Odara</h4>
                <p className="text-sm text-odara-muted">
                    © 2026 Odara Data Systems. <br /> Open Source under Apache 2.0.
                </p>
            </div>
            
            <div className="flex gap-6">
                <a href="#" className="text-odara-muted hover:text-white transition-colors">
                    <Github size={24} />
                </a>
                <a href="#" className="text-odara-muted hover:text-white transition-colors">
                    <Twitter size={24} />
                </a>
                <a href="#" className="text-odara-muted hover:text-white transition-colors">
                    <MessageCircle size={24} />
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;