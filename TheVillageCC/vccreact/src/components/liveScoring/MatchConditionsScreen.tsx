import React from 'react';
import { PlayerV1 } from '../../api/swaggerTypes';
import { NavBar } from './NavBar';
export interface MatchConditionsScreenProps {
  selectedPlayers: PlayerV1[];
  captainId: number | null;
  setCaptainId: (v: number | null) => void;
  keeperId: number | null;
  setKeeperId: (v: number | null) => void;
  matchFormat: string;
  setMatchFormat: (v: string) => void;
  numberOfOvers: string;
  setNumberOfOvers: (v: string) => void;
  tossWinner: string;
  setTossWinner: (v: string) => void;
  tossDecision: string;
  setTossDecision: (v: string) => void;
  isLoading: boolean;
  onDone: () => void;
  onBack: () => void;
}
export const MatchConditionsScreen: React.FC<MatchConditionsScreenProps> = ({
  selectedPlayers, captainId, setCaptainId, keeperId, setKeeperId,
  matchFormat, setMatchFormat, numberOfOvers, setNumberOfOvers,
  tossWinner, setTossWinner, tossDecision, setTossDecision,
  isLoading, onDone, onBack,
}) => {
  const isComplete = !!(captainId && keeperId && matchFormat &&
    (matchFormat !== 'Limited Overs' || numberOfOvers) && tossWinner && tossDecision);
  return (
    <div className="flex flex-col h-full">
      <NavBar
        title="Match Conditions"
        onBack={onBack}
        rightContent={
          isComplete ? (
            <button onClick={onDone} disabled={isLoading} className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50" aria-label="Done">
              <span className="material-symbols-outlined text-xl leading-none">done</span>
            </button>
          ) : (
            <span className="material-symbols-outlined text-red-400 text-xl leading-none">block</span>
          )
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
        <div className="max-w-lg mx-auto p-4 space-y-5">
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Players</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <label className="w-28 text-sm text-gray-600 flex-shrink-0">Captain</label>
                <select value={captainId ?? ''} onChange={e => setCaptainId(e.target.value ? Number(e.target.value) : null)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                  <option value="">Select...</option>
                  {selectedPlayers.map(p => <option key={p.playerId} value={p.playerId!}>{p.name}</option>)}
                </select>
              </div>
              <div className="flex items-center px-4 py-3">
                <label className="w-28 text-sm text-gray-600 flex-shrink-0">Wicket Keeper</label>
                <select value={keeperId ?? ''} onChange={e => setKeeperId(e.target.value ? Number(e.target.value) : null)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                  <option value="">Select...</option>
                  {selectedPlayers.map(p => <option key={p.playerId} value={p.playerId!}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Match Format</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <label className="w-28 text-sm text-gray-600 flex-shrink-0">Format</label>
                <select value={matchFormat} onChange={e => setMatchFormat(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                  <option value="">Select...</option>
                  <option value="Limited Overs">Limited Overs</option>
                  <option value="Declaration">Declaration</option>
                </select>
              </div>
              {matchFormat === 'Limited Overs' && (
                <div className="flex items-center px-4 py-3">
                  <label className="w-28 text-sm text-gray-600 flex-shrink-0">Overs</label>
                  <input type="number" min={1} placeholder="e.g. 40" value={numberOfOvers} onChange={e => setNumberOfOvers(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none" />
                </div>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">The Toss</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <label className="w-28 text-sm text-gray-600 flex-shrink-0">Winner</label>
                <select value={tossWinner} onChange={e => setTossWinner(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                  <option value="">Select...</option>
                  <option value="We">We</option>
                  <option value="They">They</option>
                </select>
              </div>
              <div className="flex items-center px-4 py-3">
                <label className="w-28 text-sm text-gray-600 flex-shrink-0">Decided to</label>
                <select value={tossDecision} onChange={e => setTossDecision(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
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
