import React, { useRef, useEffect, useMemo } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { BuildingMaterial } from '../shaders/buildingMaterial';
import * as THREE from 'three';
import gsap from 'gsap';

extend({ BuildingMaterial });

export default function Building({ started }) {
  const materialRef = useRef();
  const materialState = useRef({ progress: 0, light: 0 });
  
  useEffect(() => {
    if (started) {
      gsap.to(materialState.current, {
        progress: 1.0,
        duration: 8,
        ease: "power2.inOut",
        delay: 1
      });
      
      gsap.to(materialState.current, {
        light: 1.5,
        duration: 4,
        ease: "power1.inOut",
        delay: 7
      });
    }
  }, [started]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uProgress = materialState.current.progress;
      materialRef.current.uLightIntensity = materialState.current.light;
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
