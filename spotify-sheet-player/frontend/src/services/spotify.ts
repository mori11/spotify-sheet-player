import axios from 'axios';
import { getAccessToken, refreshAccessToken, isTokenExpiringSoon } from './auth';

const API_BASE = 'https://spotify-sheet-player-production.up.railway.app/api';

class SpotifyService {
  private async getValidToken(): Promise<string> {
    let token = getAccessToken();
    
    if (!token || isTokenExpiringSoon()) {
      try {
        await refreshAccessToken();
        token = getAccessToken();
      } catch (error) {
        throw new Error('Failed to refresh token');
      }
    }
    
    if (!token) {
      throw new Error('No valid token available');
    }
    
    return token;
  }

  async getCurrentlyPlaying() {
    const token = await this.getValidToken();
    
    const response = await axios.get(`${API_BASE}/spotify/currently-playing`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  }

  async getAudioFeatures(trackId: string) {
    const token = await this.getValidToken();
    
    const response = await axios.get(`${API_BASE}/spotify/audio-features/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  }

  async getAudioAnalysis(trackId: string) {
    const token = await this.getValidToken();
    
    const response = await axios.get(`${API_BASE}/spotify/audio-analysis/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  }
}

export const spotifyService = new SpotifyService();