/**
 * Venues API layer for fetching venue data.
 * Centralizes all Venues endpoint calls.
 */

import { getJson, postJson, putJson, deleteRequest } from './http';
import { VenueV1, VenueSummaryV1, VenueDetailV1 } from './swaggerTypes';
import { apiUrl } from './config';

/**
 * Fetches all venues.
 * Uses GET /api/Venues
 * 
 * @returns Promise resolving to array of VenueV1 objects
 */
export async function getAllVenues(): Promise<VenueV1[]> {
  return getJson<VenueV1[]>(apiUrl('/api/Venues'));
}

/**
 * Fetches a specific venue by ID.
 * Uses GET /api/Venues/{id}
 * 
 * @param id - The venue ID
 * @returns Promise resolving to VenueV1 object
 */
export async function getVenueById(id: number): Promise<VenueV1> {
  return getJson<VenueV1>(apiUrl(`/api/Venues/${id}`));
}

/**
 * Creates a new venue.
 * Uses POST /api/Venues
 */
export async function createVenue(venue: VenueV1): Promise<VenueV1> {
  return postJson<VenueV1>(apiUrl('/api/Venues'), venue);
}

/**
 * Updates an existing venue.
 * Uses PUT /api/Venues
 */
export async function updateVenue(venue: VenueV1): Promise<VenueV1> {
  return putJson<VenueV1>(apiUrl('/api/Venues'), venue);
}

/**
 * Deletes a venue by ID.
 * Uses DELETE /api/Venues/{id}
 */
export async function deleteVenue(id: number): Promise<void> {
  return deleteRequest(apiUrl(`/api/Venues/${id}`));
}

/**
 * Fetches a lightweight summary (stats + pitch rating) for all venues.
 * Uses GET /api/Venues/summaries
 */
export async function getVenueSummaries(): Promise<VenueSummaryV1[]> {
  return getJson<VenueSummaryV1[]>(apiUrl('/api/Venues/summaries'));
}

/**
 * Fetches detailed stats and full match history for a specific venue.
 * Uses GET /api/Venues/{id}/details
 */
export async function getVenueDetails(id: number): Promise<VenueDetailV1> {
  return getJson<VenueDetailV1>(apiUrl(`/api/Venues/${id}/details`));
}

/**
 * Triggers a full rebuild of the venue stats cache.
 * Admin/developer use only — do not expose on public pages.
 * Uses POST /api/Venues/recalculate-stats
 */
export async function recalculateVenueStats(): Promise<void> {
  return postJson<void>(apiUrl('/api/Venues/recalculate-stats'), {});
}

