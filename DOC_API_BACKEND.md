# Backend — Documentação Padrão DR.TRAFEGO
## Processamento de Leads + Meta CAPI + GA4 Measurement Protocol
### Next.js 15 · App Router · Neon · Drizzle ORM · Zod · TypeScript Strict

> Documento gerado com base na implementação real do projeto `lp_wagner_rocha`.
> Use como template para todos os próximos projetos de landing page.

---

## 1. Visão Geral do Fluxo

```
Frontend (formulário)
        │
        │  POST /api/contact
        │  { name, email, whatsapp, utm_*, utm_content?, modelo? }
        ▼
┌──────────────────────────────────────────────────────────────────────┐
│  route.ts                                                            │
│                                                                      │
│  1. Valida payload com Zod                                           │
│  2. Captura IP · UserAgent · cookies _fbc/_fbp/_ga/_ga_XXXX          │
│  3. INSERT no Neon/PostgreSQL (CRM compartilhado)  ◄── timeout 5 s  │
│     └─ Se falhar: gera ID fallback em memória                        │
│  4. Retorna 200 OK imediatamente ao cliente                          │
│  5. [BACKGROUND] sendMetaCAPI() + sendGA4MP() em paralelo            │
└──────────────────────────────────────────────────────────────────────┘
        │
        ├──► Meta Conversions API  (graph.facebook.com/v22.0)
        │    Evento: Lead · SHA-256 em todos os PII · Match Quality +8.0
        │
        └──► GA4 Measurement Protocol  (google-analytics.com/mp/collect)
             Evento: generate_lead · client_id do cookie _ga
```

**Princípio central:** o cliente recebe `200 OK` assim que o banco confirma (ou o fallback atua). Meta CAPI e GA4 rodam em paralelo depois, sem bloquear a experiência do usuário.

---

## 2. Stack e Dependências

### Package manager: pnpm (obrigatorio em todos os projetos)

```bash
pnpm install drizzle-orm @neondatabase/serverless zod
pnpm add -D drizzle-kit
```

### Dependencias principais

| Pacote | Versao | Papel |
|---|---|---|
| `next` | 15.x | Framework App Router + Server Actions |
| `drizzle-orm` | ^0.30 | ORM type-safe para PostgreSQL |
| `@neondatabase/serverless` | ^0.9 | Driver HTTP do Neon (funciona em serverless) |
| `zod` | ^3.23 | Validacao e parsing do payload da API |
| `drizzle-kit` | ^0.21 | CLI para gerar e rodar migrations |

### Scripts em `package.json`

```json
{
  "scripts": {
    "dev":          "next dev",
    "build":        "next build",
    "start":        "next start",
    "lint":         "next lint",
    "db:generate":  "drizzle-kit generate",
    "db:migrate":   "drizzle-kit migrate",
    "db:push":      "drizzle-kit push",
    "db:studio":    "drizzle-kit studio"
  }
}
```

---

## 3. Variaveis de Ambiente

### `.env.local` (nunca commitar)

```bash
# ── Banco de dados ────────────────────────────────────────────────────────────
# CRM compartilhado DR.TRAFEGO — mesmo banco para todos os clientes
# Formato: postgresql://user:password@host.neon.tech/neondb?sslmode=require
DATABASE_URL=

# ── CRM — identificadores do cliente (obter no painel do CRM) ────────────────
# UUID da organizacao do cliente no CRM
ORGANIZATION_ID=

# UUID da coluna "Novos Leads" da organizacao no CRM
DEFAULT_COLUMN_ID=

# ── Meta Conversions API (server-side, NUNCA expor ao browser) ───────────────
# Pixel ID — so numeros (ex: 1234567890123456)
FB_PIXEL_ID=

# Token CAPI — gerar em: Gerenciador de Eventos → Pixel → Configuracoes → CAPI
FB_ACCESS_TOKEN=

# ── Meta Pixel (front-end, exposto ao browser) ───────────────────────────────
NEXT_PUBLIC_FB_PIXEL_ID=

# ── Google Analytics 4 ───────────────────────────────────────────────────────
# ID da propriedade GA4 (ex: G-XXXXXXXXXX)
NEXT_PUBLIC_GA4_ID=

# API Secret do GA4 Measurement Protocol
# Gerar em: GA4 → Admin → Data Streams → seu stream → Measurement Protocol API Secrets
GA4_API_SECRET=

# ── Site ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://dominiodocliente.com.br
```

