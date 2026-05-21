import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Header from './Header';
import Footer from './Footer';
import { getVenueSummaries } from '../api/venuesApi';
import { VenueSummaryV1 } from '../api/swaggerTypes';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '';

// ── Types ──────────────────────────────────────────────────────────────────

type PitchLabel = 'minefield' | 'difficult' | 'balanced' | 'batting-friendly' | 'road' | 'unknown';
type PitchFilter = 'all' | PitchLabel;
type SortField = 'name' | 'played' | 'won' | 'lost' | 'noResult' | 'winPercentage' | 'averageRunsPerWicket' | 'pitchRating';
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

function formatWinPct(winPercentage: number | undefined, played: number | undefined): string {
  if ((played ?? 0) === 0) return '—';
  if (winPercentage == null) return '—';
  return `${(winPercentage * 100).toFixed(0)}%`;
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
  'Pitch rating measures how batting-friendly a venue is, based on the average runs scored per wicket (batting average) across all recorded matches there. ' +
  '"Road" venues see batsmen dominate and wickets fall rarely; "Minefield" venues produce cheap dismissals and low totals. ' +
  'Venues with fewer than 3 completed matches are shown as New — not enough data to rate.\n\n' +
  'Note: runs-per-wicket is a better measure than runs-per-innings because it captures both scoring rate and how hard it is to survive. ' +
  'A team dismissed for 150 all out is on a harder pitch than one that scored 150 for 3.';

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

const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr className="border-b border-gray-100">
    {Array.from({ length: cols }).map((_, i) => (
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
  const navigate = useNavigate();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [allVenues, setAllVenues] = useState<VenueSummaryV1[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const [search,       setSearch]      = useState('');
  const [pitchFilter,  setPitchFilter] = useState<PitchFilter>('all');
  const [sortField,    setSortField]   = useState<SortField>('name');
  const [sortDir,      setSortDir]     = useState<SortDir>('asc');

  function load() {
    setLoading(true);
    setError(null);
    getVenueSummaries()
      .then(data => setAllVenues(data))
      .catch(() => setError('Failed to load venues. Please try again later.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        case 'played':
          cmp = (a.stats?.matchesPlayed ?? 0) - (b.stats?.matchesPlayed ?? 0);
          break;
        case 'won':
          cmp = (a.stats?.won ?? 0) - (b.stats?.won ?? 0);
          break;
        case 'lost':
          cmp = (a.stats?.lost ?? 0) - (b.stats?.lost ?? 0);
          break;
        case 'noResult':
          cmp = (a.stats?.noResult ?? 0) - (b.stats?.noResult ?? 0);
          break;
        case 'winPercentage':
          cmp = (a.stats?.winPercentage ?? 0) - (b.stats?.winPercentage ?? 0);
          break;
        case 'averageRunsPerWicket':
          cmp = (a.stats?.averageRunsPerWicket ?? 0) - (b.stats?.averageRunsPerWicket ?? 0);
          break;
        case 'pitchRating': {
          // Sort by difficultyScore; nulls always last regardless of direction
          const sa = a.stats?.difficultyScore ?? null;
          const sb = b.stats?.difficultyScore ?? null;
          if (sa == null && sb == null) { cmp = 0; break; }
          if (sa == null) return 1;
          if (sb == null) return -1;
          cmp = sa - sb;
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [allVenues, search, pitchFilter, sortField, sortDir]);

  // Derived: does any venue have noResult > 0?
  const hasNoResult = useMemo(() => allVenues.some(v => (v.stats?.noResult ?? 0) > 0), [allVenues]);

  const mappableVenues = useMemo(
    () => allVenues.filter(v => v.latitude != null && v.longitude != null),
    [allVenues],
  );

  const mapCenter = useMemo(() => {
    if (mappableVenues.length === 0) return null;
    const totals = mappableVenues.reduce(
      (acc, v) => ({ lat: acc.lat + (v.latitude ?? 0), lng: acc.lng + (v.longitude ?? 0) }),
      { lat: 0, lng: 0 },
    );
    return {
      lat: totals.lat / mappableVenues.length,
      lng: totals.lng / mappableVenues.length,
    };
  }, [mappableVenues]);

  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const fitMapToVenues = useCallback((map: google.maps.Map | null) => {
    if (!map || mappableVenues.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    mappableVenues.forEach(venue => {
      if (venue.latitude != null && venue.longitude != null) {
        bounds.extend({ lat: venue.latitude, lng: venue.longitude });
      }
    });

    map.fitBounds(bounds, 64);

    if (mappableVenues.length === 1) {
      map.setZoom(14);
    }
  }, [mappableVenues]);

  useEffect(() => {
    fitMapToVenues(mapRef.current);
  }, [fitMapToVenues]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Default pitch rating sort is descending (road first)
      setSortDir(field === 'pitchRating' ? 'desc' : 'asc');
    }
  }

  // Base cols: Venue + Played + Won + Lost + Win% + Avg runs/wicket + Pitch rating + Map = 8
  // Plus optional N/R column
  const colCount = hasNoResult ? 9 : 8;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Venues</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-2xl">
            Every ground The Village CC has played at.
            Pitch rating is based on the average runs scored per wicket (batting average).
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
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={load}
              className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {mappableVenues.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All venue locations</h2>
              <p className="text-xs text-gray-500 mt-1">
                Showing {mappableVenues.length} venue{mappableVenues.length !== 1 ? 's' : ''} with coordinates. Click a pin to open that venue.
              </p>
            </div>

            {mapLoadError ? (
              <div className="h-80 px-4 sm:px-6 py-4 text-sm text-gray-600 bg-gray-50 flex items-center">
                Map could not be loaded right now. You can still open venue pages from the table below.
              </div>
            ) : !isMapLoaded || !mapCenter ? (
              <div className="h-80 bg-gray-100 animate-pulse" aria-label="Loading venues map" />
            ) : (
              <div className="h-80">
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapCenter ?? undefined}
                  zoom={mapCenter ? 9 : undefined}
                  options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                  }}
                  onLoad={map => {
                    mapRef.current = map;
                    fitMapToVenues(map);
                  }}
                >
                  {mappableVenues.map((venue) => (
                    <Marker
                      key={venue.id ?? `${venue.name}-${venue.latitude}-${venue.longitude}`}
                      position={{ lat: venue.latitude!, lng: venue.longitude! }}
                      title={venue.name ?? 'Venue'}
                      onClick={() => {
                        if (venue.id != null) {
                          navigate(`/venues/${venue.id}`);
                        }
                      }}
                    />
                  ))}
                </GoogleMap>
              </div>
            )}
          </section>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <SortHeader label="Venue"    field="name"          current={sortField} dir={sortDir} onSort={handleSort} className="text-left" />
                <SortHeader label="Played"   field="played"        current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                <SortHeader label="Won"      field="won"           current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                <SortHeader label="Lost"     field="lost"          current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                {hasNoResult && (
                  <SortHeader label="N/R"   field="noResult"      current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                )}
                <SortHeader label="Win %"   field="winPercentage" current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                <SortHeader label="Avg runs/wicket" field="averageRunsPerWicket" current={sortField} dir={sortDir} onSort={handleSort} className="text-right hidden sm:table-cell" />
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
              {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)}

              {!loading && !error && visibleVenues.length === 0 && (
                <tr>
                  <td colSpan={colCount} className="px-4 py-8 text-center text-gray-400">
                    No venues match your search.
                  </td>
                </tr>
              )}

              {!loading &&
                visibleVenues.map(venue => {
                  const label = normLabel(venue.stats?.difficultyLabel);
                  const avgWicket = venue.stats?.averageRunsPerWicket;
                  const avgDisplay =
                    (venue.stats?.matchesPlayed ?? 0) === 0
                      ? '—'
                      : avgWicket != null
                      ? avgWicket.toFixed(1)
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
                      <td className="px-4 py-3 text-right text-emerald-700 font-medium">
                        {venue.stats?.won ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">
                        {venue.stats?.lost ?? 0}
                      </td>
                      {hasNoResult && (
                        <td className="px-4 py-3 text-right text-gray-500">
                          {venue.stats?.noResult ?? 0}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatWinPct(venue.stats?.winPercentage, venue.stats?.matchesPlayed)}
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
            Click a venue name to view full stats and match history.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VenuesListPage;

