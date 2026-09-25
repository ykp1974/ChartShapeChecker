import { useState, useEffect } from 'react';
import { tickers } from '../data/tickers';

/**
 * =================================================================
 * 銘柄状態管理カスタムHook (src/hooks/useTickerState.js)
 * =================================================================
 * 
 * 【このカスタムHookの役割】
 * - 現在選択中の銘柄、閲覧済みステータス、選択（チェック）された銘柄IDの管理
 * - LocalStorage（ブラウザのローカル保存領域）とのデータ同期
 * - 銘柄の切り替え（前へ/次へ）や選択・既読切り替えロジックの一括制御
 * 
 * 【学べるReact/JSの主要概念】
 * 1. カスタムHookによるUI（見た目）と状態管理ロジックの分離
 * 2. useState による複数データの保持
 * 3. useEffect による LocalStorage からのデータ復元・保存（副作用制御）
 * 4. イミュータブル（不可変）な状態更新（スプレッド構文、filter、map等）
 * 5. 剰余演算子（%）を活用したリストのループ切り替え
 */
export const useTickerState = () => {
  // -----------------------------------------------------------------
  // 1. 状態（State）の定義
  // -----------------------------------------------------------------
  // 現在選択されている銘柄オブジェクト（初期値: null）  
  const [selectedTicker, setSelectedTicker] = useState(null);
  // 各銘柄の閲覧済み状態を管理するオブジェクト（例: { "1356": true, "1569": false }）
  const [readStatus, setReadStatus] = useState({});
  // ユーザーがチェックボックス等で選択した銘柄IDの配列（例: ['7203', '6758']）
  const [selectedIds, setSelectedIds] = useState([]);
  // -----------------------------------------------------------------
  // 2. 副作用（useEffect）：初回描画時（マウント時）のデータ読み込み
  // -----------------------------------------------------------------
  /**
   * アプリ起動時に LocalStorage から既読ステータスを復元し、
   * 初期の選択銘柄としてリストの先頭（tickers[0]）を設定する
   */
  useEffect(() => {
    const savedStatus = localStorage.getItem('chart_read_status');
    if (savedStatus) {
      try {
        // LocalStorageに保存されたJSON文字列をJavaScriptのオブジェクトに変換
        setReadStatus(JSON.parse(savedStatus));
      } catch (e) {
        console.error("Failed to load read status", e);
      }
    }

    // 銘柄リストが存在する場合、初期値として最初の銘柄を選択状態にする
    if (tickers.length > 0) {
      setSelectedTicker(tickers[0]);
    }
  }, []);

  /**
   * アプリ起動時に LocalStorage から選択済み銘柄ID（selected_ticker_ids）を復元する
   */
  useEffect(() => {
    const saved = localStorage.getItem('selected_ticker_ids');
    if (saved) {
      try {
        setSelectedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load selected ticker ids", e);
      }
    }
  }, []);
  // -----------------------------------------------------------------
  // 3. 副作用（useEffect）：状態変更時の自動書き込み（永続化）
  // -----------------------------------------------------------------
  /**
   * selectedIds（選択中のIDリスト）が更新されるたびに LocalStorage に自動保存する
   */
  useEffect(() => {
    localStorage.setItem('selected_ticker_ids', JSON.stringify(selectedIds));
  }, [selectedIds]);
  // -----------------------------------------------------------------
  // 4. 状態更新ハンドラー（ロジック関数）
  // -----------------------------------------------------------------
  /**
   * 銘柄IDのトグル（選択/解除）処理
   * @param {string|number} id - 対象の銘柄ID
   */
  const toggleTicker = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };
  /**
   * 既読/未読ステータスの切り替え処理
   * @param {string} symbol - 銘柄シンボル/コード
   */
  const handleToggleRead = (symbol) => {
    // スプレッド構文で既存のオブジェクトをコピーし、対象キーの値だけ反転させる
    const newStatus = { ...readStatus, [symbol]: !readStatus[symbol] };
    setReadStatus(newStatus);
    // 即座に LocalStorage へ同期保存
    localStorage.setItem('chart_read_status', JSON.stringify(newStatus));
  };
  /**
   * 前の銘柄へ移動する
   */
  const handlePrev = () => {
    setSelectedTicker(prevTicker => {
      if (tickers.length === 0) return prevTicker;
      // 現在選択されている銘柄のインデックス（順番）を取得
      const currentIndex = tickers.findIndex(t => t.symbol === prevTicker?.symbol);
      if (currentIndex === -1) return tickers[0];
      // 剰余演算子（%）を使った循環インデックス計算で、配列の最初に戻る
      const prevIndex = (currentIndex - 1 + tickers.length) % tickers.length;
      return tickers[prevIndex];
    });
  };
  /**
   * 次の銘柄へ移動する
   */
  const handleNext = () => {
    setSelectedTicker(prevTicker => {
      if (tickers.length === 0) return prevTicker;
      const currentIndex = tickers.findIndex(t => t.symbol === prevTicker?.symbol);
      if (currentIndex === -1) return tickers[0];
      // 剰余演算子（%）を使った循環インデックス計算で、配列の最後から最初へ移動
      const nextIndex = (currentIndex + 1) % tickers.length;
      return tickers[nextIndex];
    });
  };
  /**
   * 選択状態をリセットする（すべて選択解除）
   */
  const handleResetSelection = () => {
    setSelectedIds([]);
  };
  // -----------------------------------------------------------------
  // 5. 外部インターフェース（コンポーネントへの返却値）
  // -----------------------------------------------------------------
  return {
    selectedTicker,
    setSelectedTicker,
    readStatus,
    selectedIds,
    setSelectedIds, // State更新関数を直接返却
    toggleTicker,
    handleToggleRead,
    handlePrev,
    handleNext,
    handleResetSelection
  };
};
