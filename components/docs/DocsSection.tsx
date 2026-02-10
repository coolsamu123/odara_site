import React, { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import DocsNavigator from './DocsNavigator';
import DocsContent from './DocsContent';
import { DOC_SECTIONS } from './data';

const DocsSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState(DOC_SECTIONS[0].id);

  return (
    <section id="docs" className="py-24 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-odara-primary/5 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-[300px] h-[300px] bg-odara-accent/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-odara-primary/10 border border-odara-primary/20 mb-6">
            <BookOpen className="w-4 h-4 text-odara-primary" />
            <span className="text-sm font-medium text-odara-primary">Product Guide</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Everything you need to know.
          </h2>
          <p className="text-odara-muted text-lg max-w-2xl mx-auto">
            Explore every feature of the platform — from the visual editor and 70+ connectors
            to orchestration, streaming, and monitoring.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-8 items-start">
          <DocsNavigator
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <DocsContent activeSection={activeSection} />
        </div>
      </div>
    </section>
  );
};

export default DocsSection;
