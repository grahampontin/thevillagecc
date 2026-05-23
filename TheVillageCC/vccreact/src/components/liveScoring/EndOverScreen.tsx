import React from 'react';
import { MatchStateV1 } from '../../api/swaggerTypes';
import { LocalBall } from '../../utils/liveScoringTypes';
import { getBallLabel, isLegalDelivery } from '../../utils/liveScoringUtils';
import { NavBar } from './NavBar';
export interface EndOverScreenProps {
  matchState: MatchStateV1 | null;
  localBalls: LocalBall[];
  endOverCommentary: string;
  setEndOverCommentary: (v: string) => void;
  isLoading: boolean;
  onSubmitOver: () => void;
  onAbandon: () => void;
  onBack: () => void;
}
export const EndOverScreen: React.FC<EndOverScreenProps> = ({
  matchState, localBalls, endOverCommentary, setEndOverCommentary,
  isLoading, onSubmitOver, onAbandon, onBack,
}) => {
  const overNum = (matchState?.lastCompletedOver ?? 0) + 1;
  return (
    <div className="flex flex-col h-full">
      <NavBar
        title="End Over"
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-1">
            <button onClick={onAbandon} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Abandon match" title="Abandon match">
              <span className="material-symbols-outlined text-xl leading-none text-amber-300">dangerous</span>
            </button>
            <button onClick={onSubmitOver} disabled={isLoading} className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50" aria-label="Done">
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
        <div className="max-w-lg mx-auto p-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {localBalls.map((ball, i) => {
              const legalCount = localBalls.slice(0, i + 1).filter(isLegalDelivery).length;
              const ballLabel2 = isLegalDelivery(ball) ? `${overNum}.${legalCount}` : `${overNum}.${legalCount}*`;
              const { label, className: ballClass } = getBallLabel(ball);
              return (
                <div key={i} className={`flex items-center px-4 py-3 ${i < localBalls.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="w-10 flex-shrink-0">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{ballLabel2}</span>
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="text-xs text-gray-500">{ball.bowlerName} to {ball.batsmanName}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {ball.wicket ? 'OUT!' : `${label === '\u00b7' ? 'No run' : label + (ball.thing ? ` (${ball.thing})` : ' runs')}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Commentary</label>
            <textarea
              placeholder="Talk us through it champ..."
              value={endOverCommentary}
              onChange={e => setEndOverCommentary(e.target.value)}
              rows={4}
              className="w-full text-sm text-gray-900 outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
