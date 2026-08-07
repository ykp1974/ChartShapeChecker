import React from 'react';
/**
 * =================================================================
 * エラーバウンダリ（例外捕獲）コンポーネント (ErrorBoundary.jsx)
 * =================================================================
 * 
 * 【このコンポーネントの役割】
 * 子コンポーネントツリーのレンダリング中に発生した予期せぬ JavaScript エラーを捕獲し、
 * 画面全体が真っ白（クラッシュ）になるのを防ぐセーフティネット（フォールバックUI）です。
 * 
 * 【学べるReactの主要概念】
 * 1. クラスコンポーネントの利用理由
 *    （getDerivedStateFromError や componentDidCatch 等のエラーハンドリング用ライフサイクルは
 *     現在の React 仕様上、クラスコンポーネントでのみ提供されているため）
 * 2. getDerivedStateFromError による状態（State）の切り替え
 * 3. componentDidCatch によるエラー情報のログ記録
 * 4. this.props.children による正常系UIのレンダリングとフォールバック表示の切り替え
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // 初期状態: エラーは発生していない（hasError: false）
    this.state = { hasError: false, error: null };
  }
  /**
   * 子コンポーネントでエラーがスローされた際に自動実行される静的メソッド。
   * エラーオブジェクトを受け取り、次のレンダリングでフォールバックUI（エラー画面）を
   * 表示するためのState（hasError: true）を返します。
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  /**
   * エラー捕獲時のライフサイクルメソッド。
   * キャッチしたエラー情報やスタックトレースをログ出力したり、
   * Sentryなどのエラー監視サービスへ送信するために使用します。
   */
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // -----------------------------------------------------------------
    // 1. エラー発生時（異常系）のレンダリング
    // -----------------------------------------------------------------
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050507',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>エラーが発生しました</h1>
          <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '24px' }}>
            アプリケーションの実行中に予期しないエラーが発生しました。
          </p>
          {/* 発生したエラーのスタック/メッセージを表示 */}
          <pre style={{
            backgroundColor: '#16161a',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#ef4444',
            maxWidth: '100%',
            overflow: 'auto',
            border: '1px solid #2d2d35'
          }}>
            {this.state.error?.toString()}
          </pre>
          {/* 画面を再読み込みして復旧を試みるボタン */}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '24px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            画面を更新する
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
