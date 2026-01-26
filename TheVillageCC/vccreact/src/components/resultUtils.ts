import { MatchResult } from './ResultCard';

const VILLAGE_CC_NAME = 'The Village CC';

export const getResultStatus = (result: MatchResult): { color: string; text: string } => {
  // No result cases
  if (result.IsAbandoned) {
    return { color: 'bg-gray-100 text-gray-700', text: 'N/R' };
  }
  
  if (result.IsTied) {
    return { color: 'bg-gray-100 text-gray-700', text: 'N/R' };
  }
  
  if (result.IsDrawn) {
    return { color: 'bg-gray-100 text-gray-700', text: 'N/R' };
  }
  
  // Win/Loss from The Village CC's perspective
  if (result.WinningTeam === VILLAGE_CC_NAME) {
    return { color: 'bg-emerald-100 text-emerald-700', text: 'WIN' };
  }
  
  if (result.LosingTeam === VILLAGE_CC_NAME) {
    return { color: 'bg-red-100 text-red-700', text: 'LOSS' };
  }
  
  // Fallback to N/R if we can't determine the result
  return { color: 'bg-gray-100 text-gray-700', text: 'N/R' };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const getOpponentName = (result: MatchResult): string => {
  return result.HomeTeamName === VILLAGE_CC_NAME ? result.AwayTeamName : result.HomeTeamName;
};
