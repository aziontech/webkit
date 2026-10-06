import { FRAMEWORKS, markFilterFor, templateSlugForTech } from './frameworks'

const authored = {
  'azion-proxy': {
    slug: 'azion-proxy',
    title: 'Azion Proxy',
    description: 'Front an origin you already run. Azion receives the traffic and passes it on.',
    vendor: 'Azion',
    framework: 'javascript',
    useCases: ['delivery'],
    icon: 'ai ai-edge-connectors',
    repoOwner: 'aziontech',
    repoPath: 'templates/proxy',
    defaultRepoName: 'azion-proxy',
    requiresRepository: false,
    requiresBuild: false,
    settings: [
      {
        name: 'originAddress',
        label: 'Origin address',
        placeholder: 'origin.example.com',
        description: 'The host Azion forwards requests to. A hostname or an IP address.',
        required: true
      },
      {
        name: 'hostHeader',
        label: 'Host header',
        placeholder: '${host}',
        description: 'Sent to the origin on every request. Leave the default to pass yours through.'
      },
      {
        name: 'originPath',
        label: 'Origin path',
        placeholder: '/',
        description: 'Prefixed to the path of every forwarded request.'
      }
    ]
  },

  'azion-static-site': {
    slug: 'azion-static-site',
    title: 'Azion Static Site',
    description: 'Publish a folder of built files and serve it from Azion.',
    vendor: 'Azion',
    framework: 'javascript',
    useCases: ['marketing', 'blog'],
    icon: 'ai ai-edge-storage',
    repoOwner: 'aziontech',
    repoPath: 'templates/static-site',
    defaultRepoName: 'azion-static-site',
    requiresRepository: false,
    requiresBuild: false,
    settings: [
      {
        name: 'outputDirectory',
        label: 'Output directory',
        placeholder: 'dist',
        description: 'The folder your build writes to. Its contents become the site.',
        required: true
      },
      {
        name: 'indexDocument',
        label: 'Index document',
        placeholder: 'index.html',
        description: 'Served when a request resolves to a directory.'
      }
    ]
  },

  'nuxt-ecommerce': {
    slug: 'nuxt-ecommerce',
    title: 'Nuxt E-commerce',
    description: 'Launch a Nuxt e-commerce or content app on the edge.',
    framework: 'nuxt',
    useCases: ['ecommerce'],
    repoOwner: 'aziontech',
    repoPath: 'templates/nuxt-ecommerce',
    defaultRepoName: 'nuxt-ecommerce',
    settings: [
      {
        name: 'shopifyAccessToken',
        label: 'Shopify Access Token',
        placeholder: 'Access Token',
        description: 'You can find this token in Credentials on Shopify Project Configurations.',
        required: true
      },
      {
        name: 'shopifyRevalidationSecret',
        label: 'Shopify revalidation secret',
        placeholder: 'Revalidation secret',
        description: 'You can find this secret in Credentials on Shopify Project Configurations.'
      },
      {
        name: 'shopifyStoreDomain',
        label: 'Shopify Store Domain',
        placeholder: 'https://your-shopify-store-subdomain.myshopify.com',
        description: 'Your Shopify Store Domain'
      }
    ]
  },

  'turso-starter': {
    slug: 'turso-starter',
    title: 'Turso Starter Kit',
    description: "Integrate a Turso database, built with Turso's LibSQL SDK, into an application.",
    framework: 'nextjs',
    useCases: ['ai'],
    repoOwner: 'aziontech',
    repoPath: 'templates/turso-starter',
    defaultRepoName: 'turso-starter-kit',
    settings: [
      {
        name: 'tursoDatabaseUrl',
        label: 'Turso Database URL',
        placeholder: 'libsql://your-database.turso.io',
        description: 'The libSQL connection URL for your Turso database.',
        required: true
      },
      {
        name: 'tursoAuthToken',
        label: 'Turso Auth Token',
        placeholder: 'Auth Token',
        description: 'Generate a token with `turso db tokens create`.',
        required: true
      }
    ]
  },

  'ai-inference-starter': {
    slug: 'ai-inference-starter',
    title: 'AI Inference Starter Kit',
    description: 'Create an application running AI models at the edge.',
    vendor: 'Azion',
    framework: 'javascript',
    useCases: ['ai'],
    icon: 'ai ai-edge-functions',
    repoOwner: 'aziontech',
    repoPath: 'templates/ai-inference',
    defaultRepoName: 'ai-inference-starter-kit',
    settings: [
      {
        name: 'modelId',
        label: 'Model',
        placeholder: 'llama-3.2-3b-instruct',
        description: 'The model the application loads on the first request.',
        required: true
      }
    ]
  },

  'astro-odyssey': {
    slug: 'astro-odyssey',
    title: 'Astro Odyssey',
    description: 'A modern business marketing website theme/starter built with Astro.',
    vendor: 'Azion',
    framework: 'astro',
    useCases: ['marketing'],
    icon: 'ai-cor ai-astro',
    repoOwner: 'aziontech',
    repoPath: 'templates/astro-odyssey',
    defaultRepoName: 'astro-odyssey',
    settings: []
  },

  'dynamic-static-optimization': {
    slug: 'dynamic-static-optimization',
    title: 'Dynamic and Static File Optimization',
    description: 'Boost your application to deliver your content using Azion as a CDN.',
    vendor: 'Azion',
    framework: 'javascript',
    useCases: ['delivery'],
    icon: 'ai ai-tiered-cache',
    repoOwner: 'aziontech',
    repoPath: 'templates/file-optimization',
    defaultRepoName: 'file-optimization',
    requiresRepository: false,
    requiresBuild: false,
    settings: [
      {
        name: 'originAddress',
        label: 'Origin address',
        placeholder: 'origin.example.com',
        description: 'The host Azion caches for. A hostname or an IP address.',
        required: true
      },
      {
        name: 'hostHeader',
        label: 'Host header',
        placeholder: '${host}',
        description: 'Sent to the origin on every request. Leave the default to pass yours through.'
      },
      {
        name: 'browserCacheTtl',
        label: 'Browser cache TTL',
        placeholder: '7200',
        description: 'Seconds a browser may keep its copy before revalidating.'
      }
    ]
  },

  'functions-starter': {
    slug: 'functions-starter',
    title: 'Functions Starter Kit',
    description: 'Launch a “Hello World” originless application powered by functions.',
    vendor: 'Azion',
    framework: 'javascript',
    useCases: [],
    icon: 'ai ai-edge-functions',
    repoOwner: 'aziontech',
    repoPath: 'templates/functions-starter',
    defaultRepoName: 'functions-starter-kit',
    settings: []
  },

  'nextjs-ai-chatbot': {
    slug: 'nextjs-ai-chatbot',
    title: 'Next.js AI Chatbot',
    description: 'A high-performance, server-rendered Next.js App Router AI Chatbot.',
    vendor: 'Azion',
    framework: 'next',
    useCases: ['ai'],
    icon: 'ai-cor ai-next',
    repoOwner: 'aziontech',
    repoPath: 'templates/nextjs-ai-chatbot',
    defaultRepoName: 'nextjs-ai-chatbot',
    settings: [
      {
        name: 'aiApiKey',
        label: 'Model provider API key',
        placeholder: 'sk-…',
        description: 'Written to the repository as a secret; the chatbot reads it at runtime.',
        required: true
      }
    ]
  },

  'nextjs-commerce': {
    slug: 'nextjs-commerce',
    title: 'Next.js Commerce',
    description: 'Ecommerce template built with Next.js and Shopify.',
    vendor: 'Azion',
    framework: 'next',
    useCases: ['ecommerce'],
    icon: 'ai-cor ai-next',
    repoOwner: 'aziontech',
    repoPath: 'templates/nextjs-commerce',
    defaultRepoName: 'nextjs-commerce',
    settings: [
      {
        name: 'shopifyAccessToken',
        label: 'Shopify Access Token',
        placeholder: 'Access Token',
        description: 'You can find this token in Credentials on Shopify Project Configurations.',
        required: true
      },
      {
        name: 'shopifyStoreDomain',
        label: 'Shopify Store Domain',
        placeholder: 'https://your-shopify-store-subdomain.myshopify.com',
        description: 'Your Shopify Store Domain'
      }
    ]
  },

  'nextjs-multi-tenant': {
    slug: 'nextjs-multi-tenant',
    title: 'Next.js Multi-tenant Starter',
    description: 'A minimalistic multi-tenant Next.js starter template.',
    vendor: 'Azion',
    framework: 'next',
    useCases: ['multi-tenant'],
    icon: 'ai-cor ai-next',
    repoOwner: 'aziontech',
    repoPath: 'templates/nextjs-multi-tenant',
    defaultRepoName: 'nextjs-multi-tenant',
    settings: [
      {
        name: 'rootDomain',
        label: 'Root domain',
        placeholder: 'example.com',
        description: 'Every tenant is served as a subdomain of this one.',
        required: true
      }
    ]
  },

  'sveltekit-commerce': {
    slug: 'sveltekit-commerce',
    title: 'SvelteKit Commerce',
    description: 'Ecommerce template built with SvelteKit and Shopify.',
    vendor: 'Azion',
    framework: 'svelte',
    useCases: ['ecommerce'],
    icon: 'ai-cor ai-svelte',
    repoOwner: 'aziontech',
    repoPath: 'templates/sveltekit-commerce',
    defaultRepoName: 'sveltekit-commerce',
    settings: [
      {
        name: 'shopifyAccessToken',
        label: 'Shopify Access Token',
        placeholder: 'Access Token',
        description: 'You can find this token in Credentials on Shopify Project Configurations.',
        required: true
      },
      {
        name: 'shopifyStoreDomain',
        label: 'Shopify Store Domain',
        placeholder: 'https://your-shopify-store-subdomain.myshopify.com',
        description: 'Your Shopify Store Domain'
      }
    ]
  },

  'cosmic-agency-website': {
    slug: 'cosmic-agency-website',
    title: 'Cosmic Agency Website',
    description: "A custom template built using Cosmic's React components, Blocks.",
    vendor: 'Cosmic',
    framework: 'react',
    useCases: ['marketing'],
    icon: 'ai-cor ai-react',
    repoOwner: 'cosmicjs',
    repoPath: 'templates/agency-website',
    defaultRepoName: 'cosmic-agency-website',
    settings: [
      {
        name: 'cosmicBucketSlug',
        label: 'Cosmic bucket slug',
        placeholder: 'my-bucket',
        description: 'The bucket the site reads its content from.',
        required: true
      },
      {
        name: 'cosmicReadKey',
        label: 'Cosmic read key',
        placeholder: 'Read key',
        description: 'Found under Bucket Settings → API Access on Cosmic.',
        required: true
      }
    ]
  },

  'cosmic-astro-blog': {
    slug: 'cosmic-astro-blog',
    title: 'Cosmic Simple Astro Blog',
    description: 'An Astro blog template powered by Cosmic.',
    vendor: 'Cosmic',
    framework: 'astro',
    useCases: ['blog'],
    icon: 'ai-cor ai-astro',
    repoOwner: 'cosmicjs',
    repoPath: 'templates/simple-astro-blog',
    defaultRepoName: 'cosmic-astro-blog',
    settings: [
      {
        name: 'cosmicBucketSlug',
        label: 'Cosmic bucket slug',
        placeholder: 'my-bucket',
        description: 'The bucket the blog reads its posts from.',
        required: true
      },
      {
        name: 'cosmicReadKey',
        label: 'Cosmic read key',
        placeholder: 'Read key',
        description: 'Found under Bucket Settings → API Access on Cosmic.',
        required: true
      }
    ]
  },

  'eleventy-base-blog': {
    slug: 'eleventy-base-blog',
    title: '11ty Base Blog',
    description: 'Deploy this starter template to build a blog with the Eleventy site generator.',
    vendor: '11ty',
    framework: 'eleventy',
    useCases: ['blog'],
    icon: 'ai ai-eleventy',
    repoOwner: '11ty',
    repoPath: 'eleventy-base-blog',
    defaultRepoName: 'eleventy-base-blog',
    settings: []
  },

  'eleventy-landing-page': {
    slug: 'eleventy-landing-page',
    title: '11ty Landing Page',
    description: 'Create a simple landing page template built with 11ty and Tailwind CSS.',
    vendor: '11ty',
    framework: 'eleventy',
    useCases: ['marketing'],
    icon: 'ai ai-eleventy',
    repoOwner: '11ty',
    repoPath: 'eleventy-landing-page',
    defaultRepoName: 'eleventy-landing-page',
    settings: []
  }
}

