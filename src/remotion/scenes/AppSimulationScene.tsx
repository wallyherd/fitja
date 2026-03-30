import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoBackground } from '../components/VideoBackground';

export const AppSimulationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada do celular (mockup) deslizando para cima
  const mockupTranslateY = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, mass: 1 },
  });
  const adjustedMockupY = interpolate(mockupTranslateY, [0, 1], [1500, 0]);

  // Bolhas de chat pipocando na tela temporalmente
  const bubble1Scale = spring({ frame: frame - 45, fps, config: { damping: 12, mass: 0.8 } });
  const bubble2Scale = spring({ frame: frame - 120, fps, config: { damping: 12, mass: 0.8 } }); // AI responds
  const bubble3Scale = spring({ frame: frame - 180, fps, config: { damping: 12, mass: 0.8 } }); // AI sends a workout

  const textOpacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', padding: '40px 60px', alignItems: 'center' }}>
      <VideoBackground videoSrc={staticFile('bg2.mp4')} />
      {/* Título da Cena */}
      <h2 style={{ color: '#FFF', fontSize: 60, fontWeight: '900', textAlign: 'center', opacity: textOpacity, marginTop: 40, lineHeight: 1.1, fontFamily: 'system-ui, sans-serif' }}>
        <span style={{ color: '#10B981' }}>Inteligência Artificial</span><br />
        guiando sua rotina.
      </h2>

      {/* Mockup de Celular desenhado via CSS */}
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          height: 1200,
          backgroundColor: '#111827', // Cinza escuro premium
          borderRadius: 80,
          border: '18px solid #1F2937',
          marginTop: 60,
          transform: `translateY(${adjustedMockupY}px)`,
          display: 'flex',
          flexDirection: 'column',
          padding: 50,
          boxShadow: '0 40px 100px rgba(16, 185, 129, 0.25)', // Brilho verde de fundo
          position: 'relative',
        }}
      >
        {/* Simulação do "Notch" no topo */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 250, height: 45, backgroundColor: '#1F2937', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }} />
        
        {/* Cabeçalho do Chat */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 60, borderBottom: '3px solid #374151', paddingBottom: 40, marginTop: 40 }}>
            {/* Ícone Especialista */}
            <div style={{ width: 90, height: 90, borderRadius: 45, background: 'linear-gradient(45deg, #10B981, #06b6d4, #3B82F6)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', fontSize: 40, fontWeight: 'bold' }}>
               ✨
            </div>
            <div style={{ marginLeft: 30 }}>
                <h3 style={{ color: '#FFF', margin: 0, fontSize: 45, fontFamily: 'system-ui, sans-serif', fontWeight: 'bold' }}>Personal IA</h3>
                <p style={{ color: '#10B981', margin: 0, fontSize: 26, fontFamily: 'system-ui, sans-serif', fontWeight: '600' }}>• Online Agora</p>
            </div>
        </div>

        {/* Espaço das mensagens do Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, fontFamily: 'system-ui, sans-serif' }}>
            
            {/* Mensagem do Usuário (cinza escuro) */}
            <div style={{ alignSelf: 'flex-end', backgroundColor: '#374151', padding: '30px 45px', borderRadius: 40, borderBottomRightRadius: 10, maxWidth: '85%', transform: `scale(${bubble1Scale})`, transformOrigin: 'bottom right' }}>
                <p style={{ color: '#FFF', margin: 0, fontSize: 34, lineHeight: 1.3 }}>Não consegui ir à academia hoje...</p>
            </div>
            
            {/* Mensagem da IA FitJá (Gradiente logotipo) */}
            <div style={{ alignSelf: 'flex-start', background: 'linear-gradient(90deg, #10B981, #059669)', padding: '30px 45px', borderRadius: 40, borderBottomLeftRadius: 10, maxWidth: '90%', transform: `scale(${bubble2Scale})`, transformOrigin: 'bottom left', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}>
                <p style={{ color: '#FFF', margin: 0, fontSize: 34, lineHeight: 1.3 }}>Tudo bem! Já atualizei sua meta de amanhã e preparei um treino rápido de 15min para você fazer na sala. 💪</p>
            </div>

            {/* Cartão de Ação - Treino Adaptativo */}
            <div style={{ alignSelf: 'flex-start', background: '#1F2937', padding: '30px 45px', borderRadius: 40, borderBottomLeftRadius: 10, maxWidth: '90%', transform: `scale(${bubble3Scale})`, transformOrigin: 'bottom left', border: '3px solid #10B981', display: 'flex', alignItems: 'center', gap: 30, marginTop: 20 }}>
                {/* Ícone de Play Simulando o botão de iniciar */}
                <div style={{ width: 70, height: 70, backgroundColor: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 34, paddingLeft: 6 }}>
                    ▶
                </div>
                <div>
                   <p style={{ color: '#FFF', margin: 0, fontSize: 34, fontWeight: 'bold' }}>Treino Queima (Adaptado - Em Casa)</p>
                   <p style={{ color: '#A1A1AA', margin: 0, fontSize: 26, marginTop: 10 }}>15 minutos • Focado em Cardio</p>
                </div>
            </div>

        </div>
      </div>
    </AbsoluteFill>
  );
};
