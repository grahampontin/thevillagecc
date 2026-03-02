import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getMatchesBySeason, createMatch, updateMatch } from '../api/fixturesApi';
import { getAllTeams } from '../api/teamsApi';
import { getAllVenues } from '../api/venuesApi';
import { MatchV1, TeamV1, VenueV1 } from '../api/swaggerTypes';
import SearchableSelect from './SearchableSelect';

const MATCH_TYPES = ['Friendly', 'Tour', 'Twenty20'];

interface MatchFormState {
  oppositionId: string;
  venueId: string;
  date: string;
  type: string;
}

const emptyForm = (): MatchFormState => ({
  oppositionId: '',
  venueId: '',
  date: new Date().toISOString().slice(0, 10),
  type: 'Friendly',
});

const toFormState = (m: MatchV1): MatchFormState => ({
  oppositionId: m.opposition?.id != null ? String(m.opposition.id) : '',
  venueId: m.venue?.id != null ? String(m.venue.id) : '',
  date: m.date ? m.date.slice(0, 10) : '',
  type: m.type ?? 'Friendly',
});

const AdminMatches: React.FC = () => {
  const [matches, setMatches] = useState<MatchV1[]>([]);
  const [teams, setTeams] = useState<TeamV1[]>([]);
  const [venues, setVenues] = useState<VenueV1[]>([]);
  const [season, setSeason] = useState(new Date().getFullYear());
  const [listFilter, setListFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchV1 | null>(null);
  const [form, setForm] = useState<MatchFormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredMatches = useMemo(() => {
    if (!listFilter.trim()) return matches;
    const q = listFilter.toLowerCase();
    return matches.filter(m =>
      (m.opposition?.name ?? '').toLowerCase().includes(q) ||
      (m.date ?? '').includes(q)
    );
  }, [matches, listFilter]);

  const loadRefData = useCallback(async () => {
    try {
      const [teamsData, venuesData] = await Promise.all([getAllTeams(), getAllVenues()]);
      teamsData.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
      venuesData.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
      setTeams(teamsData);
      setVenues(venuesData);
    } catch (err) {
      console.error('Failed to load ref data', err);
    }
  }, []);

  const loadMatches = useCallback(async (s: number) => {
    try {
      setIsLoading(true);
      const data = await getMatchesBySeason(s);
      data.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
      setMatches(data);
    } catch (err) {
      console.error('Failed to load matches', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadRefData(); }, [loadRefData]);
  useEffect(() => { loadMatches(season); }, [loadMatches, season]);

  const openAdd = () => {
    setEditingMatch(null);
    setForm(emptyForm());
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEdit = (m: MatchV1) => {
    setEditingMatch(m);
    setForm(toFormState(m));
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.oppositionId || !form.venueId || !form.date) {
      setErrorMsg('Opposition, venue, and date are required.');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const opposition = teams.find(t => String(t.id) === form.oppositionId);
      const venue = venues.find(v => String(v.id) === form.venueId);
      const payload: MatchV1 = {
        ...(editingMatch ?? {}),
        opposition,
        venue,
        date: form.date,
        type: form.type,
      };
      if (editingMatch?.id != null) {
        await updateMatch(payload);
      } else {
        await createMatch(payload);
      }
      setModalOpen(false);
      await loadMatches(season);
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
            <h1 className="text-2xl font-semibold text-villageText">Matches</h1>
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-villageGreen text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">add</span>
              Add match
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
            <button
              onClick={() => setSeason(s => s + 1)}
              className="text-sm font-medium text-villageGreen hover:underline"
            >
              Next season →
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
                  placeholder="Filter matches…"
                  aria-label="Filter matches"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <ul className="mt-3 divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg shadow-sm">
                {filteredMatches.map((m) => (
                  <li key={m.id} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-800">
                      {m.opposition?.name ?? '—'} ({m.date ? m.date.slice(0, 10) : '—'})
                    </span>
                    <button
                      onClick={() => openEdit(m)}
                      className="text-gray-500 hover:text-villageGreen transition"
                      aria-label={`Edit match vs ${m.opposition?.name}`}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">edit</span>
                    </button>
                  </li>
                ))}
                {filteredMatches.length === 0 && (
                  <li className="px-4 py-6 text-sm text-gray-500 text-center">No matches for {season}.</li>
                )}
              </ul>
            </>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={editingMatch ? 'Edit Match' : 'Add Match'}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">{editingMatch ? 'Edit Match' : 'Add Match'}</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {errorMsg && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">{errorMsg}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="match-opposition">The Village CC vs</label>
                <SearchableSelect
                  id="match-opposition"
                  value={form.oppositionId}
                  onChange={v => setForm(f => ({ ...f, oppositionId: v }))}
                  options={teams.map(t => ({ value: String(t.id), label: t.name ?? '' }))}
                  placeholder="— Please select —"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="match-venue">At</label>
                <SearchableSelect
                  id="match-venue"
                  value={form.venueId}
                  onChange={v => setForm(f => ({ ...f, venueId: v }))}
                  options={venues.map(v => ({ value: String(v.id), label: v.name ?? '' }))}
                  placeholder="— Please select —"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="match-date">Date</label>
                <input
                  id="match-date"
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="match-type">Match Type</label>
                <select
                  id="match-type"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
                >
                  {MATCH_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
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

export default AdminMatches;
