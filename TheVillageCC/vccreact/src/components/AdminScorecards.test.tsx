import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminScorecards from './AdminScorecards';

global.fetch = jest.fn();

const renderWithRouter = (component: React.ReactElement) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

const mockMatches = [
  { id: 1, opposition: { id: 10, name: 'Barton CC' }, date: '2024-05-11T00:00:00', venue: null, type: 'Friendly' },
  { id: 2, opposition: { id: 11, name: 'Oakfield CC' }, date: '2024-06-15T00:00:00', venue: null, type: 'Friendly' },
];

describe('AdminScorecards', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders loading skeleton initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<AdminScorecards />);
    const skeletons = screen.getAllByRole('generic').filter(el =>
      el.className.includes('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('displays matches after loading', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMatches,
    });
    renderWithRouter(<AdminScorecards />);
    expect(await screen.findByText(/Barton CC/)).toBeInTheDocument();
    expect(await screen.findByText(/Oakfield CC/)).toBeInTheDocument();
  });

  test('displays empty state when no matches', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    renderWithRouter(<AdminScorecards />);
    const currentYear = new Date().getFullYear();
    await waitFor(() => {
      expect(screen.getByText(`No matches for ${currentYear}.`)).toBeInTheDocument();
    });
  });

  test('season navigation loads different season', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockMatches })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    renderWithRouter(<AdminScorecards />);
    await screen.findByText(/Barton CC/);

    const prevBtn = screen.getByRole('button', { name: /Previous season/i });
    await userEvent.click(prevBtn);

    const currentYear = new Date().getFullYear();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/Matches?season=${currentYear - 1}`),
        expect.any(Object)
      );
    });
  });

  test('filter input narrows match list', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMatches,
    });
    renderWithRouter(<AdminScorecards />);
    await screen.findByText(/Barton CC/);

    const filterInput = screen.getByPlaceholderText('Filter matches…');
    await userEvent.type(filterInput, 'Barton');

    expect(screen.getByText(/Barton CC/)).toBeInTheDocument();
    expect(screen.queryByText(/Oakfield CC/)).not.toBeInTheDocument();
  });

  test('each match has a link to its scorecard edit page', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMatches,
    });
    renderWithRouter(<AdminScorecards />);
    await screen.findByText(/Barton CC/);

    const links = screen.getAllByRole('link', { name: /Edit scorecard/i });
    expect(links.length).toBe(2);
    expect(links[0]).toHaveAttribute('href', '/admin/scorecards/1');
  });
});
