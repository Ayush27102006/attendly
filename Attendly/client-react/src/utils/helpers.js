/**
 * helpers.js — Shared utility functions (ES Module)
 * ===================================================
 * Extracted from client/js/layout.js.
 * These are pure functions — they take inputs and return outputs
 * with no side effects. Easy to test and reuse anywhere.
 */

/**
 * Return a greeting based on the current hour.
 * @returns {"Good morning"|"Good afternoon"|"Good evening"}
 */
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Format a percentage for display (one decimal, clamped 0–100).
 * @param {number} pct
 * @returns {string} e.g. "73.8"
 */
export function formatPct(pct) {
  return Math.min(100, Math.max(0, pct)).toFixed(1);
}

/**
 * Return a CSS class suffix from an attendance status string.
 * "Safe" → "safe" | "Warning" → "warning" | "Danger" → "danger"
 * @param {string} status
 * @returns {string}
 */
export function statusClass(status) {
  return (status || '').toLowerCase();
}

/**
 * Format a Date object as a long human-readable string for India locale.
 * e.g. "Thursday, 29 October 2026"
 * @returns {string}
 */
export function formatDateLong() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

