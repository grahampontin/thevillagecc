import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminMatches from './AdminMatches';

global.fetch = jest.fn();

const renderWithRouter = (component: React.ReactElement) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

const mockMatches = [
  { id: 1, opposition: { id: 10, name: 'Barton CC' }, date: '2024-05-11T00:00:00', venue: { id: 1, name: 'Home Ground' }, type: 'Friendly' },
  { id: 2, opposition: { id: 11, name: 'Oakfield CC' }, date: '2024-06-15T00:00:00', venue: { id: 2, name: 'Away Ground' }, type: 'Friendly' },
];

const mockTeams = [
  { id: 10, name: 'Barton CC' },
  { id: 11, name: 'Oakfield CC' },
];

const mockVenues = [
  { id: 1, name: 'Home Ground' },
  { id: 2, name: 'Away Ground' },
];

function setupFetchForLoad() {
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({ ok: true, json: async () => mockTeams })
    .mockResolvedValueOnce({ ok: true, json: async () => mockVenues })
    .mockResolvedValueOnce({ ok: true, json: async () => mockMatches });
}

describe('AdminMatches', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders loading skeleton initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<AdminMatches />);
    const skeletons = screen.getAllByRole('generic').filter(el =>
      el.className.includes('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('displays matches after loading', async () => {
    setupFetchForLoad();
    renderWithRouter(<AdminMatches />);
    expect(await screen.findByText(/Barton CC/)).toBeInTheDocument();
    expect(await screen.findByText(/Oakfield CC/)).toBeInTheDocument();
  });

  test('displays empty state when no matches', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockTeams })
      .mockResolvedValueOnce({ ok: true, json: async () => mockVenues })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });
    renderWithRouter(<AdminMatches />);
    const currentYear = new Date().getFullYear();
    await waitFor(() => {
      expect(screen.getByText(`No matches for ${currentYear}.`)).toBeInTheDocument();
    });
  });

  test('each match has edit and delete buttons', async () => {
    setupFetchForLoad();
    renderWithRouter(<AdminMatches />);
    await screen.findByText(/Barton CC/);

    const editBtns = screen.getAllByRole('button', { name: /Edit match vs/i });
    const deleteBtns = screen.getAllByRole('button', { name: /Delete match vs/i });
    expect(editBtns.length).toBe(2);
    expect(deleteBtns.length).toBe(2);
  });

  test('delete button calls DELETE API after confirmation', async () => {
    setupFetchForLoad();
    // After deletion, reload matches
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, status: 204 })
      .mockResolvedValueOnce({ ok: true, json: async () => [mockMatches[1]] });

    window.confirm = jest.fn(() => true);

    renderWithRouter(<AdminMatches />);
    await screen.findByText(/Barton CC/);

    const deleteBtn = screen.getAllByRole('button', { name: /Delete match vs/i })[0];
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Matches/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  test('delete button does nothing when confirmation is cancelled', async () => {
    setupFetchForLoad();
    window.confirm = jest.fn(() => false);

    renderWithRouter(<AdminMatches />);
    await screen.findByText(/Barton CC/);

    const fetchCallsBefore = (global.fetch as jest.Mock).mock.calls.length;
    const deleteBtn = screen.getAllByRole('button', { name: /Delete match vs/i })[0];
    await userEvent.click(deleteBtn);

    expect((global.fetch as jest.Mock).mock.calls.length).toBe(fetchCallsBefore);
  });
});
