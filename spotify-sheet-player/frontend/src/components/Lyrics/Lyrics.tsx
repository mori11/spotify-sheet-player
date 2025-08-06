import { useState, useEffect, useRef } from 'react';
import { spotifyService } from '../../services/spotify';
import EmotionAnalysis from './EmotionAnalysis';

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
}

interface LyricsProps {
  track: Track;
  progress_ms: number;
  is_playing: boolean;
  audioFeatures?: any;
}

interface LyricLine {
  startTimeMs: number;
  words: string;
  translation?: string;
}

function Lyrics({ track, progress_ms, is_playing, audioFeatures }: LyricsProps) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // 歌詞を取得
  const fetchLyrics = async () => {
    if (!track?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const lyricsData = await spotifyService.getLyrics(track.id);
      setLyrics(lyricsData.lines || []);
    } catch (err: any) {
      console.error('Error fetching lyrics:', err);
      setError('歌詞を取得できませんでした');
      
      // デモ用のサンプル歌詞
      setLyrics([
        { startTimeMs: 0, words: '♪ イントロ ♪' },
        { startTimeMs: 10000, words: 'ここに歌詞が表示されます' },
        { startTimeMs: 20000, words: 'Spotifyの歌詞APIが利用可能になると' },
        { startTimeMs: 30000, words: 'リアルタイムで歌詞が同期されます' },
        { startTimeMs: 40000, words: 'カラオケのように楽しめます' },
        { startTimeMs: 50000, words: '♪ 間奏 ♪' },
        { startTimeMs: 60000, words: '翻訳機能も実装予定です' },
        { startTimeMs: 70000, words: '感情分析で曲の雰囲気も表示します' },
        { startTimeMs: 80000, words: '♪ エンディング ♪' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 現在の再生位置に基づいて歌詞をハイライト
  useEffect(() => {
    if (!lyrics.length) return;

    const currentLine = lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1];
      return progress_ms >= line.startTimeMs && 
             (!nextLine || progress_ms < nextLine.startTimeMs);
    });

    if (currentLine !== -1 && currentLine !== currentLineIndex) {
      setCurrentLineIndex(currentLine);
      
      // 自動スクロール
      if (lyricsContainerRef.current) {
        const lineElement = lyricsContainerRef.current.children[currentLine] as HTMLElement;
        if (lineElement) {
          lineElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [progress_ms, lyrics, currentLineIndex]);

  useEffect(() => {
    fetchLyrics();
  }, [track?.id]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto mb-4"></div>
          <p>歌詞を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">歌詞</h3>
        <div className="space-x-2">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            {showTranslation ? '原文' : '翻訳'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8 text-gray-400">
          <p>{error}</p>
        </div>
      ) : (
        <div
          ref={lyricsContainerRef}
          className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 relative"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.5) 100%)'
          }}
        >
          {/* カラオケ風のセンターライン */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-spotify-green opacity-20 pointer-events-none"></div>
          
          <div className="py-32">
            {lyrics.map((line, index) => (
              <div
                key={index}
                className={`
                  py-4 px-8 transition-all duration-300 text-center relative
                  ${index === currentLineIndex 
                    ? 'text-spotify-green text-3xl font-bold scale-110 drop-shadow-[0_0_20px_rgba(30,215,96,0.5)]' 
                    : index < currentLineIndex 
                      ? 'text-gray-600 text-xl opacity-50' 
                      : 'text-gray-400 text-xl'
                  }
                `}
              >
                <p className="leading-relaxed">{line.words}</p>
                {showTranslation && line.translation && (
                  <p className="text-sm mt-2 text-gray-500">{line.translation}</p>
                )}
                
                {/* 現在の行にカラオケ風のハイライト効果 */}
                {index === currentLineIndex && is_playing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-spotify-green/10 to-transparent animate-pulse pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <EmotionAnalysis 
        lyrics={lyrics.map(l => l.words).join(' ')}
        audioFeatures={audioFeatures}
      />

      <div className="mt-4 text-sm text-spotify-gray">
        <p>※ 歌詞機能は開発中です。Spotify APIの制限により、実際の歌詞は表示されない場合があります。</p>
      </div>
    </div>
  );
}

export default Lyrics;