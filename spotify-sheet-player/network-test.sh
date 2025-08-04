#!/bin/bash

echo "🔍 ネットワーク診断を開始します..."
echo ""

echo "1. ローカルホストの基本テスト:"
ping -c 3 127.0.0.1

echo ""
echo "2. ファイアウォール状態:"
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

echo ""
echo "3. ポートの使用状況:"
lsof -i :3001
lsof -i :8080

echo ""
echo "4. ネットワークインターフェース:"
ifconfig | grep -A 1 "lo0\|en0"

echo ""
echo "5. Python簡易サーバーテスト:"
echo "ポート8001でPython HTTPサーバーを起動します..."
cd /tmp
python3 -m http.server 8001 &
SERVER_PID=$!
sleep 2

echo "接続テスト:"
curl -I http://localhost:8001 2>/dev/null && echo "✅ 接続成功" || echo "❌ 接続失敗"

kill $SERVER_PID 2>/dev/null

echo ""
echo "診断完了"