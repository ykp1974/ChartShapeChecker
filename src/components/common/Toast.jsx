import React, { useEffect } from 'react';

/**
 * ==========================================
 * トースト通知コンポーネント (Toast.jsx)
 * ==========================================
 * 
 * 【このコンポーネントの役割】
 * 画面上に一時的な通知メッセージ（成功、エラーなど）を表示する汎用UIパーツです。
 * 
 * 【学べるReactの主要概念】
 * 1. Props（引数）による呼び出し元からのデータ受け取りとデフォルト値の設定
 * 2. 条件付きレンダリング（Early Return）による不要な描画のスキップ
 * 3. useEffect を使ったタイマー（副作用）処理とクリーンアップ（メモリリーク防止）
 * 4. 三項演算子を用いた動的なCSSクラスの切り替え
 */
/**
 * @param {Object} props
 * @param {string} props.message - 表示するメッセージ文字列
 * @param {function} props.onClose - Callback triggered when the toast closes or times out.
 */
const Toast = ({ message, onClose }) => {
  // --------------------------------------------------------------------------
  // 2. 副作用の制御 (useEffect)
  // --------------------------------------------------------------------------
  // コンポーネントが画面に描画されたタイミングで自動消滅タイマーを開始します。
  useEffect(() => {
    // duration（指定時間）が経過したら、親から渡された onClose 関数を実行して非表示にする
    const timer = setTimeout(onClose, 5000); // 5秒間表示
    // 【重要】クリーンアップ関数
    // トーストが消去されたり、タイマー完了前に再描画された場合、古いタイマーを解除します。
    // これにより、意図しないタイミングで onClose が二重実行されるバグやメモリリークを防ぎます。
    return () => clearTimeout(timer);
  }, [onClose]);
  // --------------------------------------------------------------------------
  // 4. JSX（画面の描画構造）の返却
  // --------------------------------------------------------------------------
  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '20px', padding: '15px 25px',
      backgroundColor: '#16161a', color: '#e2e8f0', borderRadius: '12px',
      zIndex: 9999, border: '1px solid #2d2d35', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
      whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6'
    }}>
      {message}
    </div>
  );
};

export default Toast;
