import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';
import Logo from '../components/layout/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Add your credentials to frontend/.env to enable accounts.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
    toast.info('Password reset link sent.');
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <main className="auth-main">
        <div className="card auth-card">
          <h1 className="auth-title">Reset your password</h1>
          <p className="auth-sub">
            {sent
              ? 'If that email has an account, we sent a reset link. Check your inbox.'
              : 'Enter your email and we’ll send you a reset link.'}
          </p>
          {!sent && (
            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {error && (
                <div className="field-error" style={{ marginBottom: '0.75rem' }}>{error}</div>
              )}
              <Button type="submit" fullWidth loading={loading} loadingText="Sending link…">
                Send reset link
              </Button>
            </form>
          )}
          <p className="auth-sub" style={{ textAlign: 'center', marginTop: '1.25rem', marginBottom: 0 }}>
            <Link to="/login" className="auth-link">Back to log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}