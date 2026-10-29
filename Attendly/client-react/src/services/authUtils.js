/**
 * authUtils.js — Client-side session helpers (ES Module)
 * ========================================================
 * This is the React version of client/js/auth.js.
 * These are plain functions — not hooks, not components.
 * They are called by AuthContext to read/write localStorage.
 *
 * localStorage keys:
 *   attendly_student → JSON string of the safe student profile
 *   attendly_authed  → "1" flag indicating an active session
 *
 * Viva question: "Why use localStorage for sessions?"
 * → It persists across page refreshes. When you reload the app,
 *   we can restore the session without asking the user to log in
 *   again. The password is never stored — only the student profile.
 */

const SESSION_KEY = 'attendly_student';
const AUTHED_KEY  = 'attendly_authed';

/**
 * Save student info after a successful login.
 * The password must NEVER be passed here — only the safe subset
 * returned by the Express server.
 * @param {object} student - Safe student profile from server
 */
export function saveSession(student) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(student));
  localStorage.setItem(AUTHED_KEY, '1');
}

/**
 * Return the stored student object, or null if not logged in.
 * @returns {object|null}
 */
export function getSession() {
  if (localStorage.getItem(AUTHED_KEY) !== '1') return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

/**
 * Clear the session from localStorage.
 * Called during logout — does NOT redirect (that is the component's job).
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(AUTHED_KEY);
}

