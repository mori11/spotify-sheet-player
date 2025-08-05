# 新しいVercelプロジェクトへのデプロイ手順

## 問題
現在のVercelプロジェクト（playnote-frontend）が古いキャッシュから回復できない

## 解決手順

### 1. 新しいVercelプロジェクトを作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. 「New Project」をクリック
3. GitHubリポジトリ `mori11/spotify-sheet-player` をインポート
4. **重要な設定**:
   - **Project Name**: `spotify-player-v2` （新しい名前）
   - **Root Directory**: `spotify-sheet-player/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. デプロイ

「Deploy」をクリックして待つ

### 3. 新しいURL

デプロイ完了後の新しいURL:
`https://spotify-player-v2.vercel.app`

### 4. Spotify設定を更新

Spotify Developer Dashboardで新しいRedirect URIを追加:
- `https://spotify-player-v2.vercel.app/callback`

### 5. Railwayの環境変数を更新

Railwayでバックエンドの`SPOTIFY_REDIRECT_URI`を更新:
- `https://spotify-player-v2.vercel.app/callback`

### 6. バックエンドのCORS設定を更新

backend/src/server.tsに新しいURLを追加