import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component Sanity Check', () => {
  it('renders without crashing and displays the reset button', () => {
    render(<App />);
    const resetButton = screen.getByText('リセット');
    expect(resetButton).toBeInTheDocument();
  });
});
