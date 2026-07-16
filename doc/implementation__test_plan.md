# テストコード作成・テスト環境構築計画 (Planner)

## 1. ゴール
ChartShapeChecker全機能のコンポーネントテスト基盤（Vitest + React Testing Library）を構築し、各機能のテストを実装・パスさせる。

## 2. 前提
- **【確定】** Vite + React (v19) 環境である。
- **【確定】** 現在テストフレームワークは未導入である。
- **【確定】** ビルドツールが Vite であるため、テストランナーには親和性の高い Vitest を採用する。

## 3. タスク分解
1. テスト関連ライブラリ（Vitest, jsdom, React Testing Library関連）のインストール
2. `vite.config.js` へテスト用の設定（環境指定やsetupファイルの登録など）を追加
3. DOM拡張アサーション用セットアップファイル（`setupTests.js`）の作成
4. `package.json` に `"test"` などのnpmスクリプトを追加
5. `eslint.config.js` に対し、テスト用グローバル変数（describe, it, expectなど）の許可を追加
6. 疎通確認用テスト（例: `App.test.jsx`の最小レンダリング）の作成と実行
7. `ErrorBoundary.jsx` のエラーハンドリング・フォールバックUIテスト作成
8. `TickerSelector.jsx` および `Sidebar.jsx` のUI操作・コールバック発火テスト作成
9. `ChartView.jsx` のプロパティに応じた画像切り替え、および依存ライブラリ（Zoom等）のモック化テスト作成
10. `npm run test` による全件パスの確認と、動作の検証（Reviewerフェーズへ）

## 4. 影響範囲
- **設定ファイル**: `package.json`, `vite.config.js`, `eslint.config.js` （追加・修正）
- **新規ファイル**: テストセットアップファイル（`src/setupTests.js` など）
- **機能/ディレクトリ**: `src/components/` および `src/` 直下のコンポーネントと同階層に `.test.jsx` ファイルを追加

## 5. リスクと対策
| リスク | 対策 |
| ------ | ---- |
| **React 19互換性**<br>React 19と `@testing-library/react` のバージョン非互換によるインストール・実行エラー | 依存関係解決でエラーが出る場合は `--legacy-peer-deps` を検討するか、最新のパッケージを利用する。 |
| **jsdom制約エラー**<br>`react-zoom-pan-pinch` 等、実際のブラウザAPI（CanvasやResizeObserver等）を必要とするライブラリが jsdom 上で動作しない | jsdom に存在しない API（`ResizeObserver`等）を `setupTests.js` でモック化する、または対象ライブラリをテスト時にモック化する。 |
| **ESLintのエラー**<br>テストファイルで `describe` などを未定義としてLinterが怒る | `eslint.config.js` に `vitest` 用の環境設定やグローバル定義を適切に追加する。 |

## 6. Done条件
- [ ] テスト基盤のセットアップが完了していること（Vitest環境の正常動作）。
- [ ] すべての主要コンポーネント（`App`, `ChartView`, `Sidebar`, `TickerSelector`, `ErrorBoundary`）のテストが存在すること。
- [ ] `npm run test` コマンドでエラーなく全テストが通過すること。
- [ ] テスト導入により、既存の `npm run dev` や `npm run build` が壊れていないこと。

## 7. 実行手順
- [ ] 1. npm でテスト対象パッケージ群をインストールする
- [ ] 2. `vite.config.js` を修正し、`test` プロパティを追加
- [ ] 3. `src/setupTests.js` ファイルを作成
- [ ] 4. `package.json` にテスト用の npm スクリプトを追加
- [ ] 5. `eslint.config.js` を修正し、テスト関連の Lint エラーを防ぐ
- [ ] 6. 疎通確認用テスト（`App.test.jsx`）を作成・実行確認
- [ ] 7. 各コンポーネントのテストコード（`.test.jsx`）を順次実装
- [ ] 8. ローカルで `npm run test` を実行し、全件パスを確認

## 8. ローカルで必要なコマンド候補
```bash
# 1. パッケージのインストール
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @vitest/ui

# 2. テストの実行（単発）
npm run test

# 3. テストの実行（UI付き / ウォッチモード）
npx vitest --ui
```

## User Review Required

> [!IMPORTANT]
> Vitest と React Testing Library を使用してテスト環境を構築する計画です。
> こちらの実装計画（方針、影響範囲、実行手順）について問題がないかご確認ください。承認いただけましたら、次の Coder・Tester フェーズとして順次作業（環境設定やテストコード作成）を実行いたします。
