import { useState } from 'react';
import { getAuthUrl } from '../../services/auth';

function SpotifyAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
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
      
      <p className="text-sm text-spotify-gray text-center max-w-md">
        Spotifyアカウントでログインして、現在再生中の楽曲から楽譜を自動生成します。
      </p>
    </div>
  );
}

export default SpotifyAuth;