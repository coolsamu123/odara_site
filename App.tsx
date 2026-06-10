import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';

// Route-level code splitting: only the landing page is in the main bundle.
// Everything else loads on demand (Suspense fallback lives in Layout).
const DocsPage = lazy(() => import('./pages/DocsPage'));
const TutorialsPage = lazy(() => import('./pages/TutorialsPage'));
const TutorialReader = lazy(() => import('./components/TutorialReader'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminDownloadsPage = lazy(() => import('./pages/AdminDownloadsPage'));
const DownloadPage = lazy(() => import('./pages/DownloadPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/tutorials/:slug" element={<TutorialReader />} />
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
