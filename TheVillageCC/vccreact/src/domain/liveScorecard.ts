/**
 * Domain types for live scorecard data
 */

export interface BatsmanInnings {
  Name: string;
  Score: number;
  Balls: number;
  Fours: number;
  Sixes: number;
  StrikeRate: number;
  HowOut?: string;
  DismissalText?: string;
}

export interface BowlerDetails {
  Overs: number;
  Maidens: number;
  Runs: number;
  Wickets: number;
  Economy: number;
  Dots?: number;
}

export interface BowlerInnings {
  Name: string;
  Details: BowlerDetails;
}

export interface BattingEntry {
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  howOut: string;
}

export interface BowlingEntry {
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface Innings {
  batting: {
    entries: BattingEntry[];
    extras: {
      wides: number;
      noBalls: number;
      byes: number;
      legByes: number;
      penalties: number;
      total: number;
    };
    fallOfWickets: string;
  };
  bowling: {
    entries: BowlingEntry[];
  };
}

export interface FinalScorecard {
  ourInnings: Innings | null;
  theirInnings: Innings | null;
}

export interface InPlayData {
  Opposition: string;
  Score: number;
  Wickets: number;
  TheirScore: number;
  TheirWickets: number;
  RunRate: number;
  TheirRunRate: number;
  OurInningsStatus: 'NotStarted' | 'InProgress' | 'Completed';
  TheirInningsStatus: 'NotStarted' | 'InProgress' | 'Completed';
  Overs: number;
  Declaration: boolean;
  WonToss: boolean;
  TossWinnerBatted: boolean;
  OurLastCompletedOver: number;
  TheirOver: number;
  OversRemaining?: number;
  OnStrikeBatsman?: BatsmanInnings;
  OtherBatsman?: BatsmanInnings;
  BowlerOneDetails?: BowlerInnings;
  BowlerTwoDetails?: BowlerInnings;
}

export interface MatchReport {
  Conditions: string;
  Report: string;
}

export interface MatchResult {
  IsAbandoned: boolean;
  Margin: string;
  ResultText?: string;
}

export interface LiveScorecardData {
  InPlayData: InPlayData;
  FinalScorecard: FinalScorecard;
  MatchReport: MatchReport;
  Result: MatchResult;
  MatchDate?: string;
  VenueName?: string;
  MatchType?: string;
}
