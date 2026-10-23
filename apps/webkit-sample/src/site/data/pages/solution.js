import { agentsClosing, salesClosing } from '../product-pages.js'
import { NETWORK_OUTCOMES } from '../solutions.js'

const DOCS = '/site/docs'

const useCaseBand = (useCase) => ({
  eyebrow: useCase.eyebrow,
  title: useCase.title,
  description: useCase.description,
  href: useCase.href ?? DOCS,
  illustration: useCase.illustration,
  illustrationLabel: useCase.alt,
  actions: [
    useCase.href
      ? { label: useCase.action, href: useCase.href, trailing: true }
      : { label: 'Docs', href: DOCS, trailing: true }
  ]
})

export function solutionPage(data) {
  const {
    hero,
    capabilities,
    useCases,
    stack,
    templatesDescription,
    architecture,
    quotes,
    resources,
    compliance,
    primitivesEyebrow = 'Complete, not complex',
    primitivesTitle,
    network,
    faq,
    cta,
    agents = false
  } = data

  return [
    {
      section: 'HeroWithOpening',
      eyebrow: hero.eyebrow,
      title: hero.title,
      description: hero.description,
      actions: [
        { label: 'Start for free', href: '/signup', kind: 'secondary' },
        {
          label: 'Talk to a specialist',
          href: agents ? '/site/contact' : '#contact',
          kind: 'outlined',
          trailing: true
        }
      ],
      items: capabilities
    },
    useCases && {
      section: 'MediaSplitStack',
      kind: 'solutions',
      eyebrow: useCases.eyebrow ?? 'Use Cases',
      title: useCases.title,
      bands: useCases.items.map(useCaseBand)
    },
    stack && {
      section: 'TemplateGallery',
      ...(templatesDescription ? { description: templatesDescription } : {}),
      stackLabel: stack.label,
      stackMarks: stack.marks
    },
    architecture && {
      section: 'MediaSplitBand',
      title: architecture.title,
      illustration: architecture.illustration,
      illustrationLabel: architecture.alt,
      actions: [{ label: 'Docs', href: architecture.href, external: true }]
    },
    quotes && { section: 'ClientQuotes', quotes },
    resources && {
      section: 'ResourceGrid',
      ...(resources.eyebrow ? { eyebrow: resources.eyebrow } : {}),
      title: resources.title,
      description: resources.description,
      items: resources.items
    },
    compliance && { section: 'ComplianceBadges' },
    {
      section: 'PlatformDirectory',
      eyebrow: primitivesEyebrow,
      title: primitivesTitle
    },
    network && {
      section: 'NetworkSection',
      eyebrow: network.eyebrow,
      title: network.title,
      titleTail: network.titleTail,
      lead: network.lead,
      claims: network.claims,
      outcomes: NETWORK_OUTCOMES
    },
    faq && { section: 'FaqSection', items: faq },
    agents ? agentsClosing(`${cta.title} ${cta.titleMuted}`) : salesClosing(cta)
  ].filter(Boolean)
}
