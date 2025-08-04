import axios from 'axios';

export class SpotifyApiService {
  private accessToken: string;
  private baseURL = 'https://api.spotify.com/v1';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  async getCurrentlyPlaying() {
    try {
      const response = await axios.get(`${this.baseURL}/me/player/currently-playing`, {
        headers: this.getHeaders()
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 204) {
        return null;
      }
      throw error;
    }
  }

  async getAudioFeatures(trackId: string) {
    const response = await axios.get(`${this.baseURL}/audio-features/${trackId}`, {
      headers: this.getHeaders()
    });
    
    return response.data;
  }

  async getAudioAnalysis(trackId: string) {
    const response = await axios.get(`${this.baseURL}/audio-analysis/${trackId}`, {
      headers: this.getHeaders()
    });
    
    return response.data;
  }

  async getTrack(trackId: string) {
    const response = await axios.get(`${this.baseURL}/tracks/${trackId}`, {
      headers: this.getHeaders()
    });
    
    return response.data;
  }

  async getUserProfile() {
    const response = await axios.get(`${this.baseURL}/me`, {
      headers: this.getHeaders()
    });
    
    return response.data;
  }
}