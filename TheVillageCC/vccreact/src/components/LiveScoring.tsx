import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  getLiveScoringMatches,
  getLiveScoringMatchState,
  startLiveScoringMatch,
  submitOver,
  submitOppositionScore,
  endInnings,
} from '../api/liveScoringApi';
import { getAllPlayers } from '../api/playersApi';
import {
  MatchStateV1,
  PlayerStateV1,
  PlayerV1,
  LiveScoringMatchSummaryV1,
  BallByBallMatchDescriptorV1,
} from '../api/swaggerTypes';
import type { components } from '../api/generated/openapi';
import { getScoringArea } from '../utils/cricketUtils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Screen =
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

interface LocalBall {
  amount: number;
  thing: string; // '', 'wd', 'nb', 'b', 'lb'
  batsmanId: number;
  batsmanName: string;
  bowlerName: string;
  wicket?: LocalWicket | null;
  angle?: number | null;
}

interface LocalWicket {
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

// Dismissal mode mapping: short code → ModesOfDismissalV1
const DISMISSAL_MODES: { code: string; label: string; value: components['schemas']['ModesOfDismissalV1']; hasFielder: boolean; hasRuns: boolean; hasCrossed: boolean }[] = [
  { code: 'b',   label: 'Bowled',          value: 'Bowled',      hasFielder: false, hasRuns: false, hasCrossed: false },
  { code: 'ct',  label: 'Caught',          value: 'Caught',      hasFielder: true,  hasRuns: false, hasCrossed: true  },
  { code: 'lbw', label: 'LBW',             value: 'LBW',         hasFielder: false, hasRuns: false, hasCrossed: false },
  { code: 'ro',  label: 'Run Out',         value: 'RunOut',      hasFielder: true,  hasRuns: true,  hasCrossed: false },
  { code: 'st',  label: 'Stumped',         value: 'Stumped',     hasFielder: true,  hasRuns: false, hasCrossed: false },
  { code: 'hw',  label: 'Hit Wicket',      value: 'HitWicket',   hasFielder: false, hasRuns: false, hasCrossed: false },
  { code: 'rt',  label: 'Retired (out)',   value: 'Retired',     hasFielder: false, hasRuns: false, hasCrossed: false },
  { code: 'rh',  label: 'Retired Hurt',   value: 'RetiredHurt', hasFielder: false, hasRuns: false, hasCrossed: false },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBattingPlayers(players: PlayerStateV1[]): PlayerStateV1[] {
  return players.filter(p => p.state === 'Batting');
}

function getWaitingPlayers(players: PlayerStateV1[]): PlayerStateV1[] {
  return players.filter(p => p.state === 'Waiting');
}

function computeLiveScoreFromBalls(balls: LocalBall[]): number {
  return balls.reduce((sum, b) => sum + b.amount, 0);
}

function computeBatsmanRunsInOver(batsmanId: number, balls: LocalBall[]): number {
  return balls
    .filter(b => b.batsmanId === batsmanId)
    .reduce((sum, b) => {
      if (b.thing === '') return sum + b.amount;
      if (b.thing === 'nb') return sum + Math.max(0, b.amount - 1);
      return sum;
    }, 0);
}

function computeBatsmanBallsInOver(batsmanId: number, balls: LocalBall[]): number {
  return balls.filter(
    b => b.batsmanId === batsmanId && b.thing !== 'wd' && b.thing !== 'nb',
  ).length;
}

function computeBatsmanFoursInOver(batsmanId: number, balls: LocalBall[]): number {
  return balls.filter(b => b.batsmanId === batsmanId && b.thing === '' && b.amount === 4).length;
}

function computeBatsmanSixesInOver(batsmanId: number, balls: LocalBall[]): number {
  return balls.filter(b => b.batsmanId === batsmanId && b.thing === '' && b.amount === 6).length;
}

function computeBowlerRunsInOver(bowlerName: string, balls: LocalBall[]): number {
  return balls
    .filter(b => b.bowlerName === bowlerName && b.thing !== 'lb' && b.thing !== 'b')
    .reduce((sum, b) => sum + b.amount, 0);
}

function computeBowlerWicketsInOver(bowlerName: string, balls: LocalBall[]): number {
  return balls.filter(
    b => b.bowlerName === bowlerName && b.wicket != null && b.wicket.modeOfDismissal !== 'RunOut',
  ).length;
}

function computePartnershipRunsInOver(balls: LocalBall[]): number {
  return balls.reduce((sum, b) => {
    if (b.thing === '' || b.thing === 'nb') {
      return sum + (b.thing === 'nb' ? Math.max(0, b.amount - 1) : b.amount);
    }
    return sum;
  }, 0);
}

function computePartnershipBallsInOver(balls: LocalBall[]): number {
  return balls.filter(b => b.wicket == null).length;
}

function isLegalDelivery(ball: LocalBall): boolean {
  return ball.thing !== 'wd' && ball.thing !== 'nb';
}

function getOverString(lastCompletedOver: number, localBalls: LocalBall[]): string {
  const legalBalls = localBalls.filter(isLegalDelivery).length;
  return `${lastCompletedOver}.${legalBalls}`;
}

function shouldSwitchStriker(ball: LocalBall): boolean {
  if (ball.wicket && ball.wicket.batsmenCrossed) return true;
  let shouldSwitch = ball.amount % 2 !== 0;
  if (ball.thing === 'wd' || ball.thing === 'nb') {
    shouldSwitch = !shouldSwitch;
  }
  return shouldSwitch;
}

function getBallLabel(ball: LocalBall): { label: string; className: string } {
  if (ball.wicket) return { label: 'W', className: 'bg-red-600 text-white' };
  if (ball.thing === 'wd') return { label: 'Wd', className: 'bg-yellow-400 text-gray-800' };
  if (ball.thing === 'nb') return { label: 'Nb', className: 'bg-yellow-400 text-gray-800' };
  if (ball.thing === 'b' || ball.thing === 'lb') return { label: String(ball.amount), className: 'bg-gray-200 text-gray-600' };
  if (ball.amount === 0) return { label: '·', className: 'bg-gray-300 text-gray-600' };
  if (ball.amount === 4) return { label: '4', className: 'bg-blue-500 text-white' };
  if (ball.amount === 6) return { label: '6', className: 'bg-orange-500 text-white' };
  return { label: String(ball.amount), className: 'bg-gray-200 text-gray-700' };
}

function getNextStateScreen(nextState: string | null | undefined): Screen {
  switch (nextState) {
    case 'BattingOver': return 'newOver';
    case 'BowlingOver': return 'oppositionScoring';
    case 'EndOfBattingInnings': return 'endInnings';
    case 'EndOfBowlingInnings': return 'endInnings';
    case 'EndOfMatch': return 'endMatch';
    case 'SelectTeam': return 'selectTeam';
    // MatchConditions also goes to selectTeam first: the flow is selectTeam → matchConditions.
    // handleSelectTeamDone advances from selectTeam to matchConditions once 11 players are chosen.
    case 'MatchConditions': return 'selectTeam';
    default: return 'chooseMatch';
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface NavBarProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ title, onBack, rightContent }) => (
  <div className="flex items-center px-4 py-3 bg-villageGreen text-white shadow-sm flex-shrink-0">
    {onBack ? (
      <button
        onClick={onBack}
        className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Back"
      >
        <span className="material-symbols-outlined text-xl leading-none">arrow_back</span>
      </button>
    ) : (
      <div className="w-8 mr-3" />
    )}
    <h1 className="flex-1 text-base font-semibold truncate">{title}</h1>
    {rightContent && <div className="ml-2 flex items-center gap-2">{rightContent}</div>}
  </div>
);

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => (
  <div className="fixed bottom-4 left-4 right-4 z-50 bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-lg mx-auto">
    <span className="material-symbols-outlined flex-shrink-0">error</span>
    <p className="flex-1 text-sm">{message}</p>
    <button onClick={onClose} aria-label="Close" className="flex-shrink-0 hover:opacity-80">
      <span className="material-symbols-outlined">close</span>
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Wagon Wheel Input
// ---------------------------------------------------------------------------
/**
 * Computes the boundary intersection point of a ray from (sx, sy) in the
 * direction defined by `angle` (0=up, clockwise) with the given ellipse.
 */
function getBoundaryPoint(
  sx: number, sy: number,
  angle: number,
  cx: number, cy: number,
  rx: number, ry: number,
): { x: number; y: number } {
  const dirX = Math.sin(angle);
  const dirY = -Math.cos(angle);
  const dsx = sx - cx;
  const dsy = sy - cy;
  const a = dirX * dirX / (rx * rx) + dirY * dirY / (ry * ry);
  const b = 2 * (dsx * dirX / (rx * rx) + dsy * dirY / (ry * ry));
  const c = dsx * dsx / (rx * rx) + dsy * dsy / (ry * ry) - 1;
  const disc = b * b - 4 * a * c;
  // disc < 0 means the stumps are outside the ellipse, which should not happen
  // in normal use. Fallback: project a point in the given direction using rx as distance.
  if (disc < 0) return { x: sx + dirX * rx, y: sy + dirY * ry };
  const t = (-b + Math.sqrt(disc)) / (2 * a);
  return { x: sx + t * dirX, y: sy + t * dirY };
}

interface WagonWheelInputProps {
  batsmanName: string;
  amount: number;
  isLeftHanded?: boolean;
  onConfirm: (angle: number | null) => void;
}

const WagonWheelInput: React.FC<WagonWheelInputProps> = ({ batsmanName, amount, isLeftHanded, onConfirm }) => {
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [lineEnd, setLineEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const stumpsX = 150;
  const stumpsY = 100;
  const ellipseCx = 150;
  const ellipseCy = 120;
  const ellipseRx = 135;
  const ellipseRy = 110;
  const isBoundaryShot = amount >= 4;

  const computeAngleAndEnd = (clientX: number, clientY: number): { angle: number; end: { x: number; y: number } } | null => {
    if (!svgRef.current) return null;
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return null;
    const cursorPoint = pt.matrixTransform(ctm.inverse());
    const dx = cursorPoint.x - stumpsX;
    const dy = cursorPoint.y - stumpsY;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;
    if (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
    const end = isBoundaryShot
      ? getBoundaryPoint(stumpsX, stumpsY, angle, ellipseCx, ellipseCy, ellipseRx, ellipseRy)
      : cursorPoint;
    return { angle, end };
  };

  const applyPoint = (clientX: number, clientY: number) => {
    const result = computeAngleAndEnd(clientX, clientY);
    if (!result) return;
    setSelectedAngle(result.angle);
    setLineEnd(result.end);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    applyPoint(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    applyPoint(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      applyPoint(e.clientX, e.clientY);
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    applyPoint(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    applyPoint(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    applyPoint(touch.clientX, touch.clientY);
  };

  const ballColor = amount >= 6 ? '#ff0000' : amount >= 4 ? '#0000ff' : '#2196f3';

  const shotDescription = selectedAngle !== null ? (() => {
    // Mirror angle for left-handed batsman before computing zone
    const zoneAngle = isLeftHanded
      ? (2 * Math.PI - selectedAngle) % (2 * Math.PI)
      : selectedAngle;
    const area = getScoringArea(zoneAngle);
    if (amount >= 6) return `6 over ${area}`;
    if (amount >= 4) return `4 through ${area}`;
    if (amount === 1) return `Single to ${area}`;
    return `${amount} to ${area}`;
  })() : null;

  // Off side is left for right-handers, right for left-handers
  const offSideX = isLeftHanded ? 220 : 80;
  const legSideX = isLeftHanded ? 80 : 220;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-800">{batsmanName}</p>
        <p className="text-xs text-gray-500">
          {amount} {amount === 1 ? 'run' : 'runs'} — drag the field to mark the shot
        </p>
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 300 260"
        className="w-full max-w-xs"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none', cursor: 'crosshair' }}
        data-testid="wagon-wheel-input"
      >
        {/* Field boundary */}
        <ellipse cx={ellipseCx} cy={ellipseCy} rx={ellipseRx} ry={ellipseRy} fill="#4a8f3f" />
        {/* 30-yard circle */}
        <ellipse cx={ellipseCx} cy={ellipseCy} rx={67} ry={55}
          fill="#3a7f2f" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
        {/* Pitch */}
        <rect x={stumpsX - 6} y={stumpsY - 35} width={12} height={70} fill="#c8a96e" rx="2" />
        {/* Off / Leg labels */}
        <text x={offSideX} y={126} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">Off</text>
        <text x={offSideX} y={139} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">Side</text>
        <text x={legSideX} y={126} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">Leg</text>
        <text x={legSideX} y={139} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">Side</text>
        {/* Shot line */}
        {lineEnd && (
          <line
            x1={stumpsX} y1={stumpsY}
            x2={lineEnd.x} y2={lineEnd.y}
            stroke={ballColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
        {/* Stumps marker */}
        <circle cx={stumpsX} cy={stumpsY} r={5} fill="white" />
        <line x1={stumpsX - 5} y1={stumpsY + 35} x2={stumpsX + 5} y2={stumpsY + 35}
          stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      </svg>
      {shotDescription && (
        <p className="text-sm font-semibold text-gray-800 text-center" data-testid="shot-description">
          {shotDescription}
        </p>
      )}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => onConfirm(null)}
          className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
        >
          Skip
        </button>
        <button
          onClick={() => onConfirm(selectedAngle)}
          disabled={selectedAngle === null}
          className="flex-1 py-2 bg-villageGreen text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Done
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const LiveScoring: React.FC = () => {
  // Screen state
  const [screen, setScreen] = useState<Screen>('chooseMatch');

  // Match & server state
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [matchState, setMatchState] = useState<MatchStateV1 | null>(null);

  // Local scoring state (current over in progress)
  const [localBalls, setLocalBalls] = useState<LocalBall[]>([]);
  const [currentBowler, setCurrentBowler] = useState<string>('');
  const [localOnStrikeBatsmanId, setLocalOnStrikeBatsmanId] = useState<number | null>(null);
  const [localPlayers, setLocalPlayers] = useState<PlayerStateV1[]>([]);
  // Whether the last ball needs ball-type clarification (pulsing in F7)
  const [waitingForBallType, setWaitingForBallType] = useState(false);
  // Whether to show 5+ alternatives (5, 7, 8)
  const [showFivePlus, setShowFivePlus] = useState(false);
  // Whether to show the wagon wheel shot-location overlay
  const [showWagonWheel, setShowWagonWheel] = useState(false);

  // Choose match screen
  const [matchesList, setMatchesList] = useState<LiveScoringMatchSummaryV1[]>([]);

  // Select team screen
  const [allPlayers, setAllPlayers] = useState<PlayerV1[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  // Match conditions screen
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [keeperId, setKeeperId] = useState<number | null>(null);
  const [matchFormat, setMatchFormat] = useState<string>('');
  const [numberOfOvers, setNumberOfOvers] = useState<string>('');
  const [tossWinner, setTossWinner] = useState<string>('');
  const [tossDecision, setTossDecision] = useState<string>('');

  // New over screen
  const [selectedBowler, setSelectedBowler] = useState<string>('');
  const [newBowlerInput, setNewBowlerInput] = useState<string>('');
  const [showNewBowlerInput, setShowNewBowlerInput] = useState(false);
  const [strikerBatsmanId, setStrikerBatsmanId] = useState<number | null>(null);
  const [nonStrikerBatsmanId, setNonStrikerBatsmanId] = useState<number | null>(null);
  const [showBatsmanSelects, setShowBatsmanSelects] = useState(false);

  // Wicket screen
  const [wicketBatterOutId, setWicketBatterOutId] = useState<number | null>(null);
  const [wicketDismissalCode, setWicketDismissalCode] = useState<string>('');
  const [wicketFielder, setWicketFielder] = useState<string>('');
  const [wicketRuns, setWicketRuns] = useState<string>('0');
  const [wicketRunsType, setWicketRunsType] = useState<string>('');
  const [wicketNextBatterInId, setWicketNextBatterInId] = useState<number>(-1);
  const [wicketBatsmenCrossed, setWicketBatsmenCrossed] = useState<boolean>(false);
  const [wicketCommentary, setWicketCommentary] = useState<string>('');

  // End over screen
  const [endOverCommentary, setEndOverCommentary] = useState<string>('');

  // End innings screen
  const [inningsDeclared, setInningsDeclared] = useState<boolean>(false);
  const [endInningsCommentary, setEndInningsCommentary] = useState<string>('');
  const [endInningsType, setEndInningsType] = useState<string>('batting');

  // Opposition scoring screen
  const [oppScore, setOppScore] = useState<string>('');
  const [oppOvers, setOppOvers] = useState<string>('');
  const [oppWickets, setOppWickets] = useState<string>('');
  const [oppCommentary, setOppCommentary] = useState<string>('');

  // Loading / error state
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Toast helper
  // ---------------------------------------------------------------------------

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  }, []);

  // ---------------------------------------------------------------------------
  // Navigate to next state
  // ---------------------------------------------------------------------------

  const navigateToNextState = useCallback((state: MatchStateV1) => {
    const nextScreen = getNextStateScreen(state.nextState);
    if (nextScreen === 'newOver') {
      // Pre-fill bowler if available
      setSelectedBowler('');
      setNewBowlerInput('');
      setShowNewBowlerInput(false);
      const batters = (state.players ?? []).filter(p => p.state === 'Batting');
      setShowBatsmanSelects(batters.length === 0);
      setStrikerBatsmanId(null);
      setNonStrikerBatsmanId(null);
    }
    if (nextScreen === 'endInnings') {
      // Determine innings type from nextState
      const type = state.nextState === 'EndOfBattingInnings' ? 'batting' : 'bowling';
      setEndInningsType(type);
      setInningsDeclared(false);
      setEndInningsCommentary('');
    }
    if (nextScreen === 'oppositionScoring') {
      setOppScore('');
      setOppOvers('');
      setOppWickets('');
      setOppCommentary('');
    }
    setScreen(nextScreen);
  }, []);

  // ---------------------------------------------------------------------------
  // Load match state and sync local player state
  // ---------------------------------------------------------------------------

  const applyMatchState = useCallback((state: MatchStateV1) => {
    setMatchState(state);
    setLocalPlayers(state.players ?? []);
    setLocalOnStrikeBatsmanId(state.onStrikeBatsmanId ?? null);
    setLocalBalls([]);
    setWaitingForBallType(false);
    setShowFivePlus(false);
    setShowWagonWheel(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Choose Match screen handlers
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (screen !== 'chooseMatch') return;
    setIsLoading(true);
    getLiveScoringMatches()
      .then(setMatchesList)
      .catch(err => showToast(err instanceof Error ? err.message : 'Failed to load matches'))
      .finally(() => setIsLoading(false));
  }, [screen, showToast]);

  const handleChooseMatch = useCallback(
    async (matchId: number) => {
      setIsLoading(true);
      try {
        const state = await getLiveScoringMatchState(matchId);
        setSelectedMatchId(matchId);
        applyMatchState(state);
        navigateToNextState(state);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Failed to load match');
      } finally {
        setIsLoading(false);
      }
    },
    [applyMatchState, navigateToNextState, showToast],
  );

  // ---------------------------------------------------------------------------
  // Select Team screen handlers
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (screen !== 'selectTeam') return;
    setIsLoading(true);
    getAllPlayers()
      .then(setAllPlayers)
      .catch(err => showToast(err instanceof Error ? err.message : 'Failed to load players'))
      .finally(() => setIsLoading(false));
  }, [screen, showToast]);

  const handleTogglePlayer = useCallback((playerId: number) => {
    setSelectedPlayerIds(prev => {
      if (prev.includes(playerId)) return prev.filter(id => id !== playerId);
      return [...prev, playerId];
    });
  }, []);

  const handleSelectTeamDone = useCallback(() => {
    if (selectedPlayerIds.length !== 11) {
      showToast(`Please select exactly 11 players (${selectedPlayerIds.length} selected)`);
      return;
    }
    setCaptainId(null);
    setKeeperId(null);
    setMatchFormat('');
    setNumberOfOvers('');
    setTossWinner('');
    setTossDecision('');
    setScreen('matchConditions');
  }, [selectedPlayerIds, showToast]);

  // ---------------------------------------------------------------------------
  // Match Conditions screen handlers
  // ---------------------------------------------------------------------------

  const selectedPlayers = allPlayers.filter(p => selectedPlayerIds.includes(p.playerId!));

  const isMatchConditionsValid = useCallback((): boolean => {
    if (!captainId) { showToast('Every team needs a captain.'); return false; }
    if (!keeperId) { showToast('Not having a wicket keeper seems pretty village, even for us.'); return false; }
    if (!matchFormat) { showToast("What kind of a game is this? It's not a test match..."); return false; }
    if (matchFormat === 'Limited Overs') {
      const n = parseInt(numberOfOvers, 10);
      if (isNaN(n) || n <= 0) {
        showToast('How many overs is this game? It should be a whole number, obviously.');
        return false;
      }
    }
    if (!tossWinner) { showToast('Who won the toss?'); return false; }
    if (!tossDecision) { showToast('Always bat first. Unless... well, just pick something.'); return false; }
    return true;
  }, [captainId, keeperId, matchFormat, numberOfOvers, tossWinner, tossDecision, showToast]);

  const handleMatchConditionsDone = useCallback(async () => {
    if (!isMatchConditionsValid()) return;
    if (!selectedMatchId) return;
    const overs = matchFormat === 'Limited Overs' ? parseInt(numberOfOvers, 10) : 0;
    const payload = {
      captain: captainId!,
      keeper: keeperId!,
      wonToss: tossWinner === 'We',
      batted: tossDecision === 'Bat',
      declaration: matchFormat === 'Declaration',
      overs: overs || 0,
      playerIds: selectedPlayerIds,
    };
    setIsLoading(true);
    try {
      const state = await startLiveScoringMatch(selectedMatchId, payload);
      applyMatchState(state);
      navigateToNextState(state);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to start match');
    } finally {
      setIsLoading(false);
    }
  }, [
    isMatchConditionsValid, selectedMatchId, captainId, keeperId, tossWinner, tossDecision,
    matchFormat, numberOfOvers, selectedPlayerIds, applyMatchState, navigateToNextState, showToast,
  ]);

  // ---------------------------------------------------------------------------
  // New Over screen handlers
  // ---------------------------------------------------------------------------

  const isNewOverValid = useCallback((): string | null => {
    if (!selectedBowler) return 'Who is bowling this over?';
    if (matchState && selectedBowler === matchState.previousBowler) {
      return `${selectedBowler} bowled the last over. You're not really allowed to bowl two in a row...`;
    }
    if (showBatsmanSelects) {
      if (!strikerBatsmanId) return 'We need two batsmen before we can start.';
      if (!nonStrikerBatsmanId) return 'We need two batsmen before we can start.';
      if (strikerBatsmanId === nonStrikerBatsmanId) return 'It would be swell if we had a different batsman at each end.';
    }
    return null;
  }, [selectedBowler, matchState, showBatsmanSelects, strikerBatsmanId, nonStrikerBatsmanId]);

  const handleAddNewBowler = useCallback(() => {
    const name = newBowlerInput.trim();
    if (!name) { showToast("That isn't a name now is it?"); return; }
    if ((matchState?.bowlers ?? []).includes(name)) {
      showToast(`The bowler ${name} already exists.`);
      return;
    }
    setMatchState(prev => prev ? { ...prev, bowlers: [...(prev.bowlers ?? []), name] } : prev);
    setSelectedBowler(name);
    setNewBowlerInput('');
    setShowNewBowlerInput(false);
  }, [newBowlerInput, matchState, showToast]);

  const handleNewOverDone = useCallback(() => {
    const error = isNewOverValid();
    if (error) { showToast(error); return; }

    const newPlayers = [...(matchState?.players ?? []).map(p => ({ ...p }))];
    if (showBatsmanSelects && strikerBatsmanId && nonStrikerBatsmanId) {
      let pos = 1;
      newPlayers.forEach(p => {
        if (p.playerId === strikerBatsmanId) { p.state = 'Batting'; p.position = pos++; }
        else if (p.playerId === nonStrikerBatsmanId) { p.state = 'Batting'; p.position = pos++; }
      });
      setLocalOnStrikeBatsmanId(strikerBatsmanId);
    }
    setLocalPlayers(newPlayers);
    setCurrentBowler(selectedBowler);
    setLocalBalls([]);
    setWaitingForBallType(false);
    setShowFivePlus(false);
    setShowWagonWheel(false);
    setScreen('scoring');
  }, [isNewOverValid, showToast, matchState, showBatsmanSelects, strikerBatsmanId, nonStrikerBatsmanId, selectedBowler]);

  // ---------------------------------------------------------------------------
  // Scoring screen handlers
  // ---------------------------------------------------------------------------

  const addBall = useCallback((amount: number, thing: string, wicket?: LocalWicket | null) => {
    const strikerId = localOnStrikeBatsmanId ?? matchState?.onStrikeBatsmanId ?? -1;
    const strikerPlayer = localPlayers.find(p => p.playerId === strikerId);
    const ball: LocalBall = {
      amount,
      thing,
      batsmanId: strikerId,
      batsmanName: strikerPlayer?.playerName ?? '',
      bowlerName: currentBowler,
      wicket: wicket ?? null,
    };

    setLocalBalls(prev => {
      const next = [...prev, ball];
      return next;
    });

    // Handle wicket player state changes
    if (wicket) {
      setLocalPlayers(prev => {
        const updated = prev.map(p => {
          if (p.playerId === wicket.playerId) return { ...p, state: 'Out' };
          if (p.playerId === wicket.nextManInId && wicket.nextManInId > 0) {
            const maxPos = Math.max(...prev.map(pp => pp.position ?? 0), 0);
            return { ...p, state: 'Batting', position: maxPos + 1 };
          }
          return p;
        });
        return updated;
      });
    }

    // Switch on-strike batsman
    if (shouldSwitchStriker(ball)) {
      if (wicket && wicket.nextManInId > 0 && localOnStrikeBatsmanId === wicket.playerId) {
        setLocalOnStrikeBatsmanId(wicket.nextManInId);
      } else if (!wicket) {
        const battingPlayers = localPlayers.filter(p => p.state === 'Batting');
        if (battingPlayers.length >= 2) {
          const striker = battingPlayers.find(p => p.playerId === strikerId);
          const other = battingPlayers.find(p => p.playerId !== strikerId);
          if (striker && other) {
            setLocalOnStrikeBatsmanId(other.playerId ?? null);
          }
        }
      }
    } else if (wicket) {
      // Wicket, batsmen didn't cross: if dismissed batter was not on strike, no switch needed
      // If the on-strike batsman was dismissed and batsmen didn't cross, next batter is on strike
      if (localOnStrikeBatsmanId === wicket.playerId && wicket.nextManInId > 0) {
        setLocalOnStrikeBatsmanId(wicket.nextManInId);
      }
    }
  }, [localOnStrikeBatsmanId, localPlayers, currentBowler, matchState]);

  const handleRunsButton = useCallback((amount: number) => {
    if (waitingForBallType) {
      showToast('What was the last ball? Runs? Extras?');
      return;
    }
    addBall(amount, '');
    if (amount > 0) {
      setWaitingForBallType(true);
      setShowFivePlus(false);
    }
  }, [waitingForBallType, addBall, showToast]);

  const handleExtrasButton = useCallback((extraType: string) => {
    if (localBalls.length === 0) { showToast('Add a ball first'); return; }
    const lastBall = localBalls[localBalls.length - 1];
    if (lastBall.amount === 0) { showToast("Doesn't make sense to have no extras.."); return; }
    const updatedBall: LocalBall = { ...lastBall, thing: extraType };
    // If the extra was a wide or no-ball, re-evaluate striker switch
    setLocalBalls(prev => [...prev.slice(0, -1), updatedBall]);

    // Re-evaluate striker after extra type change
    const originalShouldSwitch = shouldSwitchStriker(lastBall);
    const newShouldSwitch = shouldSwitchStriker(updatedBall);
    if (originalShouldSwitch !== newShouldSwitch) {
      const battingPlayers = localPlayers.filter(p => p.state === 'Batting');
      if (battingPlayers.length >= 2) {
        const currentStriker = localOnStrikeBatsmanId;
        const other = battingPlayers.find(p => p.playerId !== currentStriker);
        const original = battingPlayers.find(p => p.playerId === currentStriker);
        if (other && original) {
          setLocalOnStrikeBatsmanId(newShouldSwitch ? (other.playerId ?? null) : (original.playerId ?? null));
        }
      }
    }

    setWaitingForBallType(false);
    setShowFivePlus(false);
  }, [localBalls, localPlayers, localOnStrikeBatsmanId, showToast]);

  const handleRunsConfirmed = useCallback(() => {
    setWaitingForBallType(false);
    setShowFivePlus(false);
    // Show wagon wheel to record shot location for confirmed run shots (not extras)
    const lastBall = localBalls[localBalls.length - 1];
    if (lastBall && lastBall.amount > 0 && lastBall.thing === '') {
      setShowWagonWheel(true);
    }
  }, [localBalls]);

  const handleWagonWheelSet = useCallback((angle: number | null) => {
    setShowWagonWheel(false);
    if (angle !== null) {
      setLocalBalls(prev => {
        if (prev.length === 0) return prev;
        return [...prev.slice(0, -1), { ...prev[prev.length - 1], angle }];
      });
    }
  }, []);

  const handleUndo = useCallback(() => {
    setLocalBalls(prev => {
      if (prev.length === 0) return prev;
      const removedBall = prev[prev.length - 1];
      const next = prev.slice(0, -1);

      // Undo player state changes from wicket
      if (removedBall.wicket) {
        setLocalPlayers(players => players.map(p => {
          if (p.playerId === removedBall.wicket!.playerId) return { ...p, state: 'Batting' };
          if (p.playerId === removedBall.wicket!.nextManInId) return { ...p, state: 'Waiting' };
          return p;
        }));
        setLocalOnStrikeBatsmanId(removedBall.batsmanId);
      } else if (shouldSwitchStriker(removedBall)) {
        // Undo striker switch
        setLocalPlayers(prev2 => {
          const batters = prev2.filter(p => p.state === 'Batting');
          if (batters.length >= 2) {
            const currentStriker = localOnStrikeBatsmanId;
            const other = batters.find(p => p.playerId !== currentStriker);
            if (other) setLocalOnStrikeBatsmanId(other.playerId ?? null);
          }
          return prev2;
        });
      }

      return next;
    });
    setWaitingForBallType(false);
    setShowFivePlus(false);
  }, [localOnStrikeBatsmanId]);

  const handleWicketButton = useCallback(() => {
    if (waitingForBallType) {
      showToast('What was the last ball? Runs? Extras?');
      return;
    }
    const battingPlayers = localPlayers.filter(p => p.state === 'Batting');
    if (battingPlayers.length < 1) { showToast('No batsmen at the crease'); return; }
    const striker = battingPlayers.find(p => p.playerId === localOnStrikeBatsmanId) ?? battingPlayers[0];
    setWicketBatterOutId(striker.playerId ?? null);
    setWicketDismissalCode('');
    setWicketFielder('');
    setWicketRuns('0');
    setWicketRunsType('');
    const waitingPlayers = getWaitingPlayers(localPlayers);
    setWicketNextBatterInId(waitingPlayers.length > 0 ? (waitingPlayers[0].playerId ?? -1) : -1);
    setWicketBatsmenCrossed(false);
    setWicketCommentary('');
    setScreen('wicket');
  }, [waitingForBallType, localPlayers, localOnStrikeBatsmanId, showToast]);

  const handleEndOverButton = useCallback(() => {
    if (waitingForBallType) {
      showToast('What was the last ball? Runs? Extras?');
      return;
    }
    setEndOverCommentary('');
    setScreen('endOver');
  }, [waitingForBallType, showToast]);

  const handleSwitchStriker = useCallback((playerId: number) => {
    if (playerId === localOnStrikeBatsmanId) return;
    setLocalOnStrikeBatsmanId(playerId);
  }, [localOnStrikeBatsmanId]);

  const handleChangeBowler = useCallback(() => {
    if (matchState) {
      setMatchState(prev => prev ? { ...prev, previousBowlerButOne: prev.previousBowler } : prev);
    }
    setSelectedBowler('');
    setShowNewBowlerInput(false);
    setNewBowlerInput('');
    setShowBatsmanSelects(false);
    setScreen('newOver');
  }, [matchState]);

  // ---------------------------------------------------------------------------
  // Wicket screen handlers
  // ---------------------------------------------------------------------------

  const selectedDismissalMode = DISMISSAL_MODES.find(m => m.code === wicketDismissalCode);

  const isWicketValid = useCallback((): string | null => {
    if (!wicketDismissalCode) return 'What happened to the poor chap?';
    const waitingPlayers = getWaitingPlayers(localPlayers);
    if (wicketNextBatterInId === -1 && waitingPlayers.length > 0) return "Who's next in?";
    return null;
  }, [wicketDismissalCode, localPlayers, wicketNextBatterInId]);

  const handleWicketConfirm = useCallback(() => {
    const error = isWicketValid();
    if (error) { showToast(error); return; }

    const dismissalMode = DISMISSAL_MODES.find(m => m.code === wicketDismissalCode);
    if (!dismissalMode) return;

    const batterOut = localPlayers.find(p => p.playerId === wicketBatterOutId);
    const notOutBatters = localPlayers.filter(p => p.state === 'Batting' && p.playerId !== wicketBatterOutId);
    const notOutPlayer = notOutBatters[0];

    const runsForBall = parseInt(wicketRuns, 10) || 0;
    const runType = runsForBall > 0 ? wicketRunsType : '';

    const wicket: LocalWicket = {
      playerId: wicketBatterOutId!,
      playerName: batterOut?.playerName ?? '',
      modeOfDismissal: dismissalMode.value,
      bowler: currentBowler,
      fielder: wicketFielder,
      description: wicketCommentary,
      notOutPlayerId: notOutPlayer?.playerId ?? -1,
      notOutPlayerName: notOutPlayer?.playerName ?? '',
      nextManInId: wicketNextBatterInId,
      batsmenCrossed: wicketBatsmenCrossed,
    };

    addBall(runsForBall, runType, wicket);
    setScreen('scoring');
  }, [
    isWicketValid, showToast, localPlayers, wicketBatterOutId, wicketDismissalCode,
    wicketFielder, wicketRuns, wicketRunsType, wicketCommentary, wicketNextBatterInId,
    wicketBatsmenCrossed, currentBowler, addBall,
  ]);

  // ---------------------------------------------------------------------------
  // End Over screen handlers
  // ---------------------------------------------------------------------------

  const handleEndOverConfirm = useCallback(async () => {
    if (!selectedMatchId || !matchState) return;
    const legalBalls = localBalls.filter(isLegalDelivery).length;
    if (legalBalls === 0) {
      showToast('No legal deliveries recorded for this over.');
      return;
    }

    // Build MatchStateUpdateV1 payload
    const overBalls = localBalls.map((b, i) => ({
      ballNumber: i + 1,
      amount: b.amount,
      batsman: b.batsmanId,
      batsmanName: b.batsmanName,
      bowler: b.bowlerName,
      thing: b.thing,
      angle: b.angle ?? undefined,
      wicket: b.wicket
        ? {
            player: b.wicket.playerId,
            playerName: b.wicket.playerName,
            modeOfDismissal: b.wicket.modeOfDismissal,
            bowler: b.wicket.bowler,
            fielder: b.wicket.fielder,
            description: b.wicket.description,
          }
        : undefined,
    }));

    const overScore = localBalls.reduce((s, b) => s + b.amount, 0);
    const overWickets = localBalls.filter(b => b.wicket != null).length;

    const payload = {
      matchId: selectedMatchId,
      lastCompletedOver: matchState.lastCompletedOver ?? 0,
      onStrikeBatsmanId: localOnStrikeBatsmanId ?? matchState.onStrikeBatsmanId ?? 0,
      over: {
        overNumber: (matchState.lastCompletedOver ?? 0) + 1,
        bowler: currentBowler,
        runsConceded: overScore,
        wicketsTaken: overWickets,
        balls: overBalls,
        commentary: endOverCommentary,
      },
      players: localPlayers,
      score: matchState.score ?? 0,
      bowlers: matchState.bowlers ?? [],
      previousBowler: matchState.previousBowler ?? '',
      previousBowlerButOne: matchState.previousBowlerButOne ?? '',
      partnership: matchState.partnership,
      oppositionScore: matchState.oppositionScore,
      oppositionWickets: matchState.oppositionWickets,
      oppositionName: matchState.oppositionName,
      oppositionShortName: matchState.oppositionShortName,
      bowlerDetails: matchState.bowlerDetails,
    };

    setIsLoading(true);
    try {
      const newState = await submitOver(selectedMatchId, payload);
      applyMatchState(newState);
      navigateToNextState(newState);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to submit over');
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedMatchId, matchState, localBalls, localOnStrikeBatsmanId, currentBowler,
    endOverCommentary, localPlayers, applyMatchState, navigateToNextState, showToast,
  ]);

  // ---------------------------------------------------------------------------
  // End Innings screen handlers
  // ---------------------------------------------------------------------------

  const handleEndInningsConfirm = useCallback(async () => {
    if (!selectedMatchId) return;
    const payload = {
      inningsType: endInningsType,
      wasDeclared: inningsDeclared,
      commentary: endInningsCommentary,
    };
    setIsLoading(true);
    try {
      const newState = await endInnings(selectedMatchId, payload);
      applyMatchState(newState);
      navigateToNextState(newState);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to end innings');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMatchId, endInningsType, inningsDeclared, endInningsCommentary, applyMatchState, navigateToNextState, showToast]);

  // ---------------------------------------------------------------------------
  // Opposition Scoring screen handlers
  // ---------------------------------------------------------------------------

  const isOppositionScoringValid = useCallback((): string | null => {
    const overs = parseInt(oppOvers, 10);
    if (isNaN(overs) || overs <= 0) return 'You should have more than zero overs';
    const score = parseInt(oppScore, 10);
    if (isNaN(score)) return 'The score should be a number, e.g. 0, 10 or something.';
    if (score < 0) return 'The score cannot be negative, noone is that bad';
    const wickets = oppWickets === '' ? 0 : parseInt(oppWickets, 10);
    if (isNaN(wickets) || wickets < 0) return "You can't have negative wickets, that's just not right.";
    if (wickets > 10) return 'More than ten wickets down probably means the end of the innings.';
    return null;
  }, [oppOvers, oppScore, oppWickets]);

  const handleOppositionScoringConfirm = useCallback(async () => {
    const error = isOppositionScoringValid();
    if (error) { showToast(error); return; }
    if (!selectedMatchId) return;

    const payload = {
      over: parseInt(oppOvers, 10),
      score: parseInt(oppScore, 10),
      wickets: oppWickets === '' ? 0 : parseInt(oppWickets, 10),
      commentary: oppCommentary,
    };

    setIsLoading(true);
    try {
      const newState = await submitOppositionScore(selectedMatchId, payload);
      applyMatchState(newState);
      navigateToNextState(newState);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to submit opposition score');
    } finally {
      setIsLoading(false);
    }
  }, [
    isOppositionScoringValid, showToast, selectedMatchId, oppOvers, oppScore, oppWickets,
    oppCommentary, applyMatchState, navigateToNextState,
  ]);

  // ---------------------------------------------------------------------------
  // Computed values for scoring screen
  // ---------------------------------------------------------------------------

  const battingPlayers = getBattingPlayers(localPlayers);
  const strikerId = localOnStrikeBatsmanId ?? matchState?.onStrikeBatsmanId ?? -1;
  const striker = battingPlayers.find(p => p.playerId === strikerId) ?? battingPlayers[0];
  const nonStriker = battingPlayers.find(p => p.playerId !== strikerId) ?? battingPlayers[1];

  const getLiveBatsmanRuns = (player: PlayerStateV1 | undefined) => {
    if (!player) return 0;
    return (player.currentScore ?? 0) + computeBatsmanRunsInOver(player.playerId!, localBalls);
  };
  const getLiveBatsmanBalls = (player: PlayerStateV1 | undefined) => {
    if (!player) return 0;
    return (player.ballsFaced ?? 0) + computeBatsmanBallsInOver(player.playerId!, localBalls);
  };
  const getLiveBatsmanFours = (player: PlayerStateV1 | undefined) => {
    if (!player) return 0;
    return (player.fours ?? 0) + computeBatsmanFoursInOver(player.playerId!, localBalls);
  };
  const getLiveBatsmanSixes = (player: PlayerStateV1 | undefined) => {
    if (!player) return 0;
    return (player.sixes ?? 0) + computeBatsmanSixesInOver(player.playerId!, localBalls);
  };
  const getLiveBatsmanSR = (player: PlayerStateV1 | undefined) => {
    if (!player) return 0;
    const balls = getLiveBatsmanBalls(player);
    if (balls === 0) return 0;
    return Math.round((getLiveBatsmanRuns(player) / balls) * 1000) / 10;
  };

  const currentBowlerDetails = (matchState?.bowlerDetails ?? []).find(d => d.name === currentBowler);
  const liveOverScore = computeLiveScoreFromBalls(localBalls);
  const liveTotalScore = (matchState?.score ?? 0) + liveOverScore;
  const liveWickets = localPlayers.filter(p => p.state === 'Out').length;
  const liveOversString = getOverString(matchState?.lastCompletedOver ?? 0, localBalls);

  const partnershipFoursInOver = localBalls.filter(b => b.thing === '' && b.amount === 4).length;
  const partnershipSixesInOver = localBalls.filter(b => b.thing === '' && b.amount === 6).length;
  const partnershipRuns = (matchState?.partnership?.runs ?? 0) + computePartnershipRunsInOver(localBalls);
  const partnershipBalls = (matchState?.partnership?.balls ?? 0) + computePartnershipBallsInOver(localBalls);
  const partnershipFours = (matchState?.partnership?.fours ?? 0) + partnershipFoursInOver;
  const partnershipSixes = (matchState?.partnership?.sixes ?? 0) + partnershipSixesInOver;

  // ---------------------------------------------------------------------------
  // Rendered screens
  // ---------------------------------------------------------------------------

  const renderLoadingOverlay = () =>
    isLoading ? (
      <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-villageGreen border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-villageGreen font-medium">Loading...</span>
        </div>
      </div>
    ) : null;

  // ---- Choose Match ----
  const renderChooseMatch = () => {
    const inProgress = matchesList.filter(
      m => m.ballByBall?.batOrBowl && m.ballByBall.batOrBowl !== '',
    );
    const upcoming = matchesList.filter(
      m => !m.ballByBall?.batOrBowl || m.ballByBall.batOrBowl === '',
    );

    return (
      <div className="flex flex-col h-full">
        <NavBar title="Live Scoring" />
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
          {renderLoadingOverlay()}
          <div className="max-w-lg mx-auto p-4 space-y-4">
            {inProgress.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">In Progress</h2>
                <div className="space-y-2">
                  {inProgress.map(m => {
                    const bd = m.ballByBall as BallByBallMatchDescriptorV1;
                    const matchId = m.match?.id ?? bd.matchId;
                    return (
                      <button
                        key={matchId}
                        onClick={() => handleChooseMatch(matchId!)}
                        className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-left flex items-center justify-between hover:border-villageGreen hover:shadow-md transition-all"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            vs {bd.opponent ?? m.match?.opposition?.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">{bd.overs ?? 0} overs</p>
                        </div>
                        <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {bd.batOrBowl}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Upcoming</h2>
                <div className="space-y-2">
                  {upcoming.map(m => {
                    const bd = m.ballByBall as BallByBallMatchDescriptorV1;
                    const matchId = m.match?.id ?? bd?.matchId;
                    return (
                      <button
                        key={matchId}
                        onClick={() => handleChooseMatch(matchId!)}
                        className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-left flex items-center justify-between hover:border-villageGreen hover:shadow-md transition-all"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            vs {bd?.opponent ?? m.match?.opposition?.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {bd?.dateString ?? m.match?.date}
                          </p>
                        </div>
                        <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">New</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
            {!isLoading && matchesList.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <span className="material-symbols-outlined text-4xl">sports_cricket</span>
                <p className="mt-2">No matches available for scoring</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---- Select Team ----
  const renderSelectTeam = () => {
    const count = selectedPlayerIds.length;
    const isDone = count === 11;
    return (
      <div className="flex flex-col h-full">
        <NavBar
          title="Select Team"
          onBack={() => setScreen('chooseMatch')}
          rightContent={
            isDone ? (
              <button
                onClick={handleSelectTeamDone}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Done"
              >
                <span className="material-symbols-outlined text-xl leading-none">done</span>
              </button>
            ) : (
              <span className="text-sm font-medium">{count}/11</span>
            )
          }
        />
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
          {renderLoadingOverlay()}
          <div className="max-w-lg mx-auto p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Players</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {allPlayers.map((player, i) => {
                const isSelected = selectedPlayerIds.includes(player.playerId!);
                return (
                  <label
                    key={player.playerId}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
                      i < allPlayers.length - 1 ? 'border-b border-gray-100' : ''
                    } ${isSelected ? 'bg-villageGreenLight' : 'hover:bg-gray-50'}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTogglePlayer(player.playerId!)}
                      className="w-4 h-4 accent-villageGreen"
                    />
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      {player.name}
                    </span>
                    <span className="text-xs text-gray-400">{player.matches} matches</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---- Match Conditions ----
  const renderMatchConditions = () => {
    const isComplete = !!(captainId && keeperId && matchFormat &&
      (matchFormat !== 'Limited Overs' || numberOfOvers) && tossWinner && tossDecision);
    return (
      <div className="flex flex-col h-full">
        <NavBar
          title="Match Conditions"
          onBack={() => setScreen('selectTeam')}
          rightContent={
            isComplete ? (
              <button
                onClick={handleMatchConditionsDone}
                disabled={isLoading}
                className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
                aria-label="Done"
              >
                <span className="material-symbols-outlined text-xl leading-none">done</span>
              </button>
            ) : (
              <span className="material-symbols-outlined text-red-400 text-xl leading-none">block</span>
            )
          }
        />
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
          {renderLoadingOverlay()}
          <div className="max-w-lg mx-auto p-4 space-y-5">
            {/* Players */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Players</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                  <label className="w-28 text-sm text-gray-600 flex-shrink-0">Captain</label>
                  <select
                    value={captainId ?? ''}
                    onChange={e => setCaptainId(e.target.value ? Number(e.target.value) : null)}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                  >
                    <option value="">Select...</option>
                    {selectedPlayers.map(p => (
                      <option key={p.playerId} value={p.playerId!}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center px-4 py-3">
                  <label className="w-28 text-sm text-gray-600 flex-shrink-0">Wicket Keeper</label>
                  <select
                    value={keeperId ?? ''}
                    onChange={e => setKeeperId(e.target.value ? Number(e.target.value) : null)}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                  >
                    <option value="">Select...</option>
                    {selectedPlayers.map(p => (
                      <option key={p.playerId} value={p.playerId!}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Match Format */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Match Format</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                  <label className="w-28 text-sm text-gray-600 flex-shrink-0">Format</label>
                  <select
                    value={matchFormat}
                    onChange={e => setMatchFormat(e.target.value)}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Limited Overs">Limited Overs</option>
                    <option value="Declaration">Declaration</option>
                  </select>
                </div>
                {matchFormat === 'Limited Overs' && (
                  <div className="flex items-center px-4 py-3">
                    <label className="w-28 text-sm text-gray-600 flex-shrink-0">Overs</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="e.g. 40"
                      value={numberOfOvers}
                      onChange={e => setNumberOfOvers(e.target.value)}
                      className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* The Toss */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">The Toss</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                  <label className="w-28 text-sm text-gray-600 flex-shrink-0">Winner</label>
                  <select
                    value={tossWinner}
                    onChange={e => setTossWinner(e.target.value)}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="We">We</option>
                    <option value="They">They</option>
                  </select>
                </div>
                <div className="flex items-center px-4 py-3">
                  <label className="w-28 text-sm text-gray-600 flex-shrink-0">Decided to</label>
                  <select
                    value={tossDecision}
                    onChange={e => setTossDecision(e.target.value)}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Bat">Bat</option>
                    <option value="Bowl">Bowl</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  // ---- New Over ----
  const renderNewOver = () => {
    const isFirstOver = localPlayers.filter(p => p.state === 'Batting').length === 0;
    const bowlers = matchState?.bowlers ?? [];
    const validationError = isNewOverValid();

    return (
      <div className="flex flex-col h-full">
        <NavBar
          title="Over Details"
          rightContent={
            !validationError ? (
              <button
                onClick={handleNewOverDone}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Done"
              >
                <span className="material-symbols-outlined text-xl leading-none">done</span>
              </button>
            ) : (
              <span className="material-symbols-outlined text-red-400 text-xl leading-none">block</span>
            )
          }
        />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-lg mx-auto p-4 space-y-4">
            {/* Bowler selection */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bowler</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {bowlers.map((bowler, i) => (
                  <label
                    key={bowler}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
                      i < bowlers.length - 1 ? 'border-b border-gray-100' : ''
                    } ${selectedBowler === bowler ? 'bg-villageGreenLight' : 'hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name="bowler-radio"
                      checked={selectedBowler === bowler}
                      onChange={() => setSelectedBowler(bowler)}
                      className="w-4 h-4 accent-villageGreen"
                    />
                    <span className="flex-1 text-sm font-medium text-gray-900">{bowler}</span>
                    {matchState?.previousBowler === bowler && (
                      <span className="text-xs text-gray-400">Last over</span>
                    )}
                  </label>
                ))}
              </div>
              {showNewBowlerInput ? (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Bowler name"
                    value={newBowlerInput}
                    onChange={e => setNewBowlerInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-villageGreen"
                    onKeyDown={e => e.key === 'Enter' && handleAddNewBowler()}
                  />
                  <button
                    onClick={handleAddNewBowler}
                    className="bg-villageGreen text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowNewBowlerInput(false); setNewBowlerInput(''); }}
                    className="text-gray-500 px-3 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewBowlerInput(true)}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium text-villageGreen hover:bg-villageGreenLight transition-colors"
                >
                  <span className="material-symbols-outlined text-lg leading-none">person_add</span>
                  New Bowler
                </button>
              )}
            </section>

            {/* Batsmen selection (first over only) */}
            {isFirstOver && (
              <section>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Batsmen</h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center px-4 py-3 border-b border-gray-100">
                    <label className="w-24 text-sm text-gray-600 flex-shrink-0">Striker</label>
                    <select
                      value={strikerBatsmanId ?? ''}
                      onChange={e => setStrikerBatsmanId(e.target.value ? Number(e.target.value) : null)}
                      className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                    >
                      <option value="">Select...</option>
                      {localPlayers.filter(p => p.state === 'Waiting').map(p => (
                        <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center px-4 py-3">
                    <label className="w-24 text-sm text-gray-600 flex-shrink-0">Non-Striker</label>
                    <select
                      value={nonStrikerBatsmanId ?? ''}
                      onChange={e => setNonStrikerBatsmanId(e.target.value ? Number(e.target.value) : null)}
                      className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                    >
                      <option value="">Select...</option>
                      {localPlayers.filter(p => p.state === 'Waiting').map(p => (
                        <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---- Scoring ----
  const renderScoring = () => {
    const oppName = matchState?.oppositionName ?? 'Opposition';
    const oppAbbrev = matchState?.oppositionShortName ?? 'OPP';
    const oppScore2 = matchState?.oppositionScore ?? 0;
    const oppWicketsVal = matchState?.oppositionWickets ?? 0;

    const bowlerOvers = currentBowlerDetails?.details?.overs ?? 0;
    const bowlerMaidens = currentBowlerDetails?.details?.maidens ?? 0;
    const bowlerRuns = (currentBowlerDetails?.details?.runs ?? 0) + computeBowlerRunsInOver(currentBowler, localBalls);
    const bowlerWickets = (currentBowlerDetails?.details?.wickets ?? 0) + computeBowlerWicketsInOver(currentBowler, localBalls);
    const localLegalBalls = localBalls.filter(isLegalDelivery).length;
    const bowlerOversDisplay = `${bowlerOvers}.${localLegalBalls}`;

    return (
      <div className="flex flex-col h-full relative">
        {/* Bottom share toolbar equivalent */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="w-8" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Scoring</span>
          <button
            className="p-1 hover:text-villageGreen transition-colors"
            onClick={() => {
              if (selectedMatchId) {
                const url = `${window.location.origin}/scorecard/${selectedMatchId}`;
                navigator.clipboard.writeText(url).then(() => showToast('Link copied to clipboard'));
              }
            }}
            aria-label="Share"
          >
            <span className="material-symbols-outlined text-xl leading-none text-gray-500">share</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {/* Team scores */}
          <div className="border-b border-gray-200 px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src="/images/vcc_cricle_small.png" alt="VCC" className="w-full h-full object-cover" />
              </div>
              <span className="flex-1 text-sm font-semibold text-gray-900">The Village CC</span>
              <span className="text-sm font-bold text-gray-900">
                {liveTotalScore}/{liveWickets}
                <span className="text-xs font-normal text-gray-500 ml-1">({liveOversString} ovs)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{oppAbbrev.slice(0, 3)}</span>
              </div>
              <span className="flex-1 text-sm font-medium text-gray-700">{oppName}</span>
              <span className="text-sm font-medium text-gray-700">
                {oppScore2}/{oppWicketsVal}
              </span>
            </div>
          </div>

          {/* Batting / Bowling table */}
          <div className="overflow-x-auto border-b border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="text-left py-1.5 px-3 font-medium">Batters</th>
                  <th className="text-right py-1.5 px-1 font-medium">R</th>
                  <th className="text-right py-1.5 px-1 font-medium">B</th>
                  <th className="text-right py-1.5 px-1 font-medium">4s</th>
                  <th className="text-right py-1.5 px-1 font-medium">6s</th>
                  <th className="text-right py-1.5 px-2 font-medium">SR</th>
                </tr>
              </thead>
              <tbody>
                {[striker, nonStriker].map((player, idx) => {
                  if (!player) return null;
                  const isOnStrike = player.playerId === strikerId;
                  return (
                    <tr
                      key={player.playerId ?? idx}
                      className="border-b border-gray-50 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSwitchStriker(player.playerId!)}
                    >
                      <td className="py-1.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {isOnStrike ? (
                            <span className="material-symbols-outlined text-sm leading-none text-villageGreen">
                              sports_cricket
                            </span>
                          ) : (
                            <span className="w-4" />
                          )}
                          <span className="font-medium text-gray-900 truncate max-w-[120px]">
                            {player.playerName ?? '[missing]'}
                          </span>
                        </div>
                      </td>
                      <td className="py-1.5 px-1 text-right font-semibold">{getLiveBatsmanRuns(player)}</td>
                      <td className="py-1.5 px-1 text-right text-gray-600">{getLiveBatsmanBalls(player)}</td>
                      <td className="py-1.5 px-1 text-right text-gray-600">{getLiveBatsmanFours(player)}</td>
                      <td className="py-1.5 px-1 text-right text-gray-600">{getLiveBatsmanSixes(player)}</td>
                      <td className="py-1.5 px-2 text-right text-gray-600">{getLiveBatsmanSR(player)}</td>
                    </tr>
                  );
                })}
                {/* Partnership row */}
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm leading-none text-gray-400">group</span>
                      <span className="text-gray-500 font-normal">Partnership</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-1 text-right text-gray-500">{partnershipRuns}</td>
                  <td className="py-1.5 px-1 text-right text-gray-500">{partnershipBalls}</td>
                  <td className="py-1.5 px-1 text-right text-gray-500">{partnershipFours}</td>
                  <td className="py-1.5 px-1 text-right text-gray-500">{partnershipSixes}</td>
                  <td className="py-1.5 px-2 text-right" />
                </tr>
                {/* Bowler section */}
                <tr className="border-b border-gray-50 bg-gray-50">
                  <th className="text-left py-1.5 px-3 font-medium text-gray-500 text-xs" colSpan={1}>Bowler</th>
                  <th className="text-right py-1.5 px-1 font-medium text-gray-500 text-xs">O</th>
                  <th className="text-right py-1.5 px-1 font-medium text-gray-500 text-xs">M</th>
                  <th className="text-right py-1.5 px-1 font-medium text-gray-500 text-xs">R</th>
                  <th className="text-right py-1.5 px-1 font-medium text-gray-500 text-xs">W</th>
                  <th className="text-right py-1.5 px-2" />
                </tr>
                <tr>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm leading-none text-gray-500">sports_baseball</span>
                      <span className="font-medium text-gray-900 truncate max-w-[120px]">{currentBowler || '[none]'}</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-1 text-right text-gray-600">{bowlerOversDisplay}</td>
                  <td className="py-1.5 px-1 text-right text-gray-600">{bowlerMaidens}</td>
                  <td className="py-1.5 px-1 text-right text-gray-600">{bowlerRuns}</td>
                  <td className="py-1.5 px-1 text-right text-gray-600">{bowlerWickets}</td>
                  <td className="py-1.5 px-2 text-right">
                    <button onClick={handleChangeBowler} className="text-gray-400 hover:text-villageGreen transition-colors">
                      <span className="material-symbols-outlined text-base leading-none">edit</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Current over balls */}
          <div className="border-b border-gray-200 px-3 py-2 flex gap-2 overflow-x-auto min-h-[52px] items-center">
            {localBalls.length === 0 ? (
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-xs">·</span>
              </div>
            ) : (
              localBalls.map((ball, i) => {
                const { label, className } = getBallLabel(ball);
                return (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${className}`}
                  >
                    {label}
                  </div>
                );
              })
            )}
          </div>

          {/* Run buttons */}
          <div className="p-3 space-y-2">
            {/* Row 1: 0, 1/5, 2/7, 3/8, undo */}
            <div className="grid grid-cols-5 gap-2">
              <RunCircleButton
                value={0}
                label={<span className="material-symbols-outlined text-lg leading-none">brightness_1</span>}
                onClick={() => handleRunsButton(0)}
                variant="outline"
              />
              {!showFivePlus ? (
                <RunCircleButton value={1} label="1" onClick={() => handleRunsButton(1)} variant="outline"
                  highlight={waitingForBallType} />
              ) : (
                <RunCircleButton value={5} label="5" onClick={() => handleRunsButton(5)} variant="outline"
                  highlight={waitingForBallType} />
              )}
              {!showFivePlus ? (
                <RunCircleButton value={2} label="2" onClick={() => handleRunsButton(2)} variant="outline"
                  highlight={waitingForBallType} />
              ) : (
                <RunCircleButton value={7} label="7" onClick={() => handleRunsButton(7)} variant="outline"
                  highlight={waitingForBallType} />
              )}
              {!showFivePlus ? (
                <RunCircleButton value={3} label="3" onClick={() => handleRunsButton(3)} variant="outline"
                  highlight={waitingForBallType} />
              ) : (
                <RunCircleButton value={8} label="8" onClick={() => handleRunsButton(8)} variant="outline"
                  highlight={waitingForBallType} />
              )}
              <RunCircleButton
                value={-1}
                label={<span className="material-symbols-outlined text-lg leading-none">undo</span>}
                onClick={handleUndo}
                variant="fill"
              />
            </div>

            {/* Row 2: 4, 6, 5+/reset, Runs, End Over */}
            <div className="grid grid-cols-5 gap-2">
              <RunCircleButton value={4} label="4" onClick={() => handleRunsButton(4)} variant="outline"
                highlight={waitingForBallType} />
              <RunCircleButton value={6} label="6" onClick={() => handleRunsButton(6)} variant="outline"
                highlight={waitingForBallType} />
              {!showFivePlus ? (
                <RunCircleButton
                  value={-2}
                  label="5+"
                  onClick={() => { setShowFivePlus(true); }}
                  variant="outline"
                />
              ) : (
                <RunCircleButton
                  value={-2}
                  label={<span className="material-symbols-outlined text-base leading-none">replay</span>}
                  onClick={() => setShowFivePlus(false)}
                  variant="outline"
                />
              )}
              <RunCircleButton
                value={-3}
                label="Runs"
                onClick={handleRunsConfirmed}
                variant="fill-blue"
                disabled={!waitingForBallType}
              />
              <RunCircleButton
                value={-4}
                label={<span className="material-symbols-outlined text-lg leading-none">done</span>}
                onClick={handleEndOverButton}
                variant="fill"
              />
            </div>

            {/* Row 3: Wide, No Ball, Bye, Leg Bye, OUT! */}
            <div className="grid grid-cols-5 gap-2">
              <ExtrasCircleButton
                label="Wide"
                onClick={() => handleExtrasButton('wd')}
                highlight={waitingForBallType}
              />
              <ExtrasCircleButton
                label="No Ball"
                onClick={() => handleExtrasButton('nb')}
                highlight={waitingForBallType}
              />
              <ExtrasCircleButton
                label="Bye"
                onClick={() => handleExtrasButton('b')}
                highlight={waitingForBallType}
              />
              <ExtrasCircleButton
                label="Leg Bye"
                onClick={() => handleExtrasButton('lb')}
                highlight={waitingForBallType}
              />
              <button
                onClick={handleWicketButton}
                className="aspect-square rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center hover:bg-red-700 active:scale-95 transition-all shadow-sm"
              >
                OUT!
              </button>
            </div>
          </div>
        </div>

        {/* Wagon Wheel Overlay */}
        {showWagonWheel && (() => {
          const lastBall = localBalls[localBalls.length - 1];
          const batsmanPlayer = allPlayers.find(p => p.playerId === lastBall?.batsmanId);
          const isLeftHanded = batsmanPlayer?.isRightHandBat === false;
          return (
            <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-sm p-4 shadow-xl">
                <h2 className="text-sm font-semibold text-gray-700 text-center mb-3 uppercase tracking-wide">
                  Shot Location
                </h2>
                <WagonWheelInput
                  batsmanName={lastBall?.batsmanName ?? ''}
                  amount={lastBall?.amount ?? 0}
                  isLeftHanded={isLeftHanded}
                  onConfirm={handleWagonWheelSet}
                />
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  // ---- Wicket ----
  const renderWicket = () => {
    const battingPlayersForWicket = localPlayers.filter(p => p.state === 'Batting');
    const waitingPlayersForWicket = getWaitingPlayers(localPlayers);
    const wicketError = isWicketValid();

    return (
      <div className="flex flex-col h-full">
        <NavBar
          title="Wicket!"
          onBack={() => setScreen('scoring')}
          rightContent={
            !wicketError ? (
              <button
                onClick={handleWicketConfirm}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Done"
              >
                <span className="material-symbols-outlined text-xl leading-none">done</span>
              </button>
            ) : (
              <span className="material-symbols-outlined text-red-400 text-xl leading-none">block</span>
            )
          }
        />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-lg mx-auto p-4">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-0">
              {/* Batsman out */}
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">Batsman out</label>
                <select
                  value={wicketBatterOutId ?? ''}
                  onChange={e => setWicketBatterOutId(e.target.value ? Number(e.target.value) : null)}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                >
                  {battingPlayersForWicket.map(p => (
                    <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
                  ))}
                </select>
              </div>

              {/* Dismissal type */}
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">Dismissal</label>
                <select
                  value={wicketDismissalCode}
                  onChange={e => setWicketDismissalCode(e.target.value)}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                >
                  <option value="">Select...</option>
                  {DISMISSAL_MODES.map(m => (
                    <option key={m.code} value={m.code}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Fielder (for caught, run out, stumped) */}
              {selectedDismissalMode?.hasFielder && (
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                  <label className="w-32 text-sm text-gray-600 flex-shrink-0">Fielder</label>
                  <input
                    type="text"
                    placeholder="Add name..."
                    value={wicketFielder}
                    onChange={e => setWicketFielder(e.target.value)}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                  />
                </div>
              )}

              {/* Runs (for run out) */}
              {selectedDismissalMode?.hasRuns && (
                <>
                  <div className="flex items-center px-4 py-3 border-b border-gray-100">
                    <label className="w-32 text-sm text-gray-600 flex-shrink-0">Score for ball</label>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={wicketRuns}
                      onChange={e => setWicketRuns(e.target.value)}
                      className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                    />
                  </div>
                  {parseInt(wicketRuns, 10) > 0 && (
                    <div className="flex items-center px-4 py-3 border-b border-gray-100">
                      <label className="w-32 text-sm text-gray-600 flex-shrink-0">Runs/Extras?</label>
                      <select
                        value={wicketRunsType}
                        onChange={e => setWicketRunsType(e.target.value)}
                        className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                      >
                        <option value="">Runs</option>
                        <option value="wd">Wides</option>
                        <option value="nb">No balls</option>
                        <option value="lb">Leg byes</option>
                        <option value="b">Byes</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Batsmen crossed (for caught) */}
              {selectedDismissalMode?.hasCrossed && (
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                  <label className="w-32 text-sm text-gray-600 flex-shrink-0">Batsmen crossed?</label>
                  <select
                    value={wicketBatsmenCrossed ? 'true' : 'false'}
                    onChange={e => setWicketBatsmenCrossed(e.target.value === 'true')}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              )}

              {/* Next batsman in */}
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">Next in</label>
                <select
                  value={wicketNextBatterInId}
                  onChange={e => setWicketNextBatterInId(Number(e.target.value))}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                >
                  <option value={-1}>{waitingPlayersForWicket.length === 0 ? 'Last wicket' : 'Select...'}</option>
                  {waitingPlayersForWicket.map(p => (
                    <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
                  ))}
                </select>
              </div>

              {/* Commentary */}
              <div className="flex items-start px-4 py-3">
                <span className="material-symbols-outlined text-gray-400 text-lg mr-3 mt-0.5">comment</span>
                <textarea
                  placeholder="Ah nuts, talk us through it champ."
                  value={wicketCommentary}
                  onChange={e => setWicketCommentary(e.target.value)}
                  rows={3}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---- End Over ----
  const renderEndOver = () => (
    <div className="flex flex-col h-full">
      <NavBar
        title="End Over"
        onBack={() => setScreen('scoring')}
        rightContent={
          <button
            onClick={handleEndOverConfirm}
            disabled={isLoading}
            className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            aria-label="Done"
          >
            <span className="material-symbols-outlined text-xl leading-none">done</span>
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {renderLoadingOverlay()}
        <div className="max-w-lg mx-auto p-4 space-y-4">
          {/* Ball list */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {localBalls.map((ball, i) => {
              const legalCount = localBalls.slice(0, i + 1).filter(isLegalDelivery).length;
              const overNum = (matchState?.lastCompletedOver ?? 0) + 1;
              const ballLabel2 = isLegalDelivery(ball) ? `${overNum}.${legalCount}` : `${overNum}.${legalCount}*`;
              const { label } = getBallLabel(ball);
              return (
                <div key={i} className={`flex items-center px-4 py-3 ${i < localBalls.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="w-10 flex-shrink-0">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {ballLabel2}
                    </span>
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="text-xs text-gray-500">{ball.bowlerName} to {ball.batsmanName}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {ball.wicket ? 'OUT!' : `${label === '·' ? 'No run' : label + (ball.thing ? ` (${ball.thing})` : ' runs')}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Commentary */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Commentary</label>
            <textarea
              placeholder="Talk us through it champ..."
              value={endOverCommentary}
              onChange={e => setEndOverCommentary(e.target.value)}
              rows={4}
              className="w-full text-sm text-gray-900 outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // ---- End Innings ----
  const renderEndInnings = () => (
    <div className="flex flex-col h-full">
      <NavBar
        title="End Innings"
        rightContent={
          <button
            onClick={handleEndInningsConfirm}
            disabled={isLoading}
            className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            aria-label="Done"
          >
            <span className="material-symbols-outlined text-xl leading-none">done</span>
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {renderLoadingOverlay()}
        <div className="max-w-lg mx-auto p-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {endInningsType === 'batting' && (
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <label className="w-40 text-sm text-gray-600 flex-shrink-0">Innings Declared?</label>
                <select
                  value={inningsDeclared ? 'true' : 'false'}
                  onChange={e => setInningsDeclared(e.target.value === 'true')}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            )}
            <div className="flex items-start px-4 py-3">
              <span className="material-symbols-outlined text-gray-400 text-lg mr-3 mt-0.5">comment</span>
              <textarea
                placeholder="Channel your inner Tuffers, how would you summarize that effort?"
                value={endInningsCommentary}
                onChange={e => setEndInningsCommentary(e.target.value)}
                rows={4}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ---- Opposition Scoring ----
  const renderOppositionScoring = () => (
    <div className="flex flex-col h-full">
      <NavBar
        title="Opposition Score"
        rightContent={
          <button
            onClick={handleOppositionScoringConfirm}
            disabled={isLoading}
            className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            aria-label="Done"
          >
            <span className="material-symbols-outlined text-xl leading-none">done</span>
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {renderLoadingOverlay()}
        <div className="max-w-lg mx-auto p-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Score</label>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={oppScore}
                onChange={e => setOppScore(e.target.value)}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
              />
            </div>
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Overs</label>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={oppOvers}
                onChange={e => setOppOvers(e.target.value)}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
              />
            </div>
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Wickets down</label>
              <input
                type="number"
                min={0}
                max={10}
                placeholder="0"
                value={oppWickets}
                onChange={e => setOppWickets(e.target.value)}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
              />
            </div>
            <div className="flex items-start px-4 py-3">
              <span className="material-symbols-outlined text-gray-400 text-lg mr-3 mt-0.5">comment</span>
              <textarea
                placeholder="Lets have a little chatter for the peeps"
                value={oppCommentary}
                onChange={e => setOppCommentary(e.target.value)}
                rows={4}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ---- End Match ----
  const renderEndMatch = () => (
    <div className="flex flex-col h-full">
      <NavBar title="Game Over" />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-villageGreen mb-4">emoji_events</span>
        <h2 className="text-2xl font-bold text-villageText mb-2">Match Complete!</h2>
        <p className="text-gray-500 mb-8">Thanks for scoring. Bye!</p>
        {selectedMatchId && (
          <a
            href={`/scorecard/${selectedMatchId}`}
            className="bg-villageGreen text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            View Scorecard
          </a>
        )}
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  let content: React.ReactNode;
  switch (screen) {
    case 'chooseMatch': content = renderChooseMatch(); break;
    case 'selectTeam': content = renderSelectTeam(); break;
    case 'matchConditions': content = renderMatchConditions(); break;
    case 'newOver': content = renderNewOver(); break;
    case 'scoring': content = renderScoring(); break;
    case 'wicket': content = renderWicket(); break;
    case 'endOver': content = renderEndOver(); break;
    case 'endInnings': content = renderEndInnings(); break;
    case 'oppositionScoring': content = renderOppositionScoring(); break;
    case 'endMatch': content = renderEndMatch(); break;
    default: content = renderChooseMatch();
  }

  return (
    <div
      className="font-sans text-villageText bg-gray-50"
      style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {content}
      </div>
      {toastMessage && (
        <ErrorToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Circle button helpers
// ---------------------------------------------------------------------------

interface RunCircleButtonProps {
  value: number;
  label: React.ReactNode;
  onClick: () => void;
  variant: 'outline' | 'fill' | 'fill-blue';
  highlight?: boolean;
  disabled?: boolean;
}

const RunCircleButton: React.FC<RunCircleButtonProps> = ({
  label, onClick, variant, highlight, disabled,
}) => {
  let baseClass = 'aspect-square rounded-full flex items-center justify-center text-sm font-bold transition-all active:scale-95 shadow-sm ';
  if (disabled) {
    baseClass += 'opacity-40 cursor-not-allowed ';
  }
  if (variant === 'outline') {
    baseClass += highlight
      ? 'border-2 border-villageGreen text-villageGreen bg-villageGreenLight animate-pulse '
      : 'border-2 border-gray-400 text-gray-700 bg-white hover:border-villageGreen hover:text-villageGreen ';
  } else if (variant === 'fill-blue') {
    baseClass += 'bg-blue-600 text-white hover:bg-blue-700 ';
  } else {
    baseClass += 'bg-gray-700 text-white hover:bg-gray-800 ';
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={baseClass}
      type="button"
    >
      {label}
    </button>
  );
};

interface ExtrasCircleButtonProps {
  label: string;
  onClick: () => void;
  highlight?: boolean;
}

const ExtrasCircleButton: React.FC<ExtrasCircleButtonProps> = ({ label, onClick, highlight }) => (
  <button
    onClick={onClick}
    type="button"
    className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all active:scale-95 shadow-sm ${
      highlight
        ? 'bg-gray-600 text-white animate-pulse'
        : 'bg-gray-500 text-white hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);

export default LiveScoring;
