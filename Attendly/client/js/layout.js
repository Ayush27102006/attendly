/**
 * layout.js — Shared dashboard layout logic
 * ===========================================
 * Handles:
 *  - Injecting the sidebar HTML into every dashboard page
 *  - Populating student name/roll in sidebar footer
 *  - Setting active nav item based on current page
 *  - Mobile sidebar open/close behavior
 *  - Logout button wiring
 *  - Top navbar date display
 *
 * Each dashboard page includes this script AFTER auth.js.
 * Call: initLayout(student, pageKey)
 *   student  → from requireAuth()
 *   pageKey  → one of: "dashboard","attendance","timetable","calendar","bunk","about"
 */

/**
 * SVG icons used in the sidebar navigation.
 * Kept inline to avoid external icon library dependency.
 */
const NAV_ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
  attendance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  timetable:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  calendar:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg>`,
  bunk:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="21" x2="3" y2="3"/><line x1="17" y1="21" x2="21" y2="3"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="5" y1="6" x2="19" y2="6"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
  about:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  logout:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  logo:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  user:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  menu:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
};

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard",       href: "/pages/dashboard.html" },
  { key: "attendance",label: "Attendance",       href: "/pages/attendance.html" },
  { key: "timetable", label: "Timetable",        href: "/pages/timetable.html" },
  { key: "calendar",  label: "Calendar",         href: "/pages/calendar.html" },
  { key: "bunk",      label: "Bunk Calculator",  href: "/pages/bunk-calculator.html" },
  { key: "about",     label: "About",            href: "/pages/about.html" }
];

/**
 * Build the sidebar HTML and inject it into #sidebar-mount.
 * Also injects the sidebar overlay and top-bar date.
 * @param {object} student - Session student object
 * @param {string} pageKey - Current page identifier
 */
function initLayout(student, pageKey) {
  // ── Sidebar HTML ──────────────────────────────────────────────────────
  const navHTML = NAV_ITEMS.map(item => `
    <a href="${item.href}" class="nav-item${item.key === pageKey ? " active" : ""}" aria-label="${item.label}">
      ${NAV_ICONS[item.key]}
      <span>${item.label}</span>
    </a>
  `).join("");

  // Get first letter of first name for avatar
  const initial = student.name ? student.name.charAt(0).toUpperCase() : "S";

  const sidebarHTML = `
    <aside class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
      <div class="sidebar-header">
        <div class="sidebar-logo-badge">${NAV_ICONS.logo}</div>
        <span class="sidebar-title">Attendly</span>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Menu</div>
        ${navHTML}
      </nav>

      <div class="sidebar-footer">
        <div class="student-profile-mini">
          <div class="avatar" aria-hidden="true">${initial}</div>
          <div class="student-info-mini">
            <div class="student-name-mini truncate">${student.name || "Student"}</div>
            <div class="student-roll-mini">${student.rollNumber || ""}</div>
          </div>
        </div>
        <button class="btn-logout" id="btn-logout" aria-label="Logout">
          ${NAV_ICONS.logout}
          Logout
        </button>
      </div>
    </aside>

    <div class="sidebar-overlay" id="sidebar-overlay" aria-hidden="true"></div>
  `;

  // Inject sidebar before main content
  const mount = document.getElementById("sidebar-mount");
  if (mount) {
    mount.innerHTML = sidebarHTML;
  }

  // ── Topbar date ────────────────────────────────────────────────────────
  const dateEl = document.getElementById("topbar-date");
  if (dateEl) {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    dateEl.textContent = now.toLocaleDateString("en-IN", options);
  }

  // ── Student name in topbar (if element exists) ─────────────────────────
  const topbarStudent = document.getElementById("topbar-student");
  if (topbarStudent) {
    topbarStudent.textContent = student.name || "Student";
  }

  // ── Event wiring ───────────────────────────────────────────────────────
  // Logout button
  document.addEventListener("click", e => {
    if (e.target.closest("#btn-logout")) {
      logout();
    }
  });

  // Mobile menu button
  const btnMenu    = document.getElementById("btn-menu");
  const sidebar    = document.getElementById("sidebar");
  const overlay    = document.getElementById("sidebar-overlay");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    btnMenu && btnMenu.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    btnMenu && btnMenu.setAttribute("aria-expanded", "false");
  }

  if (btnMenu) {
    btnMenu.addEventListener("click", () => {
      if (sidebar.classList.contains("open")) closeSidebar();
      else openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // Close sidebar when a nav link is clicked on mobile
  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
}

/**
 * Show a loading state inside a container element.
 * @param {HTMLElement} el
 * @param {string} message
 */
function showLoading(el, message = "Loading...") {
  el.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Show an error state inside a container element.
 * @param {HTMLElement} el
 * @param {string} message
 * @param {Function} [onRetry] - Optional retry callback
 */
function showError(el, message = "Something went wrong.", onRetry) {
  el.innerHTML = `
    <div class="error-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <h3>Unable to load data</h3>
      <p>${message}</p>
      ${onRetry ? `<button class="btn-retry" id="btn-retry">Try again</button>` : ""}
    </div>
  `;
  if (onRetry) {
    document.getElementById("btn-retry")?.addEventListener("click", onRetry);
  }
}

/**
 * Get greeting based on current hour.
 * @returns {string} "Good morning" | "Good afternoon" | "Good evening"
 */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Format a percentage for display (one decimal, capped 0-100).
 * @param {number} pct
 * @returns {string}
 */
function formatPct(pct) {
  return Math.min(100, Math.max(0, pct)).toFixed(1);
}

/**
 * Return a CSS class suffix based on attendance status string.
 * "Safe" → "safe"  |  "Warning" → "warning"  |  "Danger" → "danger"
 * @param {string} status
 * @returns {string}
 */
function statusClass(status) {
  return status.toLowerCase();
}
