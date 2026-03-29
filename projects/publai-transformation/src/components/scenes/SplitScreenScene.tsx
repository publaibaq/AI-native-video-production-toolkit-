import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { brand } from '../../config/brand';

/**
 * Scene 4: The Split-Screen
 *
 * Left: "Basic Brand" with bad lighting, flat design, generic look
 * Right: "PublAI Version" with cinematic depth, proper composition
 * A smooth slider transitions from split to full PublAI green.
 */

const BasicBrandSide: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#e8e8e8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'saturate(0.3) brightness(0.95)',
      position: 'relative',
    }}
  >
    {/* Bad lighting - harsh flat overlay */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(200,200,200,0.2) 100%)',
      }}
    />

    {/* Generic content */}
    <div
      style={{
        width: 400,
        padding: 40,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        border: '1px solid #ddd',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          backgroundColor: '#ccc',
          borderRadius: '50%',
          margin: '0 auto 20px',
        }}
      />
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 28, color: '#666', fontWeight: 700 }}>
        Basic Brand
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 16, color: '#999', marginTop: 12 }}>
        Generic content that blends in
      </div>
      <div
        style={{
          marginTop: 24,
          padding: '10px 24px',
          backgroundColor: '#bbb',
          color: '#fff',
          borderRadius: 4,
          display: 'inline-block',
          fontFamily: 'Arial, sans-serif',
          fontSize: 14,
        }}
      >
        Learn More
      </div>
    </div>

    {/* Label */}
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        fontFamily: 'Arial, sans-serif',
        fontSize: 14,
        color: '#999',
        letterSpacing: 4,
        textTransform: 'uppercase',
      }}
    >
      Before
    </div>
  </div>
);

const PublAISide: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: brand.colors.bgDark,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}
  >
    {/* Cinematic lighting */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 30% 30%, rgba(97, 186, 94, 0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 70%, rgba(97, 186, 94, 0.08) 0%, transparent 50%)
        `,
      }}
    />
    {/* Vignette */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
      }}
    />

    {/* Premium content card */}
    <div
      style={{
        width: 420,
        padding: 48,
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        borderRadius: 12,
        border: `1px solid ${brand.colors.primary}30`,
        textAlign: 'center',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 24px 80px rgba(0, 0, 0, 0.4), 0 0 40px ${brand.colors.primary}10`,
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primaryLight})`,
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 30px ${brand.colors.primary}40`,
        }}
      >
        <div style={{ color: '#FFF', fontSize: 28, fontWeight: 700 }}>P</div>
      </div>

      <div
        style={{
          fontFamily: brand.fonts.heading,
          fontSize: 32,
          color: '#FFFFFF',
          fontWeight: 700,
        }}
      >
        PublAI Brand
      </div>
      <div
        style={{
          fontFamily: brand.fonts.primary,
          fontSize: 16,
          color: brand.colors.textMedium,
          marginTop: 12,
          lineHeight: 1.6,
        }}
      >
        Content that commands attention
      </div>
      <div
        style={{
          marginTop: 28,
          padding: '12px 28px',
          background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primaryLight})`,
          color: '#FFFFFF',
          borderRadius: 8,
          display: 'inline-block',
          fontFamily: brand.fonts.primary,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 1,
          boxShadow: `0 4px 20px ${brand.colors.primary}40`,
        }}
      >
        Get Started
      </div>
    </div>

    {/* Label */}
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        fontFamily: brand.fonts.primary,
        fontSize: 14,
        color: brand.colors.primary,
        letterSpacing: 4,
        textTransform: 'uppercase',
      }}
    >
      After — PublAI
    </div>
  </div>
);

export const SplitScreenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slider position: starts at 50% (center), slides right to reveal PublAI
  const sliderX = interpolate(
    frame,
    [0, 60, 240, 300],
    [50, 50, 50, 10],  // Hold at center, then slide left to show mostly PublAI
    { extrapolateRight: 'clamp' }
  );

  // Final merge to full PublAI green
  const mergeProgress = interpolate(frame, [300, 360], [0, 1], { extrapolateRight: 'clamp' });

  // Title
  const titleProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  // VS label
  const vsOpacity = interpolate(frame, [30, 50, 240, 260], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.bgDark }}>
      {/* Scene title */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 80,
          zIndex: 20,
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
          Scene 04
        </div>
        <div
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: 40,
            fontWeight: 700,
            color: '#FFFFFF',
            opacity: Math.max(0, titleProgress),
            marginTop: 4,
          }}
        >
          The Comparison
        </div>
      </div>

      {/* Split container */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Left side - Basic Brand */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${sliderX}%`,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: 1920, height: 1080 }}>
            <BasicBrandSide />
          </div>
        </div>

        {/* Right side - PublAI */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${sliderX}%`,
            width: `${100 - sliderX}%`,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 1920,
              height: 1080,
              marginLeft: -(1920 * sliderX) / 100,
            }}
          >
            <PublAISide frame={frame} />
          </div>
        </div>

        {/* Slider handle */}
        {mergeProgress < 0.9 && (
          <div
            style={{
              position: 'absolute',
              left: `${sliderX}%`,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: brand.colors.primary,
              boxShadow: `0 0 20px ${brand.colors.primary}80`,
              zIndex: 10,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Handle grip */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: brand.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 24px ${brand.colors.primary}60`,
              }}
            >
              <div style={{ color: '#FFF', fontSize: 16 }}>◀▶</div>
            </div>
          </div>
        )}

        {/* VS label */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${sliderX}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            opacity: vsOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: '8px 20px',
              borderRadius: 20,
              fontFamily: brand.fonts.heading,
              fontSize: 20,
              color: '#FFFFFF',
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            VS
          </div>
        </div>
      </div>

      {/* Final merge overlay */}
      {mergeProgress > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: brand.colors.primary,
            opacity: mergeProgress * 0.15,
            zIndex: 25,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
