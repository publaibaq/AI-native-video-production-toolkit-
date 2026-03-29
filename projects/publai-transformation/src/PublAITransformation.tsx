import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { scenes, TRANSITION_FRAMES } from './config/scenes';
import { brand } from './config/brand';
import { GrainOverlay, GradientMesh, Vignette } from './components/overlays';
import { NoiseScene } from './components/scenes/NoiseScene';
import { IntelligenceScene } from './components/scenes/IntelligenceScene';
import { TransformationScene } from './components/scenes/TransformationScene';
import { SplitScreenScene } from './components/scenes/SplitScreenScene';
import { GlitchTransition } from './components/transitions/GlitchTransition';
import { QuoteCallout } from './components/overlays/QuoteCallout';
import { AnimatedStats } from './components/overlays/AnimatedStats';
import { PublAILogo } from './components/overlays/PublAILogo';

export const PublAITransformation: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.bgDark,
        fontFamily: brand.fonts.primary,
      }}
    >
      {/* Atmospheric depth layers */}
      <GradientMesh />
      <Vignette intensity={0.65} />
      <GrainOverlay opacity={0.035} />

      {/* Scene sequence with glitch transitions */}
      <TransitionSeries>
        {/* Scene 1: The Noise */}
        <TransitionSeries.Sequence durationInFrames={scenes[0].durationInFrames}>
          <NoiseScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={GlitchTransition()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 2: The Intelligence */}
        <TransitionSeries.Sequence durationInFrames={scenes[1].durationInFrames}>
          <IntelligenceScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={GlitchTransition()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 3: The Transformation */}
        <TransitionSeries.Sequence durationInFrames={scenes[2].durationInFrames}>
          <TransformationScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={GlitchTransition()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 4: The Split-Screen */}
        <TransitionSeries.Sequence durationInFrames={scenes[3].durationInFrames}>
          <SplitScreenScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Cinematic overlays */}
      <QuoteCallout />
      <AnimatedStats />
      <PublAILogo />
    </AbsoluteFill>
  );
};
