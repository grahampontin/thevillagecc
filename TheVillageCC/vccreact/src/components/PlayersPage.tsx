import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getAllPlayers } from '../api/playersApi';
import { PlayerV1 } from '../api/swaggerTypes';

// ── View / sort types ────────────────────────────────────────────────────────

type ViewMode = 'list' | 'tree';
type SortField = 'name' | 'matches' | 'runs' | 'wickets' | 'debut';
type SortDir = 'asc' | 'desc';

// ── Tree layout constants ────────────────────────────────────────────────────

const NODE_W = 172;
const NODE_H = 80;
const H_GAP = 28;   // horizontal gap between sibling subtrees
const V_GAP = 56;   // vertical gap between levels
const TREE_PADDING = 40;

interface TreeNode {
  player: PlayerV1;
  children: TreeNode[];
  x: number;
  y: number;
}

function subtreeWidth(node: TreeNode): number {
  if (!node.children.length) return NODE_W;
  const childrenTotal =
    node.children.reduce((sum, c) => sum + subtreeWidth(c), 0) +
    H_GAP * (node.children.length - 1);
  return Math.max(NODE_W, childrenTotal);
}

function assignPositions(node: TreeNode, centerX: number, y: number): void {
  node.x = centerX;
  node.y = y;
  if (!node.children.length) return;
  const total =
    node.children.reduce((s, c) => s + subtreeWidth(c), 0) +
    H_GAP * (node.children.length - 1);
  let curX = centerX - total / 2;
  for (const child of node.children) {
    const cw = subtreeWidth(child);
    assignPositions(child, curX + cw / 2, y + NODE_H + V_GAP);
    curX += cw + H_GAP;
  }
}

function buildForest(players: PlayerV1[]): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>();
  for (const p of players) {
    if (p.playerId != null) {
      nodeMap.set(p.playerId, { player: p, children: [], x: 0, y: 0 });
    }
  }

  const roots: TreeNode[] = [];
  // Detect cycle: track visited in DFS (shouldn't happen but guard anyway)
  nodeMap.forEach((node) => {
    const parentId = node.player.clubConnection?.playerId;
    if (parentId != null && nodeMap.has(parentId) && parentId !== node.player.playerId) {
      nodeMap.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  // Sort roots and children alphabetically for consistent layout
  function sortChildren(n: TreeNode) {
    n.children.sort((a, b) =>
      (a.player.surname ?? '').localeCompare(b.player.surname ?? '')
    );
    n.children.forEach(sortChildren);
  }
  roots.sort((a, b) => (a.player.surname ?? '').localeCompare(b.player.surname ?? ''));
  roots.forEach(sortChildren);
  return roots;
}

function collectAll(node: TreeNode): TreeNode[] {
  return [node, ...node.children.flatMap(collectAll)];
}

function layoutForest(roots: TreeNode[]): { nodes: TreeNode[]; svgW: number; svgH: number } {
  let curX = TREE_PADDING;
  let maxY = 0;

  for (const root of roots) {
    const w = subtreeWidth(root);
    assignPositions(root, curX + w / 2, TREE_PADDING);
    curX += w + H_GAP * 3;
  }

  const allNodes = roots.flatMap(collectAll);
  for (const n of allNodes) {
    if (n.y + NODE_H > maxY) maxY = n.y + NODE_H;
  }

  return {
    nodes: allNodes,
    svgW: Math.max(900, curX + TREE_PADDING),
    svgH: maxY + TREE_PADDING,
  };
}

function buildEdges(nodes: TreeNode[]): Array<{ x1: number; y1: number; x2: number; y2: number }> {
  const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (const node of nodes) {
    for (const child of node.children) {
      edges.push({
        x1: node.x,
        y1: node.y + NODE_H,
        x2: child.x,
        y2: child.y,
      });
    }
  }
  return edges;
}

// ── Initials avatar ──────────────────────────────────────────────────────────

const AVATAR_COLOURS = [
  'bg-emerald-600', 'bg-teal-600', 'bg-sky-600', 'bg-indigo-600',
  'bg-violet-600', 'bg-rose-600', 'bg-amber-600', 'bg-lime-600',
];

function avatarColour(playerId: number | undefined): string {
  return AVATAR_COLOURS[(playerId ?? 0) % AVATAR_COLOURS.length];
}

function initials(firstName: string | null | undefined, surname: string | null | undefined): string {
  const f = (firstName ?? '').trim()[0] ?? '';
  const s = (surname ?? '').trim()[0] ?? '';
  return (f + s).toUpperCase() || '?';
}

function battingHandLabel(isRightHandBat: boolean | null | undefined): string {
  if (isRightHandBat == null) return '—';
  return isRightHandBat ? 'RHB' : 'LHB';
}

// ── Role badge ───────────────────────────────────────────────────────────────

const ROLE_BADGE: Record<string, string> = {
  'Batsman': 'bg-sky-100 text-sky-700',
  'Batter': 'bg-sky-100 text-sky-700',
  'Bowler': 'bg-amber-100 text-amber-700',
  'All-rounder': 'bg-emerald-100 text-emerald-700',
  'Wicket-keeper': 'bg-violet-100 text-violet-700',
  'Keeper': 'bg-violet-100 text-violet-700',
  'Wicketkeeper': 'bg-violet-100 text-violet-700',
};

function roleBadgeClass(role: string | null | undefined): string {
  if (!role) return 'bg-gray-100 text-gray-500';
  return ROLE_BADGE[role] ?? 'bg-gray-100 text-gray-600';
}

// ── Skeleton loaders ─────────────────────────────────────────────────────────

const ListSkeleton: React.FC = () => (
  <div className="space-y-2" role="status" aria-label="Loading players" aria-live="polite">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
    ))}
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────

