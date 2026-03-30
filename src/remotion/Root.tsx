import React from 'react';
import { Composition } from 'remotion';
import { WelcomeVideo } from './WelcomeVideo';
import { AdVideo } from './AdVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Welcome"
        component={WelcomeVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FitJaAd"
        component={AdVideo}
        durationInFrames={1800} // 60 segundos inteiros!
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
