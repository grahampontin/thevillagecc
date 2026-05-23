import React from 'react';
import { MatchStateV1, PlayerStateV1 } from '../../api/swaggerTypes';
import { NavBar } from './NavBar';
import { NewOverFormContent } from './NewOverFormContent';
export interface NewOverScreenProps {
  matchState: MatchStateV1 | null;
  localPlayers: PlayerStateV1[];
  selectedBowler: string;
  setSelectedBowler: (v: string) => void;
  newBowlerInput: string;
  setNewBowlerInput: (v: string) => void;
  showNewBowlerInput: boolean;
  setShowNewBowlerInput: (v: boolean) => void;
  strikerBatsmanId: number | null;
  setStrikerBatsmanId: (v: number | null) => void;
  nonStrikerBatsmanId: number | null;
  setNonStrikerBatsmanId: (v: number | null) => void;
  isNewOverValid: () => string | null;
  onAddNewBowler: () => void;
  onDone: () => void;
}
export const NewOverScreen: React.FC<NewOverScreenProps> = ({
  matchState, localPlayers,
  selectedBowler, setSelectedBowler,
  newBowlerInput, setNewBowlerInput,
  showNewBowlerInput, setShowNewBowlerInput,
  strikerBatsmanId, setStrikerBatsmanId,
  nonStrikerBatsmanId, setNonStrikerBatsmanId,
  isNewOverValid, onAddNewBowler, onDone,
}) => {
  const validationError = isNewOverValid();
  const showBatsmanSelects = localPlayers.filter(p => p.state === 'Batting').length === 0;
  // Score summary values (shown after previous over was submitted)
  const newOverScore = matchState?.score ?? 0;
  const newOverWickets = (matchState?.players ?? []).filter(p => p.state === 'Out').length;
  const newOverOvers = matchState?.lastCompletedOver ?? 0;
  const isFirstOver = showBatsmanSelects;
  return (
    <div className="flex flex-col h-full">
      <NavBar
        title="Over Details"
        rightContent={
          !validationError ? (
            <button onClick={onDone} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Done">
              <span className="material-symbols-outlined text-xl leading-none">done</span>
            </button>
          ) : (
            <span className="material-symbols-outlined text-red-400 text-xl leading-none">block</span>
          )
        }
      />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-lg mx-auto p-4 space-y-4">
          {/* Match score summary */}
          {!isFirstOver && (
            <div className="bg-villageGreen text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-medium opacity-75 uppercase tracking-wide">Score</p>
                <p className="text-2xl font-bold leading-tight">
                  {newOverScore}<span className="text-lg font-semibold opacity-80">/{newOverWickets}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium opacity-75 uppercase tracking-wide">Overs</p>
                <p className="text-2xl font-bold leading-tight">{newOverOvers}</p>
              </div>
            </div>
          )}
          <NewOverFormContent
            matchState={matchState}
            localPlayers={localPlayers}
            showBatsmanSelects={showBatsmanSelects}
            selectedBowler={selectedBowler}
            setSelectedBowler={setSelectedBowler}
            newBowlerInput={newBowlerInput}
            setNewBowlerInput={setNewBowlerInput}
            showNewBowlerInput={showNewBowlerInput}
            setShowNewBowlerInput={setShowNewBowlerInput}
            strikerBatsmanId={strikerBatsmanId}
            setStrikerBatsmanId={setStrikerBatsmanId}
            nonStrikerBatsmanId={nonStrikerBatsmanId}
            setNonStrikerBatsmanId={setNonStrikerBatsmanId}
            onAddNewBowler={onAddNewBowler}
            radioGroupName="bowler-radio"
          />
        </div>
      </div>
    </div>
  );
};
