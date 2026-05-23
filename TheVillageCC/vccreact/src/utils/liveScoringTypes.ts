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

