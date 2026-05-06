'use client'
import { useState } from 'react'
import ContactForm from '@/components/ContactForm'

const FAQ_ITEMS = [
  { q: 'Preciso pagar para a análise inicial?', a: 'Não. A análise inicial não tem custo. O Dr. Wagner avalia a situação e orienta sobre o que é possível buscar — sem nenhum compromisso financeiro nesse primeiro momento.' },
  { q: 'Se eu entrar com uma ação, preciso pagar antecipado?', a: 'Não. Para trabalhadores que ajuízam ação trabalhista, os honorários são cobrados como percentual sobre o resultado útil bruto do caso — geralmente entre 25% e 35%, conforme análise do caso.' },
  { q: 'Preciso ter documentos para a primeira conversa?', a: 'Não necessariamente. Você pode descrever o que aconteceu mesmo sem todos os documentos em mãos. Se houver base para atuação, orientamos quais documentos reunir e como obtê-los.' },
  { q: 'Quanto tempo tenho para entrar com uma ação trabalhista?', a: 'Em regra, o prazo é de 2 anos após o fim do contrato de trabalho, com direito a buscar os últimos 5 anos do vínculo. Por isso é importante verificar o quanto antes.' },
  { q: 'E se eu não tiver certeza de que tenho direitos a buscar?', a: 'É exatamente para isso que serve a análise. Você não precisa ter certeza antes de entrar em contato — o trabalho começa justamente por verificar se há ou não irregularidades.' },
  { q: 'Consigo ser atendido mesmo estando em outra cidade?', a: 'Sim. O atendimento pode ser feito de forma virtual — análise de documentos e reuniões online — para quem está em qualquer cidade do Brasil.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-5 flex items-center justify-between gap-4">
        <span className="font-body text-white/80 text-sm sm:text-base">{q}</span>
        <span className="flex-shrink-0 w-6 h-6 border border-borde/60 flex items-center justify-center text-borde text-xs transition-transform" style={{ transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-white/40 font-body text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function ModeloB() {
  return (
    <div style={{ background: '#28282C', fontFamily: 'Inter, sans-serif' }} className="min-h-screen">
      {/* BARRA URGÊNCIA */}
      <div className="bg-borde-deep text-white text-center py-2.5 px-4 text-xs font-body tracking-wide">
        Seus direitos trabalhistas foram respeitados? Descubra antes que o prazo passe.
      </div>

      {/* NAVBAR */}
      <nav className="border-b border-white/8 px-6 py-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-borde flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs" style={{ fontFamily: 'Archivo, sans-serif' }}>RA</span>
            </div>
            <div>
              <span className="font-display font-bold text-offwhite text-base tracking-tight" style={{ fontFamily: 'Archivo, sans-serif' }}>Rocha Advogados</span>
            </div>
          </div>
          <a href="tel:+5565996768610" className="text-xs font-body text-white/40 hover:text-borde transition-colors">
            (65) 9 9676-8610
          </a>
        </div>
      </nav>

      {/* HERO — FULL DARK */}
      <section className="px-6 py-20 sm:py-32 relative overflow-hidden">
        {/* Grid pattern de fundo */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#FAF7F2 1px, transparent 1px), linear-gradient(90deg, #FAF7F2 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-borde" />
              <span className="text-borde text-xs font-body uppercase tracking-[0.25em]">Dr. Wagner Rocha — OAB/MT</span>
            </div>

            <h1 className="font-display font-extrabold leading-[1.05] mb-8" style={{ fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', color: '#FAF7F2' }}>
              O que você não sabe sobre seus direitos trabalhistas{' '}
              <span style={{ color: '#7A1F2B' }}>pode custar mais do que imagina.</span>
            </h1>

            <p className="text-white/50 font-body text-base sm:text-lg leading-relaxed max-w-2xl mb-12">
              Rescisão calculada errada, horas extras não pagas, FGTS sem depósito — há prazos correndo. Uma análise do seu caso pode mudar o que você ainda consegue reivindicar.
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-10 mb-12">
              {[
                { n: '13', l: 'anos de advocacia trabalhista' },
                { n: '2', l: 'anos para entrar com ação' },
                { n: 'R$0', l: 'custo para começar' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display font-bold text-borde text-3xl sm:text-4xl" style={{ fontFamily: 'Archivo, sans-serif' }}>{s.n}</div>
                  <div className="text-white/40 font-body text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </div>

            <a
              href="#formulario"
              className="inline-block bg-borde hover:bg-borde-deep text-white font-display font-bold py-4 px-8 text-sm uppercase tracking-widest transition-colors"
              style={{ fontFamily: 'Archivo, sans-serif' }}
            >
              Analisar meu caso — gratuito
            </a>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="border-t border-white/8 px-6 py-16 sm:py-24" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">O problema</p>
              <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl leading-tight" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Depois da demissão, as dúvidas ficam — e os prazos correm
              </h2>
            </div>
            <div className="lg:col-span-3">
              <p className="text-white/50 font-body text-sm leading-relaxed mb-8">
                A maioria dos trabalhadores não tem como saber, sozinho, se tudo foi pago corretamente. E enquanto tenta descobrir, o tempo passa.
              </p>
              <div className="space-y-3">
                {[
                  'A rescisão foi assinada, mas os números não fechavam',
                  'Horas extras que nunca foram pagas, mesmo fazendo parte da rotina',
                  'FGTS com depósitos faltando ou multa que não veio',
                  'Demissão que parece irregular, mas sem saber exatamente o quê',
                  'Medo de entrar com uma ação sem saber se tem base',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-white/6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-borde font-body text-xs font-bold flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-white/60 font-body text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="px-6 py-16 sm:py-24" style={{ background: '#3A3A3F' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Análise completa</p>
          <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl mb-12" style={{ fontFamily: 'Archivo, sans-serif' }}>
            O que verificamos no seu caso
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {[
              { n: '01', t: 'Rescisão e verbas', d: 'Aviso prévio, 13º proporcional, férias, saldo de salário — tudo verificado.' },
              { n: '02', t: 'Horas extras e adicionais', d: 'Jornada, adicional noturno, insalubridade, periculosidade e desvio de função.' },
              { n: '03', t: 'FGTS e multas', d: 'Depósitos e multa rescisória devida conforme o tipo de demissão.' },
              { n: '04', t: 'Vínculo e direitos gerais', d: 'Contrato, registro, obrigações cumpridas e descumpridas na relação de trabalho.' },
            ].map((item) => (
              <div key={item.n} className="bg-chumbo-fundo p-8 group hover:bg-borde/10 transition-colors">
                <div className="text-borde font-display font-bold text-2xl mb-4 opacity-60" style={{ fontFamily: 'Archivo, sans-serif' }}>{item.n}</div>
                <h3 className="text-offwhite font-display font-bold text-base mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{item.t}</h3>
                <p className="text-white/40 font-body text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Processo</p>
          <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl mb-12" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Como funciona
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { n: '1', t: 'Você conta sua situação', d: 'Pelo WhatsApp ou pelo formulário. Sem documentos em mãos para começar.' },
              { n: '2', t: 'Análise do caso', d: 'O Dr. Wagner avalia o que aconteceu e identifica irregularidades.' },
              { n: '3', t: 'Estratégia clara', d: 'Você recebe um caminho definido: documentos, possibilidades e próximos passos.' },
              { n: '4', t: 'Sem custo inicial', d: 'Honorários cobrados somente sobre o resultado útil — você não paga para começar.' },
            ].map((step, i) => (
              <div key={step.n} className="relative">
                {i < 3 && <div className="hidden sm:block absolute top-4 left-10 right-0 h-px bg-white/10" />}
                <div className="w-8 h-8 bg-borde flex items-center justify-center text-white font-display font-bold text-xs mb-4 relative z-10" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  {step.n}
                </div>
                <h3 className="text-offwhite font-display font-bold text-sm mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{step.t}</h3>
                <p className="text-white/40 font-body text-sm leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="px-6 py-16 sm:py-24 border-t border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Diferenciais</p>
              <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Experiência que faz diferença na análise do seu caso
              </h2>
              <blockquote className="border-l-2 border-borde pl-6 mt-8">
                <p className="text-white/60 font-body text-base leading-relaxed italic">
                  "Muitas vezes, a orientação jurídica adequada representa uma luz no fim do túnel para o trabalhador que foi demitido. O mais importante é entender a situação real do caso — e agir com a estratégia certa."
                </p>
                <footer className="text-white/30 font-body text-xs mt-4">Dr. Wagner Rocha — Advogado Trabalhista</footer>
              </blockquote>
            </div>
            <div className="space-y-4">
              {[
                { t: 'Visão dos dois lados', d: 'Ao longo de 13 anos, defendeu tanto trabalhadores quanto empregadores. Conhece os argumentos que serão usados contra você.' },
                { t: 'Análise do caso real', d: 'Cada caso avaliado pelo que realmente aconteceu: provas, prazos, risco e o caminho mais adequado.' },
                { t: 'Comunicação direta', d: 'Você entende exatamente a sua situação — sem linguagem jurídica desnecessária.' },
                { t: 'Sem promessas irreais', d: 'Análise honesta do que o caso apresenta, com orientação responsável sobre o possível.' },
              ].map((d) => (
                <div key={d.t} className="flex items-start gap-4 py-4 border-b border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-borde flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="text-offwhite font-body font-medium text-sm mb-1">{d.t}</h3>
                    <p className="text-white/40 font-body text-sm leading-relaxed">{d.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 sm:py-20" style={{ background: '#3A3A3F' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Dúvidas</p>
          <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl mb-10" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Perguntas frequentes
          </h2>
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* CTA FINAL + FORM */}
      <section id="formulario" className="px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Não espere</p>
              <h2 className="font-display font-bold text-offwhite text-2xl sm:text-4xl mb-4 leading-tight" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Não deixe o prazo decidir por você
              </h2>
              <p className="text-white/50 font-body text-base leading-relaxed">
                Se algo na sua demissão não fez sentido, ou se você suspeita que seus direitos não foram respeitados — o momento de verificar é agora.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <ContactForm variant="dark" modelo="b" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 px-6 py-10" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display font-bold text-offwhite text-sm mb-0.5" style={{ fontFamily: 'Archivo, sans-serif' }}>Rocha Advogados</p>
            <p className="text-white/30 font-body text-xs">Mato Grosso · Brasil</p>
          </div>
          <div className="text-xs font-body text-white/30 text-right space-y-1">
            <p>Av. São Sebastião, 3161, Ed. Xingú, sala 103 — Quilombo, Cuiabá/MT</p>
            <a href="tel:+5565996768610" className="hover:text-borde transition-colors block">(65) 9 9676-8610</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-white/15 font-body text-xs leading-relaxed">
            Aviso legal: As informações contidas nesta página têm caráter informativo e não constituem promessa de resultado. Cada caso é único e sujeito à análise individual conforme as normas éticas da OAB.
          </p>
        </div>
      </footer>
    </div>
  )
}
