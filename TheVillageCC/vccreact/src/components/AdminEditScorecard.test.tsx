import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminEditScorecard from './AdminEditScorecard';

global.fetch = jest.fn();

const renderWithMatchId = (matchId: string) =>
  render(
    <MemoryRouter initialEntries={[`/admin/scorecards/${matchId}`]}>
      <Routes>
        <Route path="/admin/scorecards/:matchId" element={<AdminEditScorecard />} />
      </Routes>
    </MemoryRouter>
  );

const mockMatch = {
  id: 1,
  opposition: { id: 10, name: 'Barton CC' },
  date: '2024-05-11T00:00:00',
  venue: { id: 1, name: 'The Village Ground' },
  type: 'Friendly',
};

const mockPlayers = [
  { playerId: 1, firstName: 'Alice', surname: 'Smith', shortName: 'A Smith', name: 'Alice Smith' },
  { playerId: 2, firstName: 'Bob', surname: 'Jones', shortName: 'B Jones', name: 'Bob Jones' },
];

const mockScorecard = {
  matchConditions: {
    abandoned: false,
    captainId: 1,
    wicketKeeperId: 2,
    overs: 40,
    declaration: false,
    weWonTheToss: true,
    tossWinnerBatted: true,
  },
  ourInnings: {
    batting: {
      entries: [
        { playerId: 1, playerName: 'Alice Smith', runs: 45, ballsFaced: 60, fours: 5, sixes: 1, modeOfDismissal: 'Caught', bowlerName: 'J Doe', fielderName: 'T Brown', battingAt: 1 },
      ],
      extras: { wides: 3, noBalls: 1, byes: 2, legByes: 4, penalties: 0, total: 10 },
      score: 120,
      wickets: 5,
    },
    bowling: {
      entries: [
        { playerId: 0, playerName: 'Opp Bowler', overs: 10, maidens: 2, runs: 45, wickets: 3 },
      ],
    },
    fow: {
      entries: [
        { wicket: 1, score: 55, overs: 15.2, partnership: 55, outgoingPlayer: { id: 1, name: 'Alice Smith', battingAt: 1, score: 45 }, notOutPlayer: { id: 0, name: 'Bob Jones', battingAt: 2, score: 10 } },
      ],
    },
    inningsLength: 35.4,
  },
  theirInnings: {
    batting: {
      entries: [
        { playerId: 0, playerName: 'Opp Batsman', runs: 30, ballsFaced: 40, fours: 3, sixes: 0, modeOfDismissal: 'Bowled', bowlerId: 1, bowlerName: 'Alice Smith', fielderId: 0, fielderName: '', battingAt: 1 },
      ],
      extras: { wides: 2, noBalls: 0, byes: 1, legByes: 0, penalties: 0, total: 3 },
      score: 95,
      wickets: 3,
    },
    bowling: {
      entries: [
        { playerId: 1, playerName: 'Alice Smith', overs: 8, maidens: 1, runs: 30, wickets: 2 },
      ],
    },
    fow: { entries: [] },
    inningsLength: 28.0,
  },
};

