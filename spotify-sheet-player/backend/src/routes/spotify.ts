import express from 'express';
import { SpotifyApiService } from '../services/SpotifyApiService';

const router = express.Router();

router.get('/currently-playing', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });  
  }

  try {
    const spotifyService = new SpotifyApiService(token);
    const currentTrack = await spotifyService.getCurrentlyPlaying();
    res.json(currentTrack);
  } catch (error: any) {
    console.error('Error fetching currently playing:', error);
    
    // Spotifyのエラーレスポンスを詳細に返す
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: error.response.data.error || 'Spotify API error',
        message: error.response.data.error_description || error.message
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch currently playing track', message: error.message });
  }
});

router.get('/audio-features/:trackId', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  const { trackId } = req.params;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });  
  }

  try {
    const spotifyService = new SpotifyApiService(token);
    const audioFeatures = await spotifyService.getAudioFeatures(trackId);
    res.json(audioFeatures);
  } catch (error: any) {
    console.error('Error fetching audio features:', error);
    
    // Spotifyのエラーレスポンスを詳細に返す
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: error.response.data.error || 'Spotify API error',
        message: error.response.data.error_description || error.message
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch audio features', message: error.message });
  }
});

router.get('/audio-analysis/:trackId', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  const { trackId } = req.params;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });  
  }

  try {
    const spotifyService = new SpotifyApiService(token);
    const audioAnalysis = await spotifyService.getAudioAnalysis(trackId);
    res.json(audioAnalysis);
  } catch (error: any) {
    console.error('Error fetching audio analysis:', error);
    
    // Spotifyのエラーレスポンスを詳細に返す
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: error.response.data.error || 'Spotify API error',
        message: error.response.data.error_description || error.message
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch audio analysis', message: error.message });
  }
});

router.get('/lyrics/:trackId', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  const { trackId } = req.params;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });  
  }

  try {
    const spotifyService = new SpotifyApiService(token);
    // 注: Spotify Web APIには公式の歌詞エンドポイントがありません
    // 実装には代替手段が必要です（Musixmatch API、Genius APIなど）
    
    // デモ用のサンプルレスポンス
    const sampleLyrics = {
      lines: [
        { startTimeMs: 0, words: '♪ イントロ ♪' },
        { startTimeMs: 10000, words: 'ここに歌詞が表示されます' },
        { startTimeMs: 20000, words: 'Spotifyの歌詞APIが利用可能になると' },
        { startTimeMs: 30000, words: 'リアルタイムで歌詞が同期されます' },
        { startTimeMs: 40000, words: 'カラオケのように楽しめます' },
      ],
      syncType: 'LINE_SYNCED',
      language: 'ja',
      isRtlLanguage: false
    };
    
    res.json(sampleLyrics);
  } catch (error: any) {
    console.error('Error fetching lyrics:', error);
    res.status(500).json({ error: 'Failed to fetch lyrics', message: error.message });
  }
});

export default router;