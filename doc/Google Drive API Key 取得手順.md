# Google Drive API Key 取得手順

`npm run update-tickers` コマンドでGoogle Driveから自動的に最新の銘柄一覧を取得するために必要な、APIキーの取得手順を説明します。

## 1. Google Cloud プロジェクトの作成・選択
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセスします。
2. 画面上部のプロジェクト選択ドロップダウンから「新しいプロジェクト」を作成するか、既存のプロジェクトを選択します。

## 2. Google Drive API の有効化
1. 左側のメニューから **「APIとサービス」 > 「ライブラリ」** を選択します。
2. 検索バーに `Google Drive API` と入力し、検索結果から選択します。
3. **「有効にする」** ボタンをクリックします。

## 3. APIキーの作成
1. 左側のメニューから **「APIとサービス」 > 「認証情報」** を選択します。
2. **「+ 認証情報を作成」** ボタンをクリックし、**「API キー」** を選択します。
3. 生成された API キーをコピーしてメモしておきます。

## 4. (推奨) APIキーの制限
セキュリティのため、APIキーをGoogle Drive APIのみに制限することをお勧めします。
1. 作成されたAPIキーの編集アイコン（鉛筆）をクリックします。
2. 「API の制限」セクションで **「キーを制限」** を選択します。
3. ドロップダウンから **「Google Drive API」** を選択して保存します。

---

## スクリプトの実行方法

APIキーを取得したら、以下のいずれかの方法で実行してください。

### 方法 A: 環境変数として渡す (推奨)
PowerShell で以下のコマンドを実行します：
```powershell
$env:GOOGLE_DRIVE_API_KEY="あなたのAPIキー"; npm run update-tickers
```

### 方法 B: スクリプトに直接書き込む
`scripts/update-tickers.js` の 8 行目付近にある `const API_KEY = ...` の部分に直接貼り付けます（※GitHubなどに公開する場合は注意してください）。
