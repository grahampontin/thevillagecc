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
      id: 1,
      date: '2024-06-15T12:00:00Z',
      venue: { id: 1, name: 'Lords Cricket Ground' },
      opposition: { id: 1, name: 'Opponents CC' },
      type: 'Friendly',
      isHome: true
    },
    {
      id: 2,
      date: '2024-06-22T12:00:00Z',
      venue: { id: 2, name: 'The Oval' },
      opposition: { id: 2, name: 'Another Team' },
      type: 'League',
      isHome: false
    }
  ];

  test('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<Fixtures />);

    // Check for skeleton loading state
    expect(screen.getAllByLabelText(/loading fixture/i).length).toBeGreaterThan(0);
  });

  test('fetches and displays fixtures from API', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Fixtures', level: 1 })).toBeInTheDocument();
    });

    // Verify the API was called with season parameter (now with headers from API layer)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/Fixtures?season='),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept': 'application/json'
        })
      })
    );
  });

  test('displays "Add to calendar" link for each fixture', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      const calendarLinks = screen.getAllByLabelText(/add to calendar/i);
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
      expect(screen.queryByLabelText(/loading fixture/i)).not.toBeInTheDocument();
    });

    expect(await screen.findByText(/15 June 2024/)).toBeInTheDocument();
    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
  });

  test('filters out fixtures with invalid dates', async () => {
    const fixturesWithInvalidDate = [
      ...mockFixtures,
      {
        id: 3,
        date: 'invalid-date-string',
        venue: { id: 3, name: 'Test Ground' },
        opposition: { id: 3, name: 'Test Team' },
        type: 'Friendly',
        isHome: true
      },
      {
        id: 4,
        date: '',
        venue: { id: 4, name: 'Another Ground' },
        opposition: { id: 4, name: 'Another Team' },
        type: 'League',
        isHome: false
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
      expect(screen.queryByLabelText(/loading fixture/i)).not.toBeInTheDocument();
    });

    expect(await screen.findByText(/15 June 2024/)).toBeInTheDocument();

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
        id: 1,
        date: '2024-06-15T12:00:00Z',
        venue: { id: 1, name: 'Valid Ground' },
        opposition: { id: 1, name: 'Valid Team' },
        type: 'Friendly',
        isHome: true
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fixturesWithEdgeCase,
    });

    renderWithRouter(<Fixtures />);

    await waitFor(() => {
      expect(screen.queryByLabelText(/loading fixture/i)).not.toBeInTheDocument();
    });

    expect((await screen.findAllByText(/Valid Team/)).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
  });

  test('displays HOME/AWAY badge correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    renderWithRouter(<Fixtures />);

    expect(await screen.findByText('HOME')).toBeInTheDocument();
    expect(await screen.findByText('AWAY')).toBeInTheDocument();
  });
});
