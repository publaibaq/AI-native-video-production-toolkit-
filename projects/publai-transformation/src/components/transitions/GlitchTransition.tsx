import React from 'react';
import type { TransitionPresentation } from '@remotion/transitions';
import { AbsoluteFill, useCurrentFrame, interpolate, random } from 'remotion';

/**
 * Glitch/Pixelate Transition
 *
 * Represents AI 'rewriting' dull content.
 * Slices the exiting scene into horizontal strips and displaces them
 * while overlaying RGB-split artifacts and pixelation blocks.
 */

const SLICE_COUNT = 12;

const GlitchEffect: React.FC<{
  children: React.ReactNode;
  progress: number;
  direction: 'exiting' | 'entering';
}> = ({ children, progress, direction }) => {
  const frame = useCurrentFrame();

  // Intensity peaks in the middle of the transition
  const intensity = Math.sin(progress * Math.PI);

  return (
    <AbsoluteFill>
      {/* Base content with RGB split */}
      <AbsoluteFill
        style={{
          opacity: direction === 'exiting' ? 1 - progress : progress,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Glitch slices */}
      {Array.from({ length: SLICE_COUNT }).map((_, i) => {
        const sliceHeight = 1080 / SLICE_COUNT;
        const displacement = random(`glitch-${i}-${frame}`) * 80 * intensity - 40 * intensity;
        const rgbShift = random(`rgb-${i}-${frame}`) * 10 * intensity;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: displacement,
              top: i * sliceHeight,
              width: 1920,
              height: sliceHeight,
              overflow: 'hidden',
              opacity: intensity > 0.1 ? 1 : 0,
            }}
          >
            {/* Red channel shift */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateX(${rgbShift}px)`,
                mixBlendMode: 'screen',
                opacity: 0.3 * intensity,
                backgroundColor: 'rgba(255, 0, 0, 0.15)',
              }}
            />
            {/* Cyan channel shift */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateX(${-rgbShift}px)`,
                mixBlendMode: 'screen',
                opacity: 0.3 * intensity,
                backgroundColor: 'rgba(0, 255, 255, 0.15)',
              }}
            />
          </div>
        );
      })}

      {/* Pixelation blocks */}
      {intensity > 0.3 &&
        Array.from({ length: 8 }).map((_, i) => {
          const blockX = random(`px-x-${i}-${frame}`) * 1920;
          const blockY = random(`px-y-${i}-${frame}`) * 1080;
          const blockSize = 40 + random(`px-s-${i}-${frame}`) * 120;

          return (
            <div
              key={`pixel-${i}`}
              style={{
                position: 'absolute',
                left: blockX,
                top: blockY,
                width: blockSize,
                height: blockSize * 0.4,
                backgroundColor: `rgba(97, 186, 94, ${0.2 * intensity})`,
                border: `1px solid rgba(97, 186, 94, ${0.4 * intensity})`,
              }}
            />
          );
        })}

      {/* Scan lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, ${0.1 * intensity}) 2px,
            rgba(0, 0, 0, ${0.1 * intensity}) 4px
          )`,
          opacity: intensity,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export function GlitchTransition(): TransitionPresentation<Record<string, never>> {
  return {
    component: ({ children, presentationDirection, presentationProgress }) => {
      const progress = presentationProgress;
      const direction = presentationDirection === 'exiting' ? 'exiting' : 'entering';

      return (
        <GlitchEffect progress={progress} direction={direction}>
          {children}
        </GlitchEffect>
      );
    },
  };
}
