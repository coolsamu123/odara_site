import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// @ts-expect-error — loaded via the import map (esm.sh)
import { marked } from 'https://esm.sh/marked@12';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';

/**
 * Renders a walkthrough tutorial.
 *
 * Loads `/tutorials/<slug>/index.md`, strips the YAML frontmatter,
 * rewrites relative image URLs so they resolve under the tutorial
 * folder, parses with marked, and applies a typography pass on top of
 * the existing dark theme.
 */

interface Frontmatter {
  title?: string;
  estimated_min?: number;
  last_updated?: string;
}

function splitFrontmatter(raw: string): { fm: Frontmatter; body: string } {
  if (!raw.startsWith('---')) return { fm: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end < 0) return { fm: {}, body: raw };
  const yaml = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trimStart();
  const fm: Frontmatter = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^([a-z_]+):\s*(.+)$/i);
    if (!m) continue;
    const key = m[1] as keyof Frontmatter;
    let val: string | number = m[2].trim();
    if (val.startsWith('"') || val.startsWith("'")) val = val.slice(1, -1);
    if (key === 'estimated_min') val = Number(val);
    (fm as Record<string, unknown>)[key] = val;
  }
  return { fm, body };
}

const TutorialReader: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'ok'; fm: Frontmatter; html: string }
    | { kind: 'error'; message: string }
  >({ kind: 'loading' });

  useEffect(() => {
    if (!slug) {
      setState({ kind: 'error', message: 'Missing tutorial slug.' });
      return;
    }
    let cancelled = false;
    const base = `/tutorial-assets/${slug}/`;

    (async () => {
      try {
        // Cache-bust the markdown itself — frontmatter changes drive
        // everything else, so we never want a stale index.md from the CDN.
        const res = await fetch(base + 'index.md?v=' + Date.now());
        if (!res.ok) throw new Error(`HTTP ${res.status} loading tutorial`);
        const raw = await res.text();
        const { fm, body } = splitFrontmatter(raw);
        // Tie image URLs to the tutorial's last_updated stamp so a content
        // update invalidates the CDN cache for every screenshot in one go.
        const ver = fm.last_updated ? `?v=${encodeURIComponent(fm.last_updated)}` : '';
        // Rewrite relative links under ./screenshots/, screenshots/, ./files/,
        // and files/ to absolute tutorial-asset URLs (?v=… busts the CDN).
        const rewritten = body
          .replace(/\]\(\.\/((?:screenshots|files)\/[^)]+)\)/g, `](${base}$1${ver})`)
          .replace(/\]\((screenshots|files)\/([^)]+)\)/g, `](${base}$1/$2${ver})`);
        const html = await marked.parse(rewritten, { gfm: true, breaks: false });
        if (!cancelled) setState({ kind: 'ok', fm, html });
      } catch (e) {
        if (!cancelled) setState({ kind: 'error', message: (e as Error).message });
      }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-odara-text pt-28 pb-32">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link
          to="/tutorials"
          className="inline-flex items-center gap-1.5 text-sm text-odara-muted hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All tutorials
        </Link>

        {state.kind === 'loading' && (
          <p className="text-odara-muted">Loading…</p>
        )}

        {state.kind === 'error' && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <p className="text-red-300 font-semibold mb-1">Tutorial not found</p>
            <p className="text-odara-muted text-sm">{state.message}</p>
          </div>
        )}

        {state.kind === 'ok' && (
          <article>
            {/* Header */}
            <div className="mb-10 pb-8 border-b border-white/10">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-odara-primary/10 text-odara-primary text-xs font-bold tracking-widest uppercase border border-odara-primary/20">
                <BookOpen className="w-3.5 h-3.5" />
                Walkthrough
              </div>
              {state.fm.title && (
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4 leading-tight">
                  {state.fm.title}
                </h1>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-odara-muted">
                {state.fm.estimated_min && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {state.fm.estimated_min} min read
                  </span>
                )}
                {state.fm.last_updated && (
                  <span>Last updated {state.fm.last_updated}</span>
                )}
              </div>
            </div>

            <div
              className="tutorial-body"
              dangerouslySetInnerHTML={{ __html: state.html }}
            />
          </article>
        )}
      </div>

      {/* Typography pass — scoped to .tutorial-body inside this page */}
      <style>{`
        .tutorial-body { color: #cbd5e1; font-size: 1.0625rem; line-height: 1.7; }
        .tutorial-body > * + * { margin-top: 1.1em; }
        .tutorial-body h1, .tutorial-body h2, .tutorial-body h3, .tutorial-body h4 {
          color: #f8fafc; font-weight: 700; letter-spacing: -0.015em;
        }
        .tutorial-body h1 { font-size: 2.25rem; margin-top: 2.2em; line-height: 1.15; }
        .tutorial-body h2 { font-size: 1.75rem; margin-top: 2.4em; padding-bottom: 0.4em; border-bottom: 1px solid rgba(255,255,255,0.08); line-height: 1.2; }
        .tutorial-body h3 { font-size: 1.25rem; margin-top: 1.8em; }
        .tutorial-body a { color: #818cf8; text-decoration: underline; text-decoration-color: rgba(129,140,248,0.4); text-underline-offset: 3px; transition: text-decoration-color 160ms; }
        .tutorial-body a:hover { text-decoration-color: #a5b4fc; }
        .tutorial-body strong { color: #f8fafc; font-weight: 600; }
        .tutorial-body code {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
          padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.875em;
          color: #c7d2fe; font-family: 'Fira Code', ui-monospace, monospace;
        }
        .tutorial-body pre {
          background: #11141B; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
          padding: 1em 1.25em; overflow-x: auto; font-size: 0.875rem; line-height: 1.55;
        }
        .tutorial-body pre code { background: transparent; border: none; padding: 0; color: #e8ecf2; }
        .tutorial-body blockquote {
          border-left: 3px solid #6366f1; padding: 0.4em 1.1em; margin: 1.6em 0;
          background: rgba(99,102,241,0.06); border-radius: 0 8px 8px 0;
          color: #cbd5e1; font-style: italic;
        }
        .tutorial-body blockquote p { margin: 0; }
        .tutorial-body img {
          display: block; max-width: 100%; height: auto;
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);
          margin: 1.8em 0; box-shadow: 0 12px 32px -16px rgba(0,0,0,0.6);
        }
        .tutorial-body ul, .tutorial-body ol { padding-left: 1.4em; }
        .tutorial-body ul { list-style: disc; }
        .tutorial-body ol { list-style: decimal; }
        .tutorial-body li { margin-top: 0.3em; }
        .tutorial-body li::marker { color: #6366f1; }
        .tutorial-body table {
          width: 100%; border-collapse: collapse; margin: 1.6em 0;
          font-size: 0.9375rem; border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .tutorial-body th, .tutorial-body td {
          padding: 0.7em 1em; text-align: left; vertical-align: top;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .tutorial-body th { background: rgba(255,255,255,0.04); color: #f8fafc; font-weight: 600; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .tutorial-body tr:last-child td { border-bottom: none; }
        .tutorial-body hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2.4em 0; }
      `}</style>
    </div>
  );
};

export default TutorialReader;
