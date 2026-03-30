import { Metadata } from 'next'

export const defaultSEO: Metadata = {
  title: 'FitJá | Sua Melhor Versão em Segundos',
  description: 'O tracker de saúde e hábitos com inteligência artificial SophIA. Registre treinos, alimentação e água sem esforço.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fitja.app'),
  openGraph: {
    title: 'FitJá | Mais que um App, sua Treinadora de Elite',
    description: 'Acompanhe seu progresso real com visão computacional e gamificação premium.',
    url: 'https://fitja.app',
    siteName: 'FitJá',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FitJá Dashboard',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitJá | Sua Melhor Versão em Segundos',
    description: 'IA Vision + Gamificação para sua rotina de elite.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export function generatePageMetadata(title: string, description?: string): Metadata {
  return {
    ...defaultSEO,
    title: `${title} | FitJá`,
    description: description || defaultSEO.description,
  }
}
