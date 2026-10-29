/**
 * ProfilePage.jsx — Student profile page
 * ========================================
 * Uses the GET /api/student/:rollNumber endpoint.
 * This is the new page added for the React migration.
 * Reads student profile including email, phone, and DOB
 * which are not shown anywhere else in the app.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudent } from '../services/api';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import { IconProfile } from '../components/ui/Icons';

export default function ProfilePage() {
  const { student: authStudent } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [status, setStatus]     = useState('idle');
  const [error, setError]       = useState('');

  useEffect(() => {
    async function load() {
      if (!authStudent?.rollNumber) return;
      setStatus('loading');
      try {
        const data = await getStudent(authStudent.rollNumber);
        setProfile(data.student);
        setStatus('succeeded');
      } catch (err) {
        setError(err.message);
        setStatus('failed');
      }
    }
    load();
  }, [authStudent?.rollNumber]);

  if (status === 'loading' || status === 'idle') {
    return <LoadingState message="Loading profile..." />;
  }
  if (status === 'failed') {
    return <ErrorState message={error} />;
  }
  if (!profile) return null;

  const initial = profile.name?.charAt(0).toUpperCase() ?? 'S';

  const fields = [
    { label: 'Roll Number',  value: profile.rollNumber },
    { label: 'Branch',       value: profile.branch },
    { label: 'Semester',     value: profile.semester },
    { label: 'Section',      value: profile.section },
    { label: 'Session',      value: profile.session },
    { label: 'Email',        value: profile.email },
    { label: 'Phone',        value: profile.phone },
    { label: 'Date of Birth', value: profile.dob },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Profile header card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 8 }}>
          {/* Large avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--accent-dim)', border: '2px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)',
            flexShrink: 0,
          }}>
            {initial}
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>
              {profile.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {profile.branch} · {profile.semester}
            </p>
            <span className="badge badge-safe" style={{ marginTop: 8, display: 'inline-block' }}>
              Active Student
            </span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: 20 }}>
          <IconProfile size={18} />
          Student Details
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {fields.map(({ label, value }) => (
            <div key={label} style={{
              padding: '14px 16px',
              background: 'var(--bg-base)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {value || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

