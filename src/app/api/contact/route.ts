import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { and, eq, gte } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { leads } from '@/lib/schema'
import { sendMetaCAPI, sendGA4MP, parseGaClientId, parseGaSessionId } from '@/lib/tracking-server'

const ContactSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(120),
  email: z.string().email('E-mail inválido'),
  whatsapp: z.string().min(10, 'Telefone inválido').max(20),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  modelo: z.string().optional(),
  ga_client_id: z.string().optional(),
  ga_session_id: z.string().optional(),
})

type ContactInput = z.infer<typeof ContactSchema>

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let input: ContactInput
  try {
    const raw = await req.json()
    input = ContactSchema.parse(raw)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.flatten().fieldErrors }, { status: 422 })
    }
    return NextResponse.json({ success: false, message: 'Payload inválido' }, { status: 400 })
  }

  const xForwardedFor = req.headers.get('x-forwarded-for')
  const ip = xForwardedFor
    ? xForwardedFor.split(',')[0].trim()
    : (req.headers.get('x-real-ip') ?? undefined)

  const userAgent = req.headers.get('user-agent') ?? undefined
  const cookieHeader = req.headers.get('cookie') ?? ''

  const parseCookie = (name: string): string | undefined => {
    const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : undefined
  }

  const fbc = parseCookie('_fbc')
  const fbp = parseCookie('_fbp')
  const eventSourceUrl = req.headers.get('origin') ?? undefined

  const measurementId = process.env.NEXT_PUBLIC_GA4_ID ?? ''
  // Prioriza client_id enviado pelo cliente (mais confiável que leitura de cookie no servidor)
  const gaClientId = input.ga_client_id ?? parseGaClientId(cookieHeader)
  const gaSessionId = input.ga_session_id ?? parseGaSessionId(cookieHeader, measurementId)
  console.log('[GA4] client_id:', gaClientId ?? 'sintético')

  const organizationId = process.env.ORGANIZATION_ID!
  const columnId = process.env.DEFAULT_COLUMN_ID!

  let leadId: string

  try {
    // Dedup: mesmo whatsapp na mesma org nos ultimos 5 minutos reutiliza lead existente.
    // Janela curta porque mesmo cliente voltando dias depois e interesse novo legitimo.
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const existing = await withTimeout(
      getDb()
        .select({ id: leads.id })
        .from(leads)
        .where(
          and(
            eq(leads.organization_id, organizationId),
            eq(leads.whatsapp, input.whatsapp),
            gte(leads.created_at, fiveMinutesAgo),
          ),
        )
        .limit(1),
      5_000,
    )

    if (existing.length > 0) {
      leadId = existing[0].id
      console.log('[contact] Lead duplicado em janela curta, reutilizando:', leadId)
    } else {
      const [row] = await withTimeout(
        getDb().insert(leads).values({
          name: input.name,
          email: input.email,
          whatsapp: input.whatsapp,
          organization_id: organizationId,
          column_id: columnId,
          utm_source: input.utm_source,
          utm_medium: input.utm_medium,
          utm_campaign: input.utm_campaign,
          utm_term: input.utm_term,
          utm_content: input.utm_content,
          campaign_source: input.utm_source,
          page_path: input.modelo ? `/modelo-${input.modelo}` : '/',
          status: 'novo',
          created_via: 'site_api',
        }).returning({ id: leads.id }),
        5_000,
      )
      leadId = row.id
      console.log('[contact] Lead salvo no CRM:', leadId)
    }
  } catch (dbErr) {
    leadId = `fallback_${Date.now()}`
    console.error('[contact] Banco indisponível — fallback:', leadId, dbErr)
  }

  const response = NextResponse.json({ success: true, leadId }, { status: 200 })

  waitUntil(Promise.all([
    sendMetaCAPI({
      leadId,
      name: input.name,
      email: input.email,
      whatsapp: input.whatsapp,
      modelo: input.modelo,
      ip,
      userAgent,
      fbc,
      fbp,
      eventSourceUrl,
    }),
    sendGA4MP({
      leadId,
      modelo: input.modelo,
      clientId: gaClientId,
      sessionId: gaSessionId,
      userAgent,
      eventSourceUrl,
    }),
  ]).catch((err) => console.error('[contact] Erro tracking background:', err)))

  return response
}
