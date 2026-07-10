import React, { useState, useEffect } from 'react';
import TickerSelector from './components/TickerSelector';
import ChartView from './components/ChartView';
import { tickers } from './data/tickers';

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

  // スプシ保存
  const saveToSpreadsheet = async (ids) => {
    const selectedTickerDetails = tickers.filter(t => selectedIds.includes(t.id)).map(t => ({
      symbol: t.symbol,
      name: t.name
    }));

    const GAS_URL = 'https://script.google.com/macros/s/AKfycbxeHWb_PJw4z3JT7Fit8RYck8-XSrKtTdWuFuBtxZ50jsNvptanau8PQ0RlooJD4kY/exec';

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'cors', // no-cors ではなく cors に変更
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: selectedTickerDetails }),
      });

      if (!response.ok) throw new Error('通信エラー');
      alert('銘柄リストを保存しました！');
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


