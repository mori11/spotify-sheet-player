# 緊急デプロイ手順

## 問題
- Vercelのキャッシュが解決できない
- まだ古いファイル `index-DXmX-bty.js` が配信されている
- localhost:8000 エラーが継続

## 解決策：新しいVercelプロジェクト

### 手順1: 新しいVercelプロジェクトを作成

1. https://vercel.com/new にアクセス
2. 「Import Git Repository」を選択
3. `mori11/spotify-sheet-player` を選択
4. **重要な設定**:
   - Project Name: `spotify-sheet-player-v2`
   - Root Directory: `spotify-sheet-player/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 手順2: 環境変数設定

設定は不要（コードに直接Railway URLを書いている）

### 手順3: デプロイ後の確認

新しいURL: `https://spotify-sheet-player-v2.vercel.app`

### 手順4: Spotify App設定更新

Redirect URI に追加:
- `https://spotify-sheet-player-v2.vercel.app/callback`

## 代替案：Railway Full Stack

もしVercelで問題が続く場合、Railwayでフロントエンドも一緒にデプロイ可能