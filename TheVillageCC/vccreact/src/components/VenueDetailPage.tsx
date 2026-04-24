import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getVenueDetails } from '../api/venuesApi';
import { VenueDetailV1, ResultV1 } from '../api/swaggerTypes';
import { getResultBadge } from '../utils/matchResultUtils';

// ── Types ──────────────────────────────────────────────────────────────────

type PitchLabel = 'minefield' | 'difficult' | 'balanced' | 'batting-friendly' | 'road' | 'unknown';

// ── Helpers ────────────────────────────────────────────────────────────────

function normLabel(raw: string | null | undefined): PitchLabel {
  const map: Record<string, PitchLabel> = {
    minefield: 'minefield',
    difficult: 'difficult',
    balanced: 'balanced',
    'batting-friendly': 'batting-friendly',
    road: 'road',
  };
  return (raw && map[raw.toLowerCase()]) || 'unknown';
}

function displayLabel(label: PitchLabel): string {
  if (label === 'batting-friendly') return 'Batting-friendly';
  if (label === 'unknown') return 'New';
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// ── PitchRatingBadge ───────────────────────────────────────────────────────

const BADGE_STYLE: Record<PitchLabel, { bg: string; text: string }> = {
  minefield:           { bg: '#d9534f', text: '#fff' },
  difficult:           { bg: '#e07020', text: '#fff' },
  balanced:            { bg: '#f0ad4e', text: '#333' },
  'batting-friendly':  { bg: '#5bc0de', text: '#fff' },
  road:                { bg: '#5cb85c', text: '#fff' },
  unknown:             { bg: '#aaaaaa', text: '#fff' },
};

const PITCH_RATING_TOOLTIP =
  'Pitch rating measures how batting-friendly a venue is, based on the average runs scored per innings there across all recorded matches. ' +
  '"Road" venues see high scores from both teams; "Minefield" venues regularly produce low totals. ' +
  'Venues with fewer than 3 completed matches are marked New — not enough data to rate.';

const PitchRatingBadge: React.FC<{
  label: PitchLabel;
  score?: number | null;
  size?: 'sm' | 'md';
}> = ({ label, score, size = 'md' }) => {
  const style = BADGE_STYLE[label];
  const px = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  const tooltip = score != null
    ? `Score: ${score.toFixed(1)} / 100\n\n${PITCH_RATING_TOOLTIP}`
    : PITCH_RATING_TOOLTIP;

  return (
    <span
      style={{ backgroundColor: style.bg, color: style.text }}
      className={`inline-block font-semibold rounded-full ${px}`}
      aria-label={`Pitch rating: ${displayLabel(label)}`}
      title={tooltip}
    >
      {displayLabel(label)}
    </span>
  );
};

// ── InfoIcon ───────────────────────────────────────────────────────────────

const InfoIcon: React.FC<{ title: string }> = ({ title }) => (
  <span
    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-[10px] font-bold cursor-help"
    title={title}
    aria-label="More information"
  >
    i
  </span>
);

// ── Skeleton ───────────────────────────────────────────────────────────────

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4" role="status" aria-label="Loading" aria-live="polite">
    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
  </div>
);

