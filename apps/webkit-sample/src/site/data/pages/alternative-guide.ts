import type { PageSection } from '../../ui/sections'
import { type AlternativeGuide, TRUST_MARKS } from '../alternative-guides'

const CONTACT = { label: 'Fale com um especialista', href: '/site/contact' }

export const alternativeGuidePage = (guide: AlternativeGuide): PageSection[] => [
  {
    section: 'Heroes',
    kind: 'copy-beside-art',
    eyebrow: guide.hero.eyebrow,
    eyebrowPrefix: '//',
    title: guide.hero.title,
    description: guide.hero.description,
    actions: [{ ...CONTACT, kind: 'secondary' }],
    art: guide.hero.art
      ? {
          name: guide.hero.art,
          alt: `A marca da Azion e a marca da ${guide.rival}, uma sobre a outra`
        }
      : null,
    carouselLabel: 'Empresas confiam',
    carouselMarks: TRUST_MARKS
  },
  { section: 'CapabilityGrid', title: guide.why, items: guide.reasons },
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
    section: 'CompareCompetitors',
    eyebrow: 'Comparação',
    title: guide.comparison,
    rival: guide.rival,
    rows: guide.capabilities,
    caption: guide.comparison,
    columnLabel: '',
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
    illustrationLabel: guide.mapping.illustrationLabel,
    actions: [{ ...guide.mapping.action, external: true }]
  },
  { section: 'FaqSection', title: 'Perguntas Frequentes', items: guide.faq },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    title: 'Construa, execute e proteja aplicações',
    titleMuted: 'em qualquer lugar.',
    description:
      'Tenha lançamentos mais rápidos, menor latência e menos infraestrutura para gerenciar desde o primeiro dia.',
    actions: [{ label: 'Comece grátis', href: '/signup', kind: 'secondary' }],
    aside: CONTACT
  }
]
