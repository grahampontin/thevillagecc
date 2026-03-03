import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Committee from './Committee';

// Mock fetch globally
global.fetch = jest.fn();

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockPlayers = [
  { playerId: 1, firstName: 'Alice', surname: 'Smith' },
  { playerId: 2, firstName: 'Bob', surname: 'Jones' },
];

const mockCommittee = [
  { id: 1, year: 2024, post: 'Captain', playerId: 1 },
  { id: 2, year: 2024, post: 'Treasurer', playerId: 2 },
];

const mockPlayerDetail = (imageUrl: string | null) => ({
  player: {},
  playerImageUrl: imageUrl,
  battingStats: {},
  bowlingStats: {},
});

describe('Committee', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders loading skeleton initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderWithRouter(<Committee />);

    const skeletons = screen.getAllByLabelText(/loading committee member/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('fetches and displays committee members', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayers })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCommittee })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail('https://example.com/1.png') })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail('https://example.com/2.png') });

    renderWithRouter(<Committee />);

    expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
    expect(await screen.findByText('Bob Jones')).toBeInTheDocument();
  });

  test('humanizes post titles', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayers })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCommittee })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail(null) })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail(null) });

    renderWithRouter(<Committee />);

    // Captain stays as "Captain"; Treasurer stays as "Treasurer"
    expect(await screen.findByText('Captain')).toBeInTheDocument();
    expect(await screen.findByText('Treasurer')).toBeInTheDocument();
  });

  test('humanizes compound post names like ViceCaptain', async () => {
    const players = [{ playerId: 3, firstName: 'Carol', surname: 'Davis' }];
    const committee = [{ id: 3, year: 2024, post: 'ViceCaptain', playerId: 3 }];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => players })
      .mockResolvedValueOnce({ ok: true, json: async () => committee })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail(null) });

    renderWithRouter(<Committee />);

    expect(await screen.findByText('Vice Captain')).toBeInTheDocument();
  });

  test('shows no committee message when empty', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    renderWithRouter(<Committee />);

    expect(await screen.findByText(/No committee information available/i)).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<Committee />);

    expect(await screen.findByText(/No committee information available/i)).toBeInTheDocument();
  });

  test('displays Documents & Minutes section', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayers })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCommittee })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail(null) })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail(null) });

    renderWithRouter(<Committee />);

    expect(await screen.findByText('Documents & Minutes')).toBeInTheDocument();
    expect(screen.getByText('AGMs')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Constitution')).toBeInTheDocument();
  });

  test('uses most recent year of committee data', async () => {
    const multiYearCommittee = [
      { id: 1, year: 2023, post: 'Captain', playerId: 1 },
      { id: 2, year: 2024, post: 'Captain', playerId: 2 },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayers })
      .mockResolvedValueOnce({ ok: true, json: async () => multiYearCommittee })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail(null) });

    renderWithRouter(<Committee />);

    // 2024 captain (Bob Jones) should appear, not 2023 captain (Alice Smith)
    expect(await screen.findByText('Bob Jones')).toBeInTheDocument();
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });

  test('displays player image when playerImageUrl is provided', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayers })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCommittee })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail('https://example.com/alice.png') })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail('https://example.com/bob.png') });

    renderWithRouter(<Committee />);

    const aliceImg = await screen.findByRole('img', { name: /Alice Smith/i });
    expect(aliceImg).toHaveAttribute('src', 'https://example.com/alice.png');
  });

  test('shows placeholder when playerImageUrl is null', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayers })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCommittee })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail(null) })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetail(null) });

    renderWithRouter(<Committee />);

    await screen.findByText('Alice Smith');
    // No player img elements rendered when image URL is null
    expect(screen.queryByRole('img', { name: /Alice Smith/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /Bob Jones/i })).not.toBeInTheDocument();
  });
});