const frameworkStarters = Object.fromEntries(
  FRAMEWORKS.map((framework) => [templateSlugForTech(framework.tech), framework])
    .filter(([slug]) => !authored[slug])
    .map(([slug, framework]) => [
      slug,
      {
        slug,
        title: framework.title,
        description: framework.description,
        framework: framework.tech,
        repoOwner: 'aziontech',
        repoPath: `templates/${framework.tech}`,
        defaultRepoName: slug,
        settings: []
      }
    ])
)

export const templates = Object.fromEntries(
  Object.entries({ ...authored, ...frameworkStarters }).map(([slug, template]) => [
    slug,
    { ...template, kind: template.requiresRepository === false ? 'integration' : 'framework' }
  ])
)

export const templateKindOptions = [
  { value: 'integration', label: 'Integrations', icon: 'pi pi-sliders-h' },
  { value: 'framework', label: 'Frameworks', icon: 'pi pi-code' }
]

export const isIntegration = (template) => template?.kind === 'integration'

export const AZION_TEMPLATES = [
  'ai-inference-starter',
  'astro-odyssey',
  'azion-proxy',
  'azion-static-site',
  'dynamic-static-optimization',
  'functions-starter',
  'nextjs-ai-chatbot',
  'nextjs-commerce',
  'nextjs-multi-tenant',
  'sveltekit-commerce'
].map((slug) => templates[slug])

