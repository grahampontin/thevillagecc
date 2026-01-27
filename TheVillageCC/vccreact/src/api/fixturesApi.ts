/**
 * Fixtures API layer for fetching fixtures/matches data.
 * Centralizes all Fixtures and Matches endpoint calls.
 */

import { getJson } from './http';
import { MatchV1 } from '../domain/match';

/**
 * Fetches fixtures for a specific season.
 * Uses GET /api/Fixtures?season=year
 * 
 * @param season - The season year to fetch fixtures for
 * @returns Promise resolving to array of MatchV1 objects
 */
export async function getFixturesBySeason(season: number): Promise<MatchV1[]> {
  return getJson<MatchV1[]>(`/api/Fixtures?season=${season}`);
}

/**
 * Fetches all matches.
 * Uses GET /api/Matches
 * 
 * @returns Promise resolving to array of MatchV1 objects
 */
export async function getAllMatches(): Promise<MatchV1[]> {
  return getJson<MatchV1[]>('/api/Matches');
}

/**
 * Fetches a specific match by ID.
 * Uses GET /api/Matches/{id}
 * 
 * @param id - The match ID
 * @returns Promise resolving to MatchV1 object
 */
export async function getMatchById(id: number): Promise<MatchV1> {
  return getJson<MatchV1>(`/api/Matches/${id}`);
}
