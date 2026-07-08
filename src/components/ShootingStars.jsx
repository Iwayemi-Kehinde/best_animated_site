import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ShootingStars({ theme }) {
  const starsRef = useRef();
  const count = 5; // Number of active shooting stars at a time

  const starsData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 60,
      y: 20 + Math.random() * 20,
      z: -20 - Math.random() * 40,
      speed: 0.5 + Math.random() * 1.5,
      active: false,
      delay: Math.random() * 5,
      time: 0
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const isDark = theme === 'dark';

  useFrame((state, delta) => {
    if (!starsRef.current || !isDark) return; // Only show in dark mode

    starsData.forEach((star, i) => {
      star.time += delta;
      
      if (!star.active && star.time > star.delay) {
        star.active = true;
        star.x = 20 + Math.random() * 40; // Start off screen right
        star.y = 20 + Math.random() * 15;
        star.z = -10 - Math.random() * 30;
      }

      if (star.active) {
        star.x -= star.speed * (delta * 60);
        star.y -= (star.speed * 0.3) * (delta * 60);

        if (star.x < -50) {
          star.active = false;
          star.time = 0;
          star.delay = Math.random() * 10;
        }

        dummy.position.set(star.x, star.y, star.z);
        // Make it long and thin to look like a streak
        dummy.scale.set(4, 0.05, 0.05);
        dummy.rotation.z = Math.PI / 16; // Angle of descent
        dummy.updateMatrix();
        starsRef.current.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.position.set(0, -100, 0);
        dummy.updateMatrix();
        starsRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    starsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={starsRef} args={[null, null, count]} visible={isDark}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </instancedMesh>
  );
}
