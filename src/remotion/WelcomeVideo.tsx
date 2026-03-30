import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const WelcomeVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animação de entrada suave (Fade e movimento para cima)
  const opacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [0, fps], [50, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
      }}
    >
      <h1
        style={{
          color: '#FFFFFF',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 80,
          fontWeight: 'bold',
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        Bem-vindo ao<br />
        <span style={{ color: '#06b6d4' }}>FitJá App</span>
      </h1>
      
      <p
        style={{
          color: '#A1A1AA',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 32,
          marginTop: 40,
          opacity: interpolate(frame, [getDelay(fps), getDelay(fps) + fps], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
          textAlign: 'center',
        }}
      >
        Hackeando sua rotina para<br />resultados definitivos.
      </p>
    </AbsoluteFill>
  );
};

// Auxiliar para a animação do texto secundário
function getDelay(fps: number) {
  return fps * 1.5; // Começa 1.5 segundos após iniciar
}
