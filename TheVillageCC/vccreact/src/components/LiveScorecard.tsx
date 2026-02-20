import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getLiveScorecardData } from '../api/liveScoringApi';
import { LiveScorecardV1, BattingEntryV1, BowlingEntryV1 } from '../api/swaggerTypes';

const LiveScorecard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [scorecardData, setScorecardData] = useState<LiveScorecardV1 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInnings, setExpandedInnings] = useState<'our' | 'their' | null>(null);

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
        // Auto-expand the innings that's in progress or most recent
        if (inPlay.ourInningsStatus === 'InProgress') {
          setExpandedInnings('our');
        } else if (inPlay.theirInningsStatus === 'InProgress') {
          setExpandedInnings('their');
        } else if (inPlay.ourInningsStatus === 'Completed') {
          setExpandedInnings('our');
        } else if (inPlay.theirInningsStatus === 'Completed') {
          setExpandedInnings('their');
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
    return data.inPlayData.ourInningsStatus === 'InProgress' ||
           data.inPlayData.theirInningsStatus === 'InProgress';
  };

  const isCompleted = (data: LiveScorecardV1): boolean => {
    const inPlay = data.inPlayData;
    const final = data.finalScorecard;

    return (inPlay.ourInningsStatus === 'Completed' && inPlay.theirInningsStatus === 'Completed') ||
      ((final?.ourInnings?.batting?.entries?.length || 0) > 0);
  };

  const toggleInnings = (innings: 'our' | 'their') => {
    setExpandedInnings(expandedInnings === innings ? null : innings);
  };

  const renderBattingTable = (entries: BattingEntryV1[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-600">
            <th className="py-2">Batter</th>
            <th className="py-2">How Out</th>
            <th className="py-2 text-right">R</th>
            <th className="py-2 text-right">B</th>
            <th className="py-2 text-right">4s</th>
            <th className="py-2 text-right">6s</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {entries.map((entry, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-2 font-medium">{entry.playerName}</td>
              <td className="py-2 text-sm">{entry.modeOfDismissal || 'NotOut'}</td>
              <td className="py-2 text-right">{entry.runs}</td>
              <td className="py-2 text-right">{entry.ballsFaced}</td>
              <td className="py-2 text-right">{entry.fours}</td>
              <td className="py-2 text-right">{entry.sixes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBowlingTable = (entries: BowlingEntryV1[]) => (
    <div className="mt-8 overflow-x-auto">
      <h3 className="font-semibold text-gray-900 mb-2">Bowling</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-600">
            <th className="py-2">Bowler</th>
            <th className="py-2 text-right">O</th>
            <th className="py-2 text-right">M</th>
            <th className="py-2 text-right">R</th>
            <th className="py-2 text-right">W</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {entries.map((entry, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-2 font-medium">{entry.playerName}</td>
              <td className="py-2 text-right">{entry.overs}</td>
              <td className="py-2 text-right">{entry.maidens}</td>
              <td className="py-2 text-right">{entry.runs}</td>
              <td className="py-2 text-right">{entry.wickets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderExtras = (extras: { wides: number; noBalls: number; byes: number; legByes: number; penalties: number; total: number }) => (
    <div className="mt-8">
      <h3 className="font-semibold text-gray-900 mb-2">Extras</h3>
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-sm text-gray-700">
        <p><span className="font-medium">Wides:</span> {extras.wides}</p>
        <p><span className="font-medium">No Balls:</span> {extras.noBalls}</p>
        <p><span className="font-medium">Byes:</span> {extras.byes}</p>
        <p><span className="font-medium">Leg Byes:</span> {extras.legByes}</p>
        <p><span className="font-medium">Penalty:</span> {extras.penalties}</p>
        <p><span className="font-medium">Total:</span> {extras.total}</p>
      </div>
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
  const data = scorecardData.inPlayData;

  return (
    <div className="font-sans text-villageText bg-gray-50 min-h-screen">
      <Header />
      
      <main>
        {/* Hero Match Card */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-6xl mx-auto mt-6 px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Village badge + name */}
            <div className="flex items-center gap-4">
              <img src="/images/vcc_cricle_small.png" className="h-14 w-14" alt="The Village CC" />
              <h1 className="text-2xl font-semibold">The Village CC</h1>
            </div>

            {/* Centre: Status badge */}
            <div className="flex items-center gap-2">
              {live ? (
                <>
                  <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    LIVE
                  </span>
                  <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></span>
                </>
              ) : completed ? (
                <span className="bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  COMPLETED
                </span>
              ) : scorecardData.result?.isAbandoned ? (
                <span className="bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  ABANDONED
                </span>
              ) : (
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  SCHEDULED
                </span>
              )}
            </div>

            {/* Right: Opposition */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-xl">
                  {(data.opposition || '').substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-semibold">{data.opposition}</h1>
            </div>
          </div>

          {/* Match details */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p><span className="font-medium">Venue:</span> {scorecardData.result?.venueName || scorecardData.matchData?.venue?.name || 'TBC'}</p>
              <p><span className="font-medium">Date:</span> {formatDate(scorecardData.matchData?.date || scorecardData.result?.matchDate || undefined)}</p>
            </div>
            <div>
              <p><span className="font-medium">Match Type:</span> {scorecardData.matchData?.type || (data.declarationGame ? 'Declaration' : `${data.overs} overs`)}</p>
              <p><span className="font-medium">Toss:</span> {data.wonToss ? 'The Village CC' : data.opposition} won and elected to {data.tossWinnerBatted ? 'bat' : 'field'}</p>
            </div>
          </div>

          {/* Result summary (if completed) */}
          {completed && scorecardData.result?.resultText && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-semibold text-villageText">{scorecardData.result.resultText}</p>
              {scorecardData.result.margin && scorecardData.result.margin !== 'result not yet in' && (
                <p className="text-sm text-gray-600 mt-1">{scorecardData.result.margin}</p>
              )}
            </div>
          )}
        </section>

        {/* Sticky Live Status Bar (only when live) */}
        {live && (
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="font-semibold text-gray-900">
                  {data.ourInningsStatus === 'InProgress' ? (
                    <>The Village CC {data.score}/{data.wickets} ({data.ourLastCompletedOver} ov)</>
                  ) : data.theirInningsStatus === 'InProgress' ? (
                    <>{data.opposition} {data.theirScore}/{data.theirWickets} ({data.theirOver} ov)</>
                  ) : null}
                </div>
                <div className="text-sm text-gray-700">
                  {data.ourInningsStatus === 'InProgress' && (
                    <>Run rate {data.runRate.toFixed(2)}</>
                  )}
                  {data.theirInningsStatus === 'InProgress' && (
                    <>Run rate {data.theirRunRate.toFixed(2)}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Village Innings */}
        {completed && scorecardData.finalScorecard?.ourInnings && (
          <section className="max-w-6xl mx-auto mt-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <button
              onClick={() => toggleInnings('our')}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              type="button"
            >
              <div className="flex items-center gap-4">
                <img src="/images/vcc_cricle_small.png" className="h-10 w-10" alt="The Village CC" />
                <h2 className="text-xl font-semibold">The Village CC Innings</h2>
              </div>
              <svg
                className={`h-5 w-5 text-gray-600 transition-transform ${expandedInnings === 'our' ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedInnings === 'our' && (
              <div className="px-6 pb-6">
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  {scorecardData.finalScorecard.ourInnings.batting.score}/{scorecardData.finalScorecard.ourInnings.batting.wickets}
                </p>
                {renderBattingTable(scorecardData.finalScorecard.ourInnings.batting.entries || [])}

                {scorecardData.finalScorecard.ourInnings.bowling.entries && scorecardData.finalScorecard.ourInnings.bowling.entries.length > 0 &&
                  renderBowlingTable(scorecardData.finalScorecard.ourInnings.bowling.entries)}

                {renderExtras(scorecardData.finalScorecard.ourInnings.batting.extras)}
              </div>
            )}
          </section>
        )}

        {/* Opposition Innings */}
        {completed && scorecardData.finalScorecard?.theirInnings && (
          <section className="max-w-6xl mx-auto mt-6 mb-10 bg-white border border-gray-200 rounded-xl shadow-sm">
            <button
              onClick={() => toggleInnings('their')}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              type="button"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {(data.opposition || '').substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{data.opposition} Innings</h2>
              </div>
              <svg
                className={`h-5 w-5 text-gray-600 transition-transform ${expandedInnings === 'their' ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedInnings === 'their' && (
              <div className="px-6 pb-6">
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  {scorecardData.finalScorecard.theirInnings.batting.score}/{scorecardData.finalScorecard.theirInnings.batting.wickets}
                </p>
                {renderBattingTable(scorecardData.finalScorecard.theirInnings.batting.entries || [])}

                {scorecardData.finalScorecard.theirInnings.bowling.entries && scorecardData.finalScorecard.theirInnings.bowling.entries.length > 0 &&
                  renderBowlingTable(scorecardData.finalScorecard.theirInnings.bowling.entries)}

                {renderExtras(scorecardData.finalScorecard.theirInnings.batting.extras)}
              </div>
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
