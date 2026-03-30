import React from 'react';
import { AbsoluteFill, Video } from 'remotion';

export const VideoBackground: React.FC<{ videoSrc?: string }> = ({ videoSrc }) => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
            {/* O Vídeo de Fundo (Cenas de Pessoas Treinando) */}
            {videoSrc && (
                <Video 
                    src={videoSrc} // URL remota ou arquivo da pasta public/
                    muted // Obrigatorio não ter som pra não sobrepor o Ad
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.35, // 35% de visibilidade (bem sutil)
                    }}
                />
            )}
            
            {/* Película / Degradê de Segurança */}
            {/* Começa transparente em cima e escurece pra quase 100% Preto na base pra não atrapalhar a sua leitura! */}
            <AbsoluteFill style={{
                background: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.2) 0%, rgba(10, 10, 10, 0.85) 60%, rgba(10, 10, 10, 1) 100%)',
            }} />
        </AbsoluteFill>
    );
};
