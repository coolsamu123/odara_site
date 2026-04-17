import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchDownloadStats, fetchDownloadLeads, fetchDownloadEvents } from '../components/community/api';
import { Search, Download, Users, Calendar, Activity } from 'lucide-react';

const AdminDownloadsPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'events' | 'leads'>('events');
  const itemsPerPage = 25;

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const loadData = async () => {
      try {
        const [dashStats, allLeads, allEvents] = await Promise.all([
          fetchDownloadStats(),
          fetchDownloadLeads(),
          fetchDownloadEvents()
        ]);
        setStats(dashStats);
        setLeads(allLeads);
        setEvents(allEvents);
      } catch (err) {
        console.error('Failed to fetch download dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center text-odara-muted">
        Access denied. Admins only.
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (lead.email && lead.email.toLowerCase().includes(lowerSearch)) ||
           (lead.name && lead.name.toLowerCase().includes(lowerSearch));
  });

  const filteredEvents = events.filter(event => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (event.email && event.email.toLowerCase().includes(lowerSearch)) ||
           (event.name && event.name.toLowerCase().includes(lowerSearch));
  });

  const currentData = tab === 'events' ? filteredEvents : filteredLeads;
  const totalPages = Math.ceil(currentData.length / itemsPerPage) || 1;
  const currentItems = currentData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="min-h-screen pt-20 bg-odara-bg">
      <div className="container mx-auto px-6 max-w-6xl py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Downloads & Leads Dashboard</h1>

        {loading ? (
          <div className="text-center py-20 text-odara-muted">Loading dashboard...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <KPICard icon={<Users size={20} />} label="Total Unique Leads" value={stats?.total_leads ?? 0} />
              <KPICard icon={<Download size={20} />} label="Total Downloads" value={stats?.total_downloads ?? 0} />
              <KPICard icon={<Activity size={20} />} label="Downloads Today" value={stats?.downloads_today ?? 0} />
              <KPICard icon={<Calendar size={20} />} label="New Leads Today" value={stats?.leads_today ?? 0} />
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setTab('events'); setPage(1); setSearch(''); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  tab === 'events'
                    ? 'bg-odara-primary/20 border-odara-primary/40 text-odara-primary'
                    : 'bg-white/5 border-white/10 text-odara-muted hover:bg-white/10'
                }`}
              >
                Download Activity
              </button>
              <button
                onClick={() => { setTab('leads'); setPage(1); setSearch(''); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  tab === 'leads'
                    ? 'bg-odara-primary/20 border-odara-primary/40 text-odara-primary'
                    : 'bg-white/5 border-white/10 text-odara-muted hover:bg-white/10'
                }`}
              >
                Unique Leads
              </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-white font-semibold">
                    {tab === 'events' ? 'Download Activity' : 'Unique Leads'}
                  </h2>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-odara-muted" size={18} />
                    <input
                      type="text"
                      placeholder="Search email or name..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-odara-muted focus:outline-none focus:border-odara-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {tab === 'events' ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-odara-muted text-sm font-medium border-b border-white/10">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Country</th>
                        <th className="px-6 py-4">Platform</th>
                        <th className="px-6 py-4">Version</th>
                        <th className="px-6 py-4">Downloaded At</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-odara-muted">
                            No download events found.
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((event: any) => (
                          <tr key={event.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-odara-muted">{event.id}</td>
                            <td className="px-6 py-4 text-white font-medium">{event.name || <span className="text-odara-muted italic">Unknown</span>}</td>
                            <td className="px-6 py-4 text-odara-primary">{event.email}</td>
                            <td className="px-6 py-4 text-odara-muted">{event.company_name || '-'}</td>
                            <td className="px-6 py-4 text-odara-muted">{event.country || '-'}</td>
                            <td className="px-6 py-4 text-odara-muted">{event.platform || '-'}</td>
                            <td className="px-6 py-4 text-odara-muted">{event.version || '-'}</td>
                            <td className="px-6 py-4 text-odara-muted whitespace-nowrap">{formatDate(event.downloaded_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-odara-muted text-sm font-medium border-b border-white/10">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Downloads</th>
                        <th className="px-6 py-4">IP Address</th>
                        <th className="px-6 py-4">First Captured</th>
                        <th className="px-6 py-4">Last Downloaded</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-odara-muted">
                            No download leads found.
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((lead: any) => (
                          <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-odara-muted">{lead.id}</td>
                            <td className="px-6 py-4 text-white font-medium">{lead.name || <span className="text-odara-muted italic">Unknown</span>}</td>
                            <td className="px-6 py-4 text-odara-primary">{lead.email}</td>
                            <td className="px-6 py-4 text-white text-center">
                              <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400">
                                {lead.download_count}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-odara-muted">{lead.ip_address || '-'}</td>
                            <td className="px-6 py-4 text-odara-muted whitespace-nowrap">{formatDate(lead.created_at)}</td>
                            <td className="px-6 py-4 text-odara-muted whitespace-nowrap">{formatDate(lead.last_download_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-odara-muted">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function KPICard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col justify-center items-center text-center hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-2 mb-3 text-indigo-400">
        {icon}
        <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-4xl font-extrabold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}

export default AdminDownloadsPage;
