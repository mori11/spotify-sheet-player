import express from 'express';
import { SpotifyAuthService } from '../services/SpotifyAuthService';

const router = express.Router();
const authService = new SpotifyAuthService();

router.get('/login', (req, res) => {
  const authUrl = authService.getAuthorizationUrl();
  res.json({ authUrl });
});

router.post('/callback', async (req, res) => {
  const { code } = req.body;
  
  try {
    const tokens = await authService.exchangeCodeForTokens(code);
    res.json(tokens);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(400).json({ error: 'Authentication failed' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(400).json({ error: 'Token refresh failed' });
  }
});

export default router;