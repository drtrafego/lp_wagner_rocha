import type { NextRequest } from 'next/server'
import { createHash, randomUUID } from 'crypto'
import { ParamBuilder } from 'capi-param-builder-nodejs'

export type MetaStandardEvent =
  | 'PageView'
  | 'Lead'
  | 'Contact'

export interface ParsedRequestContext {
  ip?: string
  userAgent?: string
  fbc?: string
  fbp?: string
  externalId: string
  eventSourceUrl?: string
  city?: string
  state?: string
  zip?: string
  country: string
  gaCookie?: string
  builder: ParamBuilder
}

export interface CustomData {
  value?: number
  currency?: string
  content_name?: string
  content_category?: string
  lead_type?: string
}

export interface UserDataExtras {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: 'm' | 'f'
  city?: string
  state?: string
  zip?: string
}

export interface CAPISendOptions {
  eventName: MetaStandardEvent
  eventId: string
  eventTime?: number
  context: ParsedRequestContext
  userExtras?: UserDataExtras
  customData?: CustomData
  actionSource?: 'website' | 'app' | 'chat' | 'email' | 'phone_call' | 'physical_store' | 'system_generated' | 'other'
  testEventCode?: string
}

const TRACKING_DOMAINS_RAW =
  process.env.TRACKING_DOMAINS ||
  'rochaadvogadosmt.com,www.rochaadvogadosmt.com,rochaadvogadosmt.com.br,www.rochaadvogadosmt.com.br,localhost'
const TRACKING_DOMAINS = TRACKING_DOMAINS_RAW.split(',').map((d) => d.trim()).filter(Boolean)

const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION ?? 'v21.0'

export function createParamBuilder(): ParamBuilder {
  return new ParamBuilder(TRACKING_DOMAINS)
}

function cookieHeaderToMap(header: string): Record<string, string> {
  const map: Record<string, string> = {}
  if (!header) return map
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=')
    if (idx <= 0) return
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key) map[key] = decodeURIComponent(value)
  })
  return map
}

function searchParamsToMap(url: URL | null): Record<string, string> {
  const map: Record<string, string> = {}
  if (!url) return map
  url.searchParams.forEach((v, k) => { map[k] = v })
  return map
}

export function parseRequestContext(req: NextRequest): ParsedRequestContext {
  const headers = req.headers
  const cookieHeader = headers.get('cookie') ?? ''
  const cookies = cookieHeaderToMap(cookieHeader)

  const xff = headers.get('x-forwarded-for')
  const remoteAddress = headers.get('x-real-ip')
  const userAgent = headers.get('user-agent') ?? undefined

  const url = (() => {
    try { return new URL(req.url) } catch { return null }
  })()
  const queries = searchParamsToMap(url)
  const referer = headers.get('referer')
  const host = headers.get('host') ?? (url ? url.host : '')

  const builder = createParamBuilder()
  builder.processRequest(host, queries, cookies, referer, xff, remoteAddress)

  const fbc = builder.getFbc() ?? undefined
  const fbp = builder.getFbp() ?? undefined
  const ip = builder.getClientIpAddress() ?? (xff ? xff.split(',')[0].trim() : remoteAddress ?? undefined)

  const externalId = cookies._eid ?? randomUUID()

  const eventSourceUrl =
    (url ? `${url.origin}${url.pathname}` : undefined) ??
    referer ??
    headers.get('origin') ??
    undefined

  const city = headers.get('x-vercel-ip-city') ?? undefined
  const state = headers.get('x-vercel-ip-country-region') ?? undefined
  const zip = headers.get('x-vercel-ip-postal-code') ?? undefined
  const country = (headers.get('x-vercel-ip-country') ?? 'br').toLowerCase()

  return {
    ip: ip ?? undefined,
    userAgent,
    fbc,
    fbp,
    externalId,
    eventSourceUrl,
    city: city ? decodeURIComponent(city) : undefined,
    state,
    zip,
    country,
    gaCookie: cookies._ga,
    builder,
  }
}

function fallbackHash(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}

function hashViaBuilder(builder: ParamBuilder, value: string, type: string): string | undefined {
  const out = builder.getNormalizedAndHashedPII(value, type)
  return out ?? undefined
}

