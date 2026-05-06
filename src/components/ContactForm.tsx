'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  variant?: 'light' | 'dark'
  modelo?: string
  className?: string
  ctaLabel?: string
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

function getUTM(param: string): string {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get(param) ?? ''
}

export default function ContactForm({ variant = 'light', modelo = 'a', className = '', ctaLabel }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const isDark = variant === 'dark'

  const inputBase = isDark
    ? 'w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded px-4 py-3 text-sm font-body focus:outline-none focus:border-borde transition-colors'
    : 'w-full bg-white border border-chumbo/20 text-chumbo placeholder-chumbo/40 rounded px-4 py-3 text-sm font-body focus:outline-none focus:border-borde transition-colors'

  const labelClass = isDark ? 'block text-xs font-body font-medium text-white/60 mb-1 uppercase tracking-wider' : 'block text-xs font-body font-medium text-chumbo/60 mb-1 uppercase tracking-wider'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      whatsapp: (form.elements.namedItem('whatsapp') as HTMLInputElement).value,
      utm_source: getUTM('utm_source'),
      utm_medium: getUTM('utm_medium'),
      utm_campaign: getUTM('utm_campaign'),
      utm_term: getUTM('utm_term'),
      modelo,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.status === 422) {
        const json = await res.json()
        setFieldErrors(json.errors ?? {})
        setLoading(false)
        return
      }

      if (!res.ok) {
        setError('Ocorreu um erro. Tente novamente.')
        setLoading(false)
        return
      }

      const json = await res.json()
      const leadId = String(json.leadId)

      // Pixel Meta — evento Lead
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {}, { eventID: leadId })
      }

      // GA4 — evento generate_lead
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { event_category: 'formulario', modelo })
      }

      router.push(`/obrigado?lead=${leadId}`)
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nome completo</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Seu nome"
            required
            className={inputBase}
          />
          {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="seu@email.com"
            required
            className={inputBase}
          />
          {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email[0]}</p>}
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelClass}>WhatsApp</label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            placeholder="(65) 9 9999-9999"
            required
            className={inputBase}
          />
          {fieldErrors.whatsapp && <p className="text-red-400 text-xs mt-1">{fieldErrors.whatsapp[0]}</p>}
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={
            isDark
              ? 'w-full bg-borde hover:bg-borde-deep text-white font-display font-bold py-4 px-6 rounded text-sm uppercase tracking-widest transition-colors disabled:opacity-60 animate-pulse-cta'
              : 'w-full bg-borde hover:bg-borde-deep text-white font-display font-bold py-4 px-6 rounded text-sm uppercase tracking-widest transition-colors disabled:opacity-60'
          }
        >
          {loading ? 'Enviando...' : (ctaLabel ?? 'Analisar meu caso')}
        </button>

        <p className={`text-xs text-center ${isDark ? 'text-white/40' : 'text-chumbo/40'} font-body`}>
          Análise gratuita e sem compromisso. Sem custo para começar.
        </p>
      </div>
    </form>
  )
}
