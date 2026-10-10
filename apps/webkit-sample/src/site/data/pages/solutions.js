import { BANKS_AND_RETAIL_WALL } from '../proof-wall.js'
import { quotesLedBy } from '../solutions.js'

const ZOOP = BANKS_AND_RETAIL_WALL.find((item) => item.alt === 'Zoop')
const [ZOOP_QUOTE] = quotesLedBy('zoop')

const SOLUTION_GUARANTEES = [
  {
    title: 'One platform, every workload',
    description:
      'A solution is the same products configured for one reader — not a separate stack, a separate bill or a separate team.'
  },
  {
    title: 'Proven where it is hardest',
    description:
      'Each page carries the clients already running it in production, with the numbers they measured.'
  },
  {
    title: 'Live in an afternoon',
    description:
      'Templates, a CLI and a Terraform provider, so the architecture on the page is the one you deploy.'
  }
]

const SOLUTION_NEEDS = [
  {
    illustration: 'modern-frontends',
    title: 'Web Apps',
    description:
      'Deploy serverless web applications, APIs and AI workloads straight from a git repository.',
    href: '/site/solutions/web-apps'
  },
  {
    illustration: 'ai-applications',
    title: 'AI',
    description: 'Run inference and agents next to the data they answer from.',
    href: '/site/solutions/ai'
  },
  {
    illustration: 'implement-api-gateway-security',
    title: 'Application Security',
    description: 'Filter, rate-limit and authenticate at the edge, before the origin sees it.',
    href: '/site/solutions/security'
  }
]

const SOLUTION_INDUSTRIES = [
  {
    illustration: 'protect-financial-applications',
    title: 'Financial Services',
    description:
      'High availability, low latency and continuous compliance for financial applications and APIs.',
    href: '/site/solutions/financial-services'
  },
  {
    illustration: 'saas-platforms',
    title: 'Technology',
    description:
      'High-performance APIs and microservices for the team building the digital product.',
    href: '/site/solutions/technology'
  },
  {
    illustration: 'retail-application-modernization',
    title: 'Retail',
    description:
      'Storefronts that hold up through a peak event, with fraud stopped before checkout.',
    href: '/site/solutions/retail'
  }
]

const SOLUTION_DIRECTORY = [
  {
    label: 'By Need',
    items: [
      {
        icon: 'ai ai-edge-application',
        title: 'Web Apps',
        description: 'Websites, APIs, e-commerce and AI apps',
        href: '/site/solutions/web-apps'
      },
      {
        icon: 'pi pi-bolt',
        title: 'Performance',
        description: 'Faster, always-on delivery',
        href: '/site/solutions/performance'
      },
      {
        icon: 'ai ai-edge-ai',
        title: 'AI',
        description: 'Inference and agents at the edge',
        href: '/site/solutions/ai'
      },
      {
        icon: 'ai ai-waf-rules',
        title: 'Application Security',
        description: 'WAF, bot management and API protection',
        href: '/site/solutions/security'
      },
      {
        icon: 'pi pi-video',
        title: 'Streaming',
        description: 'Low-latency video and live streams',
        href: '/site/solutions/streaming'
      }
    ]
  },
  {
    label: 'By Industries',
    items: [
      {
        icon: 'pi pi-building-columns',
        title: 'Financial Services',
        description: 'Banks, fintechs and payment platforms',
        href: '/site/solutions/financial-services'
      },
      {
        icon: 'pi pi-microchip',
        title: 'Technology',
        description: 'SaaS platforms and digital products',
        href: '/site/solutions/technology'
      },
      {
        icon: 'pi pi-shopping-cart',
        title: 'Retail',
        description: 'Storefronts, marketplaces and peak events',
        href: '/site/solutions/retail'
      }
    ]
  },
  {
    label: 'Migrating',
    items: [
      {
        icon: 'pi pi-arrow-right-arrow-left',
        title: 'Vercel alternative',
        description: 'What maps onto what, feature by feature',
        href: '/site/guides/vercel-alternative'
      },
      {
        icon: 'ai ai-azion-cli',
        title: 'Every product',
        description: 'The catalogue behind all of these',
        href: '/site/products'
      }
    ]
  },
  {
    label: 'Proof',
    items: [
      {
        icon: 'pi pi-star',
        title: 'Success cases',
        description: '35 stories, filtered by industry and product',
        href: '/site/success-cases'
      },
      {
        icon: 'ai ai-medium',
        title: 'Learning',
        description: '78 articles on how the platform works',
        href: '/site/learning'
      }
    ]
  }
]

export const SOLUTIONS_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    eyebrow: 'Solutions',
    highlight: 'The platform,',
    title: 'argued for your case',
    description:
      'The same products, configured for what you are building and the sector you build it in — with the clients already running it and the numbers they measured.',
    actions: [
      { label: 'Start Free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to our team', href: '/site/contact', kind: 'outlined', trailing: true }
    ]
  },
  { section: 'CapabilityGrid', items: SOLUTION_GUARANTEES },
  {
    section: 'FeatureTiles',
    kind: 'illustrated',
    anchor: 'needs',
    eyebrow: 'By need',
    title: 'What you are building',
    description: 'The argument is the workload — the same one whatever sector runs it.',
    tiles: SOLUTION_NEEDS
  },
  {
    section: 'FeatureTiles',
    kind: 'illustrated',
    anchor: 'industries',
    eyebrow: 'By industries',
    title: 'Where you build it',
    description: 'Same platform, stated in the terms the sector is audited on.',
    tiles: SOLUTION_INDUSTRIES
  },
  {
    section: 'LogoWallQuote',
    eyebrow: 'Trusted by Industry Leaders',
    title: "Battle-Tested by the World's Largest Banks and E-commerce Companies",
    items: BANKS_AND_RETAIL_WALL,
    ariaLabel: 'Banks and e-commerce companies running on Azion',
    quote: {
      text: `"${ZOOP_QUOTE.text}"`,
      name: ZOOP_QUOTE.name,
      jobTitle: ZOOP_QUOTE.jobTitle,
      client: ZOOP.client
    },
    actions: [
      {
        label: 'View success story',
        href: ZOOP.href,
        kind: 'secondary',
        trailing: true,
        external: true
      }
    ]
  },
  {
    section: 'PlatformDirectory',
    eyebrow: 'Go straight there',
    title: 'Every solution, one list',
    ariaLabel: 'Solution index',
    groups: SOLUTION_DIRECTORY
  },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: 'Build',
    title: 'Build once.',
    titleMuted: 'Run everywhere.',
    description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
    actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
