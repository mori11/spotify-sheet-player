// CSP対応のPDF生成クラス
export class ClientSidePDFGenerator {
  constructor() {}

  async generatePDF(track: any, audioFeatures: any): Promise<void> {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('ポップアップがブロックされました。ポップアップを許可してください。');
      return;
    }

    const key = audioFeatures?.key ?? 0;
    const mode = audioFeatures?.mode ?? 1;
    const tempo = audioFeatures?.tempo ?? 120;
    const timeSignature = audioFeatures?.time_signature ?? 4;
    const energy = audioFeatures?.energy ?? 0.5;
    const valence = audioFeatures?.valence ?? 0.5;
    
    const keyNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
    const keyName = keyNames[key] || 'C';
    const modeName = mode === 1 ? 'メジャー' : 'マイナー';
    
    const style = energy > 0.7 ? 'エネルギッシュ' : (energy < 0.3 ? '穏やか' : 'ミディアム');
    const mood = valence > 0.7 ? '明るい' : (valence < 0.3 ? '暗い' : 'ニュートラル');

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${track?.name || '楽曲'} - 楽譜</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .artist {
            font-size: 18px;
            color: #666;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }
        .info-section h3 {
            font-size: 16px;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .info-item {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .scale-section {
            margin-bottom: 40px;
            background: #f8f8f8;
            padding: 20px;
            border-radius: 8px;
        }
        .scale-notes {
            font-size: 20px;
            letter-spacing: 3px;
            text-align: center;
            font-weight: bold;
            margin: 20px 0;
        }
        .chord-section {
            margin-bottom: 40px;
            background: #f0f0f0;
            padding: 20px;
            border-radius: 8px;
        }
        .chord-progression {
            font-size: 18px;
            text-align: center;
            font-weight: bold;
            margin: 15px 0;
        }
        .rhythm-section {
            border: 3px solid #333;
            padding: 30px;
            margin-bottom: 40px;
            background: #fafafa;
        }
        .rhythm-notation {
            font-size: 32px;
            text-align: center;
            margin: 25px 0;
            font-family: 'Courier New', monospace;
        }
        .melody-notation {
            font-size: 24px;
            text-align: center;
            margin: 25px 0;
            line-height: 2;
        }
        .footer {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 40px;
            border-top: 1px solid #ccc;
            padding-top: 20px;
        }
        .measure-bars {
            font-size: 40px;
            text-align: center;
            margin: 20px 0;
            font-family: 'Times New Roman', serif;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${track?.name || '楽曲'}</div>
        <div class="artist">${track?.artists?.[0]?.name || 'アーティスト不明'}</div>
    </div>

    <div class="info-grid">
        <div class="info-section">
            <h3>基本情報</h3>
            <div class="info-item"><strong>調性:</strong> ${keyName} ${modeName}</div>
            <div class="info-item"><strong>テンポ:</strong> ${Math.round(tempo)} BPM</div>
            <div class="info-item"><strong>拍子:</strong> ${timeSignature}/4</div>
        </div>
        
        <div class="info-section">
            <h3>音楽的特徴</h3>
            <div class="info-item"><strong>スタイル:</strong> ${style}</div>
            <div class="info-item"><strong>雰囲気:</strong> ${mood}</div>
            <div class="info-item"><strong>エネルギー:</strong> ${Math.round(energy * 100)}%</div>
        </div>
    </div>

    <div class="scale-section">
        <h3>スケール（音階）</h3>
        <div class="scale-notes">${this.generateScaleNotes(keyName, mode === 0)}</div>
    </div>

    <div class="chord-section">
        <h3>推奨コード進行</h3>
        <div class="chord-progression">${this.generateChordProgression(keyName, modeName, tempo)}</div>
    </div>

    <div class="rhythm-section">
        <h3>楽譜 (${timeSignature}/4拍子)</h3>
        <div class="measure-bars">| ${this.generateMeasureBars(timeSignature)} |</div>
        <div class="rhythm-notation">${this.generateRhythmNotation(timeSignature, tempo)}</div>
        <div class="melody-notation">${this.generateMelodyNotation(keyName, mode === 0, timeSignature)}</div>
    </div>

    <div class="footer">
        <p>この楽譜はSpotifyの音楽分析データと音楽理論に基づいて自動生成されました</p>
        <p>実際の楽曲とは異なる場合がありますが、楽曲の特徴を反映した練習用楽譜として使用できます</p>
        <p>生成日時: ${new Date().toLocaleString('ja-JP')}</p>
    </div>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    
    // 印刷ダイアログを表示
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  private generateScaleNotes(_keyName: string, isMinor: boolean): string {
    const majorScale = ['ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ'];
    const minorScale = ['ラ', 'シ', 'ド', 'レ', 'ミ', 'ファ', 'ソ'];
    const scale = isMinor ? minorScale : majorScale;
    return scale.join(' - ');
  }

  private generateChordProgression(key: string, mode: string, tempo: number): string {
    if (mode === 'メジャー') {
      if (tempo > 140) {
        return `${key} - ${key}7 - ${key} - ${key}7 (パワーコード推奨)`;
      } else if (tempo < 80) {
        return `${key}M7 - ${key}6 - ${key}M7 - ${key}6 (ジャズ風)`;
      } else {
        return `${key} - G - Am - F (ポップス進行)`;
      }
    } else {
      return `${key}m - ${key}m7 - ${key}m6 - ${key}m (マイナー進行)`;
    }
  }

  private generateRhythmNotation(_timeSignature: number, tempo: number): string {
    const fastRhythm = '♪ ♪ ♪ ♪ | ♪ ♪ ♪ ♪';
    const slowRhythm = '♩ ♩ ♩ ♩ | ♩ ♩ ♩ ♩';
    const mixedRhythm = '♩ ♪♪ ♩ ♩ | ♩ ♪♪ ♩ ♩';
    
    if (tempo > 140) return fastRhythm;
    if (tempo < 80) return slowRhythm;
    return mixedRhythm;
  }

  private generateMelodyNotation(_key: string, isMinor: boolean, timeSignature: number): string {
    const notes = isMinor ? ['ラ', 'シ', 'ド', 'レ', 'ミ', 'ファ', 'ソ'] : ['ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ'];
    const melody = [];
    for (let i = 0; i < timeSignature * 2; i++) {
      melody.push(notes[i % notes.length]);
    }
    return melody.join(' ');
  }

  private generateMeasureBars(timeSignature: number): string {
    const bars = [];
    for (let i = 0; i < timeSignature; i++) {
      bars.push('♩');
    }
    return bars.join(' ');
  }
}