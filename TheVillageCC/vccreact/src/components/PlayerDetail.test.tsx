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

const mockBattingChartData = {
  type: 'line',
  data: {
    labels: ['Match 1', 'Match 2', 'Match 3'],
    datasets: [
      {
        label: 'Runs',
        data: [50, 30, 75],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      },
      {
        label: 'Average',
        data: [50, 40, 51.67],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Batting Timeline'
      },
      legend: {
        display: false
      }
    }
  }
};

const mockBowlingChartData = {
  type: 'bar',
  data: {
    labels: ['2020', '2021', '2022'],
    datasets: [
      {
        label: 'Wickets',
        data: [5, 8, 12],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Wickets by Season'
      },
      legend: {
        display: false
      }
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

  test('chart data includes color properties', async () => {
    // Mock all the API calls
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayerDetailData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBattingChartData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBowlingChartData,
      });

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0);
    });

    // Verify the chart API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stats/chart/1/battingTimeline');
      expect(global.fetch).toHaveBeenCalledWith('/api/stats/chart/1/wicketsBySeason');
    });

    // Verify that our mock chart data has the color properties
    expect(mockBattingChartData.data.datasets[0].backgroundColor).toBeDefined();
    expect(mockBattingChartData.data.datasets[0].borderColor).toBeDefined();
    expect(mockBowlingChartData.data.datasets[0].backgroundColor).toBeDefined();
    expect(mockBowlingChartData.data.datasets[0].borderColor).toBeDefined();
  });
});
