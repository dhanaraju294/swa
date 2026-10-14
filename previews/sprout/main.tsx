import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MASCOT_EMOTIONS, MASCOT_LABELS, SproutMascot } from '../../apps/mobile/src/components/SproutMascot';
import type { MascotEmotion } from '../../apps/mobile/src/components/SproutMascot';
import './style.css';
import { FlowPreview } from './FlowPreview';

const descriptions: Record<MascotEmotion, string> = {
  idle: 'Just being here is a lovely place to start.',
  happy_jump: 'A little leap for a little win.',
  clapping: 'Every bit of progress deserves applause.',
  thumbs_up: 'You’re doing better than you think.',
  celebration: 'Look at you grow. This moment is yours.',
};
const details: Record<MascotEmotion, [string, string, string]> = {
  idle: ['Gentle breathing · 2.4 s', 'Soft leaf sway', 'A quiet, friendly smile'],
  happy_jump: ['Springy jump · 700 ms', 'Takeoff + landing feedback', 'Raised arms & a happy grin'],
  clapping: ['Little claps · 280 ms', 'Golden hand sparkles', 'Happy squinting eyes'],
  thumbs_up: ['A wink & a gentle nod', 'Two-note success chime', 'A hand-drawn thumbs-up'],
  celebration: ['Soft joyful bounce · 880 ms', 'Four-note major fanfare', 'Waving arms & drifting confetti'],
};
function App() {
  const [mode, setMode] = useState<'flow' | 'studio'>('flow');
  const [emotion, setEmotion] = useState<MascotEmotion>('celebration');
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  const [background, setBackground] = useState('cream');
  const choose = (value: MascotEmotion) => { setEmotion(value); setReplay((n) => n + 1); };
  return <>
    <header><a className="wordmark" href="#">swa<span>✳</span></a><div className="breadcrumb">DESIGN LAB <span>/</span> SPROUT STUDIO</div><span className="review-badge"><i />In review</span></header>
    <main>
      <section className="intro"><div><p className="eyebrow">A SMALL COMPANION FOR YOUR INWARD JOURNEY</p><h1>A little sprout.<br /><em>A lot of joy.</em></h1><p className="lead">Meet the next chapter of Blossom. Five little expressions,<br className="desktop" /> brought to life with a leaf, a smile, and a bit of movement.</p></div><div className="intro-note"><span>01 character</span><span>05 expressions</span><span>100% drawn in code</span></div></section>
      <div className="preview-modes" aria-label="Preview mode"><button aria-pressed={mode === 'flow'} onClick={() => setMode('flow')}>In-app flow</button><button aria-pressed={mode === 'studio'} onClick={() => setMode('studio')}>Mascot studio</button></div>
      {mode === 'flow' ? <FlowPreview /> : <>
      <section className="workspace" aria-label="Interactive mascot preview">
        <div className={`stage ${background}`}>
          <div className="stage-top"><span><i />LIVE COMPONENT</span><button className="icon-button" aria-label={paused ? 'Play animation' : 'Pause animation'} onClick={() => setPaused(!paused)}>{paused ? '▷ Play' : 'Ⅱ Pause'}</button></div>
          <div className="character"><SproutMascot emotion={emotion} size={350} muted={muted} active={!paused} replayKey={replay} /></div>
          <div className="stage-caption" aria-live="polite"><span className="state-caption">{MASCOT_LABELS[emotion]}</span><p>{descriptions[emotion]}</p></div>
          <div className="stage-bottom"><span>SVG + REANIMATED</span><div className="swatches" aria-label="Preview background">{['cream', 'white', 'sage'].map((color) => <button key={color} className={`swatch ${color} ${background === color ? 'chosen' : ''}`} aria-label={`${color} background`} aria-pressed={background === color} onClick={() => setBackground(color)} />)}</div></div>
        </div>
        <aside className="controls"><p className="eyebrow">MAKE A LITTLE MOMENT</p><h2>How’s Sprout feeling?</h2><p className="helper">Pick an expression to see it in motion.</p><div className="states">{MASCOT_EMOTIONS.map((state, i) => <button key={state} className={`state-button ${state === emotion ? 'selected' : ''}`} aria-pressed={state === emotion} onClick={() => choose(state)}><span className="state-number">0{i + 1}</span>{MASCOT_LABELS[state]}<span className="state-arrow">{state === emotion ? '●' : '↗'}</span></button>)}</div>
          <div className="feedback-controls"><div><span className="control-title">Sound effects</span><button role="switch" aria-checked={!muted} aria-label="Sound effects" className={`switch ${!muted ? 'on' : ''}`} onClick={() => setMuted(!muted)}><span /></button></div><p>Synthesized from scratch. No audio files.</p><div className="haptic-row"><span className="control-title">Haptic feedback</span><span className="native-badge">ON DEVICE</span></div><p>Available in the native demo on iOS & Android.</p></div>
          <button className="replay" onClick={() => { setPaused(false); setReplay((n) => n + 1); }}>↻ <span>Replay this moment</span></button>
        </aside>
      </section>
      <section className="lineup"><div className="section-title"><div><span className="eyebrow">THE FULL LITTLE FAMILY</span><h2>One Sprout, five ways to say it.</h2></div><span className="click-note">Select any pose to explore ↗</span></div><div className="pose-grid">{MASCOT_EMOTIONS.map((state, i) => <button className={`pose-card ${state === emotion ? 'current' : ''}`} key={state} aria-pressed={state === emotion} onClick={() => choose(state)}><span className="pose-index">0{i + 1}</span><div className="mini-mascot"><SproutMascot emotion={state} size={172} active={false} /></div><strong>{MASCOT_LABELS[state]}</strong><span className="pose-meta">{['Breathe & be', 'A little win', 'Cheering you on', 'You’ve got this', 'Let joy grow'][i]}</span></button>)}</div></section>
      <section className="spec-strip"><div><span className="eyebrow">IN THIS MOMENT</span><h3>{MASCOT_LABELS[emotion]}</h3></div><ul>{details[emotion].map((text) => <li key={text}>{text}</li>)}</ul><span className="tiny-leaf">❧</span></section>
      <p className="footnote">You’re viewing the actual React Native component through React Native Web — not a video or a separate animation. Sound is off by default; system reduced-motion preferences are respected. Device audio and haptic latency may vary.</p>
      </>}
    </main><footer><span>swa / sprout studio</span><span>Idle on Home. A little celebration after practice.</span><a href="https://github.com/dhanaraju294/swa" target="_blank" rel="noreferrer">Made for the inward journey ↗</a></footer>
  </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
