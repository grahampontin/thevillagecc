import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PlayerDetail from './PlayerDetail';

// Mock fetch globally
global.fetch = jest.fn();

const mockPlayerDetailData = {
  player: {
    playerId: 1,
    matches: 50,
    name: 'John Doe',
    shortName: 'J. Doe',
    nickname: 'JD',
    battingStyle: 'RHB',
    bowlingStyle: 'RM',
    isActive: true,
    firstName: 'John',
    surname: 'Doe',
    middleInitials: 'A',
    debut: '2010-05-15T00:00:00Z',
    isRightHandBat: true,
    lastMatchDate: '2024-09-15T00:00:00Z',
    playingRole: 'All-rounder'
  },
  playerImage: 'base64ImageString',
  battingStats: {
    statsType: 'Batting',
    gridOptions: {
      columnDefs: [{ field: 'matches', headerName: 'Matches' }],
      rowData: [{ matches: 50 }],
      footerRow: { matches: 50 }
    }
  },
  bowlingStats: {
    statsType: 'Bowling',
    gridOptions: {
      columnDefs: [{ field: 'wickets', headerName: 'Wickets' }],
      rowData: [{ wickets: 20 }],
      footerRow: { wickets: 20 }
    }
  }
};

describe('PlayerDetail', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  const renderWithRouter = (playerId: string) => {
    return render(
      <MemoryRouter initialEntries={[`/player/${playerId}`]}>
        <Routes>
          <Route path="/player/:playerId" element={<PlayerDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter('1');
    
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('fetches and displays player details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayerDetailData,
    });

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/stats/player/1/detail');
  });

  test('displays error message when API call fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText(/Failed to load player details/i)).toBeInTheDocument();
    });
  });

  test('displays player information correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayerDetailData,
    });

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/All-rounder/i)).toBeInTheDocument();
    expect(screen.getByText(/Caps:/i)).toBeInTheDocument();
  });

  test('handles network error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText(/Failed to load player details/i)).toBeInTheDocument();
    });
  });
});
