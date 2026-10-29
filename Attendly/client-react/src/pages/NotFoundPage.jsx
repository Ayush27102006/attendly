/**
 * NotFoundPage.jsx — 404 page for unknown routes
 * ================================================
 * PE-2 Requirement 1: React Router — Handle unknown routes
 * Shown when the user navigates to a URL that doesn't exist.
 */

import { Link } from 'react-router-dom';
import { IconLogo } from '../components/ui/Icons';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px',
      background: 'var(--bg-base)',
    }}>
      <div className="logo-badge" style={{ marginBottom: 24 }} aria-hidden="true">
        <IconLogo size={24} />
      </div>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 12 }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="btn-primary"
        style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '10px 24px' }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

