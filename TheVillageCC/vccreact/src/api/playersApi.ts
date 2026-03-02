/**
 * Players API layer for fetching player data.
 * Centralizes all Players endpoint calls.
 */

import { getJson, postJson, putJson } from './http';
import { PlayerV1 } from './swaggerTypes';
import { apiUrl } from './config';

/**
 * Fetches all players.
 * Uses GET /api/Players
 * 
 * @returns Promise resolving to array of PlayerV1 objects
 */
export async function getAllPlayers(): Promise<PlayerV1[]> {
  return getJson<PlayerV1[]>(apiUrl('/api/Players'));
}

/**
 * Fetches a specific player by ID.
 * Uses GET /api/Players/{id}
 * 
 * @param id - The player ID
 * @returns Promise resolving to PlayerV1 object
 */
export async function getPlayerById(id: number): Promise<PlayerV1> {
  return getJson<PlayerV1>(apiUrl(`/api/Players/${id}`));
}

/**
 * Creates a new player.
 * Uses POST /api/Players
 */
export async function createPlayer(player: PlayerV1): Promise<PlayerV1> {
  return postJson<PlayerV1>(apiUrl('/api/Players'), player);
}

/**
 * Updates an existing player.
 * Uses PUT /api/Players
 */
export async function updatePlayer(player: PlayerV1): Promise<PlayerV1> {
  return putJson<PlayerV1>(apiUrl('/api/Players'), player);
}
