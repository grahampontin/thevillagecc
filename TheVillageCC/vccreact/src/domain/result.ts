/**
 * ResultV1 type matching components.schemas.ResultV1 in cricketclub.json OpenAPI spec.
 * 
 * Fields marked with `| null` or `?` indicate nullable: true in the spec.
 * Score-related fields are non-nullable in the spec but optional (no required array),
 * so we mark them as optional (?) to handle cases where they may be missing.
 */
export interface ResultV1 {
  matchId: number;
  homeTeamName?: string | null;
  homeTeamScore?: string | null;
  awayTeamName?: string | null;
  awayTeamScore?: string | null;
  resultText?: string | null;
  resultMargin?: string | null;
  matchDate?: string | null;
  winningTeam?: string | null;
  losingTeam?: string | null;
  margin?: string | null;
  theirOversFaced?: number;
  theirWickets?: number;
  theirScore?: number;
  ourOversFaced?: number;
  ourWickets?: number;
  ourScore?: number;
  isTied?: boolean;
  isDrawn?: boolean;
  isAbandoned?: boolean;
  venueName?: string | null;
  matchReportConditions?: string | null;
  matchReportText?: string | null;
  matchReportImage?: string | null;
  isWinner?: boolean | null;
}
