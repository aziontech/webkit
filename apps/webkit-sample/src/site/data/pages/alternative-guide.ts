import type { PageSection } from '../../ui/sections'
import { type AlternativeGuide, TRUST_MARKS } from '../alternative-guides'

export const alternativeGuidePage = (guide: AlternativeGuide): PageSection[] => [
  {
    section: 'Heroes',
    kind: 'copy-beside-art',
    eyebrow: guide.hero.eyebrow,
    eyebrowPrefix: '//',
    title: guide.hero.title,
    description: guide.hero.description,
    actions: [
      { label: 'Comece Grátis', href: '/signup', kind: 'secondary' },
      { label: 'Fale com um especialista', href: '#contact', kind: 'outlined', trailing: true }
    ],
    art: {
      name: guide.hero.art,
      alt: `A marca da Azion e a marca da ${guide.rival}, uma sobre a outra`
    },
    carouselLabel: 'Empresas confiam',
    carouselMarks: TRUST_MARKS
  },
  { section: 'CapabilityGrid', items: guide.reasons },
  {
    section: 'ClientQuotes',
    quotes: guide.quotes,
    ariaLabel: 'Histórias de clientes',
    actions: [
      {
        label: 'Ver casos de sucesso',
        href: '/site/success-cases',
        kind: 'secondary',
        trailing: true
      }
    ]
  },
  {
    section: 'ComparisonTable',
    eyebrow: guide.comparison.eyebrow,
    title: guide.comparison.title,
    rival: guide.rival,
    rows: guide.capabilities,
    caption: `Comparação de capacidades entre a Azion e a ${guide.rival}.`,
    columnLabel: 'Capacidade',
    supportLabels: {
      full: 'Suporte completo',
      partial: 'Suporte parcial',
      none: 'Não disponível'
    }
  },
  {
    section: 'MediaSplitBand',
    title: guide.mapping.title,
    description: guide.mapping.description,
    illustration: 'build-applications',
    actions: [{ label: 'Ver o guia', href: '/site/docs' }]
  },
  { section: 'FaqSection', title: 'Perguntas Frequentes', items: guide.faq },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: 'Secure',
    title: 'Proteção nativa.',
    titleMuted: 'Sempre ativa.',
    description:
      'Ganhe proteção mais forte, menos exposição a ataques e menos sobrecarga operacional.',
    actions: [{ label: 'Comece Grátis', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Fale com nosso time', href: '/site/contact' }
  }
]
