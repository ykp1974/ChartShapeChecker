import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, Share2, ZoomIn, ImageOff, Maximize2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ChartView = ({ ticker, onPrev, onNext, selectedIds, onToggleTicker }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (ticker?.id) {
      setLoading(true);
      setError(false);
      setRetryCount(0);
    } else {
      setLoading(false);
      setError(!ticker);
    }
  }, [ticker]);

  const getImageUrl = (id, retry) => {
    if (retry === 1) return `https://lh3.googleusercontent.com/u/0/d/${id}`;
    return `https://drive.google.com/thumbnail?id=${id}&sz=w2500`;
  };

  const getExternalUrl = (id) => `https://drive.google.com/file/d/${id}/view`;

  if (!ticker) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050507]">
        <div style={{ textAlign: 'center', opacity: 0.3 }}>
          <ZoomIn className="w-12 h-12 mb-4 mx-auto" />
          <p className="text-sm">銘柄を選択してチャートを表示します。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050507]">
      {/* View Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#2d2d35]/30">
        {/* チェックボックスを追加 */}
        <input
          type="checkbox"
          checked={selectedIds.includes(ticker.id)} // 親から受け取った状態
          onChange={() => onToggleTicker(ticker.id)} // 親から受け取った関数
          className="w-5 h-5 rounded border-slate-600 bg-transparent text-blue-500 focus:ring-blue-500"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-blue-400 font-mono">{ticker.symbol}</span>
            <span className="truncate">{ticker.name}</span>
          </h2>
          <p className="text-[10px] text-slate-500 uppercase truncate">
            {ticker.market} | {ticker.filename}
          </p>
        </div>

        <div className="flex gap-2 ml-4">
          {ticker.id && (
            <a
              href={getExternalUrl(ticker.id)}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-[#16161a] border border-[#2d2d35] text-slate-300 hover:text-white"
              title="Open in Drive"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Image Display Area with Zoom-Pan-Pinch */}
      <div className="flex-1 relative overflow-hidden bg-[#000] group">
        {/* Navigation Buttons */}
        {ticker.id && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-slate-900/40 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/30 hover:border-slate-500/50 hover:scale-105 active:scale-95 transition-all shadow-lg backdrop-blur-md md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center cursor-pointer"
              title="前の画像へ (←)"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-slate-900/40 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/30 hover:border-slate-500/50 hover:scale-105 active:scale-95 transition-all shadow-lg backdrop-blur-md md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center cursor-pointer"
              title="次の画像へ (→)"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <AnimatePresence mode="wait">
          {!ticker.id ? (
            <motion.div
              key="missing-id"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center p-8 text-center"
            >
              <div className="max-w-xs space-y-4">
                <AlertCircle className="text-amber-500 w-10 h-10 mx-auto" />
                <h3 className="text-amber-200 font-bold">ID 未設定</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  このチャートを表示するにはGoogle DriveのファイルIDが必要です。
                </p>
              </div>
            </motion.div>
          ) : (
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={8}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
              doubleTap={{ step: 0.5 }}
              pinch={{ step: 5 }}
            >
              {({ zoomIn, zoomOut, resetTransform, instance }) => (
                <>
                  {/* Floating Controls */}
                  <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
                    {instance?.transformState?.scale > 1 && (
                      <button
                        onClick={() => resetTransform()}
                        className="p-3 rounded-full bg-blue-500 text-white shadow-lg animate-fade-in"
                        title="Reset Zoom"
                      >
                        <RotateCcw size={20} />
                      </button>
                    )}
                    <div className="bg-[#16161a]/80 backdrop-blur border border-[#2d2d35] rounded-xl flex flex-col overflow-hidden">
                      <button onClick={() => zoomIn()} className="p-3 hover:bg-white/5 border-b border-[#2d2d35]"><Maximize2 size={18} /></button>
                      <button onClick={() => zoomOut()} className="p-3 hover:bg-white/5"><RotateCcw size={18} style={{ transform: 'rotate(-90deg)' }} /></button>
                    </div>
                  </div>

                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      {(loading || error) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#000] z-10">
                          {loading ? (
                            <div className="loader" />
                          ) : (
                            <div className="text-center p-6 bg-[#16161a] rounded-2xl border border-red-500/20">
                              <ImageOff size={40} className="text-red-500 mb-4 mx-auto" />
                              <p className="text-slate-400 text-sm mb-4">読み込み失敗</p>
                              <button
                                onClick={() => { setLoading(true); setError(false); setRetryCount(prev => (prev + 1) % 2); }}
                                className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium"
                              >
                                リトライ
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <motion.img
                        key={`${ticker.id}-${retryCount}`}
                        src={getImageUrl(ticker.id, retryCount)}
                        alt={ticker.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: loading ? 0 : 1, scale: 1 }}
                        onLoad={() => setLoading(false)}
                        onError={() => { setLoading(false); setError(true); }}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChartView;
