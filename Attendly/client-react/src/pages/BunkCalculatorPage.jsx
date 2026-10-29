/**
 * BunkCalculatorPage.jsx — Interactive attendance calculator
 * ===========================================================
 * PE-2 Requirement 4: React Form Handling — controlled numeric inputs
 * PE-2 Requirement 3: Redux — reads attendance data to pre-fill inputs
 *
 * Converts the vanilla JS bunk-calculator.js to React:
 *  - Inputs are controlled with useState (not raw DOM values)
 *  - target slider is a controlled input
 *  - Real-time recalculation happens via useEffect watching the inputs
 *  - Pre-fills held/attended from Redux attendance data
 *  - The calculation math is in utils/bunkCalculations.js (pure function)
 *
 * Viva question: "What is a controlled range input?"
 * → Same as a controlled text input — value comes from React state,
 *   onChange updates that state. Every slider movement triggers a
 *   re-render with the new target value.
 */

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAttendanceData } from '../features/attendance/attendanceSlice';
import { calculateBunk } from '../utils/bunkCalculations';

const PRESETS = [65, 75, 80, 85];

export default function BunkCalculatorPage() {
  const attendanceData = useSelector(selectAttendanceData);

  // Controlled input state
  const [held, setHeld]       = useState('');
  const [attended, setAttended] = useState('');
  const [target, setTarget]   = useState(75);

  // Pre-fill from Redux attendance data if available
  useEffect(() => {
    if (attendanceData) {
      setHeld(String(attendanceData.totalHeld));
      setAttended(String(attendanceData.totalAttended));
    }
  }, [attendanceData]);

  // Run calculation from pure function
  const result = calculateBunk(
    parseInt(held) || 0,
    parseInt(attended) || 0,
    target
  );

  const currentColor =
    result.currentPct >= 75 ? 'var(--safe-text)' :
    result.currentPct >= 65 ? 'var(--warning-text)' :
    'var(--danger-text)';

  const currentBarClass =
    result.currentPct >= 75 ? 'safe' :
    result.currentPct >= 65 ? 'warning' : 'danger';

  return (
    <div className="calc-grid">
      {/* Left column — inputs */}
      <div>
        {/* Attendance inputs card */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <h2 className="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="7" y1="21" x2="3" y2="3"/><line x1="17" y1="21" x2="21" y2="3"/>
                <line x1="7" y1="12" x2="17" y2="12"/><line x1="5" y1="6" x2="19" y2="6"/>
                <line x1="9" y1="18" x2="15" y2="18"/>
              </svg>
              Your Attendance
            </h2>
          </div>

          <div className="input-row">
            {/* Controlled number input for classes held */}
            <div className="calc-input-group">
              <label htmlFor="inp-held">Total Classes Held</label>
              <input
                type="number"
                id="inp-held"
                className="calc-input"
                min="0" max="9999"
                placeholder="e.g. 224"
                value={held}
                onChange={e => setHeld(e.target.value)}
                aria-label="Total classes held"
              />
            </div>

            {/* Controlled number input for classes attended */}
            <div className="calc-input-group">
              <label htmlFor="inp-attended">Classes Attended</label>
              <input
                type="number"
                id="inp-attended"
                className="calc-input"
                min="0" max="9999"
                placeholder="e.g. 168"
                value={attended}
                onChange={e => setAttended(e.target.value)}
                aria-label="Classes attended"
              />
            </div>
          </div>

          {/* Live current percentage */}
          <div className="current-pct-display">
            <span
              className="current-pct-value"
              style={{ color: result.mode === 'empty' ? 'var(--text-muted)' : currentColor }}
            >
              {result.mode === 'empty' ? '—' : `${result.currentPct.toFixed(1)}%`}
            </span>
            <div className="current-pct-label">Current Attendance</div>
            <div className="progress-bar" style={{ marginTop: 12 }}>
              <div
                className={`progress-fill ${currentBarClass}`}
                style={{ width: `${Math.min(100, result.currentPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Target slider card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Target Attendance
            </h2>
          </div>

          <div className="target-slider-section">
            <div className="slider-header">
              <label htmlFor="target-slider">Drag to set target</label>
              <span className="slider-value" aria-live="polite">{target}%</span>
            </div>
            {/* Controlled range input */}
            <input
              type="range"
              id="target-slider"
              min="50" max="100" step="1"
              value={target}
              onChange={e => setTarget(Number(e.target.value))}
              aria-label="Target attendance percentage"
              aria-valuemin="50" aria-valuemax="100" aria-valuenow={target}
            />
            <div className="presets" role="group" aria-label="Quick target presets">
              {PRESETS.map(pct => (
                <button
                  key={pct}
                  className={`preset-btn${target === pct ? ' active' : ''}`}
                  data-pct={pct}
                  onClick={() => setTarget(pct)}
                  aria-label={`Set target to ${pct}%`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right column — result + formula */}
      <div>
        {/* Result panel */}
        <div className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h2 className="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
              </svg>
              Result
            </h2>
          </div>
          <div className="result-panel" aria-live="polite">
            <ResultContent result={result} />
          </div>
        </div>

        {/* Formula explanation */}
        <div className="formula-card">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
            </svg>
            How is this calculated?
          </h3>
          <p><strong style={{ color: 'var(--text-primary)' }}>If above target (can miss):</strong></p>
          <p>Solve: <em>attended ÷ (held + x) ≥ target</em></p>
          <div className="formula-code">x = floor( (attended − target × held) ÷ target )</div>
          <p><strong style={{ color: 'var(--text-primary)' }}>If below target (must attend):</strong></p>
          <p>Solve: <em>(attended + x) ÷ (held + x) ≥ target</em></p>
          <div className="formula-code">x = ceil( (target × held − attended) ÷ (1 − target) )</div>
        </div>
      </div>
    </div>
  );
}

function ResultContent({ result }) {
  const { mode, value, currentPct, targetPct } = result;
  const targetLabel  = `${targetPct}%`;
  const currentLabel = `${(currentPct || 0).toFixed(1)}%`;

  if (mode === 'empty') {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Enter the number of classes held to see your results.</p>
      </div>
    );
  }
  if (mode === 'invalid') {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--danger-text)' }}>
        <p>Classes attended cannot exceed classes held.</p>
      </div>
    );
  }
  if (mode === 'negative') {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--danger-text)' }}>
        <p>Values cannot be negative.</p>
      </div>
    );
  }
  if (mode === 'impossible') {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ color: 'var(--danger-text)', fontWeight: 600 }}>Target Unreachable</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 8 }}>
          A 100% target cannot be reached once any class has been missed.
        </p>
      </div>
    );
  }
  if (mode === 'at-target') {
    return (
      <>
        <div className="result-row"><span className="result-label">Current Attendance</span><span className="result-value accent">{currentLabel}</span></div>
        <div className="result-row"><span className="result-label">Target Attendance</span><span className="result-value">{targetLabel}</span></div>
        <div className="result-row"><span className="result-label">Status</span><span className="badge badge-safe">Exactly at Target</span></div>
        <div className="result-row" style={{ background: 'var(--warning-bg)' }}>
          <span className="result-label" style={{ color: 'var(--warning-text)' }}>⚠ Do not miss any more classes!</span>
          <span className="result-value warning">0 can miss</span>
        </div>
      </>
    );
  }
  if (mode === 'above') {
    return (
      <>
        <div className="result-row"><span className="result-label">Current Attendance</span><span className="result-value safe">{currentLabel}</span></div>
        <div className="result-row"><span className="result-label">Target Attendance</span><span className="result-value">{targetLabel}</span></div>
        <div className="result-row"><span className="result-label">Status</span><span className="badge badge-safe">Above Target ✓</span></div>
        <div className="result-row" style={{ background: 'var(--safe-bg)', borderTop: '1px solid var(--safe-border)' }}>
          <span className="result-label" style={{ color: 'var(--safe-text)' }}>You can still miss</span>
          <span className="result-value safe big">{value}</span>
        </div>
        <div style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          You can bunk <strong style={{ color: 'var(--safe-text)' }}>{value} more class{value !== 1 ? 'es' : ''}</strong> and still stay at or above {targetLabel}.
        </div>
      </>
    );
  }
  if (mode === 'below') {
    return (
      <>
        <div className="result-row"><span className="result-label">Current Attendance</span><span className="result-value danger">{currentLabel}</span></div>
        <div className="result-row"><span className="result-label">Target Attendance</span><span className="result-value">{targetLabel}</span></div>
        <div className="result-row"><span className="result-label">Status</span><span className="badge badge-danger">Below Target ✕</span></div>
        <div className="result-row" style={{ background: 'var(--danger-bg)', borderTop: '1px solid var(--danger-border)' }}>
          <span className="result-label" style={{ color: 'var(--danger-text)' }}>You need to attend</span>
          <span className="result-value danger big">{value}</span>
        </div>
        <div style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Attend the next <strong style={{ color: 'var(--danger-text)' }}>{value} consecutive class{value !== 1 ? 'es' : ''}</strong> without missing any to reach {targetLabel}.
        </div>
      </>
    );
  }
  return null;
}

