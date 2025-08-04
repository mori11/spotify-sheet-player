const express = require('express');
const path = require('path');

const app = express();
const PORT = 8888;

// Set proper MIME types
app.use((req, res, next) => {
  if (req.path.endsWith('.tsx')) {
    res.type('application/javascript');
  } else if (req.path.endsWith('.ts')) {
    res.type('application/javascript');
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Root redirect for Spotify
app.get('/auth', (req, res) => {
  res.redirect('/');
});

// Spotify callback handler (multiple routes for flexibility)
app.get('/callback', handleCallback);
app.get('/auth/callback', handleCallback);
app.get('/auth/spotify/callback', handleCallback);

function handleCallback(req, res) {
  const code = req.query.code;
  const error = req.query.error;
  
  if (error) {
    res.send(`
      <html>
        <body>
          <h1>認証エラー</h1>
          <p>Spotify認証でエラーが発生しました: ${error}</p>
          <a href="/">戻る</a>
        </body>
      </html>
    `);
    return;
  }
  
  res.send(`
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl mb-4">認証中...</h1>
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        </div>
        <script>
          const code = '${code}';
          
          fetch('/api/auth/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code })
          })
          .then(response => response.json())
          .then(data => {
            if (data.access_token) {
              localStorage.setItem('spotify_access_token', data.access_token);
              localStorage.setItem('spotify_refresh_token', data.refresh_token);
              localStorage.setItem('spotify_token_expires', String(Date.now() + data.expires_in * 1000));
              window.location.href = '/';
            } else {
              alert('認証に失敗しました');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('認証処理でエラーが発生しました');
          });
        </script>
      </body>
    </html>
  `);
}

// Simple HTML page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotify Sheet Player</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    </style>
</head>
<body class="bg-gray-900 text-white min-h-screen flex items-center justify-center">
    <div class="text-center max-w-md mx-auto">
        <h1 class="text-4xl font-bold mb-8 text-green-500">
            Spotify Sheet Player
        </h1>
        <p class="text-xl mb-8 text-gray-300">
            Spotifyと連携して楽譜を自動生成します
        </p>
        <button onclick="connectSpotify()" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors duration-200">
            Spotifyと連携
        </button>
        <p class="text-sm text-gray-400 mt-6">
            Spotifyアカウントでログインして、現在再生中の楽曲から楽譜を自動生成します。
        </p>
    </div>

    <script>
        function connectSpotify() {
            fetch('/api/auth/login')
                .then(response => response.json())
                .then(data => {
                    if (data.authUrl) {
                        window.location.href = data.authUrl;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Spotify認証の開始に失敗しました');
                });
        }

        // Check if user is already authenticated
        if (localStorage.getItem('spotify_access_token')) {
            document.body.innerHTML = '<div class="bg-gray-900 text-white min-h-screen p-8"><div class="max-w-4xl mx-auto"><h1 class="text-3xl font-bold mb-8 text-green-500">楽譜プレーヤー</h1><div class="bg-gray-800 rounded-lg p-6"><p class="text-xl">Spotifyで楽曲を再生してください</p><p class="text-gray-400 mt-2">楽曲情報を取得して楽譜を生成します</p></div></div></div>';
        }
    </script>
</body>
</html>
  `);
});

app.use(express.json());

// API proxy to backend
app.use('/api', async (req, res) => {
  try {
    const axios = require('axios');
    const backendUrl = 'http://localhost:8000' + req.originalUrl;
    
    const response = await axios({
      method: req.method,
      url: backendUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Backend connection failed' 
    });
  }
});

app.listen(PORT, () => {
  console.log('Frontend server running on http://localhost:' + PORT);
});