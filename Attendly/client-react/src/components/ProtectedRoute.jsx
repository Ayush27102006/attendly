/**
 * ProtectedRoute.jsx — Route guard for authenticated pages
 * ==========================================================
 * PE-2 Requirement 1: React Router — Protected Routes
 *
 * This is the React equivalent of requireAuth() from auth.js.
 *
 * How it works:
 * 1. Reads isAuthenticated and loading from AuthContext
 * 2. While loading (checking localStorage on startup): shows nothing
 * 3. If not authenticated: redirects to /login using <Navigate>
 * 4. If authenticated: renders the protected content via <Outlet>
 *
 * Viva question: "How did the original vanilla JS protect pages?"
 * → requireAuth() ran at the top of each page's script, checked
 *   localStorage, and called window.location.replace('/index.html')
 *   if no session was found. Every page had to call it manually.
 *
 * Viva question: "How does ProtectedRoute work differently?"
 * → It uses React Router's <Navigate> component for client-side
 *   redirect — no page reload. It wraps all protected routes in
 *   the router config, so no page needs to check auth itself.
 *   One component protects all routes automatically.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // While AuthContext is initializing from localStorage, render nothing.
  // This prevents a flash-redirect to /login on page refresh.
  if (loading) return null;

  // If not logged in, redirect to login page.
  // "replace" means this URL won't be added to browser history,
  // so pressing Back won't return to a protected page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child route's component.
  return <Outlet />;
}

