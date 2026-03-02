import React, { useState, useMemo } from 'react';
import {
  Search, ChevronDown, ChevronRight, Lock, Wifi, Copy, Check, Server,
} from 'lucide-react';
import { API_CATEGORIES, API_BASE_URL, API_AUTH_INFO } from './apiData';
import { ApiEndpoint, ApiCategory } from './types';

// ─── Method badge colors ──────────────────────────────────
const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const METHOD_DOT: Record<string, string> = {
  GET: 'bg-emerald-400',
  POST: 'bg-blue-400',
  PUT: 'bg-amber-400',
  DELETE: 'bg-red-400',
};

// ─── Method Badge ─────────────────────────────────────────
const MethodBadge: React.FC<{ method: string }> = ({ method }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-wider border ${METHOD_STYLES[method]}`}>
    {method}
  </span>
);

// ─── Code Block ───────────────────────────────────────────
const CodeBlock: React.FC<{ code: string; label?: string }> = ({ code, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider text-odara-muted/60 font-semibold">{label}</span>
          <button onClick={handleCopy} className="text-odara-muted/40 hover:text-odara-muted transition-colors p-1 rounded">
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      )}
      <pre className="bg-black/40 rounded-lg p-3 text-xs font-mono text-odara-muted overflow-x-auto border border-white/[0.04] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ─── Single Endpoint Row ──────────────────────────────────
const EndpointRow: React.FC<{ endpoint: ApiEndpoint; isExpanded: boolean; onToggle: () => void }> = ({
  endpoint,
  isExpanded,
  onToggle,
}) => {
  const hasDetails = endpoint.description || endpoint.requestBody || endpoint.responseBody || endpoint.pathParams || endpoint.queryParams;

  return (
    <div className="border-b border-white/[0.04] last:border-0">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/[0.02] ${isExpanded ? 'bg-white/[0.02]' : ''}`}
      >
        {hasDetails ? (
          isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-odara-muted/40 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-odara-muted/40 shrink-0" />
        ) : (
          <div className="w-3.5 shrink-0" />
        )}
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-white/80 truncate">{endpoint.path}</code>
        <span className="text-sm text-odara-muted ml-auto shrink-0 hidden sm:inline">{endpoint.summary}</span>
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          {endpoint.auth && <Lock className="w-3 h-3 text-amber-400/60" title="Requires authentication" />}
          {endpoint.sse && <Wifi className="w-3 h-3 text-blue-400/60" title="Server-Sent Events" />}
        </div>
      </button>

      {isExpanded && hasDetails && (
        <div className="px-4 pb-4 pl-12 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Summary (mobile) & description */}
          <p className="text-sm text-odara-muted sm:hidden font-medium">{endpoint.summary}</p>
          {endpoint.description && (
            <p className="text-sm text-odara-muted/80 leading-relaxed">{endpoint.description}</p>
          )}

          {/* SSE badge */}
          {endpoint.sse && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <Wifi className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">Server-Sent Events (SSE) — real-time streaming response</span>
            </div>
          )}

          {/* Path Parameters */}
          {endpoint.pathParams && endpoint.pathParams.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-odara-muted/60 font-semibold">Path Parameters</span>
              <div className="mt-1.5 bg-black/20 rounded-lg border border-white/[0.04] overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="text-left px-3 py-1.5 text-odara-muted/50 font-medium">Name</th>
                      <th className="text-left px-3 py-1.5 text-odara-muted/50 font-medium">Type</th>
                      <th className="text-left px-3 py-1.5 text-odara-muted/50 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.pathParams.map((p, i) => (
                      <tr key={i} className="border-b border-white/[0.02] last:border-0">
                        <td className="px-3 py-1.5 font-mono text-odara-accent">{p.name}</td>
                        <td className="px-3 py-1.5 text-odara-muted">{p.type}</td>
                        <td className="px-3 py-1.5 text-odara-muted">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-odara-muted/60 font-semibold">Query Parameters</span>
              <div className="mt-1.5 bg-black/20 rounded-lg border border-white/[0.04] overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="text-left px-3 py-1.5 text-odara-muted/50 font-medium">Name</th>
                      <th className="text-left px-3 py-1.5 text-odara-muted/50 font-medium">Type</th>
                      <th className="text-left px-3 py-1.5 text-odara-muted/50 font-medium">Required</th>
                      <th className="text-left px-3 py-1.5 text-odara-muted/50 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.queryParams.map((p, i) => (
                      <tr key={i} className="border-b border-white/[0.02] last:border-0">
                        <td className="px-3 py-1.5 font-mono text-odara-accent">{p.name}</td>
                        <td className="px-3 py-1.5 text-odara-muted">{p.type}</td>
                        <td className="px-3 py-1.5 text-odara-muted">{p.required ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-1.5 text-odara-muted">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body */}
          {endpoint.requestBody && <CodeBlock code={endpoint.requestBody} label="Request Body" />}

          {/* Response Body */}
          {endpoint.responseBody && <CodeBlock code={endpoint.responseBody} label="Response" />}
        </div>
      )}
    </div>
  );
};

