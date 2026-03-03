import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMatchesBySeason } from '../api/fixturesApi';
import { MatchV1 } from '../api/swaggerTypes';

const AdminScorecards: React.FC = () => {
  const [matches, setMatches] = useState<MatchV1[]>([]);
  const [season, setSeason] = useState(new Date().getFullYear());
  const [listFilter, setListFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const filteredMatches = useMemo(() => {
    if (!listFilter.trim()) return matches;
    const q = listFilter.toLowerCase();
    return matches.filter(m =>
      (m.opposition?.name ?? '').toLowerCase().includes(q) ||
      (m.date ?? '').includes(q)
    );
  }, [matches, listFilter]);

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

  useEffect(() => { loadMatches(season); }, [loadMatches, season]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-villageText">
      {/* Fixed top navbar */}
      <div className="flex-none bg-villageGreen text-white flex items-center h-14 px-2 shadow-md z-20">
        <Link to="/admin" className="flex items-center justify-center w-10 h-10" aria-label="Back to Admin">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-base font-semibold tracking-wide">Add / Edit Scorecards</h1>
        <div className="w-10" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="px-3 pt-3">
          <input
            type="text"
            value={listFilter}
            onChange={e => setListFilter(e.target.value)}
            placeholder="Filter matches…"
            aria-label="Filter matches"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-villageGreen"
          />
        </div>

        {isLoading ? (
          <div className="px-3 pt-3 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 bg-white border-t border-b border-gray-200">
            {filteredMatches.map((m) => (
              <li key={m.id}>
                <Link
                  to={`/admin/scorecards/${m.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition"
                  aria-label={`Edit scorecard vs ${m.opposition?.name}`}
                >
                  <span className="text-sm text-gray-800">
                    {m.opposition?.name ?? '—'} ({m.date ? m.date.slice(0, 10) : '—'})
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-gray-400 leading-none">chevron_right</span>
                </Link>
              </li>
            ))}
            {filteredMatches.length === 0 && (
              <li className="px-4 py-6 text-sm text-gray-500 text-center">No matches for {season}.</li>
            )}
          </ul>
        )}
      </div>

      {/* Fixed bottom toolbar — season navigation */}
      <div className="flex-none fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-14 flex items-center justify-between px-4 shadow-sm z-20">
        <button
          onClick={() => setSeason(s => s - 1)}
          className="flex items-center gap-1 text-villageGreen font-medium"
          aria-label="Previous season"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">chevron_left</span>
          <span className="text-sm">Prev</span>
        </button>
        <span className="text-sm font-medium text-gray-700">Season {season}</span>
        <button
          onClick={() => setSeason(s => s + 1)}
          className="flex items-center gap-1 text-villageGreen font-medium"
          aria-label="Next season"
        >
          <span className="text-sm">Next</span>
          <span className="material-symbols-outlined text-[20px] leading-none">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default AdminScorecards;
