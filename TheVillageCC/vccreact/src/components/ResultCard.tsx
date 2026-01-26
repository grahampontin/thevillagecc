import React from 'react';
import { getResultStatus, formatDate, getOpponentName } from './resultUtils';

export interface MatchResult {
  MatchId: number;
  HomeTeamName: string;
  HomeTeamScore: string;
  AwayTeamName: string;
  AwayTeamScore: string;
  ResultText: string;
  ResultMargin: string;
  MatchDate: string;
  WinningTeam?: string;
  LosingTeam?: string;
  IsTied?: boolean;
  IsDrawn?: boolean;
  IsAbandoned?: boolean;
}

interface ResultCardProps {
  result: MatchResult;
  showFullResult?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, showFullResult = true }) => {
  const status = getResultStatus(result);
  const opponentName = getOpponentName(result);
  
  return (
    <a
      href={`/LiveScorecard.aspx?matchId=${result.MatchId}`}
      className="block"
    >
      <article className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-villageGreen transition">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{formatDate(result.MatchDate)} · vs {opponentName}</span>
          <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${status.color}`}>
            {status.text}
          </span>
        </div>
        {showFullResult && (
          <>
            <div className="text-sm font-semibold text-villageText">
              {result.HomeTeamName}{result.HomeTeamScore ? ` ${result.HomeTeamScore}` : ''} · {result.AwayTeamName}{result.AwayTeamScore ? ` ${result.AwayTeamScore}` : ''}
            </div>
            {result.ResultMargin && (
              <p className="mt-1 text-sm text-gray-600 italic">
                {result.ResultMargin}
              </p>
            )}
          </>
        )}
      </article>
    </a>
  );
};

export default ResultCard;
