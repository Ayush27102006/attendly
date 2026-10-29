/**
 * App.jsx — Root application component with routing
 * ===================================================
 * PE-2 Requirement 1: React Router — Route configuration
 *
 * This file defines the entire route tree using React Router.
 *
 * Route structure:
 *  /login               → LoginPage    (public)
 *  /                    → ProtectedRoute
 *    AppLayout (Shared Layout with Sidebar & Topbar)
 *      /dashboard         → DashboardPage
 *      /attendance        → AttendancePage
 *      /timetable         → TimetablePage
 *      /calendar          → CalendarPage
 *      /bunk-calculator   → BunkCalculatorPage
 *      /profile           → ProfilePage
 *      /about             → AboutPage
 *      /                  → redirect to /dashboard
 *  *                    → NotFoundPage (404)
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import TimetablePage from './pages/TimetablePage';
import CalendarPage from './pages/CalendarPage';
import BunkCalculatorPage from './pages/BunkCalculatorPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public route ────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Protected routes ────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/bunk-calculator" element={<BunkCalculatorPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* ── Fallback redirects & 404 ───────────────────────────── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
