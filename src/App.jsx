import React, { useEffect } from 'react';
import TickerSelector from './components/TickerSelector';
import ChartView from './components/ChartView';
import { tickers } from './data/tickers';
import { syncTickersToSpreadsheet } from './services/gasApi';
import { useTickerState } from './hooks/useTickerState';
/**
 * =================================================================
 * ルート（最上位）コンポーネント (src/App.jsx)
 * =================================================================
 * 
 * 【このコンポーネントの役割】
 * アプリ全体のオーケストレーター（指揮者）です。
 * カスタムHook（useTickerState）による状態管理、子コンポーネント（TickerSelector, ChartView）、
 * 外部API通信（gasApi）、およびキーボード操作（ショートカット）を1つに統合します。
 * 
 * 【学べるReact/フロントエンドの主要概念】
 * 1. カスタムHookを用いた状態・ロジックの集約（関心の分離）
 * 2. 単方向データフロー（親から子コンポーネントへの Props 配給）
 * 3. キーボードイベント（keydown）の監視と、入力中の誤動作を防ぐガード判定
 * 4. 配列操作（filter / map）および正規表現を用いたデータ整形と API 通信
 */
function App() {
  // -----------------------------------------------------------------
  // 1. カスタムHookからの状態・操作関数の受容
  // -----------------------------------------------------------------
  // 複雑な状態管理や LocalStorage 処理はすべて useTickerState に委ね、
  // App.jsx では必要な値と更新関数だけをシンプルに受け取り利用します。
  const {
    selectedTicker,
    setSelectedTicker,
    readStatus,
    selectedIds,
    toggleTicker,
    handleToggleRead,
    handlePrev,
    handleNext,
    handleResetSelection
  } = useTickerState();

  // -----------------------------------------------------------------
  // 2. スプレッドシート同期処理 (データ整形 & API通信)
  // -----------------------------------------------------------------
  /**
   * 選択（チェック）された銘柄の情報を抽出し、GAS（Google Apps Script）へ送信する
   * @param {Array} ids - 選択された銘柄IDの配列
   */
  const saveToSpreadsheet = async (ids) => {
    // 選択されているIDをもとに、対象の銘柄データを抽出し、送信形式へと変換（整形）
    const selectedTickerDetails = tickers
      .filter(t => selectedIds.includes(t.id))// 選択された銘柄のみに絞り込み
      .map(t => {
        // [si]7545_T_西松屋チェーン_chart.png
        // [xxx] 部分を除去した文字列を取得
        const cleanName = t.symbol.replace(/^\[.*?\]/, '');

        // _ で分割して、先頭の4桁数字を取り出す
        const parts = cleanName.split('_');
        const ticker = parts[0]; // 分割した配列の1番目が必ず4桁数字になるはず

        // name（銘柄名）がうまく抽出できない場合も考慮
        const name = t.name;
        // API通信に必要な構造オブジェクトとして返却
        return {
          symbol: t.symbol, // A列: [si]7545_T_西松屋チェーン_chart.png
          name: name,       // B列: 西松屋チェーン
          ticker: ticker    // C列: 7545
        };
      });

    try {
      // 外部サービスモジュール（gasApi.js）を介して通信を実行
      await syncTickersToSpreadsheet(selectedTickerDetails);
      alert('スプレッドシートに同期しました！');
    } catch (error) {
      console.error('保存失敗:', error);
    }
  };

  // -----------------------------------------------------------------
  // 3. 副作用（useEffect）：キーボードショートカット制御
  // -----------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 【バグ防止のガード判定】
      // ユーザーが検索窓（<input>等）に入力中の場合は、矢印キーによる銘柄切替を無効化する
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      // 「←」キーで前の銘柄へ、「→」キーで次の銘柄へ切り替え
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    // グローバルなキーダウンイベントを登録
    window.addEventListener('keydown', handleKeyDown);
    // 【クリーンアップ】イベントリスナーを解除
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);// 依存配列: 最新のハンドラー関数を参照
  // -----------------------------------------------------------------
  // 4. JSX によるレイアウトの組み立て（コンポーネントの統合）
  // -----------------------------------------------------------------
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-slate-100 selection:bg-blue-500/30">
      {/* 
        --------------------------------------------------------------
        ヘッダーナビゲーションバーエリア
        --------------------------------------------------------------
      */}
      <header className="app-header">]
        {/* 全選択解除リセットボタン */}
        <button
          onClick={handleResetSelection}
          className="mr-2 px-3 py-1.5 text-xs font-medium bg-[#16161a] border border-[#2d2d35] rounded-lg text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-all"
          title="全てのチェックを解除"
        >
          リセット
        </button>
        {/* 
          銘柄選択ドロップダウンコンポーネント 
          親(App)から必要な State と操作関数を Props として配給します。
        */}
        <TickerSelector
          tickers={tickers}
          selectedTicker={selectedTicker}
          onSelect={setSelectedTicker}
          onToggleRead={handleToggleRead}
          readStatus={readStatus}
        />
        {/* 外部ログツールへの直リンク */}
        <a
          href="https://decisionlogger.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="ml-4 px-3 py-1.5 text-xs font-medium bg-[#16161a] border border-[#2d2d35] rounded-lg text-slate-300 hover:text-white hover:border-blue-500/50 transition-all"
        >
          ログ
        </a>
      </header>

      {/* 
        --------------------------------------------------------------
        メインチャート表示エリア (ChartView)
        --------------------------------------------------------------
      */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#050507]">
        <ChartView
          ticker={selectedTicker}
          selectedIds={selectedIds}
          onToggleTicker={toggleTicker}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </main>
      {/* 
        --------------------------------------------------------------
        スプレッドシート同期アクションボタン
        --------------------------------------------------------------
      */}
      <button onClick={() => saveToSpreadsheet(selectedIds)} className="bg-green-600 p-2 rounded">
        スプレッドシートへ同期
      </button>
    </div>

  );
}

export default App;


