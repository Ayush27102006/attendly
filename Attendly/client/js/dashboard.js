/**
 * dashboard.js — Dashboard page logic
 * =====================================
 * Fetches attendance data from the API and renders:
 *  - Greeting with student info
 *  - SVG circular progress ring for overall attendance
 *  - Summary stat cards (attended, missed, total held, subjects)
 *  - Per-subject cards with progress bars and status badges
 */

// ── Init ──────────────────────────────────────────────────────────────────────
const student = requireAuth();
initLayout(student, "dashboard");

// DOM references
const greetingEl   = document.getElementById("greeting");
const metaEl       = document.getElementById("welcome-meta");
const overviewEl   = document.getElementById("overview-section");
const statsEl      = document.getElementById("stats-section");
const subjectsEl   = document.getElementById("subjects-section");

// ── Welcome section ───────────────────────────────────────────────────────────
greetingEl.textContent = `${getGreeting()}, ${student.name.split(" ")[0]} 👋`;

metaEl.innerHTML = `
  <span class="meta-pill">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
    ${student.branch}
  </span>
  <span class="meta-pill">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
    ${student.semester}
  </span>
  <span class="meta-pill">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    ${student.rollNumber}
  </span>
`;

// ── Load data ─────────────────────────────────────────────────────────────────
showLoading(overviewEl, "Loading attendance...");
showLoading(statsEl, "");
showLoading(subjectsEl, "");

async function loadDashboard() {
  try {
    const data = await getAttendance(student.rollNumber);
    renderOverview(data);
    renderStats(data);
    renderSubjects(data.subjects);
  } catch (err) {
    showError(overviewEl, err.message, loadDashboard);
    statsEl.innerHTML = "";
    subjectsEl.innerHTML = "";
  }
}

loadDashboard();

// ── Render functions ──────────────────────────────────────────────────────────

/**
 * Draw the SVG circular progress ring for overall attendance.
 * @param {object} data - API attendance response
 */
function renderOverview(data) {
  const pct    = data.overallPercentage;
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  // Dashoffset: full circle = circ, 0% = circ, 100% = 0
  const offset = circ - (pct / 100) * circ;

  // Determine ring colour
  let ringColor = "var(--accent)";
  if (pct < 65)       ringColor = "var(--danger-text)";
  else if (pct < 75)  ringColor = "var(--warning-text)";

  overviewEl.innerHTML = `
    <div class="card overview-grid">
      <div class="ring-container">
        <svg class="circle-progress" width="140" height="140" viewBox="0 0 140 140" aria-label="${pct}% overall attendance">
          <circle class="circle-bg"   cx="70" cy="70" r="${radius}" />
          <circle class="circle-fill" cx="70" cy="70" r="${radius}"
            stroke="${ringColor}"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${circ}"
            id="ring-fill"
          />
          <text x="70" y="66" text-anchor="middle" font-family="Inter,sans-serif"
                font-size="20" font-weight="800" fill="#ffffff" dominant-baseline="middle">
            ${pct}%
          </text>
          <text x="70" y="86" text-anchor="middle" font-family="Inter,sans-serif"
                font-size="9" fill="#a1a1aa">
            Overall
          </text>
        </svg>
      </div>

      <div>
        <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:8px;">
          Attendance Overview
          <span style="margin-left:8px;" class="badge badge-${pct >= 75 ? 'safe' : pct >= 65 ? 'warning' : 'danger'}">
            ${pct >= 75 ? 'On Track' : pct >= 65 ? 'Warning Zone' : 'Critical'}
          </span>
        </h2>
        <p style="font-size:0.875rem;color:var(--text-secondary);max-width:420px;line-height:1.7;">
          Your overall attendance across <strong>${data.subjectCount}</strong> subjects is
          <strong style="color:${ringColor}">${pct}%</strong>.
          ${pct >= 75
            ? "You're in the safe zone — keep it up!"
            : pct >= 65
            ? "You're close to the minimum threshold. Try not to miss more classes."
            : "Your attendance is below the required 65% minimum. Attend classes immediately."}
        </p>
        <div style="margin-top:16px;">
          <div class="progress-bar" style="height:8px;">
            <div class="progress-fill ${pct >= 75 ? 'safe' : pct >= 65 ? 'warning' : 'danger'}"
                 style="width:${pct}%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-top:4px;">
            <span>0%</span><span style="color:var(--warning-text);">65%</span>
            <span style="color:var(--safe-text);">75%</span><span>100%</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Animate the ring after a tick to allow CSS transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const fill = document.getElementById("ring-fill");
      if (fill) fill.style.strokeDashoffset = offset;
    });
  });
}

/**
 * Render the summary stat cards.
 * @param {object} data
 */
function renderStats(data) {
  statsEl.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon" style="background:rgba(74,222,128,0.12);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="stat-card-value" style="color:var(--safe-text);">${data.totalAttended}</div>
        <div class="stat-card-label">Classes Attended</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon" style="background:rgba(248,113,113,0.12);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
        <div class="stat-card-value" style="color:var(--danger-text);">${data.totalMissed}</div>
        <div class="stat-card-label">Classes Missed</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon" style="background:rgba(163,230,53,0.12);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="stat-card-value">${data.totalHeld}</div>
        <div class="stat-card-label">Total Classes Held</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon" style="background:rgba(147,197,253,0.12);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
        </div>
        <div class="stat-card-value">${data.subjectCount}</div>
        <div class="stat-card-label">Total Subjects</div>
      </div>
    </div>
  `;
}

/**
 * Render the subject attendance cards grid.
 * @param {Array} subjects
 */
function renderSubjects(subjects) {
  const cardsHTML = subjects.map(s => {
    const sc = statusClass(s.status);
    return `
      <div class="subject-card">
        <div class="subject-card-top">
          <div class="subject-card-info">
            <h3>${s.name}</h3>
            <p>${s.code} · ${s.teacher}</p>
          </div>
          <div>
            <div class="subject-pct" style="color:var(--${sc === 'safe' ? 'safe-text' : sc === 'warning' ? 'warning-text' : 'danger-text'});">
              ${s.percentage}%
            </div>
          </div>
        </div>

        <div class="subject-card-meta">
          <span>${s.credits} Credits</span>
          <span>·</span>
          <span>${s.type || "Theory"}</span>
        </div>

        <div class="progress-bar" style="margin-bottom:10px;">
          <div class="progress-fill ${sc}" style="width:${s.percentage}%"></div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div class="subject-card-stats">
            <div class="stat-item">
              <span class="stat-item-label">Attended</span>
              <span class="stat-item-value" style="color:var(--safe-text);">${s.attended}</span>
            </div>
            <div class="stat-item">
              <span class="stat-item-label">Missed</span>
              <span class="stat-item-value" style="color:var(--danger-text);">${s.missed}</span>
            </div>
            <div class="stat-item">
              <span class="stat-item-label">Held</span>
              <span class="stat-item-value">${s.held}</span>
            </div>
          </div>
          <span class="badge badge-${sc}">${s.status}</span>
        </div>
      </div>
    `;
  }).join("");

  subjectsEl.innerHTML = `
    <h2 class="card-title" style="margin-bottom:16px;font-size:1rem;font-weight:700;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
      Subject-wise Attendance
    </h2>
    <div class="subjects-grid">${cardsHTML}</div>
  `;
}
