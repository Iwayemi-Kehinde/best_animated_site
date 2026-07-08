import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Overlay from './components/Overlay';
import Scene from './components/Scene';
import Lenis from 'lenis';

function App() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling if needed later, or just for parallax
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Overlay started={started} setStarted={setStarted} />
      
      <Canvas
        camera={{ position: [0, 2, 10], fov: 45 }}
        gl={{ antialias: false, alpha: false, stencil: false, depth: true }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <Scene started={started} />
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#0a0a0a' }}
        innerStyles={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)' }}
        barStyles={{ height: '100%', background: '#d4af37' }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
        dataStyles={{ fontFamily: 'Cinzel', fontSize: '2rem', color: '#d4af37', letterSpacing: '0.2em' }}
      />
    </>
  );
}

export default App;
