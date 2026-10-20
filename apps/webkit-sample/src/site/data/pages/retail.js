import { PRODUCT_STACK, RETAIL_CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { BUILD_CTA, quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Retail',
  title: 'Shopping experiences that convert',
  description:
    'Deploy fast, secure storefronts on distributed infrastructure designed for high-stakes retail experiences. Handle peak events, prevent fraud, and lower cloud costs without overprovisioning.',
  carouselMarks: RETAIL_CLIENT_STRIP
}

const CAPABILITIES = [
  {
    icon: 'pi pi-bolt',
    title: 'Speed that converts',
    description:
      'Deliver fast storefront experiences with consistent page speed and Core Web Vitals, lifting conversion, SEO visibility, and average order value across web and mobile.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Built for peak season',
    description:
      'Stay online during Black Friday, Cyber Monday, and flash sales with automatic scaling and a distributed architecture that absorbs traffic surges without overprovisioning.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Security built in',
    description:
      'Protect transactions, customer data, and storefront availability with DDoS mitigation, WAF, and zero trust controls integrated into the same distributed architecture.'
  },
  {
    icon: 'pi pi-lock',
    title: 'Fraud and bots blocked',
    description:
      'Block bots, scraping, credential stuffing, account takeover, and payment fraud with bot management and application security applied before requests reach your origin.'
  },
  {
    icon: 'pi pi-sparkles',
    title: 'AI-powered personalization',
    description:
      'Deliver tailored recommendations, search, and content with AI Inference and Functions executed at request time, improving conversion without round-tripping to centralized origins.'
  },
  {
    icon: 'pi pi-credit-card',
    title: 'Lower costs at scale',
    description:
      'Offload origin traffic, optimize images, and serve cached responses from a distributed architecture to cut cloud, egress, and CDN costs while scaling automatically with demand.'
  }
]

const USE_CASES = {
  eyebrow: 'Ship It',
  title: 'Everything You Need to Build and Deploy',
  items: [
    {
      eyebrow: 'Preview',
      illustration: 'preview',
      alt: 'Application deployment workflow with preview and production environments',
      title: 'Automatic Preview Deployments',
      description:
        'Validate every change in preview environments before going live, so campaigns, content, and product updates ship with confidence.'
    },
    {
      eyebrow: 'Runtime',
      illustration: 'runtime',
      alt: 'Distributed V8 runtime with zero cold starts handling retail traffic spikes',
      title: 'Cost-Efficient Infrastructure',
      description:
        'Run Functions on V8 isolates with zero cold starts and consistent performance during traffic spikes.'
    },
    {
      eyebrow: 'Infrastructure as Code',
      illustration: 'infrastructure-as-code',
      alt: 'Infrastructure as code workflow versioning workloads, cache, and security across retail environments',
      title: 'Manage Resources with Application Code',
      description:
        'Use Terraform and code-based configuration to keep workloads, cache, and security rules versioned and consistent across regions and brands.'
    },
    {
      eyebrow: 'Live Debugging',
      illustration: 'live-debugging',
      alt: 'Application observability and rule execution visibility',
      title: 'Observability Built-In for All Requests',
      description:
        'Trace requests in production with Debug Rules, Real-Time Events, and stack traces to resolve issues fast during revenue-critical moments.'
    }
  ]
}

const STACK = { label: 'Compatible with Your Stack', marks: PRODUCT_STACK }

const TEMPLATES_DESCRIPTION =
  'Launch storefronts faster with pre-built templates and starter kits for headless commerce, marketing pages, and product catalogs. Deploy complete projects in seconds with popular frameworks.'

const ARCHITECTURE = {
  title: 'Accelerate retail application modernization with a distributed architecture',
  illustration: 'retail-application-modernization',
  alt: 'Retail web application modernization architecture diagram',
  href: 'https://www.azion.com/en/documentation/architectures/edge-application/application-modernization/'
}

const QUOTES = quotesLedBy(
  'dafiti',
  "One of the best CDN and WAF solutions I've ever used. Easy to implement and integrate, with speed and low latency that make a real difference for our customers."
)

const FAQ = [
  {
    value: 'q1',
    question: 'What types of storefronts can I build and deploy on Azion?',
    answer:
      'You can build and deploy storefronts, marketplaces, marketing campaign pages, and supporting retail apps, but in fact any web app or website runs on Azion. The platform also provides the primitives to build not only the storefront but much of the backend, with support for static and dynamic workloads on a distributed architecture.'
  },
  {
    value: 'q2',
    question: 'Which frameworks are compatible?',
    answer:
      'Azion is compatible with modern frameworks such as Next.js, React, Vue, Astro, Angular, Nuxt, Svelte, and others, so you can reuse your current stack without a full rewrite. See the full ',
    link: {
      label: 'frameworks compatibility list',
      href: 'https://www.azion.com/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/'
    },
    answerAfter: '.'
  },
  {
    value: 'q3',
    question: 'How do preview deployments work?',
    answer:
      'You can validate storefront changes in preview environments before release, share results across teams, and promote approved versions to production with a controlled workflow.'
  },
  {
    value: 'q4',
    question: 'Can I personalize pages without hurting performance?',
    answer:
      'Yes. You can run request-time logic for personalization by route, headers, cookies, and geography while maintaining fast page delivery through integrated caching and runtime controls.'
  },
  {
    value: 'q5',
    question: 'Can I integrate my existing commerce platform, CMS, and APIs?',
    answer:
      'Yes. Azion integrates with modern headless commerce, CMS, and API-based architectures, enabling teams to keep existing workflows while improving performance and reliability.'
  },
  {
    value: 'q6',
    question: 'How does Azion help with SEO and Core Web Vitals?',
    answer:
      'By reducing latency, optimizing content delivery, and improving responsiveness, Azion helps improve user experience signals that affect Core Web Vitals and search performance.'
  },
  {
    value: 'q7',
    question: 'What happens during peak shopping events like Black Friday?',
    answer:
      'Scaling is automatic. Azion handles traffic surges without manual provisioning, helping teams maintain availability and performance during launches, campaigns, and seasonal peaks.'
  },
  {
    value: 'q8',
    question: 'Can I migrate gradually from my current cloud or CDN setup?',
    answer:
      'Yes. You can modernize incrementally by routing selected paths and workloads through Azion first, then expanding over time without disrupting your existing storefronts.'
  },
  {
    value: 'q9',
    question: 'Is Azion ready for enterprise compliance requirements?',
    answer:
      'Yes. Azion supports enterprise requirements with certifications such as SOC 2 Type 2, SOC 3, and PCI DSS, in addition to privacy commitments aligned with major regulations.'
  },
  {
    value: 'q10',
    question: 'How do I get started quickly?',
    answer:
      'Start with the Azion CLI and templates. A simple workflow like `azion init`, `azion build`, and `azion deploy` takes your storefront from a local project to global deployment.'
  }
]

export const RETAIL_PAGE = solutionPage({
  hero: HERO,
  capabilities: CAPABILITIES,
  useCases: USE_CASES,
  stack: STACK,
  templatesDescription: TEMPLATES_DESCRIPTION,
  architecture: ARCHITECTURE,
  quotes: QUOTES,
  compliance: true,
  primitivesEyebrow: 'Built for Speed',
  primitivesTitle: 'Composable Primitives for Performance and Personalization',
  faq: FAQ,
  cta: BUILD_CTA
})
