import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

/**
 * Layered gradient mesh with slow-moving radial gradients.
 * Creates atmospheric depth with PublAI green tones.
 */
export const GradientMesh: React.FC = () => {
  const frame = useCurrentFrame();

  const drift1 = interpolate(frame, [0, 900], [0, 60], { extrapolateRight: 'clamp' });
  const drift2 = interpolate(frame, [0, 900], [0, -40], { extrapolateRight: 'clamp' });
  const pulse = 0.08 + Math.sin(frame * 0.02) * 0.03;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {/* Primary green mesh - top right */}
      <div
        style={{
          position: 'absolute',
          top: -200 + drift1,
          right: -300 + drift2,
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(97, 186, 94, ${pulse}) 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />
      {/* Secondary mesh - bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: -300 - drift2,
          left: -200 - drift1,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(97, 186, 94, ${pulse * 0.5}) 0%, transparent 65%)`,
          filter: 'blur(100px)',
        }}
      />
      {/* Tertiary warm accent - center */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 60%)`,
          filter: 'blur(60px)',
          transform: `translate(${drift2 * 0.3}px, ${drift1 * 0.2}px)`,
        }}
      />
    </div>
  );
};
