import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}

const ONE_YEAR = 60 * 60 * 24 * 365
const NINETY_DAYS = 60 * 60 * 24 * 90

const TRACKING_ETLD = process.env.TRACKING_ETLD_DOMAIN || 'rochaadvogadosmt.com'

function uuidV4(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex: string[] = []
  for (let i = 0; i < 16; i++) hex.push(bytes[i].toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
}

function pickCookieDomain(host: string): string | undefined {
  if (!host) return undefined
  if (host === 'localhost' || host.endsWith('.localhost')) return undefined
  if (host === TRACKING_ETLD || host.endsWith('.' + TRACKING_ETLD)) return TRACKING_ETLD
  return undefined
}

/* Middleware so cuida de cookies que o SDK Meta NAO cuida:
 *  - _eid: UUID estavel nosso, usado como external_id em TODOS os eventos
 *  - _gcl_aw / _gcl_wbraid / _gcl_gbraid: click IDs do Google Ads (preparacao futura)
 *
 * _fbp e _fbc sao responsabilidade EXCLUSIVA do SDK Meta (client e server).
 * Geracao manual aqui poderia modificar o valor de fbclid (URL decode etc),
 * o que viola a regra oficial Meta "do not modify fbclid value".
 */
export function middleware(req: NextRequest): NextResponse {
  const res = NextResponse.next()
  const isProd = process.env.NODE_ENV === 'production'
  const host = req.nextUrl.hostname
  const cookieDomain = pickCookieDomain(host)

  if (!req.cookies.get('_eid')?.value) {
    res.cookies.set('_eid', uuidV4(), {
      path: '/',
      maxAge: ONE_YEAR,
      sameSite: 'lax',
      secure: isProd,
      httpOnly: false,
      ...(cookieDomain && { domain: cookieDomain }),
    })
  }

  /* Google Ads click ids: gclid, wbraid, gbraid. Cookies do gtag.
   * IMPORTANTE: pegamos o valor cru via raw query string para NAO sofrer URL decode automatico,
   * preservando exatamente o que veio no link do anuncio. */
  const rawQuery = req.nextUrl.search.startsWith('?') ? req.nextUrl.search.slice(1) : req.nextUrl.search
  function rawParam(name: string): string | null {
    for (const part of rawQuery.split('&')) {
      const eq = part.indexOf('=')
      if (eq < 0) continue
      if (part.slice(0, eq) === name) return part.slice(eq + 1)
    }
    return null
  }

  const gclid = rawParam('gclid')
  if (gclid && !req.cookies.get('_gcl_aw')?.value) {
    res.cookies.set('_gcl_aw', `GCL.${Math.floor(Date.now() / 1000)}.${gclid}`, {
      path: '/',
      maxAge: NINETY_DAYS,
      sameSite: 'lax',
      secure: isProd,
      httpOnly: false,
      ...(cookieDomain && { domain: cookieDomain }),
    })
  }
  const wbraid = rawParam('wbraid')
  if (wbraid && !req.cookies.get('_gcl_wbraid')?.value) {
    res.cookies.set('_gcl_wbraid', `GCL.${Math.floor(Date.now() / 1000)}.${wbraid}`, {
      path: '/',
      maxAge: NINETY_DAYS,
      sameSite: 'lax',
      secure: isProd,
      httpOnly: false,
      ...(cookieDomain && { domain: cookieDomain }),
    })
  }
  const gbraid = rawParam('gbraid')
  if (gbraid && !req.cookies.get('_gcl_gbraid')?.value) {
    res.cookies.set('_gcl_gbraid', `GCL.${Math.floor(Date.now() / 1000)}.${gbraid}`, {
      path: '/',
      maxAge: NINETY_DAYS,
      sameSite: 'lax',
      secure: isProd,
      httpOnly: false,
      ...(cookieDomain && { domain: cookieDomain }),
    })
  }

  return res
}
