import React, { useState } from 'react';
import { Search, Info, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ tickers, selectedTicker, onSelect, onToggleRead, readStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickers = tickers.filter(t => 
    t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[320px] h-screen flex flex-col glass border-r bg-[#0d0d0f]" style={{ width: '320px', borderRight: '1px solid #2d2d35' }}>
      {/* Header */}
      <div className="sidebar-header">
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Chart Analyzer
        </h1>
        <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>Shape Checker Suite</p>
      </div>

      {/* Search Bar */}
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

      {/* Ticker List */}
      <div className="ticker-list scrollbar-custom">
        <AnimatePresence mode="popLayout">
          {filteredTickers.map((ticker) => (
            <motion.div
              key={ticker.symbol}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`ticker-item ${selectedTicker?.symbol === ticker.symbol ? 'active' : ''}`}
              onClick={() => onSelect(ticker)}
            >
              <div className="ticker-symbol-badge">
                {ticker.symbol}
              </div>
              
              <div className="flex-1 min-w-0" style={{ overflow: 'hidden' }}>
                <p className="text-sm font-medium truncate" style={{ marginBottom: '2px' }}>{ticker.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#475569' }}>{ticker.market}</span>
                  {!ticker.id && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b' }} />}
                </div>
              </div>

              {/* Read status toggle */}
              <button
                type="button"
                className={`read-toggle ${readStatus[ticker.symbol] ? 'checked' : 'unchecked'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRead(ticker.symbol);
                }}
              >
                {readStatus[ticker.symbol] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats/Footer */}
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
