import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';

interface AudioFeatures {
  key: number;
  mode: number;
  tempo: number;
  time_signature: number;
}

// const keyNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const majorScales = [
  ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  ['C♯', 'D♯', 'F', 'F♯', 'G♯', 'A♯', 'C'],
  ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'],
  ['D♯', 'F', 'G', 'G♯', 'A♯', 'C', 'D'],
  ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'],
  ['F', 'G', 'A', 'A♯', 'C', 'D', 'E'],
  ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'F'],
  ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'],
  ['G♯', 'A♯', 'C', 'C♯', 'D♯', 'F', 'G'],
  ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'],
  ['A♯', 'C', 'D', 'D♯', 'F', 'G', 'A'],
  ['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯']
];

export const generateBasicSheet = async (container: HTMLElement, audioFeatures: AudioFeatures) => {
  // Create renderer
  const renderer = new Renderer(container as HTMLDivElement, Renderer.Backends.SVG);
  renderer.resize(800, 200);
  const context = renderer.getContext();

  // Create stave
  const stave = new Stave(10, 40, 780);
  
  // Add time signature
  stave.addTimeSignature(`${audioFeatures.time_signature}/4`);
  stave.addKeySignature(getKeySignatureForVexFlow(audioFeatures.key, audioFeatures.mode));
  
  stave.setContext(context).draw();

  // Generate simple melody based on key and scale
  const scale = majorScales[audioFeatures.key] || majorScales[0];
  const notes = generateSimpleMelody(scale, audioFeatures.time_signature);

  // Create voice
  const voice = new Voice({ num_beats: audioFeatures.time_signature, beat_value: 4 });
  voice.addTickables(notes);

  // Format and draw
  new Formatter().joinVoices([voice]).format([voice], 750);
  voice.draw(context, stave);
};

const getKeySignatureForVexFlow = (key: number, mode: number): string => {
  // Simplified key signature mapping for VexFlow
  const majorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'];
  const minorKeys = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Dm', 'Gm', 'Cm', 'Fm'];
  
  if (mode === 1) {
    return majorKeys[key] || 'C';
  } else {
    return minorKeys[key] || 'Am';
  }
};

const generateSimpleMelody = (scale: string[], timeSignature: number): StaveNote[] => {
  const notes: StaveNote[] = [];
  const octave = 4;
  
  // Generate a simple ascending/descending pattern
  for (let i = 0; i < timeSignature; i++) {
    const noteIndex = i % scale.length;
    const noteName = scale[noteIndex].replace('♯', '#').replace('♭', 'b');
    
    const note = new StaveNote({
      keys: [`${noteName}/${octave}`],
      duration: 'q' // quarter note
    });
    
    // Note: VexFlow modifiers would need proper import and setup
    
    notes.push(note);
  }
  
  return notes;
};