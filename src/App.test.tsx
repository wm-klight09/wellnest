import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Wellnest app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Welcome to Wellnest/i);
  expect(titleElement).toBeInTheDocument();
});
