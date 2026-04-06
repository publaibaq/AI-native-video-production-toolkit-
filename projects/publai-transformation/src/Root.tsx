import { Composition } from 'remotion';
import { PublAITransformation } from './PublAITransformation';
import { Parrot } from './Parrot';
import { TOTAL_FRAMES, FPS } from './config/scenes';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PublAITransformation"
        component={PublAITransformation}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Parrot"
        component={Parrot}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
