import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Nature({ started }) {
  const butterflyCount = 30;
  const butterflyRef = useRef();
  const dustRef = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const butterflyData = useMemo(() => {
    const data = [];
    for (let i = 0; i < butterflyCount; i++) {
      data.push({
        t: Math.random() * 100,
        factor: 0.1 + Math.random() * 0.1,
        speed: 0.005 + Math.random() * 0.01,
        xFactor: -15 + Math.random() * 30,
        yFactor: -2 + Math.random() * 4,
        zFactor: -15 + Math.random() * 30,
        delay: Math.random() * 10,
        active: false
      });
    }
    return data;
  }, [butterflyCount]);

  const dustParticles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40 + 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return positions;
  }, []);

  const state = useRef({ timePassed: 0 });

  useEffect(() => {
    if (started) {
      // Butterflies activate slowly after building starts finishing
      gsap.to(state.current, {
        timePassed: 100,
        duration: 30,
        delay: 2,
        onUpdate: () => {
          butterflyData.forEach(b => {
            if (state.current.timePassed > b.delay && !b.active) {
              b.active = true;
              b.startTime = state.current.timePassed;
            }
          });
        }
      });
    }
  }, [started]);

  useFrame((s) => {
    // Animate Dust
    if (dustRef.current) {
      dustRef.current.rotation.y = s.clock.elapsedTime * 0.02;
      dustRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.05) * 0.1;
    }

    if (!started || !butterflyRef.current) return;
    
    // Animate Butterflies
    butterflyData.forEach((data, i) => {
      if (!data.active) {
        dummy.position.set(0, -100, 0); // Hide them initially
      } else {
        data.t += data.speed;
        
        const activeTime = state.current.timePassed - data.startTime;
        
        dummy.position.set(
          Math.cos(data.t) * data.xFactor,
          Math.max(0, activeTime * 0.5) + Math.sin(data.t * 2) * data.yFactor, // Slowly rise
          Math.sin(data.t) * data.zFactor
        );
        
        // Flapping motion (scale on X axis)
        dummy.scale.set(Math.abs(Math.sin(data.t * 25)) * 0.5 + 0.5, 1, 1);
        
        // Flight tilt
        dummy.rotation.x = Math.sin(data.t * 20) * 0.2;
        dummy.rotation.y = data.t;
        dummy.rotation.z = Math.cos(data.t * 20) * 0.2;
      }
      
      dummy.updateMatrix();
      butterflyRef.current.setMatrixAt(i, dummy.matrix);
    });
    butterflyRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Butterflies */}
      <instancedMesh ref={butterflyRef} args={[null, null, butterflyCount]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#9d4edd" transparent opacity={0.8} side={THREE.DoubleSide} />
      </instancedMesh>
      
      {/* Floating Dust Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={dustParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.2} sizeAttenuation={true} />
      </points>
    </group>
  );
}
