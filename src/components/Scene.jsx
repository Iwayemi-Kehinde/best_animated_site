import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { CameraControls } from '@react-three/drei';
// removed BlendFunction import
import Building from './Building';
import Nature from './Nature';
import Environment from './Environment';
import ShootingStars from './ShootingStars';
import gsap from 'gsap';

export default function Scene({ started, theme }) {
  const cameraControlsRef = useRef();

  useEffect(() => {
    if (started && cameraControlsRef.current) {
      // Cinematic Camera move: pull back and angle up slightly
      gsap.to(cameraControlsRef.current, {
        polarAngle: Math.PI / 2.1,
        distance: 30,
        duration: 15,
        ease: "power2.inOut",
      });
    }
  }, [started]);

  useFrame((state, delta) => {
    if (cameraControlsRef.current) {
      // Slow continuous orbit
      cameraControlsRef.current.azimuthAngle -= 0.05 * delta;
    }
  });

  return (
    <>
      <CameraControls 
        ref={cameraControlsRef} 
        makeDefault 
        minDistance={10}
        maxDistance={50}
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2 + 0.05} // Allow slightly below horizon
      />

      <Environment started={started} theme={theme} />
      <ShootingStars theme={theme} />
      <Building started={started} theme={theme} />
      <Nature started={started} />

      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom 
          luminanceThreshold={1.0} 
          luminanceSmoothing={0.9} 
          intensity={theme === 'dark' ? 1.5 : 0.8} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.025} />
      </EffectComposer>
    </>
  );
}
