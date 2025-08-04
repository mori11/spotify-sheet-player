# 🚀 Spotify Sheet Player - クラウドデプロイ手順

## 📋 デプロイ概要

**安全で確実な方法でアプリケーションをクラウドにデプロイします**

- **フロントエンド**: Vercel（無料）
- **バックエンド**: Railway（無料枠あり）

## 🎯 Phase 1: バックエンドデプロイ（Railway）

### 1. Railwayアカウント作成
1. https://railway.app にアクセス
2. GitHubアカウントでサインアップ
3. 「Deploy from GitHub repo」を選択

### 2. GitHubリポジトリ準備
```bash
# GitHubにプッシュする場合
cd spotify-sheet-player
git init
git add .
git commit -m "Initial commit"
# GitHubでリポジトリ作成後
git remote add origin https://github.com/yourusername/spotify-sheet-player.git
git push -u origin main
```

### 3. Railway環境変数設定
Railwayダッシュボードで以下を設定：
```
SPOTIFY_CLIENT_ID=1d132eb7922d4d51a77b5d6a39f2e287
SPOTIFY_CLIENT_SECRET=d373279707074437ad87de800a11ed36
SPOTIFY_REDIRECT_URI=https://your-frontend-url.vercel.app/callback
PORT=8000
```

## 🎯 Phase 2: フロントエンドデプロイ（Vercel）

### 1. Vercelアカウント作成
1. https://vercel.com にアクセス  
2. GitHubアカウントでサインアップ
3. 「Import Project」を選択

### 2. プロジェクト設定
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. 環境変数設定
Vercelダッシュボードで設定：
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

## 🔧 Phase 3: Spotify設定更新

### 1. Redirect URI更新
Spotify Developer Dashboardで以下を追加：
```
https://your-frontend-url.vercel.app/callback
```

### 2. CORS設定更新
バックエンドのCORS設定を本番用に更新済み

## 📱 Phase 4: テスト

### 1. デプロイ確認
- バックエンド: https://your-backend.railway.app/api/health
- フロントエンド: https://your-frontend.vercel.app

### 2. 機能テスト
1. フロントエンドにアクセス
2. 「Spotifyと連携」をクリック
3. 認証フローのテスト
4. 楽曲再生→楽譜生成のテスト

## 🚀 簡単デプロイコマンド

### Vercel CLI使用（推奨）
```bash
# Vercel CLIインストール
npm install -g vercel

# フロントエンドデプロイ
cd frontend
vercel --prod
```

### Railway CLI使用
```bash
# Railway CLIインストール
npm install -g @railway/cli

# バックエンドデプロイ
cd backend
railway login
railway deploy
```

## ✅ 完了チェックリスト

- [ ] Railway バックエンドデプロイ完了
- [ ] Vercel フロントエンドデプロイ完了
- [ ] 環境変数設定完了
- [ ] Spotify Redirect URI更新完了
- [ ] デプロイURLでの動作確認完了

## 🔗 デプロイ後のURL例

- **フロントエンド**: https://spotify-sheet-player.vercel.app
- **バックエンド**: https://spotify-sheet-backend.railway.app

## 🆘 トラブルシューティング

### ビルドエラーの場合
```bash
# ローカルでビルドテスト
cd frontend
npm run build
```

### API接続エラーの場合
- CORSエラー → バックエンドのCORS設定確認
- 認証エラー → 環境変数の設定確認

## 💡 メリット

✅ **完全に安全** - システム設定変更不要  
✅ **高速デプロイ** - 5-10分で完了  
✅ **無料** - 両サービスとも無料枠あり  
✅ **自動HTTPS** - SSL証明書自動発行  
✅ **スケーラブル** - 自動スケーリング対応