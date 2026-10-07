import { BUILD_CLIENT_STRIP, PRODUCT_STACK } from '@shared/ui/brand/strips.js'

import { EARTH_NETWORK, quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Application Development',
  title: 'Build lightning-fast websites and web apps and launch globally',
  description:
    'Deploy serverless web applications, APIs, and AI workloads from your git repository with built-in performance, security, and scalability.',
  carouselMarks: BUILD_CLIENT_STRIP
}

const CAPABILITIES = [
  {
    icon: 'ai ai-edge-nodes',
    title: 'Consistent global speed',
    description:
      'Serve content and run web apps across hundreds of locations with median latency under 30 ms. No infra to manage.'
  },
  {
    icon: 'ai ai-load-balancer',
    title: 'Safer high-traffic launches',
    description:
      'Scale automatically from routine traffic to campaign spikes without cold starts, manual provisioning, or release-day bottlenecks.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Higher conversion potential',
    description:
      'Improve web app responsiveness and user experience with caching, protocol optimizations, and request-level control.'
  },
  {
    icon: 'pi pi-eye',
    title: 'Preview every release',
    description:
      'Validate web app changes in preview environments before production and reduce risk during content and campaign launches.'
  },
  {
    icon: 'pi pi-code',
    title: 'Compatible with your framework',
    description:
      'Deploy any modern framework or build tool to Azion, such as Next.js, React, Angular, Vue, Svelte, Astro, Nuxt, Remix, Qwik, and others.'
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Frontend and API logic together',
    description: 'Deploy your frontend and backend API as a single, simple project — in one deploy.'
  }
]

const USE_CASES = {
  title: 'The Full-Stack Platform for Modern Applications',
  items: [
    {
      illustration: 'build-applications',
      title: 'Websites',
      description:
        'Build and deploy websites and web apps without infrastructure management overhead. Deliver fast, reliable experiences through a global network.',
      action: 'See more',
      href: 'https://www.azion.com/en/solutions/websites/'
    },
    {
      illustration: 'distributed-apis',
      title: 'APIs',
      description:
        'Build serverless APIs and microservices with distributed execution. Scale globally without managing region-by-region infrastructure.',
      action: 'See more',
      href: 'https://www.azion.com/en/solutions/distributed-web-applications-and-apis/'
    },
    {
      illustration: 'saas-platforms',
      title: 'E-commerce',
      description:
        'Build secure storefronts that protect checkout and account flows while maintaining fast, reliable experiences under peak traffic.',
      action: 'See more',
      href: '/site/solutions/retail'
    },
    {
      illustration: 'ai-applications',
      title: 'AI Apps',
      description:
        'Build AI-powered applications with serverless inference and your own agents, running on GPUs across hundreds of locations — with no infrastructure to manage.',
      action: 'See more',
      href: '/site/solutions/ai'
    }
  ]
}

const STACK = { label: 'Compatible with Your Stack', marks: PRODUCT_STACK }

const FAQ = [
  {
    value: 'q1',
    question: 'What can I build on Azion?',
    answer:
      "You can build web applications, APIs, AI-powered experiences, and other modern workloads on Azion's globally distributed platform. Start with Applications, then extend performance and specialized capabilities with Cache, Application Accelerator, AI Inference, and Image Processor as your architecture evolves."
  },
  {
    value: 'q2',
    question: 'Does it have cold starts?',
    answer:
      'Azion Runtime is designed for zero cold starts and fast execution, so applications can respond with low latency even under heavy demand.'
  },
  {
    value: 'q3',
    question: 'Does it scale?',
    answer:
      'Scaling is built in by default, allowing your application to handle traffic growth and spikes without pre-provisioning infrastructure.'
  },
  {
    value: 'q4',
    question: 'Do I need to choose regions or manage infrastructure?',
    answer:
      "No. Your applications are distributed automatically across 100+ locations, so you don't have to pick regions, provision servers, or manage scaling manually. You focus on the application logic while Azion handles distribution close to your users."
  },
  {
    value: 'q5',
    question: 'What languages and frameworks can I use?',
    answer:
      'You can code with JavaScript or use WebAssembly with languages like Rust, C, C++, C#, Go, Java, Kotlin, Swift, Python, Ruby, and more. Azion also supports frameworks like Next.js, Astro, React, Vue, Angular, Nuxt, Svelte, Qwik, Preact, VitePress, Docusaurus, Eleventy, Gatsby, Hexo, Hono, Hugo, Jekyll, VuePress, and more.'
  },
  {
    value: 'q6',
    question: 'How do I deploy an application?',
    answer:
      'You can create, build, and deploy with the Azion CLI using a simple workflow like `azion init`, `azion build`, and `azion deploy`. This takes your application from local development to a globally distributed deployment without separate CDN or infrastructure setup.'
  },
  {
    value: 'q7',
    question: 'Can I combine Functions, Cache, AI, and image optimization in the same application?',
    answer:
      "Yes. That's one of the main advantages of the platform. Functions can work alongside Cache, Application Accelerator, AI Inference, and Image Processor in the same architecture, so you can add logic, improve performance, and deliver optimized assets without stitching together separate vendors or services."
  },
  {
    value: 'q8',
    question: 'Can Azion help with dynamic and personalized applications, not just static content?',
    answer:
      'Yes. Azion Build supports dynamic workloads with features like advanced cache keys, POST caching, request hashing, real-time TTL validation, and route-based logic through Rules Engine. This helps accelerate personalized pages, APIs, and session-aware experiences without breaking application behavior.'
  },
  {
    value: 'q9',
    question: 'How do I preview changes before promoting them to production?',
    answer:
      'Azion supports workflows designed for iteration, including preview environments and controlled promotion to production. This lets teams validate changes safely, review behavior before release, and keep deployments traceable from code change to live application.'
  },
  {
    value: 'q10',
    question: 'How do I debug and monitor my application in production?',
    answer:
      'You can inspect live behavior with Debug Rules, Real-Time Events, GraphQL-powered metrics, Data Stream, and stack trace visibility. These tools help you understand how requests are processed, trace execution paths, and troubleshoot distributed applications with more confidence.'
  },
  {
    value: 'q11',
    question: 'Can I start free and expand later?',
    answer:
      'Yes. You can begin with a free single Function or application and add more capabilities as your needs grow. The platform is designed as connected building blocks, so you can progressively introduce caching, acceleration, AI features, observability, and media processing without rebuilding your architecture.'
  }
]

const CTA = {
  eyebrow: 'Build',
  title: 'Build once.',
  titleMuted: 'Run everywhere.',
  description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.'
}

export const WEB_APPS_PAGE = solutionPage({
  hero: HERO,
  capabilities: CAPABILITIES,
  useCases: USE_CASES,
  stack: STACK,
  quotes: quotesLedBy('herospark'),
  primitivesTitle: 'All the Development Primitives You Need',
  network: EARTH_NETWORK,
  faq: FAQ,
  cta: CTA
})
