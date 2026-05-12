'use client'
import { useState } from 'react'
import ContactForm from '@/components/ContactForm'
import ScrollReveal from '@/components/ScrollReveal'
import CountUp from '@/components/CountUp'

const FAQ_ITEMS = [
  { q: 'Preciso pagar para a análise inicial?', a: 'Não. A análise inicial não tem custo. O Dr. Wagner avalia a situação e orienta sobre o que é possível buscar, sem nenhum compromisso financeiro nesse primeiro momento.' },
  { q: 'Se eu entrar com uma ação, preciso pagar antecipado?', a: 'Não. Para trabalhadores que ajuízam ação trabalhista, os honorários são cobrados como percentual sobre o resultado útil bruto do caso, geralmente entre 25% e 35%, conforme análise do caso. Você não desembolsa nada para começar.' },
  { q: 'Preciso ter documentos para a primeira conversa?', a: 'Não necessariamente. Você pode descrever o que aconteceu mesmo sem todos os documentos em mãos. Se houver base para atuação, orientamos quais documentos reunir e como obtê-los.' },
  { q: 'Quanto tempo tenho para entrar com uma ação trabalhista?', a: 'Em regra, o prazo é de 2 anos após o fim do contrato de trabalho, com direito a buscar os últimos 5 anos do vínculo. Por isso é importante verificar o quanto antes.' },
  { q: 'E se eu não tiver certeza de que tenho direitos a buscar?', a: 'É exatamente para isso que serve a análise. Você não precisa ter certeza antes de entrar em contato: o trabalho começa justamente por verificar se há ou não irregularidades no seu caso.' },
  { q: 'Quanto tempo demora um processo trabalhista?', a: 'Varia conforme a complexidade do caso, a possibilidade de acordo e o andamento na Justiça do Trabalho. Na análise inicial, você recebe uma estimativa realista para a sua situação específica.' },
  { q: 'Consigo ser atendido mesmo estando em outra cidade?', a: 'Sim. O atendimento pode ser feito de forma virtual, análise de documentos e reuniões online, para quem está em qualquer cidade do Brasil.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-chumbo/10 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-5 flex items-center justify-between gap-4">
        <span className="font-body font-medium text-chumbo text-sm sm:text-base">{q}</span>
        <span className="flex-shrink-0 w-6 h-6 border border-chumbo/20 flex items-center justify-center text-chumbo/60 text-xs transition-transform" style={{ transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-chumbo/60 font-body text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#FAF7F2', fontFamily: 'Inter, sans-serif' }}>
      {/* BARRA URGÊNCIA */}
      <div className="bg-borde text-white text-center py-2.5 px-4 text-xs font-body tracking-wide">
        Seus direitos trabalhistas foram respeitados? Descubra antes que o prazo passe.
      </div>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 py-20 sm:py-32 text-center">
        <ScrollReveal type="up">
          <h1 className="font-display font-extrabold text-chumbo leading-[1.05] mb-6" style={{ fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            O que você não sabe sobre seus direitos trabalhistas,{' '}
            <em className="not-italic text-borde">pode custar mais do que imagina.</em>
          </h1>
        </ScrollReveal>

        <ScrollReveal type="up" delay={0.1}>
          <p className="text-chumbo/60 font-body text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Rescisão calculada errada, horas extras não pagas, FGTS sem depósito: há prazos correndo. Uma análise do seu caso pode mudar o que você ainda consegue reivindicar.
          </p>
        </ScrollReveal>

        {/* STATS ANIMADOS */}
        <ScrollReveal type="up" delay={0.2}>
          <div className="flex flex-wrap justify-center gap-12 mb-10">
            <div>
              <div className="font-display font-bold text-borde text-4xl" style={{ fontFamily: 'Archivo, sans-serif' }}>
                <CountUp target={12} suffix="" />
              </div>
              <div className="text-chumbo/50 font-body text-xs mt-1">anos de advocacia trabalhista</div>
            </div>
            <div>
              <div className="font-display font-bold text-borde text-4xl" style={{ fontFamily: 'Archivo, sans-serif' }}>
                +<CountUp target={1500} />
              </div>
              <div className="text-chumbo/50 font-body text-xs mt-1">atuações processuais</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal type="up" delay={0.25}>
          <a
            href="#formulario"
            className="inline-block bg-borde hover:bg-borde-deep text-white font-display font-bold py-4 px-8 text-sm uppercase tracking-widest transition-colors"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            Analisar meu caso
          </a>
        </ScrollReveal>
      </section>

      {/* LINHA BORDÔ DECORATIVA */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-borde/0 via-borde/40 to-borde/0" />
      </div>

      {/* PROBLEMA */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <ScrollReveal type="up">
          <div className="max-w-xl mb-12">
            <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Depois da demissão, as dúvidas ficam: e os prazos correm
            </h2>
            <p className="text-chumbo/60 font-body text-base leading-relaxed">
              A maioria dos trabalhadores não tem como saber, sozinho, se tudo foi pago corretamente.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { t: 'A rescisão não fechava', d: 'A rescisão foi assinada, mas os números não fechavam: ninguém soube explicar.' },
            { t: 'Horas extras ignoradas', d: 'Horas extras que nunca foram pagas, mesmo fazendo parte da rotina.' },
            { t: 'FGTS com falhas', d: 'FGTS com depósitos faltando ou multa que não veio.' },
            { t: 'Demissão irregular', d: 'Demissão que parece irregular, mas sem saber exatamente o quê.' },
            { t: 'Medo de agir sem base', d: 'Medo de entrar com uma ação sem saber se tem base: e o prazo se esgotando.' },
          ].map((card, i) => (
            <ScrollReveal key={card.t} type="up" delay={i * 0.07}>
              <div className="bg-white rounded-xl p-6 border border-chumbo/8 h-full">
                <div className="w-6 h-0.5 bg-borde mb-4" />
                <h3 className="font-display font-bold text-chumbo text-sm mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{card.t}</h3>
                <p className="text-chumbo/50 font-body text-sm leading-relaxed">{card.d}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SOLUÇÃO — DARK */}
      <section className="bg-chumbo py-16 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal type="left">
            <div className="mb-12">
              <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">O que fazemos</p>
              <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Uma análise completa da sua situação trabalhista
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { n: '01', t: 'Rescisão e verbas', d: 'Aviso prévio, 13º proporcional, férias, saldo de salário: tudo verificado.' },
              { n: '02', t: 'Horas extras e adicionais', d: 'Jornada, adicional noturno, insalubridade, periculosidade e desvio de função.' },
              { n: '03', t: 'FGTS e multas', d: 'Checagem de depósitos e da multa rescisória devida conforme o tipo de demissão.' },
              { n: '04', t: 'Vínculo e direitos gerais', d: 'Contrato, registro, obrigações cumpridas e descumpridas na relação de trabalho.' },
            ].map((item, i) => (
              <ScrollReveal key={item.n} type={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div className="border border-white/10 rounded-xl p-6 h-full hover:border-borde/40 transition-colors group">
                  <div className="text-borde font-display font-bold text-3xl mb-4 group-hover:text-borde transition-colors" style={{ fontFamily: 'Archivo, sans-serif' }}>{item.n}</div>
                  <h3 className="text-offwhite font-display font-bold text-base mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{item.t}</h3>
                  <p className="text-white/50 font-body text-sm leading-relaxed">{item.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10">
            <a href="#formulario" className="inline-block border border-white/30 hover:border-borde text-white hover:text-borde font-display font-bold py-4 px-8 text-sm uppercase tracking-widest transition-colors" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Quero que analisem meu caso
            </a>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <ScrollReveal type="up">
          <div className="mb-12">
            <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Processo</p>
            <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl" style={{ fontFamily: 'Archivo, sans-serif' }}>Como funciona</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: '1', t: 'Você conta sua situação', d: 'Pelo WhatsApp ou formulário. Sem documentos em mãos para começar.' },
            { n: '2', t: 'Análise do caso', d: 'O Dr. Wagner avalia e identifica irregularidades no seu caso.' },
            { n: '3', t: 'Estratégia clara', d: 'Caminho definido: documentos, possibilidades e próximos passos.' },
            { n: '4', t: 'Atuação sem custo inicial', d: 'Honorários cobrados somente sobre o resultado útil.' },
          ].map((step, i) => (
            <ScrollReveal key={step.n} type="up" delay={i * 0.12}>
              <div>
                <div className="w-10 h-10 rounded-full border-2 border-borde flex items-center justify-center text-borde font-display font-bold text-sm mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  {step.n}
                </div>
                <h3 className="font-display font-bold text-chumbo text-sm mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{step.t}</h3>
                <p className="text-chumbo/60 font-body text-sm leading-relaxed">{step.d}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-offwhite-quente py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal type="up">
            <div className="mb-12">
              <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Por que o Dr. Wagner</p>
              <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl mb-3" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Experiência que faz diferença na análise do seu caso
              </h2>
              <p className="text-chumbo/60 font-body text-base">Mais de 12 anos de advocacia trabalhista, atuando dos dois lados da relação de trabalho.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { t: 'Visão dos dois lados', d: 'Defendeu tanto trabalhadores quanto empregadores. Conhece os argumentos que serão usados contra você.' },
              { t: 'Análise do caso real', d: 'Cada caso avaliado pelo que realmente aconteceu: provas, prazos, risco e o caminho mais adequado.' },
              { t: 'Comunicação direta', d: 'Você entende exatamente a sua situação, sem linguagem jurídica desnecessária.' },
              { t: 'Especialização em Direito do Trabalho', d: 'Formação e prática focadas exclusivamente na área trabalhista desde o início da carreira: não é uma área secundária do escritório.' },
              { t: 'Sem promessas irreais', d: 'O que você recebe é uma análise honesta do que o caso apresenta, com orientação responsável sobre o que é possível buscar.' },
            ].map((d, i) => (
              <ScrollReveal key={d.t} type="scale" delay={i * 0.07}>
                <div className="bg-white rounded-xl p-6 border border-chumbo/5 h-full">
                  <div className="w-6 h-0.5 bg-borde mb-4" />
                  <h3 className="font-display font-bold text-chumbo text-sm mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{d.t}</h3>
                  <p className="text-chumbo/60 font-body text-sm leading-relaxed">{d.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILIDADE */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal type="left">
            <div className="bg-chumbo rounded-2xl p-10">
              <div className="text-borde font-display font-bold text-6xl mb-6 leading-none" style={{ fontFamily: 'Archivo, sans-serif' }}>"</div>
              <blockquote className="text-offwhite font-body text-base leading-relaxed mb-6">
                Muitas vezes, a orientação jurídica adequada representa uma luz no fim do túnel para o trabalhador que foi demitido e não sabe como reorganizar sua vida. O mais importante é entender a situação real do caso: e agir com a estratégia certa.
              </blockquote>
              <footer className="text-white/40 font-body text-xs">
                Dr. Wagner Rocha, Advogado Trabalhista
              </footer>
        </div>
          </ScrollReveal>

          <ScrollReveal type="right">
            <div>
              <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-6">Trajetória</p>
              <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl mb-8" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Uma trajetória construída caso a caso
              </h2>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="font-display font-bold text-borde text-4xl" style={{ fontFamily: 'Archivo, sans-serif' }}>
                    <CountUp target={12} />
                  </div>
                  <div className="text-chumbo/50 font-body text-xs mt-1">anos de atuação</div>
                </div>
                <div>
                  <div className="font-display font-bold text-borde text-4xl" style={{ fontFamily: 'Archivo, sans-serif' }}>2</div>
                  <div className="text-chumbo/50 font-body text-xs mt-1">lados da relação de trabalho</div>
                </div>
              </div>
              <ul className="space-y-3 text-sm font-body text-chumbo/70">
                {[
                  'Mais de 12 anos de atuação contínua em advocacia trabalhista',
                  'Experiência representando empregados e empregadores',
                  'Especialização em Direito e Processo do Trabalho',
                  'Cada caso analisado de forma própria, não em série',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-borde flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-offwhite-quente py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal type="up">
            <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Dúvidas</p>
            <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl mb-10" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Perguntas frequentes
            </h2>
          </ScrollReveal>
          <div className="bg-white rounded-xl p-2">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="formulario" className="bg-borde py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal type="scale">
            <h2 className="font-display font-bold text-white text-2xl sm:text-4xl mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Não deixe o prazo decidir por você
            </h2>
            <p className="text-white/70 font-body text-base leading-relaxed mb-10 max-w-xl mx-auto">
              Se algo na sua demissão não fez sentido, ou se você suspeita que seus direitos não foram respeitados: o momento de verificar é agora.
            </p>
            <div className="max-w-md mx-auto bg-white/10 rounded-2xl p-8">
              <ContactForm variant="dark" modelo="home-cta" ctaLabel="Analisar meu caso agora" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-chumbo-fundo py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div>
            <p className="font-display font-bold text-offwhite text-base mb-0.5" style={{ fontFamily: 'Archivo, sans-serif' }}>Rocha Advogados</p>
            <p className="text-white/30 font-body text-xs">Mato Grosso · Brasil</p>
          </div>
          <div className="text-xs font-body text-white/30 text-right space-y-1">
            <p>Av. São Sebastião, 3161, Ed. Xingú, sala 103</p>
            <p>Quilombo, Cuiabá/MT</p>
            <a href="tel:+5565996768610" className="hover:text-borde transition-colors block">(65) 9 9676-8610</a>
            <p className="text-white/30 mt-1">OAB/MT XXXXX</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 pt-6">
          <p className="text-white/20 font-body text-xs leading-relaxed">
            Aviso legal: As informações contidas nesta página têm caráter informativo e não constituem promessa de resultado. Cada caso é único e sujeito à análise individual conforme as normas éticas da OAB.
          </p>
        </div>
      </footer>
    </div>
  )
}
