/**
 * Scene configuration for PublAI Transformation Video
 *
 * 4 scenes with transitions:
 *   1. The Noise (10s) — grayscale social feed, slow scroll
 *   2. The Intelligence (12s) — high-tech UI grids, spring reveals
 *   3. The Transformation (10s) — mathematical diagram
 *   4. The Split-Screen (12s) — basic vs PublAI comparison
 */

export const FPS = 30;

export const scenes = [
  {
    id: 'noise',
    title: 'The Noise',
    durationSeconds: 10,
    durationInFrames: 10 * FPS,
    description: 'Dull grayscale social media feed with slow-motion scrolling',
  },
  {
    id: 'intelligence',
    title: 'The Intelligence',
    durationSeconds: 12,
    durationInFrames: 12 * FPS,
    description: 'High-tech UI grids, data points, composition guides with spring physics',
  },
  {
    id: 'transformation',
    title: 'The Transformation',
    durationSeconds: 10,
    durationInFrames: 10 * FPS,
    description: 'Smooth 3Blue1Brown-style mathematical diagram of PublAI engine',
  },
  {
    id: 'splitscreen',
    title: 'The Split-Screen',
    durationSeconds: 12,
    durationInFrames: 12 * FPS,
    description: 'Basic Brand vs PublAI side-by-side with slider merge',
  },
] as const;

export const TRANSITION_FRAMES = 20;

export const TOTAL_FRAMES = scenes.reduce((t, s) => t + s.durationInFrames, 0);
