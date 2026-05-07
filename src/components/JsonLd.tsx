export default function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rochaadvogadosmt.com.br'

  const legalService = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${siteUrl}/#escritorio`,
    name: 'Rocha Advogados',
    alternateName: 'Wagner Rocha Advocacia',
    description:
      'Escritório de advocacia trabalhista em Cuiabá/MT. 13 anos de experiência representando trabalhadores e empregadores. Análise gratuita do seu caso.',
    url: siteUrl,
    telephone: '+556599676861',
    email: 'wagner@rochaadvogadosmt.com',
    priceRange: 'Consulta gratuita. Honorários sobre resultado.',
    currenciesAccepted: 'BRL',
    paymentAccepted: 'Percentual sobre resultado útil',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Avenida São Sebastião, 3161, Edifício Xingú, sala 103, 1º andar',
      addressLocality: 'Cuiabá',
      addressRegion: 'MT',
      postalCode: '78043-400',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -15.5934,
      longitude: -56.0883,
    },
    hasMap: 'https://maps.google.com/?q=Av.+São+Sebastião+3161+Cuiabá+MT',
    areaServed: [
      {
        '@type': 'State',
        name: 'Mato Grosso',
        sameAs: 'https://www.wikidata.org/wiki/Q43952',
      },
      {
        '@type': 'Country',
        name: 'Brasil',
        sameAs: 'https://www.wikidata.org/wiki/Q155',
      },
    ],
    serviceType: [
      'Advocacia Trabalhista',
      'Ação Trabalhista',
      'Análise de Rescisão',
      'Horas Extras',
      'FGTS',
      'Direito do Trabalho',
    ],
    knowsLanguage: 'pt-BR',
    founder: {
      '@id': `${siteUrl}/#advogado`,
    },
    employee: {
      '@id': `${siteUrl}/#advogado`,
    },
  }

  const attorney = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#advogado`,
    name: 'Wagner Rocha',
    honorificPrefix: 'Dr.',
    jobTitle: 'Advogado Trabalhista',
    description:
      '13 anos de advocacia trabalhista em Cuiabá/MT, atuando na representação de trabalhadores e empregadores em ações trabalhistas, análise de rescisão, horas extras e FGTS.',
    worksFor: {
      '@id': `${siteUrl}/#escritorio`,
    },
    knowsAbout: [
      'Direito do Trabalho',
      'Processo do Trabalho',
      'Rescisão Trabalhista',
      'Horas Extras',
      'FGTS',
      'Adicional Noturno',
      'Insalubridade',
      'Periculosidade',
      'Vínculo Empregatício',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Faculdade de Direito',
    },
    email: 'wagner@rochaadvogadosmt.com',
    telephone: '+556599676861',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cuiabá',
      addressRegion: 'MT',
      addressCountry: 'BR',
    },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Rocha Advogados',
        item: siteUrl,
      },
    ],
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Preciso pagar para a análise inicial?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Não. A análise inicial não tem custo. O Dr. Wagner avalia a situação e orienta sobre o que é possível buscar — sem nenhum compromisso financeiro nesse primeiro momento.',
        },
      },
      {
        '@type': 'Question',
        name: 'Se eu entrar com uma ação trabalhista, preciso pagar antecipado?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Não. Os honorários são cobrados como percentual sobre o resultado útil bruto do caso — geralmente entre 25% e 35%, conforme análise do caso. Você não desembolsa nada para começar.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quanto tempo tenho para entrar com uma ação trabalhista?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Em regra, o prazo é de 2 anos após o fim do contrato de trabalho, com direito a buscar os últimos 5 anos do vínculo. Por isso é importante verificar o quanto antes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quanto tempo demora um processo trabalhista?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Varia conforme a complexidade do caso, a possibilidade de acordo e o andamento na Justiça do Trabalho. Na análise inicial, você recebe uma estimativa realista para a sua situação específica.',
        },
      },
      {
        '@type': 'Question',
        name: 'Posso ser atendido em outra cidade além de Cuiabá?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim. O atendimento pode ser feito de forma virtual — análise de documentos e reuniões online — para quem está em qualquer cidade do Brasil.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attorney) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  )
}
