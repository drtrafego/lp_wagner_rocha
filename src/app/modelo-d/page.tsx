'use client'
import { useState } from 'react'
import ContactForm from '@/components/ContactForm'
import ScrollReveal from '@/components/ScrollReveal'
import CountUp from '@/components/CountUp'

const FAQ_ITEMS = [
  { q: 'Preciso pagar para a análise inicial?', a: 'Não. A análise inicial não tem custo. O Dr. Wagner avalia a situação e orienta sobre o que é possível buscar — sem nenhum compromisso financeiro nesse primeiro momento.' },
  { q: 'Se eu entrar com uma ação, preciso pagar antecipado?', a: 'Não. Para trabalhadores que ajuízam ação trabalhista, os honorários são cobrados como percentual sobre o resultado útil bruto do caso — geralmente entre 25% e 35%, conforme análise do caso. Você não desembolsa nada para começar.' },
  { q: 'Preciso ter documentos para a primeira conversa?', a: 'Não necessariamente. Você pode descrever o que aconteceu mesmo sem todos os documentos em mãos. Se houver base para atuação, orientamos quais documentos reunir e como obtê-los.' },
  { q: 'Quanto tempo tenho para entrar com uma ação trabalhista?', a: 'Em regra, o prazo é de 2 anos após o fim do contrato de trabalho, com direito a buscar os últimos 5 anos do vínculo. Por isso é importante verificar o quanto antes.' },
  { q: 'E se eu não tiver certeza de que tenho direitos a buscar?', a: 'É exatamente para isso que serve a análise. Você não precisa ter certeza antes de entrar em contato — o trabalho começa justamente por verificar se há ou não irregularidades no seu caso.' },
  { q: 'Quanto tempo demora um processo trabalhista?', a: 'Varia conforme a complexidade do caso, a possibilidade de acordo e o andamento na Justiça do Trabalho. Na análise inicial, você recebe uma estimativa realista para a sua situação específica.' },
  { q: 'Consigo ser atendido mesmo estando em outra cidade?', a: 'Sim. O atendimento pode ser feito de forma virtual — análise de documentos e reuniões online — para quem está em qualquer cidade do Brasil.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
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

export default function ModeloD() {
  return (
    <div style={{ background: '#28282C', fontFamily: 'Inter, sans-serif' }} className="min-h-screen">
      {/* BARRA TOPO ANIMADA */}
      <div
        className="bg-borde text-white text-center py-2.5 px-4 text-xs font-body tracking-wide"
        style={{ animation: 'fadeIn 0.6s ease forwards' }}
      >
        Seus direitos trabalhistas foram respeitados? Descubra antes que o prazo passe.
      </div>

      {/* NAVBAR STICKY */}
      <nav
        className="border-b px-6 py-4 sticky top-0 z-50 backdrop-blur-md"
        style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(40,40,44,0.95)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-borde flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs" style={{ fontFamily: 'Archivo, sans-serif' }}>RA</span>
            </div>
            <span className="font-display font-bold text-offwhite text-base tracking-tight" style={{ fontFamily: 'Archivo, sans-serif' }}>Rocha Advogados</span>
          </div>
          <a
            href="#formulario"
            className="text-xs font-body border border-borde text-borde px-4 py-2 hover:bg-borde hover:text-white transition-all"
          >
            Analisar meu caso
          </a>
        </div>
      </nav>

      {/* HERO SPLIT — ANIMADO */}
      <section className="min-h-screen flex items-center relative overflow-hidden px-6 py-20">
        {/* Fundo com pontos */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(122,31,43,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Barra vertical bordô */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-borde opacity-60" />

        <div className="max-w-6xl mx-auto w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* TEXTO HERO */}
            <div>
              <div
                style={{ animation: 'fadeUp 0.8s ease 0.1s both' }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-px bg-borde" />
                  <span className="text-borde text-xs font-body uppercase tracking-[0.25em]">Advocacia Trabalhista</span>
                </div>
              </div>

              <div style={{ animation: 'fadeUp 0.8s ease 0.2s both' }}>
                <h1
                  className="font-display font-extrabold leading-[1.05] mb-6"
                  style={{ fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#FAF7F2' }}
                >
                  O que você não sabe sobre seus direitos trabalhistas{' '}
                  <span style={{ color: '#7A1F2B' }}>pode custar mais do que imagina.</span>
                </h1>
              </div>

              <div style={{ animation: 'fadeUp 0.8s ease 0.3s both' }}>
                <p className="text-white/50 font-body text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
                  Rescisão calculada errada, horas extras não pagas, FGTS sem depósito — há prazos correndo. Uma análise pode mudar o que você ainda consegue reivindicar.
                </p>
              </div>

              <div style={{ animation: 'fadeUp 0.8s ease 0.4s both' }}>
                <div className="flex flex-wrap gap-8 mb-10">
                  {[
                    { n: 13, suffix: '', l: 'anos de experiência' },
                    { n: 0, suffix: 'R$0', l: 'para começar' },
                    { n: 2, suffix: '', l: 'anos de prazo legal' },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="font-display font-bold text-borde text-3xl sm:text-4xl" style={{ fontFamily: 'Archivo, sans-serif' }}>
                        {s.suffix ? s.suffix : <CountUp target={s.n} />}
                      </div>
                      <div className="text-white/30 font-body text-xs mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>

                <a
                  href="#formulario"
                  className="inline-block bg-borde text-white font-display font-bold py-4 px-8 text-sm uppercase tracking-widest hover:bg-borde-deep transition-colors"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    animation: 'pulse 2.5s ease-in-out infinite',
                  }}
                >
                  Analisar meu caso — gratuito
                </a>
              </div>
            </div>

            {/* FORMULÁRIO HERO */}
            <div id="formulario" style={{ animation: 'scaleIn 0.8s ease 0.35s both' }}>
              <div className="border border-white/10 rounded-xl p-8 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-borde rounded-full" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  <span className="text-white/60 font-body text-xs uppercase tracking-wider">Análise disponível agora</span>
                </div>
                <h2 className="font-display font-bold text-offwhite text-lg mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  Análise gratuita do seu caso
                </h2>
                <p className="text-white/40 font-body text-sm mb-6">Sem compromisso. Resposta em até 24h.</p>
                <ContactForm variant="dark" modelo="d" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="border-t px-6 py-16 sm:py-24" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#3A3A3F' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal type="up">
            <div className="text-center mb-16">
              <p className="text-borde text-xs uppercase tracking-[0.25em] font-body mb-3">O problema</p>
              <h2 className="font-display font-bold text-offwhite text-2xl sm:text-4xl max-w-2xl mx-auto leading-tight" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Depois da demissão, as dúvidas ficam — e os prazos correm
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: 'A rescisão não fechava', d: 'A rescisão foi assinada, mas os números não fechavam — e ninguém soube explicar.' },
              { t: 'Horas extras ignoradas', d: 'Horas extras que nunca foram pagas, mesmo fazendo parte da rotina.' },
              { t: 'FGTS com falhas', d: 'FGTS com depósitos faltando ou multa que não veio.' },
              { t: 'Demissão irregular', d: 'Demissão que parece irregular, mas sem saber exatamente o quê.' },
              { t: 'Medo de agir sem base', d: 'Medo de entrar com uma ação sem saber se tem base — e o prazo se esgotando.' },
            ].map((card, i) => (
              <ScrollReveal key={card.t} type={i % 3 === 0 ? 'left' : i % 3 === 2 ? 'right' : 'up'} delay={i * 0.08}>
                <div className="border border-white/8 rounded-lg p-6 hover:border-borde/40 transition-colors h-full" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="w-8 h-0.5 bg-borde mb-4" />
                  <h3 className="text-offwhite font-display font-bold text-sm mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{card.t}</h3>
                  <p className="text-white/40 font-body text-sm leading-relaxed">{card.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal type="left">
              <div>
                <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">O que fazemos</p>
                <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl mb-6 leading-tight" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  Uma análise completa da sua situação trabalhista
                </h2>
                <p className="text-white/50 font-body text-sm leading-relaxed">
                  Cada caso é diferente. Por isso o trabalho começa pela leitura do que de fato aconteceu — não por uma resposta padrão.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-1">
              {[
                { n: '01', t: 'Rescisão e verbas', d: 'Aviso prévio, 13º proporcional, férias, saldo de salário.' },
                { n: '02', t: 'Horas extras e adicionais', d: 'Jornada, adicional noturno, insalubridade, periculosidade, desvio de função.' },
                { n: '03', t: 'FGTS e multas', d: 'Depósitos e multa rescisória devida conforme o tipo de demissão.' },
                { n: '04', t: 'Vínculo e direitos gerais', d: 'Contrato, registro, obrigações cumpridas e descumpridas.' },
              ].map((item, i) => (
                <ScrollReveal key={item.n} type="right" delay={i * 0.1}>
                  <div className="flex items-center gap-6 p-5 border border-white/6 hover:border-borde/30 hover:bg-white/5 transition-all group" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-borde font-display font-bold text-2xl flex-shrink-0 group-hover:text-borde transition-colors" style={{ fontFamily: 'Archivo, sans-serif' }}>{item.n}</span>
                    <div>
                      <h3 className="text-offwhite font-display font-bold text-sm mb-0.5" style={{ fontFamily: 'Archivo, sans-serif' }}>{item.t}</h3>
                      <p className="text-white/40 font-body text-xs leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
              <div className="pt-6">
                <a href="#formulario" className="inline-block border border-white/30 hover:border-borde text-white hover:text-borde font-display font-bold py-4 px-8 text-sm uppercase tracking-widest transition-colors" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  Quero que analisem meu caso
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="px-6 py-16 sm:py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#3A3A3F' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal type="up">
            <div className="text-center mb-16">
              <p className="text-borde text-xs uppercase tracking-[0.25em] font-body mb-3">Processo</p>
              <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl" style={{ fontFamily: 'Archivo, sans-serif' }}>Como funciona</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { n: '1', t: 'Você conta sua situação', d: 'Pelo WhatsApp ou formulário. Sem documentos em mãos.' },
              { n: '2', t: 'Análise do caso', d: 'O Dr. Wagner avalia e identifica irregularidades.' },
              { n: '3', t: 'Estratégia clara', d: 'Caminho definido: documentos, possibilidades e próximos passos.' },
              { n: '4', t: 'Sem custo inicial', d: 'Honorários somente sobre o resultado útil.' },
            ].map((step, i) => (
              <ScrollReveal key={step.n} type="up" delay={i * 0.12}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-borde flex items-center justify-center text-white font-display font-bold text-lg mx-auto mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
                    {step.n}
                  </div>
                  <h3 className="text-offwhite font-display font-bold text-sm mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{step.t}</h3>
                  <p className="text-white/40 font-body text-xs leading-relaxed">{step.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS + CITAÇÃO */}
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ScrollReveal type="left">
              <div>
                <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Diferenciais</p>
                <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl mb-10" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  O que muda quando você tem o Dr. Wagner ao seu lado
                </h2>
                <div className="space-y-6">
                  {[
                    { t: 'Visão dos dois lados', d: 'Defendeu trabalhadores e empregadores. Conhece os argumentos que serão usados contra você.' },
                    { t: 'Análise do caso real', d: 'Cada caso avaliado por provas, prazos, risco e o caminho mais adequado.' },
                    { t: 'Comunicação direta', d: 'Sem linguagem jurídica desnecessária. Você sabe exatamente onde está.' },
                    { t: 'Sem promessas irreais', d: 'Análise honesta do que o caso apresenta — orientação responsável.' },
                  ].map((d, i) => (
                    <div key={d.t} className="flex items-start gap-4">
                      <div className="w-0.5 h-full min-h-[3rem] bg-borde flex-shrink-0" />
                      <div>
                        <h3 className="text-offwhite font-body font-medium text-sm mb-1">{d.t}</h3>
                        <p className="text-white/40 font-body text-sm leading-relaxed">{d.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal type="right" delay={0.15}>
              <div className="flex flex-col gap-8">
                {/* CITAÇÃO */}
                <div className="border border-white/10 rounded-xl p-8">
                  <div className="text-borde font-display font-bold text-5xl mb-4 leading-none" style={{ fontFamily: 'Archivo, sans-serif' }}>"</div>
                  <blockquote className="text-white/70 font-body text-base leading-relaxed italic mb-4">
                    Muitas vezes, a orientação jurídica adequada representa uma luz no fim do túnel para o trabalhador que foi demitido. O mais importante é entender a situação real do caso — e agir com a estratégia certa.
                  </blockquote>
                  <footer className="text-white/30 font-body text-xs">Dr. Wagner Rocha — Advogado Trabalhista</footer>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Anos de atuação', value: 13, isCount: true },
                    { label: 'Custo para começar', value: 'R$ 0', isCount: false },
                    { label: 'Prazo legal para agir', value: '2 anos', isCount: false },
                    { label: 'Forma de atendimento', value: 'Virtual', isCount: false },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-lg p-5">
                      <div className="font-display font-bold text-borde text-2xl mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>
                        {s.isCount ? <CountUp target={s.value as number} /> : s.value}
                      </div>
                      <div className="text-white/30 font-body text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 sm:py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#3A3A3F' }}>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal type="up">
            <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Dúvidas</p>
            <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl mb-10" style={{ fontFamily: 'Archivo, sans-serif' }}>Perguntas frequentes</h2>
          </ScrollReveal>
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-borde opacity-5 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 80px)',
        }} />
        <div className="max-w-4xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal type="left">
              <div>
                <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-4">Não espere</p>
                <h2 className="font-display font-bold text-offwhite text-2xl sm:text-4xl mb-4 leading-tight" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  Não deixe o prazo decidir por você
                </h2>
                <p className="text-white/50 font-body text-base leading-relaxed">
                  Se algo na sua demissão não fez sentido — o momento de verificar é agora.
                </p>
                <div className="mt-8 pt-8 border-t border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-white/30 font-body text-xs mb-2">Prefere falar diretamente?</p>
                  <a href="https://wa.me/5565996768610" target="_blank" rel="noopener noreferrer" className="text-borde font-body text-sm hover:text-offwhite transition-colors">
                    WhatsApp: (65) 9 9676-8610
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal type="right" delay={0.1}>
              <div className="border border-white/10 rounded-xl p-8 bg-white/4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <ContactForm variant="dark" modelo="d-cta" ctaLabel="Analisar meu caso agora" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-6 py-10" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display font-bold text-offwhite text-sm mb-0.5" style={{ fontFamily: 'Archivo, sans-serif' }}>Rocha Advogados</p>
            <p className="text-white/20 font-body text-xs">Mato Grosso · Brasil</p>
          </div>
          <div className="text-xs font-body text-white/20 text-right space-y-1">
            <p>Av. São Sebastião, 3161, Ed. Xingú, sala 103 — Quilombo, Cuiabá/MT</p>
            <a href="tel:+5565996768610" className="hover:text-borde transition-colors block">(65) 9 9676-8610</a>
            <p className="text-white/20 mt-1">OAB/MT XXXXX</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-white/15 font-body text-xs leading-relaxed">
            Aviso legal: As informações contidas nesta página têm caráter informativo e não constituem promessa de resultado. Cada caso é único e sujeito à análise individual conforme as normas éticas da OAB.
          </p>
        </div>
      </footer>
    </div>
  )
}
