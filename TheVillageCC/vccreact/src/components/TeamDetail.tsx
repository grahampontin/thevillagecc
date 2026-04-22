import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getTeamDetails } from '../api/teamsApi';
import { TeamDetailV1, ResultV1 } from '../api/swaggerTypes';
import { getResultBadge } from '../utils/matchResultUtils';

// Traffic light badge for difficulty rating
const DifficultyBadge: React.FC<{ rating?: string | null }> = ({ rating }) => {
  if (!rating) return <span className="text-gray-400 text-sm">Not rated</span>;
  const lower = rating.toLowerCase();
  if (lower === 'red')
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>Tough
      </span>
    );
  if (lower === 'amber')
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>Competitive
      </span>
    );
  if (lower === 'green')
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>Favourable
      </span>
    );
  return <span className="text-gray-500 text-sm">{rating}</span>;
};

// Stat card component
const StatCard: React.FC<{ label: string; value: string | number; accent?: string }> = ({
  label,
  value,
  accent = 'text-gray-900',
}) => (
  <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm text-center">
    <div className={`text-2xl font-bold ${accent}`}>{value}</div>
    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</div>
  </div>
);

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4" role="status" aria-label="Loading" aria-live="polite">
    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
  </div>
);

const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<TeamDetailV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = parseInt(teamId ?? '', 10);
    if (isNaN(id)) {
      setError('Invalid team ID.');
      setLoading(false);
      return;
    }
    getTeamDetails(id)
      .then(data => setTeam(data))
      .catch(() => setError('Failed to load team details. Please try again later.'))
      .finally(() => setLoading(false));
  }, [teamId]);

  const matches = team?.matches ?? [];
  const played = matches.length;
  const won = matches.filter(m => m.isWinner === true).length;
  const lost = matches.filter(m => m.isWinner === false && !m.isTied && !m.isDrawn && !m.isAbandoned).length;
  const noResult = matches.filter(m => m.isTied || m.isDrawn || m.isAbandoned).length;
  const winPct =
    team?.winPercentage != null
      ? `${Math.round(team.winPercentage * 100)}%`
      : played > 0
      ? `${Math.round((won / played) * 100)}%`
      : '—';

  // Sort matches newest first
  const sortedMatches = [...matches].sort((a, b) => {
    if (!a.matchDate && !b.matchDate) return 0;
    if (!a.matchDate) return 1;
    if (!b.matchDate) return -1;
    return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link to="/teams" className="text-sm text-villageGreen hover:underline mb-6 inline-block">
          ← Back to all teams
        </Link>

        {loading && <SkeletonLoader />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        {!loading && team && (
          <>
            {/* Team header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                {team.homeVenueName && (
                  <p className="text-gray-500 text-sm mt-1">
                    <span className="font-medium">Home ground:</span> {team.homeVenueName}
                  </p>
                )}
                {team.websiteUrl && (
                  <a
                    href={team.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-villageGreen text-sm hover:underline mt-0.5 inline-block"
                  >
                    {team.websiteUrl}
                  </a>
                )}
              </div>
              <DifficultyBadge rating={team.difficultyRating} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <StatCard label="Played" value={played} />
              <StatCard label="Won" value={won} accent="text-emerald-600" />
              <StatCard label="Lost" value={lost} accent="text-red-600" />
              <StatCard label="Win %" value={winPct} accent="text-villageGreen" />
            </div>
            {noResult > 0 && (
              <p className="text-xs text-gray-400 -mt-6 mb-8">
                {noResult} match{noResult > 1 ? 'es' : ''} with no result (tied / drawn / abandoned) not included in win/loss counts.
              </p>
            )}

            {/* Match history */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Match History</h2>

            {sortedMatches.length === 0 ? (
              <p className="text-gray-400 text-sm">No matches recorded against this team.</p>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Venue</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Score</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Result</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Margin</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Scorecard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMatches.map((match: ResultV1, idx: number) => {
                      const badge = getResultBadge({
                        isWinner: match.isWinner ?? null,
                        isTied: match.isTied ?? false,
                        isDrawn: match.isDrawn ?? false,
                        isAbandoned: match.isAbandoned ?? false,
                      });
                      const dateStr = match.matchDate
                        ? new Date(match.matchDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—';
                      const scoreDisplay =
                        match.homeTeamName && match.awayTeamName
                          ? `${match.homeTeamName} ${match.homeTeamScore ?? ''} v ${match.awayTeamScore ?? ''} ${match.awayTeamName}`
                          : match.resultText ?? '—';

                      return (
                        <tr key={match.matchId ?? idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{dateStr}</td>
                          <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{match.venueName ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-700">{scoreDisplay}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                              {badge.text}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{match.margin ?? match.resultMargin ?? '—'}</td>
                          <td className="px-4 py-3 text-center">
                            {match.matchId ? (
                              <Link
                                to={`/scorecard/${match.matchId}`}
                                className="text-villageGreen hover:underline text-xs font-medium"
                              >
                                View
                              </Link>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TeamDetail;

