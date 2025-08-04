import { useEffect, useRef, useState } from 'react';
import { generateBasicSheet } from '../../utils/sheetGenerator';

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
}

interface AudioFeatures {
  key: number;
  mode: number;
  tempo: number;
  time_signature: number;
}

interface SheetMusicProps {
  track: Track;
  audioFeatures: AudioFeatures | null;
}

function SheetMusic({ track, audioFeatures }: SheetMusicProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSheet = async () => {
    if (!sheetRef.current || !audioFeatures) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Clear previous sheet
      sheetRef.current.innerHTML = '';
      
      // Generate basic sheet music based on audio features
      await generateBasicSheet(sheetRef.current, audioFeatures);
    } catch (err) {
      console.error('Error generating sheet:', err);
      setError('楽譜の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (track && audioFeatures) {
      generateSheet();
    }
  }, [track, audioFeatures]);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">楽譜</h3>
        <button
          onClick={generateSheet}
          disabled={isGenerating || !audioFeatures}
          className="bg-spotify-green hover:bg-green-600 disabled:bg-gray-500 text-white px-4 py-2 rounded text-sm"
        >
          {isGenerating ? '生成中...' : '楽譜を生成'}
        </button>
      </div>

      {!audioFeatures ? (
        <div className="text-center py-16 text-spotify-gray">
          <p>楽曲の分析データを取得中...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-400">
          <p>{error}</p>
          <button
            onClick={generateSheet}
            className="mt-4 bg-spotify-green hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            再試行
          </button>
        </div>
      ) : isGenerating ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto mb-4"></div>
          <p>楽譜を生成中...</p>
        </div>
      ) : (
        <div>
          <div
            ref={sheetRef}
            className="bg-white rounded p-4 min-h-[300px] overflow-x-auto"
          />
          
          <div className="mt-4 text-sm text-spotify-gray">
            <p className="mb-2">
              ※ これは音楽分析データに基づく簡易的な楽譜です
            </p>
            <p>
              実際の楽曲とは異なる場合があります
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SheetMusic;