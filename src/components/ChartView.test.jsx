import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChartView from './ChartView';

describe('ChartView', () => {
  it('renders message when no ticker is selected', () => {
    render(
      <ChartView
        ticker={null}
        onPrev={() => {}}
        onNext={() => {}}
        selectedIds={[]}
        onToggleTicker={() => {}}
      />
    );
    expect(screen.getByText('銘柄を選択してチャートを表示します。')).toBeInTheDocument();
  });

  it('renders missing ID warning when ticker has no id', () => {
    const tickerNoId = { symbol: 'TEST', name: 'Test Name', market: 'TSE' };
    render(
      <ChartView
        ticker={tickerNoId}
        onPrev={() => {}}
        onNext={() => {}}
        selectedIds={[]}
        onToggleTicker={() => {}}
      />
    );
    expect(screen.getByText('ID 未設定')).toBeInTheDocument();
  });

  it('renders image and handles Toast display', async () => {
    const tickerWithId = { symbol: 'TEST', name: 'Test Name', market: 'TSE', id: 'fake-id' };
    render(
      <ChartView
        ticker={tickerWithId}
        onPrev={() => {}}
        onNext={() => {}}
        selectedIds={[]}
        onToggleTicker={() => {}}
      />
    );
    
    // Check if the image starts rendering with the correct src containing the id
    const img = document.querySelector('img');
    expect(img.src).toContain('fake-id');

    // Check Toast
    const patternBtn = screen.getByText('パターン表示');
    fireEvent.click(patternBtn);

    // Toast content check
    expect(screen.getByText(/\[kh\]急落後の反騰/)).toBeInTheDocument();
  });
});
