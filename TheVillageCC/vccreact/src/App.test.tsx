import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders The Village CC homepage', () => {
  render(<App />);
  const headingElement = screen.getByText(/Friendly Cricket in and around London/i);
  expect(headingElement).toBeInTheDocument();
});
