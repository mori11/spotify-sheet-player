#!/bin/bash

echo "Spotify Sheet Player 起動スクリプト"
echo "================================="
echo ""

# Kill any existing processes
echo "既存のプロセスを停止中..."
pkill -f "vite" 2>/dev/null
pkill -f "tsx" 2>/dev/null
pkill -f "auth-proxy" 2>/dev/null
sleep 2

# Start the development servers
echo "開発サーバーを起動中..."
npm run dev &
DEV_PID=$!

# Wait for servers to start
echo "サーバーの起動を待機中..."
sleep 5

# Start the auth proxy
echo "認証プロキシサーバーを起動中..."
node auth-proxy.js &
PROXY_PID=$!

sleep 2

echo ""
echo "✅ すべてのサーバーが起動しました！"
echo ""
echo "アクセスURL:"
echo "  - http://127.0.0.1:8888 (Spotify認証用)"
echo "  - http://localhost:3000 (直接アクセス)"
echo ""
echo "Ctrl+C で終了します"

# Wait for user to press Ctrl+C
trap "kill $DEV_PID $PROXY_PID 2>/dev/null; exit" SIGINT SIGTERM
wait