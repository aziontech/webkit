import frost from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'
import frostReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'
import g2 from '@aziontech/webkit/assets/g2-symbol-color.svg'
import gartner from '@aziontech/webkit/assets/gartner-extended-color.svg'
import gartnerReversed from '@aziontech/webkit/assets/gartner-extended-reversed.svg'
import gigaom from '@aziontech/webkit/assets/gigaom-extended-color.svg'
import gigaomReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'

import type { LandingPage } from '.'
import { specialistForm } from './_shared/pt-br-forms'

const BLOG = 'https://www.azion.com/pt-br/blog/'
const CASES = 'https://www.azion.com/pt-br/casos-de-sucesso/'

const FIRMS = {
  g2: { name: 'G2', logo: g2, logoLight: g2 },
  gigaom: { name: 'GigaOm', logo: gigaomReversed, logoLight: gigaom },
  gartner: { name: 'Gartner', logo: gartnerReversed, logoLight: gartner },
  frost: { name: 'Frost & Sullivan', logo: frostReversed, logoLight: frost }
}

const article = (label: string, slug: string) => ({
  label,
  href: `${BLOG}${slug}/`,
  trailing: true,
  external: true
})

const VENDORS = [
  { id: 'cloudflare', name: 'Cloudflare R2 / Workers / CDN' },
  { id: 'aws', name: 'AWS S3 + CloudFront' },
  { id: 'akamai', name: 'Akamai NetStorage / CDN' },
  { id: 'azion', name: 'Azion Edge Storage + Edge App', highlighted: true }
]

