# Rocha Advogados — Landing Page
**Cliente:** Dr. Wagner Rocha — Advocacia Trabalhista  
**Status:** Aguardando escolha do modelo pelo cliente  
**Repositório:** github.com/drtrafego/lp_wagner_rocha  
**Data de criação:** 06/05/2026

---

## Visão Geral

4 landing pages Next.js 14 para teste A/B de headline e layout. O cliente escolhe qual(is) publicar. Toda a copy foi aprovada previamente em documento Google Docs.

---

## Os 4 Modelos

| Rota | Estilo | Animação | Headline |
|---|---|---|---|
| `/modelo-a` | Editorial claro (fundo off-white) | Sem | Opção A — Intuição: "Você sabe que algo estava errado..." |
| `/modelo-b` | Dark premium (fundo chumbo) | Sem | Opção B — Dúvida: "O que você não sabe sobre seus direitos..." |
| `/modelo-c` | Editorial claro | Com (scroll-reveal + countUp) | Opção A — Intuição |
| `/modelo-d` | Dark premium | Com (scroll-reveal + animações de entrada) | Opção B — Dúvida |

A página raiz `/` exibe um seletor para navegar entre os modelos (uso interno, não divulgar ao público).

---

## Identidade Visual

**Fonte display (títulos):** Archivo Bold/ExtraBold — Google Fonts  
**Fonte corpo (texto):** Inter Regular/Medium — Google Fonts

| Cor | HEX | Uso |
|---|---|---|
| Cinza Chumbo | `#3A3A3F` | Cor principal, textos |
| Bordô | `#7A1F2B` | Acento institucional, CTAs |
| Off-White | `#FAF7F2` | Fundo principal |
| Chumbo Profundo | `#28282C` | Fundos escuros (modelos B e D) |
| Bordô Profundo | `#5C1620` | Hover, destaque |
| Off-White Quente | `#EFEAE2` | Fundos secundários |

**Fontes de referência:** Manual de marca Wagner (pasta Drive do cliente)

---

## Estrutura de Arquivos

```
lp_wagner_rocha/
├── src/
│   ├── app/
│   │   ├── layout.tsx               ← Metadata global SEO/GEO + Meta Pixel + GA4 + JsonLd
│   │   ├── page.tsx                 ← Seletor de modelos (uso interno)
│   │   ├── globals.css              ← Estilos globais + classes de animação CSS
│   │   ├── robots.ts                ← Regras de indexação (/api/ bloqueado)
│   │   ├── sitemap.ts               ← Sitemap dinâmico (/ e /obrigado)
│   │   ├── modelo-a/
│   │   │   ├── layout.tsx           ← Metadata + canonical específicos do modelo A
│   │   │   └── page.tsx             ← LP editorial claro, sem animação
│   │   ├── modelo-b/
│   │   │   ├── layout.tsx           ← Metadata + canonical específicos do modelo B
│   │   │   └── page.tsx             ← LP dark premium, sem animação
│   │   ├── modelo-c/
│   │   │   ├── layout.tsx           ← Metadata + canonical específicos do modelo C
│   │   │   └── page.tsx             ← LP editorial claro, com animação
│   │   ├── modelo-d/
│   │   │   ├── layout.tsx           ← Metadata + canonical específicos do modelo D
│   │   │   └── page.tsx             ← LP dark premium, com animação
│   │   ├── obrigado/page.tsx        ← Página de conversão + link WhatsApp
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts         ← POST /api/contact (toda lógica de backend)
│   ├── components/
│   │   ├── ContactForm.tsx          ← Formulário compartilhado (variante light/dark)
│   │   ├── JsonLd.tsx               ← Dados estruturados schema.org (4 schemas)
│   │   ├── MetaPixel.tsx            ← Pixel Meta client-side
│   │   ├── GoogleAnalytics.tsx      ← GA4 client-side
│   │   ├── ScrollReveal.tsx         ← Intersection Observer para animações de scroll
│   │   └── CountUp.tsx              ← Animação de contador numérico
│   └── lib/
│       ├── schema.ts                ← Tabela leads (Drizzle ORM)
│       ├── db.ts                    ← Conexão Neon (lazy init)
│       └── tracking-server.ts       ← Meta CAPI com SHA-256
├── drizzle.config.ts
├── tailwind.config.ts
├── .env.local.example               ← Template de variáveis (preencher antes do deploy)
└── PROJETO.md                       ← Este arquivo
```

