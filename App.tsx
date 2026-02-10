import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DocsPage from './pages/DocsPage';
import CommunityPage from './pages/CommunityPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/community" element={<CommunityPage />} />
      </Route>
    </Routes>
  );
};

export default App;
