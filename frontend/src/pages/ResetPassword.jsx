import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';
import Logo from '../components/layout/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/login');
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Add your credentials to frontend/.env to enable accounts.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    toast.success('Password updated. Log in again.');
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <div><Logo /></div>
      </div>
      <main className="auth-main">
        <div className="card auth-card">
          <h1 className="auth-title">Choose a new password</h1>
          <p className="auth-sub">Aim for at least 8 characters.</p>
          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              error={error === 'Passwords do not match.' ? error : undefined}
            />
            {error && error !== 'Passwords do not match.' && (
              <div className="field-error" style={{ marginBottom: '0.75rem' }}>{error}</div>
            )}
            <Button type="submit" fullWidth loading={loading} loadingText="Updating password…">
              Update password
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}