const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<PlayerV1[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // List sort state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Tree scroll container ref
  const treeContainerRef = useRef<HTMLDivElement>(null);

  // ── Data fetch ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        // includeInactive=true so we can show the full family tree
        const data = await getAllPlayers();
        setPlayers(data);
      } catch (err) {
        console.error('Failed to load players', err);
        setError('Failed to load players. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Filtered / sorted list ─────────────────────────────────────────────────

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = players.filter(p => {
      if (!showInactive && !p.isActive) return false;
      if (!q) return true;
      const fullName = `${p.firstName ?? ''} ${p.surname ?? ''}`.toLowerCase();
      return fullName.includes(q) || (p.nickname ?? '').toLowerCase().includes(q);
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = (a.surname ?? '').localeCompare(b.surname ?? '');
          if (cmp === 0) cmp = (a.firstName ?? '').localeCompare(b.firstName ?? '');
          break;
        case 'matches':
          cmp = (a.matches ?? 0) - (b.matches ?? 0);
          break;
        case 'runs':
          cmp = (a.runs ?? 0) - (b.runs ?? 0);
          break;
        case 'wickets':
          cmp = (a.wickets ?? 0) - (b.wickets ?? 0);
          break;
        case 'debut':
          cmp = ((a.debut ?? '') < (b.debut ?? '') ? -1 : (a.debut ?? '') > (b.debut ?? '') ? 1 : 0);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [players, search, showInactive, sortField, sortDir]);

  // ── Tree data ──────────────────────────────────────────────────────────────

  const { treeNodes, treeEdges, svgW, svgH } = useMemo(() => {
    const toTree = showInactive
      ? players
      : players.filter(p => p.isActive);
    const roots = buildForest(toTree);
    const { nodes, svgW, svgH } = layoutForest(roots);
    const edges = buildEdges(nodes);
    return { treeNodes: nodes, treeEdges: edges, svgW, svgH };
  }, [players, showInactive]);

  // Highlight matching nodes in tree
  const treeSearchQ = search.trim().toLowerCase();
  const isHighlighted = useCallback(
    (p: PlayerV1): boolean => {
      if (!treeSearchQ) return true;
      const fullName = `${p.firstName ?? ''} ${p.surname ?? ''}`.toLowerCase();
      return fullName.includes(treeSearchQ) || (p.nickname ?? '').toLowerCase().includes(treeSearchQ);
    },
    [treeSearchQ],
  );

  // ── Sort toggle helper ─────────────────────────────────────────────────────

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir(field === 'name' ? 'asc' : 'desc');
    }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field)
      return <span className="ml-1 text-gray-300 select-none">↕</span>;
    return (
      <span className="ml-1 text-villageGreen select-none">
        {sortDir === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // ── Player debut year helper ───────────────────────────────────────────────

  const debutYear = (player: PlayerV1): string => {
    if (!player.debut) return '—';
    const y = new Date(player.debut).getFullYear();
    return isNaN(y) ? '—' : String(y);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page title + view toggle */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">The Squad</h1>
            {!isLoading && !error && (
              <p className="mt-1 text-sm text-gray-500">
                {players.filter(p => p.isActive).length} active{' '}
                {players.length > players.filter(p => p.isActive).length
                  ? `· ${players.length} total`
                  : ''}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div
              className="inline-flex rounded-lg border border-gray-200 overflow-hidden"
              role="group"
              aria-label="View mode"
            >
              <button
                className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition ${
                  viewMode === 'list'
                    ? 'bg-villageGreen text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition border-l border-gray-200 ${
                  viewMode === 'tree'
                    ? 'bg-villageGreen text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('tree')}
                aria-pressed={viewMode === 'tree'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4m0 0l-4 4m4-4l4 4M6 11v2a2 2 0 002 2h2m4 0h2a2 2 0 002-2v-2" />
                </svg>
                Family Tree
              </button>
            </div>
          </div>
        </div>

        {/* Controls bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-villageGreen bg-white"
              aria-label="Search players"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={e => setShowInactive(e.target.checked)}
              className="w-4 h-4 rounded accent-villageGreen"
            />
            Include former players
          </label>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800" role="alert">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading && <ListSkeleton />}

        {/* ── LIST VIEW ──────────────────────────────────────────────────────── */}
        {!isLoading && !error && viewMode === 'list' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {filteredList.length === 0 ? (
              <p className="p-8 text-center text-gray-500 text-sm">No players match your search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm" role="table" aria-label="Players list">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <th
                        scope="col"
                        className="px-4 py-3 text-left font-medium cursor-pointer hover:text-gray-800 whitespace-nowrap"
                        onClick={() => toggleSort('name')}
                      >
                        Player {sortIcon('name')}
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-medium whitespace-nowrap hidden sm:table-cell">
                        Role
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-medium whitespace-nowrap hidden md:table-cell">
                        Bat
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-medium whitespace-nowrap hidden md:table-cell">
                        Bowl
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium cursor-pointer hover:text-gray-800 whitespace-nowrap"
                        onClick={() => toggleSort('matches')}
                      >
                        M {sortIcon('matches')}
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium cursor-pointer hover:text-gray-800 whitespace-nowrap hidden lg:table-cell"
                        onClick={() => toggleSort('runs')}
                      >
                        Runs {sortIcon('runs')}
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium cursor-pointer hover:text-gray-800 whitespace-nowrap hidden lg:table-cell"
                        onClick={() => toggleSort('wickets')}
                      >
                        Wkts {sortIcon('wickets')}
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium cursor-pointer hover:text-gray-800 whitespace-nowrap hidden md:table-cell"
                        onClick={() => toggleSort('debut')}
                      >
                        Debut {sortIcon('debut')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredList.map(player => (
                      <tr
                        key={player.playerId}
                        className="hover:bg-gray-50 transition group"
                      >
                        {/* Name + avatar */}
                        <td className="px-4 py-3">
                          <Link
                            to={`/player/${player.playerId}`}
                            className="flex items-center gap-3 group-hover:text-villageGreen transition"
                          >
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold flex-shrink-0 ${avatarColour(player.playerId ?? undefined)}`}
                              aria-hidden="true"
                            >
                              {initials(player.firstName, player.surname)}
                            </span>
                            <span className="font-medium text-gray-900 group-hover:text-villageGreen">
                              {player.firstName} {player.surname}
                              {!player.isActive && (
                                <span className="ml-2 text-xs text-gray-400 font-normal">(former)</span>
                              )}
                            </span>
                          </Link>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {player.playingRole ? (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeClass(player.playingRole)}`}>
                              {player.playingRole}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Batting */}
                        <td className="px-4 py-3 text-gray-700 hidden md:table-cell whitespace-nowrap">
                          {battingHandLabel(player.isRightHandBat)}
                        </td>

                        {/* Bowling */}
                        <td className="px-4 py-3 text-gray-700 hidden md:table-cell whitespace-nowrap">
                          {player.bowlingStyle ?? <span className="text-gray-300">—</span>}
                        </td>

                        {/* Matches */}
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {player.matches ?? 0}
                        </td>

                        {/* Runs */}
                        <td className="px-4 py-3 text-right text-gray-700 hidden lg:table-cell">
                          {player.runs ?? 0}
                        </td>

                        {/* Wickets */}
                        <td className="px-4 py-3 text-right text-gray-700 hidden lg:table-cell">
                          {player.wickets ?? 0}
                        </td>

                        {/* Debut */}
                        <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">
                          {debutYear(player)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── FAMILY TREE VIEW ───────────────────────────────────────────────── */}
        {!isLoading && !error && viewMode === 'tree' && (
          <div>
            <p className="mb-4 text-sm text-gray-500">
              Lines connect players to the person who introduced them to the club.
              Players at the top joined without a referral — they're the originals.
            </p>

            {treeNodes.length === 0 ? (
              <p className="p-8 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded-xl shadow-sm">
                No players to display.
              </p>
            ) : (
              <div
                ref={treeContainerRef}
                className="border border-gray-200 rounded-xl bg-gray-50 overflow-auto shadow-sm"
                style={{ maxHeight: '70vh' }}
                role="img"
                aria-label="Family tree showing player connections"
              >
                <div style={{ position: 'relative', width: svgW, height: svgH }}>

                  {/* SVG edges */}
                  <svg
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                    width={svgW}
                    height={svgH}
                    aria-hidden="true"
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="6"
                        markerHeight="6"
                        refX="3"
                        refY="3"
                        orient="auto"
                      >
                        <path d="M0,0 L0,6 L6,3 z" fill="#d1d5db" />
                      </marker>
                    </defs>
                    {treeEdges.map((edge, i) => {
                      const midY = (edge.y1 + edge.y2) / 2;
                      return (
                        <path
                          key={i}
                          d={`M ${edge.x1} ${edge.y1} C ${edge.x1} ${midY}, ${edge.x2} ${midY}, ${edge.x2} ${edge.y2}`}
                          fill="none"
                          stroke="#d1d5db"
                          strokeWidth={1.5}
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    })}
                  </svg>

                  {/* Player cards */}
                  {treeNodes.map(node => {
                    const p = node.player;
                    const highlighted = isHighlighted(p);
                    const dimmed = treeSearchQ !== '' && !highlighted;
                    return (
                      <div
                        key={p.playerId}
                        style={{
                          position: 'absolute',
                          left: node.x - NODE_W / 2,
                          top: node.y,
                          width: NODE_W,
                          height: NODE_H,
                          opacity: dimmed ? 0.25 : 1,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <Link
                          to={`/player/${p.playerId}`}
                          className={`flex items-center gap-2.5 w-full h-full px-3 rounded-xl border shadow-sm bg-white hover:shadow-md hover:border-villageGreen transition-all ${
                            p.isActive ? 'border-gray-200' : 'border-dashed border-gray-300'
                          } ${highlighted && treeSearchQ ? 'ring-2 ring-villageGreen ring-offset-1' : ''}`}
                          title={`${p.firstName} ${p.surname}${p.clubConnection ? ` · introduced by ${p.clubConnection.firstName ?? ''} ${p.clubConnection.surname ?? ''}` : ' · founder member'}`}
                        >
                          {/* Avatar */}
                          <span
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-xs font-bold flex-shrink-0 ${avatarColour(p.playerId ?? undefined)} ${p.isActive ? '' : 'opacity-60'}`}
                            aria-hidden="true"
                          >
                            {initials(p.firstName, p.surname)}
                          </span>

                          {/* Name + meta */}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 text-sm truncate leading-tight">
                              {p.firstName} {p.surname}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {p.playingRole && (
                                <span className={`text-xs px-1.5 py-0 rounded-full font-medium ${roleBadgeClass(p.playingRole)}`}>
                                  {p.playingRole}
                                </span>
                              )}
                              <span className="text-xs text-gray-400">{p.matches ?? 0}m</span>
                              {!p.isActive && (
                                <span className="text-xs text-gray-400 italic">former</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-px bg-gray-300 inline-block"></span>
                Connection line (→ introduced)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded border border-dashed border-gray-400 inline-block"></span>
                Former player (dashed border)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded border-2 border-villageGreen inline-block"></span>
                Search match (green highlight)
              </span>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
};

export default PlayersPage;

