/**
 * DashboardPage.jsx — Main dashboard with attendance overview
 * ============================================================
 * PE-2 Requirement 3: Redux Toolkit — useSelector + useDispatch
 *
 * This page:
 * 1. Dispatches fetchAttendance thunk on mount (via useEffect)
 * 2. Reads attendance data and status from Redux store (useSelector)
 * 3. Renders SVG circular progress ring for overall attendance
 * 4. Renders 4 summary stat cards
 * 5. Renders 7 subject attendance cards
 *
 * Viva question: "What is useSelector?"
 * → A Redux hook that reads state from the store.
 *   The component automatically re-renders when the selected
 *   state changes (e.g., when data arrives from the API).
 *
 * Viva question: "What is useDispatch?"
 * → A Redux hook that returns the store's dispatch function.
 *   You call dispatch(action) to trigger a state change.
 *   dispatch(fetchAttendance(rollNumber)) starts the async thunk.
 */

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import {
  fetchAttendance,
  selectAttendanceData,
  selectAttendanceError,
  selectAttendanceStatus,
} from '../features/attendance/attendanceSlice';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import { getGreeting, statusClass } from '../utils/helpers';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { student } = useAuth();

  // Read attendance state from Redux store
  const data   = useSelector(selectAttendanceData);
  const status = useSelector(selectAttendanceStatus);
  const error  = useSelector(selectAttendanceError);

  // Track if we've already fetched (avoid re-fetching if data exists)
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && status === 'idle' && student?.rollNumber) {
      hasFetched.current = true;
      dispatch(fetchAttendance(student.rollNumber));
    }
  }, [dispatch, student?.rollNumber, status]);

  if (status === 'loading' || status === 'idle') {
    return <LoadingState message="Loading attendance..." />;
  }

  if (status === 'failed') {
    return (
      <ErrorState
        message={error}
        onRetry={() => student?.rollNumber && dispatch(fetchAttendance(student.rollNumber))}
      />
    );
  }

  if (!data) return null;

  const pct = data.overallPercentage;
  const ringColor =
    pct >= 75 ? 'var(--accent)' :
    pct >= 65 ? 'var(--warning-text)' :
    'var(--danger-text)';

  // SVG ring calculation (same formula as original dashboard.js)
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const statusLabel = pct >= 75 ? 'On Track' : pct >= 65 ? 'Warning Zone' : 'Critical';
  const statusBadge = pct >= 75 ? 'safe' : pct >= 65 ? 'warning' : 'danger';
  const message = pct >= 75
    ? "You're in the safe zone — keep it up!"
    : pct >= 65
    ? "You're close to the minimum threshold. Try not to miss more classes."
    : 'Your attendance is below the required 65% minimum. Attend classes immediately.';

  return (
    <>
      {/* Welcome greeting */}
      <section className="welcome-section" aria-labelledby="greeting">
        <h1 id="greeting" className="welcome-greeting">
          {getGreeting()}, {student?.name ? student.name.split(' ')[0] : 'Student'} 👋
        </h1>
        <div className="welcome-meta">
          <span className="meta-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
            </svg>
            {student?.branch}
          </span>
          <span className="meta-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            {student?.rollNumber}
          </span>
          <span className="meta-pill">
            {student?.semester}
          </span>
        </div>
      </section>

      {/* Circular progress overview */}
      <section aria-label="Overall attendance overview">
        <div className="card overview-grid">
          <div className="ring-container">
            <svg
              className="circle-progress"
              width="140" height="140"
              viewBox="0 0 140 140"
              aria-label={`${pct}% overall attendance`}
            >
              <circle className="circle-bg" cx="70" cy="70" r={radius} />
              <circle
                className="circle-fill"
                cx="70" cy="70" r={radius}
                stroke={ringColor}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
              <text x="70" y="66" textAnchor="middle" fontFamily="Inter,sans-serif"
                    fontSize="20" fontWeight="800" fill="#ffffff" dominantBaseline="middle">
                {pct}%
              </text>
              <text x="70" y="86" textAnchor="middle" fontFamily="Inter,sans-serif"
                    fontSize="9" fill="#a1a1aa">
                Overall
              </text>
            </svg>
          </div>

          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
              Attendance Overview
              <span style={{ marginLeft: 8 }} className={`badge badge-${statusBadge}`}>
                {statusLabel}
              </span>
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 420, lineHeight: 1.7 }}>
              Your overall attendance across <strong>{data.subjectCount}</strong> subjects is{' '}
              <strong style={{ color: ringColor }}>{pct}%</strong>. {message}
            </p>
            <div style={{ marginTop: 16 }}>
              <div className="progress-bar" style={{ height: 8 }}>
                <div
                  className={`progress-fill ${statusBadge}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                <span>0%</span>
                <span style={{ color: 'var(--warning-text)' }}>65%</span>
                <span style={{ color: 'var(--safe-text)' }}>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section aria-label="Attendance statistics" style={{ marginTop: 24 }}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(74,222,128,0.12)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--safe-text)' }}>{data.totalAttended}</div>
            <div className="stat-card-label">Classes Attended</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(248,113,113,0.12)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--danger-text)' }}>{data.totalMissed}</div>
            <div className="stat-card-label">Classes Missed</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(163,230,53,0.12)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="stat-card-value">{data.totalHeld}</div>
            <div className="stat-card-label">Total Classes Held</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(147,197,253,0.12)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
              </svg>
            </div>
            <div className="stat-card-value">{data.subjectCount}</div>
            <div className="stat-card-label">Total Subjects</div>
          </div>
        </div>
      </section>

      {/* Subject cards */}
      <section aria-label="Subject-wise attendance" style={{ marginTop: 8 }}>
        <h2 className="card-title" style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
          </svg>
          Subject-wise Attendance
        </h2>
        <div className="subjects-grid">
          {data.subjects.map((s) => {
            const sc = statusClass(s.status);
            const valueColor =
              sc === 'safe' ? 'var(--safe-text)' :
              sc === 'warning' ? 'var(--warning-text)' :
              'var(--danger-text)';
            return (
              <div key={s.code} className="subject-card">
                <div className="subject-card-top">
                  <div className="subject-card-info">
                    <h3>{s.name}</h3>
                    <p>{s.code} · {s.teacher}</p>
                  </div>
                  <div className="subject-pct" style={{ color: valueColor }}>
                    {s.percentage}%
                  </div>
                </div>
                <div className="subject-card-meta">
                  <span>{s.credits} Credits</span>
                  <span>·</span>
                  <span>{s.type || 'Theory'}</span>
                </div>
                <div className="progress-bar" style={{ marginBottom: 10 }}>
                  <div className={`progress-fill ${sc}`} style={{ width: `${s.percentage}%` }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="subject-card-stats">
                    <div className="stat-item">
                      <span className="stat-item-label">Attended</span>
                      <span className="stat-item-value" style={{ color: 'var(--safe-text)' }}>{s.attended}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-item-label">Missed</span>
                      <span className="stat-item-value" style={{ color: 'var(--danger-text)' }}>{s.missed}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-item-label">Held</span>
                      <span className="stat-item-value">{s.held}</span>
                    </div>
                  </div>
                  <span className={`badge badge-${sc}`}>{s.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
