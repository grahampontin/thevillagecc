import type { PlayerStateV1 } from '../api/swaggerTypes';
import type { components } from '../api/generated/openapi';
import { getScoringArea } from './cricketUtils';
import type { LocalBall, LocalWicket, Screen } from './liveScoringTypes';

export function getBattingPlayers(players: PlayerStateV1[]): PlayerStateV1[] {
  return players.filter(p => p.state === 'Batting');
}

export function getWaitingPlayers(players: PlayerStateV1[]): PlayerStateV1[] {
  return players.filter(p => p.state === 'Waiting');
}

export function computeLiveScoreFromBalls(balls: LocalBall[]): number {
  return balls.reduce((sum, b) => sum + b.amount, 0);
}

export function computeBatsmanRunsInOver(batsmanId: number, balls: LocalBall[]): number {
  return balls
    .filter(b => b.batsmanId === batsmanId)
    .reduce((sum, b) => {
      if (b.thing === '') return sum + b.amount;
      if (b.thing === 'nb') return sum + Math.max(0, b.amount - 1);
      return sum;
    }, 0);
}

export function computeBatsmanBallsInOver(batsmanId: number, balls: LocalBall[]): number {
  return balls.filter(
    b => b.batsmanId === batsmanId && b.thing !== 'wd' && b.thing !== 'nb',
  ).length;
}

export function computeBatsmanFoursInOver(batsmanId: number, balls: LocalBall[]): number {
  return balls.filter(b => b.batsmanId === batsmanId && b.thing === '' && b.amount === 4).length;
}

export function computeBatsmanSixesInOver(batsmanId: number, balls: LocalBall[]): number {
  return balls.filter(b => b.batsmanId === batsmanId && b.thing === '' && b.amount === 6).length;
}

export function computeBowlerRunsInOver(bowlerName: string, balls: LocalBall[]): number {
  return balls
    .filter(b => b.bowlerName === bowlerName && b.thing !== 'lb' && b.thing !== 'b')
    .reduce((sum, b) => sum + b.amount, 0);
}

export function computeBowlerWicketsInOver(bowlerName: string, balls: LocalBall[]): number {
  return balls.filter(
    b => b.bowlerName === bowlerName && b.wicket != null && b.wicket.modeOfDismissal !== 'RunOut',
  ).length;
}

export function computePartnershipRunsInOver(balls: LocalBall[]): number {
  return balls.reduce((sum, b) => {
    if (b.thing === '' || b.thing === 'nb') {
      return sum + (b.thing === 'nb' ? Math.max(0, b.amount - 1) : b.amount);
    }
    return sum;
  }, 0);
}

export function computePartnershipBallsInOver(balls: LocalBall[]): number {
  return balls.filter(b => b.wicket == null).length;
}

export function isLegalDelivery(ball: LocalBall): boolean {
  return ball.thing !== 'wd' && ball.thing !== 'nb';
}

export function getOverString(lastCompletedOver: number, localBalls: LocalBall[]): string {
  const legalBalls = localBalls.filter(isLegalDelivery).length;
  return `${lastCompletedOver}.${legalBalls}`;
}

export function shouldSwitchStriker(ball: LocalBall): boolean {
  if (ball.wicket && ball.wicket.batsmenCrossed) return true;
  let shouldSwitch = ball.amount % 2 !== 0;
  if (ball.thing === 'wd' || ball.thing === 'nb') {
    shouldSwitch = !shouldSwitch;
  }
  return shouldSwitch;
}

export function formatLocalWicket(wicket: LocalWicket): string {
  const mode = wicket.modeOfDismissal;
  if (mode === 'Caught') {
    if (!wicket.fielder || wicket.fielder === wicket.bowler) {
      return `c&b ${wicket.bowler}`.trim();
    }
    return `ct. ${wicket.fielder} b. ${wicket.bowler}`.trim();
  }
  if (mode === 'Bowled') return `b. ${wicket.bowler}`.trim();
  if (mode === 'LBW') return `lbw b. ${wicket.bowler}`.trim();
  if (mode === 'Stumped') return `st. ${wicket.fielder} b. ${wicket.bowler}`.trim();
  if (mode === 'RunOut') return wicket.fielder ? `run out (${wicket.fielder})` : 'run out';
  if (mode === 'HitWicket') return 'hit wicket';
  if (mode === 'RetiredHurt') return 'retired hurt';
  if (mode === 'Retired') return 'retired';
  return 'out';
}

export function getLocalBallDescription(ball: LocalBall): string {
  const area = ball.angle != null ? getScoringArea(ball.angle) : null;
  if (ball.thing === '') {
    if (ball.amount === 0) return 'Dot ball';
    if (ball.amount === 4) return area ? `FOUR through ${area}` : 'FOUR!';
    if (ball.amount === 6) return area ? `SIX! over ${area}` : 'SIX!';
    if (ball.amount === 1) return area ? `Single to ${area}` : '1 run';
    return area ? `${ball.amount} runs to ${area}` : `${ball.amount} run${ball.amount !== 1 ? 's' : ''}`;
  }
  if (ball.thing === 'wd') return ball.amount > 1 ? `${ball.amount} wides` : 'Wide';
  if (ball.thing === 'nb') return ball.amount > 1 ? `No ball + ${ball.amount - 1} run${ball.amount - 1 !== 1 ? 's' : ''}` : 'No ball';
  if (ball.thing === 'b') return ball.amount > 0 ? `${ball.amount} bye${ball.amount !== 1 ? 's' : ''}` : 'Bye';
  if (ball.thing === 'lb') return ball.amount > 0 ? `${ball.amount} leg bye${ball.amount !== 1 ? 's' : ''}` : 'Leg bye';
  return `${ball.amount} ${ball.thing}`;
}

