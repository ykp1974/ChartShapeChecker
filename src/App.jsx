import React, { useState, useEffect } from 'react';
import TickerSelector from './components/TickerSelector';
import ChartView from './components/ChartView';
import { tickers } from './data/tickers';

function App() {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [readStatus, setReadStatus] = useState({});

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
      </header>
      
      {/* Main Chart Area */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#050507]">
        <ChartView ticker={selectedTicker} />
      </main>
    </div>
  );
}

export default App;


