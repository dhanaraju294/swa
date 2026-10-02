import { GLView, type GLViewProps } from 'expo-gl';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, Image, StyleSheet, View } from 'react-native';
import * as THREE from 'three';

import blossomHome from '../../../assets/images/blossom-home.png';

type Mood = 'sad' | 'sprout' | 'steady' | 'blooming';
type Props = { mood: Mood; active?: boolean; reducedMotion?: boolean };
type Model = { scene: THREE.Scene; renderer: THREE.WebGLRenderer };

const palette: Record<Mood, { body: string; leaf: string; plinth: string; glow: string }> = {
  sad: { body: '#C9C8C1', leaf: '#90988C', plinth: '#A8A99B', glow: '#D9D4C8' },
  sprout: { body: '#E7EBD7', leaf: '#86A77A', plinth: '#8DA681', glow: '#F6D98B' },
  steady: { body: '#DCE9D7', leaf: '#66956B', plinth: '#769D72', glow: '#E7D889' },
  blooming: { body: '#D3E8D2', leaf: '#4F8F5D', plinth: '#5D9869', glow: '#F0CD79' },
};

const smoothPalette = Object.fromEntries(
  (Object.keys(palette) as Mood[]).map((mood) => [
    mood,
    {
      body: new THREE.Color(palette[mood].body),
      leaf: new THREE.Color(palette[mood].leaf),
      plinth: new THREE.Color(palette[mood].plinth),
      glow: new THREE.Color(palette[mood].glow),
    },
  ]),
) as Record<Mood, { body: THREE.Color; leaf: THREE.Color; plinth: THREE.Color; glow: THREE.Color }>;

function makeLine(points: THREE.Vector3[], material: THREE.Material, radius = 0.025) {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 20, radius, 7, false), material);
}

