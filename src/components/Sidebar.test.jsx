import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

const mockTickers = [
  { symbol: 'GOOGL', name: 'Alphabet', market: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon', market: 'NASDAQ' }
];

describe('Sidebar', () => {
  it('renders sidebar correctly and displays tickers', () => {
    render(
      <Sidebar
        tickers={mockTickers}
        selectedTicker={mockTickers[0]}
        onSelect={() => {}}
        onToggleRead={() => {}}
        readStatus={{}}
      />
    );
    
    expect(screen.getByText('Chart Analyzer')).toBeInTheDocument();
    expect(screen.getByText('GOOGL')).toBeInTheDocument();
    expect(screen.getByText('AMZN')).toBeInTheDocument();
  });

  it('filters tickers by search term', async () => {
    render(
      <Sidebar
        tickers={mockTickers}
        selectedTicker={mockTickers[0]}
        onSelect={() => {}}
        onToggleRead={() => {}}
        readStatus={{}}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('銘柄名・コードで検索...');
    fireEvent.change(searchInput, { target: { value: 'Amazon' } });
    
    expect(screen.getByText('AMZN')).toBeInTheDocument();
    
    const { waitFor } = await import('@testing-library/react');
    await waitFor(() => {
      expect(screen.queryByText('GOOGL')).not.toBeInTheDocument();
    });
  });
});
