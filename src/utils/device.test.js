import { isPcDevice } from './device';

const setNavigator = ({ userAgent, maxTouchPoints = 0 }) => {
  Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true });
  Object.defineProperty(window.navigator, 'maxTouchPoints', { value: maxTouchPoints, configurable: true });
};

describe('isPcDevice', () => {
  const originalUA = window.navigator.userAgent;

  afterEach(() => {
    Object.defineProperty(window.navigator, 'userAgent', { value: originalUA, configurable: true });
  });

  it('Windows の PC は true を返す', () => {
    setNavigator({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36' });
    expect(isPcDevice()).toBe(true);
  });

  it('Mac（タッチなし）の PC は true を返す', () => {
    setNavigator({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15', maxTouchPoints: 0 });
    expect(isPcDevice()).toBe(true);
  });

  it('Android スマホは false を返す', () => {
    setNavigator({ userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36', maxTouchPoints: 5 });
    expect(isPcDevice()).toBe(false);
  });

  it('iPhone は false を返す', () => {
    setNavigator({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1', maxTouchPoints: 5 });
    expect(isPcDevice()).toBe(false);
  });

  it('iPadOS（Mac を名乗るタッチ端末）は false を返す', () => {
    setNavigator({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15', maxTouchPoints: 5 });
    expect(isPcDevice()).toBe(false);
  });
});
