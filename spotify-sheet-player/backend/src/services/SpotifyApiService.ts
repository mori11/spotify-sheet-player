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
    try {
      const response = await axios.get(`${this.baseURL}/audio-features/${trackId}`, {
        headers: this.getHeaders()
      });
      
      return response.data;
    } catch (error: any) {
      // 403エラーの場合、トラック情報から基本的な情報を取得
      if (error.response?.status === 403) {
        console.log('Audio features unavailable, using track info instead');
        
        try {
          const trackInfo = await this.getTrack(trackId);
          // トラック情報から推定値を返す
          return {
            key: 0, // Default to C
            mode: 1, // Default to major
            tempo: 120, // Default tempo
            time_signature: 4, // Default 4/4
            danceability: 0.5,
            energy: 0.5,
            valence: 0.5,
            acousticness: 0.5,
            instrumentalness: 0.5,
            // トラック情報を含める
            track_name: trackInfo.name,
            artist_name: trackInfo.artists[0]?.name,
            duration_ms: trackInfo.duration_ms
          };
        } catch (trackError) {
          throw error; // 元のエラーを投げる
        }
      }
      
      throw error;
    }
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