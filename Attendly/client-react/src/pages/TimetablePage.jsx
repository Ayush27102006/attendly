/**
 * TimetablePage.jsx — Weekly timetable with day tabs
 * ====================================================
 * Fetches timetable from API, renders Mon–Fri tabs.
 * Auto-selects today's weekday on load.
 * Uses local useState for activeDay — only this page needs it.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTimetable } from '../services/api';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAY_MAP = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday' };

export default function TimetablePage() {
  const { student } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [status, setStatus]       = useState('idle');
  const [error, setError]         = useState('');
  const [activeDay, setActiveDay] = useState(
    DAY_MAP[new Date().getDay()] || 'Monday'
  );

  useEffect(() => {
    async function load() {
      if (!student?.rollNumber) return;
      setStatus('loading');
      try {
        const data = await getTimetable(student.rollNumber);
        setTimetable(data.timetable);
        setStatus('succeeded');
      } catch (err) {
        setError(err.message);
        setStatus('failed');
      }
    }
    load();
  }, [student?.rollNumber]);

  if (status === 'loading' || status === 'idle') {
    return <LoadingState message="Loading timetable..." />;
  }
  if (status === 'failed') {
    return <ErrorState message={error} />;
  }

  const periods = timetable?.[activeDay] || [];

  return (
    <>
      {/* Day tabs */}
      <div className="day-tabs" role="tablist" aria-label="Select weekday">
        {DAYS.map(day => (
          <button
            key={day}
            className={`day-tab${day === activeDay ? ' active' : ''}`}
            role="tab"
            aria-selected={day === activeDay}
            aria-controls={`panel-${day}`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Active day panel */}
      <div
        className="day-panel active"
        id={`panel-${activeDay}`}
        role="tabpanel"
      >
        {periods.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '24px 0' }}>
            No classes scheduled.
          </p>
        ) : (
          periods.map((period, i) => <PeriodCard key={i} period={period} />)
        )}
      </div>
    </>
  );
}

function PeriodCard({ period }) {
  if (period.type === 'break') {
    return (
      <div className="period-card break-card">
        <span className="period-time">{period.start} — {period.end}</span>
        <span className="break-label">☕ {period.label || 'Break'}</span>
      </div>
    );
  }

  if (period.type === 'lunch') {
    return (
      <div className="period-card lunch-card">
        <span className="period-time">{period.start} — {period.end}</span>
        <span className="lunch-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M18 8h1a4 4 0 010 8h-1"/>
            <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/>
            <line x1="10" y1="1" x2="10" y2="4"/>
            <line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
          {period.label || 'Lunch Break'}
        </span>
      </div>
    );
  }

  return (
    <div className="period-card">
      <span className="period-time">
        {period.start}<br />{period.end}
      </span>
      <div className="period-divider" aria-hidden="true" />
      <div className="period-subject">
        <h3>{period.subject}</h3>
        <p>{period.code} · {period.teacher}</p>
      </div>
      <div className="period-room">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        {period.room}
      </div>
    </div>
  );
}

