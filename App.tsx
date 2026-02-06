import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Features from './components/Features';
import NodeExplorer from './components/NodeExplorer';
import TechSpecs from './components/TechSpecs';
import FreeTier from './components/FreeTier';
import Footer from './components/Footer';
import AIDemo from './components/AIDemo';
import Audience from './components/Audience';
import { NAV_ITEMS } from './constants';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-odara-text selection:bg-odara-primary/30">
      
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-odara-dark/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tighter">
                Odara<span className="text-odara-primary">.</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
                {NAV_ITEMS.map(item => (
                    <a 
                        key={item.label} 
                        href={item.href} 
                        className="text-sm font-medium text-odara-muted hover:text-white transition-colors"
                    >
                        {item.label}
                    </a>
                ))}
                <a 
                    href="https://github.com/odara/community" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-sm font-medium transition-all"
                >
                    GitHub
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
                 {NAV_ITEMS.map(item => (
                    <a 
                        key={item.label} 
                        href={item.href} 
                        className="text-lg font-medium text-odara-muted hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        )}
      </nav>

      <main>
        <Hero />
        <ProductShowcase />
        <AIDemo />
        <Features />
        <Audience />
        <NodeExplorer />
        <TechSpecs />
        <FreeTier />
      </main>

      <Footer />
    </div>
  );
};

export default App;