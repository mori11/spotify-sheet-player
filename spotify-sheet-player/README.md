# Spotify Sheet Player

Spotify APIを使用して再生中の楽曲情報を取得し、楽譜を自動生成する音楽プレーヤー

## 機能

- Spotify認証・連携
- 現在再生中の楽曲情報取得
- 楽譜の自動生成と表示
- リアルタイム楽譜同期

## セットアップ

### 前提条件

- Node.js (v18以上)
- Spotify Developer アカウント

### インストール

```bash
# ルートディレクトリで依存関係をインストール
npm install

# フロントエンドとバックエンドの依存関係をインストール  
cd frontend && npm install
cd ../backend && npm install
```

### 環境変数の設定

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)でアプリを作成
2. `backend`ディレクトリで`.env`ファイルを作成し、以下の情報を設定：

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
PORT=5000
```

3. Spotify Developer Dashboardでリダイレクト URI に `http://localhost:3000/callback` を追加

### 開発サーバーの起動

```bash
npm run dev
```

フロントエンド: http://localhost:3000
バックエンド: http://localhost:5000

## 技術スタック

- フロントエンド: React, TypeScript, Tailwind CSS, VexFlow
- バックエンド: Node.js, Express
- API: Spotify Web API
- 音楽分析: Tone.js