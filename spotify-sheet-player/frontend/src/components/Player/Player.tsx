import { useState, useEffect } from 'react';
import { spotifyService } from '../../services/spotify';
import { logout } from '../../services/auth';
import CurrentTrack from './CurrentTrack';
import EmotionAnalysis from '../EmotionAnalysis/EmotionAnalysis';

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
}

interface CurrentlyPlaying {
  item: Track;
  is_playing: boolean;
  progress_ms: number;
}

function Player() {
  const [currentTrack, setCurrentTrack] = useState<CurrentlyPlaying | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentlyPlaying = async () => {
    try {
      const data = await spotifyService.getCurrentlyPlaying();
      setCurrentTrack(data);
      
      if (data?.item?.id) {
        try {
          console.log('Fetching audio features for track:', data.item.id);
          const features = await spotifyService.getAudioFeatures(data.item.id);
          console.log('Audio features received:', features);
          setAudioFeatures(features);
        } catch (featuresError: any) {
          console.warn('Audio features not available:', featuresError);
          console.warn('Error details:', featuresError.response?.data);
          console.warn('Error status:', featuresError.response?.status);
          // Audio featuresが取得できなくても基本機能は動作させる
          setAudioFeatures(null);
        }
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching currently playing:', err);
      
      // より詳細なエラーメッセージを表示
      if (err.response?.status === 403) {
        setError('アクセス権限がありません。再度ログインしてください。');
      } else if (err.response?.status === 401) {
        setError('認証の有効期限が切れました。再度ログインしてください。');
        setTimeout(() => {
          logout();
          window.location.reload();
        }, 3000);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('楽曲情報の取得に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentlyPlaying();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchCurrentlyPlaying, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto mb-4"></div>
          <p>楽曲情報を取得中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        <p>{error}</p>
        <button
          onClick={fetchCurrentlyPlaying}
          className="mt-4 bg-spotify-green hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Spotify 楽曲分析</h2>
        <button
          onClick={handleLogout}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          ログアウト
        </button>
      </div>

      {!currentTrack ? (
        <div className="text-center py-16">
          <p className="text-xl mb-4">現在再生中の楽曲がありません</p>
          <p className="text-spotify-gray">Spotifyで楽曲を再生してください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CurrentTrack 
              track={currentTrack} 
              audioFeatures={audioFeatures} 
            />
          </div>
          
          <div>
            <EmotionAnalysis
              audioFeatures={audioFeatures}
              trackName={currentTrack.item.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Player;