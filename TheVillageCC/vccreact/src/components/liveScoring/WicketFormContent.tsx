import React from 'react';
import { PlayerStateV1 } from '../../api/swaggerTypes';
import { DISMISSAL_MODES } from '../../utils/liveScoringTypes';

export interface WicketFormContentProps {
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
}

export const WicketFormContent: React.FC<WicketFormContentProps> = ({
  localPlayers,
  wicketBatterOutId, setWicketBatterOutId,
  wicketDismissalCode, setWicketDismissalCode,
  wicketFielder, setWicketFielder,
  wicketRuns, setWicketRuns,
  wicketRunsType, setWicketRunsType,
  wicketNextBatterInId, setWicketNextBatterInId,
  wicketBatsmenCrossed, setWicketBatsmenCrossed,
  wicketCommentary, setWicketCommentary,
}) => {
  const battingPlayers = localPlayers.filter(p => p.state === 'Batting');
  const waitingPlayers = localPlayers.filter(p => p.state === 'Waiting');
  const selectedDismissalMode = DISMISSAL_MODES.find(m => m.code === wicketDismissalCode);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <label className="w-32 text-sm text-gray-600 flex-shrink-0">Batsman out</label>
        <select
          value={wicketBatterOutId ?? ''}
          onChange={e => setWicketBatterOutId(e.target.value ? Number(e.target.value) : null)}
          className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
        >
          {battingPlayers.map(p => (
            <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <label className="w-32 text-sm text-gray-600 flex-shrink-0">Dismissal</label>
        <select
          value={wicketDismissalCode}
          onChange={e => setWicketDismissalCode(e.target.value)}
          className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
        >
          <option value="">Select...</option>
          {DISMISSAL_MODES.map(m => (
            <option key={m.code} value={m.code}>{m.label}</option>
          ))}
        </select>
      </div>
      {selectedDismissalMode?.hasFielder && (
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <label className="w-32 text-sm text-gray-600 flex-shrink-0">Fielder</label>
          <input
            type="text"
            placeholder="Add name..."
            value={wicketFielder}
            onChange={e => setWicketFielder(e.target.value)}
            className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
          />
        </div>
      )}
      {selectedDismissalMode?.hasRuns && (
        <>
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <label className="w-32 text-sm text-gray-600 flex-shrink-0">Score for ball</label>
            <input
              type="number"
              min={0}
              max={6}
              value={wicketRuns}
              onChange={e => setWicketRuns(e.target.value)}
              className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
            />
          </div>
          {parseInt(wicketRuns, 10) > 0 && (
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-32 text-sm text-gray-600 flex-shrink-0">Runs/Extras?</label>
              <select
                value={wicketRunsType}
                onChange={e => setWicketRunsType(e.target.value)}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
              >
                <option value="">Runs</option>
                <option value="wd">Wides</option>
                <option value="nb">No balls</option>
                <option value="lb">Leg byes</option>
                <option value="b">Byes</option>
              </select>
            </div>
          )}
        </>
      )}
      {selectedDismissalMode?.hasCrossed && (
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <label className="w-32 text-sm text-gray-600 flex-shrink-0">Batsmen crossed?</label>
          <select
            value={wicketBatsmenCrossed ? 'true' : 'false'}
            onChange={e => setWicketBatsmenCrossed(e.target.value === 'true')}
            className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      )}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <label className="w-32 text-sm text-gray-600 flex-shrink-0">Next in</label>
        <select
          value={wicketNextBatterInId}
          onChange={e => setWicketNextBatterInId(Number(e.target.value))}
          className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
        >
          <option value={-1}>{waitingPlayers.length === 0 ? 'Last wicket' : 'Select...'}</option>
          {waitingPlayers.map(p => (
            <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
          ))}
        </select>
      </div>
      <div className="flex items-start px-4 py-3">
        <span className="material-symbols-outlined text-gray-400 text-lg mr-3 mt-0.5">comment</span>
        <textarea
          placeholder="Ah nuts, talk us through it champ."
          value={wicketCommentary}
          onChange={e => setWicketCommentary(e.target.value)}
          rows={3}
          className="flex-1 text-sm text-gray-900 bg-transparent outline-none resize-none"
        />
      </div>
    </div>
  );
};

