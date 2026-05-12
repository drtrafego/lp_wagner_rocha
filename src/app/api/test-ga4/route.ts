import { NextResponse } from 'next/server'

export async function GET() {
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID
  const apiSecret = process.env.GA4_API_SECRET

  if (!measurementId || !apiSecret) {
    return NextResponse.json({ error: 'Variáveis GA4 ausentes', measurementId: measurementId ?? 'AUSENTE', apiSecret: apiSecret ? 'PRESENTE' : 'AUSENTE' })
  }

  const url = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`

  const body = {
    client_id: 'test.diagnostic.123',
    events: [{
      name: 'generate_lead',
      params: { currency: 'BRL', lead_id: 'test-diagnostic', engagement_time_msec: 1 },
    }],
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const result = await res.json()

  return NextResponse.json({
    httpStatus: res.status,
    measurementId,
    apiSecretPresente: true,
    validationResponse: result,
  })
}
