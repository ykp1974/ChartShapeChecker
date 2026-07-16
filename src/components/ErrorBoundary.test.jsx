import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const Bomb = () => {
  throw new Error('Test Error');
};

const SafeComponent = () => <div>Safe</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // コンソールエラーを出力しないようにモック化する
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });

  it('renders fallback UI when a child component throws an error', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText('画面を更新する')).toBeInTheDocument();
  });
});
