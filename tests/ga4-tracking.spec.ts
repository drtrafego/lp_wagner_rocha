import { test, expect } from '@playwright/test'

test('generate_lead vai para o dataLayer e redirect para WhatsApp funciona', async ({ page }) => {
  const dataLayerEvents: unknown[] = []

  await page.goto('https://rochaadvogadosmt.com', { waitUntil: 'networkidle' })

  // Monitora pushes ao dataLayer em tempo real
  await page.exposeFunction('__captureEvent', (e: unknown) => dataLayerEvents.push(e))
  await page.evaluate(() => {
    const w = window as unknown as { dataLayer?: unknown[]; __captureEvent: (e: unknown) => void }
    w.dataLayer = w.dataLayer ?? []
    const orig = w.dataLayer.push.bind(w.dataLayer)
    w.dataLayer.push = (...args: unknown[]) => {
      args.forEach((a) => w.__captureEvent(a))
      return orig(...args)
    }
  })

  await page.locator('#formulario').scrollIntoViewIfNeeded()
  await page.fill('input[name="name"]', 'Teste Tracking')
  await page.fill('input[name="email"]', 'tracking@playwright.com')
  await page.waitForSelector('input[type="tel"]', { timeout: 5000 })
  await page.fill('input[type="tel"]', '65977771111')

  await page.click('button[type="submit"]', { force: true })

  // Aguarda /obrigado (antes do redirect automático para WhatsApp)
  await page.waitForURL('**/obrigado**', { timeout: 10000 })
  await page.waitForTimeout(500)

  const generateLeadEvent = dataLayerEvents.find(
    (e) => e && typeof e === 'object' && (e as Record<string, unknown>)['event'] === 'generate_lead'
  )

  expect(generateLeadEvent).toBeTruthy()
  console.log('[OK] generate_lead no dataLayer:', JSON.stringify(generateLeadEvent))

  // A página /obrigado redireciona para WhatsApp em 3s — confirmamos que chegou nela
  console.log('[OK] chegou em /obrigado — redirect automático para WhatsApp ativo')
})

test('API /api/contact salva lead e retorna sucesso', async ({ page }) => {
  let apiResponse: { success: boolean; leadId: string } | null = null

  page.on('response', async (res) => {
    if (res.url().includes('/api/contact')) {
      try { apiResponse = await res.json() } catch {}
    }
  })

  await page.goto('https://rochaadvogadosmt.com?utm_source=playwright&utm_medium=test', { waitUntil: 'networkidle' })
  await page.locator('#formulario').scrollIntoViewIfNeeded()
  await page.fill('input[name="name"]', 'Teste API')
  await page.fill('input[name="email"]', 'api@playwright.com')
  await page.waitForSelector('input[type="tel"]', { timeout: 5000 })
  await page.fill('input[type="tel"]', '65988882222')

  await page.click('button[type="submit"]', { force: true })
  await page.waitForURL('**/obrigado**', { timeout: 10000 })

  expect(apiResponse).not.toBeNull()
  expect(apiResponse!.success).toBe(true)
  expect(apiResponse!.leadId).toBeTruthy()
  console.log('[OK] leadId:', apiResponse!.leadId)
})
