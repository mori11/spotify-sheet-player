// 音楽理論に基づいた高度な楽譜生成

interface MusicTheory {
  // メジャースケールの音程パターン（全音・半音）
  majorScalePattern: number[];
  // マイナースケールの音程パターン
  minorScalePattern: number[];
  // コード進行のパターン
  chordProgressions: { [key: string]: string[] };
  // リズムパターン
  rhythmPatterns: { [key: string]: string[] };
}

const musicTheory: MusicTheory = {
  majorScalePattern: [2, 2, 1, 2, 2, 2, 1], // 全全半全全全半
  minorScalePattern: [2, 1, 2, 2, 1, 2, 2], // 全半全全半全全
  chordProgressions: {
    'pop': ['I', 'V', 'vi', 'IV'], // C-G-Am-F
    'blues': ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'],
    'jazz': ['IIM7', 'V7', 'IM7', 'VIM7'],
    'rock': ['I', 'IV', 'V', 'IV']
  },
  rhythmPatterns: {
    '4/4': ['q', 'q', 'q', 'q'], // 四分音符 x 4
    '3/4': ['q', 'q', 'q'], // 四分音符 x 3
    '6/8': ['e', 'e', 'e', 'e', 'e', 'e'], // 八分音符 x 6
  }
};

// 音名とMIDIノート番号の対応（将来の機能拡張用）
// const noteToMidi: { [key: string]: number } = {
//   'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
//   'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68,
//   'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71
// };

// スケール生成
function generateScale(rootNote: number, isMinor: boolean): number[] {
  const pattern = isMinor ? musicTheory.minorScalePattern : musicTheory.majorScalePattern;
  const scale: number[] = [rootNote];
  
  let currentNote = rootNote;
  for (const interval of pattern) {
    currentNote += interval;
    if (currentNote <= rootNote + 12) { // 1オクターブ内
      scale.push(currentNote);
    }
  }
  
  return scale;
}

// メロディー生成アルゴリズム（将来の機能拡張用）
/*
function generateMelody(scale: number[], tempo: number, timeSignature: number): any[] {
  const melody = [];
  const measures = 4; // 4小節生成
  
  for (let measure = 0; measure < measures; measure++) {
    for (let beat = 0; beat < timeSignature; beat++) {
      // スケール内の音をランダムに選択（実際の楽曲では分析データを使用）
      const noteIndex = Math.floor(Math.random() * scale.length);
      const midiNote = scale[noteIndex];
      
      // リズムパターンを適用
      const duration = beat === 0 ? 'q' : (Math.random() > 0.7 ? 'e' : 'q');
      
      melody.push({
        midi: midiNote,
        duration: duration,
        velocity: beat === 0 ? 0.8 : 0.6 // 強拍を強調
      });
    }
  }
  
  return melody;
}
*/

// コード進行生成（将来の機能拡張用）
/*
function generateChords(key: number, mode: number, tempo: number): any[] {
  const chordType = tempo > 140 ? 'rock' : (tempo < 80 ? 'jazz' : 'pop');
  const progression = musicTheory.chordProgressions[chordType];
  
  return progression.map((chord, index) => ({
    chord: chord,
    duration: 'w', // 全音符
    position: index
  }));
}
*/

export const generateAdvancedSheet = (container: HTMLElement, audioFeatures: any, trackInfo?: any) => {
  console.log('Generating advanced sheet music...');
  console.log('Track:', trackInfo?.name, 'ID:', trackInfo?.id);
  console.log('Audio Features:', audioFeatures);
  
  const key = audioFeatures?.key ?? 0;
  const mode = audioFeatures?.mode ?? 1; // 1 = major, 0 = minor
  const tempo = audioFeatures?.tempo ?? 120;
  const timeSignature = audioFeatures?.time_signature ?? 4;
  const energy = audioFeatures?.energy ?? 0.5;
  const valence = audioFeatures?.valence ?? 0.5; // 明るさ
  
  const keyNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
  const keyName = keyNames[key] || 'C';
  const modeName = mode === 1 ? 'メジャー' : 'マイナー';
  
  // 音楽的特徴から推測
  const style = energy > 0.7 ? 'エネルギッシュ' : (energy < 0.3 ? '穏やか' : 'ミディアム');
  const mood = valence > 0.7 ? '明るい' : (valence < 0.3 ? '暗い' : 'ニュートラル');
  
  // スケール生成
  const rootMidi = 60 + key; // C4 + key
  const scale = generateScale(rootMidi, mode === 0);
  const scaleNotes = scale.map(midi => {
    const octave = Math.floor(midi / 12) - 1;
    const noteIndex = midi % 12;
    return keyNames[noteIndex] + octave;
  });
  
  // HTML楽譜を生成
  container.innerHTML = `
    <div style="padding: 20px; background: white; color: black; font-family: 'Times New Roman', serif;">
      <h3 style="margin-bottom: 20px; font-size: 20px; text-align: center;">
        ${trackInfo?.name || '楽曲'} - 音楽分析楽譜
      </h3>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div>
          <h4 style="font-size: 16px; margin-bottom: 10px; color: #333;">基本情報</h4>
          <div style="font-size: 14px; line-height: 1.8;">
            <div><strong>調性:</strong> ${keyName} ${modeName}</div>
            <div><strong>テンポ:</strong> ${Math.round(tempo)} BPM</div>
            <div><strong>拍子:</strong> ${timeSignature}/4</div>
          </div>
        </div>
        
        <div>
          <h4 style="font-size: 16px; margin-bottom: 10px; color: #333;">音楽的特徴</h4>
          <div style="font-size: 14px; line-height: 1.8;">
            <div><strong>スタイル:</strong> ${style}</div>
            <div><strong>雰囲気:</strong> ${mood}</div>
            <div><strong>エネルギー:</strong> ${Math.round(energy * 100)}%</div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h4 style="font-size: 16px; margin-bottom: 10px; color: #333;">スケール（音階）</h4>
        <div style="font-size: 18px; letter-spacing: 2px; background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${scaleNotes.join(' - ')}
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h4 style="font-size: 16px; margin-bottom: 10px; color: #333;">推奨コード進行</h4>
        <div style="font-size: 16px; background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${generateChordProgression(keyName, modeName, tempo)}
        </div>
      </div>
      
      <div style="border: 2px solid #333; padding: 20px; background: #fafafa;">
        <h4 style="font-size: 16px; margin-bottom: 15px; color: #333;">リズムパターン（${timeSignature}/4拍子）</h4>
        <div style="font-size: 24px; text-align: center; margin: 20px 0;">
          ${generateRhythmNotation(timeSignature, tempo)}
        </div>
        <div style="font-size: 20px; text-align: center; margin: 20px 0; line-height: 2;">
          ${generateMelodyNotation(scaleNotes, timeSignature)}
        </div>
      </div>
      
      <div style="margin-top: 20px; font-size: 12px; color: #666;">
        <p>※ この楽譜はSpotifyの音楽分析データと音楽理論に基づいて自動生成されました</p>
        <p>実際の楽曲とは異なる場合がありますが、楽曲の特徴を反映した練習用楽譜として使用できます</p>
      </div>
    </div>
  `;
};

