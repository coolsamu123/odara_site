import React, { useState } from 'react';
import { X, User, Lock, Save } from 'lucide-react';
import { updateProfile, changePassword } from './api';

interface Props {
  user: any;
  onClose: () => void;
  onUpdate: (user: any) => void;
}

const ProfileModal: React.FC<Props> = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [country, setCountry] = useState(user?.country || '');
  const [company, setCompany] = useState(user?.company || '');
  const [telephone, setTelephone] = useState(user?.telephone || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-odara-muted/50 focus:outline-none focus:border-odara-primary/50 transition-colors';

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    try {
      const updated = await updateProfile({
        name: name || undefined,
        avatar_url: avatarUrl || undefined,
        country: country || undefined,
        company: company || undefined,
        telephone: telephone || undefined,
      });
      onUpdate(updated);
      setProfileSuccess('Profile updated successfully!');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-xl p-8 w-full max-w-lg mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-odara-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        {/* Read-only info */}
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10 space-y-2 text-sm text-odara-muted">
          <div><span className="text-white font-medium">Email:</span> {user?.email}</div>
          <div><span className="text-white font-medium">Role:</span> {user?.role}</div>
        </div>

        {/* Profile edit */}
        <form onSubmit={handleProfileSave} className="mb-8 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <User size={18} className="text-odara-primary" />
            Edit Profile
          </h3>

          {profileError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {profileSuccess}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              className={inputClass}
              placeholder="e.g. Serbia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className={inputClass}
              placeholder="Your company"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Telephone</label>
            <input
              type="tel"
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
              className={inputClass}
              placeholder="+381 ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-odara-primary hover:bg-odara-primary/90 text-white font-medium transition-all disabled:opacity-50"
          >
            <Save size={14} />
            {profileLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Lock size={18} className="text-odara-accent" />
            Change Password
          </h3>

          {passwordError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {passwordSuccess}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="Current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="Min 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-odara-muted mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="Repeat new password"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-odara-accent hover:bg-odara-accent/90 text-white font-medium transition-all disabled:opacity-50"
          >
            <Lock size={14} />
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
