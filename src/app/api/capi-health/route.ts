import { NextRequest, NextResponse } from 'next/server'

/* Endpoint TEMPORARIO de diagnostico da Meta CAPI.
 * Valida se FB_PIXEL_ID + FB_ACCESS_TOKEN do ambiente conseguem falar com a Graph API.
 * Nao expoe o token (mostra apenas tamanho e ultimos 4 caracteres para confirmar que nao esta vazio/truncado).
 * Protegido por chave simples via ?key= para nao ficar publico.
 * REMOVER depois de concluido o diagnostico. */

const DIAG_KEY = 'rocha-capi-2026'
const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION ?? 'v21.0'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url)
  if (url.searchParams.get('key') !== DIAG_KEY) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const pixelId = process.env.FB_PIXEL_ID || null
  const publicPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || null
  const accessToken = process.env.FB_ACCESS_TOKEN || process.env.META_CAPI_ACCESS_TOKEN || null

  const tokenInfo = accessToken
    ? { present: true, length: accessToken.length, last4: accessToken.slice(-4) }
    : { present: false, length: 0, last4: null }

  const result: Record<string, unknown> = {
    env: {
      FB_PIXEL_ID: pixelId,
      NEXT_PUBLIC_FB_PIXEL_ID: publicPixelId,
      pixelMatch: pixelId === publicPixelId,
      token: tokenInfo,
      graphApiVersion: GRAPH_API_VERSION,
    },
  }

  if (!pixelId || !accessToken) {
    result.verdict = 'ENV_FALTANDO'
    return NextResponse.json(result, { status: 200 })
  }

  // 1) Valida token: GET no pixel. Nao envia evento nenhum.
  try {
    const validateUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}?fields=id,name,is_unavailable&access_token=${encodeURIComponent(accessToken)}`
    const r = await fetch(validateUrl, { method: 'GET' })
    const body = await r.json()
    result.tokenValidation = { status: r.status, ok: r.ok, body }
  } catch (err) {
    result.tokenValidation = { status: 0, ok: false, error: String(err) }
  }

  // 2) Opcional: envia um evento de teste real para a CAPI e retorna a resposta da Meta.
  //    So roda com ?send=1. Use ?test_event_code=TESTxxxx para nao sujar metricas.
  if (url.searchParams.get('send') === '1') {
    const testEventCode = url.searchParams.get('test_event_code') || undefined
    const eventName = url.searchParams.get('event') || 'PageView'
    try {
      const eventsUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`
      const payload: Record<string, unknown> = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: `capi-health-${Date.now()}`,
            action_source: 'website',
            event_source_url: 'https://rochaadvogadosmt.com/',
            user_data: {
              client_user_agent: req.headers.get('user-agent') ?? 'capi-health',
              client_ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1',
            },
          },
        ],
      }
      if (testEventCode) payload.test_event_code = testEventCode

      const r = await fetch(eventsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await r.json()
      result.sendTest = { status: r.status, ok: r.ok, eventName, testEventCode: testEventCode ?? null, body }
    } catch (err) {
      result.sendTest = { status: 0, ok: false, error: String(err) }
    }
  }

  // Veredito automatico
  const validation = result.tokenValidation as { ok?: boolean; body?: { error?: unknown } } | undefined
  if (validation?.ok) {
    result.verdict = 'TOKEN_OK'
  } else if (validation?.body && 'error' in (validation.body as object)) {
    result.verdict = 'TOKEN_INVALIDO'
  } else {
    result.verdict = 'INDETERMINADO'
  }

  return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 'no-store' } })
}
