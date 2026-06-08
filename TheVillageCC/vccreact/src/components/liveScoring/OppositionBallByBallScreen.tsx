import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MatchStateV1 } from '../../api/swaggerTypes';
import { RunCircleButton, ExtrasCircleButton } from './CircleButtons';
import {
  KnownBatsman, LocalOppositionBall, LocalOppositionWicket, OPP_DISMISSAL_MODES,
} from '../../utils/liveScoringTypes';
import { submitOppositionOver, deleteLastOppositionOver } from '../../api/liveScoringApi';

// ---------------------------------------------------------------------------
// Extended types for new backend fields not yet in the generated schema
// ---------------------------------------------------------------------------

interface ExtMatchState extends MatchStateV1 {
  theirInningsIsBallByBall?: boolean;
  oppositionPlayers?: { batsmanName?: string; position?: number; state?: string; currentScore?: number; ballsFaced?: number; fours?: number; sixes?: number; strikeRate?: number }[] | null;
  oppositionOnStrikeBatsmanName?: string | null;
  oppositionLastCompletedOver?: number;
}

interface ExtInPlayData {
  theirInningsIsBallByBall?: boolean;
  theirLastCompletedOver?: number;
  theirOnStrikeBatsman?: OppBatterState | null;
  theirOtherBatsman?: OppBatterState | null;
  theirLiveBattingCard?: OppBatterScorecardLine[] | null;
  theirLiveBowlingCard?: OppBowlerDetails[] | null;
  theirScore?: number;
  theirWickets?: number;
  theirOver?: number;
}

interface OppBatterState {
  batsmanName?: string;
  currentScore?: number;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  strikeRate?: number;
  position?: number;
  state?: string;
}

interface OppBatterScorecardLine {
  batsmanName?: string;
  score?: number;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  strikeRate?: number;
  position?: number;
  wicket?: { modeOfDismissal?: string; bowlerPlayerId?: number; fielderPlayerId?: number | null } | null;
}

interface OppBowlerDetails {
  playerId?: number;
  playerName?: string;
  overs?: number;
  maidens?: number;
  runs?: number;
  wickets?: number;
  economy?: number;
}

// ---------------------------------------------------------------------------

function getOppBallLabel(ball: LocalOppositionBall): { label: string; className: string } {
  if (ball.wicket) return { label: 'W', className: 'bg-red-600 text-white' };
  if (ball.thing === 'wd') return { label: ball.amount > 1 ? `${ball.amount}Wd` : 'Wd', className: 'bg-yellow-400 text-gray-800' };
  if (ball.thing === 'nb') return { label: ball.amount > 1 ? `${ball.amount}Nb` : 'Nb', className: 'bg-yellow-400 text-gray-800' };
  if (ball.thing === 'b')  return { label: ball.amount > 1 ? `${ball.amount}B` : 'B',   className: 'bg-yellow-400 text-gray-800' };
  if (ball.thing === 'lb') return { label: ball.amount > 1 ? `${ball.amount}Lb` : 'Lb', className: 'bg-yellow-400 text-gray-800' };
  if (ball.amount === 0) return { label: '·', className: 'bg-gray-300 text-gray-600' };
  if (ball.amount === 4) return { label: '4', className: 'bg-blue-500 text-white' };
  if (ball.amount === 6) return { label: '6', className: 'bg-orange-500 text-white' };
  return { label: String(ball.amount), className: 'bg-gray-200 text-gray-700' };
}

function oppIsLegalDelivery(ball: LocalOppositionBall): boolean {
  return ball.thing !== 'wd' && ball.thing !== 'nb';
}

