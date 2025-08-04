#!/bin/bash

echo "Spotify Sheet Player with ngrok"
echo "==============================="
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "ngrokがインストールされていません。"
    echo "インストール方法: brew install ngrok"
    exit 1
fi

# Start backend server
echo "バックエンドサーバーを起動中..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo "フロントエンドサーバーを起動中..."
cd .. && node simple-server.js &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Start ngrok
echo ""
echo "ngrokでトンネルを作成中..."
ngrok http 8888

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT