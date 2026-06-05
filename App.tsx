import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DocsPage from './pages/DocsPage';
import CommunityPage from './pages/CommunityPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminDownloadsPage from './pages/AdminDownloadsPage';
import DownloadPage from './pages/DownloadPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/downloads" element={<AdminDownloadsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
