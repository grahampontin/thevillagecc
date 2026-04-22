import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getTeamSummaries } from '../api/teamsApi';
import { TeamSummaryV1 } from '../api/swaggerTypes';

// Traffic light badge for difficulty rating
const DifficultyBadge: React.FC<{ rating?: string | null }> = ({ rating }) => {
  if (!rating) return <span className="text-gray-400 text-xs">—</span>;

  const lower = rating.toLowerCase();
  if (lower === 'red') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
        Tough
      </span>
    );
  }
  if (lower === 'amber') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
        Competitive
      </span>
    );
  }
  if (lower === 'green') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
        Favourable
      </span>
    );
  }
  return <span className="text-gray-500 text-xs">{rating}</span>;
};

const SkeletonRow: React.FC = () => (
  <tr className="border-b border-gray-100">
    {[1, 2, 3, 4, 5, 6, 7].map(i => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </td>
    ))}
  </tr>
);

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<TeamSummaryV1[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTeamSummaries()
      .then(data => {
        const order: Record<string, number> = { green: 0, amber: 1, red: 2 };
        const sorted = [...data].sort((a, b) => {
          const ra: number = order[a.difficultyRating?.toLowerCase() ?? ''] ?? 3;
          const rb: number = order[b.difficultyRating?.toLowerCase() ?? ''] ?? 3;
          if (ra !== rb) return ra - rb;
          return (a.name ?? '').localeCompare(b.name ?? '');
        });
        setTeams(sorted);
      })
      .catch(() => setError('Failed to load teams. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Opposition Teams</h1>
          <p className="mt-2 text-gray-500 text-sm">
            All clubs The Village CC have played against. The difficulty rating reflects our win record against each side.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>Green – Favourable (we win more often)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>Amber – Competitive (roughly even)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>Red – Tough (they win more often)
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Team</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Home Ground</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Played</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Won</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Lost</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Win&nbsp;%</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
              {!loading && !error && teams.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No teams found.</td>
                </tr>
              )}
              {!loading &&
                teams.map(team => {
                  const winPct =
                    team.winPercentage != null
                      ? `${Math.round(team.winPercentage * 100)}%`
                      : '—';

                  return (
                    <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <Link to={`/teams/${team.id}`} className="font-medium text-villageGreen hover:underline">
                          {team.name ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{team.homeVenueName ?? '—'}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{team.played ?? 0}</td>
                      <td className="px-4 py-3 text-right text-emerald-700 font-medium">{team.won ?? 0}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">{team.lost ?? 0}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{winPct}</td>
                      <td className="px-4 py-3 text-center">
                        <DifficultyBadge rating={team.difficultyRating} />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-400">Click a team name to view full stats and match history.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Teams;

