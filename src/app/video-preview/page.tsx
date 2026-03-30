"use client";

import dynamic from 'next/dynamic';
import { AdVideo } from '../../remotion/AdVideo';

// Opcional: Loader básico enquanto o player carrega no cliente
const PlayerFallback = () => <div className="w-[350px] aspect-[9/16] bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500">Carregando Player...</div>;

// Carregando o Player do Remotion APENAS no lado do cliente
const Player = dynamic(
  () => import('@remotion/player').then((mod) => mod.Player),
  { ssr: false, loading: () => <PlayerFallback /> }
);

export default function VideoPreview() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
      <h1 className="text-3xl font-bold mb-2 text-cyan-400">Estúdio de Vídeo FitJá</h1>
      <p className="mb-8 text-zinc-400 text-center max-w-md">
        Visualize os vídeos promocionais e de conteúdo gerados via código, prontos para renderizar em alta qualidade.
      </p>

      <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative w-[350px] aspect-[9/16]">
        <Player
          component={AdVideo}
          durationInFrames={1800} // 60 Segundos
          compositionWidth={1080}
          compositionHeight={1920}
          fps={30}
          style={{
            width: '100%',
            maxWidth: '350px',
            aspectRatio: '9/16',
            backgroundColor: '#0a0a0a'
          }}
          controls
          autoPlay
          loop
        />
      </div>
    </div>
  );
}
