import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Fixtures from './Fixtures';

// Mock fetch globally
global.fetch = jest.fn();

// Wrapper component to provide routing context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Fixtures', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
  });

  const mockFixtures = [
    {
      Id: 1,
      Date: '2024-06-15T12:00:00Z',
      Venue: { Id: 1, Name: 'Lords Cricket Ground' },
      Opposition: { Id: 1, Name: 'Opponents CC' },
      Type: 'Friendly',
      IsHome: true
    },
    {
      Id: 2,
      Date: '2024-06-22T12:00:00Z',
      Venue: { Id: 2, Name: 'The Oval' },
      Opposition: { Id: 2, Name: 'Another Team' },
      Type: 'League',
      IsHome: false
    }
  ];

  test('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<Fixtures />);
    
    // Check for skeleton loading state
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  test('fetches and displays fixtures from API', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText(/Fixtures \d{4}/)).toBeInTheDocument();
    });

    // Verify the API was called with season parameter
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/fixtures?season='));
  });

  test('displays calendar icon for each fixture', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      const calendarLinks = screen.getAllByLabelText('Add to calendar');
      expect(calendarLinks.length).toBe(mockFixtures.length);
    });
  });

  test('displays message when no fixtures are available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText(/No fixtures available for the \d{4} season/i)).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText(/No fixtures available for the \d{4} season/i)).toBeInTheDocument();
    });
  });

  test('displays dates correctly and not as "Invalid Date"', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    renderWithRouter(<Fixtures />);

    // Wait for loading to complete
    await waitFor(() => {
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBe(0);
    });

    // Check that dates are displayed in the long format
    await waitFor(() => {
      expect(screen.getByText(/15 June 2024/)).toBeInTheDocument();
    });
    
    // Ensure "Invalid Date" is not present anywhere
    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
  });

  test('filters out fixtures with invalid dates', async () => {
    const fixturesWithInvalidDate = [
      ...mockFixtures,
      {
        Id: 3,
        Date: 'invalid-date-string',
        Venue: { Id: 3, Name: 'Test Ground' },
        Opposition: { Id: 3, Name: 'Test Team' },
        Type: 'Friendly',
        IsHome: true
      },
      {
        Id: 4,
        Date: '',
        Venue: { Id: 4, Name: 'Another Ground' },
        Opposition: { Id: 4, Name: 'Another Team' },
        Type: 'League',
        IsHome: false
      }
    ];

    // Mock console.error to check it's called
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fixturesWithInvalidDate,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBe(0);
    });

    // Should display the valid fixtures
    await waitFor(() => {
      expect(screen.getByText(/15 June 2024/)).toBeInTheDocument();
    });

    // Should have logged errors for invalid dates
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Skipping fixture with invalid date'),
      expect.anything()
    );

    consoleErrorSpy.mockRestore();
  });

  test('formatDateForCalendar handles invalid dates gracefully', async () => {
    const fixturesWithEdgeCase = [
      {
        Id: 1,
        Date: '2024-06-15T12:00:00Z',
        Venue: { Id: 1, Name: 'Valid Ground' },
        Opposition: { Id: 1, Name: 'Valid Team' },
        Type: 'Friendly',
        IsHome: true
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fixturesWithEdgeCase,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBe(0);
    });

    // The fixture should render without errors
    await waitFor(() => {
      expect(screen.getAllByText(/Valid Team/).length).toBeGreaterThan(0);
    });

    // No error should appear
    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
  });

  test('displays Home/Away badge correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Away')).toBeInTheDocument();
    });
  });
});
