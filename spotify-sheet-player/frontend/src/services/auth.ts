import axios from 'axios';

const API_BASE = 'https://spotify-sheet-player-production.up.railway.app/api';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const getAuthUrl = async (): Promise<string> => {
  try {
    const response = await axios.get(`${API_BASE}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // ブラウザ拡張機能による干渉を回避
      withCredentials: false,
    });
    return response.data.authUrl;
  } catch (error: any) {
    console.error('Auth URL request failed:', error);
    
    // より詳細なエラー情報を提供
    if (error.response) {
      throw new Error(`サーバーエラー: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('サーバーに接続できません。ネットワーク接続を確認してください。');
    } else {
      throw new Error('認証の初期化に失敗しました。');
    }
  }
};

export const handleAuthCallback = async (code: string): Promise<AuthTokens> => {
  const response = await axios.post(`${API_BASE}/auth/callback`, { code });
  const tokens = response.data;
  
  // Store tokens in localStorage
  localStorage.setItem('spotify_access_token', tokens.access_token);
  localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
  localStorage.setItem('spotify_token_expires', String(Date.now() + tokens.expires_in * 1000));
  
  return tokens;
};

export const refreshAccessToken = async (): Promise<AuthTokens> => {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await axios.post(`${API_BASE}/auth/refresh`, {
    refreshToken
  });
  
  const tokens = response.data;
  
  // Update stored tokens
  localStorage.setItem('spotify_access_token', tokens.access_token);
  if (tokens.refresh_token) {
    localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
  }
  localStorage.setItem('spotify_token_expires', String(Date.now() + tokens.expires_in * 1000));
  
  return tokens;
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem('spotify_access_token');
  const expires = localStorage.getItem('spotify_token_expires');
  
  if (!token || !expires) {
    return null;
  }
  
  // Check if token is expired
  if (Date.now() > parseInt(expires)) {
    return null;
  }
  
  return token;
};

export const isTokenExpiringSoon = (): boolean => {
  const expires = localStorage.getItem('spotify_token_expires');
  if (!expires) return true;
  
  // Check if token expires within 5 minutes
  return Date.now() > (parseInt(expires) - 5 * 60 * 1000);
};

export const logout = (): void => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expires');
};