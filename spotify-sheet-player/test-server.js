const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Spotify Sheet Player テスト</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #191414; color: white; }
            .container { max-width: 600px; margin: 0 auto; text-align: center; }
            .btn { background: #1DB954; color: white; padding: 15px 30px; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; margin: 10px; }
            .btn:hover { background: #1ed760; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎵 Spotify Sheet Player</h1>
            <p>サーバーが正常に動作しています！</p>
            <button class="btn" onclick="connectSpotify()">Spotifyと連携</button>
            <p><small>ポート: 8080 | 時刻: ${new Date().toLocaleString('ja-JP')}</small></p>
        </div>
        
        <script>
            function connectSpotify() {
                fetch('/api/auth/login')
                    .then(response => response.json())
                    .then(data => {
                        if (data.authUrl) {
                            window.location.href = data.authUrl;
                        } else {
                            alert('認証URLの取得に失敗しました');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('サーバーエラーが発生しました');
                    });
            }
        </script>
    </body>
    </html>
  `);
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ テストサーバーが起動しました`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://127.0.0.1:${PORT}`);
  console.log(`   - すべてのネットワークインターフェースでリッスン中`);
});