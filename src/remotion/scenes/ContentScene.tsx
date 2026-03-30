import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';

export const ContentScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Título pulando na tela
    const titleScale = spring({ frame: frame - 15, fps, config: { damping: 12 } });

    // Animação de cartões empilhados estilo carrossel de livros
    const content1TranslateY = spring({ frame: frame - 40, fps, config: { damping: 14 } });
    const content1Rot = interpolate(content1TranslateY, [0, 1], [-45, -8]);
    const content1Y = interpolate(content1TranslateY, [0, 1], [1500, 0]);

    const content2TranslateY = spring({ frame: frame - 80, fps, config: { damping: 14 } });
    const content2Rot = interpolate(content2TranslateY, [0, 1], [45, 8]);
    const content2Y = interpolate(content2TranslateY, [0, 1], [1500, 0]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#0A0A0A', padding: '60px 40px', alignItems: 'center', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
            <VideoBackground videoSrc={staticFile('bg4.mp4')} />
            <h2 style={{ color: '#FFF', fontSize: 62, fontWeight: '900', textAlign: 'center', transform: `scale(${titleScale})`, lineHeight: 1.1 }}>
              <span style={{ color: '#10B981' }}>Biblioteca Infinita</span><br />
              de conhecimento.
            </h2>

            <div style={{ position: 'relative', width: '100%', height: 750, marginTop: 180 }}>
                {/* Cartão de Artigos/Dietas (Azul) */}
                <div style={{ 
                    position: 'absolute', left: 20, top: 40, width: 450, height: 650, backgroundColor: '#1F2937', borderRadius: 50, border: '4px solid #06b6d4', 
                    transform: `translateY(${content1Y}px) rotate(${content1Rot}deg)`,
                    boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)', padding: 50, zIndex: 1, display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ fontSize: 90, marginBottom: 30 }}>📘🍎</div>
                    <h3 style={{ color: '#FFF', fontSize: 45, margin: 0, fontWeight: '900', lineHeight: 1.2 }}>Artigos &amp;<br/>Dietas Premium</h3>
                    <p style={{ color: '#A1A1AA', fontSize: 32, marginTop: 30 }}>Tenha acesso ao acervo dos melhores nutricionistas.</p>
                </div>

                {/* Cartão de Treinos Especiais (Verde Brilhante) */}
                <div style={{ 
                    position: 'absolute', right: 20, top: 120, width: 500, height: 650, background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 50, 
                    transform: `translateY(${content2Y}px) rotate(${content2Rot}deg)`,
                    boxShadow: '0 30px 80px rgba(16, 185, 129, 0.5)', padding: 50, zIndex: 2, display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ fontSize: 90, marginBottom: 30, background: 'rgba(255,255,255,0.2)', width: 150, height: 150, borderRadius: 75, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>🏋️‍♂️</div>
                    <h3 style={{ color: '#FFF', fontSize: 48, margin: 0, fontWeight: '900', lineHeight: 1.1 }}>Super<br/>Treinos</h3>
                    <p style={{ color: '#FFF', opacity: 0.9, fontSize: 34, marginTop: 30, fontWeight: 'bold' }}>Séries perfeitas desenhadas por especialistas.</p>
                </div>
            </div>
        </AbsoluteFill>
    );
};
