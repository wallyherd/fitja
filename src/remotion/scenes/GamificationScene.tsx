import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';

export const GamificationScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Pulso do titulo
    const titleScale = spring({ frame: frame - 10, fps, config: { damping: 12 } });

    // Pódios pulando (Crescente 3º, 2º, 1º)
    const podium3Y = spring({ frame: frame - 30, fps, config: { damping: 15 } });
    const p3H = interpolate(podium3Y, [0, 1], [0, 200]);

    const podium2Y = spring({ frame: frame - 60, fps, config: { damping: 15 } });
    const p2H = interpolate(podium2Y, [0, 1], [0, 350]);

    const podium1Y = spring({ frame: frame - 100, fps, config: { damping: 15 } });
    const p1H = interpolate(podium1Y, [0, 1], [0, 500]);
    
    // Troféu do Vencedor cai de cima
    const trophyY = spring({ frame: frame - 120, fps, config: { damping: 12 } });
    const tropDisplayY = interpolate(trophyY, [0, 1], [-500, -80]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#0A0A0A', padding: '60px 50px', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
            <VideoBackground videoSrc={staticFile('bg5.mp4')} />
            <h2 style={{ color: '#FFF', fontSize: 62, fontWeight: '900', textAlign: 'center', transform: `scale(${titleScale})`, lineHeight: 1.1 }}>
              <span style={{ color: '#FCD34D' }}>Comunidade Viva!</span><br />
              Suba no Ranking👑
            </h2>

            <p style={{ color: '#A1A1AA', fontSize: 34, textAlign: 'center', marginTop: 40, opacity: interpolate(frame, [15, 30], [0, 1]) }}>
              Cumpra metas, alcance desafios<br/>e ganhe <strong style={{color: '#10B981'}}>prêmios reais</strong>!
            </p>

            <div style={{ display: 'flex', gap: 30, marginTop: 250, alignItems: 'flex-end', height: 600, position: 'relative' }}>
                
                {/* 3º Lugar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: 60, marginBottom: 20, transform: `scale(${podium3Y})` }}>🥉</div>
                    <div style={{ width: 170, height: p3H, backgroundColor: '#b87333', borderRadius: '40px 40px 0 0', display: 'flex', justifyContent: 'center', paddingTop: 30 }}>
                        <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: 50 }}>3º</span>
                    </div>
                </div>

                {/* 1º Lugar (Centro Superior) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Troféu Gigante flutuando */}
                    <div style={{ fontSize: 130, position: 'absolute', transform: `translateY(${tropDisplayY}px)`, zIndex: 10, filter: 'drop-shadow(0px 30px 50px rgba(252, 211, 77, 0.4))' }}>🏆</div>
                    
                    <div style={{ width: 220, height: p1H, background: 'linear-gradient(0deg, #F59E0B, #FCD34D)', borderRadius: '40px 40px 0 0', display: 'flex', justifyContent: 'center', paddingTop: 40, boxShadow: '0 -20px 80px rgba(252, 211, 77, 0.5)', zIndex: 5 }}>
                        <span style={{ color: '#000', fontWeight: '900', fontSize: 70 }}>1º</span>
                    </div>
                </div>

                {/* 2º Lugar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: 60, marginBottom: 20, transform: `scale(${podium2Y})` }}>🥈</div>
                    <div style={{ width: 170, height: p2H, backgroundColor: '#9CA3AF', borderRadius: '40px 40px 0 0', display: 'flex', justifyContent: 'center', paddingTop: 30 }}>
                        <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: 50 }}>2º</span>
                    </div>
                </div>

            </div>
        </AbsoluteFill>
    );
};
