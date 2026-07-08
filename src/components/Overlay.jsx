import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';

const titleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 1, 0.5, 1],
      staggerChildren: 0.1
    }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } }
};

export default function Overlay({ started, setStarted }) {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Set started to true immediately for now, or we could wait for a button click.
  // We'll let the Loader from @react-three/drei handle the initial loading state.
  useEffect(() => {
    // Wait for the loader to vanish before triggering text animation
    const timeout = setTimeout(() => {
      setStarted(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [setStarted]);

  return (
    <>
      <div 
        className={`cursor-outline ${isHovering ? 'hover' : ''}`} 
        style={{ left: cursorPos.x, top: cursorPos.y }} 
      />
      <div 
        className="cursor-dot" 
        style={{ left: cursorPos.x, top: cursorPos.y }} 
      />

      <div className="overlay">
        <header className="overlay-header">
          <motion.div 
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={started ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            AURA
          </motion.div>
          <motion.nav 
            className="nav-links"
            initial={{ opacity: 0, x: 20 }}
            animate={started ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <a className="nav-link" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Vision</a>
            <a className="nav-link" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Residences</a>
            <a className="nav-link" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Amenities</a>
            <a className="nav-link" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Contact</a>
          </motion.nav>
        </header>

        <main className="overlay-content">
          <motion.h1 
            className="hero-title"
            variants={titleVariants}
            initial="hidden"
            animate={started ? "visible" : "hidden"}
          >
            <motion.span variants={wordVariants}>From&nbsp;</motion.span>
            <motion.span variants={wordVariants}>Vision&nbsp;</motion.span>
            <br />
            <motion.span variants={wordVariants}>to&nbsp;</motion.span>
            <motion.span variants={wordVariants}>Legacy.</motion.span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 0.8 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Experience the architectural evolution of tomorrow. A sanctuary of unparalleled luxury, crafted for those who define the future.
          </motion.p>
          
          <motion.button 
            className="cta-button"
            initial={{ opacity: 0, y: 20 }}
            animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 1.8 }}
            onMouseEnter={() => setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
          >
            <span>Explore The Residences</span>
            <ArrowRight size={18} className="icon" />
          </motion.button>
        </main>

        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <span>Discover</span>
          <div className="scroll-line"></div>
        </motion.div>
      </div>
    </>
  );
}
