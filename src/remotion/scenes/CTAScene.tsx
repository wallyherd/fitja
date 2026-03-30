import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';

export const CTAScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Pulso Final da logo
    const logoScale = spring({ frame: frame - 10, fps, config: { damping: 10, mass: 0.8, stiffness: 120 } });
    const textOpacity = interpolate(frame, [15, 30], [0, 1]);
    
    // Botão de Download flutuando
    const boxTranslateY = spring({ frame: frame - 40, fps, config: { damping: 14 } });
    const currentBoxY = interpolate(boxTranslateY, [0, 1], [400, 0]);

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A', padding: '0 40px' }}>
            <VideoBackground videoSrc={staticFile('bg7.mp4')} />
            {/* Logo de Impacto c/ Brilho */}
            <Img 
                src={staticFile('logo.png')} 
                style={{ 
                width: 500, 
                height: 'auto', 
                borderRadius: 125, // Formato ícone iOS
                overflow: 'hidden',
                backgroundColor: '#FFF',
                transform: `scale(${logoScale})`,
                filter: 'drop-shadow(0px 10px 50px rgba(16, 185, 129, 0.4))'
                }} 
            />
            
            <h1
                style={{
                marginTop: 60,
                color: '#FFFFFF',
                fontSize: 65,
                fontWeight: '900',
                textAlign: 'center',
                lineHeight: 1.2,
                opacity: textOpacity,
                fontFamily: 'system-ui, sans-serif'
                }}
            >
                Sua saúde,<br />
                <span style={{ color: '#06b6d4' }}>totalmente sob controle.</span>
            </h1>

            {/* Simulação Botão App Store */}
            <div style={{
                marginTop: 100,
                padding: '35px 80px',
                background: 'linear-gradient(90deg, #10B981, #059669)',
                borderRadius: 60,
                transform: `translateY(${currentBoxY}px)`,
                boxShadow: '0 30px 80px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 25
            }}>
                <span style={{ fontSize: 60 }}>📱</span>
                <span style={{ color: 'white', fontSize: 50, fontWeight: 'bold', fontFamily: 'system-ui, sans-serif' }}>BAIXE AGORA</span>
            </div>
            
            <p style={{ marginTop: 60, color: '#A1A1AA', fontSize: 35, opacity: textOpacity, fontFamily: 'system-ui, sans-serif' }}>
              Disponível para iOS e Android
            </p>
        </AbsoluteFill>
    );
};
