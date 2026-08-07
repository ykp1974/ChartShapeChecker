import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, CheckCircle2, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
/**
 * =================================================================
 * 銘柄選択ドロップダウンコンポーネント (TickerSelector.jsx)
 * =================================================================
 * 
 * 【このコンポーネントの役割】
 * 銘柄の選択、リアルタイム検索、確認済み（既読）チェック機能を持つ
 * インタラクティブなカスタムドロップダウンメニューを提供します。
 * 
 * 【学べるReact/JSの主要概念】
 * 1. useRef と DOM イベントによる「ドロップダウン外側クリックの検知・自動クローズ」
 * 2. 入力文字（State）に応じた「リアルタイムフィルタリング（filter/normalize）」
 * 3. e.stopPropagation() による「イベントバブリング（親へのイベント伝播）の停止」
 * 4. コールバック関数（onSelect, onToggleRead）を通じた「親コンポーネントへのデータ通知」
 * 5. framer-motion（AnimatePresence）を活用した「アニメーション付き条件描画」
 */
/**
 * テキスト正規化ヘルパー関数
 * 全角半角の統一（NFKC）と小文字化を行い、検索の表記揺れ（「ﾄﾖﾀ」と「トヨタ」、「TOYOTA」と「toyota」等）を吸収します。
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text.normalize('NFKC').toLowerCase();
};
/**
 * @param {Object} props
 * @param {Array} props.tickers - 選択肢となる全銘柄の配列
 * @param {Object} props.selectedTicker - 現在選択されている銘柄オブジェクト
 * @param {Function} props.onSelect - 銘柄が選択された時に呼び出す関数
 * @param {Function} props.onToggleRead - 既読ステータスを切り替える時に呼び出す関数
 * @param {Object} props.readStatus - 各銘柄の既読状態マップ ({ '7203': true })
 */
const TickerSelector = ({ tickers, selectedTicker, onSelect, onToggleRead, readStatus }) => {
  // -----------------------------------------------------------------
  // 1. 状態（State）と参照（Ref）の定義
  // -----------------------------------------------------------------
  // ドロップダウンメニューが開いているかどうかのフラグ  
  const [isOpen, setIsOpen] = useState(false);
  // 検索ボックスに入力されているテキスト（リアルタイム検索用）
  const [searchTerm, setSearchTerm] = useState('');
  // ドロップダウン要素自体への参照（ useRef ）
  const dropdownRef = useRef(null);
  /**
   * 外側クリック検知用 Effect
   * レンダリング完了後に発火し、ドキュメント全体にクリックイベントリスナーを設定します。
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // クリックされた要素（event.target）が dropdownRef の内側に含まれていない場合は閉じる
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    // グローバルな mousepoint イベントをリスニング
    document.addEventListener('mousedown', handleClickOutside);
    // 【クリーンアップ】コンポーネント消滅時にリスナーを解除してメモリリークを防ぐ
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // -----------------------------------------------------------------
  // 3. リアルタイムフィルタリングロジック
  // -----------------------------------------------------------------
  // searchTerm（入力値）が変更されるたび、レンダリング時に動的に絞り込み結果を計算
  const filteredTickers = tickers.filter(ticker => {
    const query = normalizeText(searchTerm);
    const name = normalizeText(ticker.name);
    const symbol = normalizeText(ticker.symbol);
    // 銘柄名またはシンボルのいずれかに検索語句が含まれていれば保持
    return name.includes(query) || symbol.includes(query);
  });
  // -----------------------------------------------------------------
  // 4. JSX によるUIの描画
  // -----------------------------------------------------------------
  return (
    <div className="selector-container" ref={dropdownRef}>
      {/* Trigger Button（ドロップダウンの開閉を行う見た目の部分 */}
      <button
        className={`selector-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="ticker-symbol-badge">{selectedTicker?.symbol || '----'}</div>
          <span className="truncate font-medium">{selectedTicker?.name || '銘柄を選択'}</span>
        </div>
        <ChevronDown size={20} className={`trigger-chevron ${isOpen ? 'rotated' : ''}`} />
      </button>

      {/* 
        --------------------------------------------------------------
        ドロップダウンメニュー（条件付き描画 + アニメーション）
        AnimatePresence を使うことで、メニューが消去される際のアニメーションを可能にします。
        --------------------------------------------------------------
      */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="selector-dropdown glass"
          >
            {/* 検索入力エリア */}
            <div className="dropdown-search">
              <div className="search-input-wrapper">
                <Search className="absolute" style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748b' }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="検索..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* 検索テキストがある場合のクリア（X）ボタン */}
                {searchTerm && (
                  <button className="absolute" style={{ right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }} onClick={() => setSearchTerm('')}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* 銘柄リスト表示エリア */}
            <div className="dropdown-list scrollbar-custom">
              {filteredTickers.length > 0 ? (
                filteredTickers.map(ticker => (
                  <div
                    key={ticker.symbol}
                    className={`dropdown-item ${selectedTicker?.symbol === ticker.symbol ? 'active' : ''}`}
                    onClick={() => {
                      onSelect(ticker);// 1. 親コンポーネントへ「この銘柄が選ばれた」ことを通知
                      setIsOpen(false);// 2. ドロップダウンを閉じる
                      setSearchTerm('');// 3. 検索語句をリセット（クリア）
                    }}
                  >
                    <div className="ticker-symbol-badge">{ticker.symbol}</div>
                    <span className="flex-1 truncate">{ticker.name}</span>
                    {/* 既読/未読切り替えボタン */}
                    <button
                      type="button"
                      className={`read-toggle ${readStatus[ticker.symbol] ? 'checked' : 'unchecked'}`}
                      style={{ opacity: 1 }}
                      onClick={(e) => {
                        // 【重要】親要素（div.dropdown-item）への onClick（銘柄選択）イベント発火をブロック
                        e.stopPropagation();
                        // 既読/未読の切り替えを実行
                        onToggleRead(ticker.symbol);
                      }}
                    >
                      {readStatus[ticker.symbol] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>
                  </div>
                ))
              ) : (
                /* 検索結果がゼロの場合のフォールバック表示 */
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                  見つかりませんでした
                </div>
              )}
            </div>

            {/* ドロップダウンフッター（該当件数の表示） */}
            <div className="dropdown-footer">
              <span>{filteredTickers.length} 銘柄対象</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TickerSelector;
