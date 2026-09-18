import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, Share2, ZoomIn, ImageOff, Maximize2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { DRIVE_URLS } from '../config/constants';
import Toast from './common/Toast';
import QualityScoreBadge from './QualityScoreBadge';
/**
 * =================================================================
 * チャート画像表示コンポーネント (ChartView.jsx)
 * =================================================================
 * 
 * 【このコンポーネントの役割】
 * 選択された銘柄のチャート画像を画面中央に拡大・移動（パン）可能で描画します。
 * 画像の非同期読み込み状態（Loading/Error/リトライ）や、パターン提示用のトースト表示も一括で制御します。
 * 
 * 【学べるReact/フロントエンドの主要概念】
 * 1. 早期リターン（Early Return / ガード節）による非存在データ（null）のハンドリング
 * 2. 画像の非同期読み込みイベント（onLoad / onError）とローディング・エラー表示のコントロール
 * 3. サードパーティ製ズームライブラリ（react-zoom-pan-pinch）の Render Props パターン利用
 * 4. Reactの `key` プロパティの変更を利用したコンポーネント・画像の強制的再読み込み
 * 5. 共通パーツ（Toast.jsx）の実際の呼び出しと状態共有パターン
 */

/**
 * @param {Object} props
 * @param {Object} props.ticker - 表示対象の銘柄データ（ID, 名称, コード等）
 * @param {Function} props.onPrev - 前の銘柄へ移動する親の関数
 * @param {Function} props.onNext - 次の銘柄へ移動する親の関数
 * @param {Array} props.selectedIds - チェック状態の銘柄ID配列
 * @param {Function} props.onToggleTicker - チェック切り替え用親関数
 */
