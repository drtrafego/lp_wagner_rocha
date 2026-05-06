'use client'
import { useState } from 'react'
import ContactForm from '@/components/ContactForm'

const FAQ_ITEMS = [
  { q: 'Preciso pagar para a análise inicial?', a: 'Não. A análise inicial não tem custo. O Dr. Wagner avalia a situação e orienta sobre o que é possível buscar — sem nenhum compromisso financeiro nesse primeiro momento.' },
  { q: 'Se eu entrar com uma ação, preciso pagar antecipado?', a: 'Não. Para trabalhadores que ajuízam ação trabalhista, os honorários são cobrados como percentual sobre o resultado útil bruto do caso — geralmente entre 25% e 35%, conforme análise do caso. Você não desembolsa nada para começar.' },
  { q: 'Preciso ter documentos para a primeira conversa?', a: 'Não necessariamente. Você pode descrever o que aconteceu mesmo sem todos os documentos em mãos. Se houver base para atuação, orientamos quais documentos reunir e como obtê-los.' },
  { q: 'Quanto tempo tenho para entrar com uma ação trabalhista?', a: 'Em regra, o prazo é de 2 anos após o fim do contrato de trabalho, com direito a buscar os últimos 5 anos do vínculo. Por isso é importante verificar o quanto antes.' },
  { q: 'E se eu não tiver certeza de que tenho direitos a buscar?', a: 'É exatamente para isso que serve a análise. Você não precisa ter certeza antes de entrar em contato — o trabalho começa justamente por verificar se há ou não irregularidades no seu caso.' },
  { q: 'Consigo ser atendido mesmo estando em outra cidade?', a: 'Sim. O atendimento pode ser feito de forma virtual — análise de documentos e reuniões online — para quem está em qualquer cidade do Brasil.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-chumbo/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-center justify-between gap-4"
      >
        <span className="font-body font-medium text-chumbo text-sm sm:text-base">{q}</span>
        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-chumbo/20 flex items-center justify-center text-chumbo/60 text-xs transition-transform" style={{ transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-chumbo/60 font-body text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function ModeloA() {
  return (
    <div className="min-h-screen" style={{ background: '#FAF7F2', fontFamily: 'Inter, sans-serif' }}>
      {/* BARRA URGÊNCIA */}
      <div className="bg-borde text-white text-center py-2.5 px-4 text-xs font-body tracking-wide">
        Seus direitos trabalhistas foram respeitados? Descubra antes que o prazo passe.
      </div>

      {/* NAVBAR */}
      <nav className="border-b border-chumbo/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-chumbo text-lg tracking-tight" style={{ fontFamily: 'Archivo, sans-serif' }}>Rocha Advogados</span>
            <span className="ml-2 text-xs text-chumbo/40 font-body hidden sm:inline">Mato Grosso · Brasil</span>
          </div>
          <a
            href="tel:+5565996768610"
            className="text-xs font-body text-chumbo/60 hover:text-borde transition-colors flex items-center gap-2"
          >
            <span className="hidden sm:inline">(65) 9 9676-8610</span>
            <span className="sm:hidden">Ligar</span>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* TEXTO */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-borde" />
              <span className="text-borde text-xs font-body uppercase tracking-[0.2em]">Advocacia Trabalhista</span>
            </div>
            <h1 className="font-display font-bold text-chumbo leading-[1.1] mb-6" style={{ fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
              Você sabe que algo estava errado.{' '}
              <span className="text-borde">Descubra o que você tem direito a buscar.</span>
            </h1>
            <p className="text-chumbo/60 font-body text-base leading-relaxed mb-10 max-w-md">
              Rescisão calculada errada, horas extras não pagas, FGTS sem depósito — há prazos correndo. Uma análise do seu caso pode mudar o que você ainda consegue reivindicar.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-borde" />
                <span className="text-chumbo/60 font-body">Análise gratuita</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-borde" />
                <span className="text-chumbo/60 font-body">Sem custo inicial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-borde" />
                <span className="text-chumbo/60 font-body">13 anos de experiência</span>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <div className="bg-white rounded-2xl shadow-lg shadow-chumbo/10 p-8 border border-chumbo/5">
            <h2 className="font-display font-bold text-chumbo text-lg mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Analisar meu caso
            </h2>
            <p className="text-chumbo/50 font-body text-sm mb-6">Sem compromisso. Resposta em até 24h.</p>
            <ContactForm variant="light" modelo="a" />
          </div>
        </div>
      </section>

      {/* DIVISOR BORDÔ */}
      <div className="h-px bg-borde/20 max-w-6xl mx-auto px-6" />

      {/* PROBLEMA */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Depois da demissão, as dúvidas ficam — e os prazos correm
          </h2>
          <p className="text-chumbo/60 font-body text-base leading-relaxed mb-12">
            A maioria dos trabalhadores não tem como saber, sozinho, se tudo foi pago corretamente. E enquanto tenta descobrir, o tempo passa.
          </p>
          <div className="space-y-4">
            {[
              'A rescisão foi assinada, mas os números não fechavam — e ninguém soube explicar',
              'Horas extras que nunca foram pagas, mesmo fazendo parte da rotina',
              'FGTS com depósitos faltando ou multa que não veio',
              'Demissão que parece irregular, mas sem saber exatamente o quê',
              'Medo de entrar com uma ação sem saber se tem base — e o prazo se esgotando',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-offwhite-quente">
                <div className="w-1 h-full min-h-[2.5rem] bg-borde rounded-full flex-shrink-0 mt-0.5" />
                <p className="text-chumbo/70 font-body text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-chumbo/60 font-body text-sm mt-8 italic">
            Se você reconhece alguma dessas situações, vale entender o que ainda dá tempo de buscar.
          </p>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="bg-chumbo py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">O que fazemos</p>
            <h2 className="font-display font-bold text-offwhite text-2xl sm:text-3xl mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Uma análise completa da sua situação trabalhista
            </h2>
            <p className="text-white/50 font-body text-base max-w-xl leading-relaxed">
              Cada caso é diferente. Por isso o trabalho começa pela leitura do que de fato aconteceu — não por uma resposta padrão.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { n: '01', t: 'Rescisão e verbas', d: 'Verificação se os valores pagos na demissão estão corretos: aviso prévio, 13º proporcional, férias, saldo de salário.' },
              { n: '02', t: 'Horas extras e adicionais', d: 'Identificação de irregularidades em jornada, adicional noturno, insalubridade, periculosidade e desvio de função.' },
              { n: '03', t: 'FGTS e multas', d: 'Checagem de depósitos e da multa rescisória devida conforme o tipo de demissão.' },
              { n: '04', t: 'Vínculo e direitos gerais', d: 'Análise da relação de trabalho como um todo — contrato, registro, obrigações cumpridas e descumpridas.' },
            ].map((item) => (
              <div key={item.n} className="border border-white/10 rounded-xl p-6">
                <div className="text-borde font-display font-bold text-3xl mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>{item.n}</div>
                <h3 className="text-offwhite font-display font-bold text-base mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{item.t}</h3>
                <p className="text-white/50 font-body text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-12">
          <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Processo</p>
          <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Como funciona
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: '1', t: 'Você conta sua situação', d: 'Pelo WhatsApp ou pelo formulário. Não precisa ter documentos em mãos para começar.' },
            { n: '2', t: 'Análise do caso', d: 'O Dr. Wagner avalia o que aconteceu, identifica irregularidades e orienta sobre o que ainda dá para buscar.' },
            { n: '3', t: 'Estratégia clara', d: 'Se houver base para atuar, você recebe um caminho definido: documentos, possibilidades e próximos passos.' },
            { n: '4', t: 'Atuação sem custo inicial', d: 'Os honorários são cobrados somente sobre o resultado útil do caso — você não paga para começar.' },
          ].map((step) => (
            <div key={step.n} className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-borde flex items-center justify-center text-borde font-display font-bold text-sm mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
                {step.n}
              </div>
              <h3 className="font-display font-bold text-chumbo text-base mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{step.t}</h3>
              <p className="text-chumbo/60 font-body text-sm leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-offwhite-quente py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Por que o Dr. Wagner</p>
            <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Experiência que faz diferença na análise do seu caso
            </h2>
            <p className="text-chumbo/60 font-body text-base">
              13 anos de advocacia trabalhista, atuando dos dois lados da relação de trabalho. Isso muda a profundidade da análise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { t: 'Visão dos dois lados', d: 'Ao longo de 13 anos, o Dr. Wagner defendeu tanto trabalhadores quanto empregadores. Conhece os argumentos que serão usados contra você.' },
              { t: 'Análise do caso real', d: 'Nenhuma resposta padrão. Cada caso é avaliado pelo que realmente aconteceu: provas, prazos, risco e o caminho mais adequado.' },
              { t: 'Comunicação direta', d: 'Você entende exatamente qual é a sua situação, quais são os riscos e o que pode ser feito — sem linguagem jurídica desnecessária.' },
              { t: 'Especialização em Direito do Trabalho', d: 'Formação e prática focadas exclusivamente na área trabalhista desde o início da carreira.' },
              { t: 'Sem promessas irreais', d: 'O que você recebe é uma análise honesta do que o caso apresenta, com orientação responsável sobre o que é possível buscar.' },
              { t: 'Atendimento virtual disponível', d: 'Análise de documentos e reuniões online para clientes em qualquer cidade do Brasil.' },
            ].map((d) => (
              <div key={d.t} className="bg-white rounded-xl p-6 border border-chumbo/5">
                <div className="w-8 h-0.5 bg-borde mb-4" />
                <h3 className="font-display font-bold text-chumbo text-base mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>{d.t}</h3>
                <p className="text-chumbo/60 font-body text-sm leading-relaxed">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILIDADE */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-6">Trajetória</p>
            <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl mb-8" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Uma trajetória construída caso a caso
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { n: '13', l: 'anos de atuação' },
                { n: '2', l: 'lados da relação de trabalho' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display font-bold text-borde text-4xl mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>{s.n}</div>
                  <div className="text-chumbo/60 font-body text-sm">{s.l}</div>
                </div>
              ))}
            </div>
            <ul className="space-y-3 text-sm font-body text-chumbo/70">
              {[
                '13 anos de atuação contínua em advocacia trabalhista',
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

          <div className="bg-chumbo rounded-2xl p-8 lg:p-10">
            <div className="text-borde font-display font-bold text-5xl mb-6 leading-none" style={{ fontFamily: 'Archivo, sans-serif' }}>"</div>
            <blockquote className="text-offwhite font-body text-base leading-relaxed mb-6">
              Muitas vezes, a orientação jurídica adequada representa uma luz no fim do túnel para o trabalhador que foi demitido e não sabe como reorganizar sua vida. O mais importante é entender a situação real do caso — e agir com a estratégia certa.
            </blockquote>
            <footer className="text-white/50 font-body text-sm">
              Dr. Wagner Rocha — Advogado Trabalhista
            </footer>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-offwhite-quente py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-borde text-xs uppercase tracking-[0.2em] font-body mb-3">Dúvidas</p>
          <h2 className="font-display font-bold text-chumbo text-2xl sm:text-3xl mb-10" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Perguntas frequentes
          </h2>
          <div className="bg-white rounded-xl p-2">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-borde py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-white text-2xl sm:text-4xl mb-4" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Não deixe o prazo decidir por você
          </h2>
          <p className="text-white/70 font-body text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Se algo na sua demissão não fez sentido, ou se você suspeita que seus direitos não foram respeitados — o momento de verificar é agora.
          </p>
          <div className="max-w-md mx-auto bg-white/10 rounded-2xl p-8">
            <ContactForm variant="dark" modelo="a-cta" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-chumbo-fundo py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div>
              <p className="font-display font-bold text-offwhite text-base mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>Rocha Advogados</p>
              <p className="text-white/40 font-body text-xs">Mato Grosso · Brasil</p>
            </div>
            <div className="text-right text-xs font-body text-white/40 space-y-1">
              <p>Av. São Sebastião, 3161, Ed. Xingú, sala 103</p>
              <p>Quilombo, Cuiabá/MT</p>
              <a href="tel:+5565996768610" className="hover:text-borde transition-colors block">(65) 9 9676-8610</a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-white/20 font-body text-xs leading-relaxed">
              Aviso legal: As informações contidas nesta página têm caráter informativo e não constituem promessa de resultado. Cada caso é único e sujeito à análise individual conforme as normas éticas da Ordem dos Advogados do Brasil.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
