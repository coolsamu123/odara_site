import React from 'react';
import { Clock } from 'lucide-react';
import { DOC_SECTIONS, SECTION_CONTENT } from './data';
import FeatureCard from './FeatureCard';
import ScreenshotGallery from './ScreenshotGallery';
import NodeCatalog from './NodeCatalog';

interface DocsContentProps {
  activeSection: string;
}

const DocsContent: React.FC<DocsContentProps> = ({ activeSection }) => {
  const section = DOC_SECTIONS.find(s => s.id === activeSection);
  const content = SECTION_CONTENT[activeSection];

  if (!section || !content) return null;

  const Icon = section.icon;

  // Node catalog gets its own special renderer
  if (activeSection === 'nodes') {
    return (
      <div className="flex-1 min-w-0">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-odara-primary/10 rounded-xl">
              <Icon className="w-6 h-6 text-odara-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white">{section.label}</h3>
          </div>
          <p className="text-odara-muted leading-relaxed">{content.overview}</p>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-odara-muted/60 mb-4">Categories</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.features.map((f, i) => (
              <FeatureCard key={i} feature={f} index={i} />
            ))}
          </div>
        </div>

        {/* Full Node Catalog */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-odara-muted/60 mb-4">Browse All Nodes</h4>
          <NodeCatalog />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-odara-primary/10 rounded-xl">
            <Icon className="w-6 h-6 text-odara-primary" />
          </div>
          <h3 className="text-2xl font-bold text-white">{section.label}</h3>
          {section.comingSoon && (
            <span className="px-2.5 py-1 rounded-full bg-odara-warning/10 text-odara-warning text-xs font-bold border border-odara-warning/20">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-odara-muted leading-relaxed">{content.overview}</p>
      </div>

      {/* Coming Soon placeholder */}
      {section.comingSoon && (
        <div className="mb-8 p-8 rounded-xl border border-dashed border-odara-warning/20 bg-odara-warning/5 text-center">
          <Clock className="w-10 h-10 text-odara-warning/40 mx-auto mb-3" />
          <p className="text-odara-warning/70 font-medium">This feature is under active development.</p>
          <p className="text-sm text-odara-muted mt-1">Stay tuned for updates in the Community section.</p>
        </div>
      )}

      {/* Screenshots */}
      {content.screenshots.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-odara-muted/60 mb-4">Screenshots</h4>
          <ScreenshotGallery screenshots={content.screenshots} />
        </div>
      )}

      {/* Key Features */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-odara-muted/60 mb-4">Key Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {content.features.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      {content.shortcuts && content.shortcuts.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-odara-muted/60 mb-4">Keyboard Shortcuts</h4>
          <div className="bg-odara-dark rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-odara-muted uppercase tracking-wider">Keys</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-odara-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {content.shortcuts.map((s, i) => (
                  <tr key={i} className="border-b border-white/[0.03] last:border-0">
                    <td className="px-4 py-2.5">
                      <code className="text-xs px-2 py-1 bg-white/5 rounded text-odara-accent font-mono">{s.keys}</code>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-odara-muted">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subsections */}
      {content.subsections && content.subsections.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-odara-muted/60 mb-4">Details</h4>
          <div className="space-y-4">
            {content.subsections.map((sub, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <h5 className="font-semibold text-white mb-2">{sub.title}</h5>
                <p className="text-sm text-odara-muted leading-relaxed">{sub.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocsContent;
