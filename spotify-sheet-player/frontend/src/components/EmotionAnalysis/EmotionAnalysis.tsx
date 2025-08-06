import { useState, useEffect } from 'react';

interface EmotionAnalysisProps {
  audioFeatures?: {
    valence?: number;
    energy?: number;
    danceability?: number;
    acousticness?: number;
    tempo?: number;
    key?: number;
    mode?: number;
  };
  trackName?: string;
}

interface EmotionData {
  mood: string;
  color: string;
  emoji: string;
  description: string;
  textColor: string;
}

function EmotionAnalysis({ audioFeatures }: EmotionAnalysisProps) {
  const [emotion, setEmotion] = useState<EmotionData | null>(null);

  useEffect(() => {
    const analyzeEmotion = () => {
      const valence = audioFeatures?.valence || 0.5;
      const energy = audioFeatures?.energy || 0.5;
      
      let mood: EmotionData;
      
      if (valence > 0.7 && energy > 0.7) {
        mood = {
          mood: '喜び・興奮',
          color: 'from-yellow-400 to-orange-400',
          emoji: '😄🎉',
          description: '明るく元気な曲です！踊りたくなるような楽しい雰囲気',
          textColor: 'text-yellow-900'
        };
      } else if (valence > 0.7 && energy <= 0.7) {
        mood = {
          mood: '幸せ・穏やか',
          color: 'from-green-400 to-blue-400',
          emoji: '😊🌸',
          description: '穏やかで幸せな雰囲気。リラックスできる心地よい曲',
          textColor: 'text-green-900'
        };
      } else if (valence <= 0.3 && energy > 0.7) {
        mood = {
          mood: '怒り・激情',
          color: 'from-red-600 to-red-400',
          emoji: '😠🔥',
          description: '激しく情熱的な曲。強い感情を表現している',
          textColor: 'text-white'
        };
      } else if (valence <= 0.3 && energy <= 0.3) {
        mood = {
          mood: '悲しみ・憂鬱',
          color: 'from-blue-600 to-purple-600',
          emoji: '😢💔',
          description: '悲しく切ない雰囲気。感傷的になりたい時に',
          textColor: 'text-white'
        };
      } else if (valence <= 0.3) {
        mood = {
          mood: 'メランコリー',
          color: 'from-purple-500 to-pink-500',
          emoji: '😔🌙',
          description: '物憂げで内省的な雰囲気。考え事をしたい時に',
          textColor: 'text-white'
        };
      } else {
        mood = {
          mood: 'ニュートラル',
          color: 'from-gray-400 to-gray-600',
          emoji: '😐🎵',
          description: 'バランスの取れた楽曲。どんな場面にも合います',
          textColor: 'text-white'
        };
      }
      
      setEmotion(mood);
    };

    if (audioFeatures) {
      analyzeEmotion();
    }
  }, [audioFeatures]);

  if (!emotion || !audioFeatures) return null;

  const keyNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
  const keyName = keyNames[audioFeatures.key || 0];
  const modeName = audioFeatures.mode === 1 ? 'メジャー' : 'マイナー';

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">楽曲分析</h3>
      
      {/* メイン感情表示 */}
      <div className={`bg-gradient-to-r ${emotion.color} p-6 rounded-lg mb-6`}>
        <div className={`flex items-center justify-between ${emotion.textColor}`}>
          <div className="flex-1">
            <h4 className="text-2xl font-bold mb-2">{emotion.mood}</h4>
            <p className="text-lg opacity-90">{emotion.description}</p>
          </div>
          <div className="text-5xl ml-4">{emotion.emoji}</div>
        </div>
      </div>

      {/* 音楽的特徴 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-300 mb-3">基本情報</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">調性:</span>
              <span>{keyName} {modeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">テンポ:</span>
              <span>{Math.round(audioFeatures.tempo || 120)} BPM</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-300 mb-3">雰囲気</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">明るさ:</span>
              <span>{Math.round((audioFeatures.valence || 0) * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">エネルギー:</span>
              <span>{Math.round((audioFeatures.energy || 0) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細な音楽的特徴 */}
      <div className="space-y-3">
        <h5 className="font-semibold text-gray-300">詳細分析</h5>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">明るさ (Valence)</span>
              <span>{Math.round((audioFeatures.valence || 0) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${(audioFeatures.valence || 0) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">エネルギー</span>
              <span>{Math.round((audioFeatures.energy || 0) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(audioFeatures.energy || 0) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">踊りやすさ</span>
              <span>{Math.round((audioFeatures.danceability || 0) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(audioFeatures.danceability || 0) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">アコースティック</span>
              <span>{Math.round((audioFeatures.acousticness || 0) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(audioFeatures.acousticness || 0) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmotionAnalysis;