import { NextRequest, NextResponse } from 'next/server'
import {
  parseRequestContext,
  buildMetaCAPIPayload,
  type CustomData,
} from '@/lib/tracking-server'
import { DebugPayloadSchema, type DebugPayload } from '@/lib/tracking-schema'

function buildPayload(req: NextRequest, input: DebugPayload) {
  const context = parseRequestContext(req)
  const customData: CustomData = {}
  if (input.value !== undefined) customData.value = input.value
  if (input.currency) customData.currency = input.currency
  if (input.content_name) customData.content_name = input.content_name

  return buildMetaCAPIPayload({
    eventName: input.event_name,
    eventId: input.event_id ?? 'debug-' + Date.now(),
    context,
    userExtras: { email: input.email, phone: input.phone, firstName: input.name },
    customData: Object.keys(customData).length > 0 ? customData : undefined,
    testEventCode: input.test_event_code,
  })
}

/* Debug endpoint eh leitura pura, sem PII em texto nem token. Default liberado.
 * Se setar DEBUG_PAYLOAD_TOKEN no env, passa a exigir header x-debug-token. */
function authorized(req: NextRequest): boolean {
  const expected = process.env.DEBUG_PAYLOAD_TOKEN
  if (!expected) return true
  const got = req.headers.get('x-debug-token') ?? req.nextUrl.searchParams.get('debug_token')
  return got === expected
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const sp = req.nextUrl.searchParams
  const input = DebugPayloadSchema.parse({
    event_name: sp.get('event_name') ?? 'PageView',
    event_id: sp.get('event_id') ?? undefined,
    value: sp.get('value') ? Number(sp.get('value')) : undefined,
    currency: sp.get('currency') ?? undefined,
    content_name: sp.get('content_name') ?? undefined,
    email: sp.get('email') ?? undefined,
    phone: sp.get('phone') ?? undefined,
    name: sp.get('name') ?? undefined,
    test_event_code: sp.get('test_event_code') ?? undefined,
  })
  const payload = buildPayload(req, input)
  return NextResponse.json({
    ok: true,
    instructions: 'Copie o objeto `payload` e cole no Payload Helper Meta em https://developers.facebook.com/docs/marketing-api/conversions-api/payload-helper/',
    pixel_id: process.env.NEXT_PUBLIC_FB_PIXEL_ID || process.env.FB_PIXEL_ID || null,
    payload,
  }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const raw = await req.json().catch(() => ({}))
  const input = DebugPayloadSchema.parse(raw)
  const payload = buildPayload(req, input)
  return NextResponse.json({
    ok: true,
    instructions: 'Copie o objeto `payload` e cole no Payload Helper Meta em https://developers.facebook.com/docs/marketing-api/conversions-api/payload-helper/',
    pixel_id: process.env.NEXT_PUBLIC_FB_PIXEL_ID || process.env.FB_PIXEL_ID || null,
    payload,
  }, { headers: { 'Cache-Control': 'no-store' } })
}
