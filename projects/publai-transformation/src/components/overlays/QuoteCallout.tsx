import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { brand } from '../../config/brand';
import { FPS, scenes } from '../../config/scenes';

/**
 * Quote Callout Overlay
 *
 * Appears during Scene 2 (The Intelligence) with the line:
 * "We don't create content"
 * Uses Video-Wrapper-Skills quote_callout pattern with serif font.
 */
export const QuoteCallout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quote appears during Scene 2 (starts at frame 300 = 10s)
  const scene2Start = scenes[0].durationInFrames;
  const quoteStart = scene2Start + 90; // 3s into scene 2
  const quoteDuration = 120; // 4s display

  const localFrame = frame - quoteStart;

  if (localFrame < 0 || localFrame > quoteDuration + 30) return null;

  // Entry animation
  const entryProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 80 },
  });
  const safeEntry = Math.max(0, entryProgress);

  // Exit fade
  const exitOpacity = interpolate(
    localFrame,
    [quoteDuration, quoteDuration + 30],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Accent line width
  const lineWidth = interpolate(localFrame, [0, 20], [0, 60], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 160,
        left: 120,
        zIndex: 50,
        opacity: safeEntry * exitOpacity,
        transform: `translateY(${(1 - safeEntry) * 30}px)`,
      }}
    >
      {/* Green accent line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          backgroundColor: brand.colors.primary,
          marginBottom: 16,
          boxShadow: `0 0 12px ${brand.colors.primary}60`,
        }}
      />

      {/* Quote text */}
      <div
        style={{
          fontFamily: brand.fonts.heading,
          fontSize: 42,
          fontWeight: 300,
          color: '#FFFFFF',
          letterSpacing: 1,
          lineHeight: 1.3,
        }}
      >
        <span style={{ fontStyle: 'italic', opacity: 0.6 }}>“</span>
        We don’t create content
        <span style={{ fontStyle: 'italic', opacity: 0.6 }}>”</span>
      </div>

      {/* Subtext */}
      <div
        style={{
          fontFamily: brand.fonts.primary,
          fontSize: 18,
          color: brand.colors.primary,
          marginTop: 12,
          letterSpacing: 2,
          opacity: interpolate(localFrame, [15, 35], [0, 0.8], { extrapolateRight: 'clamp' }),
        }}
      >
        WE TRANSFORM IT
      </div>
    </div>
  );
};
