import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { login, register } from './api';

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
  "Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay",
  "Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

interface Props {
  onClose: () => void;
  onAuth: (user: any) => void;
}

const AuthModal: React.FC<Props> = ({ onClose, onAuth }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [company, setCompany] = useState('');
  const [telephone, setTelephone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Country autocomplete state
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');
  const countryRef = useRef<HTMLDivElement>(null);

  const filteredCountries = COUNTRIES.filter(c =>
    c.toLowerCase().includes(countryFilter.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (mode === 'register') {
        data = await register({
          email,
          password,
          name: fullName,
          country,
          company,
          telephone: telephone || undefined,
        });
      } else {
        data = await login(email, password);
      }
      onAuth(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-odara-muted/50 focus:outline-none focus:border-odara-primary/50 transition-colors";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-xl p-8 w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-odara-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {mode === 'login' ? 'Welcome back' : 'Join Odara Community'}
        </h2>
        <p className="text-odara-muted text-sm mb-6">
          {mode === 'login'
            ? 'Sign in to participate in the community'
            : 'Create an account to report bugs, request features, and more'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
              placeholder="Min 8 characters"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-odara-muted mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>

              <div ref={countryRef} className="relative">
                <label className="block text-sm font-medium text-odara-muted mb-1">Country</label>
                <input
                  type="text"
                  value={countryOpen ? countryFilter : country}
                  onChange={e => {
                    setCountryFilter(e.target.value);
                    setCountry('');
                    setCountryOpen(true);
                  }}
                  onFocus={() => {
                    setCountryOpen(true);
                    setCountryFilter(country);
                  }}
                  required
                  className={inputClass}
                  placeholder="Start typing..."
                  autoComplete="off"
                />
                {/* Hidden input to enforce selection from list */}
                <input type="hidden" value={country} required />
                {countryOpen && filteredCountries.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg bg-[#1a1d24] border border-white/10 shadow-xl">
                    {filteredCountries.map(c => (
                      <li
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setCountryFilter(c);
                          setCountryOpen(false);
                        }}
                        className="px-4 py-2 text-sm text-odara-muted hover:bg-white/10 hover:text-white cursor-pointer"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-odara-muted mb-1">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Your company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-odara-muted mb-1">
                  Telephone <span className="text-odara-muted/50">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  className={inputClass}
                  placeholder="+1 234 567 890"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || (mode === 'register' && !country)}
            className="w-full py-2.5 rounded-lg bg-odara-primary hover:bg-odara-primary/90 text-white font-medium transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-odara-muted">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="text-odara-primary hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-odara-primary hover:underline">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
