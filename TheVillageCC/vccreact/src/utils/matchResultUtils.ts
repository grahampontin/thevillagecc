/**
 * Utility functions for match results
 */

export interface MatchResultBadge {
  color: string;
  text: string;
}

export interface MatchResultData {
  isWinner: boolean | null;
  isTied: boolean;
  isDrawn: boolean;
  isAbandoned: boolean;
}

/**
 * Get the result badge (color and text) from The Village CC's perspective
 * @param result - Match result data with isWinner, isTied, isDrawn, isAbandoned fields
 * @returns Badge color classes and text to display
 */
export const getResultBadge = (result: MatchResultData): MatchResultBadge => {
  // Check for no result scenarios
  if (result.isAbandoned || result.isTied || result.isDrawn) {
    return { color: 'bg-gray-100 text-gray-700', text: 'N/R' };
  }
  
  // Check if The Village CC won or lost from their perspective
  if (result.isWinner === true) {
    return { color: 'bg-emerald-100 text-emerald-700', text: 'WIN' };
  } else if (result.isWinner === false) {
    return { color: 'bg-red-100 text-red-700', text: 'LOSS' };
  } else {
    // Fallback if isWinner is null
    return { color: 'bg-gray-100 text-gray-700', text: 'N/R' };
  }
};
