import React, { useState } from 'react';
import { AppShell } from '../components/layout/Logo';
import TopBar from '../components/layout/TopBar';
import { useUser } from '../hooks/useUser';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { user } = useUser();
  const toast = useToast();
  const [tts, setTts] = useState('openai');
  const [defaultLength, setDefaultLength] = useState('medium');
  const [notif, setNotif] = useState(true);

  const handleChange = (fn) => (val) => {
    fn(val);
    toast.success('Setting saved');
  };

  return (
    <AppShell active="settings">
      <TopBar user={user} />
      <div className="page-body">
        <div className="page-head">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-sub">Configure your preferences.</p>
          </div>
        </div>

        <div className="card settings-card">
          <h3 className="side-card-title">Audio</h3>
          <div className="setting-row">
            <div>
              <p className="setting-label">Text-to-speech engine</p>
              <p className="setting-desc">Used for “Listen to Summary”.</p>
            </div>
            <select className="select" value={tts} onChange={(e) => handleChange(setTts)(e.target.value)}>
              <option value="openai">OpenAI TTS</option>
              <option value="browser">Browser Speech</option>
            </select>
          </div>
          <div className="setting-row">
            <div>
              <p className="setting-label">Default summary length</p>
              <p className="setting-desc">Pre-selected on the New Summary page.</p>
            </div>
            <select className="select" value={defaultLength} onChange={(e) => handleChange(setDefaultLength)(e.target.value)}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
          <div className="setting-row">
            <div>
              <p className="setting-label">Email notifications</p>
              <p className="setting-desc">Receive updates when your summary is ready.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notif} onChange={(e) => handleChange(setNotif)(e.target.checked)} />
              <span className="switch-slider" />
            </label>
          </div>
        </div>
      </div>
    </AppShell>
  );
}