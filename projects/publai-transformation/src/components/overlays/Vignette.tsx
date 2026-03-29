import React from 'react';

/**
 * Cinematic vignette overlay - darkens edges for depth.
 */
export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.7 }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 99,
      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, ${intensity}) 100%)`,
    }}
  />
);