---

## Backend — O que está implementado

### POST /api/contact
- Validação com Zod (name, email, whatsapp obrigatórios + UTMs opcionais)
- Captura de IP real (`x-forwarded-for` / `x-real-ip`)
- Captura de User-Agent
- Captura dos cookies `_fbc` e `_fbp` do Meta
- INSERT na tabela `leads` no Neon com timeout de 5s
- Fallback em memória se o banco estiver indisponível (lead não se perde no rastreamento)
- Retorna `200 OK` imediatamente ao browser
- Meta CAPI dispara em background (fire-and-forget)

### Meta Conversions API (CAPI)
- Evento: `Lead`
- SHA-256 em: email, telefone (limpo), primeiro nome, external_id
- Campos enviados: `em`, `ph`, `fn`, `client_ip_address`, `client_user_agent`, `fbc`, `fbp`, `external_id`
- `event_id` = ID do banco (garante deduplicação com o Pixel front-end)
- `content_name`: "Lead Rocha Advogados"
- Versão da API: v19.0

### Banco de dados (Neon + Drizzle)
Tabela `leads`:

| Coluna | Tipo | Obs |
|---|---|---|
| id | serial PK | Usado como external_id na CAPI |
| name | text NOT NULL | Nome completo |
| email | text NOT NULL | E-mail |
| whatsapp | text NOT NULL | Telefone (qualquer formato) |
| utm_source | text | Origem do tráfego |
| utm_medium | text | Mídia |
| utm_campaign | text | Nome da campanha |
| utm_term | text | Variante/termo |
| modelo | text | Qual LP converteu (a, b, c, d) |
| created_at | timestamp | Auto |

### GA4
- `generate_lead` no submit do formulário
- `conversion` na página /obrigado

### Meta Pixel (front-end)
- `PageView` automático no carregamento
- `Lead` com `eventID` no submit (para deduplicação com a CAPI)

---

## SEO e GEO — O que está implementado

### Metadata global (`src/app/layout.tsx`)
- `title` com template `%s | Rocha Advogados` para herança por página
- `description` otimizada para intenção de busca trabalhista local
- `keywords` focadas em Cuiabá/MT e Mato Grosso
- `metadataBase` configurado para URLs absolutas automáticas nas tags OG
- `robots` avançado: `max-image-preview: large`, `max-snippet: -1`
- `verification.google` via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

### Open Graph e Twitter Card
- `og:type`: website
- `og:locale`: pt_BR
- `og:image`: `/og-image.jpg` (1200x630 — adicionar imagem antes do go-live)
- `twitter:card`: summary_large_image

### GEO meta tags (SEO local)
```html
<meta name="geo.region" content="BR-MT" />
<meta name="geo.placename" content="Cuiabá, Mato Grosso, Brasil" />
<meta name="geo.position" content="-15.5934;-56.0883" />
<meta name="ICBM" content="-15.5934, -56.0883" />
```

### Dados estruturados JSON-LD (`src/components/JsonLd.tsx`)

| Schema | Finalidade |
|---|---|
| `LegalService` | Escritório: endereço, telefone, horário, coordenadas, área de atuação |
| `Person` (Attorney) | Dr. Wagner Rocha: cargo, especialidades, contato |
| `BreadcrumbList` | Breadcrumb nos resultados do Google |
| `FAQPage` | Rich result com caixa de perguntas no Google (7 perguntas da copy) |

### Sitemap e Robots
- `/sitemap.xml` gerado dinamicamente — URL raiz (prioridade 1.0) e /obrigado (0.3)
- `/robots.txt` gerado dinamicamente — permite tudo exceto `/api/`

### Metadata por modelo
Cada modelo tem `layout.tsx` próprio com `title` e `canonical` específicos. Necessário porque as páginas são Client Components (`'use client'`) e não podem exportar `metadata` diretamente.

| Rota | Title |
|---|---|
| `/modelo-a` | Análise Gratuita do Seu Caso Trabalhista — Rocha Advogados |
| `/modelo-b` | Direitos Trabalhistas em Cuiabá/MT — Rocha Advogados |
| `/modelo-c` | Análise Gratuita do Seu Caso Trabalhista — Rocha Advogados |
| `/modelo-d` | Direitos Trabalhistas em Cuiabá/MT — Rocha Advogados |

