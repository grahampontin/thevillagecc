/**
 * Committee API layer for fetching committee data.
 * Centralizes all Committee endpoint calls.
 */

import { getJson, postJson, putJson, deleteRequest } from './http';
import { CommitteePostV1 } from './swaggerTypes';
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
 * Fetches committee posts for a specific year.
 * Uses GET /api/Committee?year=<year>
 */
export async function getCommitteePostsByYear(year: number): Promise<CommitteePostV1[]> {
  return getJson<CommitteePostV1[]>(apiUrl(`/api/Committee?year=${year}`));
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

/**
 * Creates a new committee post.
 * Uses POST /api/Committee
 */
export async function createCommitteePost(post: CommitteePostV1): Promise<CommitteePostV1> {
  return postJson<CommitteePostV1>(apiUrl('/api/Committee'), post);
}

/**
 * Updates an existing committee post.
 * Uses PUT /api/Committee/{id}
 */
export async function updateCommitteePost(post: CommitteePostV1): Promise<CommitteePostV1> {
  return putJson<CommitteePostV1>(apiUrl(`/api/Committee/${post.id}`), post);
}

/**
 * Deletes a committee post by ID.
 * Uses DELETE /api/Committee/{id}
 */
export async function deleteCommitteePost(id: number): Promise<void> {
  return deleteRequest(apiUrl(`/api/Committee/${id}`));
}
