import { FAQ, PRICING_REASONS, PRIMITIVE_GROUPS } from '../pricing.js'

export const PRICING_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    eyebrow: 'Pricing',
    title: 'Infrastructure without the waste',
    description:
      'Azion was built differently from the ground up — distributed by design, extremely fast, and ready for the strictest compliance. No idle clusters, no capacity provisioned just in case. Scale from zero to mission-critical instantly and pay only for what you use.'
  },
  { section: 'PricingPlans' },
  {
    section: 'FeatureTiles',
    kind: 'illustrated',
    tiles: PRICING_REASONS.map(({ illustration, scale, title, description }) => ({
      illustration,
      scale,
      title,
      description
    }))
  },
  { section: 'ComparePlans' },
  {
    section: 'PlatformDirectory',
    eyebrow: 'Platform primitives',
    title: 'Serverless AI-Native Primitives',
    description:
      'Enterprise-grade reliability, security and performance, without requiring specialized operational expertise.',
    ariaLabel: 'Platform primitives',
    groups: PRIMITIVE_GROUPS
  },
  { section: 'FaqSection', items: FAQ },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: 'Build',
    title: 'Build once.',
    titleMuted: 'Run anywhere.',
    description: 'Get a faster path to launch, less latency, and less infrastructure overhead.',
    actions: [{ label: 'Start for free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
