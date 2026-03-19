import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Header from './Header';
import Footer from './Footer';
import { getLiveScorecardData } from '../api/liveScoringApi';
import { LiveScorecardV1, BattingEntryV1, BowlingEntryV1, FoWEntryV1, BallV1 } from '../api/swaggerTypes';
import { getScoringArea } from '../utils/cricketUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const LiveScorecard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [scorecardData, setScorecardData] = useState<LiveScorecardV1 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeInnings, setActiveInnings] = useState<'our' | 'their'>('our');
  const [activeCommentaryTab, setActiveCommentaryTab] = useState<'vcc' | 'oppo'>('vcc');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'worm' | 'manhattan' | 'partnerships' | 'wagon'>('worm');
  const [commentaryExpanded, setCommentaryExpanded] = useState(false);
  const [scorecardExpanded, setScorecardExpanded] = useState(false);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);
  const [playerAnalysisExpanded, setPlayerAnalysisExpanded] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState<'scorecard' | 'commentary' | 'analysis' | 'players' | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [activePlayerAnalysisTab, setActivePlayerAnalysisTab] = useState<'worm' | 'wagon'>('worm');

  useEffect(() => {
    const fetchScorecardData = async () => {
      if (!matchId) {
        setError('No match ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getLiveScorecardData(matchId);
        setScorecardData(data);

        const inPlay = data.inPlayData;
        // Auto-select the innings that's in progress or most recent
        if (inPlay) {
          if (inPlay.ourInningsStatus === 'InProgress') {
            setActiveInnings('our');
          } else if (inPlay.theirInningsStatus === 'InProgress') {
            setActiveInnings('their');
          } else if (inPlay.ourInningsStatus === 'Completed') {
            setActiveInnings('our');
          } else if (inPlay.theirInningsStatus === 'Completed') {
            setActiveInnings('their');
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching scorecard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load scorecard');
        setScorecardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScorecardData();
  }, [matchId]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'TBC';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isLive = (data: LiveScorecardV1): boolean => {
    return data.inPlayData?.ourInningsStatus === 'InProgress' ||
           data.inPlayData?.theirInningsStatus === 'InProgress';
  };

  const isCompleted = (data: LiveScorecardV1): boolean => {
    const inPlay = data.inPlayData;
    const final = data.finalScorecard;

    return (!!inPlay && inPlay.ourInningsStatus === 'Completed' && inPlay.theirInningsStatus === 'Completed') ||
      ((final?.ourInnings?.batting?.entries?.length || 0) > 0);
  };

  const formatDismissal = (entry: BattingEntryV1): string => {
    const wicket = entry.wicket;
    if (!wicket) return 'not out';
    if (wicket.isCaughtAndBowled) return `c&b ${wicket.bowler ?? ''}`.trim();
    if (wicket.isCaught) return `ct. ${wicket.fielder ?? ''} b. ${wicket.bowler ?? ''}`.trim();
    if (wicket.isBowled) return `b. ${wicket.bowler ?? ''}`.trim();
    if (wicket.isLbw) return `lbw b. ${wicket.bowler ?? ''}`.trim();
    if (wicket.isStumped) return `st. ${wicket.fielder ?? ''} b. ${wicket.bowler ?? ''}`.trim();
    if (wicket.isRunOut) return wicket.fielder ? `run out (${wicket.fielder})` : 'run out';
    if (wicket.isHitWicket) return 'hit wicket';
    if (wicket.isRetiredHurt) return 'retired hurt';
    if (wicket.isRetired) return 'retired';
    return 'not out';
  };

  const formatWicketDismissal = (wicket: NonNullable<BallV1['wicket']>): string => {
    if (wicket.isCaughtAndBowled) return `c&b ${wicket.bowler ?? ''}`.trim();
    if (wicket.isCaught) return `ct. ${wicket.fielder ?? ''} b. ${wicket.bowler ?? ''}`.trim();
    if (wicket.isBowled) return `b. ${wicket.bowler ?? ''}`.trim();
    if (wicket.isLbw) return `lbw b. ${wicket.bowler ?? ''}`.trim();
    if (wicket.isStumped) return `st. ${wicket.fielder ?? ''} b. ${wicket.bowler ?? ''}`.trim();
    if (wicket.isRunOut) return wicket.fielder ? `run out (${wicket.fielder})` : 'run out';
    if (wicket.isHitWicket) return 'hit wicket';
    if (wicket.isRetiredHurt) return 'retired hurt';
    if (wicket.isRetired) return 'retired';
    return 'out';
  };

  const getBallDescription = (ball: BallV1): string => {
    if (ball.wicket) return 'OUT!';
    const amount = ball.amount ?? 0;
    const thing = ball.thing ?? '';
    const plural = amount !== 1 ? 's' : '';
    const area = ball.angle != null ? getScoringArea(ball.angle) : null;
    switch (thing) {
      case '':
        switch (amount) {
          case 0: return 'no run';
          case 1: return area ? `single to ${area}` : 'single';
          case 4: return area ? `FOUR through ${area}` : 'FOUR';
          case 6: return area ? `SIX! over ${area}` : 'SIX!';
          default: return area ? `${amount} runs to ${area}` : `${amount} runs`;
        }
      case 'wd': return `${amount} wide${plural}`;
      case 'nb': return `${amount} no ball${plural}`;
      case 'b': return `${amount} bye${plural}`;
      case 'lb': return `${amount} leg bye${plural}`;
      default: return `${amount} ${thing}`;
    }
  };

  const toOrdinal = (n: number): string => {
    const lastTwo = n % 100;
    const lastOne = n % 10;
    if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
    if (lastOne === 1) return `${n}st`;
    if (lastOne === 2) return `${n}nd`;
    if (lastOne === 3) return `${n}rd`;
    return `${n}th`;
  };

  const getBallBlob = (ball: BallV1): { label: string; className: string } => {
    if (ball.wicket) return { label: 'W', className: 'bg-red-600 text-white' };
    const thing = ball.thing ?? '';
    const amount = ball.amount ?? 0;
    if (thing === 'wd') return { label: amount > 1 ? `${amount}Wd` : 'Wd', className: 'bg-yellow-400 text-gray-800' };
    if (thing === 'nb') return { label: amount > 1 ? `${amount}Nb` : 'Nb', className: 'bg-yellow-400 text-gray-800' };
    if (thing === 'b') return { label: amount > 1 ? `${amount}B` : 'B', className: 'bg-yellow-400 text-gray-800' };
    if (thing === 'lb') return { label: amount > 1 ? `${amount}Lb` : 'Lb', className: 'bg-yellow-400 text-gray-800' };
    if (amount === 0) return { label: '·', className: 'bg-gray-300 text-gray-600' };
    if (ball.isSix || amount === 6) return { label: '6', className: 'bg-orange-500 text-white' };
    if ((ball.isBoundary && !ball.isSix) || amount === 4) return { label: '4', className: 'bg-blue-500 text-white' };
    return { label: String(amount), className: 'bg-gray-200 text-gray-700' };
  };

  const formatBattingStats = (
    score: number | undefined,
    details: { balls?: number; fours?: number; sixes?: number; strikeRate?: number } | null | undefined
  ): string => {
    if (score == null) return '';
    if (!details) return ` ${score}`;
    return ` ${score} (${details.balls ?? 0}b ${details.fours ?? 0}x4 ${details.sixes ?? 0}x6) SR: ${(details.strikeRate ?? 0).toFixed(2)}`;
  };

  const renderBattingTable = (
    entries: BattingEntryV1[],
    extras?: { wides?: number; noBalls?: number; byes?: number; legByes?: number; penalties?: number; total?: number },
    score?: number,
    wickets?: number
  ) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
            <th className="py-2 pr-2">Batter</th>
            <th className="py-2 text-gray-400 font-normal"></th>
            <th className="py-2 text-right">R</th>
            <th className="py-2 text-right">B</th>
            <th className="py-2 text-right">4s</th>
            <th className="py-2 text-right">6s</th>
            <th className="py-2 text-right">SR</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {entries.map((entry, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 pr-2 font-medium">{entry.playerName}</td>
              <td className="py-2 text-sm text-gray-500">{formatDismissal(entry)}</td>
              <td className="py-2 text-right font-medium">{entry.runs ?? 0}</td>
              <td className="py-2 text-right text-gray-600">{entry.ballsFaced ?? 0}</td>
              <td className="py-2 text-right text-gray-600">{entry.fours ?? 0}</td>
              <td className="py-2 text-right text-gray-600">{entry.sixes ?? 0}</td>
              <td className="py-2 text-right text-gray-600">
                {entry.ballsFaced ? ((entry.runs ?? 0) / entry.ballsFaced * 100).toFixed(1) : '-'}
              </td>
            </tr>
          ))}
          {extras && (
            <tr className="border-b border-gray-100 text-gray-600">
              <td className="py-2 pr-2 font-medium" colSpan={2}>
                Extras
                <span className="text-xs ml-2 text-gray-400">
                  (b {extras.byes ?? 0}, lb {extras.legByes ?? 0}, w {extras.wides ?? 0}, nb {extras.noBalls ?? 0}
                  {(extras.penalties ?? 0) > 0 ? `, pen ${extras.penalties}` : ''})
                </span>
              </td>
              <td className="py-2 text-right" colSpan={5}>{extras.total ?? 0}</td>
            </tr>
          )}
          {score !== undefined && (
            <tr className="border-t-2 border-gray-200 font-semibold text-gray-900">
              <td className="py-2 pr-2" colSpan={2}>Total</td>
              <td className="py-2 text-right" colSpan={5}>
                {score}/{wickets ?? entries.filter(e => e.wicket).length}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderBowlingTable = (entries: BowlingEntryV1[]) => (
    <div className="mt-8 overflow-x-auto">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bowling</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
            <th className="py-2">Bowler</th>
            <th className="py-2 text-right">O</th>
            <th className="py-2 text-right">M</th>
            <th className="py-2 text-right">R</th>
            <th className="py-2 text-right">W</th>
            <th className="py-2 text-right">Econ</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {entries.map((entry, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 font-medium">{entry.playerName}</td>
              <td className="py-2 text-right text-gray-600">{entry.overs}</td>
              <td className="py-2 text-right text-gray-600">{entry.maidens ?? 0}</td>
              <td className="py-2 text-right text-gray-600">{entry.runs ?? 0}</td>
              <td className="py-2 text-right font-medium">{entry.wickets ?? 0}</td>
              <td className="py-2 text-right text-gray-600">
                {entry.overs ? ((entry.runs ?? 0) / (entry.overs as number)).toFixed(2) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFallOfWickets = (fowEntries: FoWEntryV1[]) => {
    if (!fowEntries || fowEntries.length === 0) return null;
    return (
      <div className="mt-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fall of Wickets</h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-700">
          {fowEntries.map((fow, index) => (
            <span key={index} className="whitespace-nowrap">
              {fow.score ?? 0}-{fow.wicket ?? (index + 1)}
              {fow.outgoingPlayer?.name && (
                <span className="text-gray-500">
                  {' '}({fow.outgoingPlayer.name}{fow.overs != null ? `, ${fow.overs}ov` : ''})
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderInningsContent = (
    innings: NonNullable<NonNullable<LiveScorecardV1['finalScorecard']>['ourInnings']>,
    teamName: string,
    teamIcon: React.ReactNode
  ) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-6">
      <div className="flex items-center gap-3 mb-5">
        {teamIcon}
        <div>
          <h2 className="text-lg font-semibold">{teamName} Innings</h2>
          <p className="text-sm text-gray-500">
            {innings.batting?.score ?? 0}/{innings.batting?.wickets ?? 0}
            {innings.inningsLength ? ` (${innings.inningsLength} ov)` : ''}
          </p>
        </div>
      </div>
      {renderBattingTable(
        innings.batting?.entries || [],
        innings.batting?.extras,
        innings.batting?.score,
        innings.batting?.wickets
      )}
      {innings.fow?.entries && renderFallOfWickets(innings.fow.entries)}
      {innings.bowling?.entries && innings.bowling.entries.length > 0 &&
        renderBowlingTable(innings.bowling.entries)}
    </div>
  );

  if (isLoading) {
    return (
      <div className="font-sans text-villageText bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans text-villageText bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Scorecard</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!scorecardData) {
    return (
      <div className="font-sans text-villageText bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-700">No scorecard data available for this match.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const live = isLive(scorecardData);
  const completed = isCompleted(scorecardData);
  const villageIsHome = scorecardData.matchData?.isHome !== false;
  const oppositionIsHomeTeam = completed && !villageIsHome;

  if (!scorecardData.inPlayData && !completed) {
    return (
      <div className="font-sans text-villageText bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-700">Match data is not yet available.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const data = scorecardData.inPlayData!;

  const fowByPlayerId = new Map(
    (data.fallOfWickets ?? []).map(f => [f.outGoingPlayerId, f])
  );

  // Scores to show in the hero header
  const ourScoreDisplay = completed
    ? `${scorecardData.finalScorecard?.ourInnings?.batting?.score ?? data.score ?? 0}/${scorecardData.finalScorecard?.ourInnings?.batting?.wickets ?? data.wickets ?? 0}`
    : (live && (data.ourInningsStatus === 'InProgress' || data.ourInningsStatus === 'Completed'))
      ? `${data.score ?? 0}/${data.wickets ?? 0}`
      : null;

  const theirScoreDisplay = completed
    ? `${scorecardData.finalScorecard?.theirInnings?.batting?.score ?? data.theirScore ?? 0}/${scorecardData.finalScorecard?.theirInnings?.batting?.wickets ?? data.theirWickets ?? 0}`
    : (live && (data.theirInningsStatus === 'InProgress' || data.theirInningsStatus === 'Completed'))
      ? `${data.theirScore ?? 0}/${data.theirWickets ?? 0}`
      : null;

  const hasOurInnings = completed
    ? (scorecardData.finalScorecard?.ourInnings?.batting?.entries?.length ?? 0) > 0
    : false;
  const hasTheirInnings = completed
    ? (scorecardData.finalScorecard?.theirInnings?.batting?.entries?.length ?? 0) > 0
    : false;
  const hasBothInnings = hasOurInnings && hasTheirInnings;

  const villageIcon = (size: string) => (
    <img src="/images/vcc_cricle_small.png" className={`${size} flex-shrink-0`} alt="The Village CC" />
  );
  const oppositionIcon = (size: string) => (
    <div className={`${size} rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0`}>
      <span className="text-gray-600 font-semibold text-xs sm:text-base">
        {(data.opposition || '').substring(0, 2).toUpperCase()}
      </span>
    </div>
  );

  // Section variables for conditional ordering
  const commentarySection = ((data.completedOvers?.length ?? 0) > 0 || (data.theirCompletedOvers?.length ?? 0) > 0) ? (
    <section className="max-w-6xl mx-auto mt-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-3 text-left"
          onClick={() => setCommentaryExpanded(prev => !prev)}
          aria-expanded={commentaryExpanded}
        >
          <span className="text-sm font-semibold text-gray-700">Over-by-over Commentary</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${commentaryExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {commentaryExpanded && (
          <div className="border-t border-gray-100 px-4 py-4">
            <div className="flex gap-2 mb-3 flex-wrap">
              {(data.completedOvers?.length ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCommentaryTab('vcc')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCommentaryTab === 'vcc'
                      ? 'bg-villageGreen text-white'
                      : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                  }`}
                >
                  VCC Commentary
                </button>
              )}
              {(data.theirCompletedOvers?.length ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCommentaryTab('oppo')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCommentaryTab === 'oppo'
                      ? 'bg-villageGreen text-white'
                      : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                  }`}
                >
                  Oppo Commentary
                </button>
              )}
            </div>
            {activeCommentaryTab === 'vcc' && (data.completedOvers?.length ?? 0) > 0 && (
              <div>
                {data.ourInningsCommentary && (
                  <p className="mb-3 text-sm text-gray-600 italic">{data.ourInningsCommentary}</p>
                )}
                {[...(data.completedOvers ?? [])].reverse().map((over, i, arr) => {
                  const overNum = over.over?.overNumber ?? (arr.length - i);
                  const balls = over.over?.balls
                    ? [...over.over.balls].sort((a, b) => (a.ballNumber ?? 0) - (b.ballNumber ?? 0))
                    : [];
                  return (
                    <div key={i} className={`py-4 text-sm ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{`Over ${overNum}`}</span>
                            {over.over?.bowler && (
                              <span className="text-gray-500">· {over.over.bowler}</span>
                            )}
                          </div>
                          <span className="text-gray-600 text-xs">
                            Village {over.scoreAtEndOfOver ?? 0}/{over.wicketsAtEndOfOver ?? 0}
                            <span className="ml-1 text-gray-400">(+{over.scoreForThisOver ?? 0})</span>
                          </span>
                        </div>
                        {over.over?.commentary && (
                          <p className="mt-1 text-xs text-gray-600 italic">{over.over.commentary}</p>
                        )}
                      </div>
                      {balls.length > 0 && (
                        <div className="space-y-2 pl-1" aria-label={`Over ${overNum} deliveries`}>
                          {balls.map((ball, bi) => {
                            const blob = getBallBlob(ball);
                            const fow = ball.wicket ? fowByPlayerId.get(ball.wicket.player) : undefined;
                            const statsText = formatBattingStats(fow?.outGoingPlayerScore, fow?.outgoingBatsmanInningsDetails);
                            return (
                              <div key={bi}>
                                <div className="flex items-center gap-2">
                                  <span
                                    data-testid="ball-blob"
                                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${blob.label.length >= 3 ? 'text-[9px]' : 'text-xs'} font-bold flex-shrink-0 ${blob.className}`}
                                  >
                                    {blob.label}
                                  </span>
                                  <div className="text-gray-600">
                                    <span className="font-mono text-xs text-gray-400 mr-1">{overNum}.{ball.ballNumber}</span>
                                    {ball.bowler && ball.batsmanName ? (
                                      <>
                                        {`${ball.bowler} to ${ball.batsmanName}, `}
                                        {ball.wicket ? <span className="font-bold text-red-700">OUT!</span> : getBallDescription(ball)}
                                      </>
                                    ) : (
                                      ball.wicket ? <span className="font-bold text-red-700">OUT!</span> : getBallDescription(ball)
                                    )}
                                  </div>
                                </div>
                                {ball.wicket && (
                                  <div className="ml-9 mt-1 bg-red-50 border border-red-100 rounded px-2 py-1 text-sm">
                                    {ball.wicket.playerName && (
                                      <div className="font-semibold text-gray-800">
                                        {ball.wicket.playerName} {formatWicketDismissal(ball.wicket)}{statsText}
                                      </div>
                                    )}
                                    {ball.wicket.description && (
                                      <div className="text-gray-500 italic text-xs mt-0.5">{ball.wicket.description}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {activeCommentaryTab === 'oppo' && (data.theirCompletedOvers?.length ?? 0) > 0 && (
              <div>
                {data.theirInningsCommentary && (
                  <p className="mb-3 text-sm text-gray-600 italic">{data.theirInningsCommentary}</p>
                )}
                {[...(data.theirCompletedOvers ?? [])].reverse().map((over, i, arr) => (
                  <div key={i} className={`py-3 text-sm ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className="font-medium">{`Over ${over.over ?? (arr.length - i)}`}</span>
                    <span className="ml-2 text-gray-500">
                      {data.opposition} {over.score ?? 0}/{over.wickets ?? 0}
                    </span>
                    {over.commentary && (
                      <p className="mt-1 text-gray-600">{over.commentary}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  ) : null;

  // In-play scorecard section for live matches — collapsible, shown below "At the Crease"
  const inPlayScorecardSection = (() => {
    if (!live) return null;

    const ourStatus = data.ourInningsStatus;
    const theirStatus = data.theirInningsStatus;

    // Build aggregated batting stats from completed overs ball-by-ball data
    const buildInPlayBattingRows = () => {
      const completedOvers = data.completedOvers ?? [];
      type BatsmanRow = {
        id: number; name: string; runs: number; balls: number;
        fours: number; sixes: number; isOut: boolean; battingOrder: number;
      };
      const batsmenMap = new Map<number, BatsmanRow>();
      let orderCounter = 0;

      completedOvers.forEach(over => {
        over.over?.balls?.forEach(ball => {
          if (ball.batsman == null) return;
          if (!batsmenMap.has(ball.batsman)) {
            batsmenMap.set(ball.batsman, {
              id: ball.batsman,
              name: ball.batsmanName ?? `Batsman ${orderCounter + 1}`,
              runs: 0, balls: 0, fours: 0, sixes: 0,
              isOut: false, battingOrder: orderCounter++,
            });
          }
          const entry = batsmenMap.get(ball.batsman)!;
          const thing = ball.thing ?? '';
          // Balls faced: everything except wides
          if (thing !== 'wd') entry.balls++;
          // Bat runs: normal deliveries and no-balls (no-ball penalty = 1 run, so bat runs = total - 1)
          if (thing === '' || thing === 'nb') {
            const batRuns = thing === 'nb' ? Math.max(0, (ball.amount ?? 0) - 1) : (ball.amount ?? 0);
            entry.runs += batRuns;
            // Prefer isSix/isBoundary flags; fall back to run count
            if (ball.isSix || batRuns >= 6) entry.sixes++;
            else if ((ball.isBoundary && !ball.isSix) || batRuns === 4) entry.fours++;
          }
          if (ball.wicket) entry.isOut = true;
        });
      });

      // Override current batsmen with live aggregated stats (these include the current in-progress over)
      const updateWithLiveBatsman = (liveBatsman: NonNullable<typeof data.onStrikeBatsman>) => {
        if (liveBatsman.playerId == null) return;
        const existing = batsmenMap.get(liveBatsman.playerId);
        if (existing) {
          existing.runs = liveBatsman.score ?? existing.runs;
          existing.balls = liveBatsman.balls ?? existing.balls;
          existing.fours = liveBatsman.fours ?? existing.fours;
          existing.sixes = liveBatsman.sixes ?? existing.sixes;
        } else {
          // Batsman appeared in the current (incomplete) over — add them
          batsmenMap.set(liveBatsman.playerId, {
            id: liveBatsman.playerId,
            name: liveBatsman.name ?? 'Unknown',
            runs: liveBatsman.score ?? 0,
            balls: liveBatsman.balls ?? 0,
            fours: liveBatsman.fours ?? 0,
            sixes: liveBatsman.sixes ?? 0,
            isOut: false,
            battingOrder: orderCounter++,
          });
        }
      };

      if (data.onStrikeBatsman) updateWithLiveBatsman(data.onStrikeBatsman);
      if (data.otherBatsman) updateWithLiveBatsman(data.otherBatsman);

      return Array.from(batsmenMap.values()).sort((a, b) => a.battingOrder - b.battingOrder);
    };

    const battingRows = (ourStatus === 'InProgress' || ourStatus === 'Completed') ? buildInPlayBattingRows() : [];

    // Bowling rows: use liveBowlingCard (all bowlers) or fall back to bowlerOneDetails/bowlerTwoDetails
    const bowlingRows: Array<{ name: string; overs?: number; maidens?: number; runs?: number; wickets?: number; economy?: number }> =
      (data.liveBowlingCard && data.liveBowlingCard.length > 0)
        ? data.liveBowlingCard.map(b => ({
            name: b.name ?? '',
            overs: b.details?.overs,
            maidens: b.details?.maidens,
            runs: b.details?.runs,
            wickets: b.details?.wickets,
            economy: b.details?.economy,
          }))
        : [data.bowlerOneDetails, data.bowlerTwoDetails]
            .filter((b): b is NonNullable<typeof b> => !!b)
            .map(b => ({
              name: b.name ?? '',
              overs: b.details?.overs,
              maidens: b.details?.maidens,
              runs: b.details?.runs,
              wickets: b.details?.wickets,
              economy: b.details?.economy,
            }));

    const fowEntries = data.fallOfWickets ?? [];

    const onStrikeId = data.onStrikeBatsman?.playerId;
    const otherBatsmanId = data.otherBatsman?.playerId;

    const ourInningsContent = (() => {
      if (ourStatus === 'NotStarted' || !ourStatus) {
        return (
          <div className="py-6 text-center text-sm text-gray-500">
            The Village CC innings has not yet started.
          </div>
        );
      }
      return (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="py-2 pr-2">Batter</th>
                  <th className="py-2 text-right">R</th>
                  <th className="py-2 text-right">B</th>
                  <th className="py-2 text-right">4s</th>
                  <th className="py-2 text-right">6s</th>
                  <th className="py-2 text-right">SR</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {battingRows.map((row, idx) => {
                  const isOnStrike = row.id === onStrikeId;
                  const isOther = row.id === otherBatsmanId;
                  const isBatting = isOnStrike || isOther;
                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 pr-2 font-medium">
                        {row.name}
                        {isOnStrike && <span className="ml-1 text-villageGreen text-xs font-bold">*</span>}
                        {isBatting && !row.isOut && (
                          <span className="ml-1 text-xs text-green-600 font-normal">(batting)</span>
                        )}
                      </td>
                      <td className="py-2 text-right font-medium">{row.runs}</td>
                      <td className="py-2 text-right text-gray-600">{row.balls}</td>
                      <td className="py-2 text-right text-gray-600">{row.fours}</td>
                      <td className="py-2 text-right text-gray-600">{row.sixes}</td>
                      <td className="py-2 text-right text-gray-600">
                        {row.balls > 0 ? (row.runs / row.balls * 100).toFixed(1) : '-'}
                      </td>
                    </tr>
                  );
                })}
                {battingRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-400">No batting data yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {fowEntries.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fall of Wickets</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-700">
                {fowEntries.map((fow, i) => (
                  <span key={i} className="whitespace-nowrap">
                    {fow.teamScore ?? 0}-{fow.wicketNumber ?? (i + 1)}
                    {fow.outgoingPlayerName && (
                      <span className="text-gray-500"> ({fow.outgoingPlayerName}{fow.overAsString ? `, ${fow.overAsString}` : ''})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {bowlingRows.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bowling</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="py-2">Bowler</th>
                    <th className="py-2 text-right">O</th>
                    <th className="py-2 text-right">M</th>
                    <th className="py-2 text-right">R</th>
                    <th className="py-2 text-right">W</th>
                    <th className="py-2 text-right">Econ</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {bowlingRows.map((bowler, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 font-medium">{bowler.name}</td>
                      <td className="py-2 text-right text-gray-600">{bowler.overs ?? '-'}</td>
                      <td className="py-2 text-right text-gray-600">{bowler.maidens ?? 0}</td>
                      <td className="py-2 text-right text-gray-600">{bowler.runs ?? 0}</td>
                      <td className="py-2 text-right font-medium">{bowler.wickets ?? 0}</td>
                      <td className="py-2 text-right text-gray-600">
                        {bowler.economy != null ? bowler.economy.toFixed(2) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    })();

    const theirInningsContent = (() => {
      if (theirStatus === 'NotStarted' || !theirStatus) {
        return (
          <div className="py-6 text-center text-sm text-gray-500">
            {data.opposition ?? 'Opposition'} innings has not yet started.
          </div>
        );
      }
      return (
        <div>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
            <span className="font-semibold">{data.opposition ?? 'Opposition'}</span>
            {': '}
            <span className="font-semibold text-gray-900">
              {data.theirScore ?? 0}/{data.theirWickets ?? 0}
            </span>
            {data.theirOver != null && data.theirOver > 0 && (
              <span className="text-gray-500"> ({data.theirOver} ov)</span>
            )}
            {theirStatus === 'InProgress' && (
              <span className="ml-2 text-xs text-green-600 font-semibold">In progress</span>
            )}
          </div>
          {(data.theirCompletedOvers?.length ?? 0) > 0 && (
            <div className="text-xs text-gray-500 mt-2">
              <p className="font-semibold uppercase tracking-wide mb-1">Over summary</p>
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                {data.theirCompletedOvers!.map((ov, i) => (
                  <span key={i} className="whitespace-nowrap">
                    Ov {ov.over ?? (i + 1)}: {ov.score ?? 0}/{ov.wickets ?? 0}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(data.theirCompletedOvers?.length ?? 0) === 0 && theirStatus === 'InProgress' && (
            <p className="text-sm text-gray-500">Detailed ball-by-ball data not available for opposition innings.</p>
          )}
        </div>
      );
    })();

    const showBothInnings = !!(ourStatus && ourStatus !== 'NotStarted') && !!(theirStatus && theirStatus !== 'NotStarted');

    return (
      <section className="max-w-6xl mx-auto mt-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <button
            type="button"
            className="w-full flex justify-between items-center px-4 py-3 text-left"
            onClick={() => setScorecardExpanded(prev => !prev)}
            aria-expanded={scorecardExpanded}
          >
            <span className="text-sm font-semibold text-gray-700">Scorecards</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${scorecardExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {scorecardExpanded && (
            <div className="border-t border-gray-100 px-4 py-4">
              {showBothInnings && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveInnings('our')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeInnings === 'our'
                        ? 'bg-villageGreen text-white'
                        : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                    }`}
                  >
                    The Village CC Innings
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInnings('their')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeInnings === 'their'
                        ? 'bg-villageGreen text-white'
                        : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                    }`}
                  >
                    {data.opposition ?? 'Opposition'} Innings
                  </button>
                </div>
              )}
              {(!showBothInnings || activeInnings === 'our') && ourInningsContent}
              {(!showBothInnings || activeInnings === 'their') && theirInningsContent}
            </div>
          )}
        </div>
      </section>
    );
  })();

  const matchReportSection = (completed && scorecardData.matchReport && (scorecardData.matchReport.conditions || scorecardData.matchReport.report)) ? (
    <section className="max-w-6xl mx-auto mt-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Match Report</h2>
        {scorecardData.matchReport.conditions && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Conditions</h3>
            <p className="text-sm text-gray-700">{scorecardData.matchReport.conditions}</p>
          </div>
        )}
        {scorecardData.matchReport.report && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Report</h3>
            <div className="text-sm text-gray-700 prose prose-sm max-w-none"
                 dangerouslySetInnerHTML={{ __html: scorecardData.matchReport.report }} />
          </div>
        )}
      </div>
    </section>
  ) : null;

  // At the Crease section for live matches — always visible, first section after hero
  const atTheCreaseSection = (() => {
    if (!live) return null;

    const completedOversForDisplay = data.completedOvers ?? [];
    const hasAtCrease = !!(data.onStrikeBatsman || data.otherBatsman || data.bowlerOneDetails || data.bowlerTwoDetails);
    const hasOversDisplay = completedOversForDisplay.length > 0;

    if (!hasAtCrease && !hasOversDisplay) return null;

    const recentOvers = completedOversForDisplay.slice(-5);

    return (
      <section className="max-w-6xl mx-auto mt-2 sm:mt-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 sm:px-6 py-4 sm:py-6">
          <h2 className="text-base font-semibold text-gray-800 mb-3 sm:mb-4">At the Crease</h2>

          {hasAtCrease && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 sm:mb-4">
              {(data.onStrikeBatsman || data.otherBatsman) && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Batting</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="pb-1.5 text-left font-normal">Batter</th>
                        <th className="pb-1.5 text-right font-normal">R</th>
                        <th className="pb-1.5 text-right font-normal">B</th>
                        <th className="pb-1.5 text-right font-normal">4s</th>
                        <th className="pb-1.5 text-right font-normal">6s</th>
                        <th className="pb-1.5 text-right font-normal">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.onStrikeBatsman && (
                        <tr className="border-b border-gray-50">
                          <td className="py-1.5 font-medium">
                            {data.onStrikeBatsman.name}
                            <span className="ml-1 text-villageGreen text-xs font-bold">*</span>
                          </td>
                          <td className="py-1.5 text-right font-medium">{data.onStrikeBatsman.score ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">{data.onStrikeBatsman.balls ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">{data.onStrikeBatsman.fours ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">{data.onStrikeBatsman.sixes ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">
                            {data.onStrikeBatsman.strikeRate != null ? data.onStrikeBatsman.strikeRate.toFixed(1) : '-'}
                          </td>
                        </tr>
                      )}
                      {data.otherBatsman && (
                        <tr>
                          <td className="py-1.5 font-medium">{data.otherBatsman.name}</td>
                          <td className="py-1.5 text-right font-medium">{data.otherBatsman.score ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">{data.otherBatsman.balls ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">{data.otherBatsman.fours ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">{data.otherBatsman.sixes ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">
                            {data.otherBatsman.strikeRate != null ? data.otherBatsman.strikeRate.toFixed(1) : '-'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {data.currentPartnership && (
                    <p className="mt-2 text-xs text-gray-500">
                      Partnership: {data.currentPartnership.score ?? 0} runs
                      {data.currentPartnership.oversAsString && ` (${data.currentPartnership.oversAsString} ov)`}
                    </p>
                  )}
                </div>
              )}
              {(data.bowlerOneDetails || data.bowlerTwoDetails) && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bowling</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="pb-1.5 text-left font-normal">Bowler</th>
                        <th className="pb-1.5 text-right font-normal">O</th>
                        <th className="pb-1.5 text-right font-normal">M</th>
                        <th className="pb-1.5 text-right font-normal">R</th>
                        <th className="pb-1.5 text-right font-normal">W</th>
                        <th className="pb-1.5 text-right font-normal">Econ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[data.bowlerOneDetails, data.bowlerTwoDetails].filter(Boolean).map((bowler, i, arr) => (
                        <tr key={i} className={i < arr.length - 1 ? 'border-b border-gray-50' : ''}>
                          <td className="py-1.5 font-medium">{bowler!.name}</td>
                          <td className="py-1.5 text-right text-gray-600">{bowler!.details?.overs ?? '-'}</td>
                          <td className="py-1.5 text-right text-gray-600">{bowler!.details?.maidens ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">{bowler!.details?.runs ?? 0}</td>
                          <td className="py-1.5 text-right font-medium">{bowler!.details?.wickets ?? 0}</td>
                          <td className="py-1.5 text-right text-gray-600">
                            {bowler!.details?.economy != null ? bowler!.details.economy.toFixed(2) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Score bar */}
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div className="font-semibold text-gray-900">
                {data.ourInningsStatus === 'InProgress' ? (
                  <>The Village CC <span className="text-villageGreen">{data.score}/{data.wickets}</span> ({data.ourLastCompletedOver} ov) · CRR {(data.runRate ?? 0).toFixed(2)}</>
                ) : data.theirInningsStatus === 'InProgress' ? (
                  <>{data.opposition} <span className="text-villageGreen">{data.theirScore}/{data.theirWickets}</span> ({data.theirOver} ov) · CRR {(data.theirRunRate ?? 0).toFixed(2)}</>
                ) : null}
              </div>
              {data.ourInningsStatus === 'Completed' && data.theirInningsStatus === 'InProgress' && (
                <div className="text-gray-500 text-xs">
                  Target: {(data.score ?? 0) + 1} runs
                </div>
              )}
            </div>
          </div>

          {/* Horizontal over-by-over ball display */}
          {hasOversDisplay && (
            <div className="overflow-x-auto">
              <div
                className="flex items-center gap-0 text-sm font-mono whitespace-nowrap py-1"
                data-testid="horizontal-overs"
              >
                {[...recentOvers].reverse().map((overData, idx) => {
                  const overNum = overData.over?.overNumber ?? (completedOversForDisplay.length - idx);
                  const balls = overData.over?.balls
                    ? [...overData.over.balls].sort((a, b) => (b.ballNumber ?? 0) - (a.ballNumber ?? 0))
                    : [];
                  const runsThisOver = overData.scoreForThisOver;
                  return (
                    <span key={idx} className="flex items-center flex-shrink-0">
                      {idx > 0 && <span className="mx-2 text-gray-400">|</span>}
                      {runsThisOver !== undefined && runsThisOver !== null && (
                        <span className="text-xs font-semibold text-gray-500 flex-shrink-0 mx-1">
                          ({runsThisOver})
                        </span>
                      )}
                      {balls.length > 0 ? balls.map((ball, bi) => {
                        const blob = getBallBlob(ball);
                        return (
                          <span
                            key={bi}
                            data-testid="ball-blob"
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${blob.label.length >= 3 ? 'text-[9px]' : 'text-xs'} font-bold flex-shrink-0 mx-0.5 ${blob.className}`}
                          >
                            {blob.label}
                          </span>
                        );
                      }) : <span className="text-gray-400">—</span>}
                      <span className="font-semibold text-gray-700 ml-1">{toOrdinal(overNum)}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  })();

  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />

      <main>
        {/* Hero Match Card */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-6xl mx-auto mt-2 sm:mt-6 px-4 sm:px-6 py-3 sm:py-5">
          {/* Match meta */}
          <p className="text-center text-xs text-gray-500 mb-2 sm:mb-4">
            {scorecardData.matchData?.type || (data.declarationGame ? 'Declaration' : `${data.overs}-over match`)}
            {' · '}
            {scorecardData.result?.venueName || scorecardData.matchData?.venue?.name || 'TBC'}
            {' · '}
            {formatDate(scorecardData.matchData?.date || scorecardData.result?.matchDate || undefined)}
          </p>

          <div className="flex flex-row items-center justify-between gap-2 sm:gap-6">
            {/* Left team */}
            {oppositionIsHomeTeam ? (
              <div className="flex flex-col items-center gap-1 sm:gap-2 min-w-0 flex-1 text-center">
                {oppositionIcon('h-9 w-9 sm:h-14 sm:w-14')}
                <h1 className="text-xs sm:text-base font-semibold">{data.opposition}</h1>
                {theirScoreDisplay && <p className="text-xl sm:text-3xl font-bold">{theirScoreDisplay}</p>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 sm:gap-2 min-w-0 flex-1 text-center">
                {villageIcon('h-9 w-9 sm:h-14 sm:w-14')}
                <h1 className="text-xs sm:text-base font-semibold">The Village CC</h1>
                {ourScoreDisplay && <p className="text-xl sm:text-3xl font-bold">{ourScoreDisplay}</p>}
              </div>
            )}

            {/* Centre: Status */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0 px-1 text-center">
              {live ? (
                <>
                  <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    LIVE
                  </span>
                  <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></span>
                </>
              ) : completed ? (
                <>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {scorecardData.result?.resultText?.trim() || 'COMPLETED'}
                  </span>
                  {scorecardData.result?.margin &&
                    scorecardData.result.margin.trim() !== '' &&
                    scorecardData.result.margin !== 'result not yet in' && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">{scorecardData.result.margin}</span>
                  )}
                </>
              ) : scorecardData.result?.isAbandoned ? (
                <span className="bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  ABANDONED
                </span>
              ) : (
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  SCHEDULED
                </span>
              )}
            </div>

            {/* Right team */}
            {oppositionIsHomeTeam ? (
              <div className="flex flex-col items-center gap-1 sm:gap-2 min-w-0 flex-1 text-center">
                {villageIcon('h-9 w-9 sm:h-14 sm:w-14')}
                <h1 className="text-xs sm:text-base font-semibold">The Village CC</h1>
                {ourScoreDisplay && <p className="text-xl sm:text-3xl font-bold">{ourScoreDisplay}</p>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 sm:gap-2 min-w-0 flex-1 text-center">
                {oppositionIcon('h-9 w-9 sm:h-14 sm:w-14')}
                <h1 className="text-xs sm:text-base font-semibold">{data.opposition}</h1>
                {theirScoreDisplay && <p className="text-xl sm:text-3xl font-bold">{theirScoreDisplay}</p>}
              </div>
            )}
          </div>

          {/* Toss info */}
          <p className="mt-2 sm:mt-3 text-center text-xs text-gray-500">
            {data.wonToss ? 'The Village CC' : data.opposition} won the toss and elected to {data.tossWinnerBatted ? 'bat' : 'field'}
          </p>
        </section>

        {/* Ordered sections: different arrangement for live vs completed */}
        {live ? (
          <>
            {/* Live order: 1. At the Crease (always visible), 2. Scorecards (collapsible), 3. Commentary (folded), 4. Analysis, 5. Player Analysis */}
            {atTheCreaseSection}
            {inPlayScorecardSection}
            {commentarySection}
            {/* Team Analysis section for live matches */}
            {((data.completedOvers?.length ?? 0) > 0 || (data.partnerships?.length ?? 0) > 0) && (() => {
              const ourOvers = data.completedOvers ?? [];
              const theirOvers = data.theirCompletedOvers ?? [];
              const partnerships = data.partnerships ?? [];

              const ourCumulative = ourOvers.map(o => o.scoreAtEndOfOver ?? 0);
              const ourPerOver = ourOvers.map(o => o.scoreForThisOver ?? 0);

              const theirByOver: number[] = [];
              const theirCumulative: number[] = [];
              if (theirOvers.length > 0) {
                const sortedTheirOvers = [...theirOvers]
                  .filter(o => (o.over ?? 0) > 0)
                  .sort((a, b) => (a.over ?? 0) - (b.over ?? 0));
                let prevOver = 0;
                let prevScore = 0;
                for (const point of sortedTheirOvers) {
                  const currentOver = point.over ?? 0;
                  const currentScore = point.score ?? prevScore;
                  const runsInSegment = currentScore - prevScore;
                  const oversInSegment = currentOver - prevOver;
                  const runsPerOver = oversInSegment > 0 ? runsInSegment / oversInSegment : 0;
                  for (let ov = prevOver + 1; ov <= currentOver; ov++) {
                    theirByOver.push(runsPerOver);
                    theirCumulative.push(prevScore + runsPerOver * (ov - prevOver));
                  }
                  prevOver = currentOver;
                  prevScore = currentScore;
                }
              }

              const wagonWheelBalls = ourOvers
                .flatMap(o => o.over?.balls ?? [])
                .filter(b => b.angle != null && (b.thing === '' || b.thing === null || b.thing === undefined || (b.thing === 'nb' && (b.amount ?? 0) > 1)));

              const tabBtn = (tab: 'worm' | 'manhattan' | 'partnerships' | 'wagon', label: string) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveAnalysisTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeAnalysisTab === tab
                      ? 'bg-villageGreen text-white'
                      : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                  }`}
                >
                  {label}
                </button>
              );

              const wormData = {
                labels: Array.from(
                  { length: Math.max(ourCumulative.length, theirCumulative.length) },
                  (_, i) => String(i + 1)
                ),
                datasets: [
                  {
                    label: 'The Village CC',
                    data: ourCumulative,
                    borderColor: '#1d7a4b',
                    backgroundColor: 'transparent',
                    tension: 0.1,
                    pointRadius: 2,
                  },
                  ...(theirCumulative.length > 0 ? [{
                    label: data.opposition ?? 'Opposition',
                    data: theirCumulative,
                    borderColor: '#d4a017',
                    backgroundColor: 'transparent',
                    tension: 0.1,
                    pointRadius: 2,
                  }] : []),
                ],
              };

              const allManhattanLabels = (() => {
                const maxLen = Math.max(ourPerOver.length, theirByOver.length);
                return Array.from({ length: maxLen }, (_, i) => String(i + 1));
              })();

              const manhattanData = {
                labels: allManhattanLabels,
                datasets: [
                  {
                    label: 'The Village CC',
                    data: ourPerOver,
                    backgroundColor: '#1d7a4b',
                  },
                  ...(theirByOver.length > 0 ? [{
                    label: data.opposition ?? 'Opposition',
                    data: theirByOver,
                    backgroundColor: '#d4a017',
                  }] : []),
                ],
              };

              const chartOptions = {
                responsive: true,
                plugins: { legend: { position: 'top' as const } },
              };

              return (
                <section className="max-w-6xl mx-auto mt-4">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 text-left"
                    onClick={() => setAnalysisExpanded(prev => !prev)}
                    aria-expanded={analysisExpanded}
                  >
                    <span className="text-sm font-semibold text-gray-700">Team Analysis</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${analysisExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {analysisExpanded && (
                    <div className="border-t border-gray-100 px-4 py-4">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {ourOvers.length > 0 && tabBtn('worm', 'Worm')}
                        {ourOvers.length > 0 && tabBtn('manhattan', 'Manhattan')}
                        {partnerships.length > 0 && tabBtn('partnerships', 'Partnerships')}
                        {wagonWheelBalls.length > 0 && tabBtn('wagon', 'Wagon Wheel')}
                      </div>
                    {activeAnalysisTab === 'worm' && ourOvers.length > 0 && (
                      <Line data={wormData} options={chartOptions} />
                    )}
                    {activeAnalysisTab === 'manhattan' && ourOvers.length > 0 && (
                      <Bar data={manhattanData} options={chartOptions} />
                    )}
                    {activeAnalysisTab === 'partnerships' && partnerships.length > 0 && (() => {
                      const svgW = 600;
                      const rowH = 40;
                      const rowGap = 8;
                      const centerX = svgW / 2;
                      const halfW = centerX - 4;
                      const highScore = Math.max(
                        ...partnerships.map(p => Math.max(p.player1Score ?? 0, p.player2Score ?? 0)),
                        1
                      );
                      const svgH = partnerships.length * (rowH + rowGap) + rowGap + 20;
                      const barSize = (score: number) => (score / Math.max(highScore, 1)) * halfW;
                      const textPad = 6;
                      const minBarWidthForInsideLabel = 60;
                      const battingEntries = scorecardData.finalScorecard?.ourInnings?.batting?.entries ?? [];
                      const getPlayerNameById = (id?: number) => battingEntries.find((e: BattingEntryV1) => e.playerId === id)?.playerName ?? undefined;
                      return (
                        <svg
                          data-testid="partnerships-chart"
                          viewBox={`0 0 ${svgW} ${svgH}`}
                          className="w-full"
                          style={{ maxHeight: 600 }}
                        >
                          {partnerships.map((p, i) => {
                            const y = rowGap + i * (rowH + rowGap);
                            const p1Score = p.player1Score ?? 0;
                            const p2Score = p.player2Score ?? 0;
                            const leftW = barSize(p1Score);
                            const rightW = barSize(p2Score);
                            const p1Name = getPlayerNameById(p.playerId1);
                            const p2Name = getPlayerNameById(p.playerId2);
                            const p1Label = p1Score > 0 ? `${p1Name ?? 'Bat 1'} (${p1Score})` : (p1Name ?? 'Bat 1');
                            const p2Label = p2Score > 0 ? `${p2Name ?? 'Bat 2'} (${p2Score})` : (p2Name ?? 'Bat 2');
                            return (
                              <g key={i}>
                                <rect x={centerX - leftW} y={y} width={leftW} height={rowH} fill="#1d7a4b" />
                                <rect x={centerX} y={y} width={rightW} height={rowH} fill="#d4a017" />
                                {leftW > minBarWidthForInsideLabel ? (
                                  <text x={centerX - leftW + textPad} y={y + rowH / 2} dominantBaseline="middle" textAnchor="start" fontSize={12} fill="#fff">{p1Label}</text>
                                ) : (
                                  <text x={centerX - leftW - textPad} y={y + rowH / 2} dominantBaseline="middle" textAnchor="end" fontSize={12} fill="#333">{p1Label}</text>
                                )}
                                {rightW > minBarWidthForInsideLabel ? (
                                  <text x={centerX + rightW - textPad} y={y + rowH / 2} dominantBaseline="middle" textAnchor="end" fontSize={12} fill="#fff">{p2Label}</text>
                                ) : (
                                  <text x={centerX + rightW + textPad} y={y + rowH / 2} dominantBaseline="middle" textAnchor="start" fontSize={12} fill="#333">{p2Label}</text>
                                )}
                              </g>
                            );
                          })}
                          <line x1={centerX} y1={0} x2={centerX} y2={svgH} stroke="#999" strokeWidth={1} />
                        </svg>
                      );
                    })()}
                    {activeAnalysisTab === 'wagon' && wagonWheelBalls.length > 0 && (() => {
                      const svgW = 500;
                      const svgH = 420;
                      const fieldCx = svgW / 2;
                      const fieldCy = 200;
                      const fieldRx = 190;
                      const fieldRy = 160;
                      const stumpsX = fieldCx;
                      const stumpsY = 180;
                      const radius = fieldRx;

                      const wheelDistance = (score: number, angle: number, r: number): number => {
                        let scale = r / 4;
                        if (score === 6) scale *= 0.75;
                        let dist = score * scale;
                        const halfPi = Math.PI / 2;
                        if (angle <= halfPi) {
                          dist -= score * 5 * ((halfPi - angle) / halfPi);
                        } else if (angle <= Math.PI) {
                          dist += score * 5 * ((angle - halfPi) / halfPi);
                        } else if (angle <= Math.PI * 1.5) {
                          dist += score * 5 * ((Math.PI * 1.5 - angle) / halfPi);
                        } else {
                          dist -= score * 5 * ((angle - Math.PI * 1.5) / halfPi);
                        }
                        return dist;
                      };

                      const ballEndPoint = (angle: number, dist: number) => ({
                        x: Math.round(Math.cos(angle - Math.PI / 2) * dist + stumpsX),
                        y: Math.round(Math.sin(angle - Math.PI / 2) * dist + stumpsY),
                      });

                      const ballColor = (score: number) =>
                        score >= 6 ? '#f97316' : score >= 4 ? '#3b82f6' : '#ffdd00';

                      const keyY = svgH - 30;

                      return (
                        <svg data-testid="wagon-wheel" viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: 480 }}>
                          <ellipse cx={fieldCx} cy={fieldCy} rx={fieldRx} ry={fieldRy} fill="#4a8f3f" />
                          <ellipse cx={fieldCx} cy={fieldCy} rx={fieldRx * 0.5} ry={fieldRy * 0.5}
                            fill="#3a7f2f" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
                          <rect x={stumpsX - 7} y={stumpsY - 45} width={14} height={90} fill="#c8a96e" rx="2" />
                          <text x={fieldCx - fieldRx * 0.55} y={fieldCy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Off Side</text>
                          <text x={fieldCx + fieldRx * 0.55} y={fieldCy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Leg Side</text>
                          {wagonWheelBalls.map((ball, idx) => {
                            const angle = ball.angle!;
                            const rawScore = ball.amount ?? 0;
                            const score = ball.thing === 'nb' ? rawScore - 1 : rawScore;
                            if (score <= 0) return null;
                            const dist = wheelDistance(score, angle, radius);
                            const end = ballEndPoint(angle, dist);
                            return (
                              <line key={idx} x1={stumpsX} y1={stumpsY} x2={end.x} y2={end.y} stroke={ballColor(score)} strokeWidth={2} strokeOpacity={0.85} />
                            );
                          })}
                          <line x1={10} y1={keyY} x2={50} y2={keyY} stroke="#ffdd00" strokeWidth={4} />
                          <text x={55} y={keyY + 4} fontSize={13} fill="#333">Runs</text>
                          <line x1={110} y1={keyY} x2={150} y2={keyY} stroke="#3b82f6" strokeWidth={4} />
                          <text x={155} y={keyY + 4} fontSize={13} fill="#333">Fours</text>
                          <line x1={215} y1={keyY} x2={255} y2={keyY} stroke="#f97316" strokeWidth={4} />
                          <text x={260} y={keyY + 4} fontSize={13} fill="#333">Sixes</text>
                        </svg>
                      );
                    })()}
                    </div>
                  )}
                  </div>
                </section>
              );
            })()}
            {/* Player Analysis section for live matches */}
            {(data.completedOvers?.length ?? 0) > 0 && (() => {
              const allBalls = (data.completedOvers ?? []).flatMap(o => o.over?.balls ?? []);
              const isLegalDelivery = (ball: BallV1) => {
                const thing = ball.thing ?? '';
                return thing === '' || (thing === 'nb' && (ball.amount ?? 0) > 1);
              };
              const playerBallMap = new Map<number, { name: string; legalBalls: BallV1[]; allBalls: BallV1[] }>();
              allBalls.forEach(ball => {
                if (ball.batsman != null && ball.batsmanName) {
                  if (!playerBallMap.has(ball.batsman)) {
                    playerBallMap.set(ball.batsman, { name: ball.batsmanName, legalBalls: [], allBalls: [] });
                  }
                  const entry = playerBallMap.get(ball.batsman)!;
                  entry.allBalls.push(ball);
                  if (isLegalDelivery(ball)) {
                    entry.legalBalls.push(ball);
                  }
                }
              });
              const players = Array.from(playerBallMap.entries())
                .map(([id, { name, legalBalls, allBalls: pBalls }]) => ({ id, name, legalBalls, allBalls: pBalls }))
                .filter(p => p.legalBalls.length > 0);

              if (players.length === 0) return null;

              const getShortName = (name: string): string => {
                const parts = name.split(' ');
                let short = parts.map(p => p.charAt(0)).join('');
                if (short.length > 3) {
                  short = short.charAt(0) + short.charAt(1) + short.charAt(short.length - 1);
                }
                return short;
              };

              const effectivePlayerId = selectedPlayerId ?? players[0].id;
              const selectedPlayer = players.find(p => p.id === effectivePlayerId) ?? players[0];

              const playerWormPoints: { ball: number; score: number; sr: number }[] = [];
              let cumScore = 0;
              selectedPlayer.legalBalls.forEach((ball, idx) => {
                cumScore += ball.amount ?? 0;
                const ballNum = idx + 1;
                playerWormPoints.push({ ball: ballNum, score: cumScore, sr: (cumScore / ballNum) * 100 });
              });
              const maxSR = Math.max(...playerWormPoints.map(p => p.sr), 1);
              const finalScore = Math.max(cumScore, 1);
              const playerWormData = {
                labels: playerWormPoints.map(p => String(p.ball)),
                datasets: [
                  {
                    label: 'Score',
                    data: playerWormPoints.map(p => p.score),
                    borderColor: '#1d7a4b',
                    backgroundColor: 'transparent',
                    tension: 0.1,
                    pointRadius: 2,
                  },
                  {
                    label: 'Strike Rate (scaled)',
                    data: playerWormPoints.map(p => (p.sr / maxSR) * finalScore),
                    borderColor: '#d4a017',
                    backgroundColor: 'transparent',
                    tension: 0.1,
                    pointRadius: 2,
                  },
                ],
              };
              const playerWormOptions = {
                responsive: true,
                plugins: { legend: { position: 'top' as const } },
                scales: { x: { title: { display: true, text: 'Balls Faced' } } },
              };

              const playerWagonBalls = selectedPlayer.allBalls.filter(
                b => b.angle != null && isLegalDelivery(b)
              );

              return (
                <section className="max-w-6xl mx-auto mt-4">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 text-left"
                    onClick={() => setPlayerAnalysisExpanded(prev => !prev)}
                    aria-expanded={playerAnalysisExpanded}
                  >
                    <span className="text-sm font-semibold text-gray-700">Player Analysis</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${playerAnalysisExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {playerAnalysisExpanded && (
                    <div className="border-t border-gray-100 px-4 py-4">
                      <div className="flex gap-2 mb-3 flex-wrap items-center">
                        {players.map(player => (
                          <button
                            key={player.id}
                            type="button"
                            onClick={() => setSelectedPlayerId(player.id)}
                            title={player.name}
                            aria-label={player.name}
                            className={`w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 border-2 ${
                              player.id === effectivePlayerId
                                ? 'bg-villageGreen text-white border-villageGreen'
                                : 'bg-white text-villageGreen border-villageGreen hover:bg-villageGreenLight'
                            }`}
                          >
                            {getShortName(player.name)}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setActivePlayerAnalysisTab('worm')}
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            activePlayerAnalysisTab === 'worm'
                              ? 'bg-villageGreen text-white'
                              : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                          }`}
                        >
                          Player Worm
                        </button>
                        {playerWagonBalls.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setActivePlayerAnalysisTab('wagon')}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              activePlayerAnalysisTab === 'wagon'
                                ? 'bg-villageGreen text-white'
                                : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                            }`}
                          >
                            Wagon Wheel
                          </button>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">{selectedPlayer.name}</p>
                      {activePlayerAnalysisTab === 'worm' && playerWormPoints.length > 0 && (
                        <Line data={playerWormData} options={playerWormOptions} />
                      )}
                      {activePlayerAnalysisTab === 'worm' && playerWormPoints.length === 0 && (
                        <p className="text-sm text-gray-500">No ball-by-ball data available for this player.</p>
                      )}
                      {activePlayerAnalysisTab === 'wagon' && (() => {
                          const svgW = 500;
                          const svgH = 420;
                          const fieldCx = svgW / 2;
                          const fieldCy = 200;
                          const fieldRx = 190;
                          const fieldRy = 160;
                          const stumpsX = fieldCx;
                          const stumpsY = 180;
                          const radius = fieldRx;

                          const wheelDistance = (score: number, angle: number, r: number): number => {
                            let scale = r / 4;
                            if (score === 6) scale *= 0.75;
                            let dist = score * scale;
                            const halfPi = Math.PI / 2;
                            if (angle <= halfPi) {
                              dist -= score * 5 * ((halfPi - angle) / halfPi);
                            } else if (angle <= Math.PI) {
                              dist += score * 5 * ((angle - halfPi) / halfPi);
                            } else if (angle <= Math.PI * 1.5) {
                              dist += score * 5 * ((Math.PI * 1.5 - angle) / halfPi);
                            } else {
                              dist -= score * 5 * ((angle - Math.PI * 1.5) / halfPi);
                            }
                            return dist;
                          };

                          const ballEndPoint = (angle: number, dist: number) => ({
                            x: Math.round(Math.cos(angle - Math.PI / 2) * dist + stumpsX),
                            y: Math.round(Math.sin(angle - Math.PI / 2) * dist + stumpsY),
                          });

                          const ballColor = (score: number) =>
                            score >= 6 ? '#f97316' : score >= 4 ? '#3b82f6' : '#ffdd00';

                          const keyY = svgH - 30;

                          return (
                            <svg data-testid="player-wagon-wheel" viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: 480 }}>
                              <ellipse cx={fieldCx} cy={fieldCy} rx={fieldRx} ry={fieldRy} fill="#4a8f3f" />
                              <ellipse cx={fieldCx} cy={fieldCy} rx={fieldRx * 0.5} ry={fieldRy * 0.5}
                                fill="#3a7f2f" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
                              <rect x={stumpsX - 7} y={stumpsY - 45} width={14} height={90} fill="#c8a96e" rx="2" />
                              <text x={fieldCx - fieldRx * 0.55} y={fieldCy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Off Side</text>
                              <text x={fieldCx + fieldRx * 0.55} y={fieldCy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Leg Side</text>
                              {playerWagonBalls.map((ball, idx) => {
                                const angle = ball.angle!;
                                const rawScore = ball.amount ?? 0;
                                const score = ball.thing === 'nb' ? rawScore - 1 : rawScore;
                                if (score <= 0) return null;
                                const dist = wheelDistance(score, angle, radius);
                                const end = ballEndPoint(angle, dist);
                                return (
                                  <line key={idx} x1={stumpsX} y1={stumpsY} x2={end.x} y2={end.y} stroke={ballColor(score)} strokeWidth={2} strokeOpacity={0.85} />
                                );
                              })}
                              <line x1={10} y1={keyY} x2={50} y2={keyY} stroke="#ffdd00" strokeWidth={4} />
                              <text x={55} y={keyY + 4} fontSize={13} fill="#333">Runs</text>
                              <line x1={110} y1={keyY} x2={150} y2={keyY} stroke="#3b82f6" strokeWidth={4} />
                              <text x={155} y={keyY + 4} fontSize={13} fill="#333">Fours</text>
                              <line x1={215} y1={keyY} x2={255} y2={keyY} stroke="#f97316" strokeWidth={4} />
                              <text x={260} y={keyY + 4} fontSize={13} fill="#333">Sixes</text>
                            </svg>
                          );
                      })()}
                    </div>
                  )}
                  </div>
                </section>
              );
            })()}
          </>
        ) : (
          <>
            {/* Completed order: 1. Match Report (always visible), 2. Unified tab section */}
            {matchReportSection}

            {/* Unified tab section for completed match */}
            {completed && (() => {
              const hasCommentaryData = (data.completedOvers?.length ?? 0) > 0 || (data.theirCompletedOvers?.length ?? 0) > 0;
              const hasAnalysisData = (data.completedOvers?.length ?? 0) > 0 || (data.partnerships?.length ?? 0) > 0;
              const allBallsForPlayers = (data.completedOvers ?? []).flatMap(o => o.over?.balls ?? []);
              const hasPlayerData = allBallsForPlayers.some(b => b.batsman != null && b.batsmanName);
              const hasAnySection = (hasOurInnings || hasTheirInnings) || hasCommentaryData || hasAnalysisData;
              if (!hasAnySection) return null;

              // Default to the first available tab if none is explicitly selected
              const effectiveSectionTab: typeof activeSectionTab = activeSectionTab ??
                ((hasOurInnings || hasTheirInnings) ? 'scorecard'
                  : hasCommentaryData ? 'commentary'
                  : hasAnalysisData ? 'analysis'
                  : 'players');

              const tabBtnClass = (tab: typeof activeSectionTab) =>
                `px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors border-b-2 ${
                  effectiveSectionTab === tab
                    ? 'border-villageGreen text-villageGreen'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`;

              const scorecardContent = (hasOurInnings || hasTheirInnings) ? (
                <div>
                  {hasBothInnings && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setActiveInnings('our')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          activeInnings === 'our'
                            ? 'bg-villageGreen text-white'
                            : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                        }`}
                      >
                        The Village CC Innings
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveInnings('their')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          activeInnings === 'their'
                            ? 'bg-villageGreen text-white'
                            : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                        }`}
                      >
                        {data.opposition} Innings
                      </button>
                    </div>
                  )}
                  {hasOurInnings && scorecardData.finalScorecard?.ourInnings &&
                    (!hasBothInnings || activeInnings === 'our') &&
                    renderInningsContent(
                      scorecardData.finalScorecard.ourInnings,
                      'The Village CC',
                      villageIcon('h-8 w-8')
                    )}
                  {hasTheirInnings && scorecardData.finalScorecard?.theirInnings &&
                    (!hasBothInnings || activeInnings === 'their') &&
                    renderInningsContent(
                      scorecardData.finalScorecard.theirInnings,
                      data.opposition ?? 'Opposition',
                      oppositionIcon('h-8 w-8')
                    )}
                </div>
              ) : null;

              const commentaryContent = hasCommentaryData ? (
                <div>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {(data.completedOvers?.length ?? 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveCommentaryTab('vcc')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          activeCommentaryTab === 'vcc'
                            ? 'bg-villageGreen text-white'
                            : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                        }`}
                      >
                        VCC Commentary
                      </button>
                    )}
                    {(data.theirCompletedOvers?.length ?? 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveCommentaryTab('oppo')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          activeCommentaryTab === 'oppo'
                            ? 'bg-villageGreen text-white'
                            : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                        }`}
                      >
                        Oppo Commentary
                      </button>
                    )}
                  </div>
                  {activeCommentaryTab === 'vcc' && (data.completedOvers?.length ?? 0) > 0 && (
                    <div>
                      {data.ourInningsCommentary && (
                        <p className="mb-3 text-sm text-gray-600 italic">{data.ourInningsCommentary}</p>
                      )}
                      {[...(data.completedOvers ?? [])].reverse().map((over, i, arr) => {
                        const overNum = over.over?.overNumber ?? (arr.length - i);
                        const balls = over.over?.balls
                          ? [...over.over.balls].sort((a, b) => (a.ballNumber ?? 0) - (b.ballNumber ?? 0))
                          : [];
                        return (
                          <div key={i} className={`py-4 text-sm ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">{`Over ${overNum}`}</span>
                                  {over.over?.bowler && (
                                    <span className="text-gray-500">· {over.over.bowler}</span>
                                  )}
                                </div>
                                <span className="text-gray-600 text-xs">
                                  Village {over.scoreAtEndOfOver ?? 0}/{over.wicketsAtEndOfOver ?? 0}
                                  <span className="ml-1 text-gray-400">(+{over.scoreForThisOver ?? 0})</span>
                                </span>
                              </div>
                              {over.over?.commentary && (
                                <p className="mt-1 text-xs text-gray-600 italic">{over.over.commentary}</p>
                              )}
                            </div>
                            {balls.length > 0 && (
                              <div className="space-y-2 pl-1" aria-label={`Over ${overNum} deliveries`}>
                                {balls.map((ball, bi) => {
                                  const blob = getBallBlob(ball);
                                  const fow = ball.wicket ? fowByPlayerId.get(ball.wicket.player) : undefined;
                                  const statsText = formatBattingStats(fow?.outGoingPlayerScore, fow?.outgoingBatsmanInningsDetails);
                                  return (
                                    <div key={bi}>
                                      <div className="flex items-center gap-2">
                                        <span
                                          data-testid="ball-blob"
                                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${blob.label.length >= 3 ? 'text-[9px]' : 'text-xs'} font-bold flex-shrink-0 ${blob.className}`}
                                        >
                                          {blob.label}
                                        </span>
                                        <div className="text-gray-600">
                                          <span className="font-mono text-xs text-gray-400 mr-1">{overNum}.{ball.ballNumber}</span>
                                          {ball.bowler && ball.batsmanName ? (
                                            <>
                                              {`${ball.bowler} to ${ball.batsmanName}, `}
                                              {ball.wicket ? <span className="font-bold text-red-700">OUT!</span> : getBallDescription(ball)}
                                            </>
                                          ) : (
                                            ball.wicket ? <span className="font-bold text-red-700">OUT!</span> : getBallDescription(ball)
                                          )}
                                        </div>
                                      </div>
                                      {ball.wicket && (
                                        <div className="ml-9 mt-1 bg-red-50 border border-red-100 rounded px-2 py-1 text-sm">
                                          {ball.wicket.playerName && (
                                            <div className="font-semibold text-gray-800">
                                              {ball.wicket.playerName} {formatWicketDismissal(ball.wicket)}{statsText}
                                            </div>
                                          )}
                                          {ball.wicket.description && (
                                            <div className="text-gray-500 italic text-xs mt-0.5">{ball.wicket.description}</div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {activeCommentaryTab === 'oppo' && (data.theirCompletedOvers?.length ?? 0) > 0 && (
                    <div>
                      {data.theirInningsCommentary && (
                        <p className="mb-3 text-sm text-gray-600 italic">{data.theirInningsCommentary}</p>
                      )}
                      {[...(data.theirCompletedOvers ?? [])].reverse().map((over, i, arr) => (
                        <div key={i} className={`py-3 text-sm ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <span className="font-medium">{`Over ${over.over ?? (arr.length - i)}`}</span>
                          <span className="ml-2 text-gray-500">
                            {data.opposition} {over.score ?? 0}/{over.wickets ?? 0}
                          </span>
                          {over.commentary && (
                            <p className="mt-1 text-gray-600">{over.commentary}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null;

              // Analysis content for completed tab
              const analysisContent = hasAnalysisData ? (() => {
                const ourOvers = data.completedOvers ?? [];
                const theirOvers = data.theirCompletedOvers ?? [];
                const partnerships = data.partnerships ?? [];

                const ourCumulative = ourOvers.map(o => o.scoreAtEndOfOver ?? 0);
                const ourPerOver = ourOvers.map(o => o.scoreForThisOver ?? 0);

                const theirByOver: number[] = [];
                const theirCumulative: number[] = [];
                if (theirOvers.length > 0) {
                  const sortedTheirOvers = [...theirOvers]
                    .filter(o => (o.over ?? 0) > 0)
                    .sort((a, b) => (a.over ?? 0) - (b.over ?? 0));
                  let prevOver = 0;
                  let prevScore = 0;
                  for (const point of sortedTheirOvers) {
                    const currentOver = point.over ?? 0;
                    const currentScore = point.score ?? prevScore;
                    const runsInSegment = currentScore - prevScore;
                    const oversInSegment = currentOver - prevOver;
                    const runsPerOver = oversInSegment > 0 ? runsInSegment / oversInSegment : 0;
                    for (let ov = prevOver + 1; ov <= currentOver; ov++) {
                      theirByOver.push(runsPerOver);
                      theirCumulative.push(prevScore + runsPerOver * (ov - prevOver));
                    }
                    prevOver = currentOver;
                    prevScore = currentScore;
                  }
                }

                const wagonWheelBalls = ourOvers
                  .flatMap(o => o.over?.balls ?? [])
                  .filter(b => b.angle != null && (b.thing === '' || b.thing === null || b.thing === undefined || (b.thing === 'nb' && (b.amount ?? 0) > 1)));

                const tabBtn = (tab: 'worm' | 'manhattan' | 'partnerships' | 'wagon', label: string) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveAnalysisTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeAnalysisTab === tab
                        ? 'bg-villageGreen text-white'
                        : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                    }`}
                  >
                    {label}
                  </button>
                );

                const wormData = {
                  labels: Array.from(
                    { length: Math.max(ourCumulative.length, theirCumulative.length) },
                    (_, i) => String(i + 1)
                  ),
                  datasets: [
                    {
                      label: 'The Village CC',
                      data: ourCumulative,
                      borderColor: '#1d7a4b',
                      backgroundColor: 'transparent',
                      tension: 0.1,
                      pointRadius: 2,
                    },
                    ...(theirCumulative.length > 0 ? [{
                      label: data.opposition ?? 'Opposition',
                      data: theirCumulative,
                      borderColor: '#d4a017',
                      backgroundColor: 'transparent',
                      tension: 0.1,
                      pointRadius: 2,
                    }] : []),
                  ],
                };

                const allManhattanLabels = (() => {
                  const maxLen = Math.max(ourPerOver.length, theirByOver.length);
                  return Array.from({ length: maxLen }, (_, i) => String(i + 1));
                })();

                const manhattanData = {
                  labels: allManhattanLabels,
                  datasets: [
                    {
                      label: 'The Village CC',
                      data: ourPerOver,
                      backgroundColor: '#1d7a4b',
                    },
                    ...(theirByOver.length > 0 ? [{
                      label: data.opposition ?? 'Opposition',
                      data: theirByOver,
                      backgroundColor: '#d4a017',
                    }] : []),
                  ],
                };

                const chartOptions = {
                  responsive: true,
                  plugins: { legend: { position: 'top' as const } },
                };

                return (
                  <div>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {ourOvers.length > 0 && tabBtn('worm', 'Worm')}
                      {ourOvers.length > 0 && tabBtn('manhattan', 'Manhattan')}
                      {partnerships.length > 0 && tabBtn('partnerships', 'Partnerships')}
                      {wagonWheelBalls.length > 0 && tabBtn('wagon', 'Wagon Wheel')}
                    </div>
                    {activeAnalysisTab === 'worm' && ourOvers.length > 0 && (
                      <Line data={wormData} options={chartOptions} />
                    )}
                    {activeAnalysisTab === 'manhattan' && ourOvers.length > 0 && (
                      <Bar data={manhattanData} options={chartOptions} />
                    )}
                    {activeAnalysisTab === 'partnerships' && partnerships.length > 0 && (() => {
                      const svgW = 600;
                      const rowH = 40;
                      const rowGap = 8;
                      const centerX = svgW / 2;
                      const halfW = centerX - 4;
                      const highScore = Math.max(
                        ...partnerships.map(p => Math.max(p.player1Score ?? 0, p.player2Score ?? 0)),
                        1
                      );
                      const svgH = partnerships.length * (rowH + rowGap) + rowGap + 20;
                      const barSize = (score: number) => (score / Math.max(highScore, 1)) * halfW;
                      const textPad = 6;
                      const minBarWidthForInsideLabel = 60;
                      const battingEntries = scorecardData.finalScorecard?.ourInnings?.batting?.entries ?? [];
                      const getPlayerNameById = (id?: number) => battingEntries.find((e: BattingEntryV1) => e.playerId === id)?.playerName ?? undefined;
                      return (
                        <svg
                          data-testid="partnerships-chart"
                          viewBox={`0 0 ${svgW} ${svgH}`}
                          className="w-full"
                          style={{ maxHeight: 600 }}
                        >
                          {partnerships.map((p, i) => {
                            const y = rowGap + i * (rowH + rowGap);
                            const p1Score = p.player1Score ?? 0;
                            const p2Score = p.player2Score ?? 0;
                            const leftW = barSize(p1Score);
                            const rightW = barSize(p2Score);
                            const p1Name = getPlayerNameById(p.playerId1);
                            const p2Name = getPlayerNameById(p.playerId2);
                            const p1Label = p1Score > 0 ? `${p1Name ?? 'Bat 1'} (${p1Score})` : (p1Name ?? 'Bat 1');
                            const p2Label = p2Score > 0 ? `${p2Name ?? 'Bat 2'} (${p2Score})` : (p2Name ?? 'Bat 2');
                            return (
                              <g key={i}>
                                <rect x={centerX - leftW} y={y} width={leftW} height={rowH} fill="#1d7a4b" />
                                <rect x={centerX} y={y} width={rightW} height={rowH} fill="#d4a017" />
                                {leftW > minBarWidthForInsideLabel ? (
                                  <text x={centerX - leftW + textPad} y={y + rowH / 2} dominantBaseline="middle" textAnchor="start" fontSize={12} fill="#fff">{p1Label}</text>
                                ) : (
                                  <text x={centerX - leftW - textPad} y={y + rowH / 2} dominantBaseline="middle" textAnchor="end" fontSize={12} fill="#333">{p1Label}</text>
                                )}
                                {rightW > minBarWidthForInsideLabel ? (
                                  <text x={centerX + rightW - textPad} y={y + rowH / 2} dominantBaseline="middle" textAnchor="end" fontSize={12} fill="#fff">{p2Label}</text>
                                ) : (
                                  <text x={centerX + rightW + textPad} y={y + rowH / 2} dominantBaseline="middle" textAnchor="start" fontSize={12} fill="#333">{p2Label}</text>
                                )}
                              </g>
                            );
                          })}
                          <line x1={centerX} y1={0} x2={centerX} y2={svgH} stroke="#999" strokeWidth={1} />
                        </svg>
                      );
                    })()}
                    {activeAnalysisTab === 'wagon' && wagonWheelBalls.length > 0 && (() => {
                      const svgW = 500;
                      const svgH = 420;
                      const fieldCx = svgW / 2;
                      const fieldCy = 200;
                      const fieldRx = 190;
                      const fieldRy = 160;
                      const stumpsX = fieldCx;
                      const stumpsY = 180;
                      const radius = fieldRx;

                      const wheelDistance = (score: number, angle: number, r: number): number => {
                        let scale = r / 4;
                        if (score === 6) scale *= 0.75;
                        let dist = score * scale;
                        const halfPi = Math.PI / 2;
                        if (angle <= halfPi) {
                          dist -= score * 5 * ((halfPi - angle) / halfPi);
                        } else if (angle <= Math.PI) {
                          dist += score * 5 * ((angle - halfPi) / halfPi);
                        } else if (angle <= Math.PI * 1.5) {
                          dist += score * 5 * ((Math.PI * 1.5 - angle) / halfPi);
                        } else {
                          dist -= score * 5 * ((angle - Math.PI * 1.5) / halfPi);
                        }
                        return dist;
                      };

                      const ballEndPoint = (angle: number, dist: number) => ({
                        x: Math.round(Math.cos(angle - Math.PI / 2) * dist + stumpsX),
                        y: Math.round(Math.sin(angle - Math.PI / 2) * dist + stumpsY),
                      });

                      const ballColor = (score: number) =>
                        score >= 6 ? '#f97316' : score >= 4 ? '#3b82f6' : '#ffdd00';

                      const keyY = svgH - 30;

                      return (
                        <svg data-testid="wagon-wheel" viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: 480 }}>
                          <ellipse cx={fieldCx} cy={fieldCy} rx={fieldRx} ry={fieldRy} fill="#4a8f3f" />
                          <ellipse cx={fieldCx} cy={fieldCy} rx={fieldRx * 0.5} ry={fieldRy * 0.5}
                            fill="#3a7f2f" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
                          <rect x={stumpsX - 7} y={stumpsY - 45} width={14} height={90} fill="#c8a96e" rx="2" />
                          <text x={fieldCx - fieldRx * 0.55} y={fieldCy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Off Side</text>
                          <text x={fieldCx + fieldRx * 0.55} y={fieldCy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Leg Side</text>
                          {wagonWheelBalls.map((ball, idx) => {
                            const angle = ball.angle!;
                            const rawScore = ball.amount ?? 0;
                            const score = ball.thing === 'nb' ? rawScore - 1 : rawScore;
                            if (score <= 0) return null;
                            const dist = wheelDistance(score, angle, radius);
                            const end = ballEndPoint(angle, dist);
                            return (
                              <line key={idx} x1={stumpsX} y1={stumpsY} x2={end.x} y2={end.y} stroke={ballColor(score)} strokeWidth={2} strokeOpacity={0.85} />
                            );
                          })}
                          <line x1={10} y1={keyY} x2={50} y2={keyY} stroke="#ffdd00" strokeWidth={4} />
                          <text x={55} y={keyY + 4} fontSize={13} fill="#333">Runs</text>
                          <line x1={110} y1={keyY} x2={150} y2={keyY} stroke="#3b82f6" strokeWidth={4} />
                          <text x={155} y={keyY + 4} fontSize={13} fill="#333">Fours</text>
                          <line x1={215} y1={keyY} x2={255} y2={keyY} stroke="#f97316" strokeWidth={4} />
                          <text x={260} y={keyY + 4} fontSize={13} fill="#333">Sixes</text>
                        </svg>
                      );
                    })()}
                  </div>
                );
              })() : null;

              // Player analysis content for completed tab
              const playerAnalysisContent = hasPlayerData ? (() => {
                const allBalls = (data.completedOvers ?? []).flatMap(o => o.over?.balls ?? []);
                const isLegalDelivery = (ball: BallV1) => {
                  const thing = ball.thing ?? '';
                  return thing === '' || (thing === 'nb' && (ball.amount ?? 0) > 1);
                };
                const playerBallMap = new Map<number, { name: string; legalBalls: BallV1[]; allBalls: BallV1[] }>();
                allBalls.forEach(ball => {
                  if (ball.batsman != null && ball.batsmanName) {
                    if (!playerBallMap.has(ball.batsman)) {
                      playerBallMap.set(ball.batsman, { name: ball.batsmanName, legalBalls: [], allBalls: [] });
                    }
                    const entry = playerBallMap.get(ball.batsman)!;
                    entry.allBalls.push(ball);
                    if (isLegalDelivery(ball)) {
                      entry.legalBalls.push(ball);
                    }
                  }
                });
                const players = Array.from(playerBallMap.entries())
                  .map(([id, { name, legalBalls, allBalls: pBalls }]) => ({ id, name, legalBalls, allBalls: pBalls }))
                  .filter(p => p.legalBalls.length > 0);

                if (players.length === 0) return null;

                const getShortName = (name: string): string => {
                  const parts = name.split(' ');
                  let short = parts.map(p => p.charAt(0)).join('');
                  if (short.length > 3) {
                    short = short.charAt(0) + short.charAt(1) + short.charAt(short.length - 1);
                  }
                  return short;
                };

                const effectivePlayerId = selectedPlayerId ?? players[0].id;
                const selectedPlayer = players.find(p => p.id === effectivePlayerId) ?? players[0];

                const playerWormPoints: { ball: number; score: number; sr: number }[] = [];
                let cumScore = 0;
                selectedPlayer.legalBalls.forEach((ball, idx) => {
                  cumScore += ball.amount ?? 0;
                  const ballNum = idx + 1;
                  playerWormPoints.push({ ball: ballNum, score: cumScore, sr: (cumScore / ballNum) * 100 });
                });
                const maxSR = Math.max(...playerWormPoints.map(p => p.sr), 1);
                const finalScore = Math.max(cumScore, 1);
                const playerWormData = {
                  labels: playerWormPoints.map(p => String(p.ball)),
                  datasets: [
                    {
                      label: 'Score',
                      data: playerWormPoints.map(p => p.score),
                      borderColor: '#1d7a4b',
                      backgroundColor: 'transparent',
                      tension: 0.1,
                      pointRadius: 2,
                    },
                    {
                      label: 'Strike Rate (scaled)',
                      data: playerWormPoints.map(p => (p.sr / maxSR) * finalScore),
                      borderColor: '#d4a017',
                      backgroundColor: 'transparent',
                      tension: 0.1,
                      pointRadius: 2,
                    },
                  ],
                };
                const playerWormOptions = {
                  responsive: true,
                  plugins: { legend: { position: 'top' as const } },
                  scales: { x: { title: { display: true, text: 'Balls Faced' } } },
                };

                const playerWagonBalls = selectedPlayer.allBalls.filter(
                  b => b.angle != null && isLegalDelivery(b)
                );

                return (
                  <div>
                    <div className="flex gap-2 mb-3 flex-wrap items-center">
                      {players.map(player => (
                        <button
                          key={player.id}
                          type="button"
                          onClick={() => setSelectedPlayerId(player.id)}
                          title={player.name}
                          aria-label={player.name}
                          className={`w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 border-2 ${
                            player.id === effectivePlayerId
                              ? 'bg-villageGreen text-white border-villageGreen'
                              : 'bg-white text-villageGreen border-villageGreen hover:bg-villageGreenLight'
                          }`}
                        >
                          {getShortName(player.name)}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setActivePlayerAnalysisTab('worm')}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          activePlayerAnalysisTab === 'worm'
                            ? 'bg-villageGreen text-white'
                            : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                        }`}
                      >
                        Player Worm
                      </button>
                      {playerWagonBalls.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActivePlayerAnalysisTab('wagon')}
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            activePlayerAnalysisTab === 'wagon'
                              ? 'bg-villageGreen text-white'
                              : 'border border-villageGreen text-villageGreen hover:bg-villageGreenLight'
                          }`}
                        >
                          Wagon Wheel
                        </button>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">{selectedPlayer.name}</p>
                    {activePlayerAnalysisTab === 'worm' && playerWormPoints.length > 0 && (
                      <Line data={playerWormData} options={playerWormOptions} />
                    )}
                    {activePlayerAnalysisTab === 'worm' && playerWormPoints.length === 0 && (
                      <p className="text-sm text-gray-500">No ball-by-ball data available for this player.</p>
                    )}
                    {activePlayerAnalysisTab === 'wagon' && (() => {
                      const svgW = 500;
                      const svgH = 420;
                      const fieldCx = svgW / 2;
                      const fieldCy = 200;
                      const fieldRx = 190;
                      const fieldRy = 160;
                      const stumpsX = fieldCx;
                      const stumpsY = 180;
                      const radius = fieldRx;

                      const wheelDistance = (score: number, angle: number, r: number): number => {
                        let scale = r / 4;
                        if (score === 6) scale *= 0.75;
                        let dist = score * scale;
                        const halfPi = Math.PI / 2;
                        if (angle <= halfPi) {
                          dist -= score * 5 * ((halfPi - angle) / halfPi);
                        } else if (angle <= Math.PI) {
                          dist += score * 5 * ((angle - halfPi) / halfPi);
                        } else if (angle <= Math.PI * 1.5) {
                          dist += score * 5 * ((Math.PI * 1.5 - angle) / halfPi);
                        } else {
                          dist -= score * 5 * ((angle - Math.PI * 1.5) / halfPi);
                        }
                        return dist;
                      };

                      const ballEndPoint = (angle: number, dist: number) => ({
                        x: Math.round(Math.cos(angle - Math.PI / 2) * dist + stumpsX),
                        y: Math.round(Math.sin(angle - Math.PI / 2) * dist + stumpsY),
                      });

                      const ballColor = (score: number) =>
                        score >= 6 ? '#f97316' : score >= 4 ? '#3b82f6' : '#ffdd00';

                      const keyY = svgH - 30;

                      return (
                        <svg data-testid="player-wagon-wheel" viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: 480 }}>
                          <ellipse cx={fieldCx} cy={fieldCy} rx={fieldRx} ry={fieldRy} fill="#4a8f3f" />
                          <ellipse cx={fieldCx} cy={fieldCy} rx={fieldRx * 0.5} ry={fieldRy * 0.5}
                            fill="#3a7f2f" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
                          <rect x={stumpsX - 7} y={stumpsY - 45} width={14} height={90} fill="#c8a96e" rx="2" />
                          <text x={fieldCx - fieldRx * 0.55} y={fieldCy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Off Side</text>
                          <text x={fieldCx + fieldRx * 0.55} y={fieldCy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14">Leg Side</text>
                          {playerWagonBalls.map((ball, idx) => {
                            const angle = ball.angle!;
                            const rawScore = ball.amount ?? 0;
                            const score = ball.thing === 'nb' ? rawScore - 1 : rawScore;
                            if (score <= 0) return null;
                            const dist = wheelDistance(score, angle, radius);
                            const end = ballEndPoint(angle, dist);
                            return (
                              <line key={idx} x1={stumpsX} y1={stumpsY} x2={end.x} y2={end.y} stroke={ballColor(score)} strokeWidth={2} strokeOpacity={0.85} />
                            );
                          })}
                          <line x1={10} y1={keyY} x2={50} y2={keyY} stroke="#ffdd00" strokeWidth={4} />
                          <text x={55} y={keyY + 4} fontSize={13} fill="#333">Runs</text>
                          <line x1={110} y1={keyY} x2={150} y2={keyY} stroke="#3b82f6" strokeWidth={4} />
                          <text x={155} y={keyY + 4} fontSize={13} fill="#333">Fours</text>
                          <line x1={215} y1={keyY} x2={255} y2={keyY} stroke="#f97316" strokeWidth={4} />
                          <text x={260} y={keyY + 4} fontSize={13} fill="#333">Sixes</text>
                        </svg>
                      );
                    })()}
                  </div>
                );
              })() : null;

              return (
                <section className="max-w-6xl mx-auto mt-6 mb-10">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                      {(hasOurInnings || hasTheirInnings) && (
                        <button
                          type="button"
                          className={tabBtnClass('scorecard')}
                          onClick={() => setActiveSectionTab('scorecard')}
                        >
                          Scorecards
                        </button>
                      )}
                      {hasCommentaryData && (
                        <button
                          type="button"
                          className={tabBtnClass('commentary')}
                          onClick={() => setActiveSectionTab('commentary')}
                        >
                          Over-by-over Commentary
                        </button>
                      )}
                      {hasAnalysisData && (
                        <button
                          type="button"
                          className={tabBtnClass('analysis')}
                          onClick={() => setActiveSectionTab('analysis')}
                        >
                          Team Analysis
                        </button>
                      )}
                      {hasPlayerData && (
                        <button
                          type="button"
                          className={tabBtnClass('players')}
                          onClick={() => setActiveSectionTab('players')}
                        >
                          Player Analysis
                        </button>
                      )}
                    </div>
                    {/* Tab content */}
                    <div className="px-6 py-6">
                      {effectiveSectionTab === 'scorecard' && scorecardContent}
                      {effectiveSectionTab === 'commentary' && commentaryContent}
                      {effectiveSectionTab === 'analysis' && analysisContent}
                      {effectiveSectionTab === 'players' && playerAnalysisContent}
                    </div>
                  </div>
                </section>
              );
            })()}
          </>
        )}

        {/* No result message */}
        {!completed && !live && !scorecardData.result?.isAbandoned && (
          <section className="max-w-6xl mx-auto mt-6 mb-10 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-700">This match is scheduled but has not started yet.</p>
          </section>
        )}

        {/* Abandoned message */}
        {scorecardData.result?.isAbandoned && (
          <section className="max-w-6xl mx-auto mt-6 mb-10 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800 font-semibold">This match was abandoned.</p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LiveScorecard;
