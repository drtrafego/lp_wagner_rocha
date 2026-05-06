import Link from 'next/link'

export default function IndexPage() {
  const modelos = [
    { href: '/modelo-a', label: 'Modelo A', desc: 'Editorial claro — sem animação', tag: 'Headline: Intuição' },
    { href: '/modelo-b', label: 'Modelo B', desc: 'Dark premium — sem animação', tag: 'Headline: Dúvida' },
    { href: '/modelo-c', label: 'Modelo C', desc: 'Editorial claro — com animação', tag: 'Headline: Intuição' },
    { href: '/modelo-d', label: 'Modelo D', desc: 'Dark premium — com animação', tag: 'Headline: Dúvida' },
  ]

  return (
    <main className="min-h-screen bg-chumbo-fundo flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="mb-12">
          <p className="text-borde text-xs uppercase tracking-[0.25em] font-body mb-3">Rocha Advogados</p>
          <h1 className="text-offwhite font-display font-bold text-3xl mb-2">Landing Pages</h1>
          <p className="text-white/40 font-body text-sm">Selecione o modelo para visualizar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modelos.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group block border border-white/10 hover:border-borde/60 rounded-lg p-6 transition-all duration-300 hover:bg-white/5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-offwhite font-display font-bold text-lg">{m.label}</span>
                <span className="text-xs text-borde font-body border border-borde/40 rounded px-2 py-0.5">{m.tag}</span>
              </div>
              <p className="text-white/50 font-body text-sm">{m.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-borde text-xs font-body opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Ver modelo</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-white/20 text-xs font-body text-center mt-8">
          Esta página de seleção é visível apenas para você. Os modelos são URLs independentes.
        </p>
      </div>
    </main>
  )
}
