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
    bowling: { entries: [] },
    fow: { entries: [] },
    inningsLength: 35.4,
  },
  theirInnings: {
    batting: { entries: [], extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0, total: 0 }, score: 0, wickets: 0 },
    bowling: { entries: [] },
    fow: { entries: [] },
    inningsLength: 0,
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
});
