/**
 * Stats API layer for fetching statistics data.
 * Centralizes all Stats endpoint calls.
 */

import { getJson } from './http';

export interface PlayerV1 {
  playerId: number;
  matches: number;
  name: string;
  shortName: string;
  nickname: string;
  battingStyle: string;
  bowlingStyle: string;
  isActive: boolean;
  firstName: string;
  surname: string;
  middleInitials: string;
  debut: string;
  isRightHandBat: boolean;
  lastMatchDate: string;
  playingRole: string;
}

export interface GridOptionsV1 {
  columnDefs: any[];
  rowData: Record<string, unknown>[];
  footerRow?: Record<string, unknown>;
}

export interface StatsDataV1 {
  statsType: string;
  gridOptions: GridOptionsV1;
}

export interface PlayerDetailV1 {
  player: PlayerV1;
  // API returns an absolute http(s) URL
  playerImageUrl: string | null;
  battingStats: StatsDataV1;
  bowlingStats: StatsDataV1;
}

/**
 * Fetches leading players data.
 * Uses GET /api/Stats/leadingplayers
 * 
 * @returns Promise resolving to leading players data
 */
export async function getLeadingPlayers(): Promise<any> {
  return getJson<any>('/api/Stats/leadingplayers');
}

/**
 * Fetches player detail statistics.
 * Uses GET /api/Stats/player/{playerId}/detail
 * 
 * @param playerId - The player ID
 * @returns Promise resolving to player detail data
 */
export async function getPlayerDetail(playerId: number): Promise<PlayerDetailV1> {
  return getJson<PlayerDetailV1>(`/api/Stats/player/${playerId}/detail`);
}

/**
 * Fetches player chart data.
 * Uses GET /api/Stats/chart/{playerId}/{chartType}
 * 
 * @param playerId - The player ID
 * @param chartType - The type of chart to fetch
 * @returns Promise resolving to chart data
 */
export async function getPlayerChart(playerId: number, chartType: string): Promise<any> {
  return getJson<any>(`/api/Stats/chart/${playerId}/${chartType}`);
}

/**
 * Fetches player stats by type.
 * Uses GET /api/Stats/player/{playerId}/{statsType}
 * 
 * @param playerId - The player ID
 * @param statsType - The type of stats to fetch
 * @returns Promise resolving to player stats data
 */
export async function getPlayerStats(playerId: number, statsType: string): Promise<any> {
  return getJson<any>(`/api/Stats/player/${playerId}/${statsType}`);
}

/**
 * Fetches player matches.
 * Uses GET /api/Stats/playermatches/{playerId}
 * 
 * @param playerId - The player ID
 * @returns Promise resolving to player matches data
 */
export async function getPlayerMatches(playerId: number): Promise<any> {
  return getJson<any>(`/api/Stats/playermatches/${playerId}`);
}

/**
 * Fetches family tree data.
 * Uses GET /api/Stats/familytree
 * 
 * @returns Promise resolving to family tree data
 */
export async function getFamilyTree(): Promise<any> {
  return getJson<any>('/api/Stats/familytree');
}

/**
 * Queries stats with filters.
 * Uses POST /api/Stats/query
 * 
 * @param query - The query object with filters
 * @returns Promise resolving to stats query results
 */
export async function queryStats(query: any): Promise<any> {
  const response = await fetch('/api/Stats/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    let bodySnippet = '';
    try {
      bodySnippet = await response.text();
      if (bodySnippet.length > 200) {
        bodySnippet = bodySnippet.substring(0, 200) + '...';
      }
    } catch (e) {
      // Ignore errors reading body
    }

    const errorMessage = `HTTP ${response.status} ${response.statusText}${bodySnippet ? ': ' + bodySnippet : ''}`;
    throw new Error(errorMessage);
  }

  return await response.json();
}
