import { getResultBadge, MatchResultData } from './matchResultUtils';

describe('matchResultUtils', () => {
  describe('getResultBadge', () => {
    test('returns WIN badge when isWinner is true', () => {
      const result: MatchResultData = {
        isWinner: true,
        isTied: false,
        isDrawn: false,
        isAbandoned: false
      };

      const badge = getResultBadge(result);

      expect(badge.text).toBe('WIN');
      expect(badge.color).toBe('bg-emerald-100 text-emerald-700');
    });

    test('returns LOSS badge when isWinner is false', () => {
      const result: MatchResultData = {
        isWinner: false,
        isTied: false,
        isDrawn: false,
        isAbandoned: false
      };

      const badge = getResultBadge(result);

      expect(badge.text).toBe('LOSS');
      expect(badge.color).toBe('bg-red-100 text-red-700');
    });

    test('returns N/R badge when match is abandoned', () => {
      const result: MatchResultData = {
        isWinner: null,
        isTied: false,
        isDrawn: false,
        isAbandoned: true
      };

      const badge = getResultBadge(result);

      expect(badge.text).toBe('N/R');
      expect(badge.color).toBe('bg-gray-100 text-gray-700');
    });

    test('returns N/R badge when match is tied', () => {
      const result: MatchResultData = {
        isWinner: null,
        isTied: true,
        isDrawn: false,
        isAbandoned: false
      };

      const badge = getResultBadge(result);

      expect(badge.text).toBe('N/R');
      expect(badge.color).toBe('bg-gray-100 text-gray-700');
    });

    test('returns N/R badge when match is drawn', () => {
      const result: MatchResultData = {
        isWinner: null,
        isTied: false,
        isDrawn: true,
        isAbandoned: false
      };

      const badge = getResultBadge(result);

      expect(badge.text).toBe('N/R');
      expect(badge.color).toBe('bg-gray-100 text-gray-700');
    });

    test('returns N/R badge when isWinner is null', () => {
      const result: MatchResultData = {
        isWinner: null,
        isTied: false,
        isDrawn: false,
        isAbandoned: false
      };

      const badge = getResultBadge(result);

      expect(badge.text).toBe('N/R');
      expect(badge.color).toBe('bg-gray-100 text-gray-700');
    });

    test('prioritizes no-result flags over isWinner', () => {
      // Even if isWinner is true, if match is abandoned, should return N/R
      const result: MatchResultData = {
        isWinner: true,
        isTied: false,
        isDrawn: false,
        isAbandoned: true
      };

      const badge = getResultBadge(result);

      expect(badge.text).toBe('N/R');
      expect(badge.color).toBe('bg-gray-100 text-gray-700');
    });
  });
});
