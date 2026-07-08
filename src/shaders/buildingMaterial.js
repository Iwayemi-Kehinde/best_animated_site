import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const BuildingMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0, 
    uColorBase: new THREE.Color('#0a0a0a'),
    uColorGlass: new THREE.Color('#1a3a4a'),
    uColorWireframe: new THREE.Color('#d4af37'),
    uLightIntensity: 0.0,
    uBuildingHeight: 20.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColorBase;
    uniform vec3 uColorGlass;
    uniform vec3 uColorWireframe;
    uniform float uLightIntensity;
    uniform float uBuildingHeight;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // Create a grid-like wireframe effect based on world position
      vec2 grid = fract(vec2(vPosition.x, vPosition.y) * 2.0);
      float line = smoothstep(0.0, 0.05, grid.x) * smoothstep(0.0, 0.05, grid.y);
      line = 1.0 - line;

      // Vertical reveal (Y axis from 0 to uBuildingHeight)
      float revealProgress = uProgress * uBuildingHeight; 
      float noise = random(vUv * 10.0) * 0.5;
      float threshold = vPosition.y; 
      
      vec3 finalColor = uColorBase;
      float alpha = 1.0;

      if (threshold > revealProgress + noise) {
        // Wireframe mode
        finalColor = uColorWireframe;
        alpha = line * 0.8 + 0.05; 
        
        // Add a pulsing scanline at the edge of the transition
        float scanline = smoothstep(revealProgress, revealProgress + 0.5, threshold) - smoothstep(revealProgress + 0.5, revealProgress + 1.0, threshold);
        finalColor += uColorWireframe * scanline * 2.0;
        alpha += scanline;
      } else {
        // Solid Building Mode
        // Fake reflections and fresnel
        float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
        finalColor = mix(uColorBase, uColorGlass, fresnel * 0.5 + 0.5);
        
        // Window lights (randomly lit boxes based on position)
        vec2 windowGrid = floor(vec2(vPosition.x, vPosition.y) * 4.0);
        float isWindow = step(0.1, fract(vPosition.x * 4.0)) * step(0.1, fract(vPosition.y * 4.0));
        float windowLight = step(0.7, random(windowGrid));
        
        vec3 lightColor = vec3(1.0, 0.9, 0.7); // Warm light
        finalColor += windowLight * isWindow * lightColor * uLightIntensity;
        
        alpha = 1.0;
      }

      gl_FragColor = vec4(finalColor, alpha);
      
      // Basic tonemapping
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);
