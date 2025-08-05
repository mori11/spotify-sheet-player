import { useState } from 'react';
import { getAuthUrl } from '../../services/auth';

function SpotifyAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authUrl = await getAuthUrl();
      
      // ブラウザ拡張機能の干渉を避けるため、新しいウィンドウで開く
      const width = 500;
      const height = 800;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      const authWindow = window.open(
        authUrl, 
        'spotify-auth',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
      );
      
      // ポップアップがブロックされた場合は通常のリダイレクトを使用
      if (!authWindow || authWindow.closed || typeof authWindow.closed === 'undefined') {
        window.location.href = authUrl;
      }
      
      // ローディング状態を解除
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Failed to get auth URL:', error);
      
      // エラーメッセージを表示
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('認証URLの取得に失敗しました。しばらく経ってから再度お試しください。');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-spotify-green hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors duration-200"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>接続中...</span>
          </div>
        ) : (
          'Spotifyと連携'
        )}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <p className="text-sm text-spotify-gray text-center max-w-md">
        Spotifyアカウントでログインして、現在再生中の楽曲から楽譜を自動生成します。
      </p>
      
      <div className="text-xs text-spotify-gray text-center max-w-md mt-4">
        <p>ポップアップがブロックされた場合は、ブラウザの設定でポップアップを許可してください。</p>
      </div>
    </div>
  );
}

export default SpotifyAuth;