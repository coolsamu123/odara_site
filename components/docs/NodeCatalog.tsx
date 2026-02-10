import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { FULL_NODE_CATALOG, NODE_CATEGORIES, NODE_SUBCATEGORIES } from './data';

const NodeCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<typeof NODE_CATEGORIES[number]>('All');
  const [activeSubcategory, setActiveSubcategory] = useState<typeof NODE_SUBCATEGORIES[number]>('All');
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const filteredNodes = useMemo(() => {
    return FULL_NODE_CATALOG.filter(node => {
      const matchesSearch = searchQuery === '' ||
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || node.category === activeCategory;
      const matchesSubcategory = activeSubcategory === 'All' || node.subcategory === activeSubcategory;
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [searchQuery, activeCategory, activeSubcategory]);

  const subcategories = useMemo(() => {
    if (activeCategory === 'All') return NODE_SUBCATEGORIES;
    const subs = new Set(
      FULL_NODE_CATALOG.filter(n => n.category === activeCategory).map(n => n.subcategory)
    );
    return ['All', ...Array.from(subs)] as typeof NODE_SUBCATEGORIES[number][];
  }, [activeCategory]);

  const categoryColors: Record<string, string> = {
    Source: 'text-odara-accent',
    Transform: 'text-odara-primary',
    Target: 'text-odara-success',
    Control: 'text-odara-warning',
  };

  return (
    <div>
      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-odara-muted" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-odara-dark border border-white/10 rounded-lg text-white text-sm placeholder:text-odara-muted/50 focus:border-odara-primary/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {NODE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveSubcategory('All'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-odara-primary text-white shadow-lg shadow-odara-primary/20'
                  : 'bg-white/5 text-odara-muted hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {subcategories.length > 2 && (
          <div className="flex flex-wrap gap-1.5">
            {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  activeSubcategory === sub
                    ? 'bg-odara-accent/20 text-odara-accent border border-odara-accent/30'
                    : 'bg-white/[0.03] text-odara-muted/70 hover:text-odara-muted border border-transparent'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <p className="text-xs text-odara-muted mb-4">{filteredNodes.length} nodes</p>

      {/* Node Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredNodes.map(node => {
          const Icon = node.icon;
          const isExpanded = expandedNode === node.id;

          return (
            <button
              key={node.id}
              onClick={() => setExpandedNode(isExpanded ? null : node.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                isExpanded
                  ? 'bg-odara-card border-odara-primary/30 shadow-lg shadow-odara-primary/5'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-odara-dark shrink-0 ${categoryColors[node.category] || 'text-odara-muted'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium text-sm text-white truncate">{node.name}</h4>
                    <span className={`text-[9px] uppercase tracking-wider font-bold shrink-0 ${categoryColors[node.category] || 'text-odara-muted/50'}`}>
                      {node.subcategory}
                    </span>
                  </div>
                  <p className="text-xs text-odara-muted mt-0.5 line-clamp-2">{node.description}</p>

                  {isExpanded && node.configHighlights && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-[10px] uppercase tracking-wider text-odara-muted/50 mb-2 font-semibold">Configuration</p>
                      <div className="flex flex-wrap gap-1.5">
                        {node.configHighlights.map((h, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 bg-white/5 text-odara-muted rounded border border-white/5">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredNodes.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-8 h-8 text-odara-muted/30 mx-auto mb-3" />
          <p className="text-odara-muted">No nodes match your search.</p>
        </div>
      )}
    </div>
  );
};

export default NodeCatalog;
