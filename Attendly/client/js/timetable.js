/**
 * timetable.js — Timetable page logic
 * ======================================
 * Fetches the weekly timetable and renders day-tabs with period cards.
 * Automatically selects the current weekday on load.
 */

const student = requireAuth();
initLayout(student, "timetable");

const containerEl = document.getElementById("timetable-container");

// Ordered day list matching the timetable data keys
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// JS getDay() → timetable day name (0=Sun stays unmapped, weekends won't match)
const DAY_MAP = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday" };

showLoading(containerEl, "Loading timetable...");

async function loadTimetable() {
  try {
    const data = await getTimetable(student.rollNumber);
    renderTimetable(data.timetable);
  } catch (err) {
    showError(containerEl, err.message, loadTimetable);
  }
}

loadTimetable();

function renderTimetable(timetable) {
  // Determine today's weekday; fall back to Monday if weekend
  const todayName = DAY_MAP[new Date().getDay()] || "Monday";

  // ── Day tabs ──────────────────────────────────────────────────────────
  const tabsHTML = DAYS.map(day => `
    <button class="day-tab${day === todayName ? " active" : ""}"
            data-day="${day}" role="tab"
            aria-selected="${day === todayName}"
            aria-controls="panel-${day}">
      ${day}
    </button>
  `).join("");

  // ── Day panels ─────────────────────────────────────────────────────────
  const panelsHTML = DAYS.map(day => {
    const periods = timetable[day] || [];
    const periodsHTML = periods.map(p => renderPeriod(p)).join("");
    return `
      <div class="day-panel${day === todayName ? " active" : ""}"
           id="panel-${day}" role="tabpanel" data-day="${day}">
        ${periodsHTML || '<p style="color:var(--text-muted);padding:24px 0;">No classes scheduled.</p>'}
      </div>
    `;
  }).join("");

  containerEl.innerHTML = `
    <div class="day-tabs" role="tablist" aria-label="Select weekday">${tabsHTML}</div>
    ${panelsHTML}
  `;

  // ── Tab switching logic ─────────────────────────────────────────────────
  document.querySelectorAll(".day-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      // Update active tab
      document.querySelectorAll(".day-tab").forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Show corresponding panel
      document.querySelectorAll(".day-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(`panel-${tab.dataset.day}`).classList.add("active");
    });
  });
}

/**
 * Render a single period card.
 * @param {object} period - Period data object from timetable
 * @returns {string} HTML string
 */
function renderPeriod(period) {
  if (period.type === "break") {
    return `
      <div class="period-card break-card">
        <span class="period-time">${period.start} — ${period.end}</span>
        <span class="break-label">☕ ${period.label || "Break"}</span>
      </div>
    `;
  }

  if (period.type === "lunch") {
    return `
      <div class="period-card lunch-card">
        <span class="period-time">${period.start} — ${period.end}</span>
        <span class="lunch-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/>
            <line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
          ${period.label || "Lunch Break"}
        </span>
      </div>
    `;
  }

  // Regular class period
  return `
    <div class="period-card">
      <span class="period-time">${period.start}<br>${period.end}</span>
      <div class="period-divider" aria-hidden="true"></div>
      <div class="period-subject">
        <h3>${period.subject}</h3>
        <p>${period.code} · ${period.teacher}</p>
      </div>
      <div class="period-room">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        ${period.room}
      </div>
    </div>
  `;
}
