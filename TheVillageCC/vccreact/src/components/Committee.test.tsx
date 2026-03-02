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
      .mockResolvedValueOnce({ ok: true, json: async () => mockCommittee });

    renderWithRouter(<Committee />);

    expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
    expect(await screen.findByText('Bob Jones')).toBeInTheDocument();
  });

  test('humanizes post titles', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayers })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCommittee });

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
      .mockResolvedValueOnce({ ok: true, json: async () => committee });

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
      .mockResolvedValueOnce({ ok: true, json: async () => mockCommittee });

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
      .mockResolvedValueOnce({ ok: true, json: async () => multiYearCommittee });

    renderWithRouter(<Committee />);

    // 2024 captain (Bob Jones) should appear, not 2023 captain (Alice Smith)
    expect(await screen.findByText('Bob Jones')).toBeInTheDocument();
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });
});
