import React, { useEffect, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import AIDemo from '../components/AIDemo';
import Features from '../components/Features';
import APISection from '../components/APISection';
import NodeExplorer from '../components/NodeExplorer';
import FreeTier from '../components/FreeTier';
import Tutorials from '../components/Tutorials';

// TechSpecs pulls in recharts (~heavy); it's below the fold, so load it lazily
// to keep it out of the initial bundle.
const TechSpecs = lazy(() => import('../components/TechSpecs'));

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
      <APISection />
      <NodeExplorer />
      <Suspense fallback={<div className="py-32" />}>
        <TechSpecs />
      </Suspense>
      <Tutorials />
      <FreeTier />
    </>
  );
};

export default LandingPage;
