/**
 * AttendancePage.jsx — Filterable attendance records table
 * =========================================================
 * PE-2 Requirement 3: Redux Toolkit — useSelector + useDispatch
 *
 * Shows the same data as Dashboard but in a table format with filters.
 * Uses Redux for attendance data (shared with Dashboard, no duplicate fetch).
 * Uses local useState for nothing extra — filter state is in Redux too,
 * shared between this page and theoretically any other component.
 *
 * Viva question: "Why is the filter in Redux and not useState?"
 * → The filter could be preserved when you navigate away and come back.
 *   It's part of the attendance feature's state, not just this component's
 *   internal UI state. useSelector(selectFilteredSubjects) derives the
 *   filtered list directly — no extra calculation in the component.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import {
  fetchAttendance,
  selectAttendanceData,
  selectAttendanceError,
  selectAttendanceStatus,
  selectFilteredSubjects,
  selectAttendanceFilter,
  setFilter,
} from '../features/attendance/attendanceSlice';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import { statusClass } from '../utils/helpers';

const FILTERS = [
  { key: 'all',     label: 'All' },
  { key: 'safe',    label: '✓ Safe' },
  { key: 'warning', label: '⚠ Warning' },
  { key: 'danger',  label: '✕ Danger' },
];

export default function AttendancePage() {
  const dispatch = useDispatch();
  const { student } = useAuth();

  const data            = useSelector(selectAttendanceData);
  const status          = useSelector(selectAttendanceStatus);
  const error           = useSelector(selectAttendanceError);
  const currentFilter   = useSelector(selectAttendanceFilter);
  const filteredSubjects = useSelector(selectFilteredSubjects);

  useEffect(() => {
    // Only fetch if we don't already have the data
    if (status === 'idle' && student?.rollNumber) {
      dispatch(fetchAttendance(student.rollNumber));
    }
  }, [dispatch, student?.rollNumber, status]);

  if (status === 'loading' || status === 'idle') {
    return <LoadingState message="Loading attendance records..." />;
  }
  if (status === 'failed') {
    return <ErrorState message={error} onRetry={() => student?.rollNumber && dispatch(fetchAttendance(student.rollNumber))} />;
  }
  if (!data) return null;

  const safe    = data.subjects.filter(s => s.status === 'Safe').length;
  const warning = data.subjects.filter(s => s.status === 'Warning').length;
  const danger  = data.subjects.filter(s => s.status === 'Danger').length;

  return (
    <>
      {/* Summary strip */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(74,222,128,0.12)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--safe-text)' }}>{safe}</div>
          <div className="stat-card-label">Safe Subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(234,179,8,0.12)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--warning-text)' }}>{warning}</div>
          <div className="stat-card-label">Warning Zone</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--danger-text)' }}>{danger}</div>
          <div className="stat-card-label">Danger Zone</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'rgba(163,230,53,0.12)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
            </svg>
          </div>
          <div className="stat-card-value">{data.subjects.length}</div>
          <div className="stat-card-label">Total Subjects</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar" role="group" aria-label="Filter by status">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`filter-btn${currentFilter === f.key ? ' active' : ''}`}
            data-filter={f.key}
            onClick={() => dispatch(setFilter(f.key))}
          >
            {f.key === 'all' ? `All (${data.subjects.length})` : f.label}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th style={{ textAlign: 'right' }}>Held</th>
              <th style={{ textAlign: 'right' }}>Attended</th>
              <th style={{ textAlign: 'right' }}>Missed</th>
              <th style={{ minWidth: 140 }}>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  No subjects match this filter.
                </td>
              </tr>
            ) : (
              filteredSubjects.map(s => {
                const sc = statusClass(s.status);
                return (
                  <tr key={s.code}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.teacher}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{s.code}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s.held}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--safe-text)' }}>{s.attended}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--danger-text)' }}>{s.missed}</td>
                    <td className="td-progress">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className={`progress-fill ${sc}`} style={{ width: `${s.percentage}%` }} />
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
                          {s.percentage}%
                        </span>
                      </div>
                    </td>
                    <td><span className={`badge badge-${sc}`}>{s.status}</span></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mobile-cards">
        {filteredSubjects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>
            No subjects match this filter.
          </p>
        ) : (
          filteredSubjects.map(s => {
            const sc = statusClass(s.status);
            const valueColor =
              sc === 'safe' ? 'var(--safe-text)' :
              sc === 'warning' ? 'var(--warning-text)' :
              'var(--danger-text)';
            return (
              <div key={s.code} className="mob-att-card">
                <div className="mob-att-head">
                  <div>
                    <div className="mob-att-name">{s.name}</div>
                    <div className="mob-att-code">{s.code} · {s.teacher}</div>
                  </div>
                  <span className={`badge badge-${sc}`}>{s.status}</span>
                </div>
                <div className="mob-att-stats">
                  <span style={{ color: 'var(--safe-text)' }}>✓ {s.attended}</span>
                  <span style={{ color: 'var(--danger-text)' }}>✕ {s.missed}</span>
                  <span style={{ color: 'var(--text-muted)' }}>/{s.held}</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${sc}`} style={{ width: `${s.percentage}%` }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.875rem', fontWeight: 700, marginTop: 6, color: valueColor }}>
                  {s.percentage}%
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

