import React from 'react';
import { NavBar } from './NavBar';
export interface EndMatchScreenProps {
  selectedMatchId: number | null;
  onBack: () => void;
}
export const EndMatchScreen: React.FC<EndMatchScreenProps> = ({ selectedMatchId, onBack }) => (
  <div className="flex flex-col h-full">
    <NavBar title="Game Over" />
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <span className="material-symbols-outlined text-6xl text-villageGreen mb-4">emoji_events</span>
      <h2 className="text-2xl font-bold text-villageText mb-2">Match Complete!</h2>
      <p className="text-gray-500 mb-8">Thanks for scoring. Bye!</p>
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {selectedMatchId && (
          <a
            href={`/scorecard/${selectedMatchId}`}
            className="w-full text-center bg-villageGreen text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            View Scorecard
          </a>
        )}
        <button
          onClick={onBack}
          className="w-full text-center bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Admin
        </button>
      </div>
    </div>
  </div>
);
