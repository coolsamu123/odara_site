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

const FALLBACK_VERSION = '0.1.0';
const LEAD_STORAGE_KEY = 'odara_download_lead';
// Public Cloudflare R2 bucket holding the release artifacts (same source the install.sh one-liner uses).
// Artifacts live under per-platform prefixes: `${R2_BASE}/linux/...` and `${R2_BASE}/windows/...`.
const R2_BASE = 'https://pub-8227a3dbc0c64f88b0bbc027d1108f55.r2.dev';

const DownloadPage: React.FC = () => {
  const [version, setVersion] = useState<string>(FALLBACK_VERSION);
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
          <InstallTabs version={version} />
        ) : (
          <LeadGate version={version} onUnlock={() => setUnlocked(true)} />
        )}
      </div>
    </div>
  );
};

type TabKey = 'script' | 'deb' | 'rpm' | 'tarball' | 'windows';

interface TabDef {
  key: TabKey;
  label: string;
}

const TABS: TabDef[] = [
  { key: 'script',  label: 'Script' },
  { key: 'deb',     label: 'Debian / Ubuntu' },
  { key: 'rpm',     label: 'Fedora / RHEL' },
  { key: 'tarball', label: 'Tarball' },
  { key: 'windows', label: 'Windows' },
];

// Build the per-version R2 filenames (version is baked into each name).
const artifacts = (v: string) => ({
  tarball: `odara_${v}_linux_amd64.tar.gz`,
  deb:     `odara_${v}_amd64.deb`,
  rpm:     `odara-${v}-1.x86_64.rpm`,
  winzip:  `odara_${v}_windows_amd64.zip`,
});

const InstallTabs: React.FC<{ version: string }> = ({ version }) => {
  const [active, setActive] = useState<TabKey>('script');
  const [copied, setCopied] = useState<string | null>(null);
  const files = artifacts(version);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard blocked — text is still visible in the UI
    }
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-white/10 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors ${
              active === tab.key
                ? 'border-odara-primary text-white'
                : 'border-transparent text-odara-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {active === 'script' && (
        <CommandCard
          title="Linux"
          subtitle="Auto-detects your distro and installs the latest version."
          command="curl -fsSL https://odara.rs/install.sh | sh"
          footer={<>Installs to <Mono>~/.local/share/odara</Mono></>}
          copied={copied === 'script'}
          onCopy={() => copy('script', 'curl -fsSL https://odara.rs/install.sh | sh')}
        />
      )}

      {active === 'deb' && (
        <DownloadCard
          title="Debian / Ubuntu"
          subtitle="For Ubuntu, Debian, Mint, Pop!_OS and other apt-based distros."
          filename={files.deb}
          href={`${R2_BASE}/linux/${files.deb}`}
          command={`sudo apt install ./${files.deb}`}
          copied={copied === 'deb'}
          onCopy={() => copy('deb', `sudo apt install ./${files.deb}`)}
        />
      )}

      {active === 'rpm' && (
        <DownloadCard
          title="Fedora / RHEL"
          subtitle="For Fedora, RHEL, CentOS, Rocky, openSUSE and other rpm-based distros."
          filename={files.rpm}
          href={`${R2_BASE}/linux/${files.rpm}`}
          command={`sudo dnf install ./${files.rpm}`}
          copied={copied === 'rpm'}
          onCopy={() => copy('rpm', `sudo dnf install ./${files.rpm}`)}
        />
      )}

      {active === 'tarball' && (
        <DownloadCard
          title="Tarball"
          subtitle="Portable archive for manual installs (any Linux x86_64)."
          filename={files.tarball}
          href={`${R2_BASE}/linux/${files.tarball}`}
          command={`tar -xzf ${files.tarball} && ./odara/start.sh`}
          copied={copied === 'tarball'}
          onCopy={() => copy('tarball', `tar -xzf ${files.tarball} && ./odara/start.sh`)}
        />
      )}

      {active === 'windows' && (
        <div className="space-y-5">
          <CommandCard
            title="Windows"
            subtitle="Paste in PowerShell."
            command="irm https://odara.rs/install.ps1 | iex"
            footer={<>Installs to <Mono>%LOCALAPPDATA%\Programs\Odara</Mono></>}
            copied={copied === 'windows'}
            onCopy={() => copy('windows', 'irm https://odara.rs/install.ps1 | iex')}
          />
          <div className="p-5 rounded-xl bg-gradient-to-br from-odara-primary/10 to-transparent border border-odara-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-odara-primary/15 flex-shrink-0">
                <Download size={18} className="text-odara-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">Or download the ZIP</div>
                <div className="text-xs text-odara-muted">Portable archive — extract and run, no installer.</div>
              </div>
            </div>
            <a
              href={`${R2_BASE}/windows/${files.winzip}`}
              download
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-odara-primary hover:bg-odara-primary/90 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              <Download size={16} />
              Download {files.winzip}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const Mono: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="text-odara-primary/80 font-mono">{children}</code>
);

interface CommandCardProps {
  title: string;
  subtitle: string;
  command: string;
  footer?: React.ReactNode;
  copied: boolean;
  onCopy: () => void;
}

// A card showing a single shell command with a copy button.
const CommandCard: React.FC<CommandCardProps> = ({ title, subtitle, command, footer, copied, onCopy }) => (
  <div className="p-5 rounded-xl bg-gradient-to-br from-odara-primary/10 to-transparent border border-odara-primary/30">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-odara-primary/15 flex-shrink-0">
        <Terminal size={18} className="text-odara-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-xs text-odara-muted">{subtitle}</div>
      </div>
    </div>
    <div className="flex items-stretch gap-2">
      <code className="flex-1 px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white overflow-x-auto whitespace-nowrap min-w-0">
        {command}
      </code>
      <CopyButton copied={copied} onCopy={onCopy} label={title} />
    </div>
    {footer && <p className="text-xs text-odara-muted/80 mt-3">{footer}</p>}
  </div>
);

interface DownloadCardProps {
  title: string;
  subtitle: string;
  filename: string;
  href: string;
  command: string;
  copied: boolean;
  onCopy: () => void;
}

// A card with a direct download button plus the package-manager install command.
const DownloadCard: React.FC<DownloadCardProps> = ({ title, subtitle, filename, href, command, copied, onCopy }) => (
  <div className="p-5 rounded-xl bg-gradient-to-br from-odara-primary/10 to-transparent border border-odara-primary/30">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-odara-primary/15 flex-shrink-0">
        <Download size={18} className="text-odara-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-xs text-odara-muted">{subtitle}</div>
      </div>
    </div>

    <a
      href={href}
      download
      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-odara-primary hover:bg-odara-primary/90 rounded-lg text-sm font-semibold text-white transition-colors"
    >
      <Download size={16} />
      Download {filename}
    </a>

    <p className="text-xs text-odara-muted mt-4 mb-1.5">Then install it:</p>
    <div className="flex items-stretch gap-2">
      <code className="flex-1 px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white overflow-x-auto whitespace-nowrap min-w-0">
        {command}
      </code>
      <CopyButton copied={copied} onCopy={onCopy} label={title} />
    </div>
  </div>
);

const CopyButton: React.FC<{ copied: boolean; onCopy: () => void; label: string }> = ({ copied, onCopy, label }) => (
  <button
    onClick={onCopy}
    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
    aria-label={`Copy ${label} command`}
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
);

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

export default DownloadPage;
