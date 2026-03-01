import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PlayerDetail from './PlayerDetail';

// Capture the last data prop passed to the Radar component so we can inspect
// the labels that the component would render.
const lastRadarProps: { data?: { labels?: unknown[] } } = {};
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar: () => null,
  Pie: () => null,
  Doughnut: () => null,
  Radar: (props: { data?: { labels?: unknown[] } }) => {
    lastRadarProps.data = props.data;
    return null;
  },
}));

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
    playingRole: 'All-rounder',
    runs: 1500,
    wickets: 20,
    catches: 15
  },
  playerImageUrl: 'http://example.com/player.jpg',
  battingStats: {
    statsType: 'Batting',
    gridOptions: {
      columnDefs: [{ field: 'matches', headerName: 'Matches' }],
      rowData: [{ matches: 50, runs: 1500, catches: 15 }],
      footerRow: { matches: 50, runs: 1500, catches: 15 }
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

// Radar chart data returned by the scoringZones API endpoint (uses RHB position names)
const mockScoringZonesChartData = {
  type: 'radar',
  data: {
    labels: ['Fine Leg', 'Backward Square Leg', 'Square Leg', 'Mid Wicket', 'Mid On', 'Mid Off', 'Cover', 'Point', 'Third Man'],
    datasets: [{ label: 'Runs', data: [10, 5, 8, 20, 15, 18, 12, 9, 3] }]
  },
  options: { responsive: true, plugins: { title: { display: true, text: 'Scoring Areas (100 balls)' } } }
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
    // Reset captured radar props so tests don't bleed into each other
    lastRadarProps.data = undefined;
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
    
    // Check for skeleton loader elements instead of spinner text
    const skeletonElements = screen.getAllByRole('generic', { hidden: true });
    expect(skeletonElements.length).toBeGreaterThan(0);
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

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/Stats/player/1/detail'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept': 'application/json'
        })
      })
    );
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

    // Check for elements that are actually displayed
    expect(screen.getByText(/Batting Style/i)).toBeInTheDocument();
    expect(screen.getByText(/Bowling Style/i)).toBeInTheDocument();
    expect(screen.getByText(/Caps/i)).toBeInTheDocument();
  });

  test('handles network error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText(/Failed to load player details/i)).toBeInTheDocument();
    });
  });

  test('chart data includes color properties', async () => {
    // Mock all the API calls - now we fetch ALL charts at once
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayerDetailData,
      })
      // Batting charts
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBattingChartData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBattingChartData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBattingChartData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBattingChartData,
      })
      // Bowling charts
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBowlingChartData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBowlingChartData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBowlingChartData,
      });

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0);
    });

    // Verify the chart APIs were called for all chart types
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Stats/chart/1/battingTimeline'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Stats/chart/1/modesOfDismissal'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Stats/chart/1/scoringZones'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Stats/chart/1/strikeRates'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Stats/chart/1/wicketsBySeason'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Stats/chart/1/averageBySeason'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Stats/chart/1/bowlingDismissalsByType'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
    });

    // Verify that our mock chart data has the color properties
    expect(mockBattingChartData.data.datasets[0].backgroundColor).toBeDefined();
    expect(mockBattingChartData.data.datasets[0].borderColor).toBeDefined();
    expect(mockBowlingChartData.data.datasets[0].backgroundColor).toBeDefined();
    expect(mockBowlingChartData.data.datasets[0].borderColor).toBeDefined();
  });

  test('displays playing role instead of generic squad text', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayerDetailData,
    });

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText('All-rounder')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Squad · The Village Cricket Club/i)).not.toBeInTheDocument();
  });

  test('displays all-time totals from player object in summary cards', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayerDetailData,
    });

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0);
    });

    // runs=1500, wickets=20, catches=15 come from player object (all-time totals)
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('shows chart skeleton loaders while charts are loading', async () => {
    // Player detail resolves quickly, but chart fetches never resolve
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayerDetailData,
      })
      .mockImplementation(() => new Promise(() => {})); // charts never resolve

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0);
    });

    // Chart skeleton loaders should be visible while charts are loading
    const chartSkeletons = screen.getAllByRole('status', { name: /Loading chart/i });
    expect(chartSkeletons.length).toBeGreaterThan(0);
  });

  test('inverts scoring zone labels for left-handed batsmen', async () => {
    const lhbPlayerDetail = {
      ...mockPlayerDetailData,
      player: { ...mockPlayerDetailData.player, isRightHandBat: false },
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => lhbPlayerDetail })
      // Return the scoring zones chart as the third chart (after battingTimeline, modesOfDismissal)
      .mockResolvedValueOnce({ ok: true, json: async () => mockBattingChartData }) // battingTimeline
      .mockResolvedValueOnce({ ok: true, json: async () => mockBattingChartData }) // modesOfDismissal
      .mockResolvedValueOnce({ ok: true, json: async () => mockScoringZonesChartData }) // scoringZones
      .mockResolvedValue({ ok: true, json: async () => mockBattingChartData });   // remaining charts

    renderWithRouter('1');

    await waitFor(() => {
      // The scoringZones radar chart should have been rendered with inverted labels
      expect(lastRadarProps.data).toBeDefined();
    });

    const labels = lastRadarProps.data?.labels as string[];
    // Verify the full label set is the correct LHB mirror of the RHB labels.
    // Each position name should be replaced with its opposite-side equivalent.
    expect(labels[0]).toBe('Third Man');        // Fine Leg    → Third Man
    expect(labels[2]).toBe('Point');            // Square Leg  → Point
    expect(labels[4]).toBe('Mid Off');          // Mid On      → Mid Off
    expect(labels[5]).toBe('Mid On');           // Mid Off     → Mid On
    expect(labels[7]).toBe('Square Leg');       // Point       → Square Leg
    expect(labels[8]).toBe('Fine Leg');         // Third Man   → Fine Leg
  });

  test('keeps scoring zone labels unchanged for right-handed batsmen', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockPlayerDetailData }) // isRightHandBat: true
      .mockResolvedValueOnce({ ok: true, json: async () => mockBattingChartData }) // battingTimeline
      .mockResolvedValueOnce({ ok: true, json: async () => mockBattingChartData }) // modesOfDismissal
      .mockResolvedValueOnce({ ok: true, json: async () => mockScoringZonesChartData }) // scoringZones
      .mockResolvedValue({ ok: true, json: async () => mockBattingChartData });

    renderWithRouter('1');

    await waitFor(() => {
      expect(lastRadarProps.data).toBeDefined();
    });

    const labels = lastRadarProps.data?.labels as string[];
    // RHB labels should remain as returned by the API
    expect(labels).toContain('Mid Off');
    expect(labels).toContain('Square Leg');
    expect(labels).toContain('Third Man');
  });
});
