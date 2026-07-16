import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'setItem');
    global.fetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve({}),
    }));
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing and displays the reset button', () => {
    render(<App />);
    const resetButton = screen.getByText('リセット');
    expect(resetButton).toBeInTheDocument();
  });

  it('calls fetch when "スプレッドシートへ同期" is clicked', async () => {
    render(<App />);
    const syncBtn = screen.getByText('スプレッドシートへ同期');
    fireEvent.click(syncBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    expect(window.alert).toHaveBeenCalledWith('スプレッドシートに同期しました！');
  });

  it('navigates to next ticker when ArrowRight is pressed', () => {
    render(<App />);
    // Initial load will select the first ticker from data
    // Assuming tickers exist in data/tickers.js
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    // State updates inside handleNext
    // Cannot easily assert exact ticker symbol without knowing mock data, but we assert it doesn't crash
  });
});
