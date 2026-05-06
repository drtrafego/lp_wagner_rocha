import type { Metadata } from 'next'
import './globals.css'
import MetaPixel from '@/components/MetaPixel'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: 'Rocha Advogados — Advocacia Trabalhista em Cuiabá/MT',
  description: 'Seus direitos trabalhistas foram respeitados? Análise gratuita do seu caso. 13 anos de experiência em Direito do Trabalho. Dr. Wagner Rocha, OAB/MT.',
  robots: 'index, follow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MetaPixel />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
