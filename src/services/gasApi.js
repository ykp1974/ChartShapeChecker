import { GAS_URL } from '../config/constants';
/**
 * =================================================================
 * Google Apps Script (GAS) 連携 API モジュール (src/services/gasApi.js)
 * =================================================================
 * 
 * 【このモジュールの役割】
 * 選択された銘柄データを外部サービスである Google Apps Script (GAS) へ送信し、
 * Google スプレッドシートに非同期で記録・同期するための通信処理を担当します。
 * 
 * 【学べるReact/フロントエンドの主要概念】
 * 1. サービス層 (Services) による API 通信処理の独立と関心の分離
 * 2. 防御的プログラミング（引数の型・配列チェックによる事前エラー防護）
 * 3. fetch API と async / await を用いた非同期 HTTP 通信 (POST)
 * 4. JSON.stringify によるデータのテキスト化と mode: 'no-cors' による CORS 回避
 */

/**
 * 選択された銘柄の詳細情報を GAS 経由で Google スプレッドシートへ送信・保存する関数
 * 
 * @param {Array<{symbol: string, name: string, ticker: string}>} tickerDetails - 保存対象の銘柄情報オブジェクトの配列
 * @returns {Promise<Response>} 通信レスポンスの Promise オブジェクト
 */
export const syncTickersToSpreadsheet = async (tickerDetails) => {
  // -----------------------------------------------------------------
  // 1. バリデーション（入力データの検証 / 防御的プログラミング）
  // -----------------------------------------------------------------
  // 受け取った引数が配列（Array）でない場合は、通信を発行する前に
  // 明確な例外（Error）をスローして想定外の不具合や無駄な通信を防ぎます。
  if (!Array.isArray(tickerDetails)) {
    throw new Error('Invalid argument: tickerDetails must be an array');
  }
  // -----------------------------------------------------------------
  // 2. 非同期 HTTP 通信処理 (fetch API + POST メソッド)
  // -----------------------------------------------------------------
  // await を使用することで、ネットワーク通信の完了を非同期で待ち受けます。
  const response = await fetch(GAS_URL, {
    method: 'POST',// サーバーへのデータ書き込み・送信を意味する HTTP メソッド
    // 【GAS連携のポイント】
    // Google Apps Script (GAS) を Web API として呼び出す際、ブラウザの CORS (Cross-Origin Resource Sharing) 
    // 制約によるエラーを回避するために 'no-cors' モードを指定します。
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    // JavaScript のオブジェクト/配列をネットワーク送信可能な JSON 形式の文字列へ変換
    body: JSON.stringify({
      tickers: tickerDetails,
      source: 'ChartShapeChecker'// データ送信元アプリの識別子
    }),
  });

  return response;
};
