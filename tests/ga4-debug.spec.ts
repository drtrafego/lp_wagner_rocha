import { test, expect } from '@playwright/test'

test('diagnóstico completo do tracking', async ({ page }) => {
  const ga4Events: { url: string; en: string }[] = []
  const consoleLogs: string[] = []

  page.on('console', (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', (err) => consoleLogs.push(`[pageerror] ${err.message}`))

  // Intercepta TODAS as requests GA4 com seus parâmetros
  page.on('request', (req) => {
    const url = req.url()
    if (url.includes('google-analytics.com/g/collect')) {
      const params = new URL(url).searchParams
      const en = params.get('en') ?? 'unknown'
      ga4Events.push({ url: url.substring(0, 150), en })
    }
  })

  await page.goto('https://rochaadvogadosmt.com', { waitUntil: 'networkidle' })

  // gtag definido?
  const gtagDefined = await page.evaluate(() => typeof window.gtag === 'function')
  console.log('[gtag definido?]', gtagDefined)

  await page.locator('#formulario').scrollIntoViewIfNeeded()
  await page.fill('input[name="name"]', 'Debug Tracking')
  await page.fill('input[name="email"]', 'debug2@playwright.com')
  await page.waitForSelector('input[type="tel"]', { timeout: 5000 })
  await page.fill('input[type="tel"]', '65988881111')

  // Monitora o dataLayer em tempo real via exposeFunction
  const dataLayerEvents: unknown[] = []
  await page.exposeFunction('__captureDataLayer', (e: unknown) => dataLayerEvents.push(e))

  // Intercepta pushes ao dataLayer antes do submit
  await page.evaluate(() => {
    const w = window as unknown as { dataLayer?: unknown[]; __captureDataLayer: (e: unknown) => void }
    w.dataLayer = w.dataLayer ?? []
    const original = w.dataLayer.push.bind(w.dataLayer)
    w.dataLayer.push = (...args: unknown[]) => {
      args.forEach((a) => w.__captureDataLayer(a))
      return original(...args)
    }
  })

  await page.click('button[type="submit"]', { force: true })

  // Aguarda a navegação para /obrigado
  await page.waitForURL('**/obrigado**', { timeout: 10000 }).catch(() => null)

  // Aguarda mais 500ms para eventos tardios
  await page.waitForTimeout(500)

  const generateLeadEvent = dataLayerEvents.find(
    (e) => e && typeof e === 'object' && (e as Record<string, unknown>)['event'] === 'generate_lead'
  )

  console.log('\n=== RESULTADO ===')
  console.log('[generate_lead no dataLayer?]', generateLeadEvent ? 'SIM' : 'NÃO')
  if (generateLeadEvent) console.log('[evento]', JSON.stringify(generateLeadEvent))
  console.log('[todos os eventos dataLayer capturados]')
  dataLayerEvents.forEach((e) => {
    if (e && typeof e === 'object' && 'event' in (e as object)) {
      console.log(' ', (e as Record<string, unknown>)['event'])
    }
  })

  console.log('\n=== TODOS OS EVENTOS GA4 CAPTURADOS ===')
  ga4Events.forEach((e) => console.log(`  en=${e.en}`))

  console.log('\n=== CONSOLE LOGS ===')
  consoleLogs.forEach((l) => console.log(l))

  // URL atual
  console.log('\n[URL final]', page.url())
})
