import { useState, useEffect } from 'react';

interface EmotionAnalysisProps {
  lyrics: string;
  audioFeatures?: {
    valence?: number;
    energy?: number;
    danceability?: number;
    acousticness?: number;
  };
}

interface EmotionData {
  mood: string;
  color: string;
  emoji: string;
  description: string;
}

function EmotionAnalysis({ lyrics, audioFeatures }: EmotionAnalysisProps) {
  const [emotion, setEmotion] = useState<EmotionData | null>(null);

  useEffect(() => {
    // 簡易的な感情分析（実際にはNLP APIを使用すべき）
    const analyzeEmotion = () => {
      const valence = audioFeatures?.valence || 0.5;
      const energy = audioFeatures?.energy || 0.5;
      
      let mood: EmotionData;
      
      if (valence > 0.7 && energy > 0.7) {
        mood = {
          mood: '喜び・興奮',
          color: 'from-yellow-400 to-orange-400',
          emoji: '😄🎉',
          description: '明るく元気な曲です'
        };
      } else if (valence > 0.7 && energy <= 0.7) {
        mood = {
          mood: '幸せ・穏やか',
          color: 'from-green-400 to-blue-400',
          emoji: '😊🌸',
          description: '穏やかで幸せな雰囲気の曲です'
        };
      } else if (valence <= 0.3 && energy > 0.7) {
        mood = {
          mood: '怒り・激情',
          color: 'from-red-600 to-red-400',
          emoji: '😠🔥',
          description: '激しく情熱的な曲です'
        };
      } else if (valence <= 0.3 && energy <= 0.3) {
        mood = {
          mood: '悲しみ・憂鬱',
          color: 'from-blue-600 to-purple-600',
          emoji: '😢💔',
          description: '悲しく切ない雰囲気の曲です'
        };
      } else if (valence <= 0.3) {
        mood = {
          mood: 'メランコリー',
          color: 'from-purple-500 to-pink-500',
          emoji: '😔🌙',
          description: '物憂げな雰囲気の曲です'
        };
      } else {
        mood = {
          mood: 'ニュートラル',
          color: 'from-gray-400 to-gray-600',
          emoji: '😐🎵',
          description: 'バランスの取れた曲です'
        };
      }
      
      setEmotion(mood);
    };

    analyzeEmotion();
  }, [lyrics, audioFeatures]);

  if (!emotion) return null;

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-400 mb-2">感情分析</h4>
      <div className={`bg-gradient-to-r ${emotion.color} p-3 rounded-md`}>
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="font-bold text-lg">{emotion.mood}</p>
            <p className="text-sm opacity-90">{emotion.description}</p>
          </div>
          <div className="text-3xl">{emotion.emoji}</div>
        </div>
      </div>
      
      {audioFeatures && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-700 p-2 rounded">
            <span className="text-gray-400">明るさ:</span>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
              <div 
                className="bg-spotify-green h-2 rounded-full"
                style={{ width: `${(audioFeatures.valence || 0) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <span className="text-gray-400">エネルギー:</span>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
              <div 
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${(audioFeatures.energy || 0) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmotionAnalysis;