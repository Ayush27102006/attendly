/**
 * calendar.js — Attendance Calendar page logic
 * ==============================================
 * Fetches September 2026 attendance calendar and renders:
 *  - A full month calendar grid with colour-coded day cells
 *  - A detail panel showing per-class attendance on click
 */

const student = requireAuth();
initLayout(student, "calendar");

const calendarEl  = document.getElementById("calendar-grid-container");
const detailEl    = document.getElementById("day-detail");

const MONTH       = "2026-09";
const MONTH_LABEL = "September 2026";

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

showLoading(calendarEl, "Loading calendar...");

// ── Load data ─────────────────────────────────────────────────────────────────
async function loadCalendar() {
  try {
    const data = await getCalendar(student.rollNumber, MONTH);
    renderCalendar(data.days);
  } catch (err) {
    showError(calendarEl, err.message, loadCalendar);
  }
}

loadCalendar();

// ── Render calendar ────────────────────────────────────────────────────────────

/**
 * Build and inject the full calendar month grid.
 * @param {Array} days - Array of day objects from API
 */
function renderCalendar(days) {
  // Build a map: dateStr → dayObject for quick lookup
  const dayMap = {};
  days.forEach(d => { dayMap[d.date] = d; });

  // September 2026: 1st is a Tuesday (JS getDay() = 2)
  // In Mon-first week layout, Tuesday is column index 1 (0=Mon)
  const firstDayIndex = 1; // Tuesday

  // Build grid cells: empty placeholders + day cells
  let cellsHTML = "";

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDayIndex; i++) {
    cellsHTML += `<div class="cal-day cal-empty" aria-hidden="true"></div>`;
  }

  // Day cells 1–30
  for (let d = 1; d <= 30; d++) {
    const dateStr  = `2026-09-${String(d).padStart(2, "0")}`;
    const dayData  = dayMap[dateStr];
    const status   = dayData ? dayData.status : "weekend";

    const statusLabel = {
      present: "Present",
      absent:  "Absent",
      holiday: "Holiday",
      partial: "Partial",
      weekend: "Weekend"
    }[status] || status;

    cellsHTML += `
      <div class="cal-day cal-${status}"
           data-date="${dateStr}"
           role="${status !== 'weekend' && status !== 'empty' ? 'button' : 'presentation'}"
           tabindex="${status !== 'weekend' ? '0' : '-1'}"
           aria-label="${new Date(dateStr).toLocaleDateString('en-IN',{day:'numeric',month:'long'})}: ${statusLabel}">
        <span>${d}</span>
        ${status !== 'weekend' ? `<span class="cal-dot" aria-hidden="true"></span>` : ""}
      </div>
    `;
  }

  calendarEl.innerHTML = `
    <!-- Month heading & navigation -->
    <div class="calendar-header">
      <h2 class="calendar-month-title">${MONTH_LABEL}</h2>
      <div style="font-size:0.8125rem;color:var(--text-secondary);">
        September 2026 · Academic
      </div>
    </div>

    <!-- Weekday labels -->
    <div class="calendar-grid">
      ${DAY_HEADERS.map(h => `<div class="cal-day-header">${h}</div>`).join("")}
      ${cellsHTML}
    </div>

    <!-- Legend -->
    <div class="calendar-legend">
      <div class="legend-item"><div class="legend-dot present"></div> Present</div>
      <div class="legend-item"><div class="legend-dot absent"></div> Absent</div>
      <div class="legend-item"><div class="legend-dot partial"></div> Partial</div>
      <div class="legend-item"><div class="legend-dot holiday"></div> Holiday</div>
      <div class="legend-item"><div class="legend-dot weekend"></div> Weekend</div>
    </div>
  `;

  // Wire click & keyboard on each actionable day cell
  document.querySelectorAll(".cal-day:not(.cal-weekend):not(.cal-empty)").forEach(cell => {
    cell.addEventListener("click", () => selectDay(cell.dataset.date, dayMap));
    cell.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectDay(cell.dataset.date, dayMap);
      }
    });
  });

  // Default: show today if in September 2026, else show Sept 15
  const today = new Date();
  const defaultDate = (today.getFullYear() === 2026 && today.getMonth() === 8)
    ? `2026-09-${String(today.getDate()).padStart(2,"0")}`
    : "2026-09-15";

  selectDay(defaultDate, dayMap);
}