describe('AdminEditScorecard', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  const setupMocks = () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockMatch })      // getMatchById
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayers })    // getAllPlayers
      .mockResolvedValueOnce({ ok: true, json: async () => mockScorecard })  // getScorecardByMatchId
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });          // getMatchReport
  };

  test('renders loading skeleton initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithMatchId('1');
    const skeletons = screen.getAllByRole('generic').filter(el =>
      el.className.includes('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('displays match title and tabs after loading', async () => {
    setupMocks();
    renderWithMatchId('1');

    await waitFor(() => {
      expect(screen.getByText(/Barton CC/)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Conditions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Village CC/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Opposition/i })).toBeInTheDocument();
  });

  test('conditions tab shows match conditions', async () => {
    setupMocks();
    renderWithMatchId('1');

    await waitFor(() => screen.getByText(/Barton CC/));

    // Conditions tab is active by default
    expect(screen.getByLabelText('Abandoned')).not.toBeChecked();
    expect(screen.getByLabelText('Overs')).toHaveValue(40);
  });

  test('Village CC batting tab shows batting entries', async () => {
    setupMocks();
    renderWithMatchId('1');

    await waitFor(() => screen.getByText(/Barton CC/));

    // Switch to Village CC tab
    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));

    expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText(/ct T Brown b J Doe/)).toBeInTheDocument();
  });

  test('save button calls POST to scorecard endpoint', async () => {
    setupMocks();
    // Mock the save call
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockScorecard });

    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    const saveBtn = screen.getByRole('button', { name: /Save scorecard/i });
    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Scorecards/1'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    expect(await screen.findByText('Scorecard saved successfully.')).toBeInTheDocument();
  });

  test('shows error message when save fails', async () => {
    setupMocks();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Server error',
    });

    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    const saveBtn = screen.getByRole('button', { name: /Save scorecard/i });
    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });

  test('conditions tab shows toss fields with correct labels', async () => {
    setupMocks();
    renderWithMatchId('1');

    await waitFor(() => screen.getByText(/Barton CC/));

    expect(screen.getByLabelText('Toss Winner')).toBeInTheDocument();
    expect(screen.getByLabelText('Decided To')).toBeInTheDocument();
  });

  test('match report modal opens and saves', async () => {
    setupMocks();
    // Mock the save match report call
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 204, json: async () => undefined });

    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    // Open match report modal
    await userEvent.click(screen.getByRole('button', { name: /match report/i }));

    expect(await screen.findByRole('dialog', { name: /Match Report/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Conditions')).toBeInTheDocument();
    expect(screen.getByLabelText('Report')).toBeInTheDocument();

    // Fill in conditions
    await userEvent.type(screen.getByLabelText('Conditions'), 'Sunny day');

    // Save
    await userEvent.click(screen.getByRole('button', { name: /^Save$/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/matchreports/1'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  test('opposition tab shows their batting entries', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Opposition/i }));

    expect(await screen.findByText('Opp Batsman')).toBeInTheDocument();
    expect(screen.getByText(/b Alice Smith/)).toBeInTheDocument();
  });

  test('Village CC bowling sub-tab shows their innings bowling entries', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));
    await userEvent.click(screen.getByRole('button', { name: /Bowling/i }));

    expect(await screen.findByText('Opp Bowler')).toBeInTheDocument();
  });

  test('opposition bowling sub-tab shows VCC bowling entries', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Opposition/i }));
    await userEvent.click(screen.getByRole('button', { name: /Bowling/i }));

    expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
  });

  test('FoW sub-tab shows fall of wicket entries', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));
    await userEvent.click(screen.getByRole('button', { name: /P'ships & FoW/i }));

    expect(await screen.findByText(/Alice Smith/)).toBeInTheDocument();
  });

  test('add batsman opens edit modal with empty form', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));
    await userEvent.click(screen.getByRole('button', { name: /Add batsman/i }));

    expect(await screen.findByRole('dialog', { name: /Edit VCC Batsman/i })).toBeInTheDocument();
  });

  test('edit batsman opens modal with existing entry data', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));
    const editBtns = screen.getAllByRole('button', { name: /Edit batsman/i });
    await userEvent.click(editBtns[0]);

    expect(await screen.findByRole('dialog', { name: /Edit VCC Batsman/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Runs')).toHaveValue(45);
  });

  test('delete batsman removes entry from list', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();

    const deleteBtns = screen.getAllByRole('button', { name: /Delete batsman/i });
    await userEvent.click(deleteBtns[0]);

    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });

  test('add bowler opens edit modal', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Opposition/i }));
    await userEvent.click(screen.getByRole('button', { name: /Bowling/i }));
    await userEvent.click(screen.getByRole('button', { name: /Add bowler/i }));

    expect(await screen.findByRole('dialog', { name: /Edit VCC Bowler/i })).toBeInTheDocument();
  });

  test('edit extras opens extras modal', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));
    await userEvent.click(screen.getByRole('button', { name: /Edit extras/i }));

    expect(await screen.findByRole('dialog', { name: /Edit Extras/i })).toBeInTheDocument();
  });

  test('edit overs opens overs modal', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));
    await userEvent.click(screen.getByRole('button', { name: /Edit overs/i }));

    expect(await screen.findByRole('dialog', { name: /Edit Innings Overs/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Overs Played')).toHaveValue(35.4);
  });

  test('add FoW entry opens FoW modal', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    await userEvent.click(screen.getByRole('button', { name: /Village CC/i }));
    await userEvent.click(screen.getByRole('button', { name: /P'ships & FoW/i }));
    await userEvent.click(screen.getByRole('button', { name: /Add FoW entry/i }));

    expect(await screen.findByRole('dialog', { name: /Edit FoW/i })).toBeInTheDocument();
  });

  test('conditions tab shows captain and wicket keeper selectors', async () => {
    setupMocks();
    renderWithMatchId('1');
    await waitFor(() => screen.getByText(/Barton CC/));

    expect(screen.getByText('Captain')).toBeInTheDocument();
    expect(screen.getByText('Wicket Keeper')).toBeInTheDocument();
  });
});
