// src/components/background/AnimatedBackground.tsx
import React from 'react';
import GalaxyCanvas from './GalaxyCanvas';
import BlackHoleCanvas from './BlackHoleCanvas';

const AnimatedBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {/* Galaxia a la izquierda */}
      <GalaxyCanvas />

      {/* Agujero negro a la derecha */}
      <BlackHoleCanvas />
    </div>
  );
};

export default AnimatedBackground;