function createMascot(mood: Mood) {
  const colors = palette[mood];
  const group = new THREE.Group();
  const material = (color: string, roughness = 0.78) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
  const bodyMaterial = material(colors.body);
  const leafMaterial = material(colors.leaf);
  const plinthMaterial = material(colors.plinth);
  const faceMaterial = material('#584B40');
  const cheekMaterial = new THREE.MeshStandardMaterial({
    color: '#E8AA91',
    transparent: true,
    opacity: mood === 'sad' ? 0.18 : 0.48,
    roughness: 1,
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: colors.glow,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
  });

  const makeSphere = (
    radius: number,
    scale: [number, number, number],
    meshMaterial: THREE.Material,
    position: [number, number, number],
  ) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 24), meshMaterial);
    mesh.scale.set(...scale);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  // A soft halo, a grounded cushion, and an upright seed form keep the mascot
  // calm and readable at the small size of a phone home screen.
  makeSphere(1, [1.48, 1.48, 0.035], glowMaterial, [0, 0.02, -0.62]);
  makeSphere(0.74, [1.22, 0.38, 0.72], plinthMaterial, [0, -1.02, 0]);
  makeSphere(0.57, [0.86, 0.28, 0.65], bodyMaterial, [-0.34, -0.77, 0.09]);
  makeSphere(0.57, [0.86, 0.28, 0.65], bodyMaterial, [0.34, -0.77, 0.09]);
  makeSphere(0.78, [0.79, 0.91, 0.58], bodyMaterial, [0, -0.02, 0.04]);

  const faceZ = 0.548;
  const eyeY = 0.22;
  const eyeRadius = mood === 'sad' ? 0.023 : 0.028;
  for (const x of [-0.29, 0.29]) {
    const eyePoints =
      mood === 'sad'
        ? [
            new THREE.Vector3(x - 0.07, eyeY + 0.03, faceZ),
            new THREE.Vector3(x, eyeY + 0.12, faceZ + 0.01),
            new THREE.Vector3(x + 0.07, eyeY + 0.03, faceZ),
          ]
        : [
            new THREE.Vector3(x - 0.07, eyeY + 0.02, faceZ),
            new THREE.Vector3(x, eyeY - 0.02, faceZ + 0.01),
            new THREE.Vector3(x + 0.07, eyeY + 0.02, faceZ),
          ];
    group.add(makeLine(eyePoints, material(mood === 'sad' ? '#6B665E' : '#56483D', 1), eyeRadius));
  }

  makeSphere(0.04, [1.8, 0.54, 0.14], cheekMaterial, [-0.45, 0.04, faceZ - 0.01]);
  makeSphere(0.04, [1.8, 0.54, 0.14], cheekMaterial, [0.45, 0.04, faceZ - 0.01]);
  const mouthPoints =
    mood === 'sad'
      ? [
          new THREE.Vector3(-0.13, -0.2, faceZ + 0.02),
          new THREE.Vector3(0, -0.12, faceZ + 0.03),
          new THREE.Vector3(0.13, -0.2, faceZ + 0.02),
        ]
      : [
          new THREE.Vector3(-0.14, -0.14, faceZ + 0.02),
          new THREE.Vector3(0, -0.21, faceZ + 0.03),
          new THREE.Vector3(0.14, -0.14, faceZ + 0.02),
        ];
  group.add(makeLine(mouthPoints, faceMaterial));

  // Folded arms make the mascot feel settled instead of action-oriented.
  group.add(
    makeLine(
      [
        new THREE.Vector3(-0.57, -0.28, 0.42),
        new THREE.Vector3(-0.46, -0.53, 0.53),
        new THREE.Vector3(-0.18, -0.57, 0.57),
        new THREE.Vector3(-0.08, -0.48, 0.58),
      ],
      material('#B9A78F'),
      0.035,
    ),
  );
  group.add(
    makeLine(
      [
        new THREE.Vector3(0.57, -0.28, 0.42),
        new THREE.Vector3(0.46, -0.53, 0.53),
        new THREE.Vector3(0.18, -0.57, 0.57),
        new THREE.Vector3(0.08, -0.48, 0.58),
      ],
      material('#B9A78F'),
      0.035,
    ),
  );

  group.add(makeLine([new THREE.Vector3(0, 0.77, 0.05), new THREE.Vector3(0, 1.1, 0.05)], leafMaterial, 0.034));
  const leftLeaf = makeSphere(0.27, [0.88, 0.47, 0.19], leafMaterial, [-0.18, 1.11, 0.02]);
  leftLeaf.rotation.z = 0.62;
  const rightLeaf = makeSphere(0.27, [0.88, 0.47, 0.19], leafMaterial, [0.18, 1.11, 0.02]);
  rightLeaf.rotation.z = -0.62;
  group.userData.sproutLeaves = [leftLeaf, rightLeaf];
  group.add(
    makeLine(
      [new THREE.Vector3(-0.3, 1.08, 0.17), new THREE.Vector3(-0.18, 1.12, 0.21), new THREE.Vector3(-0.09, 1.2, 0.15)],
      material('#DDE6C6'),
      0.012,
    ),
  );
  group.add(
    makeLine(
      [new THREE.Vector3(0.3, 1.08, 0.17), new THREE.Vector3(0.18, 1.12, 0.21), new THREE.Vector3(0.09, 1.2, 0.15)],
      material('#DDE6C6'),
      0.012,
    ),
  );
  group.userData.parts = { body: bodyMaterial, leaf: leafMaterial, plinth: plinthMaterial, glow: glowMaterial };
  return group;
}

