import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getVenueSummaries } from '../api/venuesApi';
import { VenueSummaryV1 } from '../api/swaggerTypes';

// ── Types ──────────────────────────────────────────────────────────────────

type PitchLabel = 'minefield' | 'difficult' | 'balanced' | 'batting-friendly' | 'road' | 'unknown';
type PitchFilter = 'all' | PitchLabel;
type SortField = 'name' | 'matchesPlayed' | 'averageRunsPerInnings' | 'pitchRating';
type SortDir = 'asc' | 'desc';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Normalise the API's difficultyLabel string to our known union or 'unknown'. */
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
  minefield:        { bg: '#d9534f', text: '#fff' },
  difficult:        { bg: '#e07020', text: '#fff' },
  balanced:         { bg: '#f0ad4e', text: '#333' },
  'batting-friendly': { bg: '#5bc0de', text: '#fff' },
  road:             { bg: '#5cb85c', text: '#fff' },
  unknown:          { bg: '#aaaaaa', text: '#fff' },
};

const PitchRatingBadge: React.FC<{
  label: PitchLabel;
  score?: number | null;
  size?: 'sm' | 'md';
}> = ({ label, score, size = 'sm' }) => {
  const style = BADGE_STYLE[label];
  const px = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  const tooltip = score != null ? `Score: ${score.toFixed(1)} / 100` : undefined;

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

// ── Pitch rating legend tooltip ────────────────────────────────────────────

const PITCH_RATING_TOOLTIP =
  'Pitch rating measures how batting-friendly a venue is, based on the average runs scored per innings there across all recorded matches. ' +
  '"Road" venues see high scores from both teams; "Minefield" venues regularly produce low totals. ' +
  'Venues with fewer than 3 completed matches are marked New — not enough data to rate.';

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

const SkeletonRow: React.FC = () => (
  <tr className="border-b border-gray-100">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </td>
    ))}
  </tr>
);

// ── SortHeader ─────────────────────────────────────────────────────────────

const SortHeader: React.FC<{
  label: React.ReactNode;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onSort: (f: SortField) => void;
  className?: string;
}> = ({ label, field, current, dir, onSort, className = '' }) => {
  const active = current === field;
  return (
    <th
      className={`px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none whitespace-nowrap ${className}`}
      onClick={() => onSort(field)}
      aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="text-gray-400 text-[10px]">
          {active ? (dir === 'asc' ? '▲' : '▼') : '⇅'}
        </span>
      </span>
    </th>
  );
};

// ── Filter config ──────────────────────────────────────────────────────────

const PITCH_FILTERS: { value: PitchFilter; label: string }[] = [
  { value: 'all',              label: 'All'             },
  { value: 'road',             label: 'Road'            },
  { value: 'batting-friendly', label: 'Batting-friendly'},
  { value: 'balanced',         label: 'Balanced'        },
  { value: 'difficult',        label: 'Difficult'       },
  { value: 'minefield',        label: 'Minefield'       },
  { value: 'unknown',          label: 'New'             },
];

// ── Main component ─────────────────────────────────────────────────────────

const VenuesListPage: React.FC = () => {
  const [allVenues, setAllVenues] = useState<VenueSummaryV1[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const [search,       setSearch]      = useState('');
  const [pitchFilter,  setPitchFilter] = useState<PitchFilter>('all');
  const [sortField,    setSortField]   = useState<SortField>('name');
  const [sortDir,      setSortDir]     = useState<SortDir>('asc');

  useEffect(() => {
    getVenueSummaries()
      .then(data => setAllVenues(data))
      .catch(() => setError('Failed to load venues. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const visibleVenues = useMemo(() => {
    let filtered = allVenues;

    // Text search on name and description
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        v =>
          (v.name ?? '').toLowerCase().includes(q) ||
          (v.description ?? '').toLowerCase().includes(q),
      );
    }

    // Pitch rating filter
    if (pitchFilter !== 'all') {
      filtered = filtered.filter(v => {
        const lbl = normLabel(v.stats?.difficultyLabel);
        if (pitchFilter === 'unknown') return lbl === 'unknown';
        return lbl === pitchFilter;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = (a.name ?? '').localeCompare(b.name ?? '');
          break;
        case 'matchesPlayed':
          cmp = (a.stats?.matchesPlayed ?? 0) - (b.stats?.matchesPlayed ?? 0);
          break;
        case 'averageRunsPerInnings':
          cmp = (a.stats?.averageRunsPerInnings ?? 0) - (b.stats?.averageRunsPerInnings ?? 0);
          break;
        case 'pitchRating': {
          // Sort by difficultyScore; nulls always last
          const sa = a.stats?.difficultyScore ?? null;
          const sb = b.stats?.difficultyScore ?? null;
          if (sa == null && sb == null) { cmp = 0; break; }
          if (sa == null) return sortDir === 'asc' ? 1 : -1;
          if (sb == null) return sortDir === 'asc' ? -1 : 1;
          cmp = sa - sb;
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [allVenues, search, pitchFilter, sortField, sortDir]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Default pitch rating sort is descending (road first)
      setSortDir(field === 'pitchRating' ? 'desc' : 'asc');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Venues</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-2xl">
            Every ground The Village CC has played at.
            Pitch rating is based on the average runs scored per innings.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="search"
            placeholder="Search by name or description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-villageGreen"
            aria-label="Search venues"
          />
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by pitch rating">
            {PITCH_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPitchFilter(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  pitchFilter === value
                    ? 'bg-villageGreen text-white border-villageGreen'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-villageGreen hover:text-villageGreen'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <SortHeader label="Venue"          field="name"                  current={sortField} dir={sortDir} onSort={handleSort} className="text-left" />
                <SortHeader label="Matches played" field="matchesPlayed"         current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                <SortHeader label="Avg runs/inns"  field="averageRunsPerInnings" current={sortField} dir={sortDir} onSort={handleSort} className="text-right hidden sm:table-cell" />
                <SortHeader
                  label={<>Pitch rating<InfoIcon title={PITCH_RATING_TOOLTIP} /></>}
                  field="pitchRating"
                  current={sortField}
                  dir={sortDir}
                  onSort={handleSort}
                  className="text-center"
                />
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Map</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

              {!loading && !error && visibleVenues.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No venues match your filter.
                  </td>
                </tr>
              )}

              {!loading &&
                visibleVenues.map(venue => {
                  const label = normLabel(venue.stats?.difficultyLabel);
                  const avgRuns = venue.stats?.averageRunsPerInnings;
                  const avgDisplay =
                    (venue.stats?.matchesPlayed ?? 0) === 0
                      ? '—'
                      : avgRuns != null
                      ? avgRuns.toFixed(1)
                      : '—';

                  return (
                    <tr key={venue.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <Link
                          to={`/venues/${venue.id}`}
                          className="font-medium text-villageGreen hover:underline"
                        >
                          {venue.name ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {venue.stats?.matchesPlayed ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 hidden sm:table-cell">
                        {avgDisplay}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <PitchRatingBadge label={label} score={venue.stats?.difficultyScore} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {venue.mapUrl ? (
                          <a
                            href={venue.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-villageGreen"
                            aria-label={`View ${venue.name ?? 'venue'} on map`}
                            title="View on map"
                          >
                            📍
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!loading && (
          <p className="mt-3 text-xs text-gray-400">
            {visibleVenues.length} venue{visibleVenues.length !== 1 ? 's' : ''}
            {search || pitchFilter !== 'all'
              ? ` matching your filter (${allVenues.length} total)`
              : ' total'}.
            Click a venue name to see full match history.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VenuesListPage;

