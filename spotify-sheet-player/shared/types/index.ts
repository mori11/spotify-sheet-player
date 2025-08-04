export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  popularity: number;
}

export interface SpotifyCurrentlyPlaying {
  item: SpotifyTrack | null;
  is_playing: boolean;
  progress_ms: number;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  timestamp: number;
}

export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export interface SpotifyAudioAnalysis {
  meta: {
    analyzer_version: string;
    platform: string;
    detailed_status: string;
    status_code: number;
    timestamp: number;
    analysis_time: number;
    input_process: string;
  };
  track: {
    num_samples: number;
    duration: number;
    sample_md5: string;
    offset_seconds: number;
    window_seconds: number;
    analysis_sample_rate: number;
    analysis_channels: number;
    end_of_fade_in: number;
    start_of_fade_out: number;
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    time_signature: number;
    time_signature_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
  };
  bars: Array<{
    start: number;
    duration: number;
    confidence: number;
  }>;
  beats: Array<{
    start: number;
    duration: number;
    confidence: number;
  }>;
  sections: Array<{
    start: number;
    duration: number;
    confidence: number;
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
    time_signature: number;
    time_signature_confidence: number;
  }>;
  segments: Array<{
    start: number;
    duration: number;
    confidence: number;
    loudness_start: number;
    loudness_max_time: number;
    loudness_max: number;
    loudness_end: number;
    pitches: number[];
    timbre: number[];
  }>;
  tatums: Array<{
    start: number;
    duration: number;
    confidence: number;
  }>;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SheetMusicData {
  key: number;
  mode: number;
  tempo: number;
  time_signature: number;
  notes: Array<{
    pitch: string;
    duration: string;
    octave: number;
  }>;
}