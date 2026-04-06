import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, CheckCircle2, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TickerSelector = ({ tickers, selectedTicker, onSelect, onToggleRead, readStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTickers = tickers.filter(t => 
    t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="selector-container" ref={dropdownRef}>
      {/* Trigger Button */}
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

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="selector-dropdown glass"
          >
            {/* Search Area */}
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
                {searchTerm && (
                  <button className="absolute" style={{ right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }} onClick={() => setSearchTerm('')}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="dropdown-list scrollbar-custom">
              {filteredTickers.length > 0 ? (
                filteredTickers.map(ticker => (
                  <div 
                    key={ticker.symbol} 
                    className={`dropdown-item ${selectedTicker?.symbol === ticker.symbol ? 'active' : ''}`}
                    onClick={() => {
                      onSelect(ticker);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="ticker-symbol-badge">{ticker.symbol}</div>
                    <span className="flex-1 truncate">{ticker.name}</span>
                    
                    <button
                      type="button"
                      className={`read-toggle ${readStatus[ticker.symbol] ? 'checked' : 'unchecked'}`}
                      style={{ opacity: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRead(ticker.symbol);
                      }}
                    >
                      {readStatus[ticker.symbol] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                  見つかりませんでした
                </div>
              )}
            </div>

            {/* Footer */}
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
