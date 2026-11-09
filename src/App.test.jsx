import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { isPcDevice } from './utils/device';

// デバイス判定を差し替え可能にする（デフォルトは PC 以外＝従来どおりチャート表示）
vi.mock('./utils/device', () => ({
  isPcDevice: vi.fn(() => false),
}));

describe('App Component', () => {
  beforeEach(() => {
    isPcDevice.mockReturnValue(false);
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
    // 完了通知はアラートではなくトーストで表示される
    expect(await screen.findByText('スプレッドシートに同期しました！')).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
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

  describe('チャート表示の初期状態（デバイス別）', () => {
    it('PC の場合、初期表示は OFF でチャートは表示されない', () => {
      isPcDevice.mockReturnValue(true);
      render(<App />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('switch')).toHaveTextContent('OFF');
      expect(screen.getByText(/チャートは非表示です/)).toBeInTheDocument();
    });

    it('PC の場合、トグルを押すとチャートが表示される', () => {
      isPcDevice.mockReturnValue(true);
      render(<App />);
      fireEvent.click(screen.getByRole('switch'));
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('switch')).toHaveTextContent('ON');
      expect(screen.queryByText(/チャートは非表示です/)).not.toBeInTheDocument();
    });

    it('PC 以外の場合、トグルは表示されず最初からチャートが表示される', () => {
      isPcDevice.mockReturnValue(false);
      render(<App />);
      expect(screen.queryByRole('switch')).not.toBeInTheDocument();
      expect(screen.queryByText(/チャートは非表示です/)).not.toBeInTheDocument();
    });
  });
});
