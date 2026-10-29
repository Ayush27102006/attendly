/**
 * AppLayout.jsx — Shared dashboard layout wrapper
 * =================================================
 * PE-2 Requirement 1: React Router — Shared Layout
 *
 * This component renders the sidebar + topbar + page content area.
 * It wraps all protected pages via React Router's <Outlet />.
 */

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_META = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your attendance at a glance' },
  '/attendance': { title: 'Attendance Records', subtitle: 'Subject-wise breakdown with filters' },
  '/timetable': { title: 'Weekly Timetable', subtitle: '3rd Semester · Computer Science Engineering' },
  '/calendar': { title: 'Attendance Calendar', subtitle: 'September 2026 — Click a day for details' },
  '/bunk-calculator': { title: 'Bunk Calculator', subtitle: 'Find out how many classes you can safely skip' },
  '/profile': { title: 'My Profile', subtitle: 'Your student information' },
  '/about': { title: 'About Attendly', subtitle: 'College project documentation & architecture' },
};

export default function AppLayout({ title: propTitle, subtitle: propSubtitle, children }) {
  // Mobile sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentMeta = PAGE_META[location.pathname] || { title: 'Attendly', subtitle: 'Every class counts.' };
  const title = propTitle || currentMeta.title;
  const subtitle = propSubtitle || currentMeta.subtitle;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="main-content">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuOpen={() => setSidebarOpen(true)}
        />

        <main className="page-content" id="main" role="main">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
