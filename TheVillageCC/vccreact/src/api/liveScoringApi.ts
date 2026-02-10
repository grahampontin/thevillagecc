import { getJson } from './http';
import { LiveScorecardData } from '../domain/liveScorecard';

/**
 * Fetches live scorecard data for a specific match
 * @param matchId - The match ID
 * @returns Promise resolving to LiveScorecardData
 */
export async function getLiveScorecardData(matchId: string | number): Promise<LiveScorecardData> {
  return getJson<LiveScorecardData>(`/api/livescoring/${matchId}/scorecard`);
}