/* O SDK Meta nao adiciona DDI automaticamente. Garantimos E.164 com 55 antes de hashear. */
function ensureBrazilianPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return `+${digits}`
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`
  return digits.startsWith('+') ? digits : `+${digits}`
}

const STATE_NAME_TO_CODE: Record<string, string> = {
  'acre': 'ac', 'alagoas': 'al', 'amapa': 'ap', 'amazonas': 'am',
  'bahia': 'ba', 'ceara': 'ce', 'distrito federal': 'df', 'espirito santo': 'es',
  'goias': 'go', 'maranhao': 'ma', 'mato grosso do sul': 'ms', 'mato grosso': 'mt',
  'minas gerais': 'mg', 'para': 'pa', 'paraiba': 'pb', 'parana': 'pr',
  'pernambuco': 'pe', 'piaui': 'pi', 'rio de janeiro': 'rj', 'rio grande do norte': 'rn',
  'rio grande do sul': 'rs', 'rondonia': 'ro', 'roraima': 'rr', 'santa catarina': 'sc',
  'sao paulo': 'sp', 'sergipe': 'se', 'tocantins': 'to',
}

function ensureStateCode(raw: string): string {
  const s = raw.trim().toLowerCase()
  if (/^[a-z]{2}$/.test(s)) return s
  const normalized = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return STATE_NAME_TO_CODE[normalized] || s
}

function buildUserData(ctx: ParsedRequestContext, extras?: UserDataExtras): Record<string, unknown> {
  const u: Record<string, unknown> = {}
  const b = ctx.builder

  if (extras?.email) {
    const h = hashViaBuilder(b, extras.email, 'email')
    if (h) u.em = [h]
  }
  if (extras?.phone) {
    const h = hashViaBuilder(b, ensureBrazilianPhone(extras.phone), 'phone')
    if (h) u.ph = [h]
  }
  if (extras?.firstName) {
    const parts = extras.firstName.trim().split(/\s+/)
    const fnRaw = parts[0]
    const lnRaw = parts.length > 1 ? parts.slice(1).join(' ') : undefined
    if (fnRaw) {
      const h = hashViaBuilder(b, fnRaw, 'first_name')
      if (h) u.fn = [h]
    }
    if (lnRaw && !extras.lastName) {
      const h = hashViaBuilder(b, lnRaw, 'last_name')
      if (h) u.ln = [h]
    }
  }
  if (extras?.lastName) {
    const h = hashViaBuilder(b, extras.lastName, 'last_name')
    if (h) u.ln = [h]
  }
  if (extras?.dateOfBirth) {
    const h = hashViaBuilder(b, extras.dateOfBirth, 'date_of_birth')
    if (h) u.db = [h]
  }
  if (extras?.gender) {
    const h = hashViaBuilder(b, extras.gender, 'gender')
    if (h) u.ge = [h]
  }

  const cityRaw = extras?.city ?? ctx.city
  if (cityRaw) {
    const h = hashViaBuilder(b, cityRaw, 'city')
    if (h) u.ct = [h]
  }
  const stateRaw = extras?.state ?? ctx.state
  if (stateRaw) {
    const h = hashViaBuilder(b, ensureStateCode(stateRaw), 'state')
    if (h) u.st = [h]
  }
  const zipRaw = extras?.zip ?? ctx.zip
  if (zipRaw) {
    const h = hashViaBuilder(b, zipRaw, 'zip_code')
    if (h) u.zp = [h]
  }

  const countryHash = hashViaBuilder(b, ctx.country, 'country') ?? fallbackHash(ctx.country.toLowerCase())
  u.country = [countryHash]

  const externalIdHash = hashViaBuilder(b, ctx.externalId, 'external_id') ?? fallbackHash(ctx.externalId)
  u.external_id = [externalIdHash]

  if (ctx.ip) u.client_ip_address = ctx.ip
  if (ctx.userAgent) u.client_user_agent = ctx.userAgent
  if (ctx.fbc) u.fbc = ctx.fbc
  if (ctx.fbp) u.fbp = ctx.fbp

  return u
}

/* Monta o payload Meta CAPI sem enviar. Util para o endpoint /api/debug-payload
 * e para colar diretamente no Payload Helper Meta. */
export function buildMetaCAPIPayload(opts: CAPISendOptions): Record<string, unknown> {
  const userData = buildUserData(opts.context, opts.userExtras)

  const eventBody: Record<string, unknown> = {
    event_name: opts.eventName,
    event_time: opts.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: opts.eventId,
    action_source: opts.actionSource ?? 'website',
    event_source_url: opts.context.eventSourceUrl,
    user_data: userData,
  }
  if (opts.customData) eventBody.custom_data = opts.customData

  const body: Record<string, unknown> = { data: [eventBody] }
  if (opts.testEventCode) body.test_event_code = opts.testEventCode

  return body
}

export async function sendMetaCAPI(opts: CAPISendOptions): Promise<void> {
  const pixelId = process.env.FB_PIXEL_ID
  const accessToken = process.env.FB_ACCESS_TOKEN || process.env.META_CAPI_ACCESS_TOKEN

  if (!pixelId || !accessToken) {
    console.warn('[CAPI] FB_PIXEL_ID ou FB_ACCESS_TOKEN ausente. Evento ignorado:', opts.eventName)
    return
  }

  try {
    const body = buildMetaCAPIPayload(opts)
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[CAPI] Erro Meta:', opts.eventName, response.status, error)
      return
    }

    const result = await response.json()
    console.log('[CAPI] OK', {
      event: opts.eventName,
      event_id: opts.eventId,
      received: result.events_received,
      trace: result.fbtrace_id,
    })
  } catch (err) {
    console.error('[CAPI] Falha inesperada:', opts.eventName, err)
  }
}

export interface GA4Payload {
  eventName: string
  clientId?: string
  gaCookie?: string
  ip?: string
  userAgent?: string
  params?: Record<string, unknown>
  sessionId?: string
  userId?: string
}

function extractGaClientId(gaCookie: string): string {
  const parts = gaCookie.split('.')
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`
  return gaCookie
}

