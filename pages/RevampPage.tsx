import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, Copy, Terminal, Bot, Layers, Activity,
  ArrowRightLeft, ShieldCheck, Zap, Sparkles, ChevronRight,
} from 'lucide-react';

/**
 * /revamp_1 — design pilot. A bold, Linear/Stripe-tier landing for Odara.
 * Self-contained (own nav/footer, own motion). Does not touch the live site.
 */

// Brand gradient used across the page.
const GRADIENT = 'linear-gradient(110deg, #a5b4fc 0%, #6366f1 38%, #22d3ee 100%)';

const CONNECTORS = [
  'PostgreSQL', 'MySQL', 'SQL Server', 'SQLite', 'MongoDB', 'Snowflake',
  'BigQuery', 'ClickHouse', 'Oracle', 'DuckDB', 'Amazon S3', 'Azure Blob',
  'Google Drive', 'SFTP', 'REST', 'CSV', 'Excel', 'XML', 'Python', 'Apache Arrow',
  'Claude', 'Gemini', 'DeepSeek', 'Git', 'SMTP',
];

const FEATURES = [
  { title: 'AI-First Code Generation', desc: 'Describe a transformation in plain English. Odara writes the SQL, Python, or the whole pipeline — powered by Claude, Gemini and OpenAI.', icon: Bot, span: 'lg:col-span-2' },
  { title: 'Visual Pipeline Editor', desc: 'Drag-and-drop canvas with multi-tab, auto-save and 50-step undo/redo.', icon: Layers, span: '' },
  { title: 'Rust Core', desc: 'Axum, DataFusion and Tokio under the hood — memory-safe and blazing fast.', icon: Zap, span: '' },
  { title: 'Maestros', desc: 'Orchestrate parallel, series and conditional execution paths.', icon: ArrowRightLeft, span: '' },
  { title: 'Data Quality', desc: 'Built-in tests for NULLs, uniqueness, regex and custom expressions.', icon: ShieldCheck, span: '' },
  { title: 'Monitoring', desc: 'Real-time observability — pipeline runs, node-level metrics and system health.', icon: Activity, span: 'lg:col-span-2' },
];

const AI_EXAMPLES = [
  { label: 'SQL', prompt: 'Remove duplicate customers by email', code: 'SELECT DISTINCT ON (email) *\nFROM input\nORDER BY email, created_at DESC' },
  { label: 'Aggregate', prompt: 'Total sales by region for Q4', code: 'SELECT region, SUM(amount) AS total\nFROM input\nWHERE quarter = 4\nGROUP BY region' },
  { label: 'Python', prompt: 'Extract the email domain', code: "import re\n\ndef transform(row):\n    m = re.search(r'@([\\w.-]+)', row['email'])\n    return { **row, 'domain': m.group(1) if m else None }" },
];

const STATS = [
  { value: '70+', label: 'Built-in connectors' },
  { value: '100%', label: 'Free & self-hosted' },
  { value: 'Rust', label: 'Memory-safe core' },
  { value: '0ms', label: 'Vendor lock-in' },
];

// Injected keyframes + bold visual primitives (scoped to this page).
const STYLE = `
@keyframes rvFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rvAurora { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(6%, -4%) scale(1.15); } 100% { transform: translate(0,0) scale(1); } }
@keyframes rvMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes rvFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.rv-reveal { opacity: 0; animation: rvFadeUp .8s cubic-bezier(.16,1,.3,1) forwards; }
.rv-grad-text { background: ${GRADIENT}; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.rv-grid { background-size: 44px 44px; background-image:
  linear-gradient(to right, rgba(255,255,255,.035) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255,255,255,.035) 1px, transparent 1px); }
.rv-card { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .35s, background .35s; }
.rv-card:hover { transform: translateY(-4px); border-color: rgba(129,140,248,.4); background: rgba(255,255,255,.045); }
.rv-marquee:hover .rv-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .rv-reveal { animation: none; opacity: 1; }
  .rv-aurora, .rv-track, .rv-float { animation: none !important; }
}
`;

const RevampPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#06070D] text-slate-100 antialiased overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{STYLE}</style>
      <Nav />
      <Hero />
      <ConnectorMarquee />
      <AIShowcase />
      <BentoFeatures />
      <ProductShowcase />
      <StatsBand />
      <FinalCTA />
      <Footer />
    </div>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300/80" style={{ fontFamily: "'Fira Code', monospace" }}>
    {children}
  </span>
);

const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-[#06070D]/70 border-b border-white/5' : ''}`}>
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/revamp_1" className="text-xl font-bold tracking-tight">
          Odara<span className="rv-grad-text">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Platform</a>
          <a href="#ai" className="hover:text-white transition-colors">AI</a>
          <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
          <Link to="/community" className="hover:text-white transition-colors">Community</Link>
        </div>
        <Link to="/download" className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: GRADIENT }}>
          Get Odara
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </nav>
    </header>
  );
};

const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const cmd = 'curl -fsSL https://odara.rs/install.sh | sh';
  const copy = async () => {
    try { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <section className="relative pt-40 pb-28 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 rv-grid opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="rv-aurora absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[140px] opacity-30 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 30% 30%, #6366f1, transparent 60%), radial-gradient(circle at 70% 60%, #22d3ee, transparent 55%)', animation: 'rvAurora 14s ease-in-out infinite' }} />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <div className="rv-reveal inline-flex items-center gap-2 mb-7 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-300">
          <Sparkles size={13} className="text-indigo-300" />
          The AI-first ETL platform
        </div>

        <h1 className="rv-reveal text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.02] mb-6" style={{ animationDelay: '.08s' }}>
          Robust data pipelines,<br />
          <span className="rv-grad-text">powered by Rust and AI.</span>
        </h1>

        <p className="rv-reveal text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '.16s' }}>
          If you can describe it, Odara can build it. Drag-and-drop pipelines, 70+ connectors,
          and AI that writes the SQL and Python for you — free and self-hosted.
        </p>

        <div className="rv-reveal flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" style={{ animationDelay: '.24s' }}>
          <Link to="/download" className="group inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-2xl shadow-indigo-500/25 transition-transform hover:-translate-y-0.5" style={{ background: GRADIENT }}>
            Download free
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to="/docs" className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-slate-200 hover:bg-white/10 transition-colors">
            Read the docs
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Install command chip */}
        <div className="rv-reveal mx-auto max-w-md" style={{ animationDelay: '.32s' }}>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur">
            <Terminal size={16} className="text-indigo-300 flex-shrink-0" />
            <code className="flex-1 text-left text-sm text-slate-200 truncate" style={{ fontFamily: "'Fira Code', monospace" }}>
              <span className="text-slate-500">$ </span>{cmd}
            </code>
            <button onClick={copy} aria-label="Copy install command" className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
            {['Totally free', 'Unlimited data', 'Self-hosted'].map(b => (
              <span key={b} className="inline-flex items-center gap-1.5"><Check size={13} className="text-emerald-400" strokeWidth={3} />{b}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ConnectorMarquee: React.FC = () => (
  <section className="rv-marquee relative py-10 border-y border-white/5 overflow-hidden">
    <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-500 mb-6" style={{ fontFamily: "'Fira Code', monospace" }}>
      70+ connectors, one platform
    </p>
    <div className="relative [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="rv-track flex w-max gap-3" style={{ animation: 'rvMarquee 40s linear infinite' }}>
        {[...CONNECTORS, ...CONNECTORS].map((c, i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-white/8 bg-white/[0.03] px-4 py-1.5 text-sm text-slate-300">
            {c}
          </span>
        ))}
      </div>
    </div>
  </section>
);

const AIShowcase: React.FC = () => {
  const [active, setActive] = useState(0);
  const ex = AI_EXAMPLES[active];
  return (
    <section id="ai" className="relative py-28">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-14">
          <Eyebrow><Bot size={13} /> AI-first</Eyebrow>
          <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">Describe it. Ship it.</h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">Type what you want in plain English. Odara generates the transformation and drops it straight into your pipeline.</p>
        </div>

        <div className="rv-card rounded-2xl overflow-hidden">
          {/* prompt bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/8 p-4">
            {AI_EXAMPLES.map((e, i) => (
              <button key={e.label} onClick={() => setActive(i)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active === i ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                style={active === i ? { background: GRADIENT } : { background: 'rgba(255,255,255,.05)' }}>
                {e.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2">
            {/* prompt */}
            <div className="p-7 border-b md:border-b-0 md:border-r border-white/8">
              <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">Prompt</div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full" style={{ background: GRADIENT }}>
                  <Sparkles size={14} className="text-white" />
                </div>
                <p className="text-lg text-slate-100 leading-snug">“{ex.prompt}”</p>
              </div>
            </div>
            {/* generated code */}
            <div className="p-7 bg-black/30">
              <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">Generated</div>
              <pre className="text-sm leading-relaxed text-slate-200 overflow-x-auto" style={{ fontFamily: "'Fira Code', monospace" }}>
                <code>{ex.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BentoFeatures: React.FC = () => (
  <section id="features" className="relative py-28">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="text-center mb-14">
        <Eyebrow><Layers size={13} /> Platform</Eyebrow>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">Everything in one canvas</h2>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto">From ingestion to orchestration to observability — without stitching five tools together.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {FEATURES.map(f => (
          <div key={f.title} className={`rv-card rounded-2xl p-7 ${f.span}`}>
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <f.icon size={20} className="text-indigo-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProductShowcase: React.FC = () => (
  <section className="relative py-28">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="text-center mb-14">
        <Eyebrow><Activity size={13} /> The product</Eyebrow>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">A canvas built for flow</h2>
      </div>
      <div className="relative">
        <div className="absolute -inset-4 rounded-3xl blur-3xl opacity-30 pointer-events-none" style={{ background: GRADIENT }} />
        <div className="relative rounded-2xl border border-white/10 bg-[#0B0E14] p-2 shadow-2xl">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <span className="h-3 w-3 rounded-full bg-green-400/70" />
          </div>
          <img src="/screenshots/editor.png" alt="Odara visual pipeline editor" loading="lazy"
               className="w-full rounded-xl border border-white/5" />
        </div>
      </div>
    </div>
  </section>
);

const StatsBand: React.FC = () => (
  <section className="relative py-20 border-y border-white/5">
    <div className="container mx-auto px-6 max-w-5xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(s => (
          <div key={s.label}>
            <div className="text-4xl sm:text-5xl font-bold tracking-tight rv-grad-text">{s.value}</div>
            <div className="mt-2 text-sm text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA: React.FC = () => (
  <section className="relative py-32 overflow-hidden">
    <div className="absolute inset-0 rv-grid opacity-40 [mask-image:radial-gradient(ellipse_50%_60%_at_50%_50%,black,transparent)]" />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-25 pointer-events-none" style={{ background: GRADIENT }} />
    <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl">
      <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter mb-6">
        Build your first pipeline<br /><span className="rv-grad-text">in minutes.</span>
      </h2>
      <p className="text-lg text-slate-400 mb-10">Free, self-hosted, no vendor lock-in. One command and you're running.</p>
      <Link to="/download" className="group inline-flex items-center gap-2 rounded-lg px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-indigo-500/25 transition-transform hover:-translate-y-0.5" style={{ background: GRADIENT }}>
        Download Odara
        <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-white/5 py-10">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
      <span className="font-bold text-slate-300">Odara<span className="rv-grad-text">.</span></span>
      <span>Robust data pipelines, powered by Rust and AI.</span>
      <span>© 2026 Odara</span>
    </div>
  </footer>
);

export default RevampPage;
