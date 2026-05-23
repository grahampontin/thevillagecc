import React from 'react';
import { MatchStateV1, PlayerStateV1 } from '../../api/swaggerTypes';
export interface NewOverFormContentProps {
  matchState: MatchStateV1 | null;
  localPlayers: PlayerStateV1[];
  showBatsmanSelects: boolean;
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
  onAddNewBowler: () => void;
  radioGroupName: string;
}
export const NewOverFormContent: React.FC<NewOverFormContentProps> = ({
  matchState, localPlayers, showBatsmanSelects,
  selectedBowler, setSelectedBowler,
  newBowlerInput, setNewBowlerInput,
  showNewBowlerInput, setShowNewBowlerInput,
  strikerBatsmanId, setStrikerBatsmanId,
  nonStrikerBatsmanId, setNonStrikerBatsmanId,
  onAddNewBowler, radioGroupName,
}) => {
  const bowlers = matchState?.bowlers ?? [];
  const bowlerDetails = matchState?.bowlerDetails ?? [];
  const waitingPlayers = localPlayers.filter(p => p.state === 'Waiting');
  return (
    <div className="space-y-4">
      {/* Bowler selection */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bowler</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {bowlers.map((bowler, i) => (
            <label
              key={bowler}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
                i < bowlers.length - 1 ? 'border-b border-gray-100' : ''
              } ${selectedBowler === bowler ? 'bg-villageGreenLight' : 'hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name={radioGroupName}
                checked={selectedBowler === bowler}
                onChange={() => setSelectedBowler(bowler)}
                className="w-4 h-4 accent-villageGreen"
              />
              <span className="flex-1 text-sm font-medium text-gray-900">{bowler}</span>
              {matchState?.previousBowler === bowler && (
                <span className="text-xs text-gray-400">Last over</span>
              )}
            </label>
          ))}
        </div>
        {showNewBowlerInput ? (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Bowler name"
              value={newBowlerInput}
              onChange={e => setNewBowlerInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-villageGreen"
              onKeyDown={e => e.key === 'Enter' && onAddNewBowler()}
            />
            <button onClick={onAddNewBowler} className="bg-villageGreen text-white px-4 py-2 rounded-lg text-sm font-medium">
              Add
            </button>
            <button
              onClick={() => { setShowNewBowlerInput(false); setNewBowlerInput(''); }}
              className="text-gray-500 px-3 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewBowlerInput(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium text-villageGreen hover:bg-villageGreenLight transition-colors"
          >
            <span className="material-symbols-outlined text-lg leading-none">person_add</span>
            New Bowler
          </button>
        )}
      </section>
      {/* Batsmen selection (first over only) */}
      {showBatsmanSelects && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Batsmen</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <label className="w-24 text-sm text-gray-600 flex-shrink-0">Striker</label>
              <select
                value={strikerBatsmanId ?? ''}
                onChange={e => setStrikerBatsmanId(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
              >
                <option value="">Select...</option>
                {waitingPlayers.map(p => (
                  <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-3">
              <label className="w-24 text-sm text-gray-600 flex-shrink-0">Non-Striker</label>
              <select
                value={nonStrikerBatsmanId ?? ''}
                onChange={e => setNonStrikerBatsmanId(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
              >
                <option value="">Select...</option>
                {waitingPlayers.map(p => (
                  <option key={p.playerId} value={p.playerId!}>{p.playerName}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}
      {/* Bowling figures */}
      {!showBatsmanSelects && bowlerDetails.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bowling Figures</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500">
                  <th className="text-left py-2 px-3 font-medium">Bowler</th>
                  <th className="text-right py-2 px-2 font-medium">O</th>
                  <th className="text-right py-2 px-2 font-medium">R</th>
                  <th className="text-right py-2 px-3 font-medium">W</th>
                </tr>
              </thead>
              <tbody>
                {bowlerDetails.map((bd, i) => (
                  <tr key={bd.name ?? i} className={i < bowlerDetails.length - 1 ? 'border-b border-gray-50' : ''}>
                    <td className="py-2 px-3 font-medium text-gray-900 truncate max-w-[140px]">{bd.name}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{bd.details?.overs ?? 0}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{bd.details?.runs ?? 0}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{bd.details?.wickets ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
