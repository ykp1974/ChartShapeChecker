import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 各テストの後にDOMをクリーンアップする
afterEach(() => {
  cleanup();
});

// jsdom環境にはResizeObserverが存在しないためモック化する
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
