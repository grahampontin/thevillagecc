import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Homepage from './Homepage';

// Mock fetch globally
global.fetch = jest.fn();

describe('Homepage', () => {
  beforeEach(() => {
    // Reset mock before each test
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders homepage with loading state initially', () => {
    // Mock fetch to never resolve (simulating loading)
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<Homepage />);
    
    expect(screen.getAllByLabelText(/loading recent result/i).length).toBeGreaterThan(0);
  });

  test('fetches and displays match reports from API', async () => {
    const mockMatchReports = [
      {
        matchId: 1,
        homeTeamName: 'The Village CC',
        homeTeamScore: '200/5',
        awayTeamName: 'Opponents CC',
        awayTeamScore: '150/10',
        resultText: 'The Village CC won',
        resultMargin: 'by 50 runs',
        matchDate: '2024-01-15',
        matchReportConditions: 'Sunny day',
        matchReportText: 'Great match with excellent batting performance from the team.',
        matchReportImage: '/match_reports/images/test.jpg',
        isWinner: true,
        isTied: false,
        isDrawn: false,
        isAbandoned: false,
        venueName: null,
        winningTeam: null,
        losingTeam: null,
        margin: null,
        theirOversFaced: 0,
        theirWickets: 0,
        theirScore: 0,
        ourOversFaced: 0,
        ourWickets: 0,
        ourScore: 0
      },
      {
        matchId: 2,
        homeTeamName: 'Team A',
        homeTeamScore: '180/8',
        awayTeamName: 'The Village CC',
        awayTeamScore: '170/9',
        resultText: 'Team A won',
        resultMargin: 'by 10 runs',
        matchDate: '2024-01-10',
        matchReportConditions: 'Cloudy',
        matchReportText: 'Close match with thrilling finish.',
        matchReportImage: '',
        isWinner: false,
        isTied: false,
        isDrawn: false,
        isAbandoned: false,
        venueName: null,
        winningTeam: null,
        losingTeam: null,
        margin: null,
        theirOversFaced: 0,
        theirWickets: 0,
        theirScore: 0,
        ourOversFaced: 0,
        ourWickets: 0,
        ourScore: 0
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMatchReports,
    });

    render(<Homepage />);

    // Wait for the match reports to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText(/The Village CC vs Opponents CC/i)).toBeInTheDocument();
    });

    // Verify the API was called with correct parameters (now using /api/Results/recent)
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/Results/recent?count=3'), expect.objectContaining({
      headers: expect.objectContaining({
        'Accept': 'application/json'
      })
    }));
    
    // Check that result text is displayed
    expect(screen.getByText(/The Village CC won - by 50 runs/i)).toBeInTheDocument();
    expect(screen.getByText(/Team A won - by 10 runs/i)).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Server error',
    });

    render(<Homepage />);

    // Wait for error message to appear (now includes statusText from http helper)
    await waitFor(() => {
      expect(screen.getByText(/HTTP 500 Internal Server Error/i)).toBeInTheDocument();
    });
  });

  test('displays message when no match reports are available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Homepage />);

    // Wait for the empty state message
    await waitFor(() => {
      expect(screen.getByText(/No match reports available at this time/i)).toBeInTheDocument();
    });
  });

  test('handles fetch exception gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<Homepage />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  test('renders homepage header and carousel', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Homepage />);

    // Check that main homepage elements are present
    expect(screen.getByText(/Friendly Cricket in and around London/i)).toBeInTheDocument();
  });
});
