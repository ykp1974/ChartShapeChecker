# コード保守性向上のための最適化（リファクタリング）計画

## 1. ゴール
ChartShapeChecker プロジェクトのロジック分離や定数の外部化を行い、コンポーネントの肥大化を防いで保守性と拡張性を高める。

## 2. 前提
- **【確定】** 機能追加や仕様変更は行わず、既存の振る舞いを維持するリファクタリングとする。
- **【確定】** すでに構築済みのテスト基盤（Vitest）を活用し、リファクタリング後もテストが通ることで動作を担保する。

## 3. タスク分解（最適化すべき点）
1. **API/外部通信ロジックの分離**
   - `App.jsx` に直接書かれている GAS（Google Apps Script）への POST 処理（`saveToSpreadsheet`）を `src/services/gasApi.js` などの別ファイルに切り出す。
2. **定数・設定値の外部化**
   - `App.jsx` や `ChartView.jsx` に存在するハードコードされたURL（GASエンドポイント、Google DriveのURLパスなど）を `src/config/constants.js` に集約する。
3. **状態管理・副作用のカスタムフック化**
   - LocalStorage との同期処理や、`selectedIds`, `readStatus` の管理ロジックを `src/hooks/useLocalStorage.js` や `src/hooks/useTickerState.js` として分離し、`App.jsx` の肥大化を防ぐ。
4. **UIコンポーネントの責務分離と再利用化**
   - `ChartView.jsx` ファイルの末尾に定義されている `Toast` コンポーネントを `src/components/common/Toast.jsx` として独立させ、他コンポーネントからも利用可能にする。
5. **JSDoc / PropTypes によるインターフェースの明示**
   - 各コンポーネント（特に `Sidebar` や `TickerSelector`）の Props に対して、期待する型や説明を JSDoc で記述し、コンポーネントの利用側（App）でのミスの抑止やエディタの補完を強化する。

## 4. 影響範囲
- **機能/ディレクトリ**: 
  - `src/App.jsx` (大幅な削減)
  - `src/components/ChartView.jsx` (削減)
  - 新規作成: `src/services/`, `src/config/`, `src/hooks/`, `src/components/common/`

## 5. リスクと対策
| リスク | 対策 |
| ------ | ---- |
| リファクタリングによる既存機能のデグレ | 実行前後で `npm run test` を実行し、既存テストが完全に通過することを条件として進める。 |
| モジュールのインポートパス解決エラー | Vite環境での相対パスを正しく修正する。必要であれば `vite.config.js` で alias (`@/`など) の設定を検討する。 |

## 6. Done条件
- [ ] 外部通信（GAS）処理が `services` に分離されていること。
- [ ] ハードコードされたURLが `constants` 等に集約されていること。
- [ ] `App.jsx` の状態管理がカスタムフック化され、行数がスリムになっていること。
- [ ] `Toast` コンポーネントが別ファイルに切り出されていること。
- [ ] これらすべての変更後も `npm run test` が全件パスすること。

## 7. 実行手順
- [ ] 1. 新規ディレクトリ（`services`, `config`, `hooks`, `components/common`）の作成
- [ ] 2. `src/config/constants.js` を作成し、各種URLを移動
- [ ] 3. `src/services/gasApi.js` を作成し、`saveToSpreadsheet` を移動
- [ ] 4. `src/hooks/useTickerState.js` 等を作成し、状態管理を移動
- [ ] 5. `src/components/common/Toast.jsx` を切り出し
- [ ] 6. `App.jsx` および `ChartView.jsx` で上記で切り出したモジュールをインポートするよう修正
- [ ] 7. リファクタリング後のテスト実行（`npm run test`）

## 8. ローカルで必要なコマンド候補
```bash
# テストを実行してデグレがないか確認する
npm run test
```

## User Review Required
> [!IMPORTANT]
> コードの保守性を高めるために、現状のコードベースから最適化すべき5つのタスクを洗い出しました。
> 計画（implementation_plan.md）をご確認いただき、この方針でリファクタリングを進めてよいか承認をお願いします。
