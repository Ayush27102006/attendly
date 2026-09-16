/**
 * auth.js — Client-side authentication utilities
 * =================================================
 * Handles:
 *  - Storing / reading session from localStorage (no password stored)
 *  - Protecting pages that require login (requireAuth)
 *  - Logging out
 *
 * localStorage keys:
 *   attendly_student  → JSON string of safe student object
 *   attendly_authed   → "1" flag indicating active session
 */

const SESSION_KEY  = "attendly_student";
const AUTHED_KEY   = "attendly_authed";
const LOGIN_PAGE   = "/index.html";

/**
 * Save student info after a successful login.
 * Password must never be passed here.
 * @param {object} student - Safe student object from server
 */
function saveSession(student) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(student));
  localStorage.setItem(AUTHED_KEY, "1");
}

/**
 * Return the stored student object or null if not logged in.
 * @returns {object|null}
 */
function getSession() {
  if (localStorage.getItem(AUTHED_KEY) !== "1") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

/**
 * Clear session and redirect to login.
 * Called by logout buttons on every protected page.
 */
function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(AUTHED_KEY);
  window.location.href = LOGIN_PAGE;
}

/**
 * Guard function — every protected page must call this first.
 * If the user is not authenticated, they are redirected to the login page.
 * @returns {object} The stored student object (already verified non-null)
 */
function requireAuth() {
  const student = getSession();
  if (!student) {
    window.location.replace(LOGIN_PAGE);
    // Throw so the remainder of the page script doesn't execute
    throw new Error("Redirecting to login.");
  }
  return student;
}
