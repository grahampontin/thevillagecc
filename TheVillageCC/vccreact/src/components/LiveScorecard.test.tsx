import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
            modeOfDismissal: 'Caught',
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
              modeOfDismissal: 'Caught',
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

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

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

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

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

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

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

    // Match report is now always visible (not behind a collapsible button)
    await waitFor(() => {
      expect(screen.getByText(/Sunny day, good batting conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/An excellent match with great performances from both teams/i)).toBeInTheDocument();
    });

    // The section heading should be visible
    expect(screen.getByText(/^Match Report$/i)).toBeInTheDocument();
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

  test('shows SR column in batting table', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);
    renderWithRouter('123');

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/^SR$/i).length).toBeGreaterThan(0);
    });
  });

  test('shows Econ column in bowling table', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);
    renderWithRouter('123');

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/^Econ$/i).length).toBeGreaterThan(0);
    });
  });

  test('shows extras as inline row in batting table', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);
    renderWithRouter('123');

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

    await waitFor(() => {
      expect(screen.getByText(/Extras/i)).toBeInTheDocument();
    });
    // Extras breakdown shown inline
    expect(screen.getByText(/b 4, lb 2, w 6, nb 4/i)).toBeInTheDocument();
  });

  test('shows Total row in batting table', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);
    renderWithRouter('123');

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

    await waitFor(() => {
      expect(screen.getByText(/^Total$/i)).toBeInTheDocument();
    });
  });

  test('shows innings score in hero header for completed match', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);
    renderWithRouter('123');

    await waitFor(() => {
      // Our score: 198/7 should appear prominently in hero header
      expect(screen.getAllByText('198/7').length).toBeGreaterThan(0);
      // Their score: 150/10 should appear prominently in hero header
      expect(screen.getAllByText('150/10').length).toBeGreaterThan(0);
    });
  });

  test('shows tab buttons when both innings have batting entries', async () => {
    const bothInningsData = {
      ...mockCompletedScorecardData,
      finalScorecard: {
        ...mockCompletedScorecardData.finalScorecard,
        theirInnings: {
          ...mockCompletedScorecardData.finalScorecard.theirInnings,
          batting: {
            entries: [
              { playerName: 'TheirBatter', runs: 30, fours: 3, sixes: 0, ballsFaced: 25 },
            ],
            extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0, total: 0 },
            score: 150,
            wickets: 10,
          },
        },
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(bothInningsData);
    renderWithRouter('123');

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /The Village CC Innings/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Dulwich Lawnmower Innings/i })).toBeInTheDocument();
    });
  });

  test('switches innings content when tab is clicked', async () => {
    const bothInningsData = {
      ...mockCompletedScorecardData,
      finalScorecard: {
        ...mockCompletedScorecardData.finalScorecard,
        theirInnings: {
          ...mockCompletedScorecardData.finalScorecard.theirInnings,
          batting: {
            entries: [
              { playerName: 'TheirBatter', runs: 30, fours: 3, sixes: 0, ballsFaced: 25 },
            ],
            extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0, total: 0 },
            score: 150,
            wickets: 10,
          },
        },
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(bothInningsData);
    renderWithRouter('123');

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

    await waitFor(() => {
      expect(screen.getByText('Bowman')).toBeInTheDocument();
    });

    // Switch to their innings
    const theirTab = screen.getByRole('button', { name: /Dulwich Lawnmower Innings/i });
    fireEvent.click(theirTab);

    await waitFor(() => {
      expect(screen.getByText('TheirBatter')).toBeInTheDocument();
    });
    // Our innings player should no longer be visible
    expect(screen.queryByText('Bowman')).not.toBeInTheDocument();
  });

  test('shows fall of wickets when fow data present', async () => {
    const withFowData = {
      ...mockCompletedScorecardData,
      finalScorecard: {
        ...mockCompletedScorecardData.finalScorecard,
        ourInnings: {
          ...mockCompletedScorecardData.finalScorecard.ourInnings,
          fow: {
            entries: [
              { score: 45, wicket: 1, overs: 8.3, outgoingPlayer: { id: 1, name: 'Bowman', battingAt: 1, score: 45 } },
              { score: 90, wicket: 2, overs: 15.0, outgoingPlayer: { id: 2, name: 'Smith', battingAt: 2, score: 30 } },
            ],
          },
        },
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withFowData);
    renderWithRouter('123');

    // Expand the Scorecards section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

    await waitFor(() => {
      expect(screen.getByText(/Fall of Wickets/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/45-1/)).toBeInTheDocument();
    expect(screen.getByText(/90-2/)).toBeInTheDocument();
  });

  test('shows current batsmen when live match has onStrikeBatsman', async () => {
    const liveWithBatsmen = {
      ...mockLiveScorecardData,
      inPlayData: {
        ...mockLiveScorecardData.inPlayData,
        onStrikeBatsman: { name: 'OnStrikeBatter', score: 34, balls: 28, fours: 4, sixes: 1, strikeRate: 121.4 },
        otherBatsman: { name: 'OtherBatter', score: 12, balls: 18, fours: 1, sixes: 0, strikeRate: 66.7 },
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(liveWithBatsmen);
    renderWithRouter('123');

    // At the Crease section is now always visible (not behind a collapsible button)
    await waitFor(() => {
      expect(screen.getByText('OnStrikeBatter')).toBeInTheDocument();
      expect(screen.getByText('OtherBatter')).toBeInTheDocument();
    });
    expect(screen.getByText(/At the Crease/i)).toBeInTheDocument();
  });

  test('shows current bowlers when live match has bowlerOneDetails', async () => {
    const liveWithBowlers = {
      ...mockLiveScorecardData,
      inPlayData: {
        ...mockLiveScorecardData.inPlayData,
        bowlerOneDetails: {
          name: 'FastBowler',
          details: { overs: 5, maidens: 1, runs: 22, wickets: 2, economy: 4.4 },
        },
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(liveWithBowlers);
    renderWithRouter('123');

    // Bowling details are now directly visible in the At the Crease section
    await waitFor(() => {
      expect(screen.getByText('FastBowler')).toBeInTheDocument();
    });
  });

  test('shows match meta (venue, date, match type) in compact header line', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByText(/Friendly/i)).toBeInTheDocument();
      expect(screen.getByText(/Lyndhurst Park/i)).toBeInTheDocument();
    });
  });

  test('shows VCC Commentary tab when completedOvers data is present', async () => {
    const withCommentary = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          { over: {}, scoreAtEndOfOver: 8, wicketsAtEndOfOver: 0, scoreForThisOver: 8 },
          { over: {}, scoreAtEndOfOver: 15, wicketsAtEndOfOver: 1, scoreForThisOver: 7 },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withCommentary);
    renderWithRouter('123');

    // Expand the commentary section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /VCC Commentary/i })).toBeInTheDocument();
    });

    // Shows per-over summary
    await waitFor(() => {
      expect(screen.getByText(/^Over 2$/)).toBeInTheDocument();
      expect(screen.getByText(/^Over 1$/)).toBeInTheDocument();
    });
  });

  test('shows Oppo Commentary tab when theirCompletedOvers data is present', async () => {
    const withOppoCommentary = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        theirCompletedOvers: [
          { over: 1, score: 10, wickets: 0, commentary: 'Solid start for the opposition.' },
          { over: 2, score: 18, wickets: 1, commentary: 'Wicket falls in the second over.' },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withOppoCommentary);
    renderWithRouter('123');

    // Expand the commentary section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Oppo Commentary/i })).toBeInTheDocument();
    });

    // Click Oppo Commentary tab
    fireEvent.click(screen.getByRole('button', { name: /Oppo Commentary/i }));

    await waitFor(() => {
      expect(screen.getByText(/Solid start for the opposition/i)).toBeInTheDocument();
      expect(screen.getByText(/Wicket falls in the second over/i)).toBeInTheDocument();
    });
  });

  test('shows innings commentary text when ourInningsCommentary is provided', async () => {
    const withInningsCommentary = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          { over: {}, scoreAtEndOfOver: 12, wicketsAtEndOfOver: 0, scoreForThisOver: 12 },
        ],
        ourInningsCommentary: 'A fine innings total from The Village CC.',
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withInningsCommentary);
    renderWithRouter('123');

    // Expand the commentary section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      expect(screen.getByText(/A fine innings total from The Village CC/i)).toBeInTheDocument();
    });
  });

  test('shows ball-by-ball commentary when over has balls data', async () => {
    const withBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 9,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 9,
            over: {
              overNumber: 1,
              bowler: 'A. Bowler',
              runsConceded: 9,
              wicketsTaken: 0,
              balls: [
                { ballNumber: 1, amount: 0, thing: '', bowler: 'A. Bowler', batsmanName: 'B. Batsman' },
                { ballNumber: 2, amount: 4, thing: '', bowler: 'A. Bowler', batsmanName: 'B. Batsman' },
                { ballNumber: 3, amount: 1, thing: 'wd', bowler: 'A. Bowler', batsmanName: 'B. Batsman' },
                { ballNumber: 4, amount: 6, thing: '', bowler: 'A. Bowler', batsmanName: 'C. Batsman' },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withBalls);
    renderWithRouter('123');

    // Expand the commentary section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      // Shows bowler name in over header
      expect(screen.getAllByText(/A\. Bowler/).length).toBeGreaterThan(0);
      // Shows ball entries with bowler-to-batsman format
      expect(screen.getByText(/A\. Bowler to B\. Batsman, no run/)).toBeInTheDocument();
      expect(screen.getByText(/A\. Bowler to B\. Batsman, FOUR/)).toBeInTheDocument();
      expect(screen.getByText(/A\. Bowler to B\. Batsman, 1 wide/)).toBeInTheDocument();
      expect(screen.getByText(/A\. Bowler to C\. Batsman, SIX!/)).toBeInTheDocument();
    });
  });

  test('shows location in ball description when angle is recorded', async () => {
    // Math.PI * 1.4 falls in the Point zone (Math.PI * 1.25 <= angle < Math.PI * 1.5)
    const pointAngle = Math.PI * 1.4;
    // Math.PI * 1.65 falls in the Cover zone (Math.PI * 1.5 <= angle < Math.PI * 1.75)
    const coverAngle = Math.PI * 1.65;
    // Math.PI * 0.1 falls in the Mid-on zone (angle < Math.PI * 0.25)
    const midOnAngle = Math.PI * 0.1;

    const withBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 10,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 10,
            over: {
              overNumber: 1,
              bowler: 'A. Bowler',
              runsConceded: 10,
              wicketsTaken: 0,
              balls: [
                { ballNumber: 1, amount: 1, thing: '', bowler: 'A. Bowler', batsmanName: 'B. Batsman', angle: pointAngle },
                { ballNumber: 2, amount: 2, thing: '', bowler: 'A. Bowler', batsmanName: 'B. Batsman', angle: pointAngle },
                { ballNumber: 3, amount: 4, thing: '', bowler: 'A. Bowler', batsmanName: 'B. Batsman', angle: coverAngle },
                { ballNumber: 4, amount: 6, thing: '', bowler: 'A. Bowler', batsmanName: 'C. Batsman', angle: midOnAngle },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withBalls);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      expect(screen.getByText(/A\. Bowler to B\. Batsman, single to Point/)).toBeInTheDocument();
      expect(screen.getByText(/A\. Bowler to B\. Batsman, 2 runs to Point/)).toBeInTheDocument();
      expect(screen.getByText(/A\. Bowler to B\. Batsman, FOUR through Cover/)).toBeInTheDocument();
      expect(screen.getByText(/A\. Bowler to C\. Batsman, SIX! over Mid-on/)).toBeInTheDocument();
    });
  });

  test('shows ball-by-ball commentary with over number from OverV1 overNumber field', async () => {
    const withBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 5,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 5,
            over: {
              overNumber: 3,
              bowler: 'X. Bowler',
              balls: [
                { ballNumber: 1, amount: 1, thing: '', bowler: 'X. Bowler', batsmanName: 'Y. Batsman' },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withBalls);
    renderWithRouter('123');

    // Expand the commentary section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      expect(screen.getByText(/^Over 3$/)).toBeInTheDocument();
      expect(screen.getByText(/3\.1/)).toBeInTheDocument();
    });
  });

  test('shows coloured ball blobs when over has balls data', async () => {
    const withBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 12,
            wicketsAtEndOfOver: 1,
            scoreForThisOver: 12,
            over: {
              overNumber: 2,
              bowler: 'P. Bowler',
              balls: [
                { ballNumber: 1, amount: 0, thing: '', bowler: 'P. Bowler', batsmanName: 'Q. Batsman' },
                { ballNumber: 2, amount: 4, thing: '', bowler: 'P. Bowler', batsmanName: 'Q. Batsman' },
                { ballNumber: 3, amount: 6, thing: '', bowler: 'P. Bowler', batsmanName: 'Q. Batsman' },
                { ballNumber: 4, amount: 1, thing: 'wd', bowler: 'P. Bowler', batsmanName: 'Q. Batsman' },
                { ballNumber: 5, amount: 1, thing: 'nb', bowler: 'P. Bowler', batsmanName: 'Q. Batsman' },
                { ballNumber: 6, amount: 0, thing: '', bowler: 'P. Bowler', batsmanName: 'Q. Batsman', wicket: { description: 'caught' } },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withBalls);
    renderWithRouter('123');

    // Expand the commentary section first
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      const blobContainer = screen.getByLabelText(/Over 2 deliveries/i);
      const blobs = blobContainer.querySelectorAll('[data-testid="ball-blob"]');
      // dot ball → '·'
      expect(blobs[0].textContent).toBe('·');
      // four → '4'
      expect(blobs[1].textContent).toBe('4');
      // six → '6'
      expect(blobs[2].textContent).toBe('6');
      // wide → 'Wd'
      expect(blobs[3].textContent).toBe('Wd');
      // no ball → 'Nb'
      expect(blobs[4].textContent).toBe('Nb');
      // wicket → 'W'
      expect(blobs[5].textContent).toBe('W');
    });
  });

  test('shows Worm chart tab when completedOvers data is present', async () => {
    const withChartData = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          { over: {}, scoreAtEndOfOver: 8, wicketsAtEndOfOver: 0, scoreForThisOver: 8 },
          { over: {}, scoreAtEndOfOver: 15, wicketsAtEndOfOver: 1, scoreForThisOver: 7 },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withChartData);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Team Analysis$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Team Analysis$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Worm$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Manhattan$/i })).toBeInTheDocument();
    });
  });

  test('shows Partnerships chart tab when partnerships data is present', async () => {
    const withPartnerships = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        partnerships: [
          { player1Name: 'Smith', player2Name: 'Jones', score: 45, ballCount: 48 },
          { player1Name: 'Brown', player2Name: 'Davis', score: 30, ballCount: 35 },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withPartnerships);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Team Analysis$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Team Analysis$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Partnerships$/i })).toBeInTheDocument();
    });
  });

  test('shows over-level commentary in over header when commentary field is present', async () => {
    const withOverCommentary = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 12,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 12,
            over: {
              overNumber: 5,
              bowler: 'T. Bowler',
              runsConceded: 12,
              wicketsTaken: 0,
              commentary: 'A productive over with two boundaries.',
              balls: [
                { ballNumber: 1, amount: 4, thing: '', bowler: 'T. Bowler', batsmanName: 'A. Batter' },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withOverCommentary);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      expect(screen.getByText(/A productive over with two boundaries/i)).toBeInTheDocument();
    });
  });

  test('shows wicket details under ball line when ball has wicket data', async () => {
    const withWicketBall = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 45,
            wicketsAtEndOfOver: 1,
            scoreForThisOver: 5,
            over: {
              overNumber: 8,
              bowler: 'J. Bowler',
              runsConceded: 5,
              wicketsTaken: 1,
              balls: [
                { ballNumber: 1, amount: 1, thing: '', bowler: 'J. Bowler', batsmanName: 'S. Batter' },
                {
                  ballNumber: 2,
                  amount: 0,
                  thing: '',
                  bowler: 'J. Bowler',
                  batsmanName: 'G. Pontin',
                  wicket: {
                    playerName: 'GC Pontin',
                    bowler: 'Jeff',
                    fielder: 'Steve',
                    isCaught: true,
                    description: 'Excellent delivery that got the edge.',
                  },
                },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withWicketBall);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      // Wicket ball line shows bowler to batsman context
      expect(screen.getByText(/J\. Bowler to G\. Pontin,/i)).toBeInTheDocument();
      // Only "OUT!" is shown in red (as a separate element)
      expect(screen.getByText('OUT!')).toBeInTheDocument();
      // Wicket details sub-row: player name + dismissal
      expect(screen.getByText(/GC Pontin ct\. Steve b\. Jeff/i)).toBeInTheDocument();
      // Wicket commentary
      expect(screen.getByText(/Excellent delivery that got the edge/i)).toBeInTheDocument();
    });
  });

  test('shows wicket details without description when description is absent', async () => {
    const withWicketNoDesc = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 30,
            wicketsAtEndOfOver: 1,
            scoreForThisOver: 3,
            over: {
              overNumber: 6,
              bowler: 'K. Bowler',
              runsConceded: 3,
              wicketsTaken: 1,
              balls: [
                {
                  ballNumber: 3,
                  amount: 0,
                  thing: '',
                  bowler: 'K. Bowler',
                  batsmanName: 'H. Batter',
                  wicket: {
                    playerName: 'H. Batter',
                    bowler: 'K. Bowler',
                    isBowled: true,
                    description: null,
                  },
                },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withWicketNoDesc);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      // Wicket details sub-row: player name + dismissal without description
      expect(screen.getByText(/H\. Batter b\. K\. Bowler/i)).toBeInTheDocument();
    });
  });

  test('shows batting stats in wicket sub-row when fallOfWickets data is available', async () => {
    const withWicketAndStats = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        fallOfWickets: [
          {
            outGoingPlayerId: 5,
            outGoingPlayerScore: 20,
            outgoingBatsmanInningsDetails: {
              balls: 21,
              fours: 4,
              sixes: 0,
              strikeRate: 95.24,
            },
          },
        ],
        completedOvers: [
          {
            scoreAtEndOfOver: 45,
            wicketsAtEndOfOver: 1,
            scoreForThisOver: 5,
            over: {
              overNumber: 8,
              bowler: 'T. Bull',
              runsConceded: 5,
              wicketsTaken: 1,
              balls: [
                {
                  ballNumber: 2,
                  amount: 0,
                  thing: '',
                  bowler: 'T. Bull',
                  batsmanName: 'P. Misra',
                  wicket: {
                    player: 5,
                    playerName: 'P. Misra',
                    bowler: 'T. Bull',
                    fielder: 'Fielder',
                    isCaught: true,
                    description: null,
                  },
                },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withWicketAndStats);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Over-by-over Commentary/i }));

    await waitFor(() => {
      // Wicket sub-row should include player name, dismissal type, and batting stats
      expect(screen.getByText(/P\. Misra ct\. Fielder b\. T\. Bull 20 \(21b 4x4 0x6\) SR: 95\.24/i)).toBeInTheDocument();
    });
  });

  test('shows Wagon Wheel tab when completedOvers have balls with angle data', async () => {
    const withAngleBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 10,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 10,
            over: {
              overNumber: 1,
              balls: [
                { ballNumber: 1, amount: 4, thing: '', angle: 1.0 },
                { ballNumber: 2, amount: 0, thing: '', angle: null },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withAngleBalls);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Team Analysis$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Team Analysis$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Wagon Wheel$/i })).toBeInTheDocument();
    });
  });

  test('does not show Wagon Wheel tab when no balls have angle data', async () => {
    const withNoAngleBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 8,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 8,
            over: {
              overNumber: 1,
              balls: [
                { ballNumber: 1, amount: 4, thing: '', angle: null },
                { ballNumber: 2, amount: 4, thing: '', angle: null },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withNoAngleBalls);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Team Analysis$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Team Analysis$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Worm$/i })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /^Wagon Wheel$/i })).not.toBeInTheDocument();
  });

  test('renders wagon wheel SVG with ball lines when wagon wheel tab is active', async () => {
    const withAngleBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 10,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 10,
            over: {
              overNumber: 1,
              balls: [
                { ballNumber: 1, amount: 4, thing: '', angle: Math.PI / 2 },
                { ballNumber: 2, amount: 6, thing: '', angle: Math.PI },
                { ballNumber: 3, amount: 0, thing: '', angle: 1.0 }, // dot ball - no line
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withAngleBalls);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Team Analysis$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Team Analysis$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Wagon Wheel$/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /^Wagon Wheel$/i }));

    await waitFor(() => {
      const svg = document.querySelector('[data-testid="wagon-wheel"]');
      expect(svg).toBeInTheDocument();
      // Two scoring balls → two ball <line> elements (dot ball is skipped)
      // Key has 3 lines; total lines = 2 (balls) + 3 (key) = 5
      const lines = svg!.querySelectorAll('line');
      expect(lines.length).toBe(5);
    });
  });

  test('opposition Manhattan runs are distributed linearly across missing overs', async () => {
    // Only over 5 has score=10 - the Manhattan tab should appear and render
    const withSpottyOppo = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          { over: {}, scoreAtEndOfOver: 8, wicketsAtEndOfOver: 0, scoreForThisOver: 8 },
          { over: {}, scoreAtEndOfOver: 15, wicketsAtEndOfOver: 0, scoreForThisOver: 7 },
          { over: {}, scoreAtEndOfOver: 22, wicketsAtEndOfOver: 0, scoreForThisOver: 7 },
          { over: {}, scoreAtEndOfOver: 28, wicketsAtEndOfOver: 0, scoreForThisOver: 6 },
          { over: {}, scoreAtEndOfOver: 35, wicketsAtEndOfOver: 0, scoreForThisOver: 7 },
        ],
        theirCompletedOvers: [
          // Only data for over 5 (cumulative score 10), overs 1-4 missing
          { over: 5, score: 10, wickets: 0 },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withSpottyOppo);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Team Analysis$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Team Analysis$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Manhattan$/i })).toBeInTheDocument();
    });
  });

  test('shows Player Analysis section when completedOvers have ball-by-ball data with batsman info', async () => {
    const withPlayerBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 12,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 12,
            over: {
              overNumber: 1,
              balls: [
                { ballNumber: 1, amount: 4, thing: '', batsman: 1, batsmanName: 'A. Batter' },
                { ballNumber: 2, amount: 2, thing: '', batsman: 1, batsmanName: 'A. Batter' },
                { ballNumber: 3, amount: 6, thing: '', batsman: 2, batsmanName: 'B. Player' },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withPlayerBalls);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Player Analysis$/i })).toBeInTheDocument();
    });
  });

  test('shows player icon buttons and Player Worm tab when Player Analysis section is expanded', async () => {
    const withPlayerBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 12,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 12,
            over: {
              overNumber: 1,
              balls: [
                { ballNumber: 1, amount: 4, thing: '', batsman: 1, batsmanName: 'Alan Batting' },
                { ballNumber: 2, amount: 2, thing: '', batsman: 2, batsmanName: 'Bob Player' },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withPlayerBalls);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Player Analysis$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Player Analysis$/i }));

    await waitFor(() => {
      // Player icons use the aria-label of the player name
      expect(screen.getByRole('button', { name: /Alan Batting/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Bob Player/i })).toBeInTheDocument();
      // Player Worm tab should be visible
      expect(screen.getByRole('button', { name: /^Player Worm$/i })).toBeInTheDocument();
    });
  });

  test('shows player wagon wheel SVG when Wagon Wheel tab selected in player analysis', async () => {
    const withAnglePlayerBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 10,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 10,
            over: {
              overNumber: 1,
              balls: [
                { ballNumber: 1, amount: 4, thing: '', batsman: 1, batsmanName: 'A. Batter', angle: Math.PI / 2 },
                { ballNumber: 2, amount: 6, thing: '', batsman: 1, batsmanName: 'A. Batter', angle: Math.PI },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withAnglePlayerBalls);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Player Analysis$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Player Analysis$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Wagon Wheel$/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /^Wagon Wheel$/i }));

    await waitFor(() => {
      const svg = document.querySelector('[data-testid="player-wagon-wheel"]');
      expect(svg).toBeInTheDocument();
    });
  });

  test('does not show Player Analysis section when no ball-by-ball data is available', async () => {
    const withNoPlayerBalls = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          { over: {}, scoreAtEndOfOver: 8, wicketsAtEndOfOver: 0, scoreForThisOver: 8 },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(withNoPlayerBalls);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Team Analysis$/i })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /^Player Analysis$/i })).not.toBeInTheDocument();
  });

  test('shows collapsible Scorecards section for completed match', async () => {
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(mockCompletedScorecardData);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
    });

    // Scorecards section is collapsed by default
    expect(screen.queryByText(/Batter/i)).not.toBeInTheDocument();

    // Expand it
    fireEvent.click(screen.getByRole('button', { name: /Scorecards/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/Batter/i).length).toBeGreaterThan(0);
    });
  });

  test('shows collapsible Scorecards section for live match', async () => {
    const liveWithBatsmen = {
      ...mockLiveScorecardData,
      inPlayData: {
        ...mockLiveScorecardData.inPlayData,
        onStrikeBatsman: { name: 'OnStrikeBatter', score: 34, balls: 28, fours: 4, sixes: 1, strikeRate: 121.4 },
      },
    };
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(liveWithBatsmen);
    renderWithRouter('123');

    // At the Crease section is always visible for live matches (not behind a Scorecards collapsible)
    await waitFor(() => {
      expect(screen.getByText(/^At the Crease$/i)).toBeInTheDocument();
      expect(screen.getByText('OnStrikeBatter')).toBeInTheDocument();
    });

    // There is no "Scorecards" collapsible button for live matches
    expect(screen.queryByRole('button', { name: /^Scorecards$/i })).not.toBeInTheDocument();
  });

  test('section order for completed match: Match Report, Scorecards, Commentary, Analysis', async () => {
    const completedWithCommentary = {
      ...mockCompletedScorecardData,
      inPlayData: {
        ...mockCompletedScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 10,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 10,
            over: { overNumber: 1, balls: [] },
          },
        ],
        partnerships: [
          { player1Name: 'Bat1', player1Score: 30, player2Name: 'Bat2', player2Score: 20 },
        ],
      },
    };
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(completedWithCommentary);
    renderWithRouter('123');

    // Match Report is now always visible (heading, not a button)
    await waitFor(() => {
      expect(screen.getByText(/^Match Report$/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Scorecards/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Team Analysis/i })).toBeInTheDocument();
    });

    // Verify order: Match Report (heading) before Scorecards button, Scorecards before Commentary, Commentary before Analysis
    const allElements = screen.getAllByRole('heading').concat(screen.getAllByRole('button'));
    // Match Report is now an h2 heading in the page
    const matchReportHeading = screen.getByText(/^Match Report$/i);
    const scorecardsBtn = screen.getByRole('button', { name: /^Scorecards$/i });
    const commentaryBtn = screen.getByRole('button', { name: /Over-by-over Commentary/i });
    const teamAnalysisBtn = screen.getByRole('button', { name: /Team Analysis/i });

    // Use DOM position comparison (compareDocumentPosition)
    expect(matchReportHeading.compareDocumentPosition(scorecardsBtn) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(scorecardsBtn.compareDocumentPosition(commentaryBtn) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(commentaryBtn.compareDocumentPosition(teamAnalysisBtn) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('section order for live match: At the Crease, Commentary, Analysis (no Match Report)', async () => {
    const liveWithCommentary = {
      ...mockLiveScorecardData,
      inPlayData: {
        ...mockLiveScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 8,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 8,
            over: { overNumber: 1, balls: [] },
          },
        ],
      },
    };
    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(liveWithCommentary);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Over-by-over Commentary/i })).toBeInTheDocument();
    });

    // No Match Report or Scorecards button for live matches
    expect(screen.queryByRole('button', { name: /^Match Report$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Scorecards$/i })).not.toBeInTheDocument();

    // At the Crease section is always visible (has the horizontal overs display)
    expect(screen.getByTestId('horizontal-overs')).toBeInTheDocument();

    // Commentary comes after the At the Crease section
    const atTheCreaseEl = screen.getByTestId('horizontal-overs');
    const commentaryBtn = screen.getByRole('button', { name: /Over-by-over Commentary/i });
    expect(atTheCreaseEl.compareDocumentPosition(commentaryBtn) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('shows horizontal overs display in At the Crease section for live match', async () => {
    const liveWithOvers = {
      ...mockLiveScorecardData,
      inPlayData: {
        ...mockLiveScorecardData.inPlayData,
        completedOvers: [
          {
            scoreAtEndOfOver: 9,
            wicketsAtEndOfOver: 0,
            scoreForThisOver: 9,
            over: {
              overNumber: 1,
              balls: [
                { ballNumber: 1, amount: 0, thing: '' },
                { ballNumber: 2, amount: 4, thing: '' },
                { ballNumber: 3, amount: 1, thing: '' },
                { ballNumber: 4, amount: 0, thing: '', wicket: { description: 'out' } },
                { ballNumber: 5, amount: 1, thing: 'wd' },
                { ballNumber: 6, amount: 6, thing: '' },
              ],
            },
          },
        ],
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(liveWithOvers);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByTestId('horizontal-overs')).toBeInTheDocument();
    });

    const oversContainer = screen.getByTestId('horizontal-overs');
    // Over label should be shown
    expect(oversContainer.textContent).toMatch(/Ovr 1:/);
    // Dot ball, four, wicket, wide, six all represented
    expect(oversContainer.textContent).toMatch(/[·.]/);
    expect(oversContainer.textContent).toMatch(/4/);
    expect(oversContainer.textContent).toMatch(/W/);
    expect(oversContainer.textContent).toMatch(/Wd/);
    expect(oversContainer.textContent).toMatch(/6/);
  });

  test('shows up to last 5 overs in horizontal display', async () => {
    const manyOvers = Array.from({ length: 7 }, (_, i) => ({
      scoreAtEndOfOver: (i + 1) * 8,
      wicketsAtEndOfOver: 0,
      scoreForThisOver: 8,
      over: {
        overNumber: i + 1,
        balls: [
          { ballNumber: 1, amount: 1, thing: '' },
          { ballNumber: 2, amount: 1, thing: '' },
        ],
      },
    }));

    const liveWithManyOvers = {
      ...mockLiveScorecardData,
      inPlayData: {
        ...mockLiveScorecardData.inPlayData,
        completedOvers: manyOvers,
      },
    };

    (getLiveScorecardData as jest.Mock).mockResolvedValueOnce(liveWithManyOvers);
    renderWithRouter('123');

    await waitFor(() => {
      expect(screen.getByTestId('horizontal-overs')).toBeInTheDocument();
    });

    const oversContainer = screen.getByTestId('horizontal-overs');
    // Only overs 3-7 should be shown (last 5 of 7)
    expect(oversContainer.textContent).not.toMatch(/Ovr 1:/);
    expect(oversContainer.textContent).not.toMatch(/Ovr 2:/);
    expect(oversContainer.textContent).toMatch(/Ovr 3:/);
    expect(oversContainer.textContent).toMatch(/Ovr 7:/);
  });
});
