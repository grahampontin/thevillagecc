/**
 * Venues API layer for fetching venue data.
 * Centralizes all Venues endpoint calls.
 */

import { getJson } from './http';
import { VenueV1 } from '../domain/venue';

/**
 * Fetches all venues.
 * Uses GET /api/Venues
 * 
 * @returns Promise resolving to array of VenueV1 objects
 */
export async function getAllVenues(): Promise<VenueV1[]> {
  return getJson<VenueV1[]>('/api/Venues');
}

/**
 * Fetches a specific venue by ID.
 * Uses GET /api/Venues/{id}
 * 
 * @param id - The venue ID
 * @returns Promise resolving to VenueV1 object
 */
export async function getVenueById(id: number): Promise<VenueV1> {
  return getJson<VenueV1>(`/api/Venues/${id}`);
}
