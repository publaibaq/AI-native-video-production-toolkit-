import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { brand } from '../../config/brand';

/**
 * Scene 1: The Noise
 *
 * A dull, grayscale social media feed scrolling in slow motion.
 * Represents the mediocrity of generic content before PublAI.
 */

const MOCK_POSTS = [
  { type: 'text', content: 'Just another day at the office...', likes: 12, shares: 2 },
  { type: 'image', content: 'Check out my lunch! #foodie', likes: 34, shares: 5 },
  { type: 'text', content: 'Who else is tired of Mondays?', likes: 8, shares: 1 },
  { type: 'text', content: 'Big announcement coming soon...', likes: 23, shares: 7 },
  { type: 'image', content: 'Sunset from my window', likes: 56, shares: 12 },
  { type: 'text', content: 'Can\'t believe it\'s already March', likes: 15, shares: 3 },
  { type: 'text', content: 'Anyone else struggling with engagement?', likes: 6, shares: 0 },
  { type: 'image', content: 'Team photo from last week', likes: 42, shares: 8 },
];

const FeedPost: React.FC<{ post: typeof MOCK_POSTS[0]; index: number; scrollY: number }> = ({
  post,
  index,
  scrollY,
}) => {
  const yPos = index * 160 - scrollY;

  return (
    <div
      style={{
        position: 'absolute',
        top: yPos,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        padding: '20px 24px',
        backgroundColor: 'rgba(40, 40, 40, 0.6)',
        borderRadius: 8,
        border: '1px solid rgba(60, 60, 60, 0.4)',
        fontFamily: brand.fonts.primary,
      }}
    >
      {/* Avatar placeholder */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#3a3a3a',
          }}
        />
        <div>
          <div style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>Generic User</div>
          <div style={{ color: '#555', fontSize: 11 }}>2h ago</div>
        </div>
      </div>

      {/* Post content */}
      <div style={{ color: '#999', fontSize: 16, lineHeight: 1.5, marginBottom: 12 }}>
        {post.content}
      </div>

      {/* Image placeholder */}
      {post.type === 'image' && (
        <div
          style={{
            width: '100%',
            height: 200,
            backgroundColor: '#2a2a2a',
            borderRadius: 6,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: '#444', fontSize: 40 }}>□</div>
        </div>
      )}

      {/* Engagement bar */}
      <div style={{ display: 'flex', gap: 24, color: '#555', fontSize: 13 }}>
        <span>♡ {post.likes}</span>
        <span>↻ {post.shares}</span>
        <span>○ Comment</span>
      </div>
    </div>
  );
};

export const NoiseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow-motion scroll - the feed drifts upward lazily
  const scrollY = interpolate(frame, [0, 300], [0, 600], {
    extrapolateRight: 'clamp',
  });

  // Fade in from black
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  // Title "THE NOISE" appears with spring
  const titleScale = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 80 } });
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });

  // Desaturation label
  const labelOpacity = interpolate(frame, [60, 80], [0, 0.6], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#111111',
        filter: 'saturate(0) contrast(0.85) brightness(0.7)',
        opacity: fadeIn,
      }}
    >
      {/* Scrolling feed */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {MOCK_POSTS.map((post, i) => (
          <FeedPost key={i} post={post} index={i} scrollY={scrollY} />
        ))}
      </div>

      {/* Scene title overlay - outside the grayscale filter parent */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          zIndex: 10,
          filter: 'saturate(1) contrast(1) brightness(1)',
        }}
      >
        <div
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: 18,
            fontWeight: 500,
            color: '#555',
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: labelOpacity,
          }}
        >
          Scene 01
        </div>
        <div
          style={{
            fontFamily: brand.fonts.heading,
            fontSize: 56,
            fontWeight: 700,
            color: '#888',
            opacity: titleOpacity,
            transform: `scale(${Math.max(0, titleScale)})`,
            transformOrigin: 'left center',
            marginTop: 4,
          }}
        >
          The Noise
        </div>
      </div>
    </AbsoluteFill>
  );
};
