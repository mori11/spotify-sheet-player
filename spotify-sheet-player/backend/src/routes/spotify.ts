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

export default router;