// コード進行の生成
function generateChordProgression(key: string, mode: string, tempo: number): string {
  // メジャーキーのコード進行（I-V-vi-IV）
  const majorProgressions: { [key: string]: string } = {
    'C': 'C - G - Am - F',
    'C♯/D♭': 'C♯ - G♯ - A♯m - F♯',
    'D': 'D - A - Bm - G',
    'D♯/E♭': 'E♭ - B♭ - Cm - A♭',
    'E': 'E - B - C♯m - A',
    'F': 'F - C - Dm - B♭',
    'F♯/G♭': 'F♯ - C♯ - D♯m - B',
    'G': 'G - D - Em - C',
    'G♯/A♭': 'A♭ - E♭ - Fm - D♭',
    'A': 'A - E - F♯m - D',
    'A♯/B♭': 'B♭ - F - Gm - E♭',
    'B': 'B - F♯ - G♯m - E'
  };
  
  // マイナーキーのコード進行（i-iv-v-i）
  const minorProgressions: { [key: string]: string } = {
    'C': 'Cm - Fm - Gm - Cm',
    'C♯/D♭': 'C♯m - F♯m - G♯m - C♯m',
    'D': 'Dm - Gm - Am - Dm',
    'D♯/E♭': 'E♭m - A♭m - B♭m - E♭m',
    'E': 'Em - Am - Bm - Em',
    'F': 'Fm - B♭m - Cm - Fm',
    'F♯/G♭': 'F♯m - Bm - C♯m - F♯m',
    'G': 'Gm - Cm - Dm - Gm',
    'G♯/A♭': 'G♯m - C♯m - D♯m - G♯m',
    'A': 'Am - Dm - Em - Am',
    'A♯/B♭': 'B♭m - E♭m - Fm - B♭m',
    'B': 'Bm - Em - F♯m - Bm'
  };
  
  if (mode === 'メジャー') {
    const progression = majorProgressions[key] || majorProgressions['C'];
    if (tempo > 140) {
      return `${progression} (パワーコード推奨)`;
    } else if (tempo < 80) {
      return `${progression} (ジャズ風にM7やm7を追加)`;
    } else {
      return `${progression} (ポップス進行)`;
    }
  } else {
    const progression = minorProgressions[key] || minorProgressions['C'];
    return `${progression} (マイナー進行)`;
  }
}

// リズム記譜の生成
function generateRhythmNotation(_timeSignature: number, tempo: number): string {
  const fastRhythm = '♪ ♪ ♪ ♪ | ♪ ♪ ♪ ♪';
  const slowRhythm = '♩ ♩ ♩ ♩ | ♩ ♩ ♩ ♩';
  const mixedRhythm = '♩ ♪♪ ♩ ♩ | ♩ ♪♪ ♩ ♩';
  
  if (tempo > 140) return fastRhythm;
  if (tempo < 80) return slowRhythm;
  return mixedRhythm;
}

// メロディー記譜の生成
function generateMelodyNotation(scale: string[], timeSignature: number): string {
  const melody = [];
  
  // より音楽的なパターンを生成
  const patterns = [
    [0, 2, 4, 2], // 上昇パターン
    [4, 2, 0, 1], // 下降パターン
    [0, 4, 2, 5], // アルペジオ風
    [0, 0, 3, 5], // リピートパターン
  ];
  
  // スケールの長さに基づいてパターンを選択
  const patternIndex = scale.length % patterns.length;
  const pattern = patterns[patternIndex];
  
  for (let i = 0; i < timeSignature * 2; i++) {
    const patternPos = i % pattern.length;
    const noteIndex = pattern[patternPos] % scale.length;
    melody.push(scale[noteIndex]);
  }
  
  return melody.join(' - ');
}