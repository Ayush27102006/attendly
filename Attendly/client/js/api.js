/**
 * api.js — Centralized API communication layer
 * ================================================
 * All fetch() calls to the Express backend live here.
 * Pages import these functions instead of writing their own fetch logic.
 *
 * Every function is async and returns the parsed JSON body on success,
 * or throws an Error with a friendly message on failure.
 */

const BASE_URL = ""; // Same origin — Express serves both frontend and API

/**
 * Generic fetch wrapper.
 * Throws a human-readable error on network failure or non-2xx HTTP status.
 * @param {string} url     - API path
 * @param {object} options - fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} Parsed JSON response
 */
async function apiFetch(url, options = {}) {
  const defaults = {
    headers: { "Content-Type": "application/json" }
  };

  const response = await fetch(BASE_URL + url, { ...defaults, ...options });

  // Try to parse body regardless of status — server may send error JSON
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned an unexpected response (${response.status}).`);
  }

  if (!response.ok) {
    // Use server-provided message when available
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
async function apiLogin(rollNumber, password) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ rollNumber, password })
  });
}

/**
 * GET /api/student/:rollNumber
 * @param {string} rollNumber
 * @returns {Promise<{success: boolean, student: object}>}
 */
async function getStudent(rollNumber) {
  return apiFetch(`/api/student/${rollNumber}`);
}

/**
 * GET /api/attendance/:rollNumber
 * @param {string} rollNumber
 * @returns {Promise<{success: boolean, overallPercentage: number, subjects: Array, ...}>}
 */
async function getAttendance(rollNumber) {
  return apiFetch(`/api/attendance/${rollNumber}`);
}

/**
 * GET /api/timetable/:rollNumber
 * @param {string} rollNumber
 * @returns {Promise<{success: boolean, timetable: object}>}
 */
async function getTimetable(rollNumber) {
  return apiFetch(`/api/timetable/${rollNumber}`);
}

/**
 * GET /api/calendar/:rollNumber?month=YYYY-MM
 * @param {string} rollNumber
 * @param {string} month - Format: "YYYY-MM" (e.g. "2026-09")
 * @returns {Promise<{success: boolean, month: string, days: Array}>}
 */
async function getCalendar(rollNumber, month) {
  const query = month ? `?month=${month}` : "";
  return apiFetch(`/api/calendar/${rollNumber}${query}`);
}
