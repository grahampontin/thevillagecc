import React from 'react';
import { PlayerV1 } from '../../api/swaggerTypes';
import { NavBar } from './NavBar';
export interface SelectTeamScreenProps {
  allPlayers: PlayerV1[];
  selectedPlayerIds: number[];
  isLoading: boolean;
  onTogglePlayer: (playerId: number) => void;
  onDone: () => void;
  onBack: () => void;
}
export const SelectTeamScreen: React.FC<SelectTeamScreenProps> = ({
  allPlayers, selectedPlayerIds, isLoading, onTogglePlayer, onDone, onBack,
}) => {
  const count = selectedPlayerIds.length;
  const isDone = count === 11;
  return (
    <div className="flex flex-col h-full">
      <NavBar
        title="Select Team"
        onBack={onBack}
        rightContent={
          isDone ? (
            <button onClick={onDone} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Done">
              <span className="material-symbols-outlined text-xl leading-none">done</span>
            </button>
          ) : (
            <span className="text-sm font-medium">{count}/11</span>
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
        <div className="max-w-lg mx-auto p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Players</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {allPlayers.map((player, i) => {
              const isSelected = selectedPlayerIds.includes(player.playerId!);
              return (
                <label
                  key={player.playerId}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
                    i < allPlayers.length - 1 ? 'border-b border-gray-100' : ''
                  } ${isSelected ? 'bg-villageGreenLight' : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onTogglePlayer(player.playerId!)}
                    className="w-4 h-4 accent-villageGreen"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-900">{player.name}</span>
                  <span className="text-xs text-gray-400">{player.matches} matches</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
