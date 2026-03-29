import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { brand } from '../../config/brand';

/**
 * Scene 2: The Intelligence
 *
 * High-tech UI grids, data points, and composition guides
 * overlay the screen. Elements use spring physics and
 * staggered reveals (100ms delay = 3 frames at 30fps).
 */

interface GridLine {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  delay: number;
}

const GRID_LINES: GridLine[] = [
  // Rule of thirds vertical
  { x1: '33.3%', y1: '0%', x2: '33.3%', y2: '100%', delay: 0 },
  { x1: '66.6%', y1: '0%', x2: '66.6%', y2: '100%', delay: 3 },
  // Rule of thirds horizontal
  { x1: '0%', y1: '33.3%', x2: '100%', y2: '33.3%', delay: 6 },
  { x1: '0%', y1: '66.6%', x2: '100%', y2: '66.6%', delay: 9 },
  // Golden ratio guides
  { x1: '38.2%', y1: '0%', x2: '38.2%', y2: '100%', delay: 12 },
  { x1: '61.8%', y1: '0%', x2: '61.8%', y2: '100%', delay: 15 },
];

interface DataPoint {
  label: string;
  value: string;
  x: number;
  y: number;
  delay: number;
}

const DATA_POINTS: DataPoint[] = [
  { label: 'ENGAGEMENT', value: '94.2%', x: 200, y: 300, delay: 18 },
  { label: 'COMPOSITION', value: 'GOLDEN', x: 1500, y: 250, delay: 21 },
  { label: 'COLOR SCORE', value: '9.1/10', x: 300, y: 700, delay: 24 },
  { label: 'CONTRAST', value: 'WCAG AAA', x: 1400, y: 680, delay: 27 },
  { label: 'VISUAL WEIGHT', value: 'BALANCED', x: 850, y: 180, delay: 30 },
  { label: 'HIERARCHY', value: 'OPTIMIZED', x: 900, y: 850, delay: 33 },
];

const CompositionGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
      viewBox="0 0 1920 1080"
    >
      {GRID_LINES.map((line, i) => {
        const lineOpacity = spring({
          frame: frame - line.delay,
          fps,
          config: { damping: 20, stiffness: 120 },
        });
        return (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={brand.colors.primary}
            strokeWidth={1}
            opacity={Math.max(0, lineOpacity) * 0.4}
            strokeDasharray="8 4"
          />
        );
      })}
      {/* Intersection points */}
      {[33.3, 66.6].map((x) =>
        [33.3, 66.6].map((y) => {
          const dotDelay = 12 + (x > 50 ? 3 : 0) + (y > 50 ? 3 : 0);
          const dotScale = spring({
            frame: frame - dotDelay,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          return (
            <circle
              key={`${x}-${y}`}
              cx={`${x}%`}
              cy={`${y}%`}
              r={6 * Math.max(0, dotScale)}
              fill={brand.colors.primary}
              opacity={0.8}
            />
          );
        })
      )}
    </svg>
  );
};

const DataOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {DATA_POINTS.map((point, i) => {
        const entryProgress = spring({
          frame: frame - point.delay,
          fps,
          config: { damping: 14, stiffness: 100 },
        });
        const safeProgress = Math.max(0, entryProgress);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: point.x,
              top: point.y,
              opacity: safeProgress,
              transform: `translateY(${(1 - safeProgress) * 20}px) scale(${0.8 + safeProgress * 0.2})`,
              zIndex: 5,
            }}
          >
            {/* Data card */}
            <div
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.85)',
                border: `1px solid ${brand.colors.primary}40`,
                borderRadius: 6,
                padding: '10px 16px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontFamily: brand.fonts.primary,
                  fontSize: 10,
                  fontWeight: 500,
                  color: brand.colors.primary,
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                {point.label}
              </div>
              <div
                style={{
                  fontFamily: brand.fonts.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                {point.value}
              </div>
            </div>
            {/* Connector dot */}
            <div
              style={{
                position: 'absolute',
                top: -4,
                left: -4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: brand.colors.primary,
                boxShadow: `0 0 12px ${brand.colors.primary}80`,
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export const IntelligenceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background pulse
  const bgGlow = 0.05 + Math.sin(frame * 0.03) * 0.02;

  // Title reveal
  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  // "AI ANALYZING" scan line
  const scanY = interpolate(frame % 120, [0, 120], [0, 1080]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.bgDark,
      }}
    >
      {/* Ambient green glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(97, 186, 94, ${bgGlow}) 0%, transparent 70%)`,
        }}
      />

      {/* Composition grid */}
      <CompositionGrid />

      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brand.colors.primary}60, transparent)`,
          zIndex: 3,
        }}
      />

      {/* Data overlay cards */}
      <DataOverlay />

      {/* Scene title */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: brand.fonts.primary,
            fontSize: 18,
            fontWeight: 500,
            color: brand.colors.primary,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: Math.max(0, titleProgress) * 0.7,
          }}
        >
          Scene 02
        </div>
        <div
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: 56,
            fontWeight: 700,
            color: '#FFFFFF',
            opacity: Math.max(0, titleProgress),
            transform: `translateX(${(1 - Math.max(0, titleProgress)) * -30}px)`,
            marginTop: 4,
          }}
        >
          The Intelligence
        </div>
      </div>

      {/* Corner brackets - tech frame */}
      {[
        { top: 40, left: 40 },
        { top: 40, right: 40 },
        { bottom: 40, left: 40 },
        { bottom: 40, right: 40 },
      ].map((pos, i) => {
        const bracketOpacity = spring({
          frame: frame - 5 - i * 3,
          fps,
          config: { damping: 20, stiffness: 100 },
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              width: 40,
              height: 40,
              borderColor: `${brand.colors.primary}60`,
              borderStyle: 'solid',
              borderWidth: 0,
              ...(i === 0 && { borderTopWidth: 2, borderLeftWidth: 2 }),
              ...(i === 1 && { borderTopWidth: 2, borderRightWidth: 2 }),
              ...(i === 2 && { borderBottomWidth: 2, borderLeftWidth: 2 }),
              ...(i === 3 && { borderBottomWidth: 2, borderRightWidth: 2 }),
              opacity: Math.max(0, bracketOpacity) * 0.6,
              zIndex: 10,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
