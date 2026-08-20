// Template catalog. Each template carries its preview metadata plus a
// `settings` array describing the template-specific fields shown under
// "Template Settings" on the deploy screen — this is what changes from one
// template to the next. A field: { name, label, placeholder, description,
// required }. Titles/descriptions mirror the Creation Center cards so the deploy
// screen reflects exactly the template that was clicked.
//
// ── TWO KINDS OF TEMPLATE ──
//
// FRAMEWORK STARTERS are keyed by the framework they scaffold, and the surfaces that
// offer them iterate ./frameworks.js and resolve to an entry here. Their value is the
// code: a Next or Nuxt project already wired to build and deploy.
//
// They are DERIVED from ./frameworks.js (see `frameworkStarters` below), not listed again
// here. That catalog is the platform's real preset list — the 25 presets `@aziontech/presets`
// exports, which is what the build actually accepts — and a starter is nothing more than
// "that framework, cloned": one title, one sentence, one repository path. Typing them out a
// second time is how a list of 25 ends up disagreeing with itself on the first rename, and
// the whole reason the framework catalog was centralised in the first place. A starter that
// needs MORE than the derivation — settings of its own, a repository that is not
// `templates/<tech>` — is authored below and wins over the derived entry.
//
// AZION TEMPLATES (`vendor: 'Azion'`, listed in AZION_TEMPLATES below) are the other
// kind: first-party solutions that are not a framework and are not browsed by one. Azion
// Proxy is the shape — there is no project to scaffold, so the template IS its settings
// group, and the reader picks it precisely to answer those fields. They lead the template
// list because they are the ones nobody can arrive at by thinking "I use Nuxt".
//
// TWO FLAGS separate them mechanically, and they say the same thing twice over: an Azion
// template is CONFIGURED, a framework starter is CLONED.
//
//   `requiresRepository`  A framework starter is a project Azion copies into the reader's
//                         own GitHub account and then watches, so that flow passes through
//                         a Git connection and a repository — new or existing — before it
//                         can be configured (./application-flows.js, and the part that
//                         asks it: ../../pages/applications/wizard/RepositoryStep.vue).
//                         An Azion template has no project to copy: its settings ARE the
//                         template, so it goes straight from the catalog to Configure and
//                         the reader is never asked to authorize an account for a clone
//                         that never happens.
//   `requiresBuild`       A framework starter arrives WITH code, so the Configure part asks
//                         how to build it; an Azion template has no bundle at all, so
//                         asking for a build command would be asking about code that does
//                         not exist — the same reason the from-scratch source declares it
//                         false (./application-flows.js → SCRATCH_SOURCE).
//
// Both are read as `!== false`, so a framework starter declares neither and gets both.

import { FRAMEWORKS, templateSlugForTech } from './frameworks'

// The templates that carry something the derivation cannot: an Azion template's settings
// group, a starter's own credentials (Shopify, Turso), a repository path that is not
// `templates/<tech>`.
const authored = {
  'azion-proxy': {
    slug: 'azion-proxy',
    title: 'Azion Proxy',
    description: 'Front an origin you already run. Azion receives the traffic and passes it on.',
    vendor: 'Azion',
    framework: 'javascript',
    icon: 'ai ai-edge-connectors',
    repoOwner: 'aziontech',
    repoPath: 'templates/proxy',
    defaultRepoName: 'azion-proxy',
    // NO REPOSITORY, NO BUILD: nothing is cloned and nothing is compiled — the settings
    // below ARE the template.
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
    icon: 'ai ai-edge-storage',
    repoOwner: 'aziontech',
    repoPath: 'templates/static-site',
    defaultRepoName: 'azion-static-site',
    // Same as the proxy above: an Azion template is configured, not cloned. Which also
    // settles the build — with no repository there is no source to run a build command
    // against, and the two settings below are what the deploy actually acts on.
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

  // ── THE AZION-PUBLISHED APPLICATIONS ──
  //
  // The rest of what Azion ships in its catalog, and the reason `vendor` and
  // `requiresRepository` are two fields rather than one. Every template below wears the
  // Azion mark, and almost every one of them is CLONED: they are real applications — an
  // inference kit, a storefront, a chatbot — that land in the reader's own GitHub account
  // and are theirs to push to afterwards. Only the two traffic-shaped ones (the proxy
  // above, the CDN optimization below) are configuration with no project behind it.
  //
  // So the mark says WHO PUBLISHES IT and the flag says WHETHER IT IS COPIED. Collapsing
  // them into "Azion means no GitHub" would have sent nine app starters down the
  // configure-only path with no repository to hold their code.

  'ai-inference-starter': {
    slug: 'ai-inference-starter',
    title: 'AI Inference Starter Kit',
    description: 'Create an application running AI models at the edge.',
    vendor: 'Azion',
    framework: 'javascript',
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
    icon: 'ai ai-edge-cache',
    repoOwner: 'aziontech',
    repoPath: 'templates/file-optimization',
    defaultRepoName: 'file-optimization',
    // CONFIGURED, like the proxy: Azion sits in front of an origin the reader already
    // runs. There is no project to copy and nothing to compile.
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

  // ── PARTNER TEMPLATES ──
  //
  // Published by somebody else and offered in the same catalog, so they wear THEIR mark
  // rather than Azion's — that is the whole job the `vendor` field does. Mechanically
  // they are ordinary starters: cloned into the reader's account, built, deployed.

  'cosmic-agency-website': {
    slug: 'cosmic-agency-website',
    title: 'Cosmic Agency Website',
    description: "A custom template built using Cosmic's React components, Blocks.",
    vendor: 'Cosmic',
    framework: 'react',
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
    icon: 'ai ai-eleventy',
    repoOwner: '11ty',
    repoPath: 'eleventy-landing-page',
    defaultRepoName: 'eleventy-landing-page',
    settings: []
  }
}

/**
 * Every framework in the catalog, as the starter that clones it. `templateSlugForTech`
 * owns the slug (it is in URLs — `?template=next-boilerplate`), so the seven that predate
 * this derivation keep the slugs they shipped with and the rest get `<tech>-starter`.
 */
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

export const templates = { ...authored, ...frameworkStarters }

/**
 * The AZION-PUBLISHED templates, in list order — the group that wears the Azion mark.
 *
 * A separate export and not a filter over `templates`, because the ORDER is editorial and
 * an object's key order is not a place to keep an editorial decision. The order is the
 * catalog's own: alphabetical, which is how the reader scans a list they are hunting a
 * name in — the two configure-only ones do not lead just because they are the short flow.
 *
 * Publishing is NOT the same axis as cloning: most of these are real applications copied
 * into the reader's GitHub account, and only `azion-proxy`, `azion-static-site` and
 * `dynamic-static-optimization` declare `requiresRepository: false`. See the flags note at
 * the top of this file.
 */
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

/**
 * The PARTNER templates — same catalog, somebody else's mark. Alphabetical for the same
 * reason as the list above.
 */
export const PARTNER_TEMPLATES = [
  'cosmic-agency-website',
  'cosmic-astro-blog',
  'eleventy-base-blog',
  'eleventy-landing-page'
].map((slug) => templates[slug])

export const DEFAULT_TEMPLATE = 'nuxt-ecommerce'

export const getTemplate = (slug) => templates[slug] || templates[DEFAULT_TEMPLATE]
