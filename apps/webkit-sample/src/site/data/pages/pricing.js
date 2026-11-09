import { FAQ, PRICING_REASONS, PRIMITIVE_GROUPS } from '../pricing.js'
import { salesClosing } from '../product-pages.js'
import { BUILD_CTA } from '../solutions.js'

export const PRICING_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    eyebrow: 'Pricing',
    title: 'Infrastructure without the waste',
    description:
      'Azion is distributed by design and built for strict compliance requirements. No idle clusters, no capacity provisioned just in case. Scale from zero to peak without cold starts, and pay only for what you use.'
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
    eyebrow: 'Platform building blocks',
    title: 'Build, store, and secure in one platform',
    description:
      'Enterprise-grade security and performance, without needing a specialized operations team.',
    ariaLabel: 'Platform building blocks',
    groups: PRIMITIVE_GROUPS
  },
  { section: 'FaqSection', items: FAQ },
  salesClosing(BUILD_CTA)
]