export function BlossomMascot3D({ mood, active = true, reducedMotion = false }: Props) {
  const moodRef = useRef(mood);
  const modelRef = useRef<Model | null>(null);
  const rafRef = useRef<number | null>(null);
  const startAnimationRef = useRef<(() => void) | null>(null);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const shouldReduceMotion = reducedMotion || systemReducedMotion;
  const shouldRunRef = useRef(active && appActive);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setAppActive(state === 'active'));
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    shouldRunRef.current = active && appActive;
    if (shouldRunRef.current && rafRef.current === null) startAnimationRef.current?.();
  }, [active, appActive]);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setSystemReducedMotion(value);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystemReducedMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const dispose = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startAnimationRef.current = null;
    if (modelRef.current) {
      modelRef.current.scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose());
        else mesh.material?.dispose();
      });
      modelRef.current.renderer.dispose();
      modelRef.current = null;
    }
  }, []);

  useEffect(() => () => dispose(), [dispose]);

  const onContextCreate: NonNullable<GLViewProps['onContextCreate']> = useCallback(
    (gl) => {
      dispose();
      try {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        if (width <= 0 || height <= 0) throw new Error('The drawing surface has no size.');

        const renderer = new THREE.WebGLRenderer({
          context: gl as unknown as WebGLRenderingContext,
          antialias: true,
          alpha: true,
        });
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(1);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(31, width / height, 0.1, 30);
        camera.position.set(0, 0.08, 5.25);
        camera.lookAt(0, 0, 0);
        scene.add(new THREE.AmbientLight(0xffffff, 2.1));
        const key = new THREE.DirectionalLight(0xfff4df, 2.2);
        key.position.set(-3, 4, 5);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xc7dfa6, 1.4);
        rim.position.set(3, 1, -3);
        scene.add(rim);

        const group = createMascot(moodRef.current);
        group.scale.setScalar(0.84);
        const parts = group.userData.parts as {
          body: THREE.MeshStandardMaterial;
          leaf: THREE.MeshStandardMaterial;
          plinth: THREE.MeshStandardMaterial;
          glow: THREE.MeshBasicMaterial;
        };
        const [leftLeaf, rightLeaf] = group.userData.sproutLeaves as [THREE.Mesh, THREE.Mesh];
        scene.add(group);
        const current: Model = { scene, renderer };
        modelRef.current = current;
        let previousFrame = 0;
        let previousRender = 0;
        const animate = (timestamp: number) => {
          if (modelRef.current !== current || !shouldRunRef.current) {
            rafRef.current = null;
            return;
          }
          if (timestamp - previousRender < 1000 / 30) {
            rafRef.current = requestAnimationFrame(animate);
            return;
          }
          const delta = previousFrame === 0 ? 1 / 30 : Math.min((timestamp - previousFrame) / 1000, 0.05);
          previousFrame = timestamp;
          previousRender = timestamp;
          const seconds = timestamp / 1000;
          const settle = 1 - Math.exp(-5 * delta);
          const target = smoothPalette[moodRef.current];
          parts.body.color.lerp(target.body, settle);
          parts.leaf.color.lerp(target.leaf, settle);
          parts.plinth.color.lerp(target.plinth, settle);
          parts.glow.color.lerp(target.glow, settle);

          if (!shouldReduceMotion) {
            group.position.y = Math.sin(seconds * 0.8) * 0.055;
            group.rotation.y = Math.sin(seconds * 0.32) * 0.075;
            group.rotation.z = Math.sin(seconds * 0.57) * 0.012;
            leftLeaf.rotation.z = 0.62 + Math.sin(seconds * 0.58) * 0.025;
            rightLeaf.rotation.z = -0.62 - Math.sin(seconds * 0.58) * 0.025;
          } else {
            group.position.y = 0;
            group.rotation.set(0, 0, 0);
            leftLeaf.rotation.z = 0.62;
            rightLeaf.rotation.z = -0.62;
          }

          renderer.render(scene, camera);
          gl.endFrameEXP();
          rafRef.current = requestAnimationFrame(animate);
        };
        startAnimationRef.current = () => {
          if (rafRef.current === null && shouldRunRef.current) {
            rafRef.current = requestAnimationFrame(animate);
          }
        };
        startAnimationRef.current();
      } catch (error) {
        console.warn('Blossom 3D renderer could not start:', error);
        dispose();
        setGlFailed(true);
      }
    },
    [dispose, shouldReduceMotion],
  );

  const moodKind = mood === 'sad' ? 'sad' : 'bright';
  const accessibilityLabel = `Blossom mascot, ${mood === 'sad' ? 'taking a quiet pause' : 'growing with your streak'}`;

  return (
    <View style={styles.frame} accessible accessibilityLabel={accessibilityLabel}>
      {!glFailed ? (
        <GLView
          key={`${moodKind}-${shouldReduceMotion}`}
          style={StyleSheet.absoluteFill}
          onContextCreate={onContextCreate}
          msaaSamples={2}
          accessible={false}
        />
      ) : (
        <Image source={blossomHome} style={StyleSheet.absoluteFill} resizeMode="contain" accessible={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' },
});
