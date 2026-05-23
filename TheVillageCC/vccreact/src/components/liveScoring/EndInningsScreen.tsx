import React from 'react';
import { NavBar } from './NavBar';
export interface EndInningsScreenProps {
  endInningsType: string;
  inningsDeclared: boolean;
  setInningsDeclared: (v: boolean) => void;
  endInningsCommentary: string;
  setEndInningsCommentary: (v: string) => void;
  isLoading: boolean;
  onConfirm: () => void;
}
export const EndInningsScreen: React.FC<EndInningsScreenProps> = ({
  endInningsType, inningsDeclared, setInningsDeclared,
  endInningsCommentary, setEndInningsCommentary,
  isLoading, onConfirm,
}) => (
  <div className="flex flex-col h-full">
    <NavBar
      title="End Innings"
      rightContent={
        <button onClick={onConfirm} disabled={isLoading} className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50" aria-label="Done">
          <span className="material-symbols-outlined text-xl leading-none">done</span>
        </button>
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
          {endInningsType === 'batting' && (
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-40 text-sm text-gray-600 flex-shrink-0">Innings Declared?</label>
              <select value={inningsDeclared ? 'true' : 'false'} onChange={e => setInningsDeclared(e.target.value === 'true')} className="flex-1 text-sm text-gray-900 bg-transparent outline-none">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          )}
          <div className="flex items-start px-4 py-3">
            <span className="material-symbols-outlined text-gray-400 text-lg mr-3 mt-0.5">comment</span>
            <textarea
              placeholder="Channel your inner Tuffers, how would you summarize that effort?"
              value={endInningsCommentary}
              onChange={e => setEndInningsCommentary(e.target.value)}
              rows={4}
              className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