// ─── Category Section ─────────────────────────────────────
const CategorySection: React.FC<{
  category: ApiCategory;
  expandedEndpoints: Set<string>;
  onToggleEndpoint: (key: string) => void;
  isExpanded: boolean;
  onToggleCategory: () => void;
}> = ({ category, expandedEndpoints, onToggleEndpoint, isExpanded, onToggleCategory }) => {
  const endpointCounts = useMemo(() => {
    const counts: Record<string, number> = { GET: 0, POST: 0, PUT: 0, DELETE: 0 };
    category.endpoints.forEach(e => counts[e.method]++);
    return counts;
  }, [category]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      {/* Category Header */}
      <button
        onClick={onToggleCategory}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        {isExpanded
          ? <ChevronDown className="w-4 h-4 text-odara-primary shrink-0" />
          : <ChevronRight className="w-4 h-4 text-odara-muted shrink-0" />
        }
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-white">{category.name}</h4>
            <span className="text-xs text-odara-muted/50 font-mono">({category.endpoints.length})</span>
          </div>
          <p className="text-xs text-odara-muted mt-0.5 truncate">{category.description}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {Object.entries(endpointCounts).filter(([, c]) => c > 0).map(([method, count]) => (
            <span key={method} className="flex items-center gap-1 text-[10px] text-odara-muted/50">
              <span className={`w-1.5 h-1.5 rounded-full ${METHOD_DOT[method]}`} />
              {count}
            </span>
          ))}
        </div>
      </button>

      {/* Endpoints */}
      {isExpanded && (
        <div className="border-t border-white/[0.06]">
          {category.endpoints.map((endpoint, i) => {
            const key = `${category.id}-${i}`;
            return (
              <EndpointRow
                key={key}
                endpoint={endpoint}
                isExpanded={expandedEndpoints.has(key)}
                onToggle={() => onToggleEndpoint(key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main API Reference Component ─────────────────────────
const ApiReference: React.FC = () => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['auth']));
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());

  // Filter categories & endpoints by search and method
  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    return API_CATEGORIES
      .map(cat => {
        const filtered = cat.endpoints.filter(e => {
          const matchesMethod = !methodFilter || e.method === methodFilter;
          const matchesSearch = !q ||
            e.path.toLowerCase().includes(q) ||
            e.summary.toLowerCase().includes(q) ||
            (e.description || '').toLowerCase().includes(q) ||
            cat.name.toLowerCase().includes(q);
          return matchesMethod && matchesSearch;
        });
        return { ...cat, endpoints: filtered };
      })
      .filter(cat => cat.endpoints.length > 0);
  }, [search, methodFilter]);

  const totalEndpoints = useMemo(
    () => API_CATEGORIES.reduce((sum, c) => sum + c.endpoints.length, 0),
    []
  );

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoints(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(filteredCategories.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedEndpoints(new Set());
  };

  return (
    <div className="space-y-6">
      {/* ── Header Info Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-3.5 h-3.5 text-odara-primary" />
            <span className="text-[10px] uppercase tracking-wider text-odara-muted/60 font-semibold">Base URL</span>
          </div>
          <code className="text-sm font-mono text-odara-accent">{API_BASE_URL}</code>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider text-odara-muted/60 font-semibold">Authentication</span>
          </div>
          <code className="text-sm font-mono text-odara-accent">{API_AUTH_INFO.type}</code>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] uppercase tracking-wider text-odara-muted/60 font-semibold">Endpoints</span>
          </div>
          <span className="text-sm font-mono text-odara-accent">{totalEndpoints} endpoints</span>
          <span className="text-xs text-odara-muted/50 ml-1">across {API_CATEGORIES.length} categories</span>
        </div>
      </div>

      {/* ── Auth Details ── */}
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <h5 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Authentication
        </h5>
        <p className="text-xs text-odara-muted leading-relaxed mb-2">
          Most endpoints require a valid JWT token in the Authorization header. Obtain tokens via the <code className="text-amber-400/80 bg-black/20 px-1 rounded">/auth/login</code> or <code className="text-amber-400/80 bg-black/20 px-1 rounded">/auth/register</code> endpoints.
        </p>
        <CodeBlock code={`Authorization: Bearer <access_token>\n\n# Access token expires in ${API_AUTH_INFO.accessTokenExpiry}\n# Refresh token expires in ${API_AUTH_INFO.refreshTokenExpiry}`} />
      </div>

      {/* ── Error Format ── */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <h5 className="text-sm font-semibold text-white mb-2">Error Responses</h5>
        <p className="text-xs text-odara-muted leading-relaxed mb-2">
          All errors follow a consistent JSON format. HTTP status codes: <code className="text-odara-accent bg-black/20 px-1 rounded">200</code> <code className="text-odara-accent bg-black/20 px-1 rounded">201</code> <code className="text-odara-accent bg-black/20 px-1 rounded">204</code> for success, <code className="text-red-400 bg-black/20 px-1 rounded">400</code> <code className="text-red-400 bg-black/20 px-1 rounded">401</code> <code className="text-red-400 bg-black/20 px-1 rounded">403</code> <code className="text-red-400 bg-black/20 px-1 rounded">404</code> <code className="text-red-400 bg-black/20 px-1 rounded">409</code> <code className="text-red-400 bg-black/20 px-1 rounded">500</code> for errors.
        </p>
        <CodeBlock code={`{\n  "error": "Description of what went wrong"\n}`} />
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-odara-muted/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search endpoints, paths, or descriptions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/[0.06] text-sm text-white placeholder:text-odara-muted/30 focus:outline-none focus:border-odara-primary/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {['GET', 'POST', 'PUT', 'DELETE'].map(method => (
            <button
              key={method}
              onClick={() => setMethodFilter(methodFilter === method ? null : method)}
              className={`px-2.5 py-2 rounded-lg text-[11px] font-bold font-mono transition-all border ${
                methodFilter === method
                  ? METHOD_STYLES[method]
                  : 'bg-white/[0.03] text-odara-muted/50 border-white/[0.04] hover:border-white/10'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={expandAll} className="px-2.5 py-2 rounded-lg text-xs text-odara-muted/50 hover:text-white bg-white/[0.03] border border-white/[0.04] hover:border-white/10 transition-all">
            Expand
          </button>
          <button onClick={collapseAll} className="px-2.5 py-2 rounded-lg text-xs text-odara-muted/50 hover:text-white bg-white/[0.03] border border-white/[0.04] hover:border-white/10 transition-all">
            Collapse
          </button>
        </div>
      </div>

      {/* ── Results count ── */}
      {(search || methodFilter) && (
        <p className="text-xs text-odara-muted/50">
          Showing {filteredCategories.reduce((s, c) => s + c.endpoints.length, 0)} of {totalEndpoints} endpoints
          {search && <> matching "<span className="text-odara-accent">{search}</span>"</>}
          {methodFilter && <> with method <span className={METHOD_STYLES[methodFilter].split(' ')[1]}>{methodFilter}</span></>}
        </p>
      )}

      {/* ── Category Sections ── */}
      <div className="space-y-3">
        {filteredCategories.map(category => (
          <CategorySection
            key={category.id}
            category={category}
            expandedEndpoints={expandedEndpoints}
            onToggleEndpoint={toggleEndpoint}
            isExpanded={expandedCategories.has(category.id)}
            onToggleCategory={() => toggleCategory(category.id)}
          />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-8 h-8 text-odara-muted/20 mx-auto mb-3" />
          <p className="text-odara-muted/50 text-sm">No endpoints match your search.</p>
        </div>
      )}
    </div>
  );
};

export default ApiReference;
