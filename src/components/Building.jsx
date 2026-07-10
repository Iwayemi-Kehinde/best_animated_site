import React, { useRef, useEffect } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { BuildingMaterial } from '../shaders/buildingMaterial';
import * as THREE from 'three';
import gsap from 'gsap';

extend({ BuildingMaterial });

export default function Building({ started, theme }) {
  const materialRef = useRef();
  const materialState = useRef({ progress: 0, light: 0 });
  
  useEffect(() => {
    if (started) {
      gsap.to(materialState.current, {
        progress: 1.0,
        duration: 3, // Reduced from 8s
        ease: "power2.inOut",
        delay: 0.5 // Reduced from 1s
      });
      
      gsap.to(materialState.current, {
        light: 1.5,
        duration: 2, // Reduced from 4s
        ease: "power1.inOut",
        delay: 2.5 // Reduced from 7s
      });
    }
  }, [started]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uProgress = materialState.current.progress;
      materialRef.current.uLightIntensity = materialState.current.light;
      
      // Update colors based on theme
      const isDark = theme === 'dark';
      materialRef.current.uColorBase = new THREE.Color(isDark ? '#090410' : '#ffffff');
      materialRef.current.uColorGlass = new THREE.Color(isDark ? '#1a0b2e' : '#f3e8ff');
      materialRef.current.uColorWireframe = new THREE.Color(isDark ? '#a020f0' : '#5a189a');
    }
  });

  return (
    <group position={[0, -5, 0]}>
      {/* Single Material shared among building parts */}
      <buildingMaterial 
        ref={materialRef} 
        transparent={true} 
        side={THREE.DoubleSide}
      />
      
      {/* Main Core */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[4, 20, 4, 32, 64, 32]} />
        <primitive object={materialRef.current || new THREE.Material()} attach="material" />
      </mesh>
      
      {/* Tier 1 */}
      <mesh position={[0, 21.5, 0]}>
        <boxGeometry args={[3, 3, 3, 16, 16, 16]} />
        <primitive object={materialRef.current || new THREE.Material()} attach="material" />
      </mesh>

      {/* Spire */}
      <mesh position={[0, 24, 0]}>
        <cylinderGeometry args={[0.1, 0.5, 4, 16, 1]} />
        <primitive object={materialRef.current || new THREE.Material()} attach="material" />
      </mesh>

      {/* Surrounding low-poly blocks (city context) */}
      <mesh position={[5, 2.5, 3]}>
        <boxGeometry args={[3, 5, 3]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[-6, 4, -2]}>
        <boxGeometry args={[4, 8, 4]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[2, 1.5, -6]}>
        <boxGeometry args={[3, 3, 5]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
    </group>
  );
}
