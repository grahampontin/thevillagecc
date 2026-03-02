import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getAllTeams, createTeam, updateTeam } from '../api/teamsApi';
import { TeamV1 } from '../api/swaggerTypes';

const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<TeamV1[]>([]);
  const [listFilter, setListFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamV1 | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredTeams = useMemo(() => {
    if (!listFilter.trim()) return teams;
    return teams.filter(t => (t.name ?? '').toLowerCase().includes(listFilter.toLowerCase()));
  }, [teams, listFilter]);

  const loadTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllTeams();
      data.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
      setTeams(data);
    } catch (err) {
      console.error('Failed to load teams', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadTeams(); }, [loadTeams]);

  const openAdd = () => {
    setEditingTeam(null);
    setName('');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEdit = (t: TeamV1) => {
    setEditingTeam(t);
    setName(t.name ?? '');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const payload: TeamV1 = { ...(editingTeam ?? {}), name: name.trim() };
      if (editingTeam?.id != null) {
        await updateTeam(payload);
      } else {
        await createTeam(payload);
      }
      setModalOpen(false);
      await loadTeams();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-2xl font-semibold text-villageText">Teams</h1>
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-villageGreen text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">add</span>
              Add team
            </button>
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="mt-4">
                <input
                  type="text"
                  value={listFilter}
                  onChange={e => setListFilter(e.target.value)}
                  placeholder="Filter teams…"
                  aria-label="Filter teams"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <ul className="mt-3 divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg shadow-sm">
                {filteredTeams.map((t) => (
                  <li key={t.id} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-800">{t.name}</span>
                    <button
                      onClick={() => openEdit(t)}
                      className="text-gray-500 hover:text-villageGreen transition"
                      aria-label={`Edit ${t.name}`}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">edit</span>
                    </button>
                  </li>
                ))}
                {filteredTeams.length === 0 && (
                  <li className="px-4 py-6 text-sm text-gray-500 text-center">No teams found.</li>
                )}
              </ul>
            </>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={editingTeam ? 'Edit Team' : 'Add Team'}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">{editingTeam ? 'Edit Team' : 'Add Team'}</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {errorMsg && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">{errorMsg}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="team-name">Name</label>
                <input
                  id="team-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="A name by which to know them"
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

export default AdminTeams;
