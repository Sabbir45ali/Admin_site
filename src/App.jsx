import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import CalendarPage from './pages/Calendar';
import Services from './pages/Services';
import Offers from './pages/Offers';
import Loyalty from './pages/Loyalty';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="services" element={<Services />} />
            <Route path="offers" element={<Offers />} />
            <Route path="loyalty" element={<Loyalty />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
