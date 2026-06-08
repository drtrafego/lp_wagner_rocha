import { NextRequest, NextResponse } from 'next/server'
import {
  parseRequestContext,
  sendMetaCAPI,
  sendGA4Event,
  type MetaStandardEvent,
  type CustomData,
} from '@/lib/tracking-server'
import { TrackPayloadSchema, type TrackPayload } from '@/lib/tracking-schema'

const GA4_EVENT_MAP: Record<MetaStandardEvent, string> = {
  PageView: 'page_view',
  Lead: 'generate_lead',
  Contact: 'contact',
}

function buildGa4Params(c: CustomData): Record<string, unknown> {
  const p: Record<string, unknown> = {}
  if (c.value !== undefined) p.value = c.value
  if (c.currency) p.currency = c.currency
  if (c.content_name) p.content_name = c.content_name
  if (c.lead_type) p.lead_source = c.lead_type
  return p
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let input: TrackPayload
  try {
    const raw = await req.json()
    input = TrackPayloadSchema.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: 'Payload invalido' }, { status: 400 })
  }

  const context = parseRequestContext(req)

  const customData: CustomData = {}
  if (input.value !== undefined) customData.value = input.value
  if (input.currency) customData.currency = input.currency
  if (input.content_name) customData.content_name = input.content_name
  if (input.content_category) customData.content_category = input.content_category
  if (input.lead_type) customData.lead_type = input.lead_type

  const userExtras = {
    email: input.email,
    phone: input.phone,
    firstName: input.name,
  }

  const ga4EventName = GA4_EVENT_MAP[input.event_name]

  await Promise.allSettled([
    sendMetaCAPI({
      eventName: input.event_name,
      eventId: input.event_id,
      context,
      userExtras,
      customData: Object.keys(customData).length > 0 ? customData : undefined,
      testEventCode: input.test_event_code,
    }),
    sendGA4Event({
      eventName: ga4EventName,
      gaCookie: context.gaCookie,
      ip: context.ip,
      userAgent: context.userAgent,
      params: buildGa4Params(customData),
    }),
  ])

  return NextResponse.json({ ok: true, event_id: input.event_id })
}
