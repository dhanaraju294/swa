// Run: node scripts/test_sprout_sounds.cjs
// Test the actual exports of the self-contained TSX module without a native host.
// Native imports are inert stubs; no component hooks or effects are executed here.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const filename = path.join(__dirname, '../apps/mobile/src/components/SproutMascot.tsx');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  fileName: filename,
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText;
const exported = {};
vm.runInNewContext(compiled, {
  exports: exported,
  require(name) {
    if (name === 'react-native') return { Platform: { OS: 'web' } };
    if (name === 'react-native-reanimated') return {
      createAnimatedComponent: (value) => value,
      createAnimatedPropAdapter: (value) => value,
    };
    if (['react', 'react-native-svg', 'expo-av', 'expo-haptics', 'expo-file-system'].includes(name)) return {};
    throw new Error(`Unexpected dependency: ${name}`);
  },
}, { filename });
const { encodeBase64, generateSproutSound, SAMPLE_RATE } = exported;
for (let length = 0; length < 100; length++) {
  const bytes = Uint8Array.from({ length }, (_, i) => (i * 71 + length) % 256);
  assert.equal(encodeBase64(bytes), Buffer.from(bytes).toString('base64'), `Base64 padding at length ${length}`);
}
for (const [kind, duration] of Object.entries({ jump: 0.16, clap: 0.07, thumbs_up: 0.22, celebration: 0.38 })) {
  const uri = generateSproutSound(kind);
  assert.ok(uri.startsWith('data:audio/wav;base64,'));
  assert.equal(uri, generateSproutSound(kind), 'Synth output must be deterministic');
  const wav = Buffer.from(uri.split(',')[1], 'base64');
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
  assert.equal(wav.toString('ascii', 12, 16), 'fmt ');
  assert.equal(wav.toString('ascii', 36, 40), 'data');
  assert.equal(wav.readUInt32LE(4), wav.length - 8);
  assert.equal(wav.readUInt16LE(20), 1, 'PCM');
  assert.equal(wav.readUInt16LE(22), 1, 'Mono');
  assert.equal(wav.readUInt32LE(24), SAMPLE_RATE);
  assert.equal(wav.readUInt32LE(28), SAMPLE_RATE * 2);
  assert.equal(wav.readUInt16LE(32), 2, 'Block alignment');
  assert.equal(wav.readUInt16LE(34), 16, '16-bit samples');
  assert.equal(wav.readUInt32LE(40), Math.round(duration * SAMPLE_RATE) * 2);
  assert.equal(wav.length, 44 + wav.readUInt32LE(40));
  assert.equal(wav.readInt16LE(44), 0, 'Click-free attack');
  assert.ok(Math.abs(wav.readInt16LE(wav.length - 2)) < 10, 'Click-free release');
  let peak = 0;
  for (let i = 44; i < wav.length; i += 2) peak = Math.max(peak, Math.abs(wav.readInt16LE(i)));
  assert.ok(peak > 1000 && peak < 15000, 'Audible waveform with headroom');
}
assert.equal(new Set(['jump', 'clap', 'thumbs_up', 'celebration'].map(generateSproutSound)).size, 4);
console.log('PASS: 100 Base64 padding cases; four deterministic PCM WAVs, durations, headers, envelopes and amplitude headroom.');