### Onde obter cada valor

| Variavel | Onde gerar |
|---|---|
| `DATABASE_URL` | console.neon.tech → projeto CRM → Connection String |
| `ORGANIZATION_ID` | Painel CRM DR.TRAFEGO → organizacao do cliente |
| `DEFAULT_COLUMN_ID` | Painel CRM DR.TRAFEGO → kanban → coluna "Novos Leads" |
| `FB_PIXEL_ID` | Meta Business → Gerenciador de Eventos → Pixel → Configuracoes |
| `FB_ACCESS_TOKEN` | Meta Business → Gerenciador de Eventos → Pixel → Configuracoes → CAPI |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Mesmo valor de `FB_PIXEL_ID` |
| `NEXT_PUBLIC_GA4_ID` | GA4 → Admin → Data Streams → ID da medicao |
| `GA4_API_SECRET` | GA4 → Admin → Data Streams → Measurement Protocol API Secrets |

### Configuracao no Vercel

- `DATABASE_URL`, `FB_PIXEL_ID`, `FB_ACCESS_TOKEN`, `GA4_API_SECRET` e `ORGANIZATION_ID`, `DEFAULT_COLUMN_ID`: marcar como **Sensitive** (server-only)
- `NEXT_PUBLIC_FB_PIXEL_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_SITE_URL`: marcar como **Exposed to browser**
- Todas devem estar habilitadas para o ambiente **Production**

---

## 4. Estrutura de Arquivos

```
src/
├── lib/
│   ├── schema.ts            ← Tabela "leads" no PostgreSQL (CRM compartilhado)
│   ├── db.ts                ← Singleton Drizzle conectado ao Neon
│   └── tracking-server.ts  ← sendMetaCAPI() + sendGA4MP() + helpers
├── components/
│   ├── ContactForm.tsx      ← Formulario controlado (client component)
│   ├── PhoneInputWithFlag.tsx ← Input de telefone com bandeira por IP
│   ├── MetaPixel.tsx        ← Pixel client-side (PageView + Lead)
│   └── GoogleAnalytics.tsx  ← gtag client-side
└── app/
    ├── layout.tsx           ← GTM instalado no <head>
    ├── page.tsx             ← Landing page principal
    └── api/
        └── contact/
            └── route.ts     ← POST /api/contact

drizzle.config.ts            ← Configuracao do drizzle-kit
```

---

## 5. Banco de Dados — CRM Compartilhado

### 5.1 `src/lib/schema.ts`

O banco e compartilhado entre todos os clientes da DR.TRAFEGO. Cada cliente tem seu `organization_id` e seus `column_id`s proprios.

```typescript
import { pgTable, uuid, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  // Chave primaria UUID — tambem usado como external_id na Meta CAPI
  id: uuid('id').defaultRandom().primaryKey(),

  // Dados pessoais obrigatorios
  name:     text('name').notNull(),
  email:    text('email').notNull(),
  whatsapp: text('whatsapp').notNull(),

  // Dados opcionais
  company: text('company'),
  notes:   text('notes'),
  value:   numeric('value'),

  // CRM — identificadores da organizacao/coluna do cliente
  organization_id: text('organization_id').notNull(),
  column_id:       uuid('column_id').notNull(),

  // Status e ordenacao no kanban
  status:   text('status').default('novo'),
  position: integer('position').default(0),  // usar Math.floor(Date.now() / 1000)

  // UTMs — chegam da URL da landing page
  utm_source:    text('utm_source'),
  utm_medium:    text('utm_medium'),
  utm_campaign:  text('utm_campaign'),
  utm_term:      text('utm_term'),
  utm_content:   text('utm_content'),
  campaign_source: text('campaign_source'), // espelho de utm_source

  // Metadados de navegacao
  page_path: text('page_path'), // ex: "/" ou "/modelo-c"

  // Timestamps
  first_contact_at: timestamp('first_contact_at').defaultNow(),
  created_at:       timestamp('created_at').defaultNow().notNull(),
})

export type Lead    = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
```

