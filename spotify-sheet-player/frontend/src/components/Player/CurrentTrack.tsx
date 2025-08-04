interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
}

interface CurrentlyPlaying {
  item: Track;
  is_playing: boolean;
  progress_ms: number;
}

interface AudioFeatures {
  key: number;
  mode: number;
  tempo: number;
  time_signature: number;
  danceability: number;
  energy: number;
  valence: number;
}

interface CurrentTrackProps {
  track: CurrentlyPlaying;
  audioFeatures: AudioFeatures | null;
}

const keyNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const modeNames = ['Minor', 'Major'];

function CurrentTrack({ track, audioFeatures }: CurrentTrackProps) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getKeySignature = () => {
    if (!audioFeatures) return 'Unknown';
    const key = keyNames[audioFeatures.key] || 'Unknown';
    const mode = modeNames[audioFeatures.mode] || 'Unknown';
    return `${key} ${mode}`;
  };

  const albumImage = track.item.album.images[0]?.url;

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">現在再生中</h3>
      
      <div className="flex items-start space-x-4 mb-6">
        {albumImage && (
          <img
            src={albumImage}
            alt={track.item.album.name}
            className="w-24 h-24 rounded-lg"
          />
        )}
        
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white">
            {track.item.name}
          </h4>
          <p className="text-spotify-gray">
            {track.item.artists.map(artist => artist.name).join(', ')}
          </p>
          <p className="text-sm text-spotify-gray">
            {track.item.album.name}
          </p>
          
          <div className="flex items-center mt-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${track.is_playing ? 'bg-spotify-green' : 'bg-gray-500'}`}></div>
            <span className="text-sm">
              {track.is_playing ? '再生中' : '一時停止中'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-spotify-gray mb-1">
          <span>{formatDuration(track.progress_ms)}</span>
          <span>{formatDuration(track.item.duration_ms)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div
            className="bg-spotify-green h-1 rounded-full"
            style={{
              width: `${(track.progress_ms / track.item.duration_ms) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Audio Features */}
      {audioFeatures && (
        <div>
          <h5 className="font-semibold mb-3">楽曲分析</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-spotify-gray">キー:</span>
              <span className="ml-2 text-white">{getKeySignature()}</span>
            </div>
            <div>
              <span className="text-spotify-gray">テンポ:</span>
              <span className="ml-2 text-white">{Math.round(audioFeatures.tempo)} BPM</span>
            </div>
            <div>
              <span className="text-spotify-gray">拍子:</span>
              <span className="ml-2 text-white">{audioFeatures.time_signature}/4</span>
            </div>
            <div>
              <span className="text-spotify-gray">エネルギー:</span>
              <span className="ml-2 text-white">{Math.round(audioFeatures.energy * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentTrack;