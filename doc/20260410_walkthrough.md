# Walkthrough - Google Drive 連携と銘柄一覧の自動更新

Google Drive フォルダを参照して銘柄一覧 (`tickers.js`) を作成・更新する機能を実装しました。

## 実施内容

### 1. `tickers.js` の更新
現在の Google Drive フォルダ内のファイル一覧を取得し、`src/data/tickers.js` を最新の状態（5銘柄）に更新しました。古いデータはすべて削除されました。

#### 更新されたファイル: [tickers.js](file:///c:/wk/yamag2/my/ChartShapeChecker/src/data/tickers.js)

### 2. 自動更新スクリプトの作成
Google Drive API を使用して最新の銘柄一覧を取得し、`tickers.js` を生成する Node.js スクリプトを作成しました。

#### 新規作成したスクリプト: [update-tickers.js](file:///c:/wk/yamag2/my/ChartShapeChecker/scripts/update-tickers.js)

### 3. `package.json` へのコマンド追加
`npm run update-tickers` コマンドで簡単に更新を実行できるようにしました。

#### 変更されたファイル: [package.json](file:///c:/wk/yamag2/my/ChartShapeChecker/package.json)

### 4. APIキー取得ガイドの作成
ユーザーが自分で API キーを取得し、スクリプトを実行できるようにするための詳細なガイドを作成しました。

#### 作成したガイド: [google_drive_api_guide.md](file:///C:/Users/advan/.gemini/antigravity/brain/2f2dc7c5-3efc-4945-9378-21643abbc602/google_drive_api_guide.md)

## 検証結果
- `tickers.js` が正しいフォーマットで 5 銘柄含まれていることを確認しました。
- `package.json` にコマンドが正しく追加されていることを確認しました。

## 今後の使用方法
Google Drive フォルダに新しいチャート画像を追加した際は、[ガイド](file:///C:/Users/advan/.gemini/antigravity/brain/2f2dc7c5-3efc-4945-9378-21643abbc602/google_drive_api_guide.md) に従って API キーを取得し、以下のコマンドを実行してください：

```powershell
$env:GOOGLE_DRIVE_API_KEY="取得したAPIキー"; npm run update-tickers
```
