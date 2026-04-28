import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getTeamDetails } from '../api/teamsApi';
import { TeamDetailV1, ResultV1 } from '../api/swaggerTypes';
import { getResultBadge } from '../utils/matchResultUtils';

// ── Types ──────────────────────────────────────────────────────────────────

type DifficultyRating = 'red' | 'amber' | 'green' | 'unknown' | null;

// ── Helpers ────────────────────────────────────────────────────────────────

function difficultyLabel(rating: DifficultyRating): string {
  switch (rating) {
    case 'red':   return 'Tough';
    case 'amber': return 'Competitive';
    case 'green': return 'Favourable';
    default:      return 'New';
  }
}

function formatWinPct(winPercentage: number | undefined, played: number): string {
  if (played === 0) return '—';
  if (winPercentage == null) return '—';
  return `${(winPercentage * 100).toFixed(0)}%`;
}

// ── DifficultyBadge ────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  red:     { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500'     },
  amber:   { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  green:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  unknown: { bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400'    },
};

const DIFFICULTY_TOOLTIP =
  'Difficulty is calculated from the margin of every result against this team, not just win/loss counts. ' +
  'A 10-wicket defeat counts as much harder than a 1-wicket defeat, and a crushing run victory counts as much easier than a narrow one. ' +
  'Ratings are relative: the hardest third of teams (by weighted margin) are Tough, the middle third Competitive, and the most favourable third Favourable. ' +
  'Teams with fewer than 3 completed matches are shown as New.';

const DifficultyBadge: React.FC<{ rating: DifficultyRating; score?: number | null }> = ({ rating, score }) => {
  const key = rating?.toLowerCase() ?? 'unknown';
  const style = BADGE_STYLES[key] ?? BADGE_STYLES.unknown;
  const label = difficultyLabel(rating);
  const scoreTitle = score != null
    ? `${DIFFICULTY_TOOLTIP}\n\nDifficulty score: ${score.toFixed(3)}`
    : DIFFICULTY_TOOLTIP;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${style.bg} ${style.text}`}
      aria-label={`Difficulty: ${label}`}
      title={scoreTitle}
    >
      <span className={`w-2.5 h-2.5 rounded-full inline-block ${style.dot}`}></span>
      {label}
    </span>
  );
};

// ── StatCard ───────────────────────────────────────────────────────────────

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

// ── Skeleton ───────────────────────────────────────────────────────────────

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4" role="status" aria-label="Loading" aria-live="polite">
    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────

// ── MatchReportRow ─────────────────────────────────────────────────────────

const MatchReportRow: React.FC<{ colSpan: number; reportText: string }> = ({ colSpan, reportText }) => (
  <tr className="bg-gray-50 border-b border-gray-100">
    <td colSpan={colSpan} className="px-6 py-4">
      <div
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: reportText }}
      />
    </td>
  </tr>
);

// ── Main component ─────────────────────────────────────────────────────────

const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam]       = useState<TeamDetailV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [is404, setIs404]     = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  function toggleRow(matchId: number) {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(matchId)) { next.delete(matchId); } else { next.add(matchId); }
      return next;
    });
  }

  useEffect(() => {
    const id = parseInt(teamId ?? '', 10);
    if (isNaN(id)) {
      setError('Invalid team ID.');
      setLoading(false);
      return;
    }
    getTeamDetails(id)
      .then(data => setTeam(data))
      .catch((err: unknown) => {
        const status = (err as { status?: number })?.status;
        if (status === 404) {
          setIs404(true);
        } else {
          setError('Failed to load team details. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [teamId]);

  // Stats derived from match list (API pre-sorts newest-first, so no client sort needed)
  const matches   = team?.matches ?? [];
  const played    = matches.length;
  const won       = matches.filter(m => m.isWinner === true).length;
  const lost      = matches.filter(m => m.isWinner === false && !m.isTied && !m.isDrawn && !m.isAbandoned).length;
  const noResult  = matches.filter(m => m.isTied || m.isDrawn || m.isAbandoned).length;
  const winPct    = formatWinPct(team?.winPercentage, played);

  const difficultyRating = (team?.difficultyRating as DifficultyRating) ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <Link to="/teams" className="text-sm text-villageGreen hover:underline mb-6 inline-block">
          ← Back to all teams
        </Link>

        {loading && <SkeletonLoader />}

        {/* 404 */}
        {!loading && is404 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Team not found.</p>
            <Link to="/teams" className="text-villageGreen hover:underline text-sm">← Back to all teams</Link>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        {!loading && team && (
          <>
            {/* ── Team header card ── */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                {/* Logo */}
                {team.logoUrl && (
                  <img
                    src={team.logoUrl}
                    alt={`${team.name ?? 'Team'} logo`}
                    className="w-16 h-16 object-contain rounded-lg border border-gray-100 flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                    <DifficultyBadge rating={difficultyRating} score={team.difficultyScore} />
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {team.homeVenueName && (
                      <span>
                        📍{' '}
                        {team.homeVenueId ? (
                          <Link to={`/venues/${team.homeVenueId}`} className="text-villageGreen hover:underline">
                            {team.homeVenueName}
                          </Link>
                        ) : (
                          team.homeVenueName
                        )}
                      </span>
                    )}
                    {team.websiteUrl && (
                      <a
                        href={team.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-villageGreen hover:underline truncate max-w-xs"
                      >
                        🔗 {team.websiteUrl}
                      </a>
                    )}
                  </div>

                  {/* Headline stats inline */}
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Played:</span> {played}&ensp;
                    <span className="font-medium text-emerald-700">Won:</span> {won}&ensp;
                    <span className="font-medium text-red-600">Lost:</span> {lost}
                    {noResult > 0 && <>&ensp;<span className="font-medium text-gray-500">No result:</span> {noResult}</>}
                    &ensp;<span className="font-medium">Win rate:</span> {winPct}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="Played"  value={played} />
              <StatCard label="Won"     value={won}    accent="text-emerald-600" />
              <StatCard label="Lost"    value={lost}   accent="text-red-600" />
              <StatCard label="Win Rate" value={winPct} accent="text-villageGreen" />
            </div>

            {/* ── Match history ── */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Match history against this team (most recent first)</h2>

            {matches.length === 0 ? (
              <p className="text-gray-400 text-sm">No matches recorded against this team.</p>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Venue</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Result</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Scores</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Scorecard</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match: ResultV1, idx: number) => {
                      const rowKey    = match.matchId ?? idx;
                      const isWon     = match.isWinner === true;
                      const isLost    = match.isWinner === false && !match.isTied && !match.isDrawn && !match.isAbandoned;
                      const hasReport = !!match.matchReportText;
                      const expanded  = typeof rowKey === 'number' && expandedRows.has(rowKey);

                      const badge = getResultBadge({
                        isWinner:    match.isWinner ?? null,
                        isTied:      match.isTied ?? false,
                        isDrawn:     match.isDrawn ?? false,
                        isAbandoned: match.isAbandoned ?? false,
                      });

                      const dateStr = match.matchDate
                        ? new Date(match.matchDate).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—';

                      const scoreDisplay =
                        match.homeTeamScore && match.awayTeamScore
                          ? `${match.homeTeamScore} v ${match.awayTeamScore}`
                          : '—';

                      const rowBg = isWon ? 'bg-emerald-50/40' : isLost ? 'bg-red-50/40' : '';

                      return (
                        <React.Fragment key={rowKey}>
                          <tr className={`border-b border-gray-100 hover:brightness-95 transition ${rowBg}`}>
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{dateStr}</td>
                            <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{match.venueName ?? '—'}</td>
                            <td className="px-4 py-3 text-gray-700">
                              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${badge.color}`}>
                                {badge.text}
                              </span>
                              {match.margin && !match.isTied && !match.isDrawn && !match.isAbandoned && (
                                <span className="text-gray-600 hidden sm:inline">{match.margin}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-500 hidden md:table-cell whitespace-nowrap">{scoreDisplay}</td>
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
                            <td className="px-4 py-3 text-center">
                              {hasReport && match.matchId ? (
                                <button
                                  onClick={() => toggleRow(match.matchId!)}
                                  className={`text-xs font-medium px-2 py-0.5 rounded transition ${
                                    expanded
                                      ? 'bg-villageGreen text-white'
                                      : 'text-villageGreen hover:underline'
                                  }`}
                                  aria-label={expanded ? 'Hide match report' : 'Read match report'}
                                  aria-expanded={expanded}
                                >
                                  📝 Report
                                </button>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>
                          </tr>
                          {expanded && match.matchReportText && (
                            <MatchReportRow colSpan={6} reportText={match.matchReportText} />
                          )}
                        </React.Fragment>
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

