import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { brand } from '../../config/brand';
import { scenes } from '../../config/scenes';

/**
 * Animated Stats Overlay
 *
 * Shows rising engagement numbers during Scene 3 (Transformation).
 * Numbers count up with spring physics for snappy feel.
 * Uses Video-Wrapper-Skills animated_stats pattern.
 */

interface StatConfig {
  prefix: string;
  target: number;
  unit: string;
  label: string;
  delay: number;
}

const STATS: StatConfig[] = [
  { prefix: '', target: 340, unit: '%', label: 'Engagement Lift', delay: 0 },
  { prefix: '', target: 12, unit: 'x', label: 'Content Output', delay: 6 },
  { prefix: '', target: 94, unit: '%', label: 'Brand Consistency', delay: 12 },
];

const StatCounter: React.FC<{ stat: StatConfig; localFrame: number; fps: number }> = ({
  stat,
  localFrame,
  fps,
}) => {
  const entryProgress = spring({
    frame: localFrame - stat.delay,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const safeEntry = Math.max(0, entryProgress);

  // Count up animation
  const countProgress = interpolate(
    localFrame - stat.delay,
    [0, 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const currentValue = Math.round(stat.target * countProgress);

  return (
    <div
      style={{
        textAlign: 'center',
        opacity: safeEntry,
        transform: `translateY(${(1 - safeEntry) * 20}px) scale(${0.9 + safeEntry * 0.1})`,
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: brand.fonts.heading,
          fontSize: 52,
          fontWeight: 700,
          color: '#FFFFFF',
          lineHeight: 1,
        }}
      >
        {stat.prefix}
        {currentValue}
        <span style={{ color: brand.colors.primary, fontSize: 36 }}>{stat.unit}</span>
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: brand.fonts.primary,
          fontSize: 14,
          color: brand.colors.textMedium,
          marginTop: 8,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        {stat.label}
      </div>

      {/* Underline accent */}
      <div
        style={{
          width: 40,
          height: 2,
          backgroundColor: brand.colors.primary,
          margin: '10px auto 0',
          opacity: 0.5,
          transform: `scaleX(${safeEntry})`,
        }}
      />
    </div>
  );
};

export const AnimatedStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stats appear during Scene 3 (starts at scene1 + scene2 frames)
  const scene3Start = scenes[0].durationInFrames + scenes[1].durationInFrames;
  const statsStart = scene3Start + 120; // 4s into scene 3
  const statsDuration = 150; // 5s display

  const localFrame = frame - statsStart;

  if (localFrame < 0 || localFrame > statsDuration + 30) return null;

  // Exit fade
  const exitOpacity = interpolate(
    localFrame,
    [statsDuration, statsDuration + 30],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 100,
        zIndex: 50,
        opacity: exitOpacity,
      }}
    >
      {STATS.map((stat, i) => (
        <StatCounter key={i} stat={stat} localFrame={localFrame} fps={fps} />
      ))}
    </div>
  );
};
