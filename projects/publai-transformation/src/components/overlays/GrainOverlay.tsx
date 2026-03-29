import React, { useMemo } from 'react';
import { useCurrentFrame, random } from 'remotion';

/**
 * Subtle film grain overlay to eliminate flat "AI slop" look.
 * Renders a canvas-style noise pattern that shifts per frame.
 */
export const GrainOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => {
  const frame = useCurrentFrame();

  const grainElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    const seed = frame % 4; // cycle every 4 frames for subtle movement
    for (let i = 0; i < 120; i++) {
      const x = random(`grain-x-${i}-${seed}`) * 100;
      const y = random(`grain-y-${i}-${seed}`) * 100;
      const size = 1 + random(`grain-s-${i}-${seed}`) * 3;
      const alpha = random(`grain-a-${i}-${seed}`) * 0.6;
      elements.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: `rgba(255, 255, 255, ${alpha})`,
          }}
        />
      );
    }
    return elements;
  }, [frame]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        zIndex: 100,
      }}
    >
      {grainElements}
    </div>
  );
};
