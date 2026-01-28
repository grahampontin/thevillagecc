import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Awards from './Awards';

// Mock fetch globally
global.fetch = jest.fn();

// Wrapper component to provide routing context
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/awards']) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Awards', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
    // Clear any URL search params
    window.history.replaceState({}, '', '/awards');
  });

  const mockAwards2023 = [
    {
      id: 1,
      year: 2023,
      award: 'PlayerOfTheYear',
      playerId: 1,
      playerName: 'John Doe',
      data: null
    },
    {
      id: 2,
      year: 2023,
      award: 'BowlerOfTheYear',
      playerId: 2,
      playerName: 'Jane Smith',
      data: null
    }
  ];

  const mockAwards2024 = [
    {
      id: 3,
      year: 2024,
      award: 'PlayerOfTheYear',
      playerId: 3,
      playerName: 'Bob Johnson',
      data: null
    }
  ];

  const mockAwards2025 = [
    {
      id: 4,
      year: 2025,
      award: 'BatsmanOfTheYear',
      playerId: 4,
      playerName: 'Alice Brown',
      data: null
    }
  ];

  test('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<Awards />);

    // Check for skeleton loading state
    const skeletonElements = screen.getAllByRole('generic').filter(el => 
      el.className.includes('animate-pulse')
    );
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  test('defaults to latest year with awards when no season parameter', async () => {
    const allAwards = [...mockAwards2023, ...mockAwards2024, ...mockAwards2025];
    
    // First call: GET /api/Awards (no season) - returns all awards
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => allAwards,
      })
      // Second call: GET /api/Awards?season=2025 - returns 2025 awards
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAwards2025,
      });

    renderWithRouter(<Awards />);

    // Wait for the component to fetch all awards and navigate to latest year
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/Awards',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });

    // Wait for it to fetch awards for 2025
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/Awards?season=2025',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });

    // Verify the 2025 season is displayed
    await waitFor(() => {
      expect(screen.getByText('2025 Awards')).toBeInTheDocument();
    });
  });

  test('defaults to current year when no awards exist', async () => {
    const currentYear = new Date().getFullYear();
    
    // First call: GET /api/Awards (no season) - returns empty array
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      // Second call: GET /api/Awards?season=currentYear - returns empty array
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    renderWithRouter(<Awards />);

    // Wait for it to fetch all awards
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/Awards',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });

    // Wait for it to fetch awards for current year
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/Awards?season=${currentYear}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });
  });

  test('uses season parameter from URL when provided', async () => {
    // Set URL with season parameter
    window.history.replaceState({}, '', '/awards?season=2023');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAwards2023,
    });

    renderWithRouter(<Awards />);

    // Should NOT fetch all awards, should directly fetch for 2023
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/Awards?season=2023',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });

    // Verify only one API call was made (not two)
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Verify the 2023 season is displayed
    await waitFor(() => {
      expect(screen.getByText('2023 Awards')).toBeInTheDocument();
    });
  });

  test('displays awards for selected year', async () => {
    window.history.replaceState({}, '', '/awards?season=2023');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAwards2023,
    });

    renderWithRouter(<Awards />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('displays message when no awards available for selected year', async () => {
    window.history.replaceState({}, '', '/awards?season=2022');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter(<Awards />);

    await waitFor(() => {
      expect(screen.getByText(/No awards available for the 2022 season/i)).toBeInTheDocument();
    });
  });

  test('handles API error gracefully when fetching all awards', async () => {
    const currentYear = new Date().getFullYear();
    
    // First call fails (fetching all awards)
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server error',
      })
      // Second call succeeds (fallback to current year)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    renderWithRouter(<Awards />);

    // Should fallback to current year
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/Awards?season=${currentYear}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });
  });

  test('handles awards with years sorted correctly', async () => {
    // Awards not in chronological order
    const allAwards = [
      { id: 1, year: 2022, award: 'Award1', playerName: 'Player1' },
      { id: 2, year: 2025, award: 'Award2', playerName: 'Player2' },
      { id: 3, year: 2023, award: 'Award3', playerName: 'Player3' },
      { id: 4, year: 2024, award: 'Award4', playerName: 'Player4' },
    ];
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => allAwards,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 2, year: 2025, award: 'Award2', playerName: 'Player2' }],
      });

    renderWithRouter(<Awards />);

    // Should select 2025 as the latest year
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/Awards?season=2025',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });
  });
});
