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

  // スプシ保存->DecisionLoggerGAS
  const saveToSpreadsheet = async (ids) => {
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbwhlZbrfwxRe3jhHTz1vI8I4Vj__9nauHZtOlqImwcMQwobgVfj_fXCUqblhn7aRAT7/exec';

    const selectedTickerDetails = tickers
      .filter(t => selectedIds.includes(t.id))
      .map(t => {
        // 1. 識別文字のみ抽出 (例: [si]7545... -> [si])
        const symbolMatch = t.symbol.match(/^\[.*?\]/);
        const symbolOnly = symbolMatch ? symbolMatch[0] : "";

        // 2. 識別文字の直後にある4桁の数字を確実に抜き出す
        // 正規表現: \](\d{4}) -> 記号 ] の直後の4桁の数字(\d{4})をキャプチャする
        const tickerMatch = t.symbol.match(/\](\d{4})/);
        const ticker = tickerMatch ? tickerMatch[1] : "";

        return {
          symbol: t.symbol, // A列: [si]7545_T_西松屋チェーン_chart.png
          name: name,       // B列: 西松屋チェーン
          ticker: ticker    // C列: 7545
        };
      });

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickers: selectedTickerDetails,
          source: 'ChartShapeChecker'
        }),
      });
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


