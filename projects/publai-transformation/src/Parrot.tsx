import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

/**
 * Animated Parrot - A colorful tropical parrot with organic motion.
 *
 * Features:
 * - Body bob with sin-wave
 * - Wing flap with spring physics
 * - Tail feather sway
 * - Eye blink cycle
 * - Head tilt
 * - Perch branch with leaves
 * - Tropical gradient background
 */

const COLORS = {
  body: '#2ECC40',
  bodyDark: '#1B8A2E',
  chest: '#FFDC00',
  chestOrange: '#FF851B',
  wing: '#0074D9',
  wingTip: '#001f3f',
  tail: '#FF4136',
  tailTip: '#85144b',
  beak: '#FF851B',
  beakDark: '#E65100',
  eye: '#111111',
  eyeRing: '#FFFFFF',
  pupil: '#000000',
  feet: '#666666',
  branch: '#5D4037',
  branchDark: '#3E2723',
  leaf: '#27AE60',
  leafDark: '#1E8449',
  bg1: '#0D1B2A',
  bg2: '#1B2838',
  bg3: '#1A4A3A',
};

const Wing: React.FC<{ flapAngle: number; side: 'left' | 'right' }> = ({
  flapAngle,
  side,
}) => {
  const scaleX = side === 'left' ? 1 : -1;
  return (
    <g transform={`scale(${scaleX}, 1)`}>
      <g transform={`rotate(${flapAngle}, 0, 0)`}>
        {/* Main wing */}
        <ellipse cx={-65} cy={10} rx={70} ry={28} fill={COLORS.wing} />
        {/* Wing detail stripes */}
        <ellipse cx={-80} cy={12} rx={45} ry={18} fill={COLORS.wingTip} opacity={0.4} />
        <ellipse cx={-95} cy={14} rx={25} ry={12} fill={COLORS.wingTip} opacity={0.6} />
        {/* Feather tips */}
        {[-110, -100, -90, -80].map((x, i) => (
          <ellipse
            key={i}
            cx={x}
            cy={16 + i * 2}
            rx={12}
            ry={6}
            fill={COLORS.wingTip}
            opacity={0.3 + i * 0.1}
            transform={`rotate(${10 + i * 5}, ${x}, ${16 + i * 2})`}
          />
        ))}
      </g>
    </g>
  );
};

const TailFeathers: React.FC<{ sway: number }> = ({ sway }) => (
  <g transform={`rotate(${sway}, 0, 40)`}>
    {/* Main tail feathers */}
    <ellipse cx={-8} cy={120} rx={18} ry={55} fill={COLORS.tail} />
    <ellipse cx={8} cy={125} rx={16} ry={50} fill={COLORS.tailTip} opacity={0.7} />
    <ellipse cx={-18} cy={115} rx={14} ry={48} fill={COLORS.tail} opacity={0.8} />
    {/* Long center feather */}
    <ellipse cx={0} cy={145} rx={8} ry={35} fill={COLORS.tailTip} />
    {/* Feather detail lines */}
    {[-12, -4, 4, 12].map((x, i) => (
      <line
        key={i}
        x1={x}
        y1={80}
        x2={x + sway * 0.3}
        y2={155}
        stroke={COLORS.tailTip}
        strokeWidth={1}
        opacity={0.3}
      />
    ))}
  </g>
);

