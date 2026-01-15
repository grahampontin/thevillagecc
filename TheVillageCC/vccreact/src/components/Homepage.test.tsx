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
    
    expect(screen.getByText(/Loading match reports/i)).toBeInTheDocument();
  });

  test('fetches and displays match reports from API', async () => {
    const mockMatchReports = [
      {
        MatchId: 1,
        HomeTeamName: 'Village CC',
        HomeTeamScore: '200/5',
        AwayTeamName: 'Opponents CC',
        AwayTeamScore: '150/10',
        ResultText: 'Village CC won',
        ResultMargin: 'by 50 runs',
        MatchDate: '2024-01-15',
        Conditions: 'Sunny day',
        Report: 'Great match with excellent batting performance from the team.',
        ReportImage: '/match_reports/images/test.jpg'
      },
      {
        MatchId: 2,
        HomeTeamName: 'Team A',
        HomeTeamScore: '180/8',
        AwayTeamName: 'Team B',
        AwayTeamScore: '170/9',
        ResultText: 'Team A won',
        ResultMargin: 'by 10 runs',
        MatchDate: '2024-01-10',
        Conditions: 'Cloudy',
        Report: 'Close match with thrilling finish.',
        ReportImage: ''
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMatchReports,
    });

    render(<Homepage />);

    // Wait for the match reports to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText(/Village CC vs Opponents CC/i)).toBeInTheDocument();
    });

    // Verify the API was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/matchreports?limit=3&order=desc');
    
    // Check that result text is displayed
    expect(screen.getByText(/Village CC won - by 50 runs/i)).toBeInTheDocument();
    expect(screen.getByText(/Team A won - by 10 runs/i)).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Homepage />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch match reports: 500/i)).toBeInTheDocument();
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
