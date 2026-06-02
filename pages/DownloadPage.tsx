import React, { useState, useEffect } from 'react';
import { Download, Terminal, Copy, Check, Lock, ArrowRight } from 'lucide-react';
import { captureDownloadLead, fetchDetectedCountry } from '../components/community/api';

// Convert a 2-letter ISO country code to a display name (e.g. "BR" -> "Brazil").
const countryName = (code: string): string => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
};

type Platform = 'windows' | 'linux';

const COMMANDS: Record<Platform, string> = {
  windows: 'irm https://odara.rs/install.ps1 | iex',
  linux:   'curl -fsSL https://odara.rs/install.sh | sh',
};

const FALLBACK_VERSION = '0.1.0';
const LEAD_STORAGE_KEY = 'odara_download_lead';

const DownloadPage: React.FC = () => {
  const [version, setVersion] = useState<string>(FALLBACK_VERSION);
  const [copied, setCopied] = useState<Platform | null>(null);
  // If the visitor already registered before, skip the form (remembered via localStorage).
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(LEAD_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    fetch('/version.txt', { cache: 'no-cache' })
      .then(res => (res.ok ? res.text() : Promise.reject()))
      .then(text => {
        const v = text.trim();
        if (v) setVersion(v);
      })
      .catch(() => {});
  }, []);

  const handleCopy = async (platform: Platform) => {
    try {
      await navigator.clipboard.writeText(COMMANDS[platform]);
      setCopied(platform);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard blocked — command is still visible in the UI
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-odara-primary/10 border border-odara-primary/20 text-odara-primary text-sm font-medium mb-6">
            <Download size={14} />
            Install
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get Odara ETL
          </h1>
          <div className="mt-5 inline-flex items-center gap-2 text-sm text-odara-muted">
            <span className="text-xs px-2 py-0.5 rounded-full bg-odara-primary/15 text-odara-primary font-medium">
              Latest
            </span>
            <span className="font-mono">v{version}</span>
          </div>
        </div>

        {unlocked ? (
          /* Install cards */
          <div className="space-y-5">
            <InstallCard
              platform="windows"
              title="Windows"
              shellLabel="PowerShell"
              command={COMMANDS.windows}
              installPath="%LOCALAPPDATA%\Programs\Odara"
              copied={copied === 'windows'}
              onCopy={() => handleCopy('windows')}
            />

            <InstallCard
              platform="linux"
              title="Linux"
              shellLabel="bash / sh"
              command={COMMANDS.linux}
              installPath="~/.local/share/odara"
              copied={copied === 'linux'}
              onCopy={() => handleCopy('linux')}
            />
          </div>
        ) : (
          <LeadGate version={version} onUnlock={() => setUnlocked(true)} />
        )}
      </div>
    </div>
  );
};

interface LeadGateProps {
  version: string;
  onUnlock: () => void;
}

const LeadGate: React.FC<LeadGateProps> = ({ version, onUnlock }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-detect the visitor's country via Cloudflare and pre-fill the field (still editable).
  useEffect(() => {
    fetchDetectedCountry()
      .then(code => {
        if (code) setCountry(prev => prev || countryName(code));
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();
    const trimmedCountry = country.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      // Capture the lead (also logs a download_event and triggers the alert).
      await captureDownloadLead({
        name: trimmedName,
        email: trimmedEmail,
        company_name: trimmedCompany || undefined,
        country: trimmedCountry || undefined,
        version,
      });
    } catch {
      // Never block the download if capture fails — just proceed.
    } finally {
      try {
        localStorage.setItem(
          LEAD_STORAGE_KEY,
          JSON.stringify({ name: trimmedName, email: trimmedEmail }),
        );
      } catch {
        // localStorage unavailable — visitor will be asked again next time.
      }
      setSubmitting(false);
      onUnlock();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-odara-primary/10 to-transparent border border-odara-primary/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-odara-primary/15 flex-shrink-0">
            <Lock size={18} className="text-odara-primary" />
          </div>
          <div>
            <div className="font-semibold text-white">Almost there</div>
            <div className="text-xs text-odara-muted">
              Tell us who you are to reveal the install commands.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              placeholder="Jane Doe"
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-odara-muted/50 focus:outline-none focus:border-odara-primary/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="jane@company.com"
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-odara-muted/50 focus:outline-none focus:border-odara-primary/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">
              Company <span className="text-odara-muted/50 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              autoComplete="organization"
              placeholder="Acme Inc."
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-odara-muted/50 focus:outline-none focus:border-odara-primary/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">
              Country <span className="text-odara-muted/50 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              autoComplete="country-name"
              placeholder="Detecting…"
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-odara-muted/50 focus:outline-none focus:border-odara-primary/60"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-odara-primary hover:bg-odara-primary/90 disabled:opacity-60 rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? 'Loading…' : (
              <>
                Get install commands
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-odara-muted/70 mt-4 text-center">
          We use this only to keep you posted on releases. No spam.
        </p>
      </div>
    </div>
  );
};

interface InstallCardProps {
  platform: Platform;
  title: string;
  shellLabel: string;
  command: string;
  installPath: string;
  copied: boolean;
  onCopy: () => void;
}

const InstallCard: React.FC<InstallCardProps> = ({ title, shellLabel, command, installPath, copied, onCopy }) => (
  <div className="p-5 rounded-xl bg-gradient-to-br from-odara-primary/10 to-transparent border border-odara-primary/30">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-odara-primary/15 flex-shrink-0">
        <Terminal size={18} className="text-odara-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-xs text-odara-muted">Paste in {shellLabel}</div>
      </div>
    </div>
    <div className="flex items-stretch gap-2">
      <code className="flex-1 px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white overflow-x-auto whitespace-nowrap min-w-0">
        {command}
      </code>
      <button
        onClick={onCopy}
        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
        aria-label={`Copy ${title} install command`}
      >
        {copied ? (
          <>
            <Check size={14} className="text-odara-success" />
            <span className="text-odara-success">Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
    <p className="text-xs text-odara-muted/80 mt-3">
      Installs to <code className="text-odara-primary/80 font-mono">{installPath}</code>
    </p>
  </div>
);

export default DownloadPage;
