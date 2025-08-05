// シンプルな楽譜生成（VexFlowを使わない）
export const generateSimpleSheet = (container: HTMLElement, audioFeatures: any) => {
  console.log('Generating simple sheet music...');
  
  const key = audioFeatures?.key ?? 0;
  const tempo = audioFeatures?.tempo ?? 120;
  const timeSignature = audioFeatures?.time_signature ?? 4;
  
  const keyNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const keyName = keyNames[key] || 'C';
  
  // シンプルなHTML楽譜を生成
  container.innerHTML = `
    <div style="padding: 20px; background: white; color: black; font-family: 'Times New Roman', serif;">
      <h3 style="margin-bottom: 20px; font-size: 18px;">楽譜情報</h3>
      
      <div style="margin-bottom: 15px;">
        <strong>調性:</strong> ${keyName} ${audioFeatures?.mode === 1 ? 'メジャー' : 'マイナー'}
      </div>
      
      <div style="margin-bottom: 15px;">
        <strong>テンポ:</strong> ${Math.round(tempo)} BPM
      </div>
      
      <div style="margin-bottom: 15px;">
        <strong>拍子:</strong> ${timeSignature}/4
      </div>
      
      <div style="margin-top: 30px; padding: 20px; border: 1px solid #ccc; background: #f9f9f9;">
        <p style="font-size: 16px; line-height: 2;">
          ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫
        </p>
        <p style="margin-top: 10px; color: #666;">
          ※ 簡易表示モード - 詳細な楽譜は現在開発中です
        </p>
      </div>
    </div>
  `;
  
  console.log('Simple sheet music generated');
};