/**
 * Sidebar.jsx — Shared navigation sidebar
 * =========================================
 * React version of the sidebar HTML that initLayout() injected in layout.js.
 *
 * Key differences from the vanilla version:
 * - Uses React Router <NavLink> instead of <a href="/pages/...html">
 * - NavLink automatically adds the "active" class when the route matches
 * - Reads student data from AuthContext instead of localStorage directly
 * - logout() clears session; resets Redux attendance cache
 */

import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { resetAttendance } from '../../features/attendance/attendanceSlice';
import {
  IconAttendance, IconBunk, IconCalendar,
  IconDashboard, IconLogo, IconLogout,
  IconProfile, IconTimetable, IconInfo,
} from '../ui/Icons';

// Navigation item definitions
const NAV_ITEMS = [
  { to: '/dashboard',       label: 'Dashboard',       Icon: IconDashboard  },
  { to: '/attendance',      label: 'Attendance',       Icon: IconAttendance },
  { to: '/timetable',       label: 'Timetable',        Icon: IconTimetable  },
  { to: '/calendar',        label: 'Calendar',         Icon: IconCalendar   },
  { to: '/bunk-calculator', label: 'Bunk Calculator',  Icon: IconBunk       },
  { to: '/profile',         label: 'Profile',          Icon: IconProfile    },
  { to: '/about',           label: 'About',            Icon: IconInfo       },
];

export default function Sidebar({ isOpen, onClose }) {
  const { student, logout } = useAuth();
  const dispatch = useDispatch();

  const initial = student?.name?.charAt(0).toUpperCase() ?? 'S';

  const handleLogout = () => {
    dispatch(resetAttendance());
    logout();
  };

  return (
    <>
      {/* Sidebar panel */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        id="sidebar"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo-badge">
            <IconLogo size={16} />
          </div>
          <span className="sidebar-title">Attendly</span>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>

          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item${isActive ? ' active' : ''}`
              }
              aria-label={label}
              onClick={() => {
                if (window.innerWidth <= 768) onClose();
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Student info + Logout */}
        <div className="sidebar-footer">
          <div className="student-profile-mini">
            <div className="avatar" aria-hidden="true">{initial}</div>
            <div className="student-info-mini">
              <div className="student-name-mini truncate">
                {student?.name ?? 'Student'}
              </div>
              <div className="student-roll-mini">
                {student?.rollNumber ?? ''}
              </div>
            </div>
          </div>

          <button
            className="btn-logout"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <IconLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay — clicking it closes the sidebar on mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay active"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
