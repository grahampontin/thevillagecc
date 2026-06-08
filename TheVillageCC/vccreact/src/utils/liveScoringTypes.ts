import type { components } from '../api/generated/openapi';

// ---------------------------------------------------------------------------
// Screen state machine
// ---------------------------------------------------------------------------

export type Screen =
  | 'chooseMatch'
  | 'selectTeam'
  | 'matchConditions'
  | 'newOver'
  | 'scoring'
  | 'wicket'
  | 'endOver'
  | 'endInnings'
  | 'oppositionScoring'
  | 'oppositionBallByBall'
  | 'endMatch';

// ---------------------------------------------------------------------------
// Local (unsaved) ball and wicket types
// ---------------------------------------------------------------------------

export interface LocalBall {
  amount: number;
  thing: string; // '', 'wd', 'nb', 'b', 'lb'
  batsmanId: number;
  batsmanName: string;
  bowlerName: string;
  wicket?: LocalWicket | null;
  angle?: number | null;
}

export interface LocalWicket {
  playerId: number;
  playerName: string;
  modeOfDismissal: components['schemas']['ModesOfDismissalV1'];
  bowler: string;
  fielder: string;
  description: string;
  notOutPlayerId: number;
  notOutPlayerName: string;
  nextManInId: number;
  batsmenCrossed: boolean;
}

// ---------------------------------------------------------------------------
// Opposition ball-by-ball types
// ---------------------------------------------------------------------------

export interface KnownBatsman {
  name: string;
  position: number;
  state: 'Batting' | 'Out' | 'Waiting';
}

export interface LocalOppositionBall {
  amount: number;
  thing: string; // '', 'wd', 'nb', 'b', 'lb', 'p'
  batsmanName: string;
  bowlerPlayerId: number;
  wicket?: LocalOppositionWicket | null;
}

export interface LocalOppositionWicket {
  batsmanName: string;
  bowlerPlayerId: number;
  fielderPlayerId?: number | null;
  modeOfDismissal: string;
  description?: string | null;
}

export const OPP_DISMISSAL_MODES: {
  code: string;
  label: string;
  value: string;
  hasFielder: boolean;
  isCandB: boolean;
}[] = [
  { code: 'b',   label: 'Bowled',          value: 'bowled',       hasFielder: false, isCandB: false },
  { code: 'ct',  label: 'Caught',          value: 'caught',       hasFielder: true,  isCandB: false },
  { code: 'cb',  label: 'Caught & Bowled', value: 'c&b',          hasFielder: true,  isCandB: true  },
  { code: 'lbw', label: 'LBW',             value: 'lbw',          hasFielder: false, isCandB: false },
  { code: 'st',  label: 'Stumped',         value: 'stumped',      hasFielder: true,  isCandB: false },
  { code: 'ro',  label: 'Run Out',         value: 'run out',      hasFielder: true,  isCandB: false },
  { code: 'hw',  label: 'Hit Wicket',      value: 'hit wicket',   hasFielder: false, isCandB: false },
  { code: 'rt',  label: 'Retired',         value: 'retired',      hasFielder: false, isCandB: false },
  { code: 'rh',  label: 'Retired Hurt',    value: 'retired hurt', hasFielder: false, isCandB: false },
];

// ---------------------------------------------------------------------------
// Dismissal mode lookup table
// ---------------------------------------------------------------------------

export const DISMISSAL_MODES: {
  code: string;
  label: string;
  value: components['schemas']['ModesOfDismissalV1'];
  hasFielder: boolean;
  hasRuns: boolean;
  hasCrossed: boolean;
}[] = [
  { code: 'b',   label: 'Bowled',          value: 'Bowled',      hasFielder: false, hasRuns: false, hasCrossed: false },
  { code: 'ct',  label: 'Caught',          value: 'Caught',      hasFielder: true,  hasRuns: false, hasCrossed: true  },
  { code: 'lbw', label: 'LBW',             value: 'LBW',         hasFielder: false, hasRuns: false, hasCrossed: false },
  { code: 'ro',  label: 'Run Out',         value: 'RunOut',      hasFielder: true,  hasRuns: true,  hasCrossed: false },
  { code: 'st',  label: 'Stumped',         value: 'Stumped',     hasFielder: true,  hasRuns: false, hasCrossed: false },
  { code: 'hw',  label: 'Hit Wicket',      value: 'HitWicket',   hasFielder: false, hasRuns: false, hasCrossed: false },
  { code: 'rt',  label: 'Retired (out)',   value: 'Retired',     hasFielder: false, hasRuns: false, hasCrossed: false },
  { code: 'rh',  label: 'Retired Hurt',    value: 'RetiredHurt', hasFielder: false, hasRuns: false, hasCrossed: false },
];