// ── StatCard ───────────────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: React.ReactNode; accent?: string }> = ({
  label,
  value,
  accent = 'text-gray-900',
}) => (
  <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm text-center">
    <div className={`text-2xl font-bold ${accent}`}>{value}</div>
    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────

const VenueDetailPage: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const [venue, setVenue]     = useState<VenueDetailV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const id = parseInt(venueId ?? '', 10);
    if (isNaN(id)) {
      setError('Invalid venue ID.');
      setLoading(false);
      return;
    }
    getVenueDetails(id)
      .then(data => setVenue(data))
      .catch(() => setError('Failed to load venue details. Please try again later.'))
      .finally(() => setLoading(false));
  }, [venueId]);

  const matches  = venue?.matches ?? [];
  const stats    = venue?.stats;
  const label    = normLabel(stats?.difficultyLabel);
  const avgRuns  = stats?.averageRunsPerInnings;
  const avgDisplay =
    (stats?.matchesPlayed ?? 0) === 0
      ? '—'
      : avgRuns != null
      ? avgRuns.toFixed(1)
      : '—';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <Link to="/venues" className="text-sm text-villageGreen hover:underline mb-6 inline-block">
          ← Back to all venues
        </Link>

        {loading && <SkeletonLoader />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        {!loading && venue && (
          <>
            {/* ── Venue header card ── */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{venue.name ?? 'Unknown Venue'}</h1>
                    <PitchRatingBadge label={label} score={stats?.difficultyScore} />
                    <InfoIcon title={PITCH_RATING_TOOLTIP} />
                  </div>

                  {venue.description && (
                    <p className="mt-2 text-gray-600 text-sm">{venue.description}</p>
                  )}

                  {venue.mapUrl && (
                    <a
                      href={venue.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-villageGreen hover:underline"
                    >
                      📍 View on Google Maps
                    </a>
                  )}

                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Played:</span> {stats?.matchesPlayed ?? 0}&ensp;
                    <span className="font-medium">Avg runs/innings:</span> {avgDisplay}
                    {stats?.difficultyScore != null && (
                      <>&ensp;<span className="font-medium">Pitch score:</span> {stats.difficultyScore.toFixed(1)} / 100</>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <StatCard label="Matches played"   value={stats?.matchesPlayed ?? 0} />
              <StatCard label="Avg runs/innings" value={avgDisplay} />
              <StatCard
                label="Pitch rating"
                value={<PitchRatingBadge label={label} score={stats?.difficultyScore} size="sm" />}
              />
            </div>

            {/* ── Match history ── */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Match history at this venue (most recent first)
            </h2>

            {matches.length === 0 ? (
              <p className="text-gray-400 text-sm">No matches recorded at this venue.</p>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Opponents</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Result</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Scores</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Scorecard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match: ResultV1, idx: number) => {
                      const isWon  = match.isWinner === true;
                      const isLost = match.isWinner === false && !match.isTied && !match.isDrawn && !match.isAbandoned;
                      const badge  = getResultBadge({
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

                      // Determine opponent name (the side that is not The Village CC)
                      const opponentName = (() => {
                        // homeTeamName/awayTeamName — prefer "away" team as opponent when VCC is home
                        if (match.homeTeamName && match.awayTeamName) {
                          const vcc = 'village';
                          if ((match.homeTeamName ?? '').toLowerCase().includes(vcc)) {
                            return match.awayTeamName;
                          }
                          if ((match.awayTeamName ?? '').toLowerCase().includes(vcc)) {
                            return match.homeTeamName;
                          }
                          return match.awayTeamName;
                        }
                        return match.homeTeamName ?? match.awayTeamName ?? '—';
                      })();

                      const scoreDisplay =
                        match.homeTeamScore && match.awayTeamScore
                          ? `${match.homeTeamScore} v ${match.awayTeamScore}`
                          : '—';

                      const rowBg = isWon ? 'bg-emerald-50/40' : isLost ? 'bg-red-50/40' : '';

                      return (
                        <tr
                          key={match.matchId ?? idx}
                          className={`border-b border-gray-100 hover:brightness-95 transition ${rowBg}`}
                        >
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{dateStr}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{opponentName}</td>
                          <td className="px-4 py-3 text-gray-700">
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${badge.color}`}>
                              {badge.text}
                            </span>
                            {match.margin && !match.isTied && !match.isDrawn && !match.isAbandoned && (
                              <span className="text-gray-600 hidden sm:inline">{match.margin}</span>
                            )}
                            {match.isAbandoned && (
                              <span className="text-gray-500 text-xs">Abandoned</span>
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

export default VenueDetailPage;

