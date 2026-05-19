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

  // Aguarda o request do generate_lead explicitamente ANTES do redirect
  const generateLeadReq = page.waitForRequest(
    (req) => req.url().includes('google-analytics.com/g/collect') && req.url().includes('en=generate_lead'),
    { timeout: 5000 }
  ).catch(() => null)

  await page.click('button[type="submit"]', { force: true })

  // Espera o evento OU o redirect (o que vier primeiro)
  const [capturedReq] = await Promise.all([
    generateLeadReq,
    page.waitForURL('**/obrigado**', { timeout: 10000 }).catch(() => null),
  ])

  // Aguarda mais 500ms para capturar eventos que chegam logo após
  await page.waitForTimeout(500)

  console.log('\n=== RESULTADO ===')
  console.log('[generate_lead capturado antes do redirect?]', capturedReq ? 'SIM' : 'NÃO')
  if (capturedReq) {
    const params = new URL(capturedReq.url()).searchParams
    console.log('[en]', params.get('en'))
    console.log('[tid]', params.get('tid'))
    console.log('[cid]', params.get('cid'))
    console.log('[URL parcial]', capturedReq.url().substring(0, 200))
  }

  console.log('\n=== TODOS OS EVENTOS GA4 CAPTURADOS ===')
  ga4Events.forEach((e) => console.log(`  en=${e.en}`))

  console.log('\n=== CONSOLE LOGS ===')
  consoleLogs.forEach((l) => console.log(l))

  // URL atual
  console.log('\n[URL final]', page.url())
})
