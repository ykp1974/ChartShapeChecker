import { useState, useEffect } from 'react';
import { tickers } from '../data/tickers';

/**
 * Custom hook to manage selected ticker, read status, and selected ticker IDs,
 * including synchronization with LocalStorage.
 */
export const useTickerState = () => {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [readStatus, setReadStatus] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // Load read status from local storage on mount
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

  // Load selected_ticker_ids from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selected_ticker_ids');
    if (saved) {
      try {
        setSelectedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load selected ticker ids", e);
      }
    }
  }, []);

  // Save selected_ticker_ids to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem('selected_ticker_ids', JSON.stringify(selectedIds));
  }, [selectedIds]);

  const toggleTicker = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

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

  const handleResetSelection = () => {
    setSelectedIds([]);
  };

  return {
    selectedTicker,
    setSelectedTicker,
    readStatus,
    selectedIds,
    toggleTicker,
    handleToggleRead,
    handlePrev,
    handleNext,
    handleResetSelection
  };
};
