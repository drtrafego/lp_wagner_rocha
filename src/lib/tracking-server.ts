// NUNCA importe em Client Components

export interface CAPIPayload {
  leadId: number | string
  name: string
  email: string
  whatsapp: string
  modelo?: string
  ip?: string
  userAgent?: string
  fbc?: string
  fbp?: string
  eventSourceUrl?: string
}

export interface GA4Payload {
  leadId: number | string
  modelo?: string
  clientId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  eventSourceUrl?: string
}

async function hashData(raw: string): Promise<string> {
  const { createHash } = await import('crypto')
  return createHash('sha256').update(raw.trim().toLowerCase()).digest('hex')
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

function lastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  return parts.length > 1 ? (parts[parts.length - 1] ?? '') : ''
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

// Extrai client_id do cookie _ga (formato: GA1.1.XXXXXXXXXX.XXXXXXXXXX)
export function parseGaClientId(cookieHeader: string): string | undefined {
  const match = cookieHeader.match(/(?:^|; )_ga=GA\d+\.\d+\.(\d+\.\d+)/)
  return match ? match[1] : undefined
}

// Extrai session_id do cookie _ga_XXXXXXXX (formato: GS1.1.TIMESTAMP.COUNT.1.TIMESTAMP.0.0.0)
export function parseGaSessionId(cookieHeader: string, measurementId: string): string | undefined {
  const containerId = measurementId.replace('G-', '')
  const match = cookieHeader.match(new RegExp(`(?:^|; )_ga_${containerId}=GS[^;]*?\\.(\\d+)\\.`))
  return match ? match[1] : undefined
}

export async function sendMetaCAPI(payload: CAPIPayload): Promise<void> {
  const pixelId = process.env.FB_PIXEL_ID
  const accessToken = process.env.FB_ACCESS_TOKEN

  if (!pixelId || !accessToken) {
    console.warn('[CAPI] FB_PIXEL_ID ou FB_ACCESS_TOKEN ausente — evento ignorado.')
    return
  }

  try {
    const { leadId, name, email, whatsapp, modelo, ip, userAgent, fbc, fbp, eventSourceUrl } = payload

    const ln = lastName(name)

    const hashTasks: Promise<string>[] = [
      hashData(email),
      hashData(cleanPhone(whatsapp)),
      hashData(firstName(name)),
      hashData(String(leadId)),
    ]
    if (ln) hashTasks.push(hashData(ln))

    const [hashedEmail, hashedPhone, hashedFirstName, hashedExternalId, hashedLastName] = await Promise.all(hashTasks)

    const body = {
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: String(leadId),
          action_source: 'website',
          event_source_url: eventSourceUrl ?? undefined,
          user_data: {
            em: [hashedEmail],
            ph: [hashedPhone],
            fn: [hashedFirstName],
            ...(ln && hashedLastName ? { ln: [hashedLastName] } : {}),
            country: ['0c9dce3e0b7cb3e63f19ef80ed649c6f9cdede82f65c7ad63900f0e9426bfeab'], // 'br' pre-hashed
            ...(ip && { client_ip_address: ip }),
            ...(userAgent && { client_user_agent: userAgent }),
            ...(fbc && { fbc }),
            ...(fbp && { fbp }),
            external_id: [hashedExternalId],
          },
          custom_data: {
            content_name: 'Lead Rocha Advogados',
            lead_type: modelo ? `modelo-${modelo}` : 'landing-page',
            currency: 'BRL',
          },
        },
      ],
    }

    const url = `https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${accessToken}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[CAPI] Erro Meta:', response.status, error)
      return
    }

    const result = await response.json()
    console.log('[CAPI] Evento enviado:', {
      leadId,
      modelo,
      eventsReceived: result.events_received,
      fbtrace: result.fbtrace_id,
    })
  } catch (err) {
    console.error('[CAPI] Falha isolada:', err)
  }
}

export async function sendGA4MP(payload: GA4Payload): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID
  const apiSecret = process.env.GA4_API_SECRET

  if (!measurementId || !apiSecret) {
    console.warn('[GA4] NEXT_PUBLIC_GA4_ID ou GA4_API_SECRET ausente — evento ignorado.')
    return
  }

  try {
    const { leadId, modelo, clientId, sessionId, userAgent, eventSourceUrl } = payload

    // client_id obrigatório — fallback para ID gerado caso cookie não exista
    const resolvedClientId = clientId ?? `server.${String(leadId)}`

    const body: Record<string, unknown> = {
      client_id: resolvedClientId,
      events: [
        {
          name: 'generate_lead',
          params: {
            currency: 'BRL',
            lead_id: String(leadId),
            lead_source: modelo ? `modelo-${modelo}` : 'landing-page',
            ...(sessionId ? { session_id: sessionId } : {}),
            engagement_time_msec: 1,
          },
        },
      ],
    }

    // user_data disponível apenas com Consent Mode ativo — enviamos se tivermos
    if (userAgent) {
      body.user_agent = userAgent
    }
    if (eventSourceUrl) {
      body.document_location = eventSourceUrl
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    // GA4 MP retorna 204 em sucesso — sem body
    if (response.status === 204 || response.ok) {
      console.log('[GA4] Evento generate_lead enviado:', { leadId, modelo, clientId: resolvedClientId })
    } else {
      const error = await response.text()
      console.error('[GA4] Erro Measurement Protocol:', response.status, error)
    }
  } catch (err) {
    console.error('[GA4] Falha isolada:', err)
  }
}
