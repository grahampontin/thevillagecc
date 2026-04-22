/**
 * Teams API layer for teams (opposition) data.
 * Centralizes all Teams endpoint calls.
 */

import { getJson, postJson, putJson } from './http';
import { TeamV1, TeamDetailV1, TeamSummaryV1 } from './swaggerTypes';
import { apiUrl } from './config';

/**
 * Fetches all teams.
 * Uses GET /api/Teams
 */
export async function getAllTeams(): Promise<TeamV1[]> {
  return getJson<TeamV1[]>(apiUrl('/api/Teams'));
}

/**
 * Fetches a specific team by ID.
 * Uses GET /api/Teams/{id}
 */
export async function getTeamById(id: number): Promise<TeamV1> {
  return getJson<TeamV1>(apiUrl(`/api/Teams/${id}`));
}

/**
 * Creates a new team.
 * Uses POST /api/Teams
 */
export async function createTeam(team: TeamV1): Promise<TeamV1> {
  return postJson<TeamV1>(apiUrl('/api/Teams'), team);
}

/**
 * Updates an existing team.
 * Uses PUT /api/Teams
 */
export async function updateTeam(team: TeamV1): Promise<TeamV1> {
  return putJson<TeamV1>(apiUrl('/api/Teams'), team);
}

/**
 * Fetches detailed stats and match history for a specific team.
 * Uses GET /api/Teams/{id}/details
 */
export async function getTeamDetails(id: number): Promise<TeamDetailV1> {
  return getJson<TeamDetailV1>(apiUrl(`/api/Teams/${id}/details`));
}

/**
 * Fetches a lightweight summary (stats + difficulty) for all teams in one call.
 * Uses GET /api/Teams/summaries
 */
export async function getTeamSummaries(): Promise<TeamSummaryV1[]> {
  return getJson<TeamSummaryV1[]>(apiUrl('/api/Teams/summaries'));
}