### Pendência de SEO antes do go-live
- Criar `/public/og-image.jpg` (1200x630 px) com identidade visual do escritório
- Preencher `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` no Vercel após verificar no Google Search Console
- Atualizar canonical do modelo escolhido para apontar para o domínio raiz (`https://rochaadvogadosmt.com.br`)

---

## Variáveis de Ambiente

Copiar `.env.local.example` para `.env.local` e preencher:

```bash
# Banco Neon — console.neon.tech → Connection String
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require

# Meta — Gerenciador de Eventos → Pixel → Configurações → Conversions API
FB_PIXEL_ID=
FB_ACCESS_TOKEN=
NEXT_PUBLIC_FB_PIXEL_ID=       # mesmo valor do FB_PIXEL_ID

# Google Analytics 4 — formato G-XXXXXXXXXX
NEXT_PUBLIC_GA4_ID=

# URL pública do site (sem barra final) — usado no SEO/sitemap/OG
NEXT_PUBLIC_SITE_URL=https://rochaadvogadosmt.com.br

# Google Search Console — código de verificação (opcional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

**No Vercel:** Project Settings → Environment Variables  
`FB_PIXEL_ID` e `FB_ACCESS_TOKEN` devem ser **Server only** (não marcar como expose to browser).

---

## Como colocar no ar

### 1. Configurar banco
```bash
# Preencher .env.local com DATABASE_URL
pnpm run db:push   # cria a tabela leads no Neon
```

### 2. Testar localmente
```bash
pnpm dev
# Abrir http://localhost:3000
```

### 3. Deploy Vercel
```bash
# Conectar repo github.com/drtrafego/lp_wagner_rocha na Vercel
# Adicionar as variáveis de ambiente (ver seção acima)
# Deploy automático a cada push na branch master
```

### 4. Definir qual modelo publicar
- Configurar o domínio do cliente para apontar para o modelo escolhido
- Opção A: criar redirect na raiz `/` para `/modelo-x`
- Opção B: copiar o conteúdo do modelo escolhido para `src/app/page.tsx`
- Atualizar o `canonical` do modelo escolhido para `https://rochaadvogadosmt.com.br`

### 5. Google Search Console
- Adicionar propriedade com o domínio final
- Obter o código de verificação e preencher `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` no Vercel
- Submeter `https://rochaadvogadosmt.com.br/sitemap.xml`

---

## Informações do Escritório

| Campo | Valor |
|---|---|
| Nome | Rocha Advogados |
| Advogado | Dr. Wagner Rocha |
| Especialidade | Advocacia Trabalhista |
| Endereço | Av. São Sebastião, 3161, Ed. Xingú, sala 103, Quilombo, Cuiabá/MT |
| CEP | 78043-400 |
| Coordenadas | -15.5934, -56.0883 |
| Telefone | (65) 9 9676-8610 |
| E-mail | wagner@rochaadvogadosmt.com |
| WhatsApp deep link | wa.me/5565996768610 |
| OAB | OAB/MT XXXXX (preencher com número real) |

---

## Decisões Pendentes (aguardando cliente)

- [ ] Escolha do modelo (A, B, C ou D)
- [ ] Escolha da headline (Opção A ou Opção B da copy)
- [ ] OAB/MT — número real para substituir o placeholder XXXXX
- [ ] Foto do Dr. Wagner (para inserir no hero se desejado)
- [ ] Domínio final (para configurar no Vercel)
- [ ] Credenciais: DATABASE_URL, FB_PIXEL_ID, FB_ACCESS_TOKEN, GA4_ID
- [ ] Imagem OG (`/public/og-image.jpg`, 1200x630 px)
- [ ] Verificação Google Search Console (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`)

---

## Fontes e Referências

| Arquivo | Link |
|---|---|
| Copy aprovada | Google Docs — pasta Drive cliente Wagner |
| Manual de marca | PDF na pasta Drive cliente Wagner |
| Formulário de onboarding | Google Docs — pasta Drive cliente Wagner |
| Repositório | github.com/drtrafego/lp_wagner_rocha |
