# Sprout mascot studio

## Integrated app flow

Home now renders the new **idle Sprout**, silently, with gentle breathing. Existing streak calculations, unlock rules and Android widget artwork are unchanged.

After the **first successful save of an exercise**, SessionScreen shows `ExerciseCompletion`: happy jump → clapping → celebration → thumbs up, with appreciation text under the mascot, programmatic sound and native haptics. The sequence ends after 6.56 seconds; Continue is available immediately and returns to Home. Existing exercise edits and morning/evening reflections retain the normal saved screen. Failed saves never show a reward. Backgrounding or leaving pauses/stops effects; system Reduce Motion uses a static thumbs-up appreciation screen.

Celebration sounds and haptics default on in the app's reward flow, as requested. The sound switch on the reward and the two **Settings → Little celebrations** switches are persisted in the existing UI store. Home always remains silent, regardless of those settings. The generic Sprout component itself still defaults muted, with haptics off.

- Component: `apps/mobile/src/components/SproutMascot.tsx`
- Reward screen: `apps/mobile/src/components/ExerciseCompletion.tsx`
- Native demo: `apps/mobile/src/screens/mascot/MascotDemoScreen.tsx`
- Expo Router route: `/mascot-demo` (or `inward-journey://mascot-demo` in a configured development build)
- Browser studio: `npm run preview:mascot` — port 3001, bound to all interfaces. Opens on the in-app flow rehearsal; the Mascot studio tab still exposes all five poses.
- Previous artwork inventory: `mascot-preview.html`

The browser studio renders the **same React Native component** with React Native Web, SVG and Reanimated, not a separate HTML imitation. The preview uses a simulated exercise and the actual reward component. It does not start the app's Rust backend, load private user data or save real exercise progress.

## Usage

```tsx
import { SproutMascot } from './src/components/SproutMascot';

<SproutMascot
  emotion="celebration"
  size={220}
  muted={false}
  hapticsEnabled={true}
  active={isFocused}
/>
```

| Prop | Default | Meaning |
| --- | --- | --- |
| `emotion` | `idle` | `idle`, `happy_jump`, `clapping`, `thumbs_up`, `celebration` |
| `size` | `220` | Square canvas in logical pixels; the SVG rig scales with it |
| `muted` | `true` | Feedback is opt-in; turning it off stops/unloads the active sound |
| `hapticsEnabled` | `false` | Native-device haptics; deliberately not simulated in browsers |
| `active` | `true` | Pass screen focus, or false to display a static pose |
| `reducedMotion` | `false` | Additional explicit opt-out; cannot override system Reduce Motion |
| `replayKey` | `0` | Increment to replay an emotion without unmounting |

The exported `MascotEmotion`, `MASCOT_EMOTIONS`, and `MASCOT_LABELS` can drive your own controls. Invalid size values fall back to 220. System Reduce Motion and app backgrounding stop loops and feedback. Audio/haptics switches do not restart the animation clock.

## Dependencies

This repository already had React Native SVG 15 and Reanimated 3, including the required Reanimated Babel plugin. Added Expo SDK 52-compatible `expo-av ~15.0.2` and `expo-haptics ~14.0.1`. `expo-file-system ~18` was already present. Rebuild native development clients to pick up the new native modules; hot reload alone cannot install them.

For copying the single TSX file into another compatible Expo project:

```sh
npx expo install react-native-svg react-native-reanimated expo-av expo-haptics expo-file-system
```

This implementation targets **the repository's SDK 52 / Reanimated 3 stack**. A future Expo SDK upgrade should reassess `expo-av` and migrate to `expo-audio` where required; do not blindly install current major versions into this app.

## Artwork and motion

The complete character is SVG: cream pear-shaped body, beige lower shading, two green leaves, oval eyes, blush, expressive mouths, separate arm/leg groups, and a ground shadow. The SVG includes overscan so the leaves are not clipped at the apex of a jump.

- **Idle:** 1.00–1.03 breathing scale; subtle leaf sway over 2.4 seconds.
- **Happy jump:** 35 SVG-unit leap in a 700 ms cycle. Flight lasts 350 ms (apex at 175 ms), followed by landing squash/recovery. This makes the requested 350 ms landing feedback actually occur on landing, not at the apex.
- **Clapping:** Hands come together at 140 ms in a 280 ms cycle, with a brief golden sparkle pulse and squinting eyes.
- **Thumbs up:** A custom thumb silhouette, wink on the character's left (viewer’s right), one spring-settled nod and two-note chime. Use Replay to see the one-shot again.
- **Celebration (revised):** A softer 880 ms bounce with a small landing squash, offset arm waves rather than mirrored flapping, and independent 2.6-second confetti drift. One four-note fanfare per entry/replay; it does not repeat on every bounce.

Native SVG animated transforms use matrices through a Reanimated prop adapter; the web version uses equivalent SVG matrix attributes. Web dependencies explicitly include shared values so they work without the Reanimated Babel plugin in Vite.

## Audio and lifecycle

The component lazily synthesizes mono 22,050 Hz, 16-bit PCM WAVs with corrected Base64 padding:

- Jump: 320–680 Hz rising sweep, 160 ms.
- Clap: 500–180 Hz sweep plus deterministic noise, 70 ms.
- Thumbs up: C5 → E5, 220 ms.
- Celebration: C5 → E5 → G5 → C6, 380 ms.

There are no downloaded or bundled image/audio assets. Browsers use generated data URIs; native platforms materialize the generated WAVs in a small disposable cache because native data-URI playback is inconsistent. At most four synthesized WAVs are cached. Each component owns at most one loaded audio object; late loads are discarded on cleanup. Sounds are stopped and unloaded on mute, emotion change, deactivation and unmount. No accumulating JS feedback timers are used.

Feedback is driven by animation-phase crossings on the UI clock, then bridged to JS. **It is not sample-accurate or guaranteed zero-latency**: device scheduling, loading, the JS bridge, audio hardware and haptic hardware introduce latency. If a loop sound is not ready at the first boundary, later boundaries play it; one-shot chimes play once loading finishes if the state is still current. No global audio-mode override is made, so the host app's audio/silent-mode policy is respected. Simulator/device support varies.

## Validation

```sh
npm run typecheck
npm run test:app
node scripts/test_sprout_sounds.cjs
```

Validation passed: mobile TypeScript check, 78 tests in 14 suites, PCM/Base64 synthesis checks and the Vite preview build. Browser automation exercised five states, changing SVG transforms, pause/resume, generated chime playback, mute, reduced motion, rapid switching and a 390 px viewport. The complete Home → demo exercise → four reward poses → Continue → idle Home flow also passed, including early dismissal, bounded audio and the static reduced-motion reward. No browser runtime errors remained after these checks.

Native haptic feel and native SVG rendering still require an iOS/Android device pass before release. The browser cannot validate those device-specific behaviors.
