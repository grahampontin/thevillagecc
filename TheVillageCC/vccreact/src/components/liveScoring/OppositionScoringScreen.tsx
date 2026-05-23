import React from 'react';
import { NavBar } from './NavBar';
export interface OppositionScoringScreenProps {
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
}
export const OppositionScoringScreen: React.FC<OppositionScoringScreenProps> = ({
  oppScore, setOppScore, oppOvers, setOppOvers, oppWickets, setOppWickets,
  oppCommentary, setOppCommentary, isLoading, onConfirm, onAbandon,
}) => (
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