function generateClientId(): string {
  const rand = Math.floor(Math.random() * 2_147_483_647)
  const ts = Math.floor(Date.now() / 1000)
  return `${rand}.${ts}`
}

function generateSessionId(): string {
  return String(Math.floor(Date.now() / 1000))
}

export async function sendGA4Event(payload: GA4Payload): Promise<void> {
  const measurementId = process.env.GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA4_ID
  const apiSecret = process.env.GA_API_SECRET || process.env.GA4_API_SECRET
  if (!measurementId || !apiSecret) {
    console.warn(`[GA4] Measurement ID ou API Secret ausente. Evento ignorado: ${payload.eventName}`)
    return
  }

  try {
    const clientId = payload.clientId ?? (payload.gaCookie ? extractGaClientId(payload.gaCookie) : generateClientId())
    const sessionId = payload.sessionId ?? generateSessionId()

    const body: Record<string, unknown> = {
      client_id: clientId,
      timestamp_micros: Date.now() * 1000,
      non_personalized_ads: false,
      events: [
        {
          name: payload.eventName,
          params: {
            engagement_time_msec: 100,
            session_id: sessionId,
            ...payload.params,
          },
        },
      ],
    }
    if (payload.userId) body.user_id = payload.userId

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(payload.userAgent && { 'User-Agent': payload.userAgent }),
        ...(payload.ip && { 'X-Forwarded-For': payload.ip }),
      },
      body: JSON.stringify(body),
    })

    if (response.status !== 204 && !response.ok) {
      const txt = await response.text()
      console.error(`[GA4] Erro (${payload.eventName}):`, response.status, txt)
    }
  } catch (err) {
    console.error(`[GA4] Falha inesperada ao enviar '${payload.eventName}':`, err)
  }
}

/* Helpers de cookie GA4 mantidos para retrocompatibilidade com /api/contact existente. */
export function parseGaClientId(cookieHeader: string): string | undefined {
  const match = cookieHeader.match(/(?:^|; )_ga=GA\d+\.\d+\.(\d+\.\d+)/)
  return match ? match[1] : undefined
}

export function parseGaSessionId(cookieHeader: string, measurementId: string): string | undefined {
  const containerId = measurementId.replace('G-', '')
  const match = cookieHeader.match(new RegExp(`(?:^|; )_ga_${containerId}=GS[^;]*?\\.(\\d+)\\.`))
  return match ? match[1] : undefined
}
