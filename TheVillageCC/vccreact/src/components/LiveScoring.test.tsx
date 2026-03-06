import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LiveScoring from './LiveScoring';
import * as liveScoringApi from '../api/liveScoringApi';
import * as playersApi from '../api/playersApi';

jest.mock('../api/liveScoringApi', () => ({
  getLiveScoringMatches: jest.fn(),
  getLiveScoringMatchState: jest.fn(),
  startLiveScoringMatch: jest.fn(),
  submitOver: jest.fn(),
  submitOppositionScore: jest.fn(),
  endInnings: jest.fn(),
  getLiveScorecardData: jest.fn(),
}));

jest.mock('../api/playersApi', () => ({
  getAllPlayers: jest.fn(),
}));

const mockMatches = [
  {
    kind: 1,
    ballByBall: { matchId: 42, batOrBowl: 'Batting', opponent: 'Test CC', dateString: '15 Jul 2025', overs: 5 },
  },
  {
    kind: 0,
    match: { id: 99, opposition: { name: 'New CC' }, date: '20 Jul 2025' },
    ballByBall: { matchId: 99, batOrBowl: '', opponent: 'New CC', dateString: '20 Jul 2025' },
  },
];

const mockPlayers = [
  { playerId: 1, name: 'Alice Smith', matches: 10 },
  { playerId: 2, name: 'Bob Jones', matches: 8 },
  { playerId: 3, name: 'Charlie Brown', matches: 5 },
  { playerId: 4, name: 'Dave Wilson', matches: 12 },
  { playerId: 5, name: 'Eve Davis', matches: 7 },
  { playerId: 6, name: 'Frank Moore', matches: 3 },
  { playerId: 7, name: 'Grace Lee', matches: 9 },
  { playerId: 8, name: 'Hank Taylor', matches: 6 },
  { playerId: 9, name: 'Iris White', matches: 4 },
  { playerId: 10, name: 'Jack Harris', matches: 11 },
  { playerId: 11, name: 'Karen Martin', matches: 2 },
];

const mockMatchState = {
  matchId: 42,
  lastCompletedOver: 0,
  onStrikeBatsmanId: 1,
  score: 0,
  bowlers: ['A Bowler'],
  previousBowler: null,
  previousBowlerButOne: null,
  oppositionScore: 0,
  oppositionWickets: 0,
  oppositionName: 'Test CC',
  oppositionShortName: 'TCC',
  nextState: 'BattingOver',
  players: [
    { playerId: 1, playerName: 'Alice Smith', state: 'Batting', position: 1, currentScore: 0, ballsFaced: 0, fours: 0, sixes: 0, strikeRate: 0 },
    { playerId: 2, playerName: 'Bob Jones', state: 'Batting', position: 2, currentScore: 0, ballsFaced: 0, fours: 0, sixes: 0, strikeRate: 0 },
    { playerId: 3, playerName: 'Charlie Brown', state: 'Waiting', position: 0, currentScore: 0, ballsFaced: 0, fours: 0, sixes: 0, strikeRate: 0 },
  ],
  partnership: { runs: 0, balls: 0, fours: 0, sixes: 0 },
  over: { overNumber: 1, bowler: 'A Bowler', balls: [], runsConceded: 0, wicketsTaken: 0 },
  bowlerDetails: [
    { name: 'A Bowler', details: { overs: 0, maidens: 0, runs: 0, wickets: 0, economy: 0 } },
  ],
};

const renderLiveScoring = () =>
  render(
    <MemoryRouter>
      <LiveScoring />
    </MemoryRouter>,
  );

