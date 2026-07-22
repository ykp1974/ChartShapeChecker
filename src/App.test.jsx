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
    localStorage.clear();
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
    // Populate selected ids in local storage before rendering
    localStorage.setItem('selected_ticker_ids', JSON.stringify(['13PuoMZxeUbPhQoZ934yDIVSUmX4OF_mz']));

    render(<App />);
    const syncBtn = screen.getByText('スプレッドシートへ同期');
    fireEvent.click(syncBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    expect(window.alert).toHaveBeenCalledWith('スプレッドシートに同期しました！');
  });

  it('navigates to next ticker when ArrowRight is pressed and prev ticker when ArrowLeft is pressed', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
  });

  it('resets selection when "リセット" is clicked', () => {
    localStorage.setItem('selected_ticker_ids', JSON.stringify(['13PuoMZxeUbPhQoZ934yDIVSUmX4OF_mz']));
    render(<App />);
    const resetBtn = screen.getByText('リセット');
    fireEvent.click(resetBtn);
    expect(localStorage.getItem('selected_ticker_ids')).toBe('[]');
  });

  it('handles local storage parse errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('chart_read_status', 'invalid-json');
    localStorage.setItem('selected_ticker_ids', 'invalid-json');
    render(<App />);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('does not trigger keydown handler when inputs are focused', () => {
    render(<App />);
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(event);
    document.body.removeChild(input);
  });
});
