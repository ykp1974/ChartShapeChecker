import React, { useState, useEffect } from 'react';
import TickerSelector from './components/TickerSelector';
import ChartView from './components/ChartView';
import { tickers } from './data/tickers';
import { syncTickersToSpreadsheet } from './services/gasApi';

function App() {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [readStatus, setReadStatus] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // 2. 切り替え関数
  const toggleTicker = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Load read status from local storage
  useEffect(() => {
    const savedStatus = localStorage.getItem('chart_read_status');
    if (savedStatus) {
      try {
        setReadStatus(JSON.parse(savedStatus));
      } catch (e) {
        console.error("Failed to load read status", e);
      }
    }

    // Select first ticker by default
    if (tickers.length > 0) {
      setSelectedTicker(tickers[0]);
    }
  }, []);

  const handleToggleRead = (symbol) => {
    const newStatus = { ...readStatus, [symbol]: !readStatus[symbol] };
    setReadStatus(newStatus);
    localStorage.setItem('chart_read_status', JSON.stringify(newStatus));
  };

  const handlePrev = () => {
    setSelectedTicker(prevTicker => {
      if (tickers.length === 0) return prevTicker;
      const currentIndex = tickers.findIndex(t => t.symbol === prevTicker?.symbol);
      if (currentIndex === -1) return tickers[0];
      const prevIndex = (currentIndex - 1 + tickers.length) % tickers.length;
      return tickers[prevIndex];
    });
  };

  const handleNext = () => {
    setSelectedTicker(prevTicker => {
      if (tickers.length === 0) return prevTicker;
      const currentIndex = tickers.findIndex(t => t.symbol === prevTicker?.symbol);
      if (currentIndex === -1) return tickers[0];
      const nextIndex = (currentIndex + 1) % tickers.length;
      return tickers[nextIndex];
    });
  };

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

  // 選択リセット関数 
  const handleResetSelection = () => {
    setSelectedIds([]);
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
  }, []);

  // LocalStorageからselected_ticker_idsを読み込む
  useEffect(() => {
    const saved = localStorage.getItem('selected_ticker_ids');
    if (saved) setSelectedIds(JSON.parse(saved));
  }, []);

  // LocalStorageにselected_ticker_idsを保存する
  useEffect(() => {
    localStorage.setItem('selected_ticker_ids', JSON.stringify(selectedIds));
  }, [selectedIds]);

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


