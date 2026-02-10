// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// In JSDOM (Jest), canvas isn't implemented which Chart.js relies on.
// Mock react-chartjs-2 components so components using charts can be tested without a canvas implementation.
jest.mock('react-chartjs-2', () => {
  const React = require('react');
  const MockChart = ({ children }: any) => React.createElement('div', { 'data-testid': 'mock-chart' }, children);

  return {
    Line: MockChart,
    Bar: MockChart,
    Pie: MockChart,
    Doughnut: MockChart,
    Radar: MockChart,
  };
});
