// src/components/QualityScoreBadge.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 初押し質スコア（Quality Score）バッジコンポーネント
 * タップすると詳細内訳が浮き出るポップオーバーが表示されます。
 */
const QualityScoreBadge = ({ score, volScore, depthScore, closePosScore }) => {
    const [isOpen, setIsOpen] = useState(false);

    // スコアデータが存在しない銘柄の場合は何も表示しない
    if (score === undefined || score === null) return null;

    // 数値型に変換
    const numScore = Number(score);
    if (isNaN(numScore)) return null;
    return (
        <div className="relative inline-flex items-center ml-2">
            {/* 
        --------------------------------------------------------------
        タップ可能なスコアバッジ
        --------------------------------------------------------------
      */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer shadow-sm"
                title="タップして質スコアの内訳を表示"
            >
                QS: {typeof score === 'number' ? score.toFixed(3) : score}
            </button>

            {/* 
        --------------------------------------------------------------
        タップ時に浮き出る詳細ポップオーバー（Framer Motion アニメーション付き）
        --------------------------------------------------------------
      */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* 画面外をタップした時に閉じる背景透明オーバーレイ */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full mt-2 w-56 p-3 bg-[#16161a] border border-[#2d2d35] rounded-xl shadow-2xl text-xs z-50 text-slate-200 backdrop-blur-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* ポップオーバーヘッダー */}
                            <div className="font-bold border-b border-[#2d2d35] pb-1.5 mb-2 text-emerald-400 flex items-center justify-between">
                                <span>初押し質スコア内訳</span>
                                <span className="text-[9px] text-slate-500 font-normal">0.3〜0.5: 良好</span>
                            </div>

                            {/* 各構成要素の数値表示 */}
                            <div className="space-y-1.5 font-mono text-[11px]">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-sans">出来高変化 (Vol):</span>
                                    <span className="font-bold text-slate-100">{volScore ?? '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-sans">押しの深さ (Depth):</span>
                                    <span className="font-bold text-slate-100">{depthScore ?? '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-sans">終値位置 (Close):</span>
                                    <span className="font-bold text-slate-100">{closePosScore ?? '-'}</span>
                                </div>
                            </div>

                            {/* フッター・閉じるボタン */}
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="mt-2 text-[10px] text-slate-500 hover:text-slate-300 w-full text-right block pt-1 border-t border-[#2d2d35]/50 transition-colors"
                            >
                                閉じる ✕
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QualityScoreBadge;