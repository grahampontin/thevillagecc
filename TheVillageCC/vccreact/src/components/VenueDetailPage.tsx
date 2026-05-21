import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Header from './Header';
import Footer from './Footer';
import { getVenueDetails } from '../api/venuesApi';
import { VenueDetailV1, ResultV1 } from '../api/swaggerTypes';
import { getResultBadge } from '../utils/matchResultUtils';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '';

// ── GoogleMapEmbed ─────────────────────────────────────────────────────────

const GoogleMapEmbed: React.FC<{ lat: number; lng: number; name: string }> = ({ lat, lng, name }) => {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  if (loadError) {
    // Fallback when the Maps JS API fails to load (e.g. key not configured, billing not enabled)
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    return (
      <div
        className="mt-3 mb-1 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 text-sm text-gray-500"
        style={{ height: 280 }}
      >
        <span>Map could not be loaded.</span>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-villageGreen hover:underline text-sm"
        >
          📍 Open in Google Maps
        </a>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="mt-3 mb-1 rounded-lg bg-gray-100 animate-pulse border border-gray-200"
        style={{ height: 280 }}
        aria-label="Loading map"
      />
    );
  }

  return (
    <div className="mt-3 mb-1 rounded-lg overflow-hidden border border-gray-200 shadow-sm" style={{ height: 280 }}>
      <GoogleMap
        center={{ lat, lng }}
        zoom={17}
        mapContainerStyle={{ height: '100%', width: '100%' }}
        options={{
          scrollwheel: false,
          mapTypeId: 'satellite',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker position={{ lat, lng }} title={name} />
      </GoogleMap>
    </div>
  );
};

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
  'Pitch rating measures how batting-friendly a venue is, based on the average runs scored per wicket (batting average) across all recorded matches there. ' +
  '"Road" venues see batsmen dominate and wickets fall rarely; "Minefield" venues produce cheap dismissals and low totals. ' +
  'Venues with fewer than 3 completed matches are shown as New — not enough data to rate.\n\n' +
  'Note: runs-per-wicket is a better measure than runs-per-innings because it captures both scoring rate and how hard it is to survive. ' +
  'A team dismissed for 150 all out is on a harder pitch than one that scored 150 for 3.';

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

// ── Skeleton ───────────────────────────────────────────────────────────────

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4" role="status" aria-label="Loading" aria-live="polite">
    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────

const VenueDetailPage: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const [venue, setVenue]       = useState<VenueDetailV1 | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [is404, setIs404]       = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    const id = parseInt(venueId ?? '', 10);
    if (isNaN(id)) {
      setError('Invalid venue ID.');
      setLoading(false);
      return;
    }
    getVenueDetails(id)
      .then(data => setVenue(data))
      .catch((err: unknown) => {
        // Treat HTTP 404 specially
        const status = (err as { status?: number })?.status;
        if (status === 404) {
          setIs404(true);
        } else {
          setError('Failed to load venue details. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [venueId]);

  function toggleRow(matchId: number) {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(matchId)) { next.delete(matchId); } else { next.add(matchId); }
      return next;
    });
  }

  const matches   = venue?.matches ?? [];
  const stats     = venue?.stats;
  const label     = normLabel(stats?.difficultyLabel);

  // Derive W/L/NR counts from the match list (same pattern as TeamDetail)
  const played    = matches.length;
  const won       = matches.filter(m => m.isWinner === true).length;
  const lost      = matches.filter(m => m.isWinner === false && !m.isTied && !m.isDrawn && !m.isAbandoned).length;
  const noResult  = matches.filter(m => m.isTied || m.isDrawn || m.isAbandoned).length;
  const winPct    = played === 0 ? '—' : `${((won / played) * 100).toFixed(0)}%`;

  const avgWicket = stats?.averageRunsPerWicket;
  const avgDisplay =
    played === 0
      ? '—'
      : avgWicket != null ? avgWicket.toFixed(1) : '—';
  const avgInnings = stats?.averageRunsPerInnings;
  const avgInningsDisplay =
    played === 0
      ? '—'
      : avgInnings != null ? avgInnings.toFixed(1) : '—';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <Link to="/venues" className="text-sm text-villageGreen hover:underline mb-6 inline-block">
          ← Back to all venues
        </Link>

        {loading && <SkeletonLoader />}

        {/* 404 */}
        {!loading && is404 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Venue not found.</p>
            <Link to="/venues" className="text-villageGreen hover:underline text-sm">← Back to all venues</Link>
          </div>
        )}

        {/* Generic error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        {!loading && venue && (
          <>
            {/* ── Venue header card ── */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{venue.name ?? 'Unknown Venue'}</h1>
                <PitchRatingBadge label={label} score={stats?.difficultyScore} />
                <InfoIcon title={PITCH_RATING_TOOLTIP} />
              </div>

              {venue.description && (
                <p className="text-gray-600 text-sm mb-2">{venue.description}</p>
              )}

              {venue.mapUrl && (
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-villageGreen hover:underline mb-3"
                >
                  📍 View on Google Maps
                </a>
              )}

              {venue.latitude != null && venue.longitude != null && (
                <GoogleMapEmbed
                  lat={venue.latitude}
                  lng={venue.longitude}
                  name={venue.name ?? 'Cricket ground'}
                />
              )}

              <div className="mt-1 text-sm text-gray-600">
                <span className="font-medium">Played:</span> {played}&ensp;
                <span className="font-medium text-emerald-700">Won:</span> {won}&ensp;
                <span className="font-medium text-red-600">Lost:</span> {lost}
                {noResult > 0 && <>&ensp;<span className="font-medium text-gray-500">No result:</span> {noResult}</>}
                &ensp;<span className="font-medium">Win rate:</span> {winPct}&ensp;
                <span className="font-medium">Avg runs/wicket:</span> {avgDisplay}
                {stats?.difficultyScore != null && (
                  <>&ensp;<span className="font-medium">Pitch rating:</span> {displayLabel(label)} (score: {stats.difficultyScore.toFixed(1)} / 100)</>
                )}
              </div>
            </div>

            {/* ── Stat cards – match record ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <StatCard label="Played"   value={played} />
              <StatCard label="Won"      value={won}    accent="text-emerald-600" />
              <StatCard label="Lost"     value={lost}   accent="text-red-600" />
              <StatCard label="Win Rate" value={winPct} accent="text-villageGreen" />
            </div>

            {/* ── Stat cards – venue metrics ── */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard label="Avg runs/wicket" value={avgDisplay} />
              <StatCard
                label="Pitch rating"
                value={<PitchRatingBadge label={label} score={stats?.difficultyScore} size="sm" />}
              />
            </div>

            {/* ── Supplementary: avg runs/innings ── */}
            {(stats?.matchesPlayed ?? 0) > 0 && avgInnings != null && (
              <p className="text-xs text-gray-400 -mt-5 mb-8 text-right">
                Avg runs/innings (supplementary): {avgInningsDisplay}
              </p>
            )}

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
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match: ResultV1, idx: number) => {
                      const rowKey    = match.matchId ?? idx;
                      const isWon     = match.isWinner === true;
                      const isLost    = match.isWinner === false && !match.isDrawn && !match.isAbandoned && !match.isTied;
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

                      const opponentName = (() => {
                        if (match.homeTeamName && match.awayTeamName) {
                          const vcc = 'village';
                          if ((match.homeTeamName ?? '').toLowerCase().includes(vcc)) return match.awayTeamName;
                          if ((match.awayTeamName ?? '').toLowerCase().includes(vcc)) return match.homeTeamName;
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
                        <React.Fragment key={rowKey}>
                          <tr className={`border-b border-gray-100 hover:brightness-95 transition ${rowBg}`}>
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{dateStr}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">{opponentName}</td>
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

export default VenueDetailPage;

