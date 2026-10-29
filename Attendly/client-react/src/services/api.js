/**
 * api.js — Centralized API communication layer (ES Module)
 * ==========================================================
 * This is the React version of client/js/api.js.
 * All fetch() calls to the Express backend live here.
 * The Vite dev proxy forwards /api/* to http://localhost:5000
 * so no CORS configuration is needed.
 *
 * Every function is async and:
 *   - Returns the parsed JSON body on success
 *   - Throws an Error with a human-readable message on failure
 *
 * Viva question: "Why centralise API calls?"
 * → One place to change the base URL, add auth headers, or handle
 *   errors consistently. Pages don't write their own fetch logic.
 */

const BASE_URL = ''; // Same origin in production; proxy handles it in dev

/**
 * Generic fetch wrapper.
 * Handles network errors and non-2xx HTTP responses uniformly.
 * @param {string} url
 * @param {object} options - fetch options
 * @returns {Promise<object>} Parsed JSON
 */
async function apiFetch(url, options = {}) {
  const defaults = {
    headers: { 'Content-Type': 'application/json' },
  };

  const response = await fetch(BASE_URL + url, { ...defaults, ...options });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned an unexpected response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}.`);
  }

  return data;
}

/**
 * POST /api/auth/login
 * @param {string} rollNumber
 * @param {string} password
 * @returns {Promise<{success: boolean, student: object}>}
 */
export async function apiLogin(rollNumber, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ rollNumber, password }),
  });
}

/**
 * GET /api/student/:rollNumber
 * @param {string} rollNumber
 * @returns {Promise<{success: boolean, student: object}>}
 */
export async function getStudent(rollNumber) {
  return apiFetch(`/api/student/${rollNumber}`);
}

/**
 * GET /api/attendance/:rollNumber
 * @param {string} rollNumber
 * @returns {Promise<{success, overallPercentage, totalHeld, totalAttended, totalMissed, subjectCount, subjects[]}>}
 */
export async function getAttendance(rollNumber) {
  return apiFetch(`/api/attendance/${rollNumber}`);
}

/**
 * GET /api/timetable/:rollNumber
 * @param {string} rollNumber
 * @returns {Promise<{success, timetable: object}>}
 */
export async function getTimetable(rollNumber) {
  return apiFetch(`/api/timetable/${rollNumber}`);
}

/**
 * GET /api/calendar/:rollNumber?month=YYYY-MM
 * @param {string} rollNumber
 * @param {string} month - e.g. "2026-09"
 * @returns {Promise<{success, month, days[]}>}
 */
export async function getCalendar(rollNumber, month) {
  const query = month ? `?month=${month}` : '';
  return apiFetch(`/api/calendar/${rollNumber}${query}`);
}

