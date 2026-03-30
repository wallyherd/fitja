import { AbsoluteFill, Series } from 'remotion';
import { HookScene } from './scenes/HookScene';
import { AppSimulationScene } from './scenes/AppSimulationScene';
import { FeaturesScene } from './scenes/FeaturesScene';
import { ContentScene } from './scenes/ContentScene';
import { GamificationScene } from './scenes/GamificationScene';
import { ProgressScene } from './scenes/ProgressScene';
import { CTAScene } from './scenes/CTAScene';

export const AdVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', fontFamily: 'system-ui, sans-serif' }}>
      <Series>
        {/* Cena 1: Chamada Inicial c/ Logo iOS Arredondada (5s = 150 frames) */}
        <Series.Sequence durationInFrames={150}>
          <HookScene />
        </Series.Sequence>
        
        {/* Cena 2: Mockup do App c/ Chat de Inteligencia Artificial (9s = 270 frames) */}
        <Series.Sequence durationInFrames={270}>
          <AppSimulationScene />
        </Series.Sequence>

        {/* Cena 3: Scanner de Refeição e Registro de Treinos (12s = 360 frames) */}
        <Series.Sequence durationInFrames={360}>
          <FeaturesScene />
        </Series.Sequence>

        {/* Cena 4: Biblioteca de Dietas e Artigos (12s = 360 frames) */}
        <Series.Sequence durationInFrames={360}>
          <ContentScene />
        </Series.Sequence>

        {/* Cena 5: Ranking Pódio e Desafios com Prêmios (10s = 300 frames) */}
        <Series.Sequence durationInFrames={300}>
          <GamificationScene />
        </Series.Sequence>
        
        {/* Cena 6: Crescimento e Resultados em Gráficos (6s = 180 frames) */}
        <Series.Sequence durationInFrames={180}>
          <ProgressScene />
        </Series.Sequence>

        {/* Cena 7: Call to Action Final - Baixe Agora c/ Ícone Logo (6s = 180 frames) */}
        <Series.Sequence durationInFrames={180}>
          <CTAScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
