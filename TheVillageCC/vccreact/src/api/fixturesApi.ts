/**
 * Fixtures API layer for fetching fixtures/matches data.
 * Centralizes all Fixtures and Matches endpoint calls.
 */

import { getJson, postJson, putJson } from './http';
import { MatchV1 } from './swaggerTypes';
import { apiUrl } from './config';

/**
 * Fetches fixtures for a specific season.
 * Uses GET /api/Fixtures?season=year
 * 
 * @param season - The season year to fetch fixtures for
 * @returns Promise resolving to array of MatchV1 objects
 */
export async function getFixturesBySeason(season: number): Promise<MatchV1[]> {
  return getJson<MatchV1[]>(apiUrl(`/api/Fixtures?season=${season}`));
}

/**
 * Fetches all matches.
 * Uses GET /api/Matches
 * 
 * @returns Promise resolving to array of MatchV1 objects
 */
export async function getAllMatches(): Promise<MatchV1[]> {
  return getJson<MatchV1[]>(apiUrl('/api/Matches'));
}

/**
 * Fetches matches for a specific season.
 * Uses GET /api/Matches?season=year
 */
export async function getMatchesBySeason(season: number): Promise<MatchV1[]> {
  return getJson<MatchV1[]>(apiUrl(`/api/Matches?season=${season}`));
}

/**
 * Fetches a specific match by ID.
 * Uses GET /api/Matches/{id}
 * 
 * @param id - The match ID
 * @returns Promise resolving to MatchV1 object
 */
export async function getMatchById(id: number): Promise<MatchV1> {
  return getJson<MatchV1>(apiUrl(`/api/Matches/${id}`));
}

/**
 * Creates a new match.
 * Uses POST /api/Matches
 */
export async function createMatch(match: MatchV1): Promise<MatchV1> {
  return postJson<MatchV1>(apiUrl('/api/Matches'), match);
}

/**
 * Updates an existing match.
 * Uses PUT /api/Matches
 */
export async function updateMatch(match: MatchV1): Promise<MatchV1> {
  return putJson<MatchV1>(apiUrl('/api/Matches'), match);
}
