import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';
import Logo from '../components/layout/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setError('');
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Add your credentials to frontend/.env to enable accounts.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Wrong email or password.' : err.message);
      return;
    }
    if (remember) {
      localStorage.setItem('remb', email);
    }
    toast.success(`Welcome back!`);
    navigate('/dashboard');
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Log in to see your summaries.</p>
          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {error && (
              <div className="field-error" style={{ marginBottom: '0.75rem' }}>{error}</div>
            )}
            <div className="auth-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="auth-link auth-link-sm">Forgot password?</Link>
            </div>
            <Button type="submit" fullWidth loading={loading} loadingText="Logging in…">
              Log in
            </Button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <p className="auth-sub" style={{ textAlign: 'center', marginBottom: 0 }}>
            New to Summara?{' '}
            <Link to="/register" className="auth-link">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}