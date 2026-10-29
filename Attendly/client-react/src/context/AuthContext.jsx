/**
 * AuthContext.jsx — Global Authentication State (Context API)
 * ============================================================
 * PE-2 Requirement 2: Context API and State Architecture
 *
 * WHY Context API here?
 * → The logged-in student's info is needed by many components:
 *   Sidebar (shows name/roll), Topbar, every API call (uses rollNumber),
 *   ProtectedRoute (checks isAuthenticated), ProfilePage.
 *   Passing it as props to every component would be messy ("prop drilling").
 *   Context solves this cleanly.
 *
 * WHAT lives here:
 *   - student object (name, rollNumber, branch, semester, etc.)
 *   - isAuthenticated flag
 *   - loading state (while initializing from localStorage)
 *   - login() function (calls API, saves to localStorage)
 *   - logout() function (clears localStorage)
 *
 * WHAT does NOT live here:
 *   - Attendance data → that's in Redux (async, complex, shared)
 *   - Timetable active day → local state (only one component uses it)
 *   - Form input values → local state (belong to the form component)
 *
 * Viva question: "What is the difference between Context and Redux?"
 * → Context: lightweight, for app-wide simple state (who is logged in).
 *   Redux: for complex async data with loading/error states (attendance).
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiLogin } from '../services/api';
import { clearSession, getSession, saveSession } from '../services/authUtils';

// 1. Create the context object
//    This is what components will import and consume via useAuth()
const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app (in main.jsx).
 * Any component inside it can call useAuth() to access auth state.
 */
export function AuthProvider({ children }) {
  // The authenticated student object (or null if not logged in)
  const [student, setStudent] = useState(null);

  // True while we check localStorage on first load
  const [loading, setLoading] = useState(true);

  // ── Initialize from localStorage ──────────────────────────────────────
  // When the app first loads, check if a session was previously saved.
  // This is how the user stays logged in across page refreshes.
  useEffect(() => {
    const saved = getSession();
    if (saved) {
      setStudent(saved);
    }
    setLoading(false); // Done initializing — render the app
  }, []); // Empty array = run once on mount only

  // ── login() ───────────────────────────────────────────────────────────
  /**
   * Called by LoginForm on form submit.
   * Sends credentials to Express backend.
   * On success: saves session + updates state.
   * On failure: throws an Error so the form can display it.
   * @param {string} rollNumber
   * @param {string} password
   */
  const login = useCallback(async (rollNumber, password) => {
    const data = await apiLogin(rollNumber, password);
    // apiLogin throws on failure, so if we reach here it succeeded
    saveSession(data.student);
    setStudent(data.student);
  }, []);

  // ── logout() ──────────────────────────────────────────────────────────
  /**
   * Clears localStorage and resets state.
   * The Sidebar component calls this when the Logout button is clicked.
   * React Router's ProtectedRoute then redirects to /login automatically.
   */
  const logout = useCallback(() => {
    clearSession();
    setStudent(null);
  }, []);

  // ── Context value ─────────────────────────────────────────────────────
  // This object is available to every component that calls useAuth()
  const value = {
    student,
    isAuthenticated: student !== null,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth() — Custom hook to consume AuthContext.
 * Usage:  const { student, isAuthenticated, login, logout } = useAuth();
 *
 * Viva question: "Why create a custom hook instead of using useContext directly?"
 * → It gives a better error message if used outside the provider,
 *   and it's cleaner to write useAuth() than useContext(AuthContext) everywhere.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}

