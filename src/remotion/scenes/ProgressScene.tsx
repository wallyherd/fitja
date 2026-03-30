import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, staticFile } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';

export const ProgressScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Animação dos Textos
    const titleOpacity = interpolate(frame, [0, 15], [0, 1]);
    const subtitleOpacity = interpolate(frame, [60, 75], [0, 1]);

    // Animação das Barras de Gráfico subindo com Efeito Spring
    const progressSpring = spring({ frame: frame - 20, fps, config: { damping: 12, mass: 1 }, durationInFrames: 60 });
    const bar1Height = interpolate(progressSpring, [0, 1], [0, 300]);
    const bar2Height = interpolate(progressSpring, [0, 1], [0, 500]);
    const bar3Height = interpolate(progressSpring, [0, 1], [0, 700]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#0A0A0A', padding: '40px 60px', alignItems: 'center', justifyContent: 'center' }}>
            <VideoBackground videoSrc={staticFile('bg6.mp4')} />
            
            {/* Título de Impacto da Solução */}
            <h2 style={{ color: '#FFF', fontSize: 75, fontWeight: '900', textAlign: 'center', opacity: titleOpacity, lineHeight: 1.1, fontFamily: 'system-ui, sans-serif' }}>
              <span style={{ 
                background: 'linear-gradient(90deg, #06b6d4, #10B981)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent'
              }}>
                Acompanhamento<br/>Humano & Dados
              </span><br/>
              juntos.
            </h2>
            
            <p style={{ color: '#A1A1AA', fontSize: 40, textAlign: 'center', opacity: subtitleOpacity, marginTop: 40, fontFamily: 'system-ui, sans-serif' }}>
              Pare de chutar. <br/>Veja sua evolução subir.
            </p>

            {/* Simulação de Gráfico de Progressão */}
            <div style={{ display: 'flex', gap: 70, marginTop: 150, alignItems: 'flex-end', height: 750 }}>
                {/* Bara Mês 1 - Sem energia */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ width: 180, height: bar1Height, backgroundColor: '#1F2937', borderRadius: '50px 50px 0 0', display: 'flex', justifyContent: 'center', paddingTop: 30 }}>
                     <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: 40, opacity: titleOpacity }}>+20%</span>
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 34, marginTop: 30, fontFamily: 'system-ui, sans-serif' }}>Semanas 1-2</p>
                </div>

                {/* Bara Mês 2 - Começando a dar resultado Azul */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ width: 180, height: bar2Height, background: 'linear-gradient(0deg, #1F2937, #3B82F6)', borderRadius: '50px 50px 0 0', display: 'flex', justifyContent: 'center', paddingTop: 30 }}>
                     <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: 40, opacity: titleOpacity }}>+65%</span>
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 34, marginTop: 30, fontFamily: 'system-ui, sans-serif' }}>1º Mês</p>
                </div>

                {/* Bara Mês 3 - Resultado Verde Explodindo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ width: 180, height: bar3Height, background: 'linear-gradient(0deg, #06b6d4, #10B981)', borderRadius: '50px 50px 0 0', display: 'flex', justifyContent: 'center', paddingTop: 30, boxShadow: '0 -20px 80px rgba(16, 185, 129, 0.4)' }}>
                     <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: 40, opacity: titleOpacity }}>🚀</span>
                   </div>
                   <p style={{ color: '#10B981', fontSize: 36, fontWeight: 'bold', marginTop: 30, fontFamily: 'system-ui, sans-serif' }}>Metas Batidas</p>
                </div>
            </div>
            
        </AbsoluteFill>
    );
};
