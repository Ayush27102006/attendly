/**
 * attendance.js — Attendance records page logic
 * ===============================================
 * Fetches subject attendance, renders a desktop table and mobile cards,
 * and provides filter buttons (All / Safe / Warning / Danger).
 */

const student = requireAuth();
initLayout(student, "attendance");

const containerEl = document.getElementById("attendance-container");

// Current filter state
let currentFilter = "all";
let allSubjects   = [];

// ── Load data ─────────────────────────────────────────────────────────────────
showLoading(containerEl, "Loading attendance records...");

async function loadAttendance() {
  try {
    const data = await getAttendance(student.rollNumber);
    allSubjects = data.subjects;
    renderPage(data);
  } catch (err) {
    showError(containerEl, err.message, loadAttendance);
  }
}

loadAttendance();

// ── Render ────────────────────────────────────────────────────────────────────

function renderPage(data) {
  containerEl.innerHTML = `
    <!-- Summary strip -->
    <div class="stats-grid" id="att-stats" style="margin-bottom:24px;"></div>

    <!-- Filter bar -->
    <div class="filter-bar" id="filter-bar" role="group" aria-label="Filter by status">
      <button class="filter-btn active" data-filter="all"     >All (${data.subjects.length})</button>
      <button class="filter-btn"        data-filter="safe"    >✓ Safe</button>
      <button class="filter-btn"        data-filter="warning" >⚠ Warning</button>
      <button class="filter-btn"        data-filter="danger"  >✕ Danger</button>
    </div>

    <!-- Desktop table -->
    <div class="table-wrapper" id="att-table-wrapper">
      <table id="att-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Code</th>
            <th style="text-align:right">Held</th>
            <th style="text-align:right">Attended</th>
            <th style="text-align:right">Missed</th>
            <th style="min-width:140px">Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="att-tbody"></tbody>
      </table>
    </div>

    <!-- Mobile cards (shown only ≤768px) -->
    <div class="mobile-cards" id="att-mobile"></div>
  `;

  // Render stats strip
  renderStats(data);

  // Wire filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter();
    });
  });

  // Initial render with all subjects
  applyFilter();
}

function renderStats(data) {
  const safe    = data.subjects.filter(s => s.status === "Safe").length;
  const warning = data.subjects.filter(s => s.status === "Warning").length;
  const danger  = data.subjects.filter(s => s.status === "Danger").length;

  document.getElementById("att-stats").innerHTML = `
    <div class="stat-card">
      <div class="stat-card-icon" style="background:rgba(74,222,128,0.12)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="stat-card-value" style="color:var(--safe-text)">${safe}</div>
      <div class="stat-card-label">Safe Subjects</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon" style="background:rgba(234,179,8,0.12)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div class="stat-card-value" style="color:var(--warning-text)">${warning}</div>
      <div class="stat-card-label">Warning Zone</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon" style="background:rgba(239,68,68,0.12)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <div class="stat-card-value" style="color:var(--danger-text)">${danger}</div>
      <div class="stat-card-label">Danger Zone</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon" style="background:rgba(163,230,53,0.12)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
      </div>
      <div class="stat-card-value">${data.subjects.length}</div>
      <div class="stat-card-label">Total Subjects</div>
    </div>
  `;
}

/**
 * Filter allSubjects and re-render table and mobile cards.
 */
function applyFilter() {
  const filtered = currentFilter === "all"
    ? allSubjects
    : allSubjects.filter(s => s.status.toLowerCase() === currentFilter);

  renderTable(filtered);
  renderMobileCards(filtered);
}

function renderTable(subjects) {
  const tbody = document.getElementById("att-tbody");
  if (!tbody) return;

  if (subjects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);">No subjects match this filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = subjects.map(s => {
    const sc = statusClass(s.status);
    return `
      <tr>
        <td>
          <div style="font-weight:600">${s.name}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${s.teacher}</div>
        </td>
        <td style="color:var(--text-muted);font-size:0.8125rem;">${s.code}</td>
        <td style="text-align:right;font-variant-numeric:tabular-nums">${s.held}</td>
        <td style="text-align:right;font-variant-numeric:tabular-nums;color:var(--safe-text)">${s.attended}</td>
        <td style="text-align:right;font-variant-numeric:tabular-nums;color:var(--danger-text)">${s.missed}</td>
        <td class="td-progress">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="progress-bar" style="flex:1;">
              <div class="progress-fill ${sc}" style="width:${s.percentage}%"></div>
            </div>
            <span style="font-size:0.8125rem;font-weight:600;min-width:40px;text-align:right;">${s.percentage}%</span>
          </div>
        </td>
        <td><span class="badge badge-${sc}">${s.status}</span></td>
      </tr>
    `;
  }).join("");
}

function renderMobileCards(subjects) {
  const container = document.getElementById("att-mobile");
  if (!container) return;

  if (subjects.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:32px 0;">No subjects match this filter.</p>`;
    return;
  }

  container.innerHTML = subjects.map(s => {
    const sc = statusClass(s.status);
    return `
      <div class="mob-att-card">
        <div class="mob-att-head">
          <div>
            <div class="mob-att-name">${s.name}</div>
            <div class="mob-att-code">${s.code} · ${s.teacher}</div>
          </div>
          <span class="badge badge-${sc}">${s.status}</span>
        </div>
        <div class="mob-att-stats">
          <span style="color:var(--safe-text)">✓ ${s.attended}</span>
          <span style="color:var(--danger-text)">✕ ${s.missed}</span>
          <span style="color:var(--text-muted)">/${s.held}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${sc}" style="width:${s.percentage}%"></div>
        </div>
        <div style="text-align:right;font-size:0.875rem;font-weight:700;margin-top:6px;
                    color:var(--${sc === 'safe' ? 'safe-text' : sc === 'warning' ? 'warning-text' : 'danger-text'});">
          ${s.percentage}%
        </div>
      </div>
    `;
  }).join("");
}
