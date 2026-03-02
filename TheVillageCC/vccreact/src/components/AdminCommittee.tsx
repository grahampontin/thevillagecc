import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getCommitteePostsByYear, createCommitteePost, updateCommitteePost, deleteCommitteePost } from '../api/committeeApi';
import { getAllPlayers } from '../api/playersApi';
import { CommitteePostV1, PlayerV1 } from '../api/swaggerTypes';

const STANDARD_POSTS = [
  'Captain',
  'ViceCaptain',
  'FixturesSecretary',
  'Treasurer',
  'DirectorOfCricket',
  'SocialSecretary',
  'TourSecretary',
  'Webmaster',
];

interface CommitteeFormState {
  post: string;
  postOther: string;
  playerId: string;
  year: string;
}

const emptyForm = (year: number): CommitteeFormState => ({
  post: '',
  postOther: '',
  playerId: '',
  year: String(year),
});

const toFormState = (c: CommitteePostV1): CommitteeFormState => {
  const isStandard = STANDARD_POSTS.includes(c.post ?? '');
  return {
    post: isStandard ? (c.post ?? '') : 'Other',
    postOther: isStandard ? '' : (c.post ?? ''),
    playerId: c.playerId != null ? String(c.playerId) : '',
    year: c.year != null ? String(c.year) : '',
  };
};

const AdminCommittee: React.FC = () => {
  const [posts, setPosts] = useState<CommitteePostV1[]>([]);
  const [players, setPlayers] = useState<PlayerV1[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommitteePostV1 | null>(null);
  const [form, setForm] = useState<CommitteeFormState>(emptyForm(new Date().getFullYear()));
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPlayers = useCallback(async () => {
    try {
      const data = await getAllPlayers();
      data.sort((a, b) => (a.surname ?? '').localeCompare(b.surname ?? ''));
      setPlayers(data);
    } catch (err) {
      console.error('Failed to load players', err);
    }
  }, []);

  const loadPosts = useCallback(async (y: number) => {
    try {
      setIsLoading(true);
      const data = await getCommitteePostsByYear(y);
      data.sort((a, b) => (a.post ?? '').localeCompare(b.post ?? ''));
      setPosts(data);
    } catch (err) {
      console.error('Failed to load committee posts', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadPlayers(); }, [loadPlayers]);
  useEffect(() => { loadPosts(year); }, [loadPosts, year]);

  const openAdd = () => {
    setEditingPost(null);
    setForm(emptyForm(year));
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEdit = (c: CommitteePostV1) => {
    setEditingPost(c);
    setForm(toFormState(c));
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleDelete = async (c: CommitteePostV1) => {
    if (!window.confirm('Delete this committee post?')) return;
    try {
      await deleteCommitteePost(c.id!);
      await loadPosts(year);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const handleSave = async () => {
    const postValue = form.post === 'Other' ? form.postOther.trim() : form.post;
    if (!postValue || !form.playerId || !form.year) {
      setErrorMsg('Post, player, and year are required.');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const payload: CommitteePostV1 = {
        ...(editingPost ?? {}),
        post: postValue,
        playerId: parseInt(form.playerId, 10),
        year: parseInt(form.year, 10),
      };
      if (editingPost?.id != null) {
        await updateCommitteePost(payload);
      } else {
        await createCommitteePost(payload);
      }
      setModalOpen(false);
      await loadPosts(year);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const playerName = (playerId: number | undefined) => {
    if (!playerId) return '—';
    const p = players.find(pl => pl.playerId === playerId);
    return p ? `${p.firstName} ${p.surname}` : String(playerId);
  };

  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-1">
            <Link to="/admin" className="text-sm text-villageGreen hover:underline">← Admin</Link>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-villageText">Committee</h1>
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-villageGreen text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">add</span>
              Add post
            </button>
          </div>

          {/* Year navigation */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setYear(y => y - 1)}
              className="text-sm font-medium text-villageGreen hover:underline"
            >
              ← Previous year
            </button>
            <span className="text-sm text-gray-500">{year}</span>
            <button
              onClick={() => setYear(y => y + 1)}
              className="text-sm font-medium text-villageGreen hover:underline"
            >
              Next year →
            </button>
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg shadow-sm">
              {posts.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-800">
                    {c.post} – {playerName(c.playerId)}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-gray-500 hover:text-villageGreen transition"
                      aria-label={`Edit post ${c.post}`}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="text-gray-400 hover:text-red-600 transition"
                      aria-label={`Delete post ${c.post}`}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">delete</span>
                    </button>
                  </div>
                </li>
              ))}
              {posts.length === 0 && (
                <li className="px-4 py-6 text-sm text-gray-500 text-center">No committee posts for {year}.</li>
              )}
            </ul>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={editingPost ? 'Edit Committee Post' : 'Add Committee Post'}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">{editingPost ? 'Edit Committee Post' : 'Add Committee Post'}</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {errorMsg && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">{errorMsg}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="committee-post">Post</label>
                <select
                  id="committee-post"
                  value={form.post}
                  onChange={e => setForm(f => ({ ...f, post: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                >
                  <option value="">— Please select —</option>
                  {STANDARD_POSTS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="Other">Other…</option>
                </select>
              </div>
              {form.post === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="committee-post-other">Other Post</label>
                  <input
                    id="committee-post-other"
                    type="text"
                    value={form.postOther}
                    onChange={e => setForm(f => ({ ...f, postOther: e.target.value }))}
                    placeholder="Enter post title"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="committee-player">Player</label>
                <select
                  id="committee-player"
                  value={form.playerId}
                  onChange={e => setForm(f => ({ ...f, playerId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                >
                  <option value="">— Please select —</option>
                  {players.map(p => (
                    <option key={p.playerId} value={String(p.playerId)}>
                      {p.surname}, {p.firstName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="committee-year">Year</label>
                <input
                  id="committee-year"
                  type="number"
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-md bg-villageGreen text-white font-medium hover:bg-green-800 transition disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommittee;
