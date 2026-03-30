import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Efeito "Mola" na Logo
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 150 },
  });
  
  // A logo sobe ligeiramente para abrir espaço para o texto
  const logoTranslateY = interpolate(frame, [30, 50], [0, -40], {
    extrapolateRight: 'clamp',
  });

  // Texto surgindo suave e flutuando para cima
  const textOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const textTranslateY = interpolate(frame, [40, 60], [50, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A', padding: '0 40px' }}>
      <VideoBackground videoSrc={staticFile('bg1.mp4')} />
      {/* Imagem Puxada da pasta Public com corte de iOS Icon (25%) */}
      <Img 
        src={staticFile('logo.png')} 
        style={{ 
          width: 500, 
          height: 'auto', 
          borderRadius: 125, // Transforma o fundo branco em formato App Oficial
          overflow: 'hidden',
          backgroundColor: '#FFF', // Garante que fique branco mesmo em transparente
          transform: `scale(${logoScale}) translateY(${logoTranslateY}px)`,
          filter: 'drop-shadow(0px 10px 30px rgba(16, 185, 129, 0.4))' // Brilho em verde
        }} 
      />
      
      {/* Texto Hook com Gradiente nas Cores do FitJá */}
      <h1
        style={{
          marginTop: 40,
          color: '#FFFFFF',
          fontSize: 75,
          fontWeight: '900',
          textAlign: 'center',
          lineHeight: 1.2,
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
          textShadow: '0px 4px 20px rgba(0,0,0,0.8)'
        }}
      >
        Cansado de treinar e<br />
        <span style={{ 
          background: 'linear-gradient(90deg, #10B981, #06b6d4, #3B82F6)', // Verde Luminoso para Azul
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
        }}>
          não ver resultados?
        </span>
      </h1>
    </AbsoluteFill>
  );
};
