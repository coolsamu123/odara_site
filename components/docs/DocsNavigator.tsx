import React from 'react';
import { DOC_SECTIONS } from './data';

interface DocsNavigatorProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const DocsNavigator: React.FC<DocsNavigatorProps> = ({ activeSection, onSectionChange }) => {
  return (
    <>
      {/* Desktop: sticky sidebar */}
      <nav className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-odara-muted/50 font-semibold mb-3 px-3">Sections</p>
          {DOC_SECTIONS.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-odara-primary/10 border border-odara-primary/20 text-white'
                    : 'text-odara-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-odara-primary' : 'text-odara-muted group-hover:text-white'}`} />
                <div className="min-w-0">
                  <span className="text-sm font-medium block truncate">{section.label}</span>
                </div>
                {section.comingSoon && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-odara-warning/10 text-odara-warning font-bold shrink-0">
                    SOON
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile: horizontal scrollable tabs */}
      <div className="lg:hidden overflow-x-auto -mx-6 px-6 mb-6">
        <div className="flex gap-2 min-w-max pb-2">
          {DOC_SECTIONS.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-odara-primary text-white shadow-lg shadow-odara-primary/20'
                    : 'bg-white/5 text-odara-muted hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {section.label}
                {section.comingSoon && (
                  <span className="text-[8px] px-1 py-0.5 rounded bg-odara-warning/20 text-odara-warning font-bold">
                    SOON
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DocsNavigator;
