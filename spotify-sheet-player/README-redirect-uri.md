# Spotify Redirect URI 設定ガイド

## 問題
Spotify Developer DashboardでローカルホストのRedirect URIが登録できない場合の解決方法

## 解決方法

### 方法1: 異なるURIパターンを試す
以下のパターンを順番に試してください：
- `http://localhost:8888`
- `http://127.0.0.1:8888/callback`
- `http://localhost/callback`
- `https://localhost:8888/callback`

### 方法2: ngrokを使用（推奨）
1. ngrokをインストール
   ```bash
   brew install ngrok
   ```

2. アカウント作成とセットアップ
   - https://ngrok.com/ でアカウント作成
   - 認証トークンを取得して設定

3. ローカルサーバーを公開
   ```bash
   ngrok http 8888
   ```

4. 生成されたURL（例：`https://abc123.ngrok.io/callback`）をSpotifyに登録

### 方法3: 別のポートを試す
Spotifyが受け入れやすいポート：
- 3000
- 5000
- 8000
- 8080
- 8888

## 確認事項
- URLに余分なスペースが入っていないか
- プロトコル（http/https）が正しいか
- スラッシュの数が正しいか