import React, { useState, useRef, useEffect } from 'react';
import { Download, Monitor, Terminal, Package, X } from 'lucide-react';

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
  "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon",
  "Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel",
  "Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos",
  "Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi",
  "Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova",
  "Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
  "New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau",
  "Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania",
  "Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino",
  "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia",
  "Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden",
  "Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago",
  "Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

const R2_BASE = 'https://pub-8227a3dbc0c64f88b0bbc027d1108f55.r2.dev';

const RELEASES = [
  {
    version: '0.1.0',
    date: '2026-03-06',
    assets: [
      {
        platform: 'Windows',
        arch: 'amd64',
        icon: Monitor,
        filename: 'odara_0.1.0_windows_amd64.zip',
        url: `${R2_BASE}/windows/odara_0.1.0_windows_amd64.zip`,
        instructions: 'Extract the zip and run start.bat',
      },
      {
        platform: 'Ubuntu / Debian',
        arch: 'amd64',
        icon: Terminal,
        filename: 'odara_0.1.0_amd64.deb',
        url: `${R2_BASE}/linux/odara_0.1.0_amd64.deb`,
        instructions: 'sudo dpkg -i odara_0.1.0_amd64.deb',
      },
      {
        platform: 'Fedora / RHEL',
        arch: 'x86_64',
        icon: Package,
        filename: 'odara-0.1.0-1.x86_64.rpm',
        url: `${R2_BASE}/linux/odara-0.1.0-1.x86_64.rpm`,
        instructions: 'sudo rpm -i odara-0.1.0-1.x86_64.rpm',
      },
      {
        platform: 'Linux (generic)',
        arch: 'amd64',
        icon: Terminal,
        filename: 'odara_0.1.0_linux_amd64.tar.gz',
        url: `${R2_BASE}/linux/odara_0.1.0_linux_amd64.tar.gz`,
        instructions: 'tar -xzf odara_0.1.0_linux_amd64.tar.gz',
      },
    ],
  },
];

interface SelectedAsset {
  url: string;
  filename: string;
  platform: string;
  version: string;
}

const CountrySelect: React.FC<{ value: string; onChange: (v: string) => void; autoDetected?: boolean }> = ({ value, onChange, autoDetected }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = COUNTRIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2">
        <label className="block text-sm text-odara-muted mb-1">Country</label>
        {autoDetected && value && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-odara-success/10 text-odara-success border border-odara-success/20">
            Auto-detected
          </span>
        )}
      </div>
      <input
        type="text"
        value={open ? search : value}
        onFocus={() => { setOpen(true); setSearch(value); }}
        onChange={(e) => { setSearch(e.target.value); onChange(e.target.value); }}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-odara-primary/50"
        placeholder="Start typing to change..."
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-[#161a22] border border-white/10 rounded-lg shadow-xl">
          {filtered.map((c) => (
            <li
              key={c}
              onClick={() => { onChange(c); setOpen(false); }}
              className="px-3 py-2 text-sm text-odara-muted hover:bg-white/10 hover:text-white cursor-pointer"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DownloadPage: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);
  const [form, setForm] = useState({ name: '', email: '', company_name: '', country: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [countryDetected, setCountryDetected] = useState(false);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_name && COUNTRIES.includes(data.country_name)) {
          setForm(prev => ({ ...prev, country: data.country_name }));
          setCountryDetected(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleDownloadClick = (asset: typeof RELEASES[0]['assets'][0], version: string) => {
    setSelectedAsset({ url: asset.url, filename: asset.filename, platform: asset.platform, version });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    setSubmitting(true);
    setError('');

    // Trigger the download synchronously inside the user-gesture handler so
    // popup blockers don't kill it and a flaky tracking endpoint can't either.
    window.open(selectedAsset.url, '_blank', 'noopener');

    // Fire-and-forget lead tracking — best effort, never blocks the download.
    fetch('/api/v1/downloads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        version: selectedAsset.version,
        filename: selectedAsset.filename,
        platform: selectedAsset.platform,
      }),
    }).catch(() => {});

    setSelectedAsset(null);
    setForm({ name: '', email: '', company_name: '', country: '' });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-odara-primary/10 border border-odara-primary/20 text-odara-primary text-sm font-medium mb-6">
            <Download size={14} />
            Download
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get Odara ETL
          </h1>
          <p className="text-odara-muted text-lg max-w-xl mx-auto">
            Download the latest release for your platform. Free and open for the community.
          </p>
        </div>

        {/* Releases */}
        <div className="space-y-12">
          {RELEASES.map((release) => (
            <div key={release.version}>
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-2xl font-bold">v{release.version}</h2>
                <span className="text-sm text-odara-muted">{release.date}</span>
                {release === RELEASES[0] && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-odara-primary/15 text-odara-primary font-medium">
                    Latest
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {release.assets.map((asset) => {
                  const Icon = asset.icon;
                  return (
                    <button
                      key={asset.filename}
                      onClick={() => handleDownloadClick(asset, release.version)}
                      className="group flex flex-col gap-4 p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-odara-primary/40 hover:bg-white/[0.05] transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-white/5 group-hover:bg-odara-primary/10 transition-colors">
                          <Icon size={20} className="text-odara-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{asset.platform}</div>
                          <div className="text-xs text-odara-muted">{asset.arch}</div>
                        </div>
                        <Download size={16} className="ml-auto text-odara-muted group-hover:text-odara-primary transition-colors" />
                      </div>
                      <div className="text-sm text-odara-muted font-mono bg-white/[0.03] rounded-md px-3 py-2">
                        {asset.instructions}
                      </div>
                      <div className="text-xs text-odara-muted">{asset.filename}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Form Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0F1218] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 text-odara-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold mb-1">Almost there!</h3>
            <p className="text-sm text-odara-muted mb-6">
              Please fill in your details to download <span className="text-white font-medium">{selectedAsset.filename}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-odara-muted mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-odara-primary/50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm text-odara-muted mb-1">Work Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-odara-primary/50"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm text-odara-muted mb-1">
                  Company <span className="text-odara-muted/50">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-odara-primary/50"
                  placeholder="Acme Inc."
                />
              </div>

              <CountrySelect
                value={form.country}
                onChange={(v) => setForm({ ...form, country: v })}
                autoDetected={countryDetected}
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-odara-primary hover:bg-odara-primary/90 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                {submitting ? 'Processing...' : 'Download Now'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
