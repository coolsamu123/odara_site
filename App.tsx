import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DocsPage from './pages/DocsPage';
import CommunityPage from './pages/CommunityPage';
import AdminUsersPage from './pages/AdminUsersPage';
import DownloadPage from './pages/DownloadPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
};

export default App;
