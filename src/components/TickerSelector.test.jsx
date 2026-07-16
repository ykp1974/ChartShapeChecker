import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('opens dropdown when clicked', () => {
    render(
      <TickerSelector
        tickers={mockTickers}
        selectedTicker={mockTickers[0]}
        onSelect={() => {}}
        onToggleRead={() => {}}
        readStatus={{}}
      />
    );
    
    const triggerBtn = screen.getByRole('button', { name: /AAPL Apple Inc\./i });
    fireEvent.click(triggerBtn);
    
    // dropdown search input should appear
    expect(screen.getByPlaceholderText('検索...')).toBeInTheDocument();
  });
});