function oppShouldSwitchStriker(amount: number, thing: string): boolean {
  let shouldSwitch = amount % 2 !== 0;
  if (thing === 'wd' || thing === 'nb') shouldSwitch = !shouldSwitch;
  return shouldSwitch;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface OppositionBallByBallScreenProps {
  matchState: MatchStateV1 | null;
  selectedMatchId: number | null;
  onMatchStateUpdate: (state: MatchStateV1) => void;
  onAbandon: () => void;
  showToast: (msg: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const OppositionBallByBallScreen: React.FC<OppositionBallByBallScreenProps> = ({
  matchState, selectedMatchId, onMatchStateUpdate, onAbandon, showToast,
}) => {
  const extState = matchState as ExtMatchState | null;
  const inPlayData = matchState?.liveScorecard?.inPlayData as ExtInPlayData | undefined;

  // ---- Local scoring state ----
  const [knownBatsmen, setKnownBatsmen] = useState<KnownBatsman[]>([]);
  const [nextPosition, setNextPosition] = useState(3);
  const [onStrikeName, setOnStrikeName] = useState('');
  const [currentOverNumber, setCurrentOverNumber] = useState(1);
  const [localBalls, setLocalBalls] = useState<LocalOppositionBall[]>([]);
  const [selectedBowlerPlayerId, setSelectedBowlerPlayerId] = useState<number | null>(null);
  const [overCommentary, setOverCommentary] = useState('');
  const [waitingForBallType, setWaitingForBallType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---- Wicket form state ----
  const [showWicketForm, setShowWicketForm] = useState(false);
  const [wicketBatsmanName, setWicketBatsmanName] = useState('');
  const [wicketMode, setWicketMode] = useState('');
  const [wicketFielderId, setWicketFielderId] = useState<number | null>(null);
  const [wicketNewBatsmanName, setWicketNewBatsmanName] = useState('');
  const [wicketDescription, setWicketDescription] = useState('');
  const [wicketRuns, setWicketRuns] = useState('0');
  const [wicketRunsType, setWicketRunsType] = useState('');

  // ---- End-over panel state ----
  const [showEndOverPanel, setShowEndOverPanel] = useState(false);

  // ---- Scorecard collapse state ----
  const [battingCardOpen, setBattingCardOpen] = useState(false);
  const [bowlingCardOpen, setBowlingCardOpen] = useState(false);

  // ---- Viewport ----
  const [isWide, setIsWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [mobileTab, setMobileTab] = useState<'scoring' | 'scorecard'>('scoring');
  const isWideRef = useRef(isWide);
  isWideRef.current = isWide;

  // ---- Hydration from matchState ----
  // Re-run whenever the server's completed over count changes (after submit or undo)
  const lastCompletedOver = extState?.oppositionLastCompletedOver ?? 0;
  useEffect(() => {
    if (!extState?.theirInningsIsBallByBall) return;
    const batsmen: KnownBatsman[] = (extState.oppositionPlayers ?? []).map(p => ({
      name: p.batsmanName ?? '',
      position: p.position ?? 0,
      state: (p.state as KnownBatsman['state']) ?? 'Batting',
    })).filter(b => b.name);
    setKnownBatsmen(batsmen);
    const maxPos = batsmen.length > 0 ? Math.max(...batsmen.map(b => b.position)) : 2;
    setNextPosition(maxPos + 1);
    setOnStrikeName(extState.oppositionOnStrikeBatsmanName ?? batsmen.find(b => b.state === 'Batting')?.name ?? '');
    setCurrentOverNumber(lastCompletedOver + 1);
    setLocalBalls([]);
    setSelectedBowlerPlayerId(null);
    setOverCommentary('');
    setWaitingForBallType(false);
    setShowWicketForm(false);
    setShowEndOverPanel(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCompletedOver, matchState?.matchId]);

  // ---- Viewport listener ----
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    setIsWide(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ---- Our XI players (for bowler/fielder selection) ----
  const ourPlayers = matchState?.players ?? [];

  const selectedBowlerName = ourPlayers.find(p => p.playerId === selectedBowlerPlayerId)?.playerName ?? '';

  // ---- Active batsmen ----
  const activeBatsmen = knownBatsmen.filter(b => b.state === 'Batting');

  // ---- Ball addition logic ----
  const addBall = useCallback((amount: number, thing: string, wicket?: LocalOppositionWicket | null) => {
    const bowlerId = selectedBowlerPlayerId ?? 0;
    const ball: LocalOppositionBall = {
      amount,
      thing,
      batsmanName: onStrikeName,
      bowlerPlayerId: bowlerId,
      wicket: wicket ?? null,
    };

    setLocalBalls(prev => [...prev, ball]);

    if (wicket) {
      setKnownBatsmen(prev => prev.map(b =>
        b.name === wicket.batsmanName ? { ...b, state: 'Out' } : b,
      ));
    }

    // Striker rotation
    const shouldSwitch = oppShouldSwitchStriker(amount, thing);
    if (wicket) {
      // After wicket: new batsman in, determine who faces next
      const newBatsman = wicketNewBatsmanName.trim();
      if (newBatsman) {
        if (shouldSwitch) {
          setOnStrikeName(newBatsman);
        } else {
          // Non-striker was at the other end, stays on strike; new batter at non-striker end
          const nonStriker = activeBatsmen.find(b => b.name !== onStrikeName && b.name !== wicket.batsmanName);
          setOnStrikeName(nonStriker?.name ?? onStrikeName);
        }
      } else {
        // Last wicket
        if (!shouldSwitch) {
          const nonStriker = activeBatsmen.find(b => b.name !== onStrikeName && b.name !== wicket.batsmanName);
          if (nonStriker) setOnStrikeName(nonStriker.name);
        }
      }
    } else if (shouldSwitch) {
      const other = activeBatsmen.find(b => b.name !== onStrikeName);
      if (other) setOnStrikeName(other.name);
    }
  }, [selectedBowlerPlayerId, onStrikeName, activeBatsmen, wicketNewBatsmanName]);

  const handleRunsButton = useCallback((amount: number) => {
    if (waitingForBallType) { showToast('What was the last ball? Runs? Extras?'); return; }
    if (!selectedBowlerPlayerId) { showToast('Select a bowler first'); return; }
    addBall(amount, '');
    if (amount > 0) setWaitingForBallType(true);
  }, [waitingForBallType, selectedBowlerPlayerId, addBall, showToast]);

  const handleExtrasButton = useCallback((extraType: string) => {
    if (localBalls.length === 0) { showToast('Add a ball first'); return; }
    const lastBall = localBalls[localBalls.length - 1];
    if (lastBall.amount === 0 && extraType !== 'wd' && extraType !== 'nb') {
      showToast("Doesn't make sense to have no runs with that extra type..");
      return;
    }
    setLocalBalls(prev => [...prev.slice(0, -1), { ...prev[prev.length - 1], thing: extraType }]);
    // Re-evaluate striker rotation for the changed ball
    const updatedBall = { ...lastBall, thing: extraType };
    const wasShouldSwitch = oppShouldSwitchStriker(lastBall.amount, lastBall.thing);
    const newShouldSwitch = oppShouldSwitchStriker(updatedBall.amount, updatedBall.thing);
    if (wasShouldSwitch !== newShouldSwitch) {
      const other = activeBatsmen.find(b => b.name !== onStrikeName);
      if (other) setOnStrikeName(other.name);
    }
    setWaitingForBallType(false);
  }, [localBalls, activeBatsmen, onStrikeName, showToast]);

  const handleRunsConfirmed = useCallback(() => {
    setWaitingForBallType(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (localBalls.length === 0) return;
    const removed = localBalls[localBalls.length - 1];
    setLocalBalls(prev => prev.slice(0, -1));

    if (removed.wicket) {
      // Restore dismissed batter
      setKnownBatsmen(prev => prev
        .map(b => b.name === removed.wicket!.batsmanName ? { ...b, state: 'Batting' as const } : b)
        .filter(b => {
          // Remove the new batsman who was added for this wicket, if any
          return true; // We can't easily undo the new batsman addition, so leave them
        }),
      );
      setOnStrikeName(removed.batsmanName);
    } else if (oppShouldSwitchStriker(removed.amount, removed.thing)) {
      const other = activeBatsmen.find(b => b.name !== onStrikeName);
      if (other) setOnStrikeName(other.name);
    }
    setWaitingForBallType(false);
  }, [localBalls, activeBatsmen, onStrikeName]);

  // ---- Wicket handling ----
  const handleWicketButton = useCallback(() => {
    if (waitingForBallType) { showToast('What was the last ball? Runs? Extras?'); return; }
    if (!selectedBowlerPlayerId) { showToast('Select a bowler first'); return; }
    setWicketBatsmanName(onStrikeName);
    setWicketMode('');
    setWicketFielderId(null);
    setWicketNewBatsmanName('');
    setWicketDescription('');
    setWicketRuns('0');
    setWicketRunsType('');
    setShowWicketForm(true);
  }, [waitingForBallType, selectedBowlerPlayerId, onStrikeName, showToast]);

  const handleWicketConfirm = useCallback(() => {
    if (!wicketMode) { showToast('How was the batter out?'); return; }
    const mode = OPP_DISMISSAL_MODES.find(m => m.code === wicketMode);
    if (!mode) return;

    const isLastWicket = activeBatsmen.filter(b => b.name !== wicketBatsmanName).length === 0;
    if (!isLastWicket && !wicketNewBatsmanName.trim()) {
      showToast('Enter the next batsman\'s name');
      return;
    }

    const newBatsmanTrimmed = wicketNewBatsmanName.trim();
    const bowlerId = selectedBowlerPlayerId ?? 0;
    const fielder = mode.isCandB ? bowlerId : (mode.hasFielder ? wicketFielderId : null);

    const wicket: LocalOppositionWicket = {
      batsmanName: wicketBatsmanName,
      bowlerPlayerId: bowlerId,
      fielderPlayerId: fielder ?? null,
      modeOfDismissal: mode.value,
      description: wicketDescription || null,
    };

    const runsForBall = parseInt(wicketRuns, 10) || 0;
    const runType = runsForBall > 0 ? wicketRunsType : '';

    // Add new batsman to known list before addBall so rotation logic can use them
    if (newBatsmanTrimmed) {
      const newPos = nextPosition;
      setKnownBatsmen(prev => [...prev, { name: newBatsmanTrimmed, position: newPos, state: 'Batting' }]);
      setNextPosition(p => p + 1);
    }

    addBall(runsForBall, runType, wicket);
    setShowWicketForm(false);
  }, [
    wicketMode, wicketBatsmanName, wicketFielderId, wicketDescription, wicketRuns, wicketRunsType,
    activeBatsmen, selectedBowlerPlayerId, nextPosition, wicketNewBatsmanName, addBall, showToast,
  ]);

  // ---- Compute cumulative stats for submission payload ----
  const computePlayerStats = useCallback((batsmanName: string) => {
    const serverStats = (extState?.oppositionPlayers ?? []).find(p => p.batsmanName === batsmanName);
    const prevScore = serverStats?.currentScore ?? 0;
    const prevBalls = serverStats?.ballsFaced ?? 0;
    const prevFours = serverStats?.fours ?? 0;
    const prevSixes = serverStats?.sixes ?? 0;

    const ballsForBatsman = localBalls.filter(b => b.batsmanName === batsmanName);
    const overScore = ballsForBatsman.reduce((s, b) => {
      if (b.thing === '') return s + b.amount;
      if (b.thing === 'nb') return s + Math.max(0, b.amount - 1);
      return s;
    }, 0);
    const overBallsFaced = ballsForBatsman.filter(b => b.thing !== 'wd').length;
    const overFours = ballsForBatsman.filter(b => b.thing === '' && b.amount === 4).length;
    const overSixes = ballsForBatsman.filter(b => b.thing === '' && b.amount === 6).length;

    const totalScore = prevScore + overScore;
    const totalBalls = prevBalls + overBallsFaced;
    const batsmanRecord = knownBatsmen.find(b => b.name === batsmanName);

    return {
      batsmanName,
      position: batsmanRecord?.position ?? 0,
      state: batsmanRecord?.state ?? 'Batting',
      currentScore: totalScore,
      ballsFaced: totalBalls,
      fours: prevFours + overFours,
      sixes: prevSixes + overSixes,
      strikeRate: totalBalls > 0 ? Math.round((totalScore / totalBalls) * 1000) / 10 : 0,
    };
  }, [extState?.oppositionPlayers, localBalls, knownBatsmen]);

  // ---- Submit over ----
  const handleEndOverConfirm = useCallback(async () => {
    if (!selectedMatchId) return;
    if (!selectedBowlerPlayerId) { showToast('Select a bowler first'); return; }
    const legalBalls = localBalls.filter(oppIsLegalDelivery).length;
    if (legalBalls === 0) { showToast('No legal deliveries recorded for this over.'); return; }

    // Who faces the NEXT over = non-striker at end of this over (ends change)
    const activeBatsmenNow = knownBatsmen.filter(b => b.state === 'Batting');
    const nextOverStriker = activeBatsmenNow.find(b => b.name !== onStrikeName)?.name ?? onStrikeName;

    const payload = {
      lastCompletedOver: currentOverNumber - 1,
      onStrikeBatsmanName: nextOverStriker,
      over: {
        overNumber: currentOverNumber,
        balls: localBalls.map((b, i) => ({
          ballNumber: i + 1,
          batsmanName: b.batsmanName,
          bowlerPlayerId: b.bowlerPlayerId,
          thing: b.thing,
          amount: b.amount,
          wicket: b.wicket ?? null,
          angle: null,
          isWide: b.thing === 'wd',
          isNoBall: b.thing === 'nb',
          isBoundary: (b.thing === '' && b.amount === 4) || (b.thing === 'nb' && b.amount === 5),
          isSix: (b.thing === '' && b.amount === 6) || (b.thing === 'nb' && b.amount === 7),
        })),
        commentary: overCommentary || null,
      },
      players: knownBatsmen.map(b => computePlayerStats(b.name)),
    };

    setIsLoading(true);
    try {
      const newState = await submitOppositionOver(selectedMatchId, payload);
      onMatchStateUpdate(newState);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to submit over');
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedMatchId, selectedBowlerPlayerId, localBalls, knownBatsmen, onStrikeName,
    currentOverNumber, overCommentary, computePlayerStats, onMatchStateUpdate, showToast,
  ]);

  // ---- Undo last over ----
  const handleUndoLastOver = useCallback(async () => {
    if (!selectedMatchId) return;
    setIsLoading(true);
    try {
      const newState = await deleteLastOppositionOver(selectedMatchId);
      onMatchStateUpdate(newState);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to undo last over');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMatchId, onMatchStateUpdate, showToast]);

  // ---- Score display ----
  const liveOverScore = localBalls.reduce((s, b) => s + b.amount, 0);
  const serverTheirScore = inPlayData?.theirScore ?? (matchState?.oppositionScore ?? 0);
  const liveScore = serverTheirScore + liveOverScore;
  const liveWickets = (inPlayData?.theirWickets ?? 0) + localBalls.filter(b => b.wicket).length;
  const legalBallsThisOver = localBalls.filter(oppIsLegalDelivery).length;
  const completedOversDisplay = `${currentOverNumber - 1}.${legalBallsThisOver}`;
  const oppName = matchState?.oppositionName ?? 'Opposition';

  // ---- Dismissal text helper for scorecard ----
  const formatOppDismissal = (wicket: OppBatterScorecardLine['wicket']) => {
    if (!wicket?.modeOfDismissal) return 'batting';
    const mode = wicket.modeOfDismissal;
    const bowlerName = ourPlayers.find(p => p.playerId === wicket.bowlerPlayerId)?.playerName ?? '';
    const fielderName = wicket.fielderPlayerId ? (ourPlayers.find(p => p.playerId === wicket.fielderPlayerId)?.playerName ?? '') : '';
    if (mode === 'c&b') return `c&b ${bowlerName}`.trim();
    if (mode === 'caught') return fielderName && fielderName !== bowlerName ? `c ${fielderName} b ${bowlerName}`.trim() : `c&b ${bowlerName}`.trim();
    if (mode === 'bowled') return `b ${bowlerName}`.trim();
    if (mode === 'lbw') return `lbw b ${bowlerName}`.trim();
    if (mode === 'stumped') return `st ${fielderName} b ${bowlerName}`.trim();
    if (mode === 'run out') return fielderName ? `run out (${fielderName})` : 'run out';
    if (mode === 'hit wicket') return 'hit wicket';
    if (mode === 'retired hurt') return 'retired hurt';
    if (mode === 'retired') return 'retired';
    return 'out';
  };

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderBowlerSelector = () => (
    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">Bowler</label>
      <select
        value={selectedBowlerPlayerId ?? ''}
        onChange={e => setSelectedBowlerPlayerId(e.target.value ? Number(e.target.value) : null)}
        className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
      >
        <option value="">Select bowler…</option>
        {ourPlayers.map(p => (
          <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
        ))}
      </select>
    </div>
  );

  const renderBatsmenStrip = () => (
    <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2 min-h-[2.5rem]">
      {activeBatsmen.length === 0 ? (
        <span className="text-xs text-gray-400 italic">No batsmen at crease</span>
      ) : (
        activeBatsmen.map(b => (
          <button
            key={b.name}
            onClick={() => setOnStrikeName(b.name)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
              b.name === onStrikeName
                ? 'bg-villageGreen text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {b.name === onStrikeName && (
              <span className="material-symbols-outlined text-xs leading-none">sports_cricket</span>
            )}
            {b.name}
            {b.name === onStrikeName ? ' *' : ''}
          </button>
        ))
      )}
    </div>
  );

  const renderBallList = () => {
    if (localBalls.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400 text-center px-4">
          <span className="material-symbols-outlined text-4xl mb-2">sports_cricket</span>
          <p className="text-sm">No balls recorded yet this over</p>
        </div>
      );
    }
    const overScore = localBalls.reduce((s, b) => s + b.amount, 0);
    const overWickets = localBalls.filter(b => b.wicket).length;
    return (
      <div className="divide-y divide-gray-50">
        <div className="px-3 py-1.5 bg-gray-50 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Over {currentOverNumber}</span>
          <span className="text-xs font-semibold text-villageGreen">{overScore} run{overScore !== 1 ? 's' : ''} · {overWickets} wkt</span>
        </div>
        {localBalls.map((ball, i) => {
          const legalCount = localBalls.slice(0, i + 1).filter(oppIsLegalDelivery).length;
          const ballRef = oppIsLegalDelivery(ball) ? `${currentOverNumber}.${legalCount}` : `${currentOverNumber}.${legalCount}*`;
          const { label, className: ballClass } = getOppBallLabel(ball);
          const bowlerName = ourPlayers.find(p => p.playerId === ball.bowlerPlayerId)?.playerName ?? '';
          return (
            <div key={i} className="flex items-start px-3 py-2 gap-2 text-xs">
              <span className="font-mono text-gray-400 w-9 flex-shrink-0 pt-0.5">{ballRef}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-400">{bowlerName} → {ball.batsmanName}</p>
                {ball.wicket ? (
                  <p className="font-bold text-red-700 text-sm">OUT! {ball.wicket.batsmanName}</p>
                ) : (
                  <p className="font-medium text-gray-900">
                    {ball.thing === '' && ball.amount === 0 ? 'Dot ball'
                      : ball.thing === '' ? `${ball.amount} run${ball.amount !== 1 ? 's' : ''}`
                      : ball.thing === 'wd' ? (ball.amount > 1 ? `${ball.amount} wides` : 'Wide')
                      : ball.thing === 'nb' ? (ball.amount > 1 ? `No ball + ${ball.amount - 1}` : 'No ball')
                      : ball.thing === 'b' ? `${ball.amount} bye${ball.amount !== 1 ? 's' : ''}`
                      : ball.thing === 'lb' ? `${ball.amount} leg bye${ball.amount !== 1 ? 's' : ''}`
                      : `${ball.amount} ${ball.thing}`
                    }
                  </p>
                )}
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${label.length >= 3 ? 'text-[8px]' : 'text-xs'} font-bold ${ballClass}`}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRunButtons = () => (
    <div className="grid grid-cols-7 gap-1.5 p-3">
      {[0, 1, 2, 3, 4, 5, 6].map(n => (
        <RunCircleButton
          key={n}
          value={n}
          label={n === 5 ? '5+' : String(n)}
          onClick={() => handleRunsButton(n)}
          variant={n === 4 ? 'fill-blue' : n === 6 ? 'fill' : 'outline'}
          disabled={waitingForBallType}
        />
      ))}
    </div>
  );

  const renderExtrasButtons = () => (
    <div className="grid grid-cols-5 gap-1.5 px-3 pb-2">
      {(['wd', 'nb', 'b', 'lb'] as const).map(type => (
        <ExtrasCircleButton
          key={type}
          label={type === 'wd' ? 'Wd' : type === 'nb' ? 'Nb' : type === 'b' ? 'B' : 'Lb'}
          onClick={() => handleExtrasButton(type)}
          highlight={waitingForBallType}
        />
      ))}
      <button
        onClick={handleRunsConfirmed}
        className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all active:scale-95 shadow-sm ${
          waitingForBallType ? 'bg-villageGreen text-white animate-pulse' : 'bg-gray-200 text-gray-500'
        }`}
        disabled={!waitingForBallType}
      >
        ✓
      </button>
    </div>
  );

  const renderActionButtons = () => (
    <div className="grid grid-cols-3 gap-1.5 px-3 pb-3">
      <button
        onClick={handleUndo}
        disabled={localBalls.length === 0 || waitingForBallType}
        className="py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-base leading-none">undo</span>
        Undo
      </button>
      <button
        onClick={handleWicketButton}
        disabled={waitingForBallType}
        className="py-2 rounded-lg bg-red-600 text-white text-xs font-bold disabled:opacity-40 hover:bg-red-700 transition-colors"
      >
        W
      </button>
      <button
        onClick={() => setShowEndOverPanel(true)}
        disabled={waitingForBallType || localBalls.filter(oppIsLegalDelivery).length === 0}
        className="py-2 rounded-lg bg-villageGreen text-white text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
      >
        End Over
      </button>
    </div>
  );

  const renderWicketForm = () => {
    const mode = OPP_DISMISSAL_MODES.find(m => m.code === wicketMode);
    const isLastWicket = activeBatsmen.filter(b => b.name !== wicketBatsmanName).length === 0;
    return (
      <div className="fixed inset-0 z-40 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div className="bg-white w-full md:rounded-xl md:max-w-sm shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Wicket</h3>
            <button onClick={() => setShowWicketForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-lg leading-none">close</span>
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center px-4 py-3">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Batsman out</label>
              <select
                value={wicketBatsmanName}
                onChange={e => setWicketBatsmanName(e.target.value)}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
              >
                {activeBatsmen.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-3">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">How out</label>
              <select
                value={wicketMode}
                onChange={e => {
                  setWicketMode(e.target.value);
                  setWicketFielderId(null);
                }}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
              >
                <option value="">Select…</option>
                {OPP_DISMISSAL_MODES.map(m => (
                  <option key={m.code} value={m.code}>{m.label}</option>
                ))}
              </select>
            </div>
            {mode?.hasFielder && !mode.isCandB && (
              <div className="flex items-center px-4 py-3">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">
                  {mode.code === 'st' ? 'Keeper' : mode.code === 'ro' ? 'Fielder' : 'Fielder'}
                  <span className="text-gray-400 font-normal"> (opt.)</span>
                </label>
                <select
                  value={wicketFielderId ?? ''}
                  onChange={e => setWicketFielderId(e.target.value ? Number(e.target.value) : null)}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                >
                  <option value="">None</option>
                  {ourPlayers.map(p => (
                    <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
                  ))}
                </select>
              </div>
            )}
            {mode?.isCandB && (
              <div className="flex items-center px-4 py-3">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">Fielder</label>
                <span className="text-sm text-gray-500">{selectedBowlerName} (bowler)</span>
              </div>
            )}
            <div className="flex items-center px-4 py-3">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Runs scored</label>
              <input
                type="number" min={0} max={6}
                value={wicketRuns}
                onChange={e => setWicketRuns(e.target.value)}
                className="w-16 text-sm text-gray-900 bg-transparent outline-none"
              />
              {parseInt(wicketRuns, 10) > 0 && (
                <select
                  value={wicketRunsType}
                  onChange={e => setWicketRunsType(e.target.value)}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none ml-2"
                >
                  <option value="">Runs</option>
                  <option value="wd">Wides</option>
                  <option value="nb">No ball</option>
                  <option value="lb">Leg byes</option>
                  <option value="b">Byes</option>
                </select>
              )}
            </div>
            {!isLastWicket && (
              <div className="flex items-center px-4 py-3">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">Next batsman</label>
                <input
                  type="text"
                  placeholder="Name…"
                  value={wicketNewBatsmanName}
                  onChange={e => setWicketNewBatsmanName(e.target.value)}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                />
              </div>
            )}
            <div className="flex items-start px-4 py-3">
              <span className="material-symbols-outlined text-gray-400 text-lg mr-3 mt-0.5">comment</span>
              <textarea
                placeholder="Commentary…"
                value={wicketDescription}
                onChange={e => setWicketDescription(e.target.value)}
                rows={2}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none"
              />
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleWicketConfirm}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
            >
              Record Wicket
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEndOverPanel = () => {
    const overScore = localBalls.reduce((s, b) => s + b.amount, 0);
    const legalCount = localBalls.filter(oppIsLegalDelivery).length;
    return (
      <div className="fixed inset-0 z-40 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div className="bg-white w-full md:rounded-xl md:max-w-sm shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">End of Over {currentOverNumber}</h3>
            <button onClick={() => setShowEndOverPanel(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-lg leading-none">close</span>
            </button>
          </div>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-600">{legalCount} ball{legalCount !== 1 ? 's' : ''} · {overScore} run{overScore !== 1 ? 's' : ''} · {localBalls.filter(b => b.wicket).length} wkt</p>
          </div>
          <div className="flex items-start px-4 py-3 border-b border-gray-100">
            <span className="material-symbols-outlined text-gray-400 text-lg mr-3 mt-0.5">comment</span>
            <textarea
              placeholder="Commentary…"
              value={overCommentary}
              onChange={e => setOverCommentary(e.target.value)}
              rows={3}
              className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none"
            />
          </div>
          <div className="p-4 flex gap-3">
            {(extState?.oppositionLastCompletedOver ?? 0) > 0 && (
              <button
                onClick={() => { setShowEndOverPanel(false); handleUndoLastOver(); }}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Undo last over
              </button>
            )}
            <button
              onClick={() => { setShowEndOverPanel(false); handleEndOverConfirm(); }}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-villageGreen text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
              ) : 'Submit Over'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderScorecardPanel = () => {
    const onStrikeBatsman = inPlayData?.theirOnStrikeBatsman;
    const otherBatsman = inPlayData?.theirOtherBatsman;
    const battingCard = inPlayData?.theirLiveBattingCard;
    const bowlingCard = inPlayData?.theirLiveBowlingCard;
    const isBallByBall = inPlayData?.theirInningsIsBallByBall ?? extState?.theirInningsIsBallByBall ?? false;

    return (
      <div className="divide-y divide-gray-100">
        {/* Their innings header */}
        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">{oppName}</span>
            <span className="text-sm font-bold text-gray-900">
              {liveScore}/{liveWickets}
              <span className="text-xs font-normal text-gray-500 ml-1">({completedOversDisplay} ovs)</span>
            </span>
          </div>
        </div>

        {isBallByBall && onStrikeBatsman && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">At the crease</span>
            </div>
            {[onStrikeBatsman, otherBatsman].filter(Boolean).map((b, i) => b && (
              <div key={b.batsmanName ?? i} className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
                <div className="flex items-center gap-1.5">
                  {i === 0 && <span className="text-xs font-bold text-villageGreen">*</span>}
                  {i !== 0 && <span className="w-3 inline-block" />}
                  <span className="text-sm font-medium text-gray-900">{b.batsmanName}</span>
                </div>
                <div className="text-xs text-gray-600 text-right">
                  <span className="font-semibold text-gray-900">{b.currentScore}</span>
                  <span className="text-gray-400"> ({b.ballsFaced}) </span>
                  <span>SR {b.strikeRate?.toFixed(0)}</span>
                  <span className="ml-1 text-gray-400">{b.fours}×4 {b.sixes}×6</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {isBallByBall && battingCard && battingCard.length > 0 && (
          <div>
            <button
              onClick={() => setBattingCardOpen(v => !v)}
              className="w-full px-4 py-2 bg-gray-50 flex items-center justify-between text-left"
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Their batting card</span>
              <span className="material-symbols-outlined text-sm leading-none text-gray-400">
                {battingCardOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {battingCardOpen && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                      <th className="text-left py-1.5 px-3 font-medium">Batsman</th>
                      <th className="text-right py-1.5 px-1 font-medium">R</th>
                      <th className="text-right py-1.5 px-1 font-medium">B</th>
                      <th className="text-right py-1.5 px-1 font-medium">4s</th>
                      <th className="text-right py-1.5 px-1 font-medium">6s</th>
                      <th className="text-right py-1.5 px-2 font-medium">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...battingCard].sort((a, b2) => (a.position ?? 99) - (b2.position ?? 99)).map((row, i) => (
                      <tr key={row.batsmanName ?? i} className={`border-b border-gray-50 ${row.wicket ? 'opacity-60' : ''}`}>
                        <td className="py-1.5 px-3">
                          <div className="font-medium text-gray-900 truncate max-w-[100px]">{row.batsmanName}</div>
                          {row.wicket && (
                            <div className="text-gray-400 italic truncate max-w-[120px]">{formatOppDismissal(row.wicket)}</div>
                          )}
                          {!row.wicket && <div className="text-villageGreen">batting</div>}
                        </td>
                        <td className="py-1.5 px-1 text-right font-semibold">{row.score}</td>
                        <td className="py-1.5 px-1 text-right text-gray-600">{row.ballsFaced}</td>
                        <td className="py-1.5 px-1 text-right text-gray-600">{row.fours}</td>
                        <td className="py-1.5 px-1 text-right text-gray-600">{row.sixes}</td>
                        <td className="py-1.5 px-2 text-right text-gray-600">{row.strikeRate?.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {isBallByBall && bowlingCard && bowlingCard.length > 0 && (
          <div>
            <button
              onClick={() => setBowlingCardOpen(v => !v)}
              className="w-full px-4 py-2 bg-gray-50 flex items-center justify-between text-left"
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Our bowling</span>
              <span className="material-symbols-outlined text-sm leading-none text-gray-400">
                {bowlingCardOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {bowlingCardOpen && (
              <div className="divide-y divide-gray-50">
                {bowlingCard.map((b, i) => (
                  <div key={b.playerId ?? i} className="flex items-center justify-between px-4 py-2 text-xs">
                    <span className="font-medium text-gray-900">{b.playerName}</span>
                    <span className="text-gray-600 font-mono">{b.overs}-{b.maidens}-{b.runs}-{b.wickets}</span>
                    <span className="text-gray-500">Econ {b.economy?.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  const scoringPanel = (
    <div className="flex flex-col bg-white h-full overflow-y-auto">
      {/* Score header */}
      <div className="border-b border-gray-200 px-3 py-2 flex items-center justify-between flex-shrink-0">
        <div>
          <span className="text-sm font-semibold text-gray-900">{oppName}</span>
          <span className="text-xs text-gray-500 ml-1">batting</span>
        </div>
        <span className="text-sm font-bold text-gray-900">
          {liveScore}/{liveWickets}
          <span className="text-xs font-normal text-gray-500 ml-1">({completedOversDisplay} ovs)</span>
        </span>
      </div>
      {renderBowlerSelector()}
      {renderBatsmenStrip()}
      <div className="flex-1 overflow-y-auto min-h-0">
        {renderBallList()}
      </div>
      <div className="flex-shrink-0 border-t border-gray-100">
        {renderRunButtons()}
        {renderExtrasButtons()}
        {renderActionButtons()}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
        <button
          onClick={onAbandon}
          className="p-1 text-amber-500 hover:text-amber-600 transition-colors"
          aria-label="Abandon match"
        >
          <span className="material-symbols-outlined text-xl leading-none">dangerous</span>
        </button>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Opposition Innings</span>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Wide: left scoring panel */}
        <div className="hidden md:flex md:flex-col md:w-80 md:flex-shrink-0 md:border-r md:border-gray-200 overflow-hidden">
          {scoringPanel}
        </div>
        {/* Wide: right scorecard panel */}
        <div className="hidden md:block flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-lg mx-auto">
            {renderScorecardPanel()}
          </div>
        </div>

        {/* Mobile: tab switcher */}
        <div className="flex md:hidden flex-col w-full overflow-hidden">
          <div className="flex flex-shrink-0 border-b border-gray-200 bg-white">
            {(['scoring', 'scorecard'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  mobileTab === tab
                    ? 'text-villageGreen border-b-2 border-villageGreen'
                    : 'text-gray-500'
                }`}
              >
                {tab === 'scoring' ? 'Scoring' : 'Scorecard'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {mobileTab === 'scoring' ? (
              scoringPanel
            ) : (
              <div className="h-full overflow-y-auto bg-gray-50">
                {renderScorecardPanel()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlays */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-30">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border-4 border-villageGreen border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-villageGreen font-medium">Saving…</span>
          </div>
        </div>
      )}
      {showWicketForm && renderWicketForm()}
      {showEndOverPanel && renderEndOverPanel()}
    </div>
  );
};
