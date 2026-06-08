import React, { useState } from 'react';
import { NavBar } from './NavBar';
import { MatchStateV1 } from '../../api/swaggerTypes';
import { startOppositionBallByBall } from '../../api/liveScoringApi';

interface ExtInPlayData {
  theirScore?: number;
  theirOver?: number;
  theirInningsIsBallByBall?: boolean;
}

interface ExtMatchState extends MatchStateV1 {
  theirInningsIsBallByBall?: boolean;
}

export interface OppositionScoringScreenProps {
  matchState: MatchStateV1 | null;
  selectedMatchId: number | null;
  oppScore: string;
  setOppScore: (v: string) => void;
  oppOvers: string;
  setOppOvers: (v: string) => void;
  oppWickets: string;
  setOppWickets: (v: string) => void;
  oppCommentary: string;
  setOppCommentary: (v: string) => void;
  isLoading: boolean;
  onConfirm: () => void;
  onAbandon: () => void;
  onBallByBallStarted: (state: MatchStateV1) => void;
}

export const OppositionScoringScreen: React.FC<OppositionScoringScreenProps> = ({
  matchState, selectedMatchId,
  oppScore, setOppScore, oppOvers, setOppOvers, oppWickets, setOppWickets,
  oppCommentary, setOppCommentary, isLoading, onConfirm, onAbandon, onBallByBallStarted,
}) => {
  const extState = matchState as ExtMatchState | null;
  const inPlayData = matchState?.liveScorecard?.inPlayData as ExtInPlayData | undefined;

  const shouldShowModeSelector =
    (inPlayData?.theirScore ?? 0) === 0 &&
    (inPlayData?.theirOver ?? 0) === 0 &&
    !(inPlayData?.theirInningsIsBallByBall ?? false) &&
    !(extState?.theirInningsIsBallByBall ?? false);

  const [subView, setSubView] = useState<'mode-selector' | 'opening-batters' | 'summary'>(
    shouldShowModeSelector ? 'mode-selector' : 'summary',
  );
  const [batter1, setBatter1] = useState('');
  const [batter2, setBatter2] = useState('');
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleStartBallByBall = async () => {
    if (!selectedMatchId || !batter1.trim() || !batter2.trim()) return;
    setLocalIsLoading(true);
    setLocalError(null);
    try {
      const newState = await startOppositionBallByBall(selectedMatchId, {
        batsmanNames: [batter1.trim(), batter2.trim()],
      });
      onBallByBallStarted(newState);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to start ball-by-ball scoring');
    } finally {
      setLocalIsLoading(false);
    }
  };

  if (subView === 'mode-selector') {
    return (
      <div className="flex flex-col h-full">
        <NavBar
          title="Opposition Innings"
          rightContent={
            <button onClick={onAbandon} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Abandon match">
              <span className="material-symbols-outlined text-xl leading-none text-amber-300">dangerous</span>
            </button>
          }
        />
        <div className="flex-1 overflow-y-auto bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-sm">
            <p className="text-sm font-medium text-gray-700 text-center mb-5">
              How do you want to score the opposition innings?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSubView('summary')}
                className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-sm hover:border-villageGreen hover:text-villageGreen transition-colors"
              >
                Over-by-over summary
              </button>
              <button
                onClick={() => setSubView('opening-batters')}
                className="w-full py-3 px-4 rounded-xl bg-villageGreen text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Ball by ball
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subView === 'opening-batters') {
    return (
      <div className="flex flex-col h-full">
        <NavBar title="Ball by Ball" onBack={() => setSubView('mode-selector')} />
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
          {localIsLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
              <div className="w-10 h-10 border-4 border-villageGreen border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="max-w-lg mx-auto p-4">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">Opening batsmen</h3>
              </div>
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <label className="w-40 text-sm text-gray-600 flex-shrink-0">Batter 1 (on strike)</label>
                <input
                  type="text"
                  placeholder="Name..."
                  value={batter1}
                  onChange={e => setBatter1(e.target.value)}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center px-4 py-3">
                <label className="w-40 text-sm text-gray-600 flex-shrink-0">Batter 2 (non-striker)</label>
                <input
                  type="text"
                  placeholder="Name..."
                  value={batter2}
                  onChange={e => setBatter2(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && batter1.trim() && batter2.trim()) handleStartBallByBall(); }}
                  className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>
            {localError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {localError}
              </div>
            )}
            <button
              onClick={handleStartBallByBall}
              disabled={!batter1.trim() || !batter2.trim() || localIsLoading}
              className="mt-4 w-full py-3 rounded-xl bg-villageGreen text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Start ball-by-ball scoring
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary entry (existing UI)
  return (
    <div className="flex flex-col h-full">
      <NavBar
        title="Opposition Score"
        rightContent={
          <div className="flex items-center gap-1">
            <button onClick={onAbandon} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Abandon match" title="Abandon match">
              <span className="material-symbols-outlined text-xl leading-none text-amber-300">dangerous</span>
            </button>
            <button onClick={onConfirm} disabled={isLoading} className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50" aria-label="Done">
              <span className="material-symbols-outlined text-xl leading-none">done</span>
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-villageGreen border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-villageGreen font-medium">Loading...</span>
            </div>
          </div>
        )}
        <div className="max-w-lg mx-auto p-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Score</label>
              <input type="number" min={0} placeholder="0" value={oppScore} onChange={e => setOppScore(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none" />
            </div>
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Overs</label>
              <input type="number" min={0} placeholder="0" value={oppOvers} onChange={e => setOppOvers(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none" />
            </div>
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Wickets down</label>
              <input type="number" min={0} max={10} placeholder="0" value={oppWickets} onChange={e => setOppWickets(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none" />
            </div>
            <div className="flex items-start px-4 py-3">
              <span className="material-symbols-outlined text-gray-400 text-lg mr-3 mt-0.5">comment</span>
              <textarea placeholder="Lets have a little chatter for the peeps" value={oppCommentary} onChange={e => setOppCommentary(e.target.value)} rows={4} className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
