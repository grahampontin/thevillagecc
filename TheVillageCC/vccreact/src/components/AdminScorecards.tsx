import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
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
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-1">
            <Link to="/admin" className="text-sm text-villageGreen hover:underline">← Admin</Link>
          </div>
          <h1 className="text-2xl font-semibold text-villageText">Scorecards</h1>

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
                    <Link
                      to={`/admin/scorecards/${m.id}`}
                      className="text-gray-500 hover:text-villageGreen transition"
                      aria-label={`Edit scorecard vs ${m.opposition?.name}`}
                    >
                      <span className="material-symbols-outlined text-[20px] leading-none">edit</span>
                    </Link>
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
    </div>
  );
};

export default AdminScorecards;
