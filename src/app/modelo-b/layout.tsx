import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rochaadvogadosmt.com.br'

export const metadata: Metadata = {
  title: 'Direitos Trabalhistas em Cuiabá/MT — Rocha Advogados',
  description:
    'O que você não sabe sobre seus direitos trabalhistas pode estar te custando dinheiro. Análise gratuita do seu caso. Dr. Wagner Rocha, advocacia trabalhista em Cuiabá/MT há 13 anos.',
  alternates: {
    canonical: `${siteUrl}/modelo-b`,
  },
}

export default function ModeloBLayout({ children }: { children: React.ReactNode }) {
  return children
}
