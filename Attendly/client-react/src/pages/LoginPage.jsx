/**
 * LoginPage.jsx — Login page
 * ===========================
 * Renders the login card with branding and the LoginForm component.
 * If already authenticated, redirects to /dashboard automatically.
 *
 * Viva question: "Why does LoginPage redirect if already logged in?"
 * → If a logged-in user types /login in the browser, we don't want
 *   to show them the login form again. We check isAuthenticated from
 *   AuthContext and redirect to /dashboard if they're already in.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/forms/LoginForm';
import { IconLogo } from '../components/ui/Icons';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  // While initializing, render nothing (avoids flash)
  if (loading) return null;

  // Already logged in → go straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Branding */}
        <div className="login-logo" aria-label="Attendly">
          <div className="logo-badge" aria-hidden="true">
            <IconLogo size={24} />
          </div>
          <div className="logo-text">
            <span className="logo-name">Attendly</span>
            <span className="logo-tagline">Every class counts.</span>
          </div>
        </div>

        {/* Login card */}
        <div className="login-card" role="main">
          <h1 className="login-heading">Welcome back</h1>
          <p className="login-subheading">Sign in with your college roll number</p>

          {/*
           * LoginForm contains all form logic:
           *   - Controlled inputs (useState)
           *   - Validation
           *   - Submission (calls AuthContext.login)
           *   - Error display
           */}
          <LoginForm />

          {/* Demo credentials hint */}
          <div className="demo-creds" aria-label="Demo credentials">
            <h4>Demo Credentials</h4>
            <p>
              Roll Number: <code>2510991399</code><br />
              Password: <code>1234</code>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