export function getBallLabel(ball: LocalBall): { label: string; className: string } {
  if (ball.wicket) return { label: 'W', className: 'bg-red-600 text-white' };
  if (ball.thing === 'wd') return { label: ball.amount > 1 ? `${ball.amount}Wd` : 'Wd', className: 'bg-yellow-400 text-gray-800' };
  if (ball.thing === 'nb') return { label: ball.amount > 1 ? `${ball.amount}Nb` : 'Nb', className: 'bg-yellow-400 text-gray-800' };
  if (ball.thing === 'b') return { label: ball.amount > 1 ? `${ball.amount}B` : 'B', className: 'bg-yellow-400 text-gray-800' };
  if (ball.thing === 'lb') return { label: ball.amount > 1 ? `${ball.amount}Lb` : 'Lb', className: 'bg-yellow-400 text-gray-800' };
  if (ball.amount === 0) return { label: '·', className: 'bg-gray-300 text-gray-600' };
  if (ball.amount === 4) return { label: '4', className: 'bg-blue-500 text-white' };
  if (ball.amount === 6) return { label: '6', className: 'bg-orange-500 text-white' };
  return { label: String(ball.amount), className: 'bg-gray-200 text-gray-700' };
}

export function getNextStateScreen(nextState: string | null | undefined): Screen {
  switch (nextState) {
    case 'BattingOver': return 'newOver';
    case 'BowlingOver': return 'oppositionScoring';
    case 'OppositionBattingOver': return 'oppositionBallByBall';
    case 'EndOfBattingInnings': return 'endInnings';
    case 'EndOfBowlingInnings': return 'endInnings';
    case 'EndOfMatch': return 'endMatch';
    case 'SelectTeam': return 'selectTeam';
    // MatchConditions also goes to selectTeam first
    case 'MatchConditions': return 'selectTeam';
    default: return 'chooseMatch';
  }
}

export function formatWicketV1(wicket: components['schemas']['WicketV1']): string {
  const mode = wicket.modeOfDismissal;
  if (mode === 'CaughtAndBowled') return `c&b ${wicket.bowler ?? ''}`.trim();
  if (mode === 'Caught') {
    if (!wicket.fielder || wicket.fielder === wicket.bowler) return `c&b ${wicket.bowler ?? ''}`.trim();
    return `ct. ${wicket.fielder} b. ${wicket.bowler ?? ''}`.trim();
  }
  if (mode === 'Bowled') return `b. ${wicket.bowler ?? ''}`.trim();
  if (mode === 'LBW') return `lbw b. ${wicket.bowler ?? ''}`.trim();
  if (mode === 'Stumped') return `st. ${wicket.fielder ?? ''} b. ${wicket.bowler ?? ''}`.trim();
  if (mode === 'RunOut') return wicket.fielder ? `run out (${wicket.fielder})` : 'run out';
  if (mode === 'HitWicket') return 'hit wicket';
  if (mode === 'RetiredHurt') return 'retired hurt';
  if (mode === 'Retired') return 'retired';
  return 'out';
}

export function recomputeOverState(
  startPlayers: PlayerStateV1[],
  startStrikerId: number | null,
  balls: LocalBall[],
): { players: PlayerStateV1[]; onStrikeBatsmanId: number | null } {
  let players = startPlayers.map(p => ({ ...p }));
  let strikerId = startStrikerId;

  for (const ball of balls) {
    if (ball.wicket) {
      const maxPos = Math.max(...players.map(pp => pp.position ?? 0), 0);
      players = players.map(p => {
        if (p.playerId === ball.wicket!.playerId) return { ...p, state: 'Out' };
        if (p.playerId === ball.wicket!.nextManInId && ball.wicket!.nextManInId > 0)
          return { ...p, state: 'Batting', position: maxPos + 1 };
        return p;
      });
    }

    if (shouldSwitchStriker(ball)) {
      if (ball.wicket && ball.wicket.nextManInId > 0 && strikerId === ball.wicket.playerId) {
        strikerId = ball.wicket.nextManInId;
      } else if (!ball.wicket) {
        const battingNow = players.filter(p => p.state === 'Batting');
        const other = battingNow.find(p => p.playerId !== strikerId);
        if (other) strikerId = other.playerId ?? null;
      }
    } else if (ball.wicket) {
      if (strikerId === ball.wicket.playerId && ball.wicket.nextManInId > 0) {
        strikerId = ball.wicket.nextManInId;
      }
    }
  }

  return { players, onStrikeBatsmanId: strikerId };
}