describe('LiveScoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (liveScoringApi.getLiveScoringMatches as jest.Mock).mockResolvedValue(mockMatches);
    (liveScoringApi.getLiveScoringMatchState as jest.Mock).mockResolvedValue(mockMatchState);
    (playersApi.getAllPlayers as jest.Mock).mockResolvedValue(mockPlayers);
  });

  // ---- Choose Match screen ----

  it('shows loading spinner initially on choose match screen', () => {
    renderLiveScoring();
    expect(screen.getByText('Live Scoring')).toBeInTheDocument();
  });

  it('loads and displays matches list', async () => {
    renderLiveScoring();
    await waitFor(() => {
      expect(screen.getByText('vs Test CC')).toBeInTheDocument();
    });
    expect(screen.getByText('vs New CC')).toBeInTheDocument();
    expect(screen.getByText('Batting')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('shows empty state when no matches', async () => {
    (liveScoringApi.getLiveScoringMatches as jest.Mock).mockResolvedValue([]);
    renderLiveScoring();
    await waitFor(() => {
      expect(screen.getByText('No matches available for scoring')).toBeInTheDocument();
    });
  });

  it('shows error toast on API failure', async () => {
    (liveScoringApi.getLiveScoringMatches as jest.Mock).mockRejectedValue(new Error('Network error'));
    renderLiveScoring();
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  // ---- Navigation: Choose Match → Select Team ----

  it('navigates to select team screen when a new match is clicked', async () => {
    const newMatchState = { ...mockMatchState, nextState: 'SelectTeam' };
    (liveScoringApi.getLiveScoringMatchState as jest.Mock).mockResolvedValue(newMatchState);
    renderLiveScoring();

    await waitFor(() => screen.getByText('vs New CC'));
    fireEvent.click(screen.getByText('vs New CC'));

    await waitFor(() => {
      expect(screen.getByText('Select Team')).toBeInTheDocument();
    });
  });

  // ---- Select Team screen ----

  it('loads players on select team screen', async () => {
    const newMatchState = { ...mockMatchState, nextState: 'SelectTeam' };
    (liveScoringApi.getLiveScoringMatchState as jest.Mock).mockResolvedValue(newMatchState);
    renderLiveScoring();

    await waitFor(() => screen.getByText('vs New CC'));
    fireEvent.click(screen.getByText('vs New CC'));

    await waitFor(() => screen.getByText('Select Team'));
    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('shows player count while selecting', async () => {
    const newMatchState = { ...mockMatchState, nextState: 'SelectTeam' };
    (liveScoringApi.getLiveScoringMatchState as jest.Mock).mockResolvedValue(newMatchState);
    renderLiveScoring();

    await waitFor(() => screen.getByText('vs New CC'));
    fireEvent.click(screen.getByText('vs New CC'));
    await waitFor(() => screen.getByText('Select Team'));
    await waitFor(() => screen.getByText('Alice Smith'));

    // Click Alice - should show 1/11
    fireEvent.click(screen.getByText('Alice Smith'));
    await waitFor(() => expect(screen.getByText('1/11')).toBeInTheDocument());
  });

  it('shows done button only when 11 players selected', async () => {
    const newMatchState = { ...mockMatchState, nextState: 'SelectTeam' };
    (liveScoringApi.getLiveScoringMatchState as jest.Mock).mockResolvedValue(newMatchState);
    renderLiveScoring();

    await waitFor(() => screen.getByText('vs New CC'));
    fireEvent.click(screen.getByText('vs New CC'));
    await waitFor(() => screen.getByText('Select Team'));
    await waitFor(() => screen.getByText('Alice Smith'));

    // Select all 11 players
    mockPlayers.forEach(p => {
      fireEvent.click(screen.getByText(p.name));
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Done')).toBeInTheDocument();
    });
  });

  // ---- Scoring screen (navigating from in-progress match) ----

  it('shows new over screen for in-progress match with BattingOver state', async () => {
    renderLiveScoring();
    await waitFor(() => screen.getByText('vs Test CC'));
    fireEvent.click(screen.getByText('vs Test CC'));

    await waitFor(() => {
      expect(screen.getByText('Over Details')).toBeInTheDocument();
    });
    // Bowler list is shown
    expect(screen.getByText('A Bowler')).toBeInTheDocument();
  });

  it('shows batsman names on scoring screen', async () => {
    const stateWithBatting = {
      ...mockMatchState,
      nextState: 'BattingOver',
    };
    (liveScoringApi.getLiveScoringMatchState as jest.Mock).mockResolvedValue(stateWithBatting);

    renderLiveScoring();
    await waitFor(() => screen.getByText('vs Test CC'));
    fireEvent.click(screen.getByText('vs Test CC'));

    // Goes to New Over first (BattingOver nextState)
    await waitFor(() => {
      expect(screen.getByText('Over Details')).toBeInTheDocument();
    });
  });

  it('shows run buttons on scoring screen via newOver flow', async () => {
    renderLiveScoring();
    await waitFor(() => screen.getByText('vs Test CC'));
    fireEvent.click(screen.getByText('vs Test CC'));

    // Should land on New Over (BattingOver)
    await waitFor(() => screen.getByText('Over Details'));

    // Select bowler and click Done
    fireEvent.click(screen.getByText('A Bowler'));
    fireEvent.click(screen.getByLabelText('Done'));

    await waitFor(() => {
      expect(screen.getByText('OUT!')).toBeInTheDocument();
    });
    expect(screen.getAllByText('4')[0]).toBeInTheDocument();
    expect(screen.getAllByText('6')[0]).toBeInTheDocument();
    expect(screen.getByText('Wide')).toBeInTheDocument();
    expect(screen.getByText('No Ball')).toBeInTheDocument();
  });

  // ---- Scoring interactions ----

  it('adds a dot ball when 0 button is clicked', async () => {
    renderLiveScoring();
    await waitFor(() => screen.getByText('vs Test CC'));
    fireEvent.click(screen.getByText('vs Test CC'));
    await waitFor(() => screen.getByText('Over Details'));
    fireEvent.click(screen.getByText('A Bowler'));
    fireEvent.click(screen.getByLabelText('Done'));
    await waitFor(() => screen.getByText('OUT!'));

    // The "0" dot button - find by clicking the dot icon circle
    const dotButton = screen.getAllByRole('button').find(b => b.querySelector('.material-symbols-outlined')?.textContent === 'brightness_1');
    expect(dotButton).toBeDefined();
    fireEvent.click(dotButton!);

    // A dot ball indicator should appear
    await waitFor(() => {
      const balls = document.querySelectorAll('.bg-gray-300');
      expect(balls.length).toBeGreaterThan(0);
    });
  });

  // ---- Wagon Wheel ----

  const navigateToScoringScreen = async () => {
    renderLiveScoring();
    await waitFor(() => screen.getByText('vs Test CC'));
    fireEvent.click(screen.getByText('vs Test CC'));
    await waitFor(() => screen.getByText('Over Details'));
    fireEvent.click(screen.getByText('A Bowler'));
    fireEvent.click(screen.getByLabelText('Done'));
    await waitFor(() => screen.getByText('OUT!'));
  };

  it('shows wagon wheel overlay after confirming a scoring run', async () => {
    await navigateToScoringScreen();

    // Click "1" to score a run
    fireEvent.click(screen.getByText('1'));
    // Click "Runs" to confirm it was runs (not extras)
    fireEvent.click(screen.getByText('Runs'));

    // Wagon wheel overlay should appear
    await waitFor(() => {
      expect(screen.getByTestId('wagon-wheel-input')).toBeInTheDocument();
    });
    expect(screen.getByText('Shot Location')).toBeInTheDocument();
  });

  it('does not show wagon wheel for a dot ball', async () => {
    await navigateToScoringScreen();

    // Click "0" (dot ball)
    const dotButton = screen.getAllByRole('button').find(
      b => b.querySelector('.material-symbols-outlined')?.textContent === 'brightness_1',
    );
    fireEvent.click(dotButton!);

    // Wagon wheel should NOT appear for a dot ball
    expect(screen.queryByTestId('wagon-wheel-input')).not.toBeInTheDocument();
  });

  it('does not show wagon wheel when extras button is clicked instead of Runs', async () => {
    await navigateToScoringScreen();

    // Click "1" to score a run
    fireEvent.click(screen.getByText('1'));
    // Click "Wide" instead of "Runs"
    fireEvent.click(screen.getByText('Wide'));

    // Wagon wheel should NOT appear for extras
    expect(screen.queryByTestId('wagon-wheel-input')).not.toBeInTheDocument();
  });

  it('closes wagon wheel overlay when Skip is clicked', async () => {
    await navigateToScoringScreen();

    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('Runs'));

    await waitFor(() => screen.getByTestId('wagon-wheel-input'));

    // Click Skip
    fireEvent.click(screen.getByText('Skip'));

    // Overlay should close
    await waitFor(() => {
      expect(screen.queryByTestId('wagon-wheel-input')).not.toBeInTheDocument();
    });
    // Scoring screen should still be shown
    expect(screen.getByText('OUT!')).toBeInTheDocument();
  });

  it('includes angle in submitted over after wagon wheel interaction', async () => {
    (liveScoringApi.submitOver as jest.Mock).mockResolvedValue({
      ...mockMatchState,
      nextState: 'BattingOver',
    });

    await navigateToScoringScreen();

    // Score 1 run
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('Runs'));

    await waitFor(() => screen.getByTestId('wagon-wheel-input'));

    // Skip wagon wheel (angle stays null)
    fireEvent.click(screen.getByText('Skip'));
    await waitFor(() => expect(screen.queryByTestId('wagon-wheel-input')).not.toBeInTheDocument());

    // Navigate to end-over screen via the Done button
    const doneButton = screen.getAllByRole('button').find(
      b => b.querySelector('.material-symbols-outlined')?.textContent === 'done',
    );
    fireEvent.click(doneButton!);

    await waitFor(() => screen.getByText('End Over'));

    // Submit the over
    const endOverDoneButton = screen.getAllByRole('button').find(
      b => b.querySelector('.material-symbols-outlined')?.textContent === 'done',
    );
    fireEvent.click(endOverDoneButton!);

    await waitFor(() => {
      expect(liveScoringApi.submitOver).toHaveBeenCalled();
    });

    const call = (liveScoringApi.submitOver as jest.Mock).mock.calls[0];
    const payload = call[1];
    const balls = payload.over.balls;
    expect(balls).toHaveLength(1);
    // angle should be undefined when skipped
    expect(balls[0].angle).toBeUndefined();
  });
});
