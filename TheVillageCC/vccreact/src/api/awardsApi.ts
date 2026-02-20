/**
 * Awards API layer for fetching awards data.
 * Centralizes all Awards endpoint calls.
 */

import { getJson } from './http';
import { AwardV1 } from './swaggerTypes';
import { apiUrl } from './config';

/**
 * Fetches awards for a specific season.
 * Uses GET /api/Awards?season=year
 * 
 * @param season - The season year to fetch awards for
 * @returns Promise resolving to array of AwardV1 objects
 */
export async function getAwardsBySeason(season: number): Promise<AwardV1[]> {
  return getJson<AwardV1[]>(apiUrl(`/api/Awards?season=${season}`));
}

/**
 * Fetches all awards across all seasons.
 * Uses GET /api/Awards (no season parameter)
 * 
 * @returns Promise resolving to array of AwardV1 objects
 */
export async function getAllAwards(): Promise<AwardV1[]> {
  return getJson<AwardV1[]>(apiUrl('/api/Awards'));
}

/**
 * Fetches a specific award by ID.
 * Uses GET /api/Awards/{id}
 * 
 * @param id - The award ID
 * @returns Promise resolving to AwardV1 object
 */
export async function getAwardById(id: number): Promise<AwardV1> {
  return getJson<AwardV1>(apiUrl(`/api/Awards/${id}`));
}
