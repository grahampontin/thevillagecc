import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PlayersPage from './PlayersPage';

// Mock fetch globally
global.fetch = jest.fn();

const renderWithRouter = (component: React.ReactElement) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

const mockPlayers = [
  {
    playerId: 1,
    firstName: 'Alice',
    surname: 'Smith',
    matches: 40,
    runs: 800,
    wickets: 10,
    catches: 5,
    isActive: true,
    isRightHandBat: true,
    bowlingStyle: 'OB',
    playingRole: 'All-rounder',
    debut: '2015-05-01T00:00:00Z',
    clubConnection: null,
  },
  {
    playerId: 2,
    firstName: 'Bob',
    surname: 'Jones',
    matches: 20,
    runs: 300,
    wickets: 25,
    catches: 8,
    isActive: true,
    isRightHandBat: false,
    bowlingStyle: 'SLA',
    playingRole: 'Bowler',
    debut: '2018-05-01T00:00:00Z',
    clubConnection: { playerId: 1, firstName: 'Alice', surname: 'Smith' },
  },
  {
    playerId: 3,
    firstName: 'Carol',
    surname: 'Davis',
    matches: 5,
    runs: 50,
    wickets: 2,
    catches: 1,
    isActive: false,
    isRightHandBat: true,
    bowlingStyle: 'RM',
    playingRole: 'Batsman',
    debut: '2020-05-01T00:00:00Z',
    clubConnection: null,
  },
];

describe('PlayersPage', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders loading skeleton initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<PlayersPage />);
    expect(screen.getByLabelText(/loading players/i)).toBeInTheDocument();
  });

  test('renders page title', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });
    renderWithRouter(<PlayersPage />);
    expect(await screen.findByText('The Squad')).toBeInTheDocument();
  });

  test('displays active players in list view by default', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });
    renderWithRouter(<PlayersPage />);

    expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    // Carol is inactive – should not appear by default
    expect(screen.queryByText('Carol Davis')).not.toBeInTheDocument();
  });

  test('shows inactive players when "include former" is checked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });
    renderWithRouter(<PlayersPage />);
    await screen.findByText('Alice Smith');

    const checkbox = screen.getByRole('checkbox', { name: /include former/i });
    fireEvent.click(checkbox);

    expect(screen.getByText('Carol Davis')).toBeInTheDocument();
  });

  test('filters players by search query', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });
    renderWithRouter(<PlayersPage />);
    await screen.findByText('Alice Smith');

    const searchInput = screen.getByPlaceholderText(/search players/i);
    fireEvent.change(searchInput, { target: { value: 'bob' } });

    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  test('switches to family tree view when Tree button is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });
    renderWithRouter(<PlayersPage />);
    await screen.findByText('Alice Smith');

    const treeButton = screen.getByRole('button', { name: /family tree/i });
    fireEvent.click(treeButton);

    // Tree view shows the container with aria-label
    expect(
      screen.getByRole('img', { name: /family tree/i }),
    ).toBeInTheDocument();
  });

  test('shows zoom controls in family tree view', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });
    renderWithRouter(<PlayersPage />);
    await screen.findByText('Alice Smith');

    fireEvent.click(screen.getByRole('button', { name: /family tree/i }));

    expect(screen.getByRole('button', { name: /zoom out family tree/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset family tree zoom/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zoom in family tree/i })).toBeInTheDocument();
  });

  test('displays player stats columns in list view', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });
    renderWithRouter(<PlayersPage />);
    await screen.findByText('Alice Smith');

    // Column headers visible
    expect(screen.getByText('Player')).toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    renderWithRouter(<PlayersPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/failed to load players/i)).toBeInTheDocument();
  });

  test('list toggle button starts as active', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });
    renderWithRouter(<PlayersPage />);
    await screen.findByText('Alice Smith');

    const listButton = screen.getByRole('button', { name: /^list$/i });
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
  });
});

