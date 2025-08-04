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
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    res.status(500).json({ error: 'Failed to fetch currently playing track' });
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
  } catch (error) {
    console.error('Error fetching audio features:', error);
    res.status(500).json({ error: 'Failed to fetch audio features' });
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
  } catch (error) {
    console.error('Error fetching audio analysis:', error);
    res.status(500).json({ error: 'Failed to fetch audio analysis' });
  }
});

export default router;