import { test, expect } from '@playwright/test'

test('ga_client_id é lido do cookie e enviado no corpo para API', async ({ page }) => {
  let bodyEnviadoParaApi: Record<string, unknown> = {}

  page.on('request', (req) => {
    if (req.url().includes('/api/contact')) {
      try { bodyEnviadoParaApi = JSON.parse(req.postData() ?? '{}') } catch {}
    }
  })

  await page.goto('https://rochaadvogadosmt.com', { waitUntil: 'networkidle' })

  // _ga cookie presente na página
  const cookies = await page.context().cookies()
  const gaCookie = cookies.find((c) => c.name === '_ga')
  console.log('[_ga cookie na página]', gaCookie ? gaCookie.value : 'NÃO ENCONTRADO')

  await page.locator('#formulario').scrollIntoViewIfNeeded()
  await page.fill('input[name="name"]', 'Teste ClientId')
  await page.fill('input[name="email"]', 'clientid@gatest.com')
  await page.waitForSelector('input[type="tel"]')
  await page.fill('input[type="tel"]', '65944445555')
  await page.click('button[type="submit"]', { force: true })
  await page.waitForURL('**/obrigado**', { timeout: 8000 }).catch(() => {})

  console.log('[ga_client_id no body]', bodyEnviadoParaApi['ga_client_id'] ?? 'NÃO ENVIADO')
  console.log('[ga_session_id no body]', bodyEnviadoParaApi['ga_session_id'] ?? 'NÃO ENVIADO')

  expect(bodyEnviadoParaApi['ga_client_id']).toBeTruthy()
})
