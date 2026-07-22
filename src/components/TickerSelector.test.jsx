import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TickerSelector from './TickerSelector';

const mockTickers = [
  { symbol: 'AAPL', name: 'Apple Inc.', id: '123' },
  { symbol: 'MSFT', name: 'Microsoft', id: '456' }
];

describe('TickerSelector', () => {
  it('renders the selected ticker correctly', () => {
    render(
      <TickerSelector
        tickers={mockTickers}
        selectedTicker={mockTickers[0]}
        onSelect={() => {}}
        onToggleRead={() => {}}
        readStatus={{}}
      />
    );
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
  });

  it('opens dropdown when clicked, filters list by search, clears search, and closes dropdown on outside click', async () => {
    const handleSelect = vi.fn();
    const handleToggleRead = vi.fn();

    const { container } = render(
      <TickerSelector
        tickers={mockTickers}
        selectedTicker={mockTickers[0]}
        onSelect={handleSelect}
        onToggleRead={handleToggleRead}
        readStatus={{ 'AAPL': true, 'MSFT': false }}
      />
    );
    
    const triggerBtn = screen.getByRole('button', { name: /AAPL Apple Inc\./i });
    fireEvent.click(triggerBtn);
    
    // dropdown search input should appear
    const searchInput = screen.getByPlaceholderText('検索...');
    expect(searchInput).toBeInTheDocument();

    // 1. Search term input
    fireEvent.change(searchInput, { target: { value: 'Apple' } });
    expect(screen.getAllByText('AAPL')[0]).toBeInTheDocument();
    expect(screen.queryByText('MSFT')).not.toBeInTheDocument();

    // 2. Clear search input
    const clearBtn = container.querySelector('.search-input-wrapper button');
    fireEvent.click(clearBtn);
    expect(screen.getByText('MSFT')).toBeInTheDocument();

    // 3. Toggle read status click
    const readBtn = container.querySelector('.read-toggle');
    fireEvent.click(readBtn);
    expect(handleToggleRead).toHaveBeenCalledWith('AAPL');

    // 4. Click option to select
    const msftItem = screen.getByText('Microsoft');
    fireEvent.click(msftItem);
    expect(handleSelect).toHaveBeenCalledWith(mockTickers[1]);

    // Re-open
    fireEvent.click(triggerBtn);
    expect(screen.getByPlaceholderText('検索...')).toBeInTheDocument();

    // 5. Close on outside click
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('検索...')).not.toBeInTheDocument();
    });
  });
});
