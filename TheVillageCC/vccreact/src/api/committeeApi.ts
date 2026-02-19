/**
 * Committee API layer for fetching committee data.
 * Centralizes all Committee endpoint calls.
 */

import { getJson } from './http';
import { CommitteePostV1 } from '../domain/committee';
import { apiUrl } from './config';

/**
 * Fetches all committee posts.
 * Uses GET /api/Committee
 * 
 * @returns Promise resolving to array of CommitteePostV1 objects
 */
export async function getAllCommitteePosts(): Promise<CommitteePostV1[]> {
  return getJson<CommitteePostV1[]>(apiUrl('/api/Committee'));
}

/**
 * Fetches a specific committee post by ID.
 * Uses GET /api/Committee/{id}
 * 
 * @param id - The committee post ID
 * @returns Promise resolving to CommitteePostV1 object
 */
export async function getCommitteePostById(id: number): Promise<CommitteePostV1> {
  return getJson<CommitteePostV1>(apiUrl(`/api/Committee/${id}`));
}