const ChartView = ({ ticker, onPrev, onNext, selectedIds, onToggleTicker }) => {
  // -----------------------------------------------------------------
  // 1. 状態（State）の定義
  // -----------------------------------------------------------------
  const [loading, setLoading] = useState(true); // 画像の読み込み中フラグ
  const [error, setError] = useState(false); // エラー発生フラグ
  const [retryCount, setRetryCount] = useState(0); // リトライ回数（フォールバック判定用）
  const [toastMessage, setToastMessage] = useState(null); // トースト表示用のメッセージテキスト（null の時は非表示）
  /**
   * チャートパターン確認用のトーストメッセージを表示する処理
   */
  const handleShowPatterns = () => {
    const allMessages = [
      "[kh]急落後の反騰", "[ho]初押し", "[si]三手大陰線",
      "[si]最後の抱き陰線", "[ii]陰の陰はらみ", "[w] Wボトム、逆三尊"
    ].join('\n');
    setToastMessage(allMessages);
  };
  // -----------------------------------------------------------------
  // 2. 副作用（useEffect）：表示対象銘柄（ticker）が変わったときのリセット処理
  // -----------------------------------------------------------------
  useEffect(() => {
    if (ticker?.id) {
      // 新しい銘柄が渡されたらローディング状態に戻し、エラーとリトライ数を初期化
      setLoading(true);
      setError(false);
      setRetryCount(0);
    } else {
      setLoading(false);
      setError(!ticker);
    }
  }, [ticker]);// ticker の参照が変わったタイミングで発火
  // -----------------------------------------------------------------
  // 3. 画像URL・リンク取得ヘルパー関数
  // -----------------------------------------------------------------
  // リトライ回数に応じた画像URLの生成（1回失敗した場合はフォールバック用URLへ切替）
  const getImageUrl = (id, retry) => {
    if (retry === 1) return DRIVE_URLS.FALLBACK(id);
    return DRIVE_URLS.THUMBNAIL(id);
  };

  const getExternalUrl = (id) => DRIVE_URLS.PREVIEW(id);
  // -----------------------------------------------------------------
  // 4. ガード節（Early Return）
  // -----------------------------------------------------------------
  // 銘柄が選択されていない（ticker が null または undefined）場合、
  // エラーを防ぎつつ早期にプレースホルダー画面を返します。
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
  // -----------------------------------------------------------------
  // 5. JSX による画面の描画
  // -----------------------------------------------------------------
  return (

    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050507]">
      {/* 
        --------------------------------------------------------------
        画面ヘッダーエリア（銘柄情報・アクションボタン）
        --------------------------------------------------------------
      */}
      <div className="p-4 flex items-center justify-between border-b border-[#2d2d35]/30">
        {/* 銘柄選択チェックボックス（親の State / 関数と連携） */}
        <input
          type="checkbox"
          checked={selectedIds.includes(ticker.id)}  // 親コンポーネントから受け取った選択配列に含まれるか
          onChange={() => onToggleTicker(ticker.id)} // チェック切り替え関数を呼ぶ
          className="w-5 h-5 rounded border-slate-600 bg-transparent text-blue-500 focus:ring-blue-500"
        />
        {/* 銘柄コード・名称 ＆ スコアバッジ表示エリア */}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-blue-400 font-mono">{ticker.symbol}</span>
            <span className="truncate">{ticker.name}</span>
            {/* ↑ 初押し質スコアバッジ */}
            <QualityScoreBadge
              score={ticker.quality_score}
              volScore={ticker.vol_score}
              depthScore={ticker.depth_score}
              closePosScore={ticker.close_pos_score}
            />
          </h2>
          <p className="text-[10px] text-slate-500 uppercase truncate">
            {ticker.market} | {ticker.filename}
          </p>
        </div>
        {/* 右側アクション（パターン表示ボタン・ドライブ直リンク） */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleShowPatterns}
            className="px-3 py-1 text-xs rounded-md bg-[#2d2d35] text-slate-400 hover:text-white border border-[#3f3f4a]"
          >
            パターン表示
          </button>
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

      {/* 
        --------------------------------------------------------------
        メイン画像表示エリア (TransformWrapper によるズーム/パン機能)
        --------------------------------------------------------------
      */}
      <div className="flex-1 relative overflow-hidden bg-[#000] group">
        {/* 左右ナビゲーション（前へ/次へ）ボタン */}
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
            /* IDが未設定の場合のアラートメッセージ */
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
            /* 
              ズーム・パン・ピンチライブラリの組み込み (Render Props パターン)
              ライブラリ内部の操作関数（zoomIn, zoomOut, resetTransform 等）を受け取って利用します。
            */
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
                  {/* フローティングズーム操作ボタン */}
                  <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
                    {/* 拡大されている時のみズームリセットボタンを表示 */}
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

                  {/* ズーム可能コンテナエリア */}
                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* 読み込み中 (loading) またはエラー (error) 時のオーバーレイ表示 */}
                      {(loading || error) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#000] z-10">
                          {loading ? (
                            /* スピナー表示 */
                            <div className="loader" />
                          ) : (
                            /* 画像取得失敗時のエラー表示 ＆ リトライボタン */
                            <div className="text-center p-6 bg-[#16161a] rounded-2xl border border-red-500/20">
                              <ImageOff size={40} className="text-red-500 mb-4 mx-auto" />
                              <p className="text-slate-400 text-sm mb-4">読み込み失敗</p>
                              <button
                                onClick={() => {
                                  setLoading(true);
                                  setError(false);
                                  // リトライ回数を加算（keyが変わることで画像の強制リロードが走る） 
                                  setRetryCount(prev => (prev + 1) % 2);
                                }}
                                className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium"
                              >
                                リトライ
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {/* 
                        ----------------------------------------------------
                        チャート画像エレメント
                        ----------------------------------------------------
                        ・key に retryCount を含めることで、リトライ時にReactが要素を再生成し、
                          ブラウザキャッシュに頼らず画像を再取得（再レンダリング）します。
                        ・onLoad / onError イベントをトリガーにして、表示状態（State）を変更します。
                      */}
                      <motion.img
                        key={`${ticker.id}-${retryCount}`}
                        src={getImageUrl(ticker.id, retryCount)}
                        alt={ticker.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: loading ? 0 : 1, scale: 1 }}
                        // 画像読み込み完了時にローディングを解除
                        onLoad={() => setLoading(false)}
                        // 画像読み込み失敗時にエラーフラグを立てる
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
      {/* 
        --------------------------------------------------------------
        トースト通知コンポーネント (Toast.jsx) の呼び出し
        --------------------------------------------------------------
        toastMessage が存在するときのみレンダリングされます。
        onClose が呼ばれると toastMessage を null に戻して消去します。
      */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default ChartView;
