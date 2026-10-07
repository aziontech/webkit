import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

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
      : { label: 'Read Docs', href: DOCS, trailing: true }
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
    cta
  } = data

  return [
    {
      section: 'Heroes',
      kind: 'centered-carousel',
      eyebrow: hero.eyebrow,
      eyebrowPrefix: '//',
      title: hero.title,
      description: hero.description,
      actions: [
        { label: 'Start Free', href: '/signup', kind: 'secondary' },
        { label: 'Talk to a Specialist', href: '#contact', kind: 'outlined', trailing: true }
      ],
      carouselMarks: hero.carouselMarks ?? CLIENT_STRIP
    },
    { section: 'CapabilityGrid', items: capabilities },
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
      kind: 'architecture',
      title: architecture.title,
      illustration: architecture.illustration,
      illustrationLabel: architecture.alt,
      actions: [{ label: 'Docs', href: architecture.href, trailing: true, external: true }]
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
      lead: network.lead,
      claims: network.claims,
      outcomes: NETWORK_OUTCOMES
    },
    faq && { section: 'FaqSection', items: faq },
    {
      section: 'ClosingCallToAction',
      kind: 'split',
      eyebrow: cta.eyebrow,
      title: cta.title,
      titleMuted: cta.titleMuted,
      description: cta.description,
      actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
      aside: { label: 'Talk to our team', href: '/site/contact' }
    }
  ].filter(Boolean)
}
