import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getAwardsBySeason, createAward, updateAward, deleteAward } from '../api/awardsApi';
import { getAllPlayers } from '../api/playersApi';
import { AwardV1, PlayerV1 } from '../api/swaggerTypes';
import SearchableSelect from './SearchableSelect';

const AWARD_TYPES: { value: string; label: string }[] = [
  { value: 'PlayerOfTheYear', label: 'Player Of The Year' },
  { value: 'BowlerOfTheYear', label: 'Bowler Of The Year' },
  { value: 'BatsmanOfTheYear', label: 'Batsman Of The Year' },
  { value: 'FielderOfTheYear', label: 'Fielder Of The Year' },
  { value: 'CorridorOfUncertainty', label: 'Corridor Of Uncertainty' },
  { value: 'ClubmanOfTheYear', label: 'Clubman Of The Year' },
  { value: 'MostImprovedPlayer', label: 'Most Improved Player' },
  { value: 'CaptainsPlayerOfTheYear', label: "Captain's Player Of The Year" },
];

interface AwardFormState {
  awardType: string;
  playerId: string;
  year: string;
  data: string;
}

const emptyForm = (season: number): AwardFormState => ({
  awardType: '',
  playerId: '',
  year: String(season),
  data: '',
});

const toFormState = (a: AwardV1): AwardFormState => ({
  awardType: a.award ?? '',
  playerId: a.playerId != null ? String(a.playerId) : '',
  year: a.year != null ? String(a.year) : '',
  data: a.data ?? '',
});

const AdminAwards: React.FC = () => {
  const [awards, setAwards] = useState<AwardV1[]>([]);
  const [players, setPlayers] = useState<PlayerV1[]>([]);
  const [season, setSeason] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardV1 | null>(null);
  const [form, setForm] = useState<AwardFormState>(emptyForm(new Date().getFullYear()));
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

  const loadAwards = useCallback(async (s: number) => {
    try {
      setIsLoading(true);
      const data = await getAwardsBySeason(s);
      data.sort((a, b) => (a.award ?? '').localeCompare(b.award ?? ''));
      setAwards(data);
    } catch (err) {
      console.error('Failed to load awards', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadPlayers(); }, [loadPlayers]);
  useEffect(() => { loadAwards(season); }, [loadAwards, season]);

  const openAdd = () => {
    setEditingAward(null);
    setForm(emptyForm(season));
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEdit = (a: AwardV1) => {
    setEditingAward(a);
    setForm(toFormState(a));
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleDelete = async (a: AwardV1) => {
    if (!window.confirm('Delete this award?')) return;
    try {
      await deleteAward(a.id!);
      await loadAwards(season);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const handleSave = async () => {
    if (!form.awardType || !form.playerId || !form.year) {
      setErrorMsg('Award type, recipient, and year are required.');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const payload: AwardV1 = {
        ...(editingAward ?? {}),
        award: form.awardType,
        playerId: parseInt(form.playerId, 10),
        year: parseInt(form.year, 10),
        data: form.data.trim() || undefined,
      };
      if (editingAward?.id != null) {
        await updateAward(payload);
      } else {
        await createAward(payload);
      }
      setModalOpen(false);
      await loadAwards(season);
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
            <h1 className="text-2xl font-semibold text-villageText">Awards</h1>
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-villageGreen text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">add</span>
              Add award
            </button>
          </div>

          {/* Season navigation */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setSeason(s => s - 1)}
              className="text-sm font-medium text-villageGreen hover:underline"
            >
              ← Previous season
            </button>
            <span className="text-sm text-gray-500">{season} season</span>
            {season < currentYear ? (
              <button
                onClick={() => setSeason(s => s + 1)}
                className="text-sm font-medium text-villageGreen hover:underline"
              >
                Next season →
              </button>
            ) : (
              <span className="text-sm text-gray-300">Next season →</span>
            )}
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg shadow-sm">
              {awards.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-800">
                    {a.year} – {a.award} {a.playerName ? `(${a.playerName})` : ''}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(a)}
                      className="text-gray-500 hover:text-villageGreen transition"
                      aria-label={`Edit award ${a.award}`}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(a)}
                      className="text-gray-400 hover:text-red-600 transition"
                      aria-label={`Delete award ${a.award}`}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">delete</span>
                    </button>
                  </div>
                </li>
              ))}
              {awards.length === 0 && (
                <li className="px-4 py-6 text-sm text-gray-500 text-center">No awards for {season}.</li>
              )}
            </ul>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={editingAward ? 'Edit Award' : 'Add Award'}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">{editingAward ? 'Edit Award' : 'Add Award'}</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {errorMsg && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">{errorMsg}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="award-type">Award Type</label>
                <select
                  id="award-type"
                  value={form.awardType}
                  onChange={e => setForm(f => ({ ...f, awardType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                >
                  <option value="">— Please select —</option>
                  {AWARD_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="award-recipient">Recipient</label>
                <SearchableSelect
                  id="award-recipient"
                  value={form.playerId}
                  onChange={v => setForm(f => ({ ...f, playerId: v }))}
                  options={players.map(p => ({ value: String(p.playerId), label: `${p.surname}, ${p.firstName}` }))}
                  placeholder="— Please select —"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="award-year">Season (Year)</label>
                <input
                  id="award-year"
                  type="number"
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="award-data">Additional Data (e.g. video URL)</label>
                <input
                  id="award-data"
                  type="text"
                  value={form.data}
                  onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                  placeholder="Optional extra data"
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

export default AdminAwards;
