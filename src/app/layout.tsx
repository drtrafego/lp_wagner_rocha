import type { Metadata } from 'next'
import './globals.css'
import MetaPixel from '@/components/MetaPixel'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import JsonLd from '@/components/JsonLd'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rochaadvogadosmt.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Rocha Advogados — Advocacia Trabalhista em Cuiabá/MT',
    template: '%s | Rocha Advogados',
  },
  description:
    'Seus direitos trabalhistas foram respeitados? Análise gratuita do seu caso. 13 anos de experiência em Direito do Trabalho em Cuiabá/MT. Dr. Wagner Rocha, OAB/MT.',
  keywords: [
    'advogado trabalhista Cuiabá',
    'advocacia trabalhista Cuiabá',
    'advogado trabalhista Mato Grosso',
    'ação trabalhista Cuiabá',
    'direitos trabalhistas Cuiabá',
    'rescisão trabalhista Cuiabá',
    'horas extras advogado Cuiabá',
    'FGTS advogado Cuiabá',
    'Wagner Rocha advogado',
    'Rocha Advogados Cuiabá',
    'consulta trabalhista gratuita Cuiabá',
    'advogado trabalhista MT',
  ],
  authors: [{ name: 'Dr. Wagner Rocha', url: siteUrl }],
  creator: 'Rocha Advogados',
  publisher: 'Rocha Advogados',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: 'Rocha Advogados',
    title: 'Rocha Advogados — Advocacia Trabalhista em Cuiabá/MT',
    description:
      'Análise gratuita do seu caso trabalhista. 13 anos de experiência representando trabalhadores e empregadores em Cuiabá/MT. Honorários só sobre resultado.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Rocha Advogados — Advocacia Trabalhista em Cuiabá/MT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rocha Advogados — Advocacia Trabalhista em Cuiabá/MT',
    description:
      'Análise gratuita do seu caso trabalhista. 13 anos de experiência em Direito do Trabalho. Cuiabá/MT.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
  other: {
    'geo.region': 'BR-MT',
    'geo.placename': 'Cuiabá, Mato Grosso, Brasil',
    'geo.position': '-15.5934;-56.0883',
    ICBM: '-15.5934, -56.0883',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MDG98V62');` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MDG98V62" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        <MetaPixel />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