/**
 * Handle day selection: highlight cell and populate detail panel.
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {object} dayMap  - map of dateStr → dayObject
 */
function selectDay(dateStr, dayMap) {
  // Deselect previous
  document.querySelectorAll(".cal-day.cal-selected").forEach(c => c.classList.remove("cal-selected"));

  // Select clicked cell
  const cell = document.querySelector(`.cal-day[data-date="${dateStr}"]`);
  if (cell) cell.classList.add("cal-selected");

  // Populate detail panel
  renderDayDetail(dateStr, dayMap[dateStr]);
}

/**
 * Render the day detail panel on the right side.
 * @param {string} dateStr
 * @param {object|undefined} dayData
 */
function renderDayDetail(dateStr, dayData) {
  if (!detailEl) return;

  const jsDate   = new Date(dateStr);
  const dateOpts = { day: "numeric", month: "long", year: "numeric" };
  const dayOpts  = { weekday: "long" };
  const dateLabel    = jsDate.toLocaleDateString("en-IN", dateOpts);
  const weekdayLabel = jsDate.toLocaleDateString("en-IN", dayOpts);

  if (!dayData) {
    detailEl.innerHTML = `
      <div class="day-detail-header">
        <div class="day-detail-date">${dateLabel}</div>
        <div class="day-detail-weekday">${weekdayLabel}</div>
      </div>
      <div class="day-detail-empty">No data for this day.</div>
    `;
    return;
  }

  const statusBadges = {
    present: `<span class="badge badge-safe">Present</span>`,
    absent:  `<span class="badge badge-danger">Absent</span>`,
    holiday: `<span class="badge" style="background:var(--warning-bg);color:var(--warning-text);border:1px solid var(--warning-border);">Holiday</span>`,
    partial: `<span class="badge" style="background:rgba(251,146,60,0.12);color:#fb923c;border:1px solid rgba(251,146,60,0.25);">Partial</span>`,
    weekend: `<span class="badge" style="background:var(--bg-hover);color:var(--text-muted);border:1px solid var(--border);">Weekend</span>`
  };

  let classesHTML = "";

  if (dayData.classes && dayData.classes.length > 0) {
    classesHTML = dayData.classes.map(cls => `
      <div class="day-class-row">
        <span class="day-class-name">${cls.subject}</span>
        ${cls.status === "present"
          ? `<span class="badge badge-safe" style="font-size:0.7rem;">Present</span>`
          : `<span class="badge badge-danger" style="font-size:0.7rem;">Absent</span>`}
      </div>
    `).join("");
  } else {
    classesHTML = `<p style="color:var(--text-muted);font-size:0.875rem;padding:16px 0;">
      ${dayData.status === "weekend" ? "No classes — weekend." : "No class data available."}
    </p>`;
  }

  const absentCount = (dayData.classes || []).filter(c => c.status === "absent").length;
  const warningHTML = absentCount > 0 ? `
    <div style="margin-top:12px;padding:10px 14px;background:var(--warning-bg);border:1px solid var(--warning-border);
               border-radius:var(--radius-md);font-size:0.8rem;color:var(--warning-text);">
      ⚠ Absent in ${absentCount} class${absentCount > 1 ? "es" : ""} today.
    </div>
  ` : "";

  detailEl.innerHTML = `
    <div class="day-detail-header">
      <div class="day-detail-date">${dateLabel}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px;">
        <div class="day-detail-weekday">${weekdayLabel}</div>
        ${statusBadges[dayData.status] || ""}
      </div>
    </div>
    ${classesHTML}
    ${warningHTML}
  `;
}
