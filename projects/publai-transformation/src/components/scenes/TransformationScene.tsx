import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { brand } from '../../config/brand';

/**
 * Scene 3: The Transformation
 *
 * A smooth, 3Blue1Brown-style mathematical diagram representing
 * PublAI's transformation engine. Uses the Manimate visual language:
 * - Dark background with semantic colors
 * - Elements build up step by step
 * - Spring physics for node appearances
 */

const COLORS = {
  input: '#888888',
  processing: '#61BA5E',
  output: '#7DD47A',
  connection: 'rgba(97, 186, 94, 0.3)',
  highlight: '#FFFFFF',
  dim: '#444444',
};

interface NodeConfig {
  cx: number;
  cy: number;
  label: string;
  layer: number;
  delay: number;
}

// Input layer -> Processing layer -> Output layer
const NODES: NodeConfig[] = [
  // Input layer (raw content)
  { cx: 300, cy: 280, label: 'Text', layer: 0, delay: 0 },
  { cx: 300, cy: 440, label: 'Image', layer: 0, delay: 3 },
  { cx: 300, cy: 600, label: 'Video', layer: 0, delay: 6 },
  { cx: 300, cy: 760, label: 'Audio', layer: 0, delay: 9 },

  // Processing layer (AI engine)
  { cx: 720, cy: 320, label: 'Analyze', layer: 1, delay: 20 },
  { cx: 720, cy: 500, label: 'Compose', layer: 1, delay: 23 },
  { cx: 720, cy: 680, label: 'Optimize', layer: 1, delay: 26 },

  // Deep processing
  { cx: 1100, cy: 400, label: 'Transform', layer: 2, delay: 40 },
  { cx: 1100, cy: 600, label: 'Enhance', layer: 2, delay: 43 },

  // Output layer
  { cx: 1500, cy: 380, label: 'Cinematic', layer: 3, delay: 60 },
  { cx: 1500, cy: 540, label: 'Branded', layer: 3, delay: 63 },
  { cx: 1500, cy: 700, label: 'Engaging', layer: 3, delay: 66 },
];

// Connections between layers
const CONNECTIONS: [number, number][] = [
  // Input -> Processing
  [0, 4], [0, 5], [1, 4], [1, 5], [1, 6], [2, 5], [2, 6], [3, 6],
  // Processing -> Deep
  [4, 7], [4, 8], [5, 7], [5, 8], [6, 7], [6, 8],
  // Deep -> Output
  [7, 9], [7, 10], [8, 10], [8, 11], [7, 11],
];

const NetworkNode: React.FC<{ node: NodeConfig; frame: number; fps: number }> = ({
  node,
  frame,
  fps,
}) => {
  const scale = spring({
    frame: frame - node.delay,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const safeScale = Math.max(0, scale);

  const nodeColor =
    node.layer === 0
      ? COLORS.input
      : node.layer === 3
      ? COLORS.output
      : COLORS.processing;

  const glowIntensity = node.layer >= 2 ? 0.6 : 0.3;
  const radius = node.layer === 1 || node.layer === 2 ? 32 : 26;

  return (
    <g transform={`translate(${node.cx}, ${node.cy}) scale(${safeScale})`}>
      {/* Glow */}
      <circle r={radius + 12} fill={nodeColor} opacity={glowIntensity * safeScale * 0.2} />
      {/* Node */}
      <circle
        r={radius}
        fill="rgba(13, 13, 13, 0.9)"
        stroke={nodeColor}
        strokeWidth={2}
      />
      {/* Inner pulse */}
      <circle
        r={radius * 0.4}
        fill={nodeColor}
        opacity={0.5 + Math.sin(frame * 0.05 + node.delay) * 0.2}
      />
      {/* Label */}
      <text
        y={radius + 22}
        textAnchor="middle"
        fill={COLORS.highlight}
        fontSize={14}
        fontFamily="Inter, sans-serif"
        fontWeight={500}
      >
        {node.label}
      </text>
    </g>
  );
};

export const TransformationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  // Layer labels
  const layerLabels = [
    { x: 300, label: 'RAW INPUT', delay: 12 },
    { x: 720, label: 'AI ENGINE', delay: 30 },
    { x: 1100, label: 'DEEP PROCESSING', delay: 48 },
    { x: 1500, label: 'OUTPUT', delay: 68 },
  ];

  // Data flow animation along connections
  const flowPhase = (frame % 60) / 60;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0D0D0D' }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 50,
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
          Scene 03
        </div>
        <div
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: 48,
            fontWeight: 700,
            color: '#FFFFFF',
            opacity: Math.max(0, titleProgress),
            marginTop: 4,
          }}
        >
          The Transformation Engine
        </div>
      </div>

      {/* Network diagram */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1920 1080"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.input} stopOpacity={0.1} />
            <stop offset="50%" stopColor={COLORS.processing} stopOpacity={0.6} />
            <stop offset="100%" stopColor={COLORS.output} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {/* Connections */}
        {CONNECTIONS.map(([from, to], i) => {
          const fromNode = NODES[from];
          const toNode = NODES[to];
          const connectionDelay = Math.max(fromNode.delay, toNode.delay) - 5;
          const connOpacity = spring({
            frame: frame - connectionDelay,
            fps,
            config: { damping: 20, stiffness: 60 },
          });

          return (
            <line
              key={i}
              x1={fromNode.cx}
              y1={fromNode.cy}
              x2={toNode.cx}
              y2={toNode.cy}
              stroke={COLORS.processing}
              strokeWidth={1.5}
              opacity={Math.max(0, connOpacity) * 0.25}
            />
          );
        })}

        {/* Data flow particles along connections */}
        {frame > 50 &&
          CONNECTIONS.filter((_, i) => i % 3 === 0).map(([from, to], i) => {
            const fromNode = NODES[from];
            const toNode = NODES[to];
            const t = (flowPhase + i * 0.15) % 1;
            const px = fromNode.cx + (toNode.cx - fromNode.cx) * t;
            const py = fromNode.cy + (toNode.cy - fromNode.cy) * t;

            return (
              <circle
                key={`flow-${i}`}
                cx={px}
                cy={py}
                r={3}
                fill={COLORS.processing}
                opacity={0.7}
              />
            );
          })}

        {/* Nodes */}
        {NODES.map((node, i) => (
          <NetworkNode key={i} node={node} frame={frame} fps={fps} />
        ))}

        {/* Layer labels */}
        {layerLabels.map((lbl, i) => {
          const lblOpacity = spring({
            frame: frame - lbl.delay,
            fps,
            config: { damping: 20, stiffness: 80 },
          });
          return (
            <text
              key={i}
              x={lbl.x}
              y={200}
              textAnchor="middle"
              fill={COLORS.processing}
              fontSize={12}
              fontFamily="Inter, sans-serif"
              fontWeight={600}
              letterSpacing={3}
              opacity={Math.max(0, lblOpacity) * 0.5}
            >
              {lbl.label}
            </text>
          );
        })}
      </svg>

      {/* Equation overlay - appears late */}
      {frame > 180 && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 100,
            fontFamily: brand.fonts.mono,
            fontSize: 20,
            color: brand.colors.primary,
            opacity: interpolate(frame, [180, 210], [0, 0.6], { extrapolateRight: 'clamp' }),
            letterSpacing: 1,
          }}
        >
          f(content) = PublAI(analyze ∘ compose ∘ optimize)(x)
        </div>
      )}
    </AbsoluteFill>
  );
};
