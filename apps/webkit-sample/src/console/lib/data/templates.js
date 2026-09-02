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
//
// ── TWO AXES AN AUTHORED TEMPLATE ALSO CARRIES ──
//
// A framework starter derives both of these from ./frameworks.js. An Azion template has
// no framework catalog behind it, so it states them:
//
//   `useCases`   which of the filter's use cases it answers (./frameworks.js →
//                `useCaseOptions`). EMPTY IS A REAL ANSWER: the Functions "Hello World"
//                kit answers none of them, and tagging it with the nearest one would put
//                it in a cut it does not belong to.
//   `creates`    the objects its run creates, in the shared resource vocabulary
//                (./frameworks.js → `RESOURCE_LABELS`). Authored only where the render
//                shape gets it WRONG: the two traffic-shaped templates create a connector
//                and no function, which nothing about "javascript" implies. Everything
//                else inherits its framework's list, so a Next.js template says what
//                every Next.js deploy says.

import { FRAMEWORKS, markFilterFor, resourceLabels, templateSlugForTech } from './frameworks'

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
    useCases: ['delivery'],
    creates: ['application', 'workload', 'connector'],
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
    useCases: ['marketing', 'blog'],
    creates: ['application', 'workload', 'storage'],
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
    creates: ['application', 'workload', 'function', 'storage'],
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
    creates: ['application', 'workload', 'connector'],
    // `ai-tiered-cache`, not `ai-edge-cache` — the latter is not a glyph the icons
    // package ships, and a font icon that names nothing paints NOTHING: the card carried
    // an empty 40px hole where its mark belongs and no error anywhere said so.
    icon: 'ai ai-tiered-cache',
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
    creates: ['application', 'workload', 'function', 'storage'],
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

// ── THE GALLERY: EVERY TEMPLATE, IN THE SHAPE ITS KIND EARNS ──────────────────
//
// THE SAME CATALOG THE WIZARD OFFERS (../../pages/applications/wizard/TemplateSourceStep.vue),
// for the Creation Center's template pane
// (../../pages/resources/creation/TemplateGallery.vue) — but in TWO shapes rather than
// one, because the two kinds of template are answers to two different questions.
//
// A FRAMEWORK STARTER is picked by its MARK. "I use Nuxt" is the whole decision, and a
// logo is faster to find than a sentence — so the frameworks are cards, brand mark
// centered, and the ones most people arrive with lead (`RECOMMENDED_COUNT`, the catalog's
// own most-common-first order).
//
// AN AZION TEMPLATE is picked by WHAT IT DOES. "AI Inference Starter Kit" and "Next.js AI
// Chatbot" are not told apart by a mark at all — three of them wear the same Next logo —
// so they take the row shape the Marketplace already uses for exactly this
// (../../components/marketplace/IntegrationCard.vue): mark on the left, the name, who
// publishes it, and the sentence that distinguishes it. Fourteen of those as centered
// cards would have been fourteen tiles whose only legible difference was their title.
//
// The gallery pane orders the bands: recommended frameworks, then the published
// templates, then the rest of the frameworks.
const frameworkByTech = new Map(FRAMEWORKS.map((framework) => [framework.tech, framework]))

/**
 * One authored template as the row the published-template list renders.
 *
 * ── THE MARK IS THE VENDOR'S, NOT THE FRAMEWORK'S ──
 *
 * An Azion-published row carries NO `icon`, which is how
 * ../../components/marketplace/IntegrationCard.vue is asked for the Azion mark (it falls
 * back to it whenever the icon is empty). The same rule the wizard's rows follow
 * (../../pages/applications/wizard/TemplateSourceStep.vue), for the same reason: a
 * framework row is told apart BY its mark — a Nuxt row from a Next row — but an Azion
 * row is not, and the fact the reader is placing when they look at one is WHO PUBLISHES
 * IT. Three of these are Next.js applications and would otherwise wear three identical
 * Next discs while the thing that makes them first-party went unsaid.
 *
 * A PARTNER row keeps the mark it has: the point of the field is whose template this is,
 * and we ship no Cosmic logo, so its React mark says more than a blank tile would. 11ty's
 * mark IS its vendor mark.
 *
 * ── NO TECHNOLOGY TAG ──
 *
 * The corner Tag used to carry the framework's label, which spent the row's one badge on
 * the fact its own sentence already states ("built with Next.js and Shopify"). What the
 * row now shows instead is `creates` — the chain of objects the run leaves in the
 * account, which was visible nowhere until the deploy log streamed it past. The
 * technology stays reachable as a FILTER axis, where it is useful as a cut rather than as
 * a label repeated fourteen times.
 */
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
    useCases: template.useCases ?? [],
    creates: template.creates ? resourceLabels(template.creates) : (framework?.creates ?? [])
  }
}

/**
 * One framework as a gallery entry — the same object whichever shape renders it.
 *
 * `vendor: ''` omits the "by {vendor}" byline when it is rendered as a ROW: a framework
 * starter is not published by anybody in the sense that line means (the row IS the
 * framework), and sixteen rows each reading "by Azion" would be a column of the same
 * three words. The card shape ignores the field entirely.
 */
const frameworkEntry = (framework) => ({
  slug: templateSlugForTech(framework.tech),
  title: framework.title,
  description: framework.description,
  icon: framework.icon,
  markClass: framework.markClass,
  color: framework.color,
  vendor: '',
  tech: framework.tech,
  useCases: framework.useCases,
  creates: framework.creates
})

/**
 * How many framework cards lead the pane as "Recommended" — NINE, which is the 3×3 the
 * grid resolves to at its widest. Not a taste number: the grid runs three up, so any
 * other count leaves the band's last row part-empty, and a "recommended" band with a
 * hole in it reads as a loading state.
 *
 * They are the first nine of the catalog, which is ordered most-common-first — the same
 * order that decides which four a product's first use offers (./frameworks.js →
 * `FIRST_USE_TECHS` explains why that order is not reshuffled per surface).
 */
export const RECOMMENDED_COUNT = 9

/** The framework starters, most common first. */
export const FRAMEWORK_ENTRIES = FRAMEWORKS.map(frameworkEntry)

/**
 * The nine that lead the pane as CARDS, and the rest as ROWS.
 *
 * The split is a split of SHAPE, not of content: the head of the catalog is where a
 * reader is browsing, and a 3×3 of brand marks is the fastest thing to scan; the tail is
 * where they are HUNTING a name they already have in mind, and sixteen more centered
 * tiles is four screens of scrolling to read sixteen titles. A row is a third of the
 * height and puts the title first.
 */
export const RECOMMENDED_CARDS = FRAMEWORK_ENTRIES.slice(0, RECOMMENDED_COUNT)
export const MORE_FRAMEWORKS = FRAMEWORK_ENTRIES.slice(RECOMMENDED_COUNT)

/**
 * The templates Azion and its partners PUBLISH, as list rows — Azion's own first, in the
 * same order the wizard lists them (alphabetical, editorial: see AZION_TEMPLATES).
 */
export const PUBLISHED_TEMPLATES = [
  ...AZION_TEMPLATES.map(publishedRow),
  ...PARTNER_TEMPLATES.map(publishedRow)
]

/** Where a gallery card goes: the deploy flow, on that template's own slug. */
export const deploySlugRoute = (slug) => ({ path: '/deploy', query: { template: slug } })
