import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LiveScorecard from './LiveScorecard';
import { getLiveScorecardData } from '../api/liveScoringApi';

jest.mock('../api/liveScoringApi', () => ({
  getLiveScorecardData: jest.fn(),
}));

// Mock data for completed match (Swagger-aligned LiveScorecardV1)
const mockCompletedScorecardData: any = {
  inPlayData: {
    opposition: 'Dulwich Lawnmower',
    score: 198,
    wickets: 7,
    theirScore: 150,
    theirWickets: 10,
    runRate: 4.95,
    theirRunRate: 3.75,
    ourInningsStatus: 'Completed',
    theirInningsStatus: 'Completed',
    overs: 40,
    declarationGame: false,
    wonToss: true,
    tossWinnerBatted: false,
    ourLastCompletedOver: 40,
    theirOver: 40,
  },
  finalScorecard: {
    ourInnings: {
      batting: {
        entries: [
          {
            playerId: 1,
            playerName: 'Bowman',
            runs: 45,
            modeOfDismissal: 'c Smith b Jones',
            bowlerId: 0,
            bowlerName: 'Jones',
            fielderId: 0,
            fielderName: 'Smith',
            fours: 6,
            sixes: 1,
            battingAt: 1,
            ballsFaced: 32,
            dotBalls: 0,
            wicket: {
              bowler: 'Jones',
              fielder: 'Smith',
              player: 1,
              playerName: 'Bowman',
              description: null,
              modeOfDismissal: 4,
              isRunOut: false,
              isCaught: true,
              isCaughtAndBowled: false,
              isBowled: false,
              isLbw: false,
              isStumped: false,
              isHitWicket: false,
              isRetired: false,
              isRetiredHurt: false,
            },
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
        score: 198,
        wickets: 7,
      },
      bowling: {
        entries: [
          {
            playerName: 'Jones',
            playerId: 0,
            overs: 9,
            maidens: 1,
            runs: 32,
            wickets: 1,
          },
        ],
      },
      fow: { entries: [] },
      inningsLength: 0,
    },
    theirInnings: {
      batting: {
        entries: [],
        extras: {
          wides: 0,
          noBalls: 0,
          byes: 0,
          legByes: 0,
          penalties: 0,
          total: 0,
        },
        score: 150,
        wickets: 10,
      },
      bowling: {
        entries: [],
      },
      fow: { entries: [] },
      inningsLength: 0,
    },
    matchConditions: {
      abandoned: false,
      captainId: 0,
      wicketKeeperId: 0,
      overs: 40,
      declaration: false,
      weWonTheToss: true,
      tossWinnerBatted: false,
    },
  },
  matchReport: {
    conditions: 'Sunny day, good batting conditions',
    report: 'An excellent match with great performances from both teams.',
    base64EncodedImage: '',
  },
  matchData: {
    isHome: true,
    type: 'Friendly',
    date: '2024-06-15',
    opposition: { id: 1, name: 'Dulwich Lawnmower' },
    venue: { id: 1, name: 'Lyndhurst Park', mapUrl: '', description: '', latitude: null, longitude: null },
    id: 123,
  },
  result: {
    matchId: 123,
    venueName: 'Lyndhurst Park',
    matchDate: '2024-06-15',
    isAbandoned: false,
    margin: 'by 48 runs',
    resultText: 'The Village CC won by 48 runs',
  },
};

// Mock data for live match
const mockLiveScorecardData: any = {
  ...mockCompletedScorecardData,
  inPlayData: {
    ...mockCompletedScorecardData.inPlayData,
    ourInningsStatus: 'InProgress',
    theirInningsStatus: 'Completed',
  },
  finalScorecard: {
    ...mockCompletedScorecardData.finalScorecard,
    ourInnings: null,
    theirInnings: null,
  },
  result: {
    ...mockCompletedScorecardData.result,
    resultText: '',
    margin: '',
  },
};

describe('LiveScorecard', () => {
  beforeEach(() => {
    (getLiveScorecardData as jest.Mock).mockReset();
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
    (getLiveScorecardData as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderWithRouter('123');

    expect(screen.getByAltText(/The Village CC/i)).toBeInTheDocument();
  });

  test('fetches and displays completed match scorecard', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getAllByText(/The Village CC/i).length).toBeGreaterThan(0);
    });

    expect(getLiveScorecardData).toHaveBeenCalledWith('123');

    // Check for match details - multiple instances are expected so check length
    expect(screen.getAllByText(/Dulwich Lawnmower/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/The Village CC won by 48 runs/i)).toBeInTheDocument();
    // margin is shown as a second line below the result text badge
    expect(screen.getAllByText(/by 48 runs/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Lyndhurst Park/i)).toBeInTheDocument();
  });

  test('displays live match with LIVE badge', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockLiveScorecardData);

    renderWithRouter('456');

    await waitFor(() => {
      expect(screen.getByText(/LIVE/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Dulwich Lawnmower/i)).toBeInTheDocument();
  });

  test('displays abandoned match message', async () => {
    const abandonedData = {
      ...mockCompletedScorecardData,
      result: {
        isAbandoned: true,
        margin: '',
        resultText: '',
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(abandonedData);

    renderWithRouter('789');

    await waitFor(() => {
      expect(screen.getByText(/ABANDONED/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/This match was abandoned/i)).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    (getLiveScorecardData as jest.Mock).mockRejectedValueOnce(new Error('HTTP 404 Not Found: Match not found'));

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
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText(/The Village CC Innings/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Batter/i).length).toBeGreaterThan(0);
    });
  });

  test('formats caught dismissal as ct. [Fielder] b. [Bowler]', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText('ct. Smith b. Jones')).toBeInTheDocument();
    });
  });

  test('formats dismissal types correctly', async () => {
    const multiDismissalData: any = {
      ...mockCompletedScorecardData,
      finalScorecard: {
        ...mockCompletedScorecardData.finalScorecard,
        ourInnings: {
          ...mockCompletedScorecardData.finalScorecard.ourInnings,
          batting: {
            entries: [
              {
                playerName: 'Player1', runs: 10, fours: 1, sixes: 0, ballsFaced: 15,
                wicket: { bowler: 'Bowler1', fielder: null, isBowled: true },
              },
              {
                playerName: 'Player2', runs: 5, fours: 0, sixes: 0, ballsFaced: 8,
                wicket: { bowler: 'Bowler2', fielder: null, isLbw: true },
              },
              {
                playerName: 'Player3', runs: 20, fours: 2, sixes: 0, ballsFaced: 22,
                wicket: { bowler: 'Bowler3', fielder: null, isCaughtAndBowled: true },
              },
              {
                playerName: 'Player4', runs: 0, fours: 0, sixes: 0, ballsFaced: 3,
                wicket: { bowler: 'Bowler4', fielder: 'Keeper1', isStumped: true },
              },
              {
                playerName: 'Player5', runs: 8, fours: 0, sixes: 0, ballsFaced: 10,
                wicket: { bowler: null, fielder: 'Fielder1', isRunOut: true },
              },
              {
                playerName: 'Player6', runs: 30, fours: 3, sixes: 1, ballsFaced: 28,
                wicket: { bowler: 'Bowler6', fielder: null, isHitWicket: true },
              },
              {
                playerName: 'Player7', runs: 15, fours: 1, sixes: 0, ballsFaced: 20,
                wicket: { isRetiredHurt: true },
              },
              {
                playerName: 'Player8', runs: 22, fours: 2, sixes: 0, ballsFaced: 25,
                wicket: { isRetired: true },
              },
              {
                playerName: 'Player9', runs: 5, fours: 0, sixes: 0, ballsFaced: 7,
              },
            ],
            extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0, total: 0 },
            score: 115,
            wickets: 8,
          },
        },
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(multiDismissalData);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText('b. Bowler1')).toBeInTheDocument();
    });
    expect(screen.getByText('lbw b. Bowler2')).toBeInTheDocument();
    expect(screen.getByText('c&b Bowler3')).toBeInTheDocument();
    expect(screen.getByText('st. Keeper1 b. Bowler4')).toBeInTheDocument();
    expect(screen.getByText('run out (Fielder1)')).toBeInTheDocument();
    expect(screen.getByText('hit wicket')).toBeInTheDocument();
    expect(screen.getByText('retired hurt')).toBeInTheDocument();
    expect(screen.getByText('retired')).toBeInTheDocument();
    expect(screen.getByText('not out')).toBeInTheDocument();
  });

  test('displays match report for completed match', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText(/Match Report/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Sunny day, good batting conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/An excellent match with great performances from both teams/i)).toBeInTheDocument();
  });

  test('handles fetch exception gracefully', async () => {
    (getLiveScorecardData as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  test('renders with real API response shape (camelCase) without crashing', async () => {
    const realApiShape: any = {
      inPlayData: {
        opposition: 'Cookham Dean Cricket Club',
        ourLastCompletedOver: 0,
        oversRemaining: 40,
        declarationGame: false,
        score: 0,
        wickets: 0,
        runRate: 0,
        overs: 40,
        tossWinnerBatted: true,
        wonToss: false,
        ourInningsStatus: 'NotStarted',
        theirInningsStatus: 'NotStarted',
        theirScore: 0,
        theirWickets: 0,
        theirOver: 0,
        theirRunRate: 0,
        isFirstInnings: true,
        isMatchComplete: false,
        resultText: null,
        ourInningsCommentary: '',
        theirInningsCommentary: '',
      },
      finalScorecard: mockCompletedScorecardData.finalScorecard,
      matchReport: {
        conditions: 'Not recorded',
        report: 'No report',
        base64EncodedImage: '',
      },
      matchData: {
        isHome: false,
        type: 'Friendly',
        date: '2023-09-16T00:00:00',
        opposition: { id: 115, name: 'Cookham Dean Cricket Club' },
        venue: { id: 97, name: 'Cookham', mapUrl: '', description: '', latitude: null, longitude: null },
        id: 509,
      },
      result: {
        matchId: 509,
        isAbandoned: false,
        margin: 'by 128 runs',
        resultText: 'beat',
        venueName: 'Cookham',
        matchDate: '2023-09-16',
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(realApiShape);

    renderWithRouter('509');

    await waitFor(() => {
      expect(screen.getAllByText(/Cookham Dean Cricket Club/i).length).toBeGreaterThan(0);
    });

    // Because the fixture includes a populated finalScorecard, LiveScorecard treats
    // the match as completed. The result text and margin are shown vertically stacked.
    expect(screen.getByText(/^beat$/i)).toBeInTheDocument();
    expect(screen.getByText(/by 128 runs/i)).toBeInTheDocument();
  });

  test('places opposition (home team) on left when village is the away team', async () => {
    const awayMatchData = {
      ...mockCompletedScorecardData,
      matchData: {
        ...mockCompletedScorecardData.matchData,
        isHome: false,
      },
      result: {
        ...mockCompletedScorecardData.result,
        resultText: 'beat',
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(awayMatchData);

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getAllByText(/Dulwich Lawnmower/i).length).toBeGreaterThan(0);
    });

    // When Village is the away team, the opposition (home team) should appear first in the hero card
    const headings = screen.getAllByRole('heading', { level: 1 });
    // First h1 in hero card should be the home team (Dulwich Lawnmower)
    expect(headings[0].textContent).toBe('Dulwich Lawnmower');
    // Second h1 in hero card should be the away team (The Village CC)
    expect(headings[1].textContent).toBe('The Village CC');
  });

  test('places village on left when village is the home team', async () => {
    // mockCompletedScorecardData has isHome: true
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getAllByText(/The Village CC/i).length).toBeGreaterThan(0);
    });

    const headings = screen.getAllByRole('heading', { level: 1 });
    // First h1 in hero card should be Village CC (home team on left)
    expect(headings[0].textContent).toBe('The Village CC');
    expect(headings[1].textContent).toBe('Dulwich Lawnmower');
  });

  test('shows COMPLETED fallback when resultText is empty', async () => {
    const noResultTextData = {
      ...mockCompletedScorecardData,
      result: {
        ...mockCompletedScorecardData.result,
        resultText: '',
        margin: '',
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(noResultTextData);

    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText(/COMPLETED/i)).toBeInTheDocument();
    });
  });
});
