import React, { useState } from 'react';
import { Search, Info, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
/**
 * =================================================================
 * サイドバーナビゲーションコンポーネント (Sidebar.jsx)
 * =================================================================
 * 
 * 【このコンポーネントの役割】
 * 画面左側に常時表示され、銘柄一覧の閲覧、検索、選択、および
 * 確認済み（既読）ステータスの切り替えを行うナビゲーションUIです。
 * 
 * 【学べるReact/JSの主要概念】
 * 1. 制御されたコンポーネント (Controlled Component) による入力フォーム管理
 * 2. オプショナルチェイニング (?.) を用いた安全な条件判定とアクティブ表示
 * 3. framer-motion の `layout` 属性を用いた要素位置変化の全自動スムーズアニメーション
 * 4. e.stopPropagation() によるイベントバブリング（伝播）の停止
 */

/**
 * @param {Object} props
 * @param {Array} props.tickers - 表示対象の全銘柄リスト
 * @param {Object} props.selectedTicker - 現在メインエリアで選択・表示中の銘柄
 * @param {Function} props.onSelect - 銘柄が選択された際に呼び出す親の関数
 * @param {Function} props.onToggleRead - 既読ステータスを切り替える際に呼び出す親の関数
 * @param {Object} props.readStatus - 各銘柄の既読フラグマップ ({ '7203': true })
 */
const Sidebar = ({ tickers, selectedTicker, onSelect, onToggleRead, readStatus }) => {
  // -----------------------------------------------------------------
  // 1. 状態（State）の定義
  // -----------------------------------------------------------------
  // 検索窓に入力されたキーワード文字列
  const [searchTerm, setSearchTerm] = useState('');
  // -----------------------------------------------------------------
  // 2. リアルタイム検索フィルタリング
  // -----------------------------------------------------------------
  // ユーザーの入力（searchTerm）に応じて、銘柄コードまたは銘柄名に一致するものを抽出
  const filteredTickers = tickers.filter(t =>
    t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // -----------------------------------------------------------------
  // 3. JSX による画面の描画
  // -----------------------------------------------------------------
  return (
    <div className="w-[320px] h-screen flex flex-col glass border-r bg-[#0d0d0f]" style={{ width: '320px', borderRight: '1px solid #2d2d35' }}>
      {/* アプリヘッダータイトル */}
      <div className="sidebar-header">
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Chart Analyzer
        </h1>
        <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>Shape Checker Suite</p>
      </div>

      {/* 
        --------------------------------------------------------------
        検索バーエリア (Controlled Component / 制御されたコンポーネント)
        --------------------------------------------------------------
        value に State（searchTerm）をバインドし、onChange で State を更新します。
        Reactが常にフォームの値を完全に管理・制御する王道のパターンです。
      */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="absolute" style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748b' }} />
          <input
            type="text"
            placeholder="銘柄名・コードで検索..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 
        --------------------------------------------------------------
        銘柄リストエリア (AnimatePresence + motion.div)
        --------------------------------------------------------------
      */}
      <div className="ticker-list scrollbar-custom">
        {/* mode="popLayout" により、要素が削除された際のレイアウトの崩れを防ぎます */}
        <AnimatePresence mode="popLayout">
          {filteredTickers.map((ticker) => (
            <motion.div
              key={ticker.symbol}
              // 【重要】layout 属性: 検索などで並び順や表示件数が変化した際、位置移動を自動でスムーズに演出
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              /* 
                オプショナルチェイニング (?.) を使用して selectedTicker が null の場合のエラーを防止。
                選択中の銘柄とリストの銘柄が一致した場合は 'active' クラスを付与してハイライトします。
              */
              className={`ticker-item ${selectedTicker?.symbol === ticker.symbol ? 'active' : ''}`}
              // 行全体をクリックしたときに親コンポーネントへ選択通知
              onClick={() => onSelect(ticker)}
            >
              {/* 銘柄コードバッジ */}
              <div className="ticker-symbol-badge">
                {ticker.symbol}
              </div>

              {/* 銘柄名・市場情報 */}
              <div className="flex-1 min-w-0" style={{ overflow: 'hidden' }}>
                <p className="text-sm font-medium truncate" style={{ marginBottom: '2px' }}>{ticker.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#475569' }}>{ticker.market}</span>
                  {!ticker.id && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b' }} />}
                </div>
              </div>

              {/* 
                確認済み（既読）トグルボタン
                ボタンクリック時に行全体の onClick (銘柄選択) が発火しないよう、
                e.stopPropagation() でイベントの伝播（バブリング）を停止させています。
              */}
              <button
                type="button"
                className={`read-toggle ${readStatus[ticker.symbol] ? 'checked' : 'unchecked'}`}
                onClick={(e) => {
                  e.stopPropagation(); // 親要素（div.ticker-item）の onClick 発火をストップ
                  onToggleRead(ticker.symbol);
                }}
              >
                {readStatus[ticker.symbol] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* フッターエリア（該当件数・バージョン情報） */}
      <div style={{ padding: '1rem', borderTop: '1px solid #2d2d35', background: '#0a0a0c' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#475569' }}>
          <span>{filteredTickers.length} 銘柄対象</span>
          <span style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>V1.0.1</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
