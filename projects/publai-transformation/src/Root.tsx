import { Composition } from 'remotion';
import { PublAITransformation } from './PublAITransformation';
import { TOTAL_FRAMES, FPS } from './config/scenes';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PublAITransformation"
      component={PublAITransformation}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
