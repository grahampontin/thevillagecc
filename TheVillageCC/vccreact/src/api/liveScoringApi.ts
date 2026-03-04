import { getJson, postJson } from './http';
import {
  LiveScorecardV1,
  LiveScoringMatchSummaryV1,
  MatchStateV1,
  MatchStateUpdateV1,
  BallByBallMatchConditionsV1,
  OppositionInningsDetailsV1,
  InningsEndDetailsV1,
} from './swaggerTypes';
import { apiUrl } from './config';

/**
 * Fetches live scorecard data for a specific match
 * @param matchId - The match ID
 * @returns Promise resolving to LiveScorecardV1
 */
export async function getLiveScorecardData(matchId: string | number): Promise<LiveScorecardV1> {
  return getJson<LiveScorecardV1>(apiUrl(`/api/LiveScoring/${matchId}/scorecard`));
}

/**
 * Fetches matches available for live scoring
 * @returns Promise resolving to array of LiveScoringMatchSummaryV1
 */
export async function getLiveScoringMatches(): Promise<LiveScoringMatchSummaryV1[]> {
  return getJson<LiveScoringMatchSummaryV1[]>(apiUrl('/api/LiveScoring/matches'));
}

/**
 * Fetches the current match state for live scoring
 * @param matchId - The match ID
 * @returns Promise resolving to MatchStateV1
 */
export async function getLiveScoringMatchState(matchId: number): Promise<MatchStateV1> {
  return getJson<MatchStateV1>(apiUrl(`/api/LiveScoring/${matchId}`));
}

/**
 * Starts a live scoring match with the given conditions
 * @param matchId - The match ID
 * @param conditions - The match conditions (players, captain, keeper, toss, format)
 * @returns Promise resolving to MatchStateV1
 */
export async function startLiveScoringMatch(
  matchId: number,
  conditions: BallByBallMatchConditionsV1,
): Promise<MatchStateV1> {
  return postJson<MatchStateV1>(apiUrl(`/api/LiveScoring/${matchId}/start`), conditions);
}

/**
 * Submits the completed over to the server
 * @param matchId - The match ID
 * @param payload - The match state update with current over data
 * @returns Promise resolving to MatchStateV1
 */
export async function submitOver(matchId: number, payload: MatchStateUpdateV1): Promise<MatchStateV1> {
  return postJson<MatchStateV1>(apiUrl(`/api/LiveScoring/${matchId}/over`), payload);
}

/**
 * Submits the opposition score for a bowling over
 * @param matchId - The match ID
 * @param payload - Opposition innings details (score, overs, wickets, commentary)
 * @returns Promise resolving to MatchStateV1
 */
export async function submitOppositionScore(
  matchId: number,
  payload: OppositionInningsDetailsV1,
): Promise<MatchStateV1> {
  return postJson<MatchStateV1>(apiUrl(`/api/LiveScoring/${matchId}/opposition-score`), payload);
}

/**
 * Ends the current innings
 * @param matchId - The match ID
 * @param payload - End innings details (inningsType, wasDeclared, commentary)
 * @returns Promise resolving to MatchStateV1
 */
export async function endInnings(matchId: number, payload: InningsEndDetailsV1): Promise<MatchStateV1> {
  return postJson<MatchStateV1>(apiUrl(`/api/LiveScoring/${matchId}/end-innings`), payload);
}
