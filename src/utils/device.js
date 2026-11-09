/**
 * =================================================================
 * デバイス判定ユーティリティ (src/utils/device.js)
 * =================================================================
 *
 * 【このモジュールの役割】
 * アプリを表示しているデバイスが PC かどうかを判定します。
 * PC の場合のみ、チャートの初期表示を OFF にする仕様で利用します。
 *
 * 【判定方法】
 * - User-Agent に スマホ / タブレット を示す文字列が含まれていなければ PC とみなす
 * - iPadOS は既定で Mac を名乗るため、Macintosh かつタッチ点数が 2 以上なら タブレット扱い
 * - navigator が使えない環境では PC とみなさない（従来どおりチャートを表示する安全側の挙動）
 */

const MOBILE_UA_PATTERN = /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle/i;

/**
 * 現在のデバイスが PC かどうかを返す
 * @returns {boolean} PC の場合 true、スマホ・タブレット等の場合 false
 */
export const isPcDevice = () => {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || '';
  if (MOBILE_UA_PATTERN.test(ua)) return false;

  // iPadOS（デスクトップ表示モード）は Macintosh を名乗るが、タッチ操作可能な点で区別する
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return false;

  return true;
};
