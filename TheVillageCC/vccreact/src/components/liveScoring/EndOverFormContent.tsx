import React from 'react';
import { LocalBall } from '../../utils/liveScoringTypes';
import { getBallLabel, isLegalDelivery } from '../../utils/liveScoringUtils';
export interface EndOverFormContentProps {
  localBalls: LocalBall[];
  overNum: number;
  endOverCommentary: string;
  setEndOverCommentary: (v: string) => void;
  isLoading: boolean;
  onSubmitOver: () => void;
  onEditBall: (index: number) => void;
}
export const EndOverFormContent: React.FC<EndOverFormContentProps> = ({
  localBalls, overNum, endOverCommentary, setEndOverCommentary,
  isLoading, onSubmitOver, onEditBall,
}) => (
  <div className="p-4 space-y-4">
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {localBalls.map((ball, i) => {
        const legalCount = localBalls.slice(0, i + 1).filter(isLegalDelivery).length;
        const ballLabel = isLegalDelivery(ball) ? `${overNum}.${legalCount}` : `${overNum}.${legalCount}*`;
        const { label: lbl } = getBallLabel(ball);
        return (
          <div key={i} className={`flex items-center px-4 py-2.5 ${i < localBalls.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <span className="text-xs font-mono text-gray-400 w-10 flex-shrink-0">{ballLabel}</span>
            <div className="flex-1 ml-2">
              <p className="text-xs text-gray-500">{ball.bowlerName} → {ball.batsmanName}</p>
              <p className="text-sm font-medium text-gray-900">
                {ball.wicket
                  ? <span className="text-red-600 font-bold">OUT! {ball.wicket.playerName}</span>
                  : `${lbl === '·' ? 'No run' : lbl + (ball.thing ? ` (${ball.thing})` : ' runs')}`}
              </p>
            </div>
            <button
              onClick={() => onEditBall(i)}
              className="p-1 text-gray-300 hover:text-villageGreen transition-colors flex-shrink-0"
              aria-label="Edit ball"
            >
              <span className="material-symbols-outlined text-base leading-none">edit</span>
            </button>
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
        rows={3}
        className="w-full text-sm text-gray-900 outline-none resize-none"
      />
    </div>
    <button
      onClick={onSubmitOver}
      disabled={isLoading}
      className="w-full py-3 bg-villageGreen text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
      ) : (
        <><span className="material-symbols-outlined text-lg leading-none">done</span>Submit Over</>
      )}
    </button>
  </div>
);
