import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/Logo';
import TopBar from '../components/layout/TopBar';
import SearchBar from '../components/ui/SearchBar';
import SummaryCard from '../components/ui/SummaryCard';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';

const LENGTHS = [
  { id: '', label: 'Any length' },
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'detailed', label: 'Detailed' },
];
const STYLES = [
  { id: '', label: 'Any style' },
  { id: 'simple', label: 'Simple' },
  { id: 'academic', label: 'Academic' },
  { id: 'bullets', label: 'Bullet points' },
];

export default function MySummaries() {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const q = searchParams.get('q') || '';
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState('');
  const [style, setStyle] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const fetchData = React.useCallback(async () => {
    if (!user) return;
    let query = supabase
      .from('summaries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (length) query = query.eq('length', length);
    if (style) query = query.eq('style', style);
    if (q) query = query.ilike('title', `%${q}%`);
    setLoading(true);
    const { data, error } = await query;
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSummaries(data || []);
  }, [user, q, length, style, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from('summaries').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Summary deleted');
    setConfirmId(null);
    fetchData();
  };

  return (
    <AppShell active="summaries">
      <TopBar user={user} />
      <div className="page-body">
        <div className="page-head">
          <div>
            <h1 className="page-title">My Summaries</h1>
            <p className="page-sub">All your saved summaries in one place.</p>
          </div>
        </div>

        <div className="filters-row">
          <SearchBar
            value={q}
            onChange={(val) => {
              if (val) setSearchParams({ q: val });
              else setSearchParams({});
            }}
            placeholder="Search summaries…"
          />
          <div className="filter-selects">
            <select className="select" value={length} onChange={(e) => setLength(e.target.value)} aria-label="Filter by length">
              {LENGTHS.map((l) => (
                <option key={l.id || 'any'} value={l.id}>{l.label}</option>
              ))}
            </select>
            <select className="select" value={style} onChange={(e) => setStyle(e.target.value)} aria-label="Filter by style">
              {STYLES.map((s) => (
                <option key={s.id || 'any'} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="center-pad"><Spinner label="Loading summaries…" /></div>
        ) : summaries.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No summaries found"
            description={
              q || length || style
                ? 'Try adjusting your search or filters.'
                : 'You haven’t saved any summaries yet. Create one to get started.'
            }
            action={<button type="button" className="btn btn-primary" onClick={() => navigate('/new')}>New Summary</button>}
          />
        ) : (
          <div className="grid-2">
            {summaries.map((s) => (
              <SummaryCard
                key={s.id}
                summary={s}
                onOpen={() => navigate('/result', { state: { summary: s.content, sourceTitle: s.title, length: s.length, style: s.style } })}
                onDownload={() => {
                  const blob = new Blob([s.content], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${(s.title || 'summary').replace(/\s+/g, '-').toLowerCase()}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                onDelete={() => setConfirmId(s.id)}
              />
            ))}
          </div>
        )}

        {confirmId && (
          <ConfirmationDialog
            open={!!confirmId}
            title="Delete summary?"
            message="This will permanently remove this summary. This action can’t be undone."
            confirmLabel="Delete"
            onConfirm={() => handleDelete(confirmId)}
            onCancel={() => setConfirmId(null)}
          />
        )}
      </div>
    </AppShell>
  );
}