> **IMPORTANTE:** O campo `position` e do tipo `integer` (max 2,147,483,647).
> Sempre usar `Math.floor(Date.now() / 1000)` — timestamp em **segundos**, nao milissegundos.
> `Date.now()` em ms (~1.7 trilhao) estoura o limite e causa erro no insert.

### 5.2 `src/lib/db.ts`

Singleton com lazy initialization — instanciado apenas na primeira chamada.

```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let _db: NeonHttpDatabase<typeof schema> | null = null

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!)
    _db = drizzle(sql, { schema })
  }
  return _db
}
```

**Por que `neon-http` e nao `pg`?**
O driver HTTP do Neon funciona em ambientes serverless (Vercel Functions) onde conexoes TCP persistentes nao sao suportadas.

**Por que singleton com `getDb()` em vez de `export const db`?**
Evita que a instancia seja criada em build time, quando `DATABASE_URL` pode nao estar disponivel.

### 5.3 `drizzle.config.ts`

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema:    './src/lib/schema.ts',
  out:       './drizzle',
  dialect:   'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
```

```bash
# Desenvolvimento: aplica schema diretamente sem migration
pnpm db:push

# Producao: gera migration SQL versionada e aplica
pnpm db:generate
pnpm db:migrate

# GUI visual para inspecionar o banco
pnpm db:studio
```

---

## 6. Tracking Server-side

### 6.1 `src/lib/tracking-server.ts`

> NUNCA importe em Client Components. Usa `crypto` nativo do Node e variaveis secretas.

#### Interfaces

```typescript
export interface CAPIPayload {
  leadId:         number | string
  name:           string
  email:          string
  whatsapp:       string
  modelo?:        string   // identifica qual variacao da LP gerou o lead
  ip?:            string
  userAgent?:     string
  fbc?:           string   // cookie _fbc — click ID do anuncio Meta
  fbp?:           string   // cookie _fbp — browser ID do Facebook
  eventSourceUrl?: string  // URL onde o evento ocorreu
}

export interface GA4Payload {
  leadId:          number | string
  modelo?:         string
  clientId?:       string   // extraido do cookie _ga
  sessionId?:      string   // extraido do cookie _ga_XXXXXXXX
  ip?:             string
  userAgent?:      string
  eventSourceUrl?: string
}
```

#### Helpers de cookie GA4

```typescript
// Extrai client_id do cookie _ga (formato: GA1.1.XXXXXXXXXX.XXXXXXXXXX)
export function parseGaClientId(cookieHeader: string): string | undefined {
  const match = cookieHeader.match(/(?:^|; )_ga=GA\d+\.\d+\.(\d+\.\d+)/)
  return match ? match[1] : undefined
}

// Extrai session_id do cookie _ga_XXXXXXXX
export function parseGaSessionId(cookieHeader: string, measurementId: string): string | undefined {
  const containerId = measurementId.replace('G-', '')
  const match = cookieHeader.match(
    new RegExp(`(?:^|; )_ga_${containerId}=GS[^;]*?\\.(\\d+)\\.`)
  )
  return match ? match[1] : undefined
}
```

#### Funcoes privadas de hashing

```typescript
// SHA-256 em lowercase+trim — obrigatorio pela Meta para qualquer PII
async function hashData(raw: string): Promise<string> {
  const { createHash } = await import('crypto')
  return createHash('sha256').update(raw.trim().toLowerCase()).digest('hex')
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

function lastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  return parts.length > 1 ? (parts[parts.length - 1] ?? '') : ''
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}
```

#### `sendMetaCAPI()` — Payload exato enviado a Meta

```json
{
  "data": [{
    "event_name": "Lead",
    "event_time": 1709149483,
    "event_id": "uuid-do-banco",
    "action_source": "website",
    "event_source_url": "https://dominiodocliente.com.br",
    "user_data": {
      "em": ["<sha256 do email>"],
      "ph": ["<sha256 do telefone limpo>"],
      "fn": ["<sha256 do primeiro nome>"],
      "ln": ["<sha256 do sobrenome>"],
      "country": ["0c9dce3e..."],
      "client_ip_address": "177.100.200.5",
      "client_user_agent": "Mozilla/5.0 ...",
      "fbc": "fb.1.1709...28173",
      "fbp": "fb.1.1709...4910",
      "external_id": ["<sha256 do leadId>"]
    },
    "custom_data": {
      "content_name": "Lead NomeDoCliente",
      "lead_type": "modelo-c"
    }
  }]
}
```

**Contribuicao de cada campo para o Match Quality:**

| Campo | Contribuicao |
|---|---|
| `em` | Alta — e-mail e o identificador mais forte |
| `ph` | Alta — complementa o e-mail |
| `fn` + `ln` | Media — desambigua pessoas com mesmo e-mail |
| `country` | Media — pre-hashed com valor fixo `br` |
| `client_ip_address` | Media — geolocalizacao e device fingerprint |
| `client_user_agent` | Media — identifica o device |
| `fbc` | Muito alta — vincula direto ao clique no anuncio |
| `fbp` | Alta — identifica o browser cross-session |
| `external_id` | Alta — identificador unico do negocio (+16% match) |

> **Personalizacao por projeto:** trocar `content_name` pelo nome do cliente.
> `lead_type` e preenchido automaticamente com o modelo da LP (modelo-a, modelo-c, etc).

**Deduplicacao com o Pixel front-end:**
O campo `event_id` recebe o mesmo `leadId` que o Pixel do browser envia. A Meta usa isso para eliminar eventos duplicados — mantendo apenas um registro por conversao real.

**Versao da API:** `graph.facebook.com/v22.0` — atualizar conforme versao vigente.

#### `sendGA4MP()` — Payload exato enviado ao GA4

```json
{
  "client_id": "1234567890.0987654321",
  "user_agent": "Mozilla/5.0 ...",
  "document_location": "https://dominiodocliente.com.br",
  "events": [{
    "name": "generate_lead",
    "params": {
      "currency": "BRL",
      "lead_id": "uuid-do-banco",
      "lead_source": "modelo-c",
      "session_id": "1709149000",
      "engagement_time_msec": 1
    }
  }]
}
```

**Endpoint:** `https://www.google-analytics.com/mp/collect?measurement_id=G-XXXXXXXX&api_secret=XXXXXX`

**GA4 retorna 204 em sucesso** — sem body na resposta.

**Fallback de client_id:** se o cookie `_ga` nao existir, usa `server.{leadId}` para garantir que o evento seja enviado.

---

## 7. API Route — POST /api/contact

### Contrato da API

```
Metodo:   POST
Rota:     /api/contact
Headers:  Content-Type: application/json

Body (JSON):
{
  "name":         string  (min 2, max 120)       obrigatorio
  "email":        string  (email valido)          obrigatorio
  "whatsapp":     string  (min 10, max 20 chars)  obrigatorio
  "utm_source":   string                          opcional
  "utm_medium":   string                          opcional
  "utm_campaign": string                          opcional
  "utm_term":     string                          opcional
  "utm_content":  string                          opcional
  "modelo":       string                          opcional (ex: "a", "c", "d")
}

Respostas:
  200 { success: true,  leadId: string }         lead salvo ou fallback
  400 { success: false, message: string }        payload invalido
  422 { success: false, errors: { campo: [] } }  erros de validacao Zod
```

### Fluxo interno da route

```typescript
// 1. Valida com Zod
// 2. Extrai identificadores do request
const ip            = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
const userAgent     = req.headers.get('user-agent')
const fbc           = parseCookie('_fbc')
const fbp           = parseCookie('_fbp')
const eventSourceUrl = req.headers.get('origin')
const gaClientId    = parseGaClientId(cookieHeader)
const gaSessionId   = parseGaSessionId(cookieHeader, measurementId)

// 3. INSERT no banco com timeout de 5s
const [row] = await withTimeout(
  getDb().insert(leads).values({
    name, email, whatsapp,
    organization_id: process.env.ORGANIZATION_ID!,
    column_id:       process.env.DEFAULT_COLUMN_ID!,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    campaign_source: utm_source,
    page_path: modelo ? `/modelo-${modelo}` : '/',
    status: 'novo',
    position: Math.floor(Date.now() / 1000),  // segundos, nao ms
  }).returning({ id: leads.id }),
  5_000,
)

// 4. Retorna 200 imediatamente
const response = NextResponse.json({ success: true, leadId }, { status: 200 })

// 5. Tracking em background (Meta CAPI + GA4 em paralelo)
void Promise.all([
  sendMetaCAPI({ leadId, name, email, whatsapp, modelo, ip, userAgent, fbc, fbp, eventSourceUrl }),
  sendGA4MP({ leadId, modelo, clientId: gaClientId, sessionId: gaSessionId, userAgent, eventSourceUrl }),
]).catch(console.error)

return response
```

### Resiliencia — withTimeout e fallback

```typescript
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ])
}

// Se o banco falhar ou timeout:
} catch (dbErr) {
  leadId = `fallback_${Date.now()}`
  console.error('[contact] Banco indisponivel:', dbErr)
}
```

**O que o fallback garante:**
- Usuario sempre recebe `200 OK` em ate 5 s
- Pixel front-end consegue o `leadId` para deduplicacao
- Meta CAPI e GA4 ainda disparam (com o ID temporario)
- Conversao e rastreada mesmo sem o banco

---

## 8. Tracking Client-side

### GTM — Google Tag Manager

Instalado no `<head>` via `layout.tsx`. Container ID configurado por cliente.

```typescript
// layout.tsx — dentro de <head>
<script dangerouslySetInnerHTML={{ __html: `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');
`}} />

// layout.tsx — primeiro filho de <body>
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0" width="0" style={{ display:'none', visibility:'hidden' }} />
</noscript>
```

### Meta Pixel — `components/MetaPixel.tsx`

Dispara `PageView` no carregamento e `Lead` apos submit bem-sucedido do formulario.

```typescript
// No ContactForm, apos receber leadId do servidor:
if (typeof window.fbq === 'function') {
  window.fbq('track', 'Lead', {}, { eventID: leadId })
  // eventID igual ao event_id da CAPI — garante deduplicacao
}
```

### GA4 — `components/GoogleAnalytics.tsx`

Carrega `gtag.js` e dispara `generate_lead` apos submit.

```typescript
// No ContactForm, apos receber leadId do servidor:
if (typeof window.gtag === 'function') {
  window.gtag('event', 'generate_lead', { event_category: 'formulario', modelo })
}
```

> O evento `generate_lead` e enviado tanto client-side (gtag) quanto server-side (Measurement Protocol).
> A versao server-side e a principal — garante rastreamento mesmo com bloqueadores de anuncio.

---

## 9. Como replicar em novo projeto

### Passo 1 — Criar projeto Next.js 15

```bash
pnpm create next-app@latest nome-do-projeto --typescript --tailwind --app --src-dir
cd nome-do-projeto
```

### Passo 2 — Instalar dependencias

```bash
pnpm add drizzle-orm @neondatabase/serverless zod
pnpm add -D drizzle-kit
```

### Passo 3 — Copiar os arquivos base

```
src/lib/schema.ts
src/lib/db.ts
src/lib/tracking-server.ts
src/app/api/contact/route.ts
drizzle.config.ts
```

### Passo 4 — Personalizar por cliente

| Arquivo | Campo | O que alterar |
|---|---|---|
| `tracking-server.ts` | `content_name` | Nome do cliente (ex: "Lead Rocha Advogados") |
| `tracking-server.ts` | versao da API | `v22.0` → versao mais atual da Graph API |
| `route.ts` | `page_path` | Ajustar logica de modelos se necessario |
| `layout.tsx` | Container GTM | ID do GTM do cliente |

### Passo 5 — Configurar variaveis de ambiente

