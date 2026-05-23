import React from 'react';
import { LiveScoringMatchSummaryV1, BallByBallMatchDescriptorV1 } from '../../api/swaggerTypes';
import { NavBar } from './NavBar';
export interface ChooseMatchScreenProps {
  matchesList: LiveScoringMatchSummaryV1[];
  isLoading: boolean;
  onChooseMatch: (matchId: number) => void;
  onBack: () => void;
}
export const ChooseMatchScreen: React.FC<ChooseMatchScreenProps> = ({
  matchesList, isLoading, onChooseMatch, onBack,
}) => {
  const inProgress = matchesList.filter(
    m => m.ballByBall?.batOrBowl && m.ballByBall.batOrBowl !== '',
  );
  const upcoming = matchesList.filter(
    m => !m.ballByBall?.batOrBowl || m.ballByBall.batOrBowl === '',
  );
  return (
    <div className="flex flex-col h-full">
      <NavBar title="Live Scoring" onBack={onBack} />
      <div className="px-4 py-1.5 bg-white border-b border-gray-100 flex items-center gap-1.5 text-xs text-gray-400">
        <span>Admin</span>
        <span className="material-symbols-outlined text-[14px] leading-none">chevron_right</span>
        <span className="text-gray-600 font-medium">Live Scoring</span>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-villageGreen border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-villageGreen font-medium">Loading...</span>
            </div>
          </div>
        )}
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
                      onClick={() => onChooseMatch(matchId!)}
                      className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-left flex items-center justify-between hover:border-villageGreen hover:shadow-md transition-all"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">vs {bd.opponent ?? m.match?.opposition?.name}</p>
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
                      onClick={() => onChooseMatch(matchId!)}
                      className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-left flex items-center justify-between hover:border-villageGreen hover:shadow-md transition-all"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">vs {bd?.opponent ?? m.match?.opposition?.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{bd?.dateString ?? m.match?.date}</p>
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
