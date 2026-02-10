import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LiveScorecard from './LiveScorecard';

// Mock fetch globally
global.fetch = jest.fn();

// Mock data for completed match
const mockCompletedScorecardData = {
  InPlayData: {
    Opposition: 'Dulwich Lawnmower',
    Score: 198,
    Wickets: 7,
    TheirScore: 150,
    TheirWickets: 10,
    RunRate: 4.95,
    TheirRunRate: 3.75,
    OurInningsStatus: 'Completed' as const,
    TheirInningsStatus: 'Completed' as const,
    Overs: 40,
    Declaration: false,
    WonToss: true,
    TossWinnerBatted: false,
    OurLastCompletedOver: 40,
    TheirOver: 40,
  },
  FinalScorecard: {
    ourInnings: {
      batting: {
        entries: [
          {
            playerName: 'Bowman',
            runs: 45,
            balls: 32,
            fours: 6,
            sixes: 1,
            strikeRate: 140.62,
            howOut: 'c Smith b Jones',
          },
          {
            playerName: 'Fruit',
            runs: 28,
            balls: 24,
            fours: 3,
            sixes: 1,
            strikeRate: 116.67,
            howOut: 'lbw b Misra',
          },
        ],
        extras: {
          wides: 6,
          noBalls: 4,
          byes: 4,
          legByes: 2,
          penalties: 0,
          total: 16,
        },
        fallOfWickets: '1-12 (Bowman, 4.2 ov), 2-45 (Fruit, 9.1 ov)',
      },
      bowling: {
        entries: [
          {
            playerName: 'Jones',
            overs: 9,
            maidens: 1,
            runs: 32,
            wickets: 1,
            economy: 3.56,
          },
        ],
      },
    },
    theirInnings: {
      batting: {
        entries: [
          {
            playerName: 'Smith',
            runs: 35,
            balls: 40,
            fours: 4,
            sixes: 0,
            strikeRate: 87.5,
            howOut: 'b Pontin',
          },
        ],
        extras: {
          wides: 3,
          noBalls: 2,
          byes: 2,
          legByes: 1,
          penalties: 0,
          total: 8,
        },
        fallOfWickets: '1-35 (Smith, 10.2 ov)',
      },
      bowling: {
        entries: [
          {
            playerName: 'Pontin',
            overs: 8,
            maidens: 2,
            runs: 25,
            wickets: 3,
            economy: 3.12,
          },
        ],
      },
    },
  },
  MatchReport: {
    Conditions: 'Sunny day, good batting conditions',
    Report: 'An excellent match with great performances from both teams.',
  },
  Result: {
    IsAbandoned: false,
    Margin: 'by 48 runs',
    ResultText: 'The Village CC won by 48 runs',
  },
  MatchDate: '2024-06-15',
  VenueName: 'Lyndhurst Park',
  MatchType: 'Friendly',
};

// Mock data for live match
const mockLiveScorecardData = {
  InPlayData: {
    Opposition: 'Dulwich Lawnmower',
    Score: 142,
    Wickets: 6,
    TheirScore: 198,
    TheirWickets: 7,
    RunRate: 4.95,
    TheirRunRate: 4.95,
    OurInningsStatus: 'InProgress' as const,
    TheirInningsStatus: 'Completed' as const,
    Overs: 40,
    Declaration: false,
    WonToss: true,
    TossWinnerBatted: false,
    OurLastCompletedOver: 28.4,
    TheirOver: 40,
  },
  FinalScorecard: {
    ourInnings: null,
    theirInnings: null,
  },
  MatchReport: {
    Conditions: '',
    Report: '',
  },
  Result: {
    IsAbandoned: false,
    Margin: '',
    ResultText: '',
  },
  MatchDate: '2024-06-15',
  VenueName: 'Lyndhurst Park',
  MatchType: 'Friendly',
};

describe('LiveScorecard', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  const renderWithRouter = (matchId: string) => {
    return render(
      <MemoryRouter initialEntries={[`/scorecard/${matchId}`]}>
        <Routes>
          <Route path="/scorecard/:matchId" element={<LiveScorecard />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter('123');
    
    expect(screen.getByText(/Village Cricket Club/i)).toBeInTheDocument();
  });

  test('fetches and displays completed match scorecard', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompletedScorecardData,
    });

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getAllByText(/The Village CC/i).length).toBeGreaterThan(0);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/livescoring/123/scorecard', expect.objectContaining({
      headers: expect.objectContaining({
        'Accept': 'application/json'
      })
    }));

    // Check for match details - multiple instances are expected so check length
    expect(screen.getAllByText(/Dulwich Lawnmower/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/COMPLETED/i)).toBeInTheDocument();
    expect(screen.getByText(/Lyndhurst Park/i)).toBeInTheDocument();
    
    // Check for result text
    expect(screen.getByText(/The Village CC won by 48 runs/i)).toBeInTheDocument();
  });

  test('displays live match with LIVE badge', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLiveScorecardData,
    });

    renderWithRouter('456');

    await waitFor(() => {
      expect(screen.getByText(/LIVE/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Dulwich Lawnmower/i)).toBeInTheDocument();
  });

  test('displays abandoned match message', async () => {
    const abandonedData = {
      ...mockCompletedScorecardData,
      Result: {
        IsAbandoned: true,
        Margin: '',
        ResultText: '',
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => abandonedData,
    });

    renderWithRouter('789');

    await waitFor(() => {
      expect(screen.getByText(/ABANDONED/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/This match was abandoned/i)).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Match not found',
    });

    renderWithRouter('999');

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Scorecard/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/HTTP 404 Not Found/i)).toBeInTheDocument();
  });

  test('handles missing match ID', async () => {
    render(
      <MemoryRouter initialEntries={['/scorecard/']}>
        <Routes>
          <Route path="/scorecard/:matchId?" element={<LiveScorecard />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No match ID provided/i)).toBeInTheDocument();
    });
  });

  test('displays batting and bowling tables for completed match', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompletedScorecardData,
    });

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText(/The Village CC Innings/i)).toBeInTheDocument();
    });

    // Initially, innings should be collapsed or one expanded
    // The component auto-expands the most recent/relevant innings
    await waitFor(() => {
      // Check for batting table headers
      expect(screen.getAllByText(/Batter/i).length).toBeGreaterThan(0);
    });
  });

  test('displays match report for completed match', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompletedScorecardData,
    });

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText(/Match Report/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Sunny day, good batting conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/An excellent match with great performances from both teams/i)).toBeInTheDocument();
  });

  test('handles fetch exception gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });
});