const Eye: React.FC<{ blinkProgress: number; lookX: number }> = ({
  blinkProgress,
  lookX,
}) => {
  const eyeHeight = 14 * (1 - blinkProgress);
  return (
    <g>
      {/* Eye white ring */}
      <ellipse cx={18} cy={-22} rx={12} ry={12} fill={COLORS.eyeRing} />
      {/* Iris */}
      <ellipse
        cx={18 + lookX * 3}
        cy={-22}
        rx={8}
        ry={Math.max(1, eyeHeight * 0.6)}
        fill={COLORS.eye}
      />
      {/* Pupil */}
      <ellipse
        cx={19 + lookX * 4}
        cy={-23}
        rx={4}
        ry={Math.max(0.5, eyeHeight * 0.3)}
        fill={COLORS.pupil}
      />
      {/* Eye shine */}
      {blinkProgress < 0.5 && (
        <circle cx={21 + lookX * 2} cy={-26} r={2.5} fill="white" opacity={0.9} />
      )}
      {/* Eyelid */}
      {blinkProgress > 0.1 && (
        <ellipse
          cx={18}
          cy={-22 - 12 + blinkProgress * 24}
          rx={13}
          ry={12}
          fill={COLORS.bodyDark}
        />
      )}
    </g>
  );
};

const Beak: React.FC<{ openAmount: number }> = ({ openAmount }) => (
  <g>
    {/* Upper beak */}
    <path
      d={`M 28,-18 Q 55,-22 50,-12 Q 48,-8 28,-10 Z`}
      fill={COLORS.beak}
      stroke={COLORS.beakDark}
      strokeWidth={1}
    />
    {/* Beak curve detail */}
    <path
      d={`M 35,-17 Q 48,-19 46,-13`}
      fill="none"
      stroke={COLORS.beakDark}
      strokeWidth={0.8}
      opacity={0.5}
    />
    {/* Lower beak - opens with openAmount */}
    <path
      d={`M 28,-10 Q 42,${-8 + openAmount * 6} 42,${-6 + openAmount * 8} Q 38,${-4 + openAmount * 6} 28,-8 Z`}
      fill={COLORS.beakDark}
    />
    {/* Nostril */}
    <circle cx={38} cy={-16} r={1.5} fill={COLORS.beakDark} opacity={0.6} />
  </g>
);

