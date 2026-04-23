import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getTeamSummaries } from '../api/teamsApi';
import { TeamSummaryV1 } from '../api/swaggerTypes';

// ── Types ──────────────────────────────────────────────────────────────────

type DifficultyRating = 'red' | 'amber' | 'green' | 'unknown' | null;
type DifficultyFilter = 'all' | 'red' | 'amber' | 'green' | 'unknown';
type SortField = 'name' | 'homeVenueName' | 'played' | 'won' | 'lost' | 'noResult' | 'winPercentage' | 'difficultyRating';
type SortDir = 'asc' | 'desc';

// ── Helpers ────────────────────────────────────────────────────────────────

const DIFFICULTY_ORDER: Record<string, number> = { red: 0, amber: 1, green: 2, unknown: 3 };

function difficultyLabel(rating: DifficultyRating): string {
  switch (rating) {
    case 'red':   return 'Hard';
    case 'amber': return 'Medium';
    case 'green': return 'Easy';
    default:      return 'New';
  }
}

function formatWinPct(winPercentage: number | undefined, played: number | undefined): string {
  if ((played ?? 0) === 0) return '—';
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

const DifficultyBadge: React.FC<{ rating: DifficultyRating; size?: 'sm' | 'md' }> = ({
  rating,
  size = 'sm',
}) => {
  const key = rating?.toLowerCase() ?? 'unknown';
  const style = BADGE_STYLES[key] ?? BADGE_STYLES.unknown;
  const label = difficultyLabel(rating);
  const px = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${px} ${style.bg} ${style.text}`}
      aria-label={`Difficulty: ${label}`}
    >
      <span className={`w-2 h-2 rounded-full inline-block ${style.dot}`}></span>
      {label}
    </span>
  );
};

// ── Tooltip ────────────────────────────────────────────────────────────────

const DIFFICULTY_TOOLTIP =
  'Difficulty is calculated from the margin of every result against this team, not just win/loss counts. ' +
  'A 10-wicket defeat counts as much harder than a 1-wicket defeat, and a crushing run victory counts as much easier than a narrow one. ' +
  'Ratings are relative: the hardest third of teams (by weighted margin) are Red, the middle third Amber, and the easiest third Green. ' +
  'Teams with fewer than 3 completed matches are shown as New.';

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
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
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

// ── Main component ─────────────────────────────────────────────────────────

const Teams: React.FC = () => {
  const [allTeams, setAllTeams] = useState<TeamSummaryV1[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const [search,     setSearch]     = useState('');
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>('all');
  const [sortField,  setSortField]  = useState<SortField>('name');
  const [sortDir,    setSortDir]    = useState<SortDir>('asc');

  useEffect(() => {
    getTeamSummaries()
      .then(data => setAllTeams(data))
      .catch(() => setError('Failed to load teams. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  // Derived: does any row have noResult > 0?
  const hasNoResult = useMemo(() => allTeams.some(t => (t.noResult ?? 0) > 0), [allTeams]);

  const visibleTeams = useMemo(() => {
    let filtered = allTeams;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        t =>
          (t.name ?? '').toLowerCase().includes(q) ||
          (t.homeVenueName ?? '').toLowerCase().includes(q),
      );
    }

    // Difficulty filter
    if (diffFilter !== 'all') {
      filtered = filtered.filter(t => {
        const r = t.difficultyRating?.toLowerCase() ?? 'unknown';
        if (diffFilter === 'unknown') return r === 'unknown' || !t.difficultyRating;
        return r === diffFilter;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = (a.name ?? '').localeCompare(b.name ?? '');
          break;
        case 'homeVenueName':
          cmp = (a.homeVenueName ?? '').localeCompare(b.homeVenueName ?? '');
          break;
        case 'played':
          cmp = (a.played ?? 0) - (b.played ?? 0);
          break;
        case 'won':
          cmp = (a.won ?? 0) - (b.won ?? 0);
          break;
        case 'lost':
          cmp = (a.lost ?? 0) - (b.lost ?? 0);
          break;
        case 'noResult':
          cmp = (a.noResult ?? 0) - (b.noResult ?? 0);
          break;
        case 'winPercentage':
          cmp = (a.winPercentage ?? 0) - (b.winPercentage ?? 0);
          break;
        case 'difficultyRating': {
          const ra: number = DIFFICULTY_ORDER[a.difficultyRating?.toLowerCase() ?? 'unknown'] ?? 3;
          const rb: number = DIFFICULTY_ORDER[b.difficultyRating?.toLowerCase() ?? 'unknown'] ?? 3;
          cmp = ra - rb;
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [allTeams, search, diffFilter, sortField, sortDir]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  const colCount = hasNoResult ? 8 : 7;

  const DIFF_FILTERS: { value: DifficultyFilter; label: string }[] = [
    { value: 'all',     label: 'All'    },
    { value: 'red',     label: 'Hard'   },
    { value: 'amber',   label: 'Medium' },
    { value: 'green',   label: 'Easy'   },
    { value: 'unknown', label: 'New'    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Opposition Teams</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-2xl">
            All clubs The Village CC have played against.
            Difficulty is based on the margin of wins and losses against this team.
            Heavy defeats count more than narrow ones. Ratings are relative to all other opposition teams.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Text search */}
          <input
            type="search"
            placeholder="Search by team or ground…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-villageGreen"
            aria-label="Search teams"
          />
          {/* Difficulty toggle buttons */}
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by difficulty">
            {DIFF_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDiffFilter(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  diffFilter === value
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
                <SortHeader label="Team"        field="name"           current={sortField} dir={sortDir} onSort={handleSort} className="text-left" />
                <SortHeader label="Home Ground" field="homeVenueName"  current={sortField} dir={sortDir} onSort={handleSort} className="text-left hidden sm:table-cell" />
                <SortHeader label="Played"      field="played"         current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                <SortHeader label="Won"         field="won"            current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                <SortHeader label="Lost"        field="lost"           current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                {hasNoResult && (
                  <SortHeader label="N/R" field="noResult" current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                )}
                <SortHeader label="Win %" field="winPercentage" current={sortField} dir={sortDir} onSort={handleSort} className="text-right" />
                <SortHeader
                  label={<>Difficulty<InfoIcon title={DIFFICULTY_TOOLTIP} /></>}
                  field="difficultyRating"
                  current={sortField}
                  dir={sortDir}
                  onSort={handleSort}
                  className="text-center"
                />
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)}

              {!loading && !error && visibleTeams.length === 0 && (
                <tr>
                  <td colSpan={colCount} className="px-4 py-8 text-center text-gray-400">
                    No teams match your filter.
                  </td>
                </tr>
              )}

              {!loading &&
                visibleTeams.map(team => (
                  <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <Link to={`/teams/${team.id}`} className="font-medium text-villageGreen hover:underline">
                        {team.name ?? '—'}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {team.homeVenueName ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{team.played ?? 0}</td>
                    <td className="px-4 py-3 text-right text-emerald-700 font-medium">{team.won ?? 0}</td>
                    <td className="px-4 py-3 text-right text-red-600 font-medium">{team.lost ?? 0}</td>
                    {hasNoResult && (
                      <td className="px-4 py-3 text-right text-gray-500">{team.noResult ?? 0}</td>
                    )}
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatWinPct(team.winPercentage, team.played)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DifficultyBadge rating={(team.difficultyRating as DifficultyRating) ?? null} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && (
          <p className="mt-3 text-xs text-gray-400">
            {visibleTeams.length} team{visibleTeams.length !== 1 ? 's' : ''}
            {search || diffFilter !== 'all' ? ` matching your filter (${allTeams.length} total)` : ' total'}.
            Click a team name to view full stats and match history.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Teams;

