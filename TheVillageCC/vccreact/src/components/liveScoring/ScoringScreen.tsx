import React from 'react';
import { MatchStateV1, PlayerStateV1, PlayerV1 } from '../../api/swaggerTypes';
import type { components } from '../../api/generated/openapi';
import { LocalBall } from '../../utils/liveScoringTypes';
import { DISMISSAL_MODES } from '../../utils/liveScoringTypes';
import {
  getBattingPlayers, isLegalDelivery, getOverString, getBallLabel,
  getLocalBallDescription, formatLocalWicket, formatWicketV1,
  computeLiveScoreFromBalls, computeBatsmanRunsInOver, computeBatsmanBallsInOver,
  computeBatsmanFoursInOver, computeBatsmanSixesInOver, computeBowlerRunsInOver,
  computeBowlerWicketsInOver, computePartnershipRunsInOver, computePartnershipBallsInOver,
} from '../../utils/liveScoringUtils';
import { WagonWheelInput } from './WagonWheelInput';
import { NewOverFormContent } from './NewOverFormContent';
import { EndOverFormContent } from './EndOverFormContent';
import { RunCircleButton, ExtrasCircleButton } from './CircleButtons';
export interface ScoringScreenProps {
  matchState: MatchStateV1 | null;
  selectedMatchId: number | null;
  localBalls: LocalBall[];
  localPlayers: PlayerStateV1[];
  localOnStrikeBatsmanId: number | null;
  currentBowler: string;
  waitingForBallType: boolean;
  showFivePlus: boolean;
  showWagonWheel: boolean;
  wagonWheelBowlerView: boolean;
  allPlayers: PlayerV1[];
  rightPanelTab: 'currentOver' | 'scorecard' | 'endOver' | 'newOver';
  setRightPanelTab: (tab: 'currentOver' | 'scorecard' | 'endOver' | 'newOver') => void;
  mobileTab: 'scoring' | 'currentOver' | 'scorecard' | 'endOver' | 'newOver';
  setMobileTab: (tab: 'scoring' | 'currentOver' | 'scorecard' | 'endOver' | 'newOver') => void;
  endOverCommentary: string;
  setEndOverCommentary: (v: string) => void;
  selectedBowler: string;
  setSelectedBowler: (v: string) => void;
  newBowlerInput: string;
  setNewBowlerInput: (v: string) => void;
  showNewBowlerInput: boolean;
  setShowNewBowlerInput: (v: boolean) => void;
  strikerBatsmanId: number | null;
  setStrikerBatsmanId: (v: number | null) => void;
  nonStrikerBatsmanId: number | null;
  setNonStrikerBatsmanId: (v: number | null) => void;
  showBatsmanSelects: boolean;
  editingBallIndex: number | null;
  setEditingBallIndex: (v: number | null) => void;
  editAmount: string;
  setEditAmount: (v: string) => void;
  editThing: string;
  setEditThing: (v: string) => void;
  editWicketCode: string;
  setEditWicketCode: (v: string) => void;
  editWicketFielder: string;
  setEditWicketFielder: (v: string) => void;
  editWicketCrossed: boolean;
  setEditWicketCrossed: (v: boolean) => void;
  editWicketOutId: number | null;
  setEditWicketOutId: (v: number | null) => void;
  editWicketNextManId: number;
  setEditWicketNextManId: (v: number) => void;
  editWicketDesc: string;
  setEditWicketDesc: (v: string) => void;
  isLoading: boolean;
  isNewOverValid: () => string | null;
  setShowFivePlus: (v: boolean) => void;
  onRunsButton: (amount: number) => void;
  onExtrasButton: (type: string) => void;
  onRunsConfirmed: () => void;
  onWagonWheelSet: (angle: number | null) => void;
  onToggleBowlerView: () => void;
  onUndo: () => void;
  onWicketButton: () => void;
  onEndOverButton: () => void;
  onSwitchStriker: (playerId: number) => void;
  onChangeBowler: () => void;
  onOpenBallEdit: (index: number) => void;
  onSaveBallEdit: () => void;
  onEndOverConfirm: () => void;
  onNewOverDone: () => void;
  onAddNewBowler: () => void;
  onAbandon: () => void;
  showToast: (msg: string) => void;
}
export const ScoringScreen: React.FC<ScoringScreenProps> = (props) => {
  const {
    matchState, selectedMatchId, localBalls, localPlayers, localOnStrikeBatsmanId,
    currentBowler, waitingForBallType, showFivePlus, showWagonWheel, wagonWheelBowlerView,
    allPlayers, rightPanelTab, setRightPanelTab, mobileTab, setMobileTab,
    endOverCommentary, setEndOverCommentary,
    selectedBowler, setSelectedBowler, newBowlerInput, setNewBowlerInput,
    showNewBowlerInput, setShowNewBowlerInput,
    strikerBatsmanId, setStrikerBatsmanId, nonStrikerBatsmanId, setNonStrikerBatsmanId,
    showBatsmanSelects,
    editingBallIndex, setEditingBallIndex, editAmount, setEditAmount,
    editThing, setEditThing, editWicketCode, setEditWicketCode,
    editWicketFielder, setEditWicketFielder, editWicketCrossed, setEditWicketCrossed,
    editWicketOutId, setEditWicketOutId, editWicketNextManId, setEditWicketNextManId,
    editWicketDesc, setEditWicketDesc, isLoading,
    isNewOverValid, onRunsButton, onExtrasButton, onRunsConfirmed,
    onWagonWheelSet, onToggleBowlerView, onUndo, onWicketButton, onEndOverButton,
    onSwitchStriker, onChangeBowler, onOpenBallEdit, onSaveBallEdit,
    onEndOverConfirm, onNewOverDone, onAddNewBowler, onAbandon,
  } = props;  const battingPlayers = getBattingPlayers(localPlayers);
  const strikerId = localOnStrikeBatsmanId ?? matchState?.onStrikeBatsmanId ?? -1;
  const striker = battingPlayers.find(p => p.playerId === strikerId) ?? battingPlayers[0];
  const nonStriker = battingPlayers.find(p => p.playerId !== strikerId) ?? battingPlayers[1];
  const getLiveBatsmanRuns = (player: PlayerStateV1 | undefined) => !player ? 0 :
    (player.currentScore ?? 0) + computeBatsmanRunsInOver(player.playerId!, localBalls);
  const getLiveBatsmanBalls = (player: PlayerStateV1 | undefined) => !player ? 0 :
    (player.ballsFaced ?? 0) + computeBatsmanBallsInOver(player.playerId!, localBalls);
  const getLiveBatsmanFours = (player: PlayerStateV1 | undefined) => !player ? 0 :
    (player.fours ?? 0) + computeBatsmanFoursInOver(player.playerId!, localBalls);
  const getLiveBatsmanSixes = (player: PlayerStateV1 | undefined) => !player ? 0 :
    (player.sixes ?? 0) + computeBatsmanSixesInOver(player.playerId!, localBalls);
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
  const overNum = (matchState?.lastCompletedOver ?? 0) + 1;
  const bowlerOvers = currentBowlerDetails?.details?.overs ?? 0;
  const bowlerMaidens = currentBowlerDetails?.details?.maidens ?? 0;
  const bowlerRuns = (currentBowlerDetails?.details?.runs ?? 0) + computeBowlerRunsInOver(currentBowler, localBalls);
  const bowlerWickets = (currentBowlerDetails?.details?.wickets ?? 0) + computeBowlerWicketsInOver(currentBowler, localBalls);
  const localLegalBalls = localBalls.filter(isLegalDelivery).length;
  const bowlerOversDisplay = `${bowlerOvers}.${localLegalBalls}`;
  const liveLegalBallsCount = localBalls.filter(isLegalDelivery).length;
  const totalBallsFacedLive = (matchState?.lastCompletedOver ?? 0) * 6 + liveLegalBallsCount;
  const liveCRR = totalBallsFacedLive > 0 ? Math.round((liveTotalScore / totalBallsFacedLive) * 600) / 100 : 0;
  const inPlayDataForRates = matchState?.liveScorecard?.inPlayData;
  const totalMatchOvers = inPlayDataForRates?.overs ?? 0;
  const isLimitedOversMatch = totalMatchOvers > 0 && !(inPlayDataForRates?.declarationGame ?? false);
  const scoringWeAreChasing = isLimitedOversMatch &&
    inPlayDataForRates?.ourInningsStatus === 'InProgress' &&
    inPlayDataForRates?.theirInningsStatus === 'Completed';
  const scoringTarget = scoringWeAreChasing ? (inPlayDataForRates?.theirScore ?? 0) + 1 : null;
  const scoringRunsNeeded = scoringWeAreChasing && scoringTarget !== null ? scoringTarget - liveTotalScore : null;
  const scoringBallsRemaining = isLimitedOversMatch
    ? Math.max(0, totalMatchOvers * 6 - totalBallsFacedLive)
    : 0;
  const liveRRR = scoringWeAreChasing && scoringBallsRemaining > 0 && scoringRunsNeeded !== null && scoringRunsNeeded > 0
    ? Math.round((scoringRunsNeeded / scoringBallsRemaining) * 600) / 100
    : null;
  const partnershipFoursInOver = localBalls.filter(b => b.thing === '' && b.amount === 4).length;
  const partnershipSixesInOver = localBalls.filter(b => b.thing === '' && b.amount === 6).length;
  const partnershipRuns = (matchState?.partnership?.runs ?? 0) + computePartnershipRunsInOver(localBalls);
  const partnershipBalls = (matchState?.partnership?.balls ?? 0) + computePartnershipBallsInOver(localBalls);
  const partnershipFours = (matchState?.partnership?.fours ?? 0) + partnershipFoursInOver;
  const partnershipSixes = (matchState?.partnership?.sixes ?? 0) + partnershipSixesInOver;
  const oppName = matchState?.oppositionName ?? 'Opposition';
  const oppAbbrev = matchState?.oppositionShortName ?? 'OPP';
  const oppScore2 = matchState?.oppositionScore ?? 0;
  const oppWicketsVal = matchState?.oppositionWickets ?? 0;
  const allBattersForScorecard = localPlayers
    .filter(p => p.state === 'Batting' || p.state === 'Out')
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
  const waitingBattersForScorecard = localPlayers.filter(p => p.state === 'Waiting');
  const wicketMap = new Map<number, typeof localBalls[0]['wicket']>();
  localBalls.forEach(b => { if (b.wicket) wicketMap.set(b.wicket.playerId, b.wicket); });
  // ---- Current Over Panel ----
  const renderCurrentOverPanel = () => {
    if (localBalls.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
          <span className="material-symbols-outlined text-4xl mb-2">sports_cricket</span>
          <p className="text-sm">No balls recorded yet this over</p>
        </div>
      );
    }
    return (
      <div className="divide-y divide-gray-100">
        <div className="px-4 py-2 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Over {overNum}</span>
          <span className="text-xs font-semibold text-villageGreen">
            {liveOverScore} run{liveOverScore !== 1 ? 's' : ''} · {computeBowlerWicketsInOver(currentBowler, localBalls)} wkt
          </span>
        </div>
        {localBalls.map((ball, i) => {
          const legalCount = localBalls.slice(0, i + 1).filter(isLegalDelivery).length;
          const ballRef = isLegalDelivery(ball) ? `${overNum}.${legalCount}` : `${overNum}.${legalCount}*`;
          const { label, className: ballClass } = getBallLabel(ball);
          return (
            <div key={i} className="flex items-start px-4 py-3 gap-3 border-b border-gray-50 last:border-0">
              <span className="text-xs font-mono text-gray-400 w-9 flex-shrink-0 pt-0.5">{ballRef}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{ball.bowlerName} → {ball.batsmanName}</p>
                {ball.wicket ? (
                  <>
                    <p className="text-sm font-bold text-red-700">OUT! {ball.wicket.playerName} — {formatLocalWicket(ball.wicket)}</p>
                    {ball.wicket.description && <p className="text-xs text-gray-500 italic mt-0.5">{ball.wicket.description}</p>}
                  </>
                ) : (
                  <p className="text-sm font-medium text-gray-900">{getLocalBallDescription(ball)}</p>
                )}
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${label.length >= 3 ? 'text-[9px]' : 'text-xs'} font-bold ${ballClass}`}>
                {label}
              </div>
              <button onClick={() => onOpenBallEdit(i)} className="flex-shrink-0 p-1 text-gray-300 hover:text-villageGreen transition-colors mt-0.5" aria-label={`Edit ball ${ballRef}`}>
                <span className="material-symbols-outlined text-base leading-none">edit</span>
              </button>
            </div>
          );
        })}
      </div>
    );
  };
  // ---- Scorecard Panel ----
  const renderScorecardPanel = () => (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium">Batters</th>
              <th className="text-right py-2 px-1 font-medium">R</th>
              <th className="text-right py-2 px-1 font-medium">B</th>
              <th className="text-right py-2 px-1 font-medium">4s</th>
              <th className="text-right py-2 px-1 font-medium">6s</th>
              <th className="text-right py-2 px-2 font-medium">SR</th>
            </tr>
          </thead>
          <tbody>
            {allBattersForScorecard.map((player) => {
              const isOnStrike2 = player.playerId === strikerId && player.state === 'Batting';
              const isOut2 = player.state === 'Out';
              const currentOverWicket = isOut2 ? wicketMap.get(player.playerId!) : undefined;
              const historicEntry = isOut2 && !currentOverWicket
                ? matchState?.liveScorecard?.inPlayData?.liveBattingCard?.players?.[String(player.playerId!)]
                : undefined;
              const dismissalText = currentOverWicket
                ? formatLocalWicket(currentOverWicket as NonNullable<typeof currentOverWicket>)
                : historicEntry?.wicket ? formatWicketV1(historicEntry.wicket) : null;
              return (
                <tr key={player.playerId} className={`border-b border-gray-50 ${isOut2 ? 'opacity-60' : 'cursor-pointer hover:bg-gray-50'}`} onClick={() => !isOut2 && onSwitchStriker(player.playerId!)}>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {isOnStrike2 ? <span className="material-symbols-outlined text-sm leading-none text-villageGreen">sports_cricket</span> : <span className="w-4 inline-block" />}
                      <span className={`font-medium truncate max-w-[130px] ${isOut2 ? 'text-gray-400' : 'text-gray-900'}`}>{player.playerName ?? '[?]'}</span>
                    </div>
                    {isOut2 && dismissalText && <div className="text-xs text-gray-400 italic ml-5 truncate max-w-[130px]">{dismissalText}</div>}
                  </td>
                  <td className="py-2 px-1 text-right font-semibold">{getLiveBatsmanRuns(player)}</td>
                  <td className="py-2 px-1 text-right text-gray-600">{getLiveBatsmanBalls(player)}</td>
                  <td className="py-2 px-1 text-right text-gray-600">{getLiveBatsmanFours(player)}</td>
                  <td className="py-2 px-1 text-right text-gray-600">{getLiveBatsmanSixes(player)}</td>
                  <td className="py-2 px-2 text-right text-gray-600">{getLiveBatsmanSR(player)}</td>
                </tr>
              );
            })}
            {waitingBattersForScorecard.length > 0 && (
              <tr className="border-b border-gray-50">
                <td colSpan={6} className="py-1.5 px-3 text-xs text-gray-400 italic">{waitingBattersForScorecard.length} yet to bat</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {(matchState?.bowlerDetails ?? []).length > 0 && (
        <div className="overflow-x-auto border-t border-gray-100 mt-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium">Bowler</th>
                <th className="text-right py-2 px-1 font-medium">O</th>
                <th className="text-right py-2 px-1 font-medium">M</th>
                <th className="text-right py-2 px-1 font-medium">R</th>
                <th className="text-right py-2 px-2 font-medium">W</th>
              </tr>
            </thead>
            <tbody>
              {(matchState?.bowlerDetails ?? []).map((bd, i) => {
                const isCurrent2 = bd.name === currentBowler;
                const bdRuns = isCurrent2 ? bowlerRuns : (bd.details?.runs ?? 0);
                const bdWickets = isCurrent2 ? bowlerWickets : (bd.details?.wickets ?? 0);
                const bdOvers = isCurrent2 ? bowlerOversDisplay : String(bd.details?.overs ?? 0);
                const bdMaidens = isCurrent2 ? bowlerMaidens : (bd.details?.maidens ?? 0);
                return (
                  <tr key={bd.name ?? i} className={`border-b border-gray-50 ${isCurrent2 ? 'bg-villageGreenLight' : ''}`}>
                    <td className="py-2 px-3 font-medium text-gray-900 truncate max-w-[140px]">{bd.name}{isCurrent2 ? ' *' : ''}</td>
                    <td className="py-2 px-1 text-right text-gray-600">{bdOvers}</td>
                    <td className="py-2 px-1 text-right text-gray-600">{bdMaidens}</td>
                    <td className="py-2 px-1 text-right text-gray-600">{bdRuns}</td>
                    <td className="py-2 px-1 text-right text-gray-600">{bdWickets}</td>
                    <td className="py-2 px-2 text-right">
                      <button onClick={onChangeBowler} className="text-gray-400 hover:text-villageGreen transition-colors">
                        <span className="material-symbols-outlined text-base leading-none">edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  // ---- End Over Panel (wide right panel) ----
  const renderEndOverPanel = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">End of Over {overNum}</span>
        <div className="flex items-center gap-2">
          <button onClick={onAbandon} className="p-1 rounded hover:bg-amber-50 transition-colors" aria-label="Abandon match" title="Abandon match">
            <span className="material-symbols-outlined text-xl leading-none text-amber-400">dangerous</span>
          </button>
          <button onClick={() => setRightPanelTab('currentOver')} className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" aria-label="Cancel end over">
            <span className="material-symbols-outlined text-xl leading-none">close</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-villageGreen border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-villageGreen font-medium">Loading...</span>
            </div>
          </div>
        )}
        <EndOverFormContent
          localBalls={localBalls}
          overNum={overNum}
          endOverCommentary={endOverCommentary}
          setEndOverCommentary={setEndOverCommentary}
          isLoading={isLoading}
          onSubmitOver={onEndOverConfirm}
          onEditBall={(i) => { setRightPanelTab('currentOver'); onOpenBallEdit(i); }}
        />
      </div>
    </div>
  );
  // ---- New Over Panel (wide right panel / mobile tab) ----
  const renderNewOverPanel = (radioGroupName: string) => (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-lg mx-auto p-4">
        <NewOverFormContent
          matchState={matchState}
          localPlayers={localPlayers}
          showBatsmanSelects={showBatsmanSelects}
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
          onAddNewBowler={onAddNewBowler}
          radioGroupName={radioGroupName}
        />
      </div>
    </div>
  );
  const editingBall = editingBallIndex !== null ? localBalls[editingBallIndex] : null;
  const editDismissalMode = DISMISSAL_MODES.find(m => m.code === editWicketCode);
  const battingForEdit = localPlayers.filter(p => p.state === 'Batting' || p.state === 'Out');
  const waitingForEdit = localPlayers.filter(p => p.state === 'Waiting');
  const legalCount2 = editingBallIndex !== null ? localBalls.slice(0, editingBallIndex + 1).filter(isLegalDelivery).length : 0;
  const ballRef2 = editingBall
    ? (isLegalDelivery(editingBall) ? `${overNum}.${legalCount2}` : `${overNum}.${legalCount2}*`)
    : '';
  return (
    <div className="flex flex-col h-full relative">
      {/* Share toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="w-8" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Scoring</span>
        <button
          className="p-1 hover:text-villageGreen transition-colors"
          onClick={() => {
            if (selectedMatchId) {
              const url = `${window.location.origin}/scorecard/${selectedMatchId}`;
              navigator.clipboard.writeText(url).then(() => props.showToast('Link copied to clipboard'));
            }
          }}
          aria-label="Share"
        >
          <span className="material-symbols-outlined text-xl leading-none text-gray-500">share</span>
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: scoring panel */}
        <div className={`w-full md:w-[30rem] md:flex-shrink-0 bg-white overflow-y-auto md:border-r md:border-gray-200 transition-opacity ${
          (rightPanelTab === 'endOver' || rightPanelTab === 'newOver') ? 'md:opacity-40 md:pointer-events-none md:select-none' : ''
        }`}>
          <div>
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
                <span className="text-sm font-medium text-gray-700">{oppScore2}/{oppWicketsVal}</span>
              </div>
            </div>
            {/* CRR / RRR rates bar */}
            {isLimitedOversMatch && (
              <div className="border-b border-gray-200 px-3 py-1.5 bg-gray-50 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 font-medium">CRR</span>
                  <span className="font-bold text-gray-900">{liveCRR.toFixed(2)}</span>
                </div>
                {liveRRR !== null && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 font-medium">RRR</span>
                    <span className={`font-bold ${liveRRR <= liveCRR ? 'text-green-700' : 'text-red-600'}`}>{liveRRR.toFixed(2)}</span>
                  </div>
                )}
                {scoringWeAreChasing && scoringRunsNeeded !== null && scoringBallsRemaining > 0 && (
                  <div className="text-gray-700">
                    Need <span className="font-semibold text-gray-900">{scoringRunsNeeded}</span> off{' '}
                    <span className="font-semibold text-gray-900">{Math.floor(scoringBallsRemaining / 6)}.{scoringBallsRemaining % 6}</span> ov
                  </div>
                )}
                {scoringTarget !== null && (
                  <div className="text-gray-500 ml-auto">Target <span className="font-semibold text-gray-700">{scoringTarget}</span></div>
                )}
                {!scoringWeAreChasing && totalMatchOvers > 0 && scoringBallsRemaining > 0 && (
                  <div className="text-gray-500 ml-auto">{Math.floor(scoringBallsRemaining / 6)}.{scoringBallsRemaining % 6} ov left</div>
                )}
              </div>
            )}
            {/* Mobile tab strip */}
            <div className="md:hidden flex border-b border-gray-200 bg-gray-50">
              {mobileTab === 'newOver' ? (
                <>
                  <div className="flex-1 flex items-center justify-center py-2 gap-2 px-4">
                    <span className="material-symbols-outlined text-base leading-none text-villageGreen">sports_cricket</span>
                    <span className="text-sm font-semibold text-villageGreen">Over Details</span>
                  </div>
                  {isNewOverValid() ? (
                    <span className="p-2 flex items-center"><span className="material-symbols-outlined text-xl leading-none text-red-400">block</span></span>
                  ) : (
                    <button onClick={onNewOverDone} className="p-2 text-villageGreen hover:bg-green-50 transition-colors" aria-label="Done">
                      <span className="material-symbols-outlined text-xl leading-none">done</span>
                    </button>
                  )}
                </>
              ) : mobileTab === 'endOver' ? (
                <>
                  <div className="flex-1 flex items-center justify-center py-2 gap-2 px-4">
                    <span className="material-symbols-outlined text-base leading-none text-villageGreen">done_all</span>
                    <span className="text-sm font-semibold text-villageGreen">End of Over {overNum}</span>
                  </div>
                  <button onClick={onAbandon} className="p-2 hover:bg-amber-50 transition-colors" aria-label="Abandon match">
                    <span className="material-symbols-outlined text-xl leading-none text-amber-400">dangerous</span>
                  </button>
                  <button onClick={() => setMobileTab('scoring')} className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Cancel end over">
                    <span className="material-symbols-outlined text-xl leading-none">close</span>
                  </button>
                </>
              ) : (
                (['scoring', 'currentOver', 'scorecard'] as const).map(tab => {
                  const icons = { scoring: 'sports_cricket', currentOver: 'format_list_bulleted', scorecard: 'table_chart' };
                  const labels = { scoring: 'Score', currentOver: 'Over', scorecard: 'Card' };
                  const isActive = mobileTab === tab;
                  return (
                    <button key={tab} onClick={() => setMobileTab(tab)} className={`flex-1 flex flex-row items-center justify-center py-1.5 gap-1 text-[11px] font-medium border-b-2 transition-colors ${isActive ? 'text-villageGreen border-villageGreen bg-white' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                      <span className="material-symbols-outlined text-sm leading-none">{icons[tab]}</span>
                      {labels[tab]}
                    </button>
                  );
                })
              )}
            </div>
            {/* Mobile: current over panel */}
            {mobileTab === 'currentOver' && <div className="md:hidden">{renderCurrentOverPanel()}</div>}
            {/* Mobile: scorecard panel */}
            {mobileTab === 'scorecard' && <div className="md:hidden">{renderScorecardPanel()}</div>}
            {/* Mobile: end-over panel */}
            {mobileTab === 'endOver' && (
              <div className="md:hidden flex-1 overflow-y-auto relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-4 border-villageGreen border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-villageGreen font-medium">Loading...</span>
                    </div>
                  </div>
                )}
                <EndOverFormContent
                  localBalls={localBalls}
                  overNum={overNum}
                  endOverCommentary={endOverCommentary}
                  setEndOverCommentary={setEndOverCommentary}
                  isLoading={isLoading}
                  onSubmitOver={onEndOverConfirm}
                  onEditBall={(i) => { setMobileTab('scoring'); onOpenBallEdit(i); }}
                />
              </div>
            )}
            {/* Mobile: new-over panel */}
            {mobileTab === 'newOver' && (
              <div className="md:hidden flex-1 overflow-y-auto relative">
                {renderNewOverPanel('mob-bowler-radio')}
              </div>
            )}
            {/* Scoring content (always on md+, mobile 'scoring' tab only) */}
            <div className={mobileTab !== 'scoring' ? 'hidden md:block' : ''}>
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
                        <tr key={player.playerId ?? idx} className="border-b border-gray-50 cursor-pointer hover:bg-gray-50" onClick={() => onSwitchStriker(player.playerId!)}>
                          <td className="py-1.5 px-3">
                            <div className="flex items-center gap-1.5">
                              {isOnStrike ? <span className="material-symbols-outlined text-sm leading-none text-villageGreen">sports_cricket</span> : <span className="w-4" />}
                              <span className="font-medium text-gray-900 truncate max-w-[120px]">{player.playerName ?? '[missing]'}</span>
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
                        <button onClick={onChangeBowler} className="text-gray-400 hover:text-villageGreen transition-colors">
                          <span className="material-symbols-outlined text-base leading-none">edit</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Current over balls strip */}
              <div className="border-b border-gray-200 px-3 py-2 flex gap-2 overflow-x-auto min-h-[52px] items-center">
                {localBalls.map((ball, i) => {
                  const { label, className: ballClass } = getBallLabel(ball);
                  return (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${label.length >= 3 ? 'text-[9px]' : 'text-xs'} font-bold flex-shrink-0 ${ballClass}`}>
                      {label}
                    </div>
                  );
                })}
                {Array.from({ length: Math.max(0, 6 - localBalls.filter(isLegalDelivery).length) }, (_, i) => (
                  <div key={`ph-${i}`} className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">·</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Scoring buttons */}
          <div className={`p-3 space-y-2 border-t border-gray-100 ${mobileTab !== 'scoring' ? 'hidden md:block' : ''}`}>
            <div className="grid grid-cols-5 gap-2">
              <RunCircleButton value={0} label={<span className="material-symbols-outlined text-lg leading-none">brightness_1</span>} onClick={() => onRunsButton(0)} variant="outline" />
              {!showFivePlus ? (
                <RunCircleButton value={1} label="1" onClick={() => onRunsButton(1)} variant="outline" highlight={waitingForBallType} />
              ) : (
                <RunCircleButton value={5} label="5" onClick={() => onRunsButton(5)} variant="outline" highlight={waitingForBallType} />
              )}
              {!showFivePlus ? (
                <RunCircleButton value={2} label="2" onClick={() => onRunsButton(2)} variant="outline" highlight={waitingForBallType} />
              ) : (
                <RunCircleButton value={7} label="7" onClick={() => onRunsButton(7)} variant="outline" highlight={waitingForBallType} />
              )}
              {!showFivePlus ? (
                <RunCircleButton value={3} label="3" onClick={() => onRunsButton(3)} variant="outline" highlight={waitingForBallType} />
              ) : (
                <RunCircleButton value={8} label="8" onClick={() => onRunsButton(8)} variant="outline" highlight={waitingForBallType} />
              )}
              <RunCircleButton value={-1} label={<span className="material-symbols-outlined text-lg leading-none">undo</span>} onClick={onUndo} variant="fill" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <RunCircleButton value={4} label="4" onClick={() => onRunsButton(4)} variant="outline" highlight={waitingForBallType} />
              <RunCircleButton value={6} label="6" onClick={() => onRunsButton(6)} variant="outline" highlight={waitingForBallType} />
              {!showFivePlus ? (
                <RunCircleButton value={-2} label="5+" onClick={() => props.setShowFivePlus(true)} variant="outline" />
              ) : (
                <RunCircleButton value={-2} label={<span className="material-symbols-outlined text-base leading-none">replay</span>} onClick={() => props.setShowFivePlus(false)} variant="outline" />
              )}
              <RunCircleButton value={-3} label="Runs" onClick={onRunsConfirmed} variant="fill-blue" disabled={!waitingForBallType} />
              <RunCircleButton value={-4} label={<span className="material-symbols-outlined text-lg leading-none">done</span>} onClick={onEndOverButton} variant="fill" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <ExtrasCircleButton label="Wide" onClick={() => onExtrasButton('wd')} highlight={waitingForBallType} />
              <ExtrasCircleButton label="No Ball" onClick={() => onExtrasButton('nb')} highlight={waitingForBallType} />
              <ExtrasCircleButton label="Bye" onClick={() => onExtrasButton('b')} highlight={waitingForBallType} />
              <ExtrasCircleButton label="Leg Bye" onClick={() => onExtrasButton('lb')} highlight={waitingForBallType} />
              <button onClick={onWicketButton} className="aspect-square rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center hover:bg-red-700 active:scale-95 transition-all shadow-sm">OUT!</button>
            </div>
          </div>
        </div>
        {/* RIGHT: info panel (tablet/desktop only) */}
        <div className="hidden md:flex flex-1 flex-col bg-white overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
            {rightPanelTab !== 'endOver' && rightPanelTab !== 'newOver' ? (
              <>
                <button onClick={() => setRightPanelTab('currentOver')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${rightPanelTab === 'currentOver' ? 'text-villageGreen border-villageGreen bg-white' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                  <span className="material-symbols-outlined text-base leading-none">sports_cricket</span>
                  Current Over
                </button>
                <button onClick={() => setRightPanelTab('scorecard')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${rightPanelTab === 'scorecard' ? 'text-villageGreen border-villageGreen bg-white' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                  <span className="material-symbols-outlined text-base leading-none">table_chart</span>
                  Scorecard
                </button>
              </>
            ) : rightPanelTab === 'endOver' ? (
              <div className="flex-1 flex items-center justify-center py-3 gap-2">
                <span className="material-symbols-outlined text-base leading-none text-villageGreen">done_all</span>
                <span className="text-sm font-semibold text-villageGreen">End of Over {overNum}</span>
              </div>
            ) : (
              <div className="flex items-center px-4 py-3 w-full">
                <div className="flex items-center gap-2 flex-1">
                  <span className="material-symbols-outlined text-base leading-none text-villageGreen">sports_cricket</span>
                  <span className="text-sm font-semibold text-villageGreen">Over Details</span>
                </div>
                {isNewOverValid() ? (
                  <span className="material-symbols-outlined text-xl leading-none text-red-400">block</span>
                ) : (
                  <button onClick={onNewOverDone} className="p-1 rounded-full hover:bg-green-50 transition-colors text-villageGreen" aria-label="Done">
                    <span className="material-symbols-outlined text-xl leading-none">done</span>
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {rightPanelTab === 'currentOver' && renderCurrentOverPanel()}
            {rightPanelTab === 'scorecard' && renderScorecardPanel()}
            {rightPanelTab === 'endOver' && renderEndOverPanel()}
            {rightPanelTab === 'newOver' && renderNewOverPanel('wide-bowler-radio')}
          </div>
        </div>
      </div>
      {/* Ball edit modal */}
      {editingBallIndex !== null && editingBall && (
        <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center px-4 py-3 bg-villageGreen text-white flex-shrink-0">
              <span className="flex-1 text-sm font-semibold">Edit Ball {ballRef2}</span>
              <button onClick={() => setEditingBallIndex(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <span className="material-symbols-outlined text-lg leading-none">close</span>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center px-4 py-3">
                  <label className="w-28 text-sm text-gray-600 flex-shrink-0">Runs / Amount</label>
                  <input type="number" min={0} max={9} value={editAmount} onChange={e => setEditAmount(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none" />
                </div>
                <div className="flex items-center px-4 py-3">
                  <label className="w-28 text-sm text-gray-600 flex-shrink-0">Type</label>
                  <select value={editThing} onChange={e => setEditThing(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                    <option value="">Normal runs</option>
                    <option value="wd">Wide</option>
                    <option value="nb">No Ball</option>
                    <option value="b">Bye</option>
                    <option value="lb">Leg Bye</option>
                  </select>
                </div>
                {editingBall.wicket && (
                  <>
                    <div className="px-4 py-2 bg-red-50">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Wicket Details</p>
                    </div>
                    <div className="flex items-center px-4 py-3">
                      <label className="w-28 text-sm text-gray-600 flex-shrink-0">Batsman out</label>
                      <select value={editWicketOutId ?? ''} onChange={e => setEditWicketOutId(e.target.value ? Number(e.target.value) : null)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                        {battingForEdit.map(p => <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center px-4 py-3">
                      <label className="w-28 text-sm text-gray-600 flex-shrink-0">Dismissal</label>
                      <select value={editWicketCode} onChange={e => setEditWicketCode(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                        <option value="">Select…</option>
                        {DISMISSAL_MODES.map(m => <option key={m.code} value={m.code}>{m.label}</option>)}
                      </select>
                    </div>
                    {editDismissalMode?.hasFielder && (
                      <div className="flex items-center px-4 py-3">
                        <label className="w-28 text-sm text-gray-600 flex-shrink-0">Fielder</label>
                        <input type="text" value={editWicketFielder} onChange={e => setEditWicketFielder(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none" />
                      </div>
                    )}
                    {editDismissalMode?.hasCrossed && (
                      <div className="flex items-center px-4 py-3">
                        <label className="w-28 text-sm text-gray-600 flex-shrink-0">Crossed?</label>
                        <select value={editWicketCrossed ? 'true' : 'false'} onChange={e => setEditWicketCrossed(e.target.value === 'true')} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                    )}
                    <div className="flex items-center px-4 py-3">
                      <label className="w-28 text-sm text-gray-600 flex-shrink-0">Next in</label>
                      <select value={editWicketNextManId} onChange={e => setEditWicketNextManId(Number(e.target.value))} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                        <option value={-1}>{waitingForEdit.length === 0 ? 'Last wicket' : 'Select…'}</option>
                        {waitingForEdit.map(p => <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>)}
                      </select>
                    </div>
                    <div className="flex items-start px-4 py-3">
                      <label className="w-28 text-sm text-gray-600 flex-shrink-0 pt-0.5">Note</label>
                      <textarea value={editWicketDesc} onChange={e => setEditWicketDesc(e.target.value)} rows={2} className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none" />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setEditingBallIndex(null)} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={onSaveBallEdit} className="flex-1 py-2.5 bg-villageGreen text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Wagon Wheel Overlay */}
      {showWagonWheel && (() => {
        const lastBall = localBalls[localBalls.length - 1];
        const batsmanPlayer = allPlayers.find(p => p.playerId === lastBall?.batsmanId);
        const isLeftHanded = batsmanPlayer?.isRightHandBat === false;
        return (
          <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-4 shadow-xl">
              <h2 className="text-sm font-semibold text-gray-700 text-center mb-3 uppercase tracking-wide">Shot Location</h2>
              <WagonWheelInput
                batsmanName={lastBall?.batsmanName ?? ''}
                amount={lastBall?.amount ?? 0}
                isLeftHanded={isLeftHanded}
                bowlerView={wagonWheelBowlerView}
                onToggleBowlerView={onToggleBowlerView}
                onConfirm={onWagonWheelSet}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
};