const COMPARISON_ROWS = [
  {
    label: 'Armazenamento (US / BR)',
    values: [
      '$0.015/GB · sem egressos · PUT/GET pagos',
      '$0.023–$0.024/GB · egressos $0.085/GB',
      '≥ $0.049/GB + ingestão e purga',
      '✅ $0.015/GB com integração edge · sem egressos'
    ]
  },
  {
    label: 'Egressos / Tráfego CDN',
    values: [
      'Incluso no plano (fair use)',
      '$0.085–$0.060/GB + $0.0075/10k reqs',
      '$0.049–$0.045/GB + custo variável',
      '✅ $0.110/GB (BR) · $0.085/GB (US/EU) · decrescente'
    ]
  },
  {
    label: 'Requests (HTTPS / 10k)',
    values: [
      'GET $3.60 · PUT $45',
      '~$0.75/10k',
      'Geralmente incluso ou variável',
      '✅ $0.009 (US/EU) · $0.029 (LATAM)'
    ]
  },
  {
    label: 'Integração compute/serverless',
    values: [
      'Billing separado entre Workers e R2',
      'Custo cumulativo entre Lambda e S3/CDN',
      'Contratos enterprise e customizados',
      '✅ Edge Functions nativo e sem egressos'
    ]
  },
  {
    label: 'Diferenciais chave',
    values: [
      'Sem egressos, mas operações caras',
      'Alta adoção, mas billing complexo',
      'Cobertura global com custo elevado',
      '✅ Preço previsível, billing unificado e alta performance'
    ]
  }
]

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/reduza-custos-cloud/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'Otimização de aplicações web',
      title: 'Reduza custos da sua aplicação web — não apenas da cloud',
      description:
        'Corte até 80% dos custos de cloud, tráfego e cache ao otimizar como sua aplicação consome infraestrutura. A Azion é indicada para empresas que já operam aplicações web, APIs ou plataformas digitais e precisam reduzir custos sem sacrificar performance ou segurança.',
      ...specialistForm('Faça da Redução de Custos o seu diferencial competitivo'),
      carouselMarks: []
    },
    {
      section: 'CapabilityGrid',
      eyebrow: 'NoOps',
      title: 'Otimize sua aplicação sem trocar seu stack',
      description:
        'A Azion opera na frente da sua aplicação, sem exigir migração total de cloud ou reescrita de código. Funciona com AWS, Google Cloud, Azure e ambientes híbridos, sem impor mudanças de linguagem ou framework, com integração simples via API, CLI ou interface gráfica.',
      items: [
        {
          icon: 'pi pi-check',
          title: 'Liberdade para desenvolvedores',
          description: 'Use o ecossistema de desenvolvimento de sua escolha.'
        },
        { icon: 'pi pi-check', title: 'Templates e bibliotecas pré-construídos', description: '' },
        {
          icon: 'pi pi-check',
          title: 'Programabilidade total',
          description:
            'Permite testes com dados reais, fácil integração de novas ideias e controle total via API, CLI ou UI.'
        }
      ]
    },
    {
      section: 'ArticleCards',
      title: 'Nossos clientes economizam no mínimo 30% ao migrar para Azion',
      items: [
        {
          key: 'pernambucanas',
          title:
            'Pernambucanas reduziu o volume de dados transferidos em média 70% por mês, economizando nos seus custos',
          meta: 'Varejo'
        },
        {
          key: 'unicesumar',
          href: `${CASES}unicesumar/`,
          external: true,
          title:
            'UniCesumar usa a Azion para inovar, reduzir custos e melhorar a experiência dos alunos com a plataforma de ensino a distância em 70%',
          meta: 'Educação'
        },
        {
          key: 'digimais',
          href: `${CASES}digimais/`,
          external: true,
          title:
            'Digimais aprimora segurança bancária digital com o Azion Edge Firewall, protegendo contra ataques DDoS, zero trust e SQL injection.',
          meta: 'Finança'
        }
      ]
    },
    {
      section: 'ComparePlans',
      plans: VENDORS,
      sections: [{ title: 'Comparativo Técnico', rows: COMPARISON_ROWS }],
      link: null,
      caption: 'Comparativo Técnico',
      columnLabel: 'Comparátivo Técnico',
      pickerLabel: 'Fornecedor comparado'
    },
    {
      section: 'RecognitionMarquee',
      eyebrow: 'RECONHECIMENTO DE MERCADO',
      title: 'O que os analistas dizem sobre a Azion',
      ariaLabel: 'Reconhecimentos de analistas',
      items: [
        {
          tag: 'Reconhecimento',
          text: 'A Azion foi nomeada Líder em CDN e Alto Desempenho em 6 categorias de segurança no G2 Winter 2026 Reports.',
          name: 'G2 Winter 2026 Reports',
          jobTitle: '',
          firm: FIRMS.g2,
          action: article('Leia o artigo', 'azion-lider-g2-winter-reports-2026')
        },
        {
          tag: 'Reconhecimento',
          text: 'A Azion foi nomeada Líder e identificada como a única plataforma construída especificamente para Edge Computing cujas capacidades atendem todos os critérios-chave descritos no relatório.',
          name: 'Radar GigaOms para Plataformas de Edge.',
          jobTitle: '',
          firm: FIRMS.gigaom,
          action: article('Ler artigo', 'azion-reconhecida-lider-de-mercado-fast-mover-relatorio-gigaom')
        },
        {
          tag: 'Reconhecimento',
          text: 'Clientes da Gartner afirmam que a Azion se destaca por oferecer uma abordagem consultiva para orquestração e ambientes de aplicação de Edge Computing.',
          name: 'Panorama Competitivo da Gartner para CDN e Serviços de Edge Computing.',
          jobTitle: '',
          firm: FIRMS.gartner,
          action: article('Ler artigo', 'azion-celebra-conquistas-2023')
        },
        {
          tag: 'Reconhecimento',
          text: 'A plataforma de Edge Computing da Azion é destacada por aumentar a agilidade dos negócios, capacitando desenvolvedores a construir e escalar suas aplicações.',
          name: 'Prêmio de Melhores Práticas da Frost & Sullivan, Norte.',
          jobTitle: '',
          firm: FIRMS.frost,
          action: article('Ler artigo', 'azion-premio-frost-sullivan')
        }
      ]
    },
    {
      section: 'CapabilityGrid',
      title: 'Confiança construída com as certificações mais rigorosas do mercado',
      description:
        'A Azion adere a rigorosos padrões de segurança, disponibilidade e privacidade para que os clientes possam adotar nossos serviços com confiança.',
      actions: [
        { label: 'Ver todas certificações', href: '/site/compliance', kind: 'outlined', trailing: true }
      ],
      items: [
        {
          title: 'PCI DSS 4.0',
          description: 'Certificação PCI DSS 4.0 obtida em seu ano de lançamento, 2023'
        },
        {
          title: 'SOC 2 Type II',
          description:
            'Segurança e disponibilidade para o processamento de dados próximo aos usuários finais em toda a rede da Azion'
        },
        {
          title: 'SOC 3',
          description: 'O relatório SOC 3 certifica publicamente nossa segurança corporativa'
        }
      ]
    },
    { section: 'ClosingCallToAction', kind: 'frame' }
  ]
} satisfies LandingPage
