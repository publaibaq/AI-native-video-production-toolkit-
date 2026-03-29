import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { brand } from '../../config/brand';
import { TOTAL_FRAMES, scenes } from '../../config/scenes';

/**
 * PublAI Logo Animation
 *
 * SVG logo with a 'network pulse' motif that undulates.
 * Uses Remotion spring physics to simulate anime.js-style
 * organic motion. The logo appears as a watermark and
 * becomes prominent in the final scene.
 */
export const PublAILogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo appears after first scene
  const scene1End = scenes[0].durationInFrames;
  const logoStart = scene1End + 10;

  if (frame < logoStart) return null;

  const localFrame = frame - logoStart;

  // Entry
  const entryScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 60 },
  });
  const safeEntry = Math.max(0, entryScale);

  // Pulse animation for the network nodes
  const pulse1 = 0.6 + Math.sin(localFrame * 0.08) * 0.4;
  const pulse2 = 0.6 + Math.sin(localFrame * 0.08 + 1.2) * 0.4;
  const pulse3 = 0.6 + Math.sin(localFrame * 0.08 + 2.4) * 0.4;
  const pulse4 = 0.6 + Math.sin(localFrame * 0.08 + 3.6) * 0.4;

  // In the final scene, logo grows and centers
  const scene4Start = scenes[0].durationInFrames + scenes[1].durationInFrames + scenes[2].durationInFrames;
  const isFinalScene = frame > scene4Start + 240; // last 4s of scene 4
  const finalProgress = isFinalScene
    ? interpolate(frame, [scene4Start + 240, scene4Start + 270], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  // Position: top-right watermark -> center for finale
  const logoX = interpolate(finalProgress, [0, 1], [1920 - 120, 960]);
  const logoY = interpolate(finalProgress, [0, 1], [50, 480]);
  const logoScale = interpolate(finalProgress, [0, 1], [0.6, 1.8]);
  const logoOpacity = interpolate(finalProgress, [0, 1], [0.4, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: logoX,
        top: logoY,
        transform: `translate(-50%, -50%) scale(${safeEntry * logoScale})`,
        opacity: safeEntry * logoOpacity,
        zIndex: 60,
      }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Network connections */}
        <line x1="20" y1="20" x2="60" y2="20" stroke={brand.colors.primary} strokeWidth={1.5} opacity={0.3} />
        <line x1="20" y1="20" x2="40" y2="50" stroke={brand.colors.primary} strokeWidth={1.5} opacity={0.3} />
        <line x1="60" y1="20" x2="40" y2="50" stroke={brand.colors.primary} strokeWidth={1.5} opacity={0.3} />
        <line x1="40" y1="50" x2="20" y2="65" stroke={brand.colors.primary} strokeWidth={1.5} opacity={0.3} />
        <line x1="40" y1="50" x2="60" y2="65" stroke={brand.colors.primary} strokeWidth={1.5} opacity={0.3} />

        {/* Network nodes with undulating pulse */}
        <circle cx="20" cy="20" r={5 * pulse1} fill={brand.colors.primary} opacity={pulse1} />
        <circle cx="60" cy="20" r={5 * pulse2} fill={brand.colors.primary} opacity={pulse2} />
        <circle cx="40" cy="50" r={7 * pulse3} fill={brand.colors.primaryLight} opacity={pulse3} />
        <circle cx="20" cy="65" r={4 * pulse4} fill={brand.colors.primary} opacity={pulse4 * 0.7} />
        <circle cx="60" cy="65" r={4 * pulse1} fill={brand.colors.primary} opacity={pulse1 * 0.7} />

        {/* Central 'P' mark */}
        <text
          x="40"
          y="55"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="18"
          fontWeight="700"
          fontFamily="Playfair Display, serif"
        >
          P
        </text>
      </svg>

      {/* Logo text - visible in final scene */}
      {finalProgress > 0.3 && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 8,
            opacity: interpolate(finalProgress, [0.3, 0.7], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              fontFamily: brand.fonts.heading,
              fontSize: 28,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: 4,
            }}
          >
            PUBLAI
          </div>
          <div
            style={{
              fontFamily: brand.fonts.primary,
              fontSize: 12,
              color: brand.colors.textMedium,
              letterSpacing: 3,
              marginTop: 4,
            }}
          >
            TRANSFORM EVERYTHING
          </div>
        </div>
      )}
    </div>
  );
};
