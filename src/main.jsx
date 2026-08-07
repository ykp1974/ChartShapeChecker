import { StrictMode } from 'react'// 1. React本体・関連ライブラリ
import { createRoot } from 'react-dom/client'// 2. ReactDOMライブラリ
import './index.css'
import App from './App.jsx'// 4. ルートコンポーネント（アプリケーションの骨格）
import ErrorBoundary from './components/ErrorBoundary.jsx'// 5. エラーハンドリングコンポーネント　
/**
 * Reactアプリケーションの起動（エントリーポイント）処理
 * 
 * 1. document.getElementById('root')
 *    index.html 内に用意されている `<div id="root"></div>`（描画領域となる枠組み）を取得します。
 * 
 * 2. createRoot(...)
 *    取得したHTML要素をReactが管理・更新する領域（Root）としてセットアップします。
 * 
 * 3. .render(...)
 *    指定した領域に、Reactコンポーネント（ここでは <App />）を組み立てて実際に画面へ表示します。
 */
createRoot(document.getElementById('root')).render(
  /*
   * <StrictMode> (厳格モード)
   * 開発中にコードの問題点や不適切な副作用（予期せぬ挙動）を自動でチェック・警告してくれる機能です。
   * ※開発環境では一部の処理（useEffectなど）が意図的に2回実行される挙動になりますが、
   *   本番環境（ビルド時）には自動的に無効化され、実行速度への影響はありません。
   */
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