export const PARTNER_TEMPLATES = [
  'cosmic-agency-website',
  'cosmic-astro-blog',
  'eleventy-base-blog',
  'eleventy-landing-page'
].map((slug) => templates[slug])

export const DEFAULT_TEMPLATE = 'nuxt-ecommerce'

export const getTemplate = (slug) => templates[slug] || templates[DEFAULT_TEMPLATE]

const frameworkByTech = new Map(FRAMEWORKS.map((framework) => [framework.tech, framework]))

const publishedRow = (template) => {
  const framework = frameworkByTech.get(template.framework)
  const isFirstParty = (template.vendor || 'Azion') === 'Azion'
  const icon = isFirstParty ? '' : template.icon || framework?.icon || ''

  return {
    slug: template.slug,
    title: template.title,
    description: template.description,
    icon,
    markClass: markFilterFor(icon),
    vendor: template.vendor || 'Azion',
    tech: template.framework,
    kind: template.kind,
    useCases: template.useCases ?? []
  }
}

const frameworkEntry = (framework) => ({
  slug: templateSlugForTech(framework.tech),
  title: framework.title,
  description: framework.description,
  icon: framework.icon,
  markClass: framework.markClass,
  color: framework.color,
  vendor: '',
  tech: framework.tech,
  kind: 'framework',
  useCases: framework.useCases
})

