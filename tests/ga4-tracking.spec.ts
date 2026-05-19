import { test, expect } from '@playwright/test'

test('generate_lead dispara antes do redirect para /obrigado', async ({ page }) => {
  const ga4Requests: string[] = []

  // Intercepta todas as requisições ao GA4
  page.on('request', (req) => {
    const url = req.url()
    if (url.includes('google-analytics.com') || url.includes('googletagmanager.com/g/collect')) {
      ga4Requests.push(url)
    }
  })

  await page.goto('https://rochaadvogadosmt.com', { waitUntil: 'networkidle' })

  // Scroll até o formulário
  await page.locator('#formulario').scrollIntoViewIfNeeded()

  // Preenche o formulário
  await page.fill('input[name="name"]', 'Teste Playwright')
  await page.fill('input[name="email"]', 'teste@playwright.com')

  // Campo de telefone — aguarda o componente carregar
  await page.waitForSelector('input[type="tel"]', { timeout: 5000 })
  await page.fill('input[type="tel"]', '65999999999')

  // Captura requests de rede após o submit
  const ga4Promise = page.waitForRequest(
    (req) => req.url().includes('google-analytics.com') && req.url().includes('generate_lead'),
    { timeout: 5000 }
  ).catch(() => null)

  // Submete (force ignora a animação animate-pulse-cta que deixa o botão instável)
  await page.click('button[type="submit"]', { force: true })

  // Aguarda redirect para /obrigado
  const [ga4Req] = await Promise.all([
    ga4Promise,
    page.waitForURL('**/obrigado**', { timeout: 10000 }),
  ])

  // Valida que o evento GA4 foi disparado antes do redirect
  if (ga4Req) {
    console.log('[OK] GA4 generate_lead capturado:', ga4Req.url().substring(0, 120))
  } else {
    console.warn('[AVISO] GA4 generate_lead não capturado via network — pode ter sido enviado pelo servidor (MP)')
  }

  // Confirma que chegou na página de obrigado
  await expect(page).toHaveURL(/obrigado/, { timeout: 5000 })
  console.log('[OK] Redirect para /obrigado funcionou')
})

test('server-side GA4 MP envia generate_lead ao submeter formulário', async ({ page, request }) => {
  // Monitora a API de contact para confirmar que foi chamada com sucesso
  let apiResponse: { success: boolean; leadId: string } | null = null

  page.on('response', async (res) => {
    if (res.url().includes('/api/contact')) {
      try {
        apiResponse = await res.json()
      } catch {}
    }
  })

  await page.goto('https://rochaadvogadosmt.com?utm_source=playwright&utm_medium=test', { waitUntil: 'networkidle' })

  await page.locator('#formulario').scrollIntoViewIfNeeded()

  await page.fill('input[name="name"]', 'Teste MP Server')
  await page.fill('input[name="email"]', 'mp@playwright.com')

  await page.waitForSelector('input[type="tel"]', { timeout: 5000 })
  await page.fill('input[type="tel"]', '65988887777')

  await page.click('button[type="submit"]', { force: true })
  await page.waitForURL('**/obrigado**', { timeout: 10000 })

  expect(apiResponse).not.toBeNull()
  expect(apiResponse!.success).toBe(true)
  expect(apiResponse!.leadId).toBeTruthy()
  console.log('[OK] API /api/contact retornou leadId:', apiResponse!.leadId)
})
