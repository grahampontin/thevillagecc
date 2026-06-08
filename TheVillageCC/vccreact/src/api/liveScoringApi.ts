import { getJson, postJson, deleteJson } from './http';
import {
  LiveScorecardV1,
  LiveScoringMatchSummaryV1,
  MatchStateV1,
  MatchStateUpdateV1,
  BallByBallMatchConditionsV1,
  OppositionInningsDetailsV1,
  InningsEndDetailsV1,
  AbandonMatchV1,
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

/**
 * Abandons the live match, closing any innings in progress and saving ball-by-ball data.
 * @param matchId - The match ID
 * @param payload - Abandon details (optional reason)
 * @returns Promise resolving to void (204 No Content)
 */
export async function abandonMatch(matchId: number, payload: AbandonMatchV1): Promise<void> {
  return postJson<void>(apiUrl(`/api/LiveScoring/${matchId}/abandon`), payload);
}

/**
 * Starts ball-by-ball opposition innings scoring with the opening pair.
 * @param matchId - The match ID
 * @param payload - Opening batsman names
 * @returns Promise resolving to MatchStateV1 (nextState becomes OppositionBattingOver)
 */
export async function startOppositionBallByBall(
  matchId: number,
  payload: { batsmanNames: string[] },
): Promise<MatchStateV1> {
  return postJson<MatchStateV1>(apiUrl(`/api/LiveScoring/${matchId}/start-opposition-ball-by-ball`), payload);
}

/**
 * Submits a completed opposition over in ball-by-ball mode.
 * @param matchId - The match ID
 * @param payload - Opposition innings update (over + player stats snapshot)
 * @returns Promise resolving to MatchStateV1
 */
export async function submitOppositionOver(matchId: number, payload: unknown): Promise<MatchStateV1> {
  return postJson<MatchStateV1>(apiUrl(`/api/LiveScoring/${matchId}/opposition-over`), payload);
}

/**
 * Undoes the last submitted opposition over.
 * @param matchId - The match ID
 * @returns Promise resolving to MatchStateV1
 */
export async function deleteLastOppositionOver(matchId: number): Promise<MatchStateV1> {
  return deleteJson<MatchStateV1>(apiUrl(`/api/LiveScoring/${matchId}/last-opposition-over`));
}

