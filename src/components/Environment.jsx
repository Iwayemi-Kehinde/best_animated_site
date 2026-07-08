import React, { useRef, useEffect } from 'react';
import { Environment as DreiEnvironment, Sky, Clouds, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useThree } from '@react-three/fiber';

export default function Environment({ started, theme }) {
  const dirLightRef = useRef();
  const ambientLightRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    // Setup Fog based on theme
    const isDark = theme === 'dark';
    scene.fog = new THREE.FogExp2(isDark ? '#1a0b2e' : '#ffffff', 0.05);

    if (started) {
      // Animate Light Intensity
      gsap.to(dirLightRef.current, {
        intensity: 2,
        duration: 3,
        ease: "power2.inOut",
        delay: 0.5
      });

      gsap.to(ambientLightRef.current, {
        intensity: 0.5,
        duration: 3,
        ease: "power2.inOut",
        delay: 0.5
      });

      // Animate Fog density down as it brightens
      gsap.to(scene.fog, {
        density: 0.02,
        duration: 3,
        ease: "power2.inOut",
        delay: 0.5
      });
    }
  }, [started, scene, theme]);

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.05} color={theme === 'dark' ? "#c77dff" : "#ffffff"} />
      <directionalLight 
        ref={dirLightRef}
        position={[10, 10, 5]} 
        intensity={0.1} 
        color="#ffe8c4"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Sky and Environment mapping for reflections */}
      <Sky 
        sunPosition={[10, 2, 5]} 
        turbidity={0.3} 
        rayleigh={1.2} 
        mieCoefficient={0.005} 
        mieDirectionalG={0.8} 
      />
      
      <DreiEnvironment preset="sunset" />
      
      {/* Moving Clouds */}
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={20} bounds={[20, 2, 20]} volume={10} color="#333" position={[0, 25, -10]} speed={0.2} opacity={0.5} />
        <Cloud segments={20} bounds={[20, 2, 20]} volume={10} color="#111" position={[-15, 20, -15]} speed={0.1} opacity={0.3} />
      </Clouds>
    </>
  );
}
