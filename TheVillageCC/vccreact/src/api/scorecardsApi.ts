import { getJson, postJson } from './http';
import { MatchScorecardV1, MatchReportV1 } from './swaggerTypes';
import { apiUrl } from './config';

export async function getScorecardByMatchId(matchId: number): Promise<MatchScorecardV1> {
  return getJson<MatchScorecardV1>(apiUrl(`/api/Scorecards/${matchId}`));
}

export async function saveScorecard(matchId: number, scorecard: MatchScorecardV1): Promise<MatchScorecardV1> {
  return postJson<MatchScorecardV1>(apiUrl(`/api/Scorecards/${matchId}`), scorecard);
}

export async function getMatchReport(matchId: number): Promise<MatchReportV1> {
  return getJson<MatchReportV1>(apiUrl(`/api/matchreports/${matchId}`));
}

export async function saveMatchReport(matchId: number, report: MatchReportV1): Promise<void> {
  return postJson<void>(apiUrl(`/api/matchreports/${matchId}`), report);
}
