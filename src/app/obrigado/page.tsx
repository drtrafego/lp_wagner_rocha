'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

function ObrigadoContent() {
  const params = useSearchParams()
  const leadId = params.get('lead') ?? ''

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { event_category: 'lead', value: 1 })
    }
  }, [])

  return (
    <main className="min-h-screen bg-offwhite flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-borde/10 mb-8">
          <svg className="w-8 h-8 text-borde" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-4">Rocha Advogados</p>

        <h1
          className="text-chumbo font-display font-bold text-3xl sm:text-4xl mb-4 leading-tight"
          style={{ fontFamily: 'Archivo, sans-serif' }}
        >
          Recebemos sua solicitação
        </h1>

        <p className="text-chumbo/60 font-body text-base leading-relaxed mb-8">
          O Dr. Wagner Rocha vai analisar o seu caso e entrar em contato em breve pelo WhatsApp ou e-mail informado.
        </p>

        <div className="bg-offwhite-quente rounded-lg p-6 mb-8 text-left">
          <h2 className="text-chumbo font-display font-bold text-sm uppercase tracking-wider mb-4">O que acontece agora</h2>
          <ol className="space-y-3">
            {[
              'Seu caso será analisado de forma individual',
              'O Dr. Wagner identificará irregularidades e seus direitos',
              'Você receberá orientação clara sobre os próximos passos',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-body text-chumbo/70">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-borde text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>

        <a
          href="https://wa.me/5565996768610?text=Olá%20Dr.%20Wagner%2C%20acabei%20de%20preencher%20o%20formulário%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20análise%20do%20meu%20caso."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-borde hover:bg-borde-deep text-white font-display font-bold py-4 px-8 rounded text-sm uppercase tracking-widest transition-colors"
        >
          Falar pelo WhatsApp agora
        </a>

        <p className="text-chumbo/30 text-xs font-body mt-6">
          Ref. {leadId || 'sua solicitação'} — Rocha Advogados, Cuiabá/MT
        </p>
      </div>
    </main>
  )
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-offwhite" />}>
      <ObrigadoContent />
    </Suspense>
  )
}