const Branch: React.FC<{ frame: number }> = ({ frame }) => {
  const leafSway = Math.sin(frame * 0.04) * 5;
  return (
    <g>
      {/* Main branch */}
      <path
        d="M -300,200 Q -100,190 0,195 Q 100,200 200,185 Q 300,175 400,180"
        fill="none"
        stroke={COLORS.branch}
        strokeWidth={18}
        strokeLinecap="round"
      />
      {/* Branch texture */}
      <path
        d="M -300,200 Q -100,190 0,195 Q 100,200 200,185 Q 300,175 400,180"
        fill="none"
        stroke={COLORS.branchDark}
        strokeWidth={18}
        strokeLinecap="round"
        opacity={0.3}
        strokeDasharray="4 20"
      />
      {/* Smaller branches */}
      <path d="M -150,193 Q -160,170 -180,155" fill="none" stroke={COLORS.branch} strokeWidth={6} strokeLinecap="round" />
      <path d="M 250,182 Q 270,160 290,150" fill="none" stroke={COLORS.branch} strokeWidth={5} strokeLinecap="round" />

      {/* Leaves */}
      {[
        { x: -180, y: 150, rot: -30 + leafSway },
        { x: -170, y: 160, rot: 15 + leafSway * 0.7 },
        { x: 290, y: 145, rot: -20 - leafSway * 0.8 },
        { x: 280, y: 155, rot: 25 - leafSway * 0.5 },
        { x: -50, y: 188, rot: 80 + leafSway * 0.3 },
        { x: 150, y: 183, rot: -70 - leafSway * 0.4 },
      ].map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot})`}>
          <ellipse cx={0} cy={0} rx={22} ry={8} fill={i % 2 === 0 ? COLORS.leaf : COLORS.leafDark} />
          <line x1={-18} y1={0} x2={18} y2={0} stroke={COLORS.leafDark} strokeWidth={0.8} opacity={0.5} />
        </g>
      ))}
    </g>
  );
};

const Feet: React.FC = () => (
  <g>
    {/* Left foot */}
    <g transform="translate(-15, 75)">
      <line x1={0} y1={0} x2={-8} y2={20} stroke={COLORS.feet} strokeWidth={4} strokeLinecap="round" />
      <line x1={-8} y1={20} x2={-16} y2={26} stroke={COLORS.feet} strokeWidth={3} strokeLinecap="round" />
      <line x1={-8} y1={20} x2={-4} y2={28} stroke={COLORS.feet} strokeWidth={3} strokeLinecap="round" />
      <line x1={-8} y1={20} x2={-12} y2={30} stroke={COLORS.feet} strokeWidth={3} strokeLinecap="round" />
    </g>
    {/* Right foot */}
    <g transform="translate(15, 75)">
      <line x1={0} y1={0} x2={8} y2={18} stroke={COLORS.feet} strokeWidth={4} strokeLinecap="round" />
      <line x1={8} y1={18} x2={16} y2={24} stroke={COLORS.feet} strokeWidth={3} strokeLinecap="round" />
      <line x1={8} y1={18} x2={4} y2={26} stroke={COLORS.feet} strokeWidth={3} strokeLinecap="round" />
      <line x1={8} y1={18} x2={12} y2={28} stroke={COLORS.feet} strokeWidth={3} strokeLinecap="round" />
    </g>
  </g>
);

export const Parrot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // --- Body bob ---
  const bobY = Math.sin(frame * 0.08) * 6;
  const bobRotate = Math.sin(frame * 0.06) * 1.5;

  // --- Wing flap ---
  // Periodic flap bursts
  const flapCycle = frame % 120;
  const isFlapping = flapCycle < 30;
  const flapAngle = isFlapping
    ? Math.sin(flapCycle * 0.8) * 35
    : interpolate(flapCycle, [30, 50], [0, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  // --- Tail sway ---
  const tailSway = Math.sin(frame * 0.05) * 4;

  // --- Eye blink ---
  const blinkCycle = frame % 150;
  const blinkProgress =
    blinkCycle >= 0 && blinkCycle <= 8
      ? blinkCycle <= 4
        ? blinkCycle / 4
        : (8 - blinkCycle) / 4
      : 0;

  // --- Head tilt ---
  const headTilt = Math.sin(frame * 0.04) * 5;
  const lookX = Math.sin(frame * 0.03) * 0.5;

  // --- Beak open (chirp) ---
  const chirpCycle = frame % 90;
  const isChirping = chirpCycle > 60 && chirpCycle < 80;
  const beakOpen = isChirping
    ? Math.sin((chirpCycle - 60) * 0.3) * 0.8
    : 0;

  // --- Crest feathers ---
  const crestWave = Math.sin(frame * 0.07) * 3;

  // --- Entry animation ---
  const entryScale = spring({ frame, fps, config: { damping: 12, stiffness: 40 } });
  const safeEntry = Math.max(0, entryScale);

  // --- Background particles (floating feathers) ---
  const particles = Array.from({ length: 6 }).map((_, i) => {
    const speed = 0.3 + i * 0.15;
    const x = ((frame * speed + i * 320) % 1920) - 100;
    const y = 200 + Math.sin(frame * 0.02 + i * 2) * 150 + i * 120;
    const rot = frame * (0.5 + i * 0.3);
    const opacity = 0.15 + Math.sin(frame * 0.03 + i) * 0.1;
    const color = [COLORS.tail, COLORS.body, COLORS.wing, COLORS.chest, COLORS.tailTip, COLORS.bodyDark][i];
    return { x, y, rot, opacity, color };
  });

  return (
    <AbsoluteFill>
      {/* Tropical gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(46, 204, 64, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(0, 116, 217, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 65, 54, 0.06) 0%, transparent 60%),
            linear-gradient(170deg, ${COLORS.bg1} 0%, ${COLORS.bg2} 40%, ${COLORS.bg3} 100%)
          `,
        }}
      />

      {/* Floating feather particles */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {particles.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${p.rot})`} opacity={p.opacity}>
            <ellipse cx={0} cy={0} rx={15} ry={5} fill={p.color} />
            <line x1={-12} y1={0} x2={12} y2={0} stroke={p.color} strokeWidth={0.5} opacity={0.5} />
          </g>
        ))}
      </svg>

      {/* Main parrot SVG */}
      <svg
        viewBox="-350 -200 700 500"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${safeEntry})`,
        }}
      >
        {/* Branch */}
        <Branch frame={frame} />

        {/* Parrot body group - positioned on branch */}
        <g transform={`translate(0, ${bobY}) rotate(${bobRotate}, 0, 100)`}>
          {/* Tail */}
          <TailFeathers sway={tailSway} />

          {/* Left wing (behind body) */}
          <g transform="translate(-10, 20)">
            <Wing flapAngle={-flapAngle * 0.7} side="left" />
          </g>

          {/* Body */}
          <ellipse cx={0} cy={30} rx={48} ry={60} fill={COLORS.body} />
          {/* Body shading */}
          <ellipse cx={-10} cy={25} rx={38} ry={50} fill={COLORS.bodyDark} opacity={0.2} />
          {/* Chest gradient */}
          <ellipse cx={5} cy={45} rx={30} ry={35} fill={COLORS.chest} />
          <ellipse cx={8} cy={55} rx={22} ry={22} fill={COLORS.chestOrange} opacity={0.6} />

          {/* Chest feather texture */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M ${-10 + i * 8},${35 + i * 6} Q ${-5 + i * 8},${32 + i * 6} ${i * 8},${35 + i * 6}`}
              fill="none"
              stroke={COLORS.chestOrange}
              strokeWidth={0.8}
              opacity={0.3}
            />
          ))}

          {/* Right wing (in front) */}
          <g transform="translate(10, 20)">
            <Wing flapAngle={flapAngle} side="right" />
          </g>

          {/* Feet */}
          <Feet />

          {/* Head group */}
          <g transform={`rotate(${headTilt}, 0, -20)`}>
            {/* Head */}
            <ellipse cx={8} cy={-25} rx={32} ry={30} fill={COLORS.body} />
            {/* Head highlight */}
            <ellipse cx={12} cy={-30} rx={22} ry={20} fill={COLORS.bodyDark} opacity={0.15} />

            {/* Crest feathers */}
            {[0, 1, 2].map((i) => (
              <ellipse
                key={i}
                cx={-5 + i * 6}
                cy={-55 - i * 3 + crestWave * (i === 1 ? 1 : 0.5)}
                rx={4}
                ry={12 + i * 2}
                fill={i === 1 ? COLORS.chest : COLORS.body}
                transform={`rotate(${-10 + i * 10 + crestWave}, ${-5 + i * 6}, ${-45})`}
              />
            ))}

            {/* Eye */}
            <Eye blinkProgress={blinkProgress} lookX={lookX} />

            {/* Cheek patch */}
            <ellipse cx={24} cy={-12} rx={10} ry={8} fill="white" opacity={0.15} />

            {/* Beak */}
            <Beak openAmount={beakOpen} />
          </g>
        </g>

        {/* "Squawk" text when chirping */}
        {isChirping && (
          <g opacity={beakOpen * 1.2}>
            <text
              x={120}
              y={-60 + bobY}
              fill={COLORS.chest}
              fontSize={24}
              fontFamily="'Playfair Display', Georgia, serif"
              fontWeight={700}
              fontStyle="italic"
            >
              Squawk!
            </text>
            {/* Sound waves */}
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M ${85 + i * 15},${-45 + bobY} Q ${90 + i * 15},${-55 + bobY} ${85 + i * 15},${-65 + bobY}`}
                fill="none"
                stroke={COLORS.chest}
                strokeWidth={2}
                opacity={0.4 - i * 0.1}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 48,
          fontWeight: 700,
          color: '#FFFFFF',
          opacity: interpolate(frame, [20, 50], [0, 0.9], { extrapolateRight: 'clamp' }),
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          letterSpacing: 4,
        }}
      >
        TROPICAL PARROT
      </div>
    </AbsoluteFill>
  );
};
