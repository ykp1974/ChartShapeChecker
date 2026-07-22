import React, { useEffect } from 'react';
import TickerSelector from './components/TickerSelector';
import ChartView from './components/ChartView';
import { tickers } from './data/tickers';
import { syncTickersToSpreadsheet } from './services/gasApi';
import { useTickerState } from './hooks/useTickerState';

function App() {
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

  // スプシ保存->DecisionLoggerGAS
  const saveToSpreadsheet = async (ids) => {
    const selectedTickerDetails = tickers
      .filter(t => selectedIds.includes(t.id))
      .map(t => {
        // [si]7545_T_西松屋チェーン_chart.png
        // [xxx] 部分を除去した文字列を取得
        const cleanName = t.symbol.replace(/^\[.*?\]/, '');

        // _ で分割して、先頭の4桁数字を取り出す
        const parts = cleanName.split('_');
        const ticker = parts[0]; // 分割した配列の1番目が必ず4桁数字になるはず

        // name（銘柄名）がうまく抽出できない場合も考慮
        const name = t.name;

        return {
          symbol: t.symbol, // A列: [si]7545_T_西松屋チェーン_chart.png
          name: name,       // B列: 西松屋チェーン
          ticker: ticker    // C列: 7545
        };
      });

    try {
      await syncTickersToSpreadsheet(selectedTickerDetails);
      alert('スプレッドシートに同期しました！');
    } catch (error) {
      console.error('保存失敗:', error);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-slate-100 selection:bg-blue-500/30">
      {/* Navbar with Ticker Selector */}
      <header className="app-header">
        <button
          onClick={handleResetSelection}
          className="mr-2 px-3 py-1.5 text-xs font-medium bg-[#16161a] border border-[#2d2d35] rounded-lg text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-all"
          title="全てのチェックを解除"
        >
          リセット
        </button>
        <TickerSelector
          tickers={tickers}
          selectedTicker={selectedTicker}
          onSelect={setSelectedTicker}
          onToggleRead={handleToggleRead}
          readStatus={readStatus}
        />
        {/* リンクを追加 */}
        <a
          href="https://decisionlogger.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="ml-4 px-3 py-1.5 text-xs font-medium bg-[#16161a] border border-[#2d2d35] rounded-lg text-slate-300 hover:text-white hover:border-blue-500/50 transition-all"
        >
          ログ
        </a>
      </header>

      {/* Main Chart Area */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#050507]">
        <ChartView
          ticker={selectedTicker}
          selectedIds={selectedIds}
          onToggleTicker={toggleTicker}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </main>

      <button onClick={() => saveToSpreadsheet(selectedIds)} className="bg-green-600 p-2 rounded">
        スプレッドシートへ同期
      </button>
    </div>

  );
}

export default App;


