import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rochaadvogadosmt.com.br'

export const metadata: Metadata = {
  title: 'Análise Gratuita do Seu Caso Trabalhista — Rocha Advogados',
  description:
    'Você sabe que algo estava errado. Descubra o que a lei garante ao trabalhador. Análise gratuita, sem compromisso. Dr. Wagner Rocha, 13 anos de advocacia trabalhista em Cuiabá/MT.',
  alternates: {
    canonical: `${siteUrl}/modelo-a`,
  },
}

export default function ModeloALayout({ children }: { children: React.ReactNode }) {
  return children
}
