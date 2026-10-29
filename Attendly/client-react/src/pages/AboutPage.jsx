/**
 * AboutPage.jsx — About Attendly & Technical Documentation
 * ==========================================================
 * Converted from client/pages/about.html.
 * Demonstrates the full architecture, tech stack, and viva explanations
 * for the university evaluation.
 */

import { IconLogo } from '../components/ui/Icons';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Hero */}
      <div className="about-hero">
        <div className="logo-badge-large" aria-hidden="true">
          <IconLogo size={32} />
        </div>
        <h1>Attendly</h1>
        <p>CSE · 3rd Semester · FEE-II PE-2 Project</p>
        <div className="about-badges">
          <span className="about-badge accent">v2.0 (PE-2)</span>
          <span className="about-badge">React 19</span>
          <span className="about-badge">Vite</span>
          <span className="about-badge">React Router v7</span>
          <span className="about-badge">Redux Toolkit</span>
          <span className="about-badge">Context API</span>
          <span className="about-badge">Node.js / Express</span>
        </div>
      </div>

      {/* What is Attendly */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="card-title" style={{ marginBottom: 12 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          What is Attendly?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9375rem' }}>
          Attendly is a modern student attendance management Single Page Application (SPA). It empowers students to track their attendance across subjects, view weekly class schedules, monitor monthly attendance calendars, and run real-time "bunk" predictions to stay safely above the mandatory 75% attendance threshold.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9375rem', marginTop: 12 }}>
          Upgraded for the <strong>FEE-II Project Evaluation-II</strong>, Attendly demonstrates a clean full-stack architecture combining a high-performance React frontend with the original Node.js Express REST API.
        </p>
      </div>

      {/* PE-2 Four Technical Pillars */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
        PE-2 University Requirements Implementation
      </h2>

      <div className="features-grid" style={{ marginBottom: 32 }}>
        <div className="feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h3>1. React Router & SPA</h3>
          <p>Multi-page client-side routing using React Router v7, shared AppLayout with dynamic Topbar, ProtectedRoute guard, and active NavLink indicators without full page reloads.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3>2. Context API & Global State</h3>
          <p>AuthContext provides student identity, authentication status, login/logout operations, and session persistence in localStorage with graceful initialization states.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <h3>3. Redux Toolkit</h3>
          <p>Centralized Redux store with <code>attendanceSlice</code>, <code>createAsyncThunk</code> for API communication, synchronous filter actions, and memoized selectors.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="7" y1="21" x2="3" y2="3"/><line x1="17" y1="21" x2="21" y2="3"/>
              <line x1="7" y1="12" x2="17" y2="12"/><line x1="5" y1="6" x2="19" y2="6"/>
            </svg>
          </div>
          <h3>4. React Form Handling</h3>
          <p>Controlled inputs with real-time state, reusable FormField and Input components, client-side validation, error alerts, submission spinners, and interactive range sliders.</p>
        </div>
      </div>

      {/* Architecture diagram */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        System Architecture Flow
      </h2>

      <div className="arch-diagram" style={{ marginBottom: 24 }}>
        <div className="arch-flow">
          <div className="arch-node accent-node">
            <div className="arch-node-title">👤 User / Browser</div>
            <div className="arch-node-desc">React 19 SPA (Vite Dev Server :5173)</div>
          </div>
          <div className="arch-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
            </svg>
            <span>/api/* Proxy</span>
          </div>
          <div className="arch-node">
            <div className="arch-node-title">🌐 Express REST API</div>
            <div className="arch-node-desc">server.js (Node.js :5000)</div>
          </div>
          <div className="arch-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
            </svg>
            <span>JSON In-Memory</span>
          </div>
          <div className="arch-node accent-node">
            <div className="arch-node-title">📦 Data Modules</div>
            <div className="arch-node-desc">students.js · attendance.js · timetable.js · calendar.js</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', padding: '24px 0 8px' }}>
        Built for CSE · FEE-II Project Evaluation-II · Attendly v2.0
      </div>
    </div>
  );
}

