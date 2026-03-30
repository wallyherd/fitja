import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';

export const FeaturesScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleScale = spring({ frame: frame - 15, fps, config: { damping: 12 } });
    
    // Entradas dinâmicas dos Cards de Funcionalidade
    const card1TranslateX = spring({ frame: frame - 45, fps, config: { damping: 14 } });
    const c1X = interpolate(card1TranslateX, [0, 1], [-1200, 0]); // Vem da esquerda

    const card2TranslateX = spring({ frame: frame - 90, fps, config: { damping: 14 } });
    const c2X = interpolate(card2TranslateX, [0, 1], [1200, 0]); // Vem da direita
    
    const card3TranslateY = spring({ frame: frame - 160, fps, config: { damping: 14 } });
    const c3Y = interpolate(card3TranslateY, [0, 1], [1200, 0]); // Vem de baixo

    return (
        <AbsoluteFill style={{ backgroundColor: '#0A0A0A', padding: '60px 50px', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
            <VideoBackground videoSrc={staticFile('bg3.mp4')} />
            <h2 style={{ color: '#FFF', fontSize: 62, fontWeight: '900', textAlign: 'center', transform: `scale(${titleScale})`, lineHeight: 1.1 }}>
              <span style={{ color: '#3B82F6' }}>Ecossistema Completo</span><br />
              na palma da mão.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginTop: 100, width: '100%' }}>
                
                {/* Funcionalidade 1: Refeições Inteligentes */}
                <div style={{ backgroundColor: '#111827', borderRadius: 40, padding: 40, border: '4px solid #374151', transform: `translateX(${c1X}px)`, display: 'flex', alignItems: 'center', gap: 30 }}>
                    <div style={{ fontSize: 65, backgroundColor: '#1F2937', padding: 25, borderRadius: 30 }}>📸</div>
                    <div>
                        <h3 style={{ color: '#FFF', fontSize: 38, margin: 0, fontWeight: 'bold' }}>Dieta por Foto ou Texto</h3>
                        <p style={{ color: '#10B981', fontSize: 26, margin: '15px 0 0', fontWeight: 'bold' }}>✨ Cálculo calórico mágico</p>
                    </div>
                </div>

                {/* Funcionalidade 2: Treinos */}
                <div style={{ backgroundColor: '#111827', borderRadius: 40, padding: 40, border: '4px solid #374151', transform: `translateX(${c2X}px)`, display: 'flex', alignItems: 'center', gap: 30 }}>
                    <div style={{ fontSize: 65, backgroundColor: '#1F2937', padding: 25, borderRadius: 30 }}>💪</div>
                    <div>
                        <h3 style={{ color: '#FFF', fontSize: 38, margin: 0, fontWeight: 'bold' }}>Registro de Treino</h3>
                        <p style={{ color: '#06b6d4', fontSize: 26, margin: '15px 0 0', fontWeight: 'bold' }}>Séries, cargas e evolução</p>
                    </div>
                </div>

                {/* Funcionalidade 3: Painel Destaque */}
                <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 40, padding: 50, transform: `translateY(${c3Y}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)' }}>
                    <div style={{ fontSize: 80 }}>🥗 ⚡ 📊</div>
                    <h3 style={{ color: '#FFF', fontSize: 45, margin: 0, fontWeight: '900', textAlign: 'center' }}>Controle Calórico 100% Automático!</h3>
                </div>

            </div>
        </AbsoluteFill>
    );
};
