/**
 * Results API layer for fetching match results.
 * Centralizes all Results endpoint calls.
 */

import { getJson } from './http';
import { ResultV1 } from './swaggerTypes';
import { apiUrl } from './config';

/**
 * Fetches the most recent N results.
 * Uses GET /api/Results/recent?count=N (no season parameter).
 * 
 * @param count - Number of recent results to fetch (default: 10)
 * @returns Promise resolving to array of ResultV1 objects
 */
export async function getRecentResults(count: number = 10): Promise<ResultV1[]> {
  return getJson<ResultV1[]>(apiUrl(`/api/Results/recent?count=${count}`));
}

/**
 * Fetches results for a specific season.
 * Uses GET /api/Results?season=year
 * 
 * @param season - The season year to fetch results for
 * @returns Promise resolving to array of ResultV1 objects
 */
export async function getResultsBySeason(season: number): Promise<ResultV1[]> {
  return getJson<ResultV1[]>(apiUrl(`/api/Results?season=${season}`));
}
