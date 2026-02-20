import { getJson } from './http';
import { LiveScorecardV1 } from '../domain/liveScorecard';
import { apiUrl } from './config';

/**
 * Fetches live scorecard data for a specific match
 * @param matchId - The match ID
 * @returns Promise resolving to LiveScorecardV1
 */
export async function getLiveScorecardData(matchId: string | number): Promise<LiveScorecardV1> {
  return getJson<LiveScorecardV1>(apiUrl(`/api/LiveScoring/${matchId}/scorecard`));
}
