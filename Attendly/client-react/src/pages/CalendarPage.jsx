/**
 * CalendarPage.jsx — Monthly attendance calendar
 * ================================================
 * Fetches September 2026 calendar data and renders:
 *  - A 7-column month grid with colour-coded day cells
 *  - A detail panel showing per-class attendance on click
 * Uses local useState for selectedDate — only this page needs it.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCalendar } from '../services/api';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

const MONTH       = '2026-09';
const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarPage() {
  const { student } = useAuth();
  const [days, setDays]               = useState([]);
  const [dayMap, setDayMap]           = useState({});
  const [status, setStatus]           = useState('idle');
  const [error, setError]             = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function load() {
      if (!student?.rollNumber) return;
      setStatus('loading');
      try {
        const data = await getCalendar(student.rollNumber, MONTH);
        const map  = {};
        data.days.forEach(d => { map[d.date] = d; });
        setDays(data.days);
        setDayMap(map);
        setStatus('succeeded');

        // Default selected date: today if in Sept 2026, else Sept 15
        const today = new Date();
        const defaultDate =
          today.getFullYear() === 2026 && today.getMonth() === 8
            ? `2026-09-${String(today.getDate()).padStart(2, '0')}`
            : '2026-09-15';
        setSelectedDate(defaultDate);
      } catch (err) {
        setError(err.message);
        setStatus('failed');
      }
    }
    load();
  }, [student.rollNumber]);

  if (status === 'loading' || status === 'idle') {
    return <LoadingState message="Loading calendar..." />;
  }
  if (status === 'failed') {
    return <ErrorState message={error} />;
  }

  return (
    <div className="calendar-layout">
      {/* Calendar grid */}
      <div>
        <div id="calendar-grid-container">
          {/* Month heading */}
          <div className="calendar-header">
            <h2 className="calendar-month-title">September 2026</h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              September 2026 · Academic
            </div>
          </div>

          {/* Grid */}
          <div className="calendar-grid">
            {/* Weekday headers */}
            {DAY_HEADERS.map(h => (
              <div key={h} className="cal-day-header">{h}</div>
            ))}

            {/* Empty cell: Sept 1 is Tuesday = index 1 */}
            <div className="cal-day cal-empty" aria-hidden="true" />

            {/* Day cells */}
            {days.map(d => {
              const dateNum = parseInt(d.date.slice(-2), 10);
              const isSelected = d.date === selectedDate;
              const isWeekend = d.status === 'weekend';

              return (
                <div
                  key={d.date}
                  className={`cal-day cal-${d.status}${isSelected ? ' cal-selected' : ''}`}
                  data-date={d.date}
                  role={!isWeekend ? 'button' : 'presentation'}
                  tabIndex={!isWeekend ? 0 : -1}
                  aria-label={`${d.date}: ${d.status}`}
                  onClick={() => !isWeekend && setSelectedDate(d.date)}
                  onKeyDown={e => {
                    if (!isWeekend && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      setSelectedDate(d.date);
                    }
                  }}
                >
                  <span>{dateNum}</span>
                  {!isWeekend && <span className="cal-dot" aria-hidden="true" />}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            {['present', 'absent', 'partial', 'holiday', 'weekend'].map(s => (
              <div key={s} className="legend-item">
                <div className={`legend-dot ${s}`} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day detail panel */}
      <div
        className="day-detail-panel"
        id="day-detail"
        aria-live="polite"
        aria-label="Selected day details"
      >
        {selectedDate
          ? <DayDetail date={selectedDate} dayData={dayMap[selectedDate]} />
          : <div className="day-detail-empty">Select a day to see details.</div>
        }
      </div>
    </div>
  );
}

function DayDetail({ date, dayData }) {
  const jsDate      = new Date(date);
  const dateLabel   = jsDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const weekdayLabel = jsDate.toLocaleDateString('en-IN', { weekday: 'long' });

  if (!dayData) {
    return (
      <>
        <div className="day-detail-header">
          <div className="day-detail-date">{dateLabel}</div>
          <div className="day-detail-weekday">{weekdayLabel}</div>
        </div>
        <div className="day-detail-empty">No data for this day.</div>
      </>
    );
  }

  const statusBadge = {
    present: <span className="badge badge-safe">Present</span>,
    absent:  <span className="badge badge-danger">Absent</span>,
    holiday: <span className="badge" style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' }}>Holiday</span>,
    partial: <span className="badge" style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)' }}>Partial</span>,
    weekend: <span className="badge" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Weekend</span>,
  }[dayData.status];

  const absentCount = (dayData.classes || []).filter(c => c.status === 'absent').length;

  return (
    <>
      <div className="day-detail-header">
        <div className="day-detail-date">{dateLabel}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div className="day-detail-weekday">{weekdayLabel}</div>
          {statusBadge}
        </div>
      </div>

      {dayData.classes && dayData.classes.length > 0 ? (
        dayData.classes.map((cls, i) => (
          <div key={i} className="day-class-row">
            <span className="day-class-name">{cls.subject}</span>
            {cls.status === 'present'
              ? <span className="badge badge-safe" style={{ fontSize: '0.7rem' }}>Present</span>
              : <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Absent</span>
            }
          </div>
        ))
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '16px 0' }}>
          {dayData.status === 'weekend' ? 'No classes — weekend.' : 'No class data available.'}
        </p>
      )}

      {absentCount > 0 && (
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'var(--warning-bg)', border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--warning-text)',
        }}>
          ⚠ Absent in {absentCount} class{absentCount > 1 ? 'es' : ''} today.
        </div>
      )}
    </>
  );
}

