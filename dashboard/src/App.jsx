import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import SessionsPage from './pages/SessionsPage';
import UserJourneyPage from './pages/UserJourneyPage';
import HeatmapPage from './pages/HeatmapPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<SessionsPage />} />
          <Route path="sessions/:sessionId" element={<UserJourneyPage />} />
          <Route path="heatmap" element={<HeatmapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
