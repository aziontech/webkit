import { BLOG_FEATURED } from '../blog.js'
import { AI_INFERENCE_PAGE } from './ai-inference.js'
import { APPLICATION_ACCELERATOR_PAGE } from './application-accelerator.js'
import { APPLICATIONS_PAGE } from './applications.js'
import { BLOG_PAGE } from './blog.js'
import { blogPostPage } from './blog-post.js'
import { CACHE_PAGE } from './cache.js'
import { CAREERS_HOME_PAGE } from './careers-home.js'
import { CONTACT_PAGE } from './contact.js'
import { FINANCIAL_SERVICES_PAGE } from './financial-services.js'
import { FUNCTIONS_PAGE } from './functions.js'
import { HOME_PAGE } from './home.js'
import { LEARNING_PAGE } from './learning.js'
import { PRICING_PAGE } from './pricing.js'
import { PRODUCTS_PAGE } from './products.js'
import { SOLUTIONS_PAGE } from './solutions.js'
import { SUCCESS_CASES_PAGE } from './success-cases.js'
import { SUPPORT_PAGE } from './support.js'
import { VERCEL_ALTERNATIVE_PAGE } from './vercel-alternative.js'
import { WORKLOADS_PAGE } from './workloads.js'

const pick = (page, section) => {
  const entry = page.find((candidate) => candidate.section === section)
  if (!entry) throw new Error(`website-bundle: no "${section}" section on the source page.`)
  const { gap: _gap, ...rest } = entry
  return rest
}

const BLOG_POST_PAGE = blogPostPage(BLOG_FEATURED.key)

const ARCHITECTURE = {
  section: 'Architectures',
  eyebrow: 'Architecture',
  title: 'One platform for API and AI traffic',
  description:
    'Agents, apps and workflows reach models, tools and APIs through the same gateway, so every call is authenticated, routed and observed in one place.',
  action: {
    label: 'See the architecture',
    href: '/site/docs/ai-inference',
    kind: 'secondary',
    trailing: true
  },
  levels: [
    [
      { icon: 'pi pi-sitemap', role: 'Workflow', title: 'Order pipeline', detail: 'Nightly batch' },
      { icon: 'pi pi-comments', role: 'AI app', title: 'Support chat', detail: 'Web and mobile' },
      { icon: 'pi pi-android', role: 'Agent', title: 'Code reviewer', detail: 'MCP client' }
    ],
    [
      {
        icon: 'pi pi-shield',
        role: 'AI Gateway',
        title: 'Routing and control',
        detail: 'Auth, cache, rate limit, logs',
        lit: true
      }
    ],
    [
      {
        icon: 'pi pi-sparkles',
        role: 'Model',
        title: 'Claude Opus 5.5',
        detail: 'Anthropic',
        tag: { label: 'Primary', severity: 'success' }
      },
      {
        icon: 'pi pi-sparkles',
        role: 'Model',
        title: 'GPT-5.5',
        detail: 'OpenAI',
        tag: { label: 'Fallback', severity: 'secondary' }
      },
      { icon: 'pi pi-wrench', role: 'MCP server', title: 'Internal tools', detail: 'Self-hosted' },
      { icon: 'pi pi-database', role: 'Database', title: 'Customer records', detail: 'Postgres' }
    ]
  ]
}

export const WEBSITE_BUNDLE_PAGE = [
  pick(HOME_PAGE, 'Heroes'),

  pick(FUNCTIONS_PAGE, 'ClientQuotes'),
  pick(APPLICATIONS_PAGE, 'QuoteBand'),
  pick(SOLUTIONS_PAGE, 'LogoWallQuote'),
  pick(HOME_PAGE, 'RecognitionMarquee'),
  pick(HOME_PAGE, 'ClientMosaic'),
  pick(FINANCIAL_SERVICES_PAGE, 'ComplianceBadges'),

  pick(HOME_PAGE, 'NetworkSection'),
  pick(PRODUCTS_PAGE, 'StatsBand'),

  pick(HOME_PAGE, 'MediaSplitStack'),
  pick(WORKLOADS_PAGE, 'MediaSplitBand'),
  pick(CAREERS_HOME_PAGE, 'PhotoMarquee'),
  pick(HOME_PAGE, 'FeatureTiles'),
  pick(APPLICATION_ACCELERATOR_PAGE, 'CodeSplit'),
  pick(APPLICATIONS_PAGE, 'StickyScrollCode'),
  pick(WORKLOADS_PAGE, 'FeatureTabs'),
  pick(AI_INFERENCE_PAGE, 'TemplateGallery'),
  pick(FUNCTIONS_PAGE, 'WidgetGrid'),
  pick(WORKLOADS_PAGE, 'ConsolePanel'),

  ARCHITECTURE,
  pick(PRODUCTS_PAGE, 'CapabilityGrid'),
  pick(PRODUCTS_PAGE, 'PlatformDirectory'),
  pick(CACHE_PAGE, 'UseCases'),
  pick(FUNCTIONS_PAGE, 'IntegrationCode'),
  pick(FINANCIAL_SERVICES_PAGE, 'ResourceGrid'),
  pick(LEARNING_PAGE, 'SubjectLibrary'),
  pick(CAREERS_HOME_PAGE, 'ListingTable'),
  pick(SUCCESS_CASES_PAGE, 'ListingBrowser'),
  pick(VERCEL_ALTERNATIVE_PAGE, 'ComparisonTable'),
  pick(SUPPORT_PAGE, 'CompareSupportTiers'),
  pick(BLOG_PAGE, 'ArticleHighlight'),
  pick(BLOG_PAGE, 'ArticleIndex'),

  pick(PRICING_PAGE, 'PricingPlans'),
  pick(PRICING_PAGE, 'ComparePlans'),
  pick(PRICING_PAGE, 'FaqSection'),

  pick(CONTACT_PAGE, 'HeroForm'),

  pick(BLOG_POST_PAGE, 'ArticleBody'),
  pick(BLOG_POST_PAGE, 'ArticleCards'),
  pick(HOME_PAGE, 'ClosingCallToAction')
]
