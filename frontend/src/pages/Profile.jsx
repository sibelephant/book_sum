import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/Logo';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { useUser } from '../hooks/useUser';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const { user } = useUser();
  const toast = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const initials = (user?.email || 'U').split('@')[0].slice(0, 2).toUpperCase();

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Profile updated');
  };

  const changePassword = async () => {
    if (!user) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.info('Password reset link sent to your email.');
  };

  const deleteAccount = async () => {
    const { error } = await supabase.rpc('delete_own_account');
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Account deleted');
    navigate('/');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    navigate('/');
  };

  if (!user) {
    return (
      <AppShell active="profile">
        <div className="page-body">
          <div className="center-screen"><p className="page-sub">Log in to see your profile.</p></div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell active="profile">
      <TopBar user={user} />
      <div className="page-body">
        <div className="page-head">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-sub">Manage your account details.</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="card profile-card">
            <div className="profile-top">
              <div className="avatar avatar-lg">{initials}</div>
              <div>
                <h2 className="profile-name">{fullName || 'Your name'}</h2>
                <p className="profile-email">{email}</p>
              </div>
            </div>
            <div className="field" style={{ marginTop: '1.5rem' }}>
              <label className="field-label" htmlFor="full-name">Full name</label>
              <input
                id="full-name"
                className="input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <Button onClick={saveProfile} loading={saving} loadingText="Saving…">Save changes</Button>
          </div>

          <div className="card profile-card">
            <h3 className="side-card-title" style={{ marginBottom: '1rem' }}>Security</h3>
            <Button variant="secondary" onClick={changePassword}>Change password</Button>
            <div className="danger-zone">
              <h3 className="side-card-title">Danger zone</h3>
              <p className="danger-desc">Deleting your account removes all your summaries and data. This can’t be undone.</p>
              <div className="btn-row">
                <Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete account</Button>
                <Button variant="ghost" onClick={logout}>Log out</Button>
              </div>
            </div>
          </div>
        </div>

        <ConfirmationDialog
          open={confirmDelete}
          title="Delete your account?"
          message="This will permanently delete your account and all your summaries. Are you sure?"
          confirmLabel="Yes, delete"
          onConfirm={deleteAccount}
          onCancel={() => setConfirmDelete(false)}
        />
      </div>
    </AppShell>
  );
}