import React from 'react';
import { PlayerStateV1 } from '../../api/swaggerTypes';
import { NavBar } from './NavBar';
import { WicketFormContent } from './WicketFormContent';
export interface WicketScreenProps {
  localPlayers: PlayerStateV1[];
  wicketBatterOutId: number | null;
  setWicketBatterOutId: (v: number | null) => void;
  wicketDismissalCode: string;
  setWicketDismissalCode: (v: string) => void;
  wicketFielder: string;
  setWicketFielder: (v: string) => void;
  wicketRuns: string;
  setWicketRuns: (v: string) => void;
  wicketRunsType: string;
  setWicketRunsType: (v: string) => void;
  wicketNextBatterInId: number;
  setWicketNextBatterInId: (v: number) => void;
  wicketBatsmenCrossed: boolean;
  setWicketBatsmenCrossed: (v: boolean) => void;
  wicketCommentary: string;
  setWicketCommentary: (v: string) => void;
  isWicketValid: () => string | null;
  onConfirm: () => void;
  onBack: () => void;
}
export const WicketScreen: React.FC<WicketScreenProps> = ({
  localPlayers, wicketBatterOutId, setWicketBatterOutId,
  wicketDismissalCode, setWicketDismissalCode,
  wicketFielder, setWicketFielder,
  wicketRuns, setWicketRuns,
  wicketRunsType, setWicketRunsType,
  wicketNextBatterInId, setWicketNextBatterInId,
  wicketBatsmenCrossed, setWicketBatsmenCrossed,
  wicketCommentary, setWicketCommentary,
  isWicketValid, onConfirm, onBack,
}) => {
  const wicketError = isWicketValid();
  return (
    <div className="flex flex-col h-full">
      <NavBar
        title="Wicket!"
        onBack={onBack}
        rightContent={
          !wicketError ? (
            <button onClick={onConfirm} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Done">
              <span className="material-symbols-outlined text-xl leading-none">done</span>
            </button>
          ) : (
            <span className="material-symbols-outlined text-red-400 text-xl leading-none">block</span>
          )
        }
      />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-lg mx-auto p-4">
          <WicketFormContent
            localPlayers={localPlayers}
            wicketBatterOutId={wicketBatterOutId}
            setWicketBatterOutId={setWicketBatterOutId}
            wicketDismissalCode={wicketDismissalCode}
            setWicketDismissalCode={setWicketDismissalCode}
            wicketFielder={wicketFielder}
            setWicketFielder={setWicketFielder}
            wicketRuns={wicketRuns}
            setWicketRuns={setWicketRuns}
            wicketRunsType={wicketRunsType}
            setWicketRunsType={setWicketRunsType}
            wicketNextBatterInId={wicketNextBatterInId}
            setWicketNextBatterInId={setWicketNextBatterInId}
            wicketBatsmenCrossed={wicketBatsmenCrossed}
            setWicketBatsmenCrossed={setWicketBatsmenCrossed}
            wicketCommentary={wicketCommentary}
            setWicketCommentary={setWicketCommentary}
          />
        </div>
      </div>
    </div>
  );
};