```bash
# .env.local
DATABASE_URL=         # string de conexao Neon (CRM compartilhado)
ORGANIZATION_ID=      # UUID da organizacao do cliente no CRM
DEFAULT_COLUMN_ID=    # UUID da coluna "Novos Leads" no CRM
FB_PIXEL_ID=          # ID do Pixel Meta do cliente
FB_ACCESS_TOKEN=      # Token CAPI do cliente
NEXT_PUBLIC_FB_PIXEL_ID=  # mesmo que FB_PIXEL_ID
NEXT_PUBLIC_GA4_ID=   # ID GA4 do cliente
GA4_API_SECRET=       # API Secret do Measurement Protocol
NEXT_PUBLIC_SITE_URL= # dominio do cliente
```

### Passo 6 — Criar a tabela no banco

O banco ja existe (CRM compartilhado). Se for o primeiro projeto usando esse banco, rodar:

```bash
pnpm db:push   # desenvolvimento
# ou
pnpm db:generate && pnpm db:migrate   # producao
```

### Passo 7 — Adicionar variaveis no Vercel

Todas as variaveis acima devem ser adicionadas em **Project Settings → Environment Variables** marcadas para o ambiente **Production**.

### Passo 8 — Testar o endpoint

```bash
curl -X POST https://seudominio.com.br/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste DR.TRAFEGO",
    "email": "teste@drtrafego.com",
    "whatsapp": "+5565996768610",
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "teste",
    "modelo": "c"
  }'

# Resposta esperada (leadId e um UUID, nao fallback_):
# { "success": true, "leadId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }
```

---

## 10. Diagnostico de Erros Comuns

| Sintoma | Causa | Solucao |
|---|---|---|
| `leadId` retorna `fallback_XXXXX` | Banco falhou ou timeout | Ver erro no console do Vercel; checar DATABASE_URL, ORGANIZATION_ID, DEFAULT_COLUMN_ID |
| `value "XXX" is out of range for type integer` | `position` recebeu `Date.now()` em ms | Usar `Math.floor(Date.now() / 1000)` |
| Lead nao aparece no CRM | `ORGANIZATION_ID` ou `DEFAULT_COLUMN_ID` errado | Verificar UUIDs no painel do CRM |
| CAPI nao dispara | `FB_PIXEL_ID` ou `FB_ACCESS_TOKEN` ausente | Adicionar no Vercel (Production) |
| GA4 nao aparece no DebugView | `GA4_API_SECRET` ausente ou `client_id` nulo | Verificar cookies `_ga` e variaveis de ambiente |
| Evento duplicado no GA4 | gtag client-side + server-side disparando | Normal — GA4 nao deduplica `generate_lead`, apenas o Meta faz com `event_id` |

---

## 11. Diagrama de dependencias

```
route.ts
  ├── zod                          (validacao do body)
  ├── db.ts
  │     ├── @neondatabase/serverless  (driver HTTP Neon)
  │     ├── drizzle-orm               (query builder)
  │     └── schema.ts                 (definicao da tabela)
  └── tracking-server.ts
        ├── parseGaClientId()         (extrai _ga cookie)
        ├── parseGaSessionId()        (extrai _ga_XXXX cookie)
        ├── sendMetaCAPI()
        │     └── crypto (Node nativo) — SHA-256 dos PII
        │     └── fetch  (Node nativo) — POST para graph.facebook.com/v22.0
        └── sendGA4MP()
              └── fetch  (Node nativo) — POST para google-analytics.com/mp/collect
```

Nenhuma biblioteca de terceiros alem das listadas. Zero dependencias extras para tracking.

---

## 12. Seguranca

- `tracking-server.ts` usa `crypto` nativo do Node — sem dependencia externa para hashing
- Todos os PII (email, telefone, nome, sobrenome, id) passam por SHA-256 antes de sair do servidor
- `FB_ACCESS_TOKEN` nunca aparece em logs — interpolado apenas na URL de destino
- `GA4_API_SECRET` transmitido apenas via query string HTTPS para a Google
- Variaveis sensiveis marcadas como Sensitive no Vercel (sem exposicao ao browser)
- `NEXT_PUBLIC_*` expostos apenas quando estritamente necessario (Pixel ID e GA4 ID)

---

*Documento gerado em 2026-05-12 — DR.TRAFEGO*
*Baseado na implementacao real do projeto lp_wagner_rocha*