export const RECOMMENDED_COUNT = 9

export const FRAMEWORK_ENTRIES = FRAMEWORKS.map(frameworkEntry)

export const RECOMMENDED_CARDS = FRAMEWORK_ENTRIES.slice(0, RECOMMENDED_COUNT)
export const MORE_FRAMEWORKS = FRAMEWORK_ENTRIES.slice(RECOMMENDED_COUNT)

export const PUBLISHED_TEMPLATES = [
  ...AZION_TEMPLATES.map(publishedRow),
  ...PARTNER_TEMPLATES.map(publishedRow)
]

export const deploySlugRoute = (slug) =>
  isIntegration(templates[slug])
    ? { path: '/applications/new', query: { method: 'template', template: slug } }
    : { path: '/deploy', query: { template: slug } }

export const templateSource = (template, icon = '') => ({
  kind: 'template',
  slug: template.slug,
  title: template.title,
  description: template.description,
  framework: template.framework,
  icon: icon || template.icon || '',
  vendor: template.vendor,
  repoOwner: template.repoOwner,
  repoPath: template.repoPath,
  defaultName: template.defaultRepoName,
  requiresRepository: template.requiresRepository !== false,
  requiresBuild: template.requiresBuild !== false,
  integration: template.kind === 'integration',
  settings: template.settings
})
