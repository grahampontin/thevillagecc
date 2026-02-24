import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getLiveScorecardData } from '../api/liveScoringApi';
import { LiveScorecardV1, BattingEntryV1, BowlingEntryV1, FoWEntryV1 } from '../api/swaggerTypes';

const LiveScorecard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [scorecardData, setScorecardData] = useState<LiveScorecardV1 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeInnings, setActiveInnings] = useState<'our' | 'their'>('our');

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

  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />

      <main>
        {/* Hero Match Card */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-6xl mx-auto mt-6 px-6 py-6">
          {/* Match meta */}
          <p className="text-center text-xs text-gray-500 mb-5">
            {scorecardData.matchData?.type || (data.declarationGame ? 'Declaration' : `${data.overs}-over match`)}
            {' · '}
            {scorecardData.result?.venueName || scorecardData.matchData?.venue?.name || 'TBC'}
            {' · '}
            {formatDate(scorecardData.matchData?.date || scorecardData.result?.matchDate || undefined)}
          </p>

          <div className="flex flex-row items-center justify-between gap-2 sm:gap-6">
            {/* Left team */}
            {oppositionIsHomeTeam ? (
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1 text-center">
                {oppositionIcon('h-12 w-12 sm:h-16 sm:w-16')}
                <h1 className="text-xs sm:text-base font-semibold">{data.opposition}</h1>
                {theirScoreDisplay && <p className="text-2xl sm:text-3xl font-bold">{theirScoreDisplay}</p>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1 text-center">
                {villageIcon('h-12 w-12 sm:h-16 sm:w-16')}
                <h1 className="text-xs sm:text-base font-semibold">The Village CC</h1>
                {ourScoreDisplay && <p className="text-2xl sm:text-3xl font-bold">{ourScoreDisplay}</p>}
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
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1 text-center">
                {villageIcon('h-12 w-12 sm:h-16 sm:w-16')}
                <h1 className="text-xs sm:text-base font-semibold">The Village CC</h1>
                {ourScoreDisplay && <p className="text-2xl sm:text-3xl font-bold">{ourScoreDisplay}</p>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1 text-center">
                {oppositionIcon('h-12 w-12 sm:h-16 sm:w-16')}
                <h1 className="text-xs sm:text-base font-semibold">{data.opposition}</h1>
                {theirScoreDisplay && <p className="text-2xl sm:text-3xl font-bold">{theirScoreDisplay}</p>}
              </div>
            )}
          </div>

          {/* Toss info */}
          <p className="mt-4 text-center text-xs text-gray-500">
            {data.wonToss ? 'The Village CC' : data.opposition} won the toss and elected to {data.tossWinnerBatted ? 'bat' : 'field'}
          </p>
        </section>

        {/* Live: current batsmen and bowlers */}
        {live && (data.onStrikeBatsman || data.otherBatsman || data.bowlerOneDetails || data.bowlerTwoDetails) && (
          <div className="max-w-6xl mx-auto mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(data.onStrikeBatsman || data.otherBatsman) && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">At the Crease</h3>
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
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
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

        {/* Live: score status bar */}
        {live && (
          <div className="max-w-6xl mx-auto mt-4 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
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
        )}

        {/* Innings section (completed matches) */}
        {completed && (hasOurInnings || hasTheirInnings) && (
          <section className="max-w-6xl mx-auto mt-6 mb-10">
            {/* Innings tab selector */}
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

            {/* Our innings */}
            {hasOurInnings && scorecardData.finalScorecard?.ourInnings &&
              (!hasBothInnings || activeInnings === 'our') &&
              renderInningsContent(
                scorecardData.finalScorecard.ourInnings,
                'The Village CC',
                villageIcon('h-8 w-8')
              )}

            {/* Their innings */}
            {hasTheirInnings && scorecardData.finalScorecard?.theirInnings &&
              (!hasBothInnings || activeInnings === 'their') &&
              renderInningsContent(
                scorecardData.finalScorecard.theirInnings,
                data.opposition ?? 'Opposition',
                oppositionIcon('h-8 w-8')
              )}
          </section>
        )}

        {/* Match Report (if completed) */}
        {completed && scorecardData.matchReport && (scorecardData.matchReport.conditions || scorecardData.matchReport.report) && (
          <section className="max-w-6xl mx-auto mt-6 mb-10 bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-6">
            <h2 className="text-xl font-semibold mb-4">Match Report</h2>
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
          </section>
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
