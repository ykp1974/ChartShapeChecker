import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
