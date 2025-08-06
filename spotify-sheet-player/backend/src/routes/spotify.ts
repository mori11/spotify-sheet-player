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
    
    // まず、トラック情報を取得
    const trackInfo = await spotifyService.getTrack(trackId);
    const artist = trackInfo.artists[0]?.name;
    const title = trackInfo.name;
    
    console.log(`Searching lyrics for: ${artist} - ${title}`);
    
    // 外部APIから歌詞を取得
    const lyricsData = await spotifyService.getLyricsFromExternal(artist, title);
    
    if (lyricsData) {
      console.log(`Found lyrics from ${lyricsData.source}`);
      res.json(lyricsData);
    } else {
      // 歌詞が見つからない場合はデフォルト
      console.log('No lyrics found, returning sample data');
      const sampleLyrics = {
        lines: [
          { startTimeMs: 0, words: '♪ 歌詞が見つかりませんでした ♪' },
          { startTimeMs: 10000, words: `アーティスト: ${artist}` },
          { startTimeMs: 20000, words: `楽曲: ${title}` },
          { startTimeMs: 30000, words: '歌詞データベースに登録されていない可能性があります' },
        ],
        syncType: 'LINE_SYNCED',
        language: 'ja',
        isRtlLanguage: false,
        source: 'sample'
      };
      
      res.json(sampleLyrics);
    }
  } catch (error: any) {
    console.error('Error fetching lyrics:', error);
    res.status(500).json({ error: 'Failed to fetch lyrics', message: error.message });
  }
});

export default router;