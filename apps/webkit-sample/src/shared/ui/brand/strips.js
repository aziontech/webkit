// The lists the site's brand strips state, as webkit brand-mark names.
//
// A strip is a CLAIM a page makes, so the list lives here and the artwork lives in
// `@aziontech/webkit/ticker`'s registry — the page names marks, it never carries
// files. A name with no entry in that registry still renders, as its own wordmark, so a
// list stays the list the source states even before artwork lands.
//
// Two populations, deliberately apart: CLIENTS is who runs on the platform, TOOLS and
// PRODUCT_STACK are what a workload is already built with. A name here has never been a
// customer, and a name there is not something you build with.

// The eleven the hero strip states, in the source's order.
export const CLIENT_STRIP = [
  'global-fashion-group',
  'herospark',
  'itau',
  'nzn',
  'netshoes',
  'caixa',
  'agibank',
  'prime-video',
  'america-movil',
  'gpa',
  'fourbank'
]

// The same eleven with Radware in the eighth slot: the source's alt for that slot reads
// `Prime Video`, but the file it loads is Radware's, and these pages follow the file.
export const CLIENT_STRIP_RADWARE = CLIENT_STRIP.map((name) =>
  name === 'prime-video' ? 'radware' : name
)

// Every client this app can name — the strip a page runs when it wants the whole roll.
export const CLIENTS_ALL = [
  'agibank',
  'radware',
  'america-movil',
  'gpa',
  'fourbank',
  'global-fashion-group',
  'herospark',
  'itau',
  'magalu',
  'madeiramadeira',
  'renner',
  'netshoes',
  'coca-cola',
  'prime-video',
  'dafiti',
  'caixa',
  'exame',
  'nzn'
]

// The home page's "Your Stack, Your Way" strip, in the source's order.
export const TOOLS = [
  'angular',
  'astro',
  'nextjs',
  'nuxt',
  'preact',
  'docusaurus',
  'eleventy',
  'gatsby',
  'jekyll',
  'vue',
  'graphql',
  'vite',
  'terraform',
  'aws',
  'gcp',
  'azure',
  'equinix',
  'anthropic',
  'openai',
  'groq',
  'grafana',
  'elastic',
  'kafka',
  'react',
  'drizzle'
]

// The strip azion.com runs under every PRODUCT page's hero — thirty names, in the source's
// order. Stated separately from TOOLS rather than folded into it: widening the home page's
// strip by ten marks would change a page nobody asked to change.
export const PRODUCT_STACK = [
  'nextjs',
  'astro',
  'react',
  'vue',
  'angular',
  'nuxt',
  'gatsby',
  'hugo',
  'preact',
  'remix',
  'qwik',
  'vite',
  'vitepress',
  'docusaurus',
  'eleventy',
  'hexo',
  'jekyll',
  'hono',
  'nodejs',
  'aws',
  'gcp',
  'azure',
  'workers-cloudflare',
  'terraform',
  'github',
  'openai',
  'anthropic',
  'groq',
  'sqlite',
  'drizzle'
]
