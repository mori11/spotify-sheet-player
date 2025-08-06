import { useEffect, useRef, useState } from 'react';
import { generateBasicSheet } from '../../utils/sheetGenerator';
import { generateSimpleSheet } from '../../utils/simpleSheetGenerator';
import { generateAdvancedSheet } from '../../utils/advancedSheetGenerator';
import { ClientSidePDFGenerator } from '../../utils/pdfGenerator';

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
  is_estimated?: boolean;
}

interface SheetMusicProps {
  track: Track;
  audioFeatures: AudioFeatures | null;
}

function SheetMusic({ track, audioFeatures }: SheetMusicProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfGenerator] = useState(() => new ClientSidePDFGenerator());

  const generateSheet = async () => {
    console.log('Generate sheet button clicked!');
    console.log('sheetRef.current:', sheetRef.current);
    console.log('audioFeatures:', audioFeatures);
    console.log('track:', track);
    
    if (!sheetRef.current) {
      console.error('sheetRef.current is null!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    console.log('Starting sheet generation...');

    try {
      // Clear previous sheet
      sheetRef.current.innerHTML = '<div style="padding: 20px;">楽譜を生成中...</div>';
      
      // Generate basic sheet music with default values if no audio features
      const defaultFeatures = audioFeatures || {
        key: 0, // C major
        mode: 1, // Major
        tempo: 120, // Default tempo
        time_signature: 4 // 4/4 time
      };
      
      console.log('Using features:', defaultFeatures);
      
      await generateBasicSheet(sheetRef.current, defaultFeatures);
    } catch (err) {
      console.error('Error generating sheet with VexFlow:', err);
      console.log('Falling back to simple sheet generation');
      
      const fallbackFeatures = audioFeatures || {
        key: 0, // C major
        mode: 1, // Major
        tempo: 120, // Default tempo
        time_signature: 4 // 4/4 time
      };
      
      try {
        // VexFlowが失敗した場合、高度な楽譜を生成
        console.log('Trying advanced sheet generation...');
        generateAdvancedSheet(sheetRef.current, fallbackFeatures, track);
        console.log('Advanced sheet generation completed');
      } catch (simpleErr) {
        console.error('Error generating advanced sheet:', simpleErr);
        // 最終的なフォールバック
        try {
          console.log('Trying simple sheet generation...');
          generateSimpleSheet(sheetRef.current, fallbackFeatures);
          console.log('Simple sheet generation completed');
        } catch (finalErr) {
          console.error('Error generating simple sheet:', finalErr);
          setError('楽譜の生成に失敗しました');
        }
      }
    } finally {
      console.log('Sheet generation process completed');
      setIsGenerating(false);
    }
  };

  const handlePDFDownload = async () => {
    console.log('PDF download button clicked!');
    try {
      await pdfGenerator.generatePDF(track, audioFeatures);
    } catch (error) {
      console.error('PDF生成エラー:', error);
      alert('PDF生成に失敗しました');
    }
  };

  useEffect(() => {
    if (track) {
      generateSheet();
    }
  }, [track, audioFeatures]);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">楽譜</h3>
        <div className="space-x-2">
          <button
            onClick={handlePDFDownload}
            className="bg-spotify-green hover:bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor"/>
              <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8M16 17H8M10 9H8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            フル楽譜PDF生成
          </button>
        </div>
      </div>

      {error ? (
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
            {!audioFeatures ? (
              <p className="mb-2 text-yellow-400">
                ⚠️ 楽曲の詳細分析データが取得できないため、デフォルト設定で楽譜を生成しました
              </p>
            ) : audioFeatures.is_estimated ? (
              <p className="mb-2 text-yellow-400">
                ⚠️ Spotify APIの制限により、楽曲IDから推定した音楽的特徴で楽譜を生成しました
              </p>
            ) : (
              <p className="mb-2 text-green-400">
                ✅ 楽曲の詳細分析データを使用して楽譜を生成しました
              </p>
            )}
            {audioFeatures && (
              <div className="mb-2 text-xs bg-gray-800 p-2 rounded">
                <p>デバッグ情報: キー={audioFeatures.key}, モード={audioFeatures.mode}, テンポ={Math.round(audioFeatures.tempo || 120)}</p>
              </div>
            )}
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