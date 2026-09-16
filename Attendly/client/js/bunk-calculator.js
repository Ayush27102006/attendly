/**
 * bunk-calculator.js — Interactive attendance calculator
 * =========================================================
 * Real-time calculations showing:
 *  - Current attendance percentage
 *  - How many classes the student can miss (if above target)
 *  - How many classes the student must attend (if below target)
 *
 * Formulas:
 *   Can miss  x: attended / (held + x) >= target  → x = floor((attended - target*held) / target)
 *   Must attend x: (attended + x) / (held + x) >= target → x = ceil((target*held - attended) / (1 - target))
 */

const student = requireAuth();
initLayout(student, "bunk");

// ── DOM references ─────────────────────────────────────────────────────────────
const heldInput      = document.getElementById("inp-held");
const attendedInput  = document.getElementById("inp-attended");
const targetSlider   = document.getElementById("target-slider");
const sliderVal      = document.getElementById("slider-val");
const currentPctEl   = document.getElementById("current-pct");
const currentPctBar  = document.getElementById("current-pct-bar");
const resultPanel    = document.getElementById("result-panel");
const presetBtns     = document.querySelectorAll(".preset-btn");

// ── Pre-fill from API if available ─────────────────────────────────────────────
(async function prefill() {
  try {
    const data = await getAttendance(student.rollNumber);
    heldInput.value     = data.totalHeld;
    attendedInput.value = data.totalAttended;
    calculate();
  } catch {
    // Non-fatal — user can fill manually
  }
})();

// ── Event listeners ────────────────────────────────────────────────────────────

// Recalculate whenever inputs change
[heldInput, attendedInput].forEach(el => {
  el.addEventListener("input", calculate);
});

// Slider moves
targetSlider.addEventListener("input", () => {
  sliderVal.textContent = targetSlider.value + "%";
  // Update active preset button highlighting
  presetBtns.forEach(b => {
    b.classList.toggle("active", parseInt(b.dataset.pct) === parseInt(targetSlider.value));
  });
  calculate();
});

// Preset buttons
presetBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    targetSlider.value     = btn.dataset.pct;
    sliderVal.textContent  = btn.dataset.pct + "%";
    presetBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    calculate();
  });
});

// Initial render
calculate();

// ── Core calculation ───────────────────────────────────────────────────────────

function calculate() {
  const held     = parseInt(heldInput.value)     || 0;
  const attended = parseInt(attendedInput.value) || 0;
  const target   = parseInt(targetSlider.value)  / 100;

  // ── Input validation ──────────────────────────────────────────────────
  if (held === 0) {
    showResult("empty", null, target);
    updateCurrentPct(0);
    return;
  }

  if (attended > held) {
    showResult("invalid", null, target);
    updateCurrentPct(0);
    return;
  }

  if (attended < 0 || held < 0) {
    showResult("negative", null, target);
    updateCurrentPct(0);
    return;
  }

  // ── Current percentage ────────────────────────────────────────────────
  const currentPct = attended / held;
  updateCurrentPct(currentPct * 100);

  // ── Target = 100% edge case ────────────────────────────────────────────
  if (target === 1.0) {
    if (currentPct === 1.0) {
      showResult("at-target", 0, target, currentPct);
    } else {
      // Cannot reach 100% once any class is missed
      showResult("impossible", null, target);
    }
    return;
  }

  // ── At or above target ────────────────────────────────────────────────
  if (currentPct >= target) {
    // Max classes that can be missed:
    // attended / (held + x) >= target
    // attended >= target * held + target * x
    // attended - target * held >= target * x
    // x <= (attended - target * held) / target
    const canMiss = Math.floor((attended - target * held) / target);

    if (canMiss === 0 && currentPct === target) {
      showResult("at-target", 0, target, currentPct);
    } else {
      showResult("above", canMiss, target, currentPct);
    }
    return;
  }

  // ── Below target ──────────────────────────────────────────────────────
  // Min classes to attend:
  // (attended + x) / (held + x) >= target
  // attended + x >= target * held + target * x
  // attended + x - target * x >= target * held
  // attended + x(1 - target) >= target * held
  // x >= (target * held - attended) / (1 - target)
  const mustAttend = Math.ceil((target * held - attended) / (1 - target));

  showResult("below", mustAttend, target, currentPct);
}

/**
 * Update the large current percentage display.
 * @param {number} pct - 0 to 100
 */
function updateCurrentPct(pct) {
  const display  = Math.min(100, Math.max(0, pct));
  const label    = display.toFixed(1) + "%";

  currentPctEl.textContent = label;

  // Set colour
  let color = "var(--safe-text)";
  if (pct < 65)      color = "var(--danger-text)";
  else if (pct < 75) color = "var(--warning-text)";
  currentPctEl.style.color = color;

  // Progress bar (if exists)
  if (currentPctBar) {
    currentPctBar.style.width = display + "%";
    const cls = pct >= 75 ? "safe" : pct >= 65 ? "warning" : "danger";
    currentPctBar.className = `progress-fill ${cls}`;
  }
}

/**
 * Render the result panel based on calculation outcome.
 * @param {"above"|"below"|"at-target"|"empty"|"invalid"|"negative"|"impossible"} mode
 * @param {number|null} value  - numeric result (canMiss or mustAttend)
 * @param {number}      target - target fraction (e.g. 0.75)
 * @param {number}      [currentPct] - current fraction
 */
function showResult(mode, value, target, currentPct = 0) {
  const targetLabel = (target * 100).toFixed(0) + "%";
  const currentLabel = (currentPct * 100).toFixed(1) + "%";

  if (mode === "empty") {
    resultPanel.innerHTML = `
      <div style="padding:32px;text-align:center;color:var(--text-muted);">
        <p>Enter the number of classes held to see your results.</p>
      </div>
    `;
    return;
  }

  if (mode === "invalid") {
    resultPanel.innerHTML = `
      <div style="padding:32px;text-align:center;color:var(--danger-text);">
        <p>Classes attended cannot exceed classes held.</p>
      </div>
    `;
    return;
  }

  if (mode === "negative") {
    resultPanel.innerHTML = `
      <div style="padding:32px;text-align:center;color:var(--danger-text);">
        <p>Values cannot be negative.</p>
      </div>
    `;
    return;
  }

  if (mode === "impossible") {
    resultPanel.innerHTML = `
      <div style="padding:32px;text-align:center;">
        <p style="color:var(--danger-text);font-weight:600;">Target Unreachable</p>
        <p style="font-size:0.875rem;color:var(--text-muted);margin-top:8px;">
          A 100% target cannot be reached once any class has been missed.
        </p>
      </div>
    `;
    return;
  }

  if (mode === "at-target") {
    resultPanel.innerHTML = `
      <div class="result-row">
        <span class="result-label">Current Attendance</span>
        <span class="result-value accent">${currentLabel}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Target Attendance</span>
        <span class="result-value">${targetLabel}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Status</span>
        <span class="badge badge-safe">Exactly at Target</span>
      </div>
      <div class="result-row" style="background:var(--warning-bg)">
        <span class="result-label" style="color:var(--warning-text);">⚠ Do not miss any more classes!</span>
        <span class="result-value warning">0 can miss</span>
      </div>
    `;
    return;
  }

  if (mode === "above") {
    resultPanel.innerHTML = `
      <div class="result-row">
        <span class="result-label">Current Attendance</span>
        <span class="result-value safe">${currentLabel}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Target Attendance</span>
        <span class="result-value">${targetLabel}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Status</span>
        <span class="badge badge-safe">Above Target ✓</span>
      </div>
      <div class="result-row" style="background:var(--safe-bg);border-top:1px solid var(--safe-border);">
        <span class="result-label" style="color:var(--safe-text);">You can still miss</span>
        <span class="result-value safe big">${value}</span>
      </div>
      <div style="padding:12px 16px;font-size:0.75rem;color:var(--text-muted);">
        You can bunk <strong style="color:var(--safe-text)">${value} more class${value !== 1 ? "es" : ""}</strong>
        and still stay at or above ${targetLabel} attendance.
      </div>
    `;
    return;
  }

  if (mode === "below") {
    resultPanel.innerHTML = `
      <div class="result-row">
        <span class="result-label">Current Attendance</span>
        <span class="result-value danger">${currentLabel}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Target Attendance</span>
        <span class="result-value">${targetLabel}</span>
      </div>
      <div class="result-row">
        <span class="result-label">Status</span>
        <span class="badge badge-danger">Below Target ✕</span>
      </div>
      <div class="result-row" style="background:var(--danger-bg);border-top:1px solid var(--danger-border);">
        <span class="result-label" style="color:var(--danger-text);">You need to attend</span>
        <span class="result-value danger big">${value}</span>
      </div>
      <div style="padding:12px 16px;font-size:0.75rem;color:var(--text-muted);">
        Attend the next <strong style="color:var(--danger-text)">${value} consecutive class${value !== 1 ? "es" : ""}</strong>
        without missing any to reach ${targetLabel} attendance.
      </div>
    `;
  }
}
