import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getLiveScoringMatches,
  getLiveScoringMatchState,
  startLiveScoringMatch,
  submitOver,
  submitOppositionScore,
  endInnings,
  abandonMatch,
} from '../api/liveScoringApi';
import { getAllPlayers } from '../api/playersApi';
import {
  MatchStateV1,
  PlayerStateV1,
  PlayerV1,
  LiveScoringMatchSummaryV1,
} from '../api/swaggerTypes';
import { Screen, LocalBall, LocalWicket, DISMISSAL_MODES } from '../utils/liveScoringTypes';
import {
  getWaitingPlayers,
  isLegalDelivery,
  getNextStateScreen,
  shouldSwitchStriker,
  recomputeOverState,
} from '../utils/liveScoringUtils';
import { ErrorToast } from './liveScoring/NavBar';
import { ChooseMatchScreen } from './liveScoring/ChooseMatchScreen';
import { SelectTeamScreen } from './liveScoring/SelectTeamScreen';
import { MatchConditionsScreen } from './liveScoring/MatchConditionsScreen';
import { NewOverScreen } from './liveScoring/NewOverScreen';
import { ScoringScreen } from './liveScoring/ScoringScreen';
import { WicketScreen } from './liveScoring/WicketScreen';
import { EndOverScreen } from './liveScoring/EndOverScreen';
import { EndInningsScreen } from './liveScoring/EndInningsScreen';
import { OppositionScoringScreen } from './liveScoring/OppositionScoringScreen';
import { EndMatchScreen } from './liveScoring/EndMatchScreen';
// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const LiveScoring: React.FC = () => {
  const navigate = useNavigate();
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
  const [waitingForBallType, setWaitingForBallType] = useState(false);
  const [showFivePlus, setShowFivePlus] = useState(false);
  const [showWagonWheel, setShowWagonWheel] = useState(false);
  const [wagonWheelBowlerView, setWagonWheelBowlerView] = useState(false);
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
  // Wide-viewport right panel tab
  const [rightPanelTab, setRightPanelTab] = useState<'currentOver' | 'scorecard' | 'endOver' | 'newOver'>('currentOver');
  // Mobile tab
  const [mobileTab, setMobileTab] = useState<'scoring' | 'currentOver' | 'scorecard' | 'endOver' | 'newOver'>('scoring');
  // State snapshot at the start of the current over (for ball-edit recomputation)
  const [overStartPlayers, setOverStartPlayers] = useState<PlayerStateV1[]>([]);
  const [overStartStrikerId, setOverStartStrikerId] = useState<number | null>(null);
  // Ball editing state
  const [editingBallIndex, setEditingBallIndex] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState<string>('0');
  const [editThing, setEditThing] = useState<string>('');
  const [editWicketCode, setEditWicketCode] = useState<string>('');
  const [editWicketFielder, setEditWicketFielder] = useState<string>('');
  const [editWicketCrossed, setEditWicketCrossed] = useState<boolean>(false);
  const [editWicketOutId, setEditWicketOutId] = useState<number | null>(null);
  const [editWicketNextManId, setEditWicketNextManId] = useState<number>(-1);
  const [editWicketDesc, setEditWicketDesc] = useState<string>('');
  // Viewport detection (true when viewport is md+ / >=768 px)
  const [isWide, setIsWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  // Refs so callbacks can always read the latest screen/isWide without stale-closure issues
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const isWideRef = useRef(isWide);
  isWideRef.current = isWide;
  // Abandon match dialog state
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [abandonReason, setAbandonReason] = useState('');
  const [isAbandoning, setIsAbandoning] = useState(false);
  const [abandonError, setAbandonError] = useState<string | null>(null);
  // ---------------------------------------------------------------------------
  // Prevent pull-to-refresh while a match is active
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (screen === 'chooseMatch') {
      document.body.style.overscrollBehavior = '';
      return;
    }
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overscrollBehavior = '';
    };
  }, [screen]);
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
      setSelectedBowler('');
      setNewBowlerInput('');
      setShowNewBowlerInput(false);
      const batters = (state.players ?? []).filter(p => p.state === 'Batting');
      setShowBatsmanSelects(batters.length === 0);
      setStrikerBatsmanId(null);
      setNonStrikerBatsmanId(null);
      // Always use the inline panel inside ScoringScreen (right panel on wide,
      // mobile tab on narrow) rather than the standalone NewOverScreen.
      if (isWideRef.current) setRightPanelTab('newOver');
      else setMobileTab('newOver');
      setScreen('scoring');
      return;
    }
    if (nextScreen === 'endInnings') {
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
    setOverStartPlayers([]);
    setOverStartStrikerId(null);
    setRightPanelTab('currentOver');
    setMobileTab('scoring');
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
    setOverStartPlayers(newPlayers.map(p => ({ ...p })));
    const startStriker = (showBatsmanSelects && strikerBatsmanId)
      ? strikerBatsmanId
      : (matchState?.onStrikeBatsmanId ?? null);
    setOverStartStrikerId(startStriker);
    setRightPanelTab('currentOver');
    setMobileTab('scoring');
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
    setLocalBalls(prev => [...prev, ball]);
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
    setLocalBalls(prev => [...prev.slice(0, -1), updatedBall]);
    const originalShouldSwitch = shouldSwitchStriker(lastBall);
    const newShouldSwitch = shouldSwitchStriker(updatedBall);
    if (originalShouldSwitch !== newShouldSwitch) {
      const battingPlayers = localPlayers.filter(p => p.state === 'Batting');
      if (battingPlayers.length >= 2) {
        const currentStriker = localOnStrikeBatsmanId;
        const other = battingPlayers.find(p => p.playerId !== currentStriker);
        if (other) {
          setLocalOnStrikeBatsmanId(other.playerId ?? null);
        }
      }
    }
    setWaitingForBallType(false);
    setShowFivePlus(false);
  }, [localBalls, localPlayers, localOnStrikeBatsmanId, showToast]);
  const handleRunsConfirmed = useCallback(() => {
    setWaitingForBallType(false);
    setShowFivePlus(false);
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
      if (removedBall.wicket) {
        setLocalPlayers(players => players.map(p => {
          if (p.playerId === removedBall.wicket!.playerId) return { ...p, state: 'Batting' };
          if (p.playerId === removedBall.wicket!.nextManInId) return { ...p, state: 'Waiting' };
          return p;
        }));
        setLocalOnStrikeBatsmanId(removedBall.batsmanId);
      } else if (shouldSwitchStriker(removedBall)) {
        setLocalPlayers(prev2 => {
          const batters = prev2.filter(p => p.state === 'Batting');
          if (batters.length >= 2) {
            const currentStriker = localOnStrikeBatsmanId;
            const other = batters.find(p => p.playerId !== currentStriker);
            if (other) {
              setLocalOnStrikeBatsmanId(other.playerId ?? null);
            }
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
    if (isWide) {
      setRightPanelTab('endOver');
    } else {
      setMobileTab('endOver');
    }
  }, [waitingForBallType, showToast, isWide]);
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
    // Stay on the scoring screen and surface the inline newOver panel.
    if (isWide) setRightPanelTab('newOver');
    else setMobileTab('newOver');
  }, [matchState, isWide]);
  // ---------------------------------------------------------------------------
  // Ball editing handlers
  // ---------------------------------------------------------------------------
  const handleOpenBallEdit = useCallback((index: number) => {
    const ball = localBalls[index];
    setEditingBallIndex(index);
    setEditAmount(String(ball.amount));
    setEditThing(ball.thing);
    if (ball.wicket) {
      const mode = DISMISSAL_MODES.find(m => m.value === ball.wicket!.modeOfDismissal);
      setEditWicketCode(mode?.code ?? '');
      setEditWicketFielder(ball.wicket.fielder ?? '');
      setEditWicketCrossed(ball.wicket.batsmenCrossed);
      setEditWicketOutId(ball.wicket.playerId);
      setEditWicketNextManId(ball.wicket.nextManInId);
      setEditWicketDesc(ball.wicket.description ?? '');
    } else {
      setEditWicketCode('');
      setEditWicketFielder('');
      setEditWicketCrossed(false);
      setEditWicketOutId(null);
      setEditWicketNextManId(-1);
      setEditWicketDesc('');
    }
  }, [localBalls]);
  const handleSaveBallEdit = useCallback(() => {
    if (editingBallIndex === null) return;
    const original = localBalls[editingBallIndex];
    const amount = parseInt(editAmount, 10);
    const safeAmount = isNaN(amount) ? 0 : Math.max(0, amount);
    let wicket: LocalWicket | null = original.wicket ?? null;
    if (wicket && editWicketCode) {
      const mode = DISMISSAL_MODES.find(m => m.code === editWicketCode);
      if (mode) {
        wicket = {
          ...wicket,
          modeOfDismissal: mode.value,
          fielder: editWicketFielder,
          batsmenCrossed: editWicketCrossed,
          nextManInId: editWicketNextManId,
          description: editWicketDesc,
        };
      }
    }
    const newBall: LocalBall = { ...original, amount: safeAmount, thing: editThing, wicket };
    const newBalls = [...localBalls];
    newBalls[editingBallIndex] = newBall;
    const { players: newPlayers, onStrikeBatsmanId: newStrikerId } = recomputeOverState(
      overStartPlayers,
      overStartStrikerId,
      newBalls,
    );
    setLocalBalls(newBalls);
    setLocalPlayers(newPlayers);
    setLocalOnStrikeBatsmanId(newStrikerId);
    setEditingBallIndex(null);
  }, [
    editingBallIndex, localBalls, editAmount, editThing,
    editWicketCode, editWicketFielder, editWicketCrossed, editWicketNextManId, editWicketDesc,
    overStartPlayers, overStartStrikerId,
  ]);
  // ---------------------------------------------------------------------------
  // Wicket screen handlers
  // ---------------------------------------------------------------------------
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
    setMobileTab('scoring');
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
  // Abandon Match handler
  // ---------------------------------------------------------------------------
  const handleAbandonConfirm = useCallback(async () => {
    if (!selectedMatchId) return;
    setIsAbandoning(true);
    setAbandonError(null);
    try {
      await abandonMatch(selectedMatchId, { reason: abandonReason.trim() || null });
      setShowAbandonDialog(false);
      setAbandonReason('');
      setScreen('endMatch');
    } catch (err) {
      setAbandonError(err instanceof Error ? err.message : 'Failed to abandon match');
    } finally {
      setIsAbandoning(false);
    }
  }, [selectedMatchId, abandonReason]);
  const openAbandonDialog = useCallback(() => {
    setAbandonReason('');
    setAbandonError(null);
    setShowAbandonDialog(true);
  }, []);
  // ---------------------------------------------------------------------------
  // Viewport detection
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    setIsWide(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  let content: React.ReactNode;
  switch (screen) {
    case 'chooseMatch':
      content = (
        <ChooseMatchScreen
          matchesList={matchesList}
          isLoading={isLoading}
          onChooseMatch={handleChooseMatch}
          onBack={() => navigate('/admin')}
        />
      );
      break;
    case 'selectTeam':
      content = (
        <SelectTeamScreen
          allPlayers={allPlayers}
          selectedPlayerIds={selectedPlayerIds}
          isLoading={isLoading}
          onTogglePlayer={handleTogglePlayer}
          onDone={handleSelectTeamDone}
          onBack={() => setScreen('chooseMatch')}
        />
      );
      break;
    case 'matchConditions':
      content = (
        <MatchConditionsScreen
          selectedPlayers={selectedPlayers}
          captainId={captainId}
          setCaptainId={setCaptainId}
          keeperId={keeperId}
          setKeeperId={setKeeperId}
          matchFormat={matchFormat}
          setMatchFormat={setMatchFormat}
          numberOfOvers={numberOfOvers}
          setNumberOfOvers={setNumberOfOvers}
          tossWinner={tossWinner}
          setTossWinner={setTossWinner}
          tossDecision={tossDecision}
          setTossDecision={setTossDecision}
          isLoading={isLoading}
          onDone={handleMatchConditionsDone}
          onBack={() => setScreen('selectTeam')}
        />
      );
      break;
    case 'newOver':
      content = (
        <NewOverScreen
          matchState={matchState}
          localPlayers={localPlayers}
          selectedBowler={selectedBowler}
          setSelectedBowler={setSelectedBowler}
          newBowlerInput={newBowlerInput}
          setNewBowlerInput={setNewBowlerInput}
          showNewBowlerInput={showNewBowlerInput}
          setShowNewBowlerInput={setShowNewBowlerInput}
          strikerBatsmanId={strikerBatsmanId}
          setStrikerBatsmanId={setStrikerBatsmanId}
          nonStrikerBatsmanId={nonStrikerBatsmanId}
          setNonStrikerBatsmanId={setNonStrikerBatsmanId}
          isNewOverValid={isNewOverValid}
          onAddNewBowler={handleAddNewBowler}
          onDone={handleNewOverDone}
        />
      );
      break;
    case 'scoring':
      content = (
        <ScoringScreen
          matchState={matchState}
          selectedMatchId={selectedMatchId}
          localBalls={localBalls}
          localPlayers={localPlayers}
          localOnStrikeBatsmanId={localOnStrikeBatsmanId}
          currentBowler={currentBowler}
          waitingForBallType={waitingForBallType}
          showFivePlus={showFivePlus}
          showWagonWheel={showWagonWheel}
          wagonWheelBowlerView={wagonWheelBowlerView}
          allPlayers={allPlayers}
          rightPanelTab={rightPanelTab}
          setRightPanelTab={setRightPanelTab}
          mobileTab={mobileTab}
          setMobileTab={setMobileTab}
          endOverCommentary={endOverCommentary}
          setEndOverCommentary={setEndOverCommentary}
          selectedBowler={selectedBowler}
          setSelectedBowler={setSelectedBowler}
          newBowlerInput={newBowlerInput}
          setNewBowlerInput={setNewBowlerInput}
          showNewBowlerInput={showNewBowlerInput}
          setShowNewBowlerInput={setShowNewBowlerInput}
          strikerBatsmanId={strikerBatsmanId}
          setStrikerBatsmanId={setStrikerBatsmanId}
          nonStrikerBatsmanId={nonStrikerBatsmanId}
          setNonStrikerBatsmanId={setNonStrikerBatsmanId}
          showBatsmanSelects={showBatsmanSelects}
          editingBallIndex={editingBallIndex}
          setEditingBallIndex={setEditingBallIndex}
          editAmount={editAmount}
          setEditAmount={setEditAmount}
          editThing={editThing}
          setEditThing={setEditThing}
          editWicketCode={editWicketCode}
          setEditWicketCode={setEditWicketCode}
          editWicketFielder={editWicketFielder}
          setEditWicketFielder={setEditWicketFielder}
          editWicketCrossed={editWicketCrossed}
          setEditWicketCrossed={setEditWicketCrossed}
          editWicketOutId={editWicketOutId}
          setEditWicketOutId={setEditWicketOutId}
          editWicketNextManId={editWicketNextManId}
          setEditWicketNextManId={setEditWicketNextManId}
          editWicketDesc={editWicketDesc}
          setEditWicketDesc={setEditWicketDesc}
          isLoading={isLoading}
          isNewOverValid={isNewOverValid}
          setShowFivePlus={setShowFivePlus}
          onRunsButton={handleRunsButton}
          onExtrasButton={handleExtrasButton}
          onRunsConfirmed={handleRunsConfirmed}
          onWagonWheelSet={handleWagonWheelSet}
          onToggleBowlerView={() => setWagonWheelBowlerView(v => !v)}
          onUndo={handleUndo}
          onWicketButton={handleWicketButton}
          onEndOverButton={handleEndOverButton}
          onSwitchStriker={handleSwitchStriker}
          onChangeBowler={handleChangeBowler}
          onOpenBallEdit={handleOpenBallEdit}
          onSaveBallEdit={handleSaveBallEdit}
          onEndOverConfirm={handleEndOverConfirm}
          onNewOverDone={handleNewOverDone}
          onAddNewBowler={handleAddNewBowler}
          onAbandon={openAbandonDialog}
          showToast={showToast}
        />
      );
      break;
    case 'wicket':
      content = (
        <WicketScreen
          localPlayers={localPlayers}
          wicketBatterOutId={wicketBatterOutId}
          setWicketBatterOutId={setWicketBatterOutId}
          wicketDismissalCode={wicketDismissalCode}
          setWicketDismissalCode={setWicketDismissalCode}
          wicketFielder={wicketFielder}
          setWicketFielder={setWicketFielder}
          wicketRuns={wicketRuns}
          setWicketRuns={setWicketRuns}
          wicketRunsType={wicketRunsType}
          setWicketRunsType={setWicketRunsType}
          wicketNextBatterInId={wicketNextBatterInId}
          setWicketNextBatterInId={setWicketNextBatterInId}
          wicketBatsmenCrossed={wicketBatsmenCrossed}
          setWicketBatsmenCrossed={setWicketBatsmenCrossed}
          wicketCommentary={wicketCommentary}
          setWicketCommentary={setWicketCommentary}
          isWicketValid={isWicketValid}
          onConfirm={handleWicketConfirm}
          onBack={() => setScreen('scoring')}
        />
      );
      break;
    case 'endOver':
      content = (
        <EndOverScreen
          matchState={matchState}
          localBalls={localBalls}
          endOverCommentary={endOverCommentary}
          setEndOverCommentary={setEndOverCommentary}
          isLoading={isLoading}
          onSubmitOver={handleEndOverConfirm}
          onAbandon={openAbandonDialog}
          onBack={() => setScreen('scoring')}
        />
      );
      break;
    case 'endInnings':
      content = (
        <EndInningsScreen
          endInningsType={endInningsType}
          inningsDeclared={inningsDeclared}
          setInningsDeclared={setInningsDeclared}
          endInningsCommentary={endInningsCommentary}
          setEndInningsCommentary={setEndInningsCommentary}
          isLoading={isLoading}
          onConfirm={handleEndInningsConfirm}
        />
      );
      break;
    case 'oppositionScoring':
      content = (
        <OppositionScoringScreen
          oppScore={oppScore}
          setOppScore={setOppScore}
          oppOvers={oppOvers}
          setOppOvers={setOppOvers}
          oppWickets={oppWickets}
          setOppWickets={setOppWickets}
          oppCommentary={oppCommentary}
          setOppCommentary={setOppCommentary}
          isLoading={isLoading}
          onConfirm={handleOppositionScoringConfirm}
          onAbandon={openAbandonDialog}
        />
      );
      break;
    case 'endMatch':
      content = (
        <EndMatchScreen
          selectedMatchId={selectedMatchId}
          onBack={() => navigate('/admin')}
        />
      );
      break;
    default:
      content = (
        <ChooseMatchScreen
          matchesList={matchesList}
          isLoading={isLoading}
          onChooseMatch={handleChooseMatch}
          onBack={() => navigate('/admin')}
        />
      );
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
      {showAbandonDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-900">Abandon this match?</h2>
            <p className="text-sm text-gray-600">
              The match will be marked as abandoned and any ball-by-ball data recorded so far will be
              saved to the scorecard. This cannot be undone.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Reason <span className="font-normal normal-case text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. rain, bad light"
                value={abandonReason}
                onChange={e => setAbandonReason(e.target.value)}
                disabled={isAbandoning}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 disabled:opacity-50"
              />
            </div>
            {abandonError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {abandonError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAbandonDialog(false); setAbandonError(null); }}
                disabled={isAbandoning}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAbandonConfirm}
                disabled={isAbandoning}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isAbandoning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Abandoning...
                  </>
                ) : (
                  'Abandon Match'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LiveScoring;