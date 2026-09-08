import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';
import Logo from '../components/layout/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!fullName.trim()) return 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setError(v);
    if (v) return;
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Add your credentials to frontend/.env to enable accounts.');
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      toast.success('Welcome to Summara!');
      navigate('/dashboard');
    } else {
      toast.info('Check your email to confirm your account.');
      navigate('/login');
    }
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
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">Start turning books into understanding in minutes.</p>
          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Full name"
              placeholder="Ada Lovelace"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              error={error === 'Passwords do not match.' ? error : undefined}
            />
            {error && error !== 'Passwords do not match.' && (
              <div className="field-error" style={{ marginBottom: '0.75rem' }}>{error}</div>
            )}
            <Button type="submit" fullWidth loading={loading} loadingText="Creating account…">
              Create account
            </Button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <p className="auth-sub" style={{ textAlign: 'center', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}