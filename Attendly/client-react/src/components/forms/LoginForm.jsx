/**
 * LoginForm.jsx — Login form with validation and submission handling
 * ==================================================================
 * PE-2 Requirement 4: React Form Handling
 * Also uses: Context API (calls login from useAuth)
 *
 * This component:
 *   1. Manages form state with useState (rollNumber, password)
 *   2. Validates inputs before submission
 *   3. Shows inline error messages (field-level and server-level)
 *   4. Shows a loading spinner during API call
 *   5. Disables the submit button while submitting (prevents duplicate submits)
 *   6. Calls AuthContext.login() on submission
 *   7. On success: redirects to /dashboard via useNavigate
 *   8. On failure: shows the server error message
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';
import FormField from './FormField';

export default function LoginForm() {
  const navigate = useNavigate();

  // ── Form state ───────────────────────────────────────────────────────
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword]     = useState('');

  // ── Validation errors ────────────────────────────────────────────────
  const [rollError, setRollError]       = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError]   = useState('');

  // ── Submission state ─────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Get login function from AuthContext ───────────────────────────────
  const { login } = useAuth();

  // ── Validation ────────────────────────────────────────────────────────
  function validate() {
    let valid = true;

    if (!rollNumber.trim()) {
      setRollError('Roll number is required.');
      valid = false;
    } else {
      setRollError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  }

  // ── Form submission ────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await login(rollNumber.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Login form"
    >
      {/* Roll Number field — uses reusable FormField component */}
      <FormField
        id="roll-number"
        name="rollNumber"
        label="Roll Number"
        type="text"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        placeholder="e.g. 2510991399"
        autoComplete="username"
        inputMode="numeric"
        error={rollError}
        disabled={isSubmitting}
      />

      {/* Password field */}
      <FormField
        id="password"
        name="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        autoComplete="current-password"
        error={passwordError}
        disabled={isSubmitting}
      />

      {/* Server-side error (wrong credentials, network error) */}
      {serverError && (
        <div
          className="login-error visible"
          role="alert"
          aria-live="polite"
        >
          {serverError}
        </div>
      )}

      {/* Submit button with loading state */}
      <button
        type="submit"
        className="btn-primary"
        disabled={isSubmitting}
        aria-label="Sign in"
      >
        <span>{isSubmitting ? 'Signing in…' : 'Sign In'}</span>
        {isSubmitting && (
          <Spinner size={18} borderWidth={2} />
        )}
      </button>
    </form>
  );
}
