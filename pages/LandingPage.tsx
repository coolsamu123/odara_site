import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import AIDemo from '../components/AIDemo';
import Features from '../components/Features';
import Audience from '../components/Audience';
import NodeExplorer from '../components/NodeExplorer';
import TechSpecs from '../components/TechSpecs';
import FreeTier from '../components/FreeTier';

const LandingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      // Small delay to let the DOM render
      const timer = setTimeout(() => {
        const id = state.scrollTo!.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear state so back-navigation doesn't re-scroll
      window.history.replaceState({}, '');
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <ProductShowcase />
      <AIDemo />
      <Features />
      <Audience />
      <NodeExplorer />
      <TechSpecs />
      <FreeTier />
    </>
  );
};

export default LandingPage;
