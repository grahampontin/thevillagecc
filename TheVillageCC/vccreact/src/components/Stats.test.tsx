import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Stats from './Stats';

// Mock fetch globally
global.fetch = jest.fn();

describe('Stats Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display skeleton loader while loading stats', async () => {
    // Mock slow API response
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({
              statsType: 'batting',
              gridOptions: {
                columnDefs: [{ field: 'player', headerName: 'Player' }],
                rowData: [{ player: 'Test Player' }],
              },
            }),
          });
        }, 5000); // 5 second delay
      })
    );

    render(
      <BrowserRouter>
        <Stats />
      </BrowserRouter>
    );

    // Wait for component to mount and start loading
    await waitFor(() => {
      // Check for skeleton loader elements
      const skeletonElements = screen.getAllByRole('generic', { hidden: true });
      const hasSkeletonClass = skeletonElements.some(
        (el) => el.className.includes('skeleton')
      );
      expect(hasSkeletonClass).toBe(true);
    }, { timeout: 2000 });
  });

  it('should display skeleton grid header and rows when loading', async () => {
    // Mock slow API response
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({
              statsType: 'batting',
              gridOptions: {
                columnDefs: [],
                rowData: [],
              },
            }),
          });
        }, 5000);
      })
    );

    render(
      <BrowserRouter>
        <Stats />
      </BrowserRouter>
    );

    // Check for the skeleton grid container
    await waitFor(() => {
      const skeletonGrid = document.querySelector('.skeleton-grid');
      expect(skeletonGrid).toBeInTheDocument();
    }, { timeout: 2000 });

    // Check for skeleton header
    const skeletonHeader = document.querySelector('.skeleton-grid-header');
    expect(skeletonHeader).toBeInTheDocument();

    // Check for skeleton rows (should have 10 rows)
    const skeletonRows = document.querySelectorAll('.skeleton-grid-row');
    expect(skeletonRows.length).toBe(10);
  });

  it('should show visually-hidden loading text for accessibility', async () => {
    // Mock slow API response
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({
              statsType: 'batting',
              gridOptions: {
                columnDefs: [],
                rowData: [],
              },
            }),
          });
        }, 5000);
      })
    );

    render(
      <BrowserRouter>
        <Stats />
      </BrowserRouter>
    );

    // Check for accessibility text
    await waitFor(() => {
      const loadingText = screen.getByText('Loading...', { selector: '.visually-hidden' });
      expect(loadingText).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
