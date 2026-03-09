import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { listUsers, deleteUser, resetUserPassword } from '../components/community/api';
import { Trash2, RefreshCw, Search } from 'lucide-react';

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await listUsers(1, search);
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user, search]);

  const handleDelete = async (userId: string | number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (err) {
      console.error('Delete user failed', err);
      alert('Failed to delete user');
    }
  };

  const handleResetPassword = async (userId: string | number) => {
    if (!confirm('Are you sure you want to reset this user\'s password?')) return;
    try {
      const res = await resetUserPassword(userId);
      if (res.temporary_password) {
        alert(`Password reset successfully. Temporary password: ${res.temporary_password}`);
      } else {
        alert('Password reset successfully. A temporary password has been sent to their email.');
      }
    } catch (err) {
      console.error('Reset password failed', err);
      alert('Failed to reset password');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center text-odara-muted">
        Access denied. Admins only.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-odara-bg">
      <div className="container mx-auto px-6 max-w-5xl py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-odara-muted" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-odara-muted focus:outline-none focus:border-odara-primary transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-odara-muted">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-odara-muted">No users found.</div>
        ) : (
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-odara-muted text-sm font-medium border-b border-white/10">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                    <td className="px-6 py-4 text-odara-muted">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        u.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleResetPassword(u.id)}
                        className="text-odara-muted hover:text-white transition-colors"
                        title="Reset Password"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-400/60 hover:text-red-400 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
