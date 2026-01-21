import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Fixtures from './Fixtures';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.confirm
global.confirm = jest.fn();

describe('Fixtures', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
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
    
    render(<Fixtures />);
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('fetches and displays fixtures from API', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    render(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText('Fixtures')).toBeInTheDocument();
    });

    // Verify the API was called
    expect(global.fetch).toHaveBeenCalledWith('/api/fixtures');
  });

  test('displays "Add All to Calendar" button when fixtures are loaded', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    render(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText('Add All to Calendar')).toBeInTheDocument();
    });
  });

  test('shows confirmation dialog when "Add All to Calendar" is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    render(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText('Add All to Calendar')).toBeInTheDocument();
    });

    const addAllButton = screen.getByText('Add All to Calendar');
    fireEvent.click(addAllButton);

    expect(global.confirm).toHaveBeenCalledWith(
      'Are you sure you want to add all 2 fixtures to your calendar?'
    );
  });

  test('displays message when no fixtures are available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText(/No upcoming fixtures at this time/i)).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Fixtures />);

    await waitFor(() => {
      expect(screen.getByText(/No upcoming fixtures at this time/i)).toBeInTheDocument();
    });
  });

  test('displays dates correctly and not as "Invalid Date"', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures,
    });

    render(<Fixtures />);

    // Wait for loading to complete and the date to be rendered
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    // Check that the date is formatted correctly (UK format: DD/MM/YYYY)
    // There should be at least one element with this date
    await waitFor(() => {
      const dateElements = screen.getAllByText(/15\/06\/2024/);
      expect(dateElements.length).toBeGreaterThan(0);
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

    render(<Fixtures />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    // Should only display the 2 valid fixtures
    await waitFor(() => {
      const dateElements = screen.getAllByText(/15\/06\/2024/);
      expect(dateElements.length).toBeGreaterThan(0);
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

    render(<Fixtures />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    // The fixture should render without errors
    await waitFor(() => {
      expect(screen.getAllByText(/Valid Team/).length).toBeGreaterThan(0);
    });

    // No error should appear
    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
  });
});
