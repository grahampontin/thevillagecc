import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getAllPlayers, createPlayer, updatePlayer } from '../api/playersApi';
import { PlayerV1 } from '../api/swaggerTypes';

const BOWLING_STYLES: { value: string; label: string }[] = [
  { value: 'RF', label: 'Right-arm fast' },
  { value: 'RFM', label: 'Right-arm fast-medium' },
  { value: 'RMF', label: 'Right-arm medium-fast' },
  { value: 'RM', label: 'Right-arm medium' },
  { value: 'RMS', label: 'Right-arm medium-slow' },
  { value: 'RSM', label: 'Right-arm slow-medium' },
  { value: 'RS', label: 'Right-arm slow' },
  { value: 'LF', label: 'Left-arm fast' },
  { value: 'LFM', label: 'Left-arm fast-medium' },
  { value: 'LMF', label: 'Left-arm medium-fast' },
  { value: 'LM', label: 'Left-arm medium' },
  { value: 'LMS', label: 'Left-arm medium-slow' },
  { value: 'LSM', label: 'Left-arm slow-medium' },
  { value: 'LS', label: 'Left-arm slow' },
  { value: 'OB', label: 'Off break' },
  { value: 'LB', label: 'Leg break' },
  { value: 'LBG', label: 'Leg break googly' },
  { value: 'SLA', label: 'Slow left-arm orthodox' },
  { value: 'SLW', label: 'Slow left-arm wrist spin' },
  { value: 'LAG', label: 'Left-arm googly' },
];

interface FormState {
  firstName: string;
  surname: string;
  middleInitials: string;
  isRightHandBat: boolean;
  bowlingStyle: string;
  isActive: boolean;
  clubConnectionPlayerId: string;
}

const toFormState = (p: PlayerV1, players: PlayerV1[]): FormState => ({
  firstName: p.firstName ?? '',
  surname: p.surname ?? '',
  middleInitials: p.middleInitials ?? '',
  isRightHandBat: p.isRightHandBat ?? true,
  bowlingStyle: p.bowlingStyle ?? '',
  isActive: p.isActive ?? true,
  clubConnectionPlayerId: p.clubConnection?.playerId != null ? String(p.clubConnection.playerId) : '',
});

const AdminPlayers: React.FC = () => {
  const [players, setPlayers] = useState<PlayerV1[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerV1 | null>(null);
  const [form, setForm] = useState<FormState>({
    firstName: '', surname: '', middleInitials: '',
    isRightHandBat: true, bowlingStyle: '', isActive: true, clubConnectionPlayerId: '',
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPlayers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllPlayers();
      data.sort((a, b) => (a.surname ?? '').localeCompare(b.surname ?? ''));
      setPlayers(data);
    } catch (err) {
      console.error('Failed to load players', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadPlayers(); }, [loadPlayers]);

  const openAdd = () => {
    setEditingPlayer(null);
    setForm({ firstName: '', surname: '', middleInitials: '', isRightHandBat: true, bowlingStyle: '', isActive: true, clubConnectionPlayerId: '' });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEdit = (p: PlayerV1) => {
    setEditingPlayer(p);
    setForm(toFormState(p, players));
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.surname.trim()) {
      setErrorMsg('First name and surname are required.');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const clubConn = form.clubConnectionPlayerId
        ? players.find(p => String(p.playerId) === form.clubConnectionPlayerId) ?? undefined
        : undefined;

      const payload: PlayerV1 = {
        ...(editingPlayer ?? {}),
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        middleInitials: form.middleInitials.trim() || undefined,
        isRightHandBat: form.isRightHandBat,
        bowlingStyle: form.bowlingStyle || undefined,
        isActive: form.isActive,
        clubConnection: clubConn,
      };

      if (editingPlayer?.playerId != null) {
        await updatePlayer(payload);
      } else {
        await createPlayer(payload);
      }
      setModalOpen(false);
      await loadPlayers();
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
            <h1 className="text-2xl font-semibold text-villageText">Players</h1>
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-villageGreen text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">add</span>
              Add player
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
              {players.map((p) => {
                const displayName = `${p.surname}, ${p.firstName}${p.isActive === false ? ' [inactive]' : ''}`;
                return (
                  <li key={p.playerId} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-800">{displayName}</span>
                    <button
                      onClick={() => openEdit(p)}
                      className="text-gray-500 hover:text-villageGreen transition"
                      aria-label={`Edit ${displayName}`}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">edit</span>
                    </button>
                  </li>
                );
              })}
              {players.length === 0 && (
                <li className="px-4 py-6 text-sm text-gray-500 text-center">No players found.</li>
              )}
            </ul>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={editingPlayer ? 'Edit Player' : 'Add Player'}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">{editingPlayer ? 'Edit Player' : 'Add Player'}</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {errorMsg && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">{errorMsg}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="player-firstname">First Name</label>
                <input
                  id="player-firstname"
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="player-surname">Surname</label>
                <input
                  id="player-surname"
                  type="text"
                  value={form.surname}
                  onChange={e => setForm(f => ({ ...f, surname: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="player-initials">Middle Initials</label>
                <input
                  id="player-initials"
                  type="text"
                  value={form.middleInitials}
                  onChange={e => setForm(f => ({ ...f, middleInitials: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">Batting Style</span>
                <div className="flex gap-4">
                  {[{ value: true, label: 'Right Hand' }, { value: false, label: 'Left Hand' }].map(opt => (
                    <label key={String(opt.value)} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="batting-style"
                        checked={form.isRightHandBat === opt.value}
                        onChange={() => setForm(f => ({ ...f, isRightHandBat: opt.value }))}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="player-bowling-style">Bowling Style</label>
                <select
                  id="player-bowling-style"
                  value={form.bowlingStyle}
                  onChange={e => setForm(f => ({ ...f, bowlingStyle: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                >
                  <option value="">— Select —</option>
                  {BOWLING_STYLES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="player-club-connection">Club Connection</label>
                <select
                  id="player-club-connection"
                  value={form.clubConnectionPlayerId}
                  onChange={e => setForm(f => ({ ...f, clubConnectionPlayerId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                >
                  <option value="">— None —</option>
                  {players
                    .filter(p => p.playerId !== editingPlayer?.playerId)
                    .map(p => (
                      <option key={p.playerId} value={String(p.playerId)}>
                        {p.surname}, {p.firstName}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  />
                  <span className="font-medium text-gray-700">Active Player?</span>
                </label>
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

export default AdminPlayers;
