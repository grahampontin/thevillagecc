import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Tours from './Tours';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Tours', () => {
  test('renders page title', () => {
    renderWithRouter(<Tours />);
    expect(screen.getByRole('heading', { name: /Touring/i, level: 1 })).toBeInTheDocument();
  });

  test('renders all five tour sections', () => {
    renderWithRouter(<Tours />);
    expect(screen.getByRole('heading', { name: /Malta/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Amsterdam/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Montenegro/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Copenhagen/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Porto/i, level: 2 })).toBeInTheDocument();
  });

  test('renders scorecard links for all matches', () => {
    renderWithRouter(<Tours />);
    const scorecardLinks = screen.getAllByText(/View scorecard/i);
    // 3 Malta + 2 Amsterdam + 2 Montenegro + 2 Copenhagen + 2 Porto = 11 matches
    expect(scorecardLinks.length).toBe(11);
  });

  test('links to correct scorecard URLs', () => {
    renderWithRouter(<Tours />);
    const links = screen.getAllByRole('link');
    const scorecardLinks = links.filter((link) =>
      link.getAttribute('href')?.startsWith('/scorecard/')
    );
    const hrefs = scorecardLinks.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/scorecard/299');
    expect(hrefs).toContain('/scorecard/300');
    expect(hrefs).toContain('/scorecard/301');
    expect(hrefs).toContain('/scorecard/331');
    expect(hrefs).toContain('/scorecard/332');
    expect(hrefs).toContain('/scorecard/386');
    expect(hrefs).toContain('/scorecard/387');
    expect(hrefs).toContain('/scorecard/488');
    expect(hrefs).toContain('/scorecard/489');
    expect(hrefs).toContain('/scorecard/514');
    expect(hrefs).toContain('/scorecard/530');
  });

  test('renders image placeholders for each tour', () => {
    renderWithRouter(<Tours />);
    const placeholders = screen.getAllByText(/Photo coming soon/i);
    expect(placeholders.length).toBe(5);
  });

  test('renders full tour report links for Malta, Amsterdam and Porto', () => {
    renderWithRouter(<Tours />);
    const reportLinks = screen.getAllByText(/Read the full tour report/i);
    // Malta (300), Amsterdam (332), Porto (514) each have a report link
    expect(reportLinks.length).toBe(3);
  });

  test('renders quick navigation links to each tour', () => {
    renderWithRouter(<Tours />);
    const nav = screen.getByRole('navigation', { name: /Tour navigation/i });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveTextContent('Malta 2015');
    expect(nav).toHaveTextContent('Amsterdam 2017');
    expect(nav).toHaveTextContent('Montenegro & Dubrovnik 2019');
    expect(nav).toHaveTextContent('Copenhagen 2022');
    expect(nav).toHaveTextContent('Porto 2024');
  });

  test('result badges show won/lost correctly', () => {
    renderWithRouter(<Tours />);
    // Malta match 301 was a win
    expect(screen.getByText('Won by 5 runs')).toBeInTheDocument();
    // Amsterdam matches were both wins
    expect(screen.getByText('Won by 46 runs')).toBeInTheDocument();
    expect(screen.getByText('Won by 7 wickets')).toBeInTheDocument();
    // Montenegro match 387 lost by 1 run
    expect(screen.getByText('Lost by 1 run')).toBeInTheDocument();
  });
});
