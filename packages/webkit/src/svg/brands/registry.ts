import type { Component } from 'vue'

/**
 * Every name `<BrandCarousel :marks>` accepts. A mark is an SFC drawn in `currentColor`, so
 * it needs no per-theme asset; loaders are dynamic imports, so a page carries only what it
 * names. An unregistered name is not an error — the carousel writes it as a wordmark.
 */
export type BrandMarkLoader = () => Promise<{ default: Component }>

export const brandMarks = {
  agibank: () => import('./agibank.vue'),
  'america-movil': () => import('./america-movil.vue'),
  angular: () => import('./angular.vue'),
  anthropic: () => import('./anthropic.vue'),
  astro: () => import('./astro.vue'),
  aws: () => import('./aws.vue'),
  axur: () => import('./axur.vue'),
  azure: () => import('./azure.vue'),
  caixa: () => import('./caixa.vue'),
  'coca-cola': () => import('./coca-cola.vue'),
  contabilizei: () => import('./contabilizei.vue'),
  dafiti: () => import('./dafiti.vue'),
  docusaurus: () => import('./docusaurus.vue'),
  drizzle: () => import('./drizzle.vue'),
  elastic: () => import('./elastic.vue'),
  eleventy: () => import('./eleventy.vue'),
  equinix: () => import('./equinix.vue'),
  exame: () => import('./exame.vue'),
  forrester: () => import('./forrester.vue'),
  fourbank: () => import('./fourbank.vue'),
  'frost-and-sullivan': () => import('./frost-and-sullivan.vue'),
  g2: () => import('./g2.vue'),
  gartner: () => import('./gartner.vue'),
  gatsby: () => import('./gatsby.vue'),
  gcp: () => import('./gcp.vue'),
  gigaom: () => import('./gigaom.vue'),
  github: () => import('./github.vue'),
  'global-fashion-group': () => import('./global-fashion-group.vue'),
  gpa: () => import('./gpa.vue'),
  grafana: () => import('./grafana.vue'),
  graphql: () => import('./graphql.vue'),
  groq: () => import('./groq.vue'),
  herospark: () => import('./herospark.vue'),
  hexo: () => import('./hexo.vue'),
  hono: () => import('./hono.vue'),
  hugo: () => import('./hugo.vue'),
  itau: () => import('./itau.vue'),
  jekyll: () => import('./jekyll.vue'),
  kafka: () => import('./kafka.vue'),
  madeiramadeira: () => import('./madeiramadeira.vue'),
  magalu: () => import('./magalu.vue'),
  netshoes: () => import('./netshoes.vue'),
  nextjs: () => import('./nextjs.vue'),
  nodejs: () => import('./nodejs.vue'),
  nuxt: () => import('./nuxt.vue'),
  nzn: () => import('./nzn.vue'),
  openai: () => import('./openai.vue'),
  preact: () => import('./preact.vue'),
  'prime-video': () => import('./prime-video.vue'),
  qwik: () => import('./qwik.vue'),
  radware: () => import('./radware.vue'),
  react: () => import('./react.vue'),
  remix: () => import('./remix.vue'),
  renner: () => import('./renner.vue'),
  sqlite: () => import('./sqlite.vue'),
  terraform: () => import('./terraform.vue'),
  vite: () => import('./vite.vue'),
  vitepress: () => import('./vitepress.vue'),
  vue: () => import('./vue.vue'),
  'workers-cloudflare': () => import('./workers-cloudflare.vue')
} satisfies Record<string, BrandMarkLoader>

/** Every registered mark name. */
export type BrandMarkName = keyof typeof brandMarks

/** The company or project each mark belongs to, for the title and the wordmark fallback. */
export const brandMarkLabels: Record<BrandMarkName, string> = {
  agibank: 'Agibank',
  'america-movil': 'América Móvil',
  angular: 'Angular',
  anthropic: 'Anthropic',
  astro: 'Astro',
  aws: 'AWS',
  axur: 'Axur',
  azure: 'Azure',
  caixa: 'Caixa',
  'coca-cola': 'Coca-Cola',
  contabilizei: 'Contabilizei',
  dafiti: 'Dafiti',
  docusaurus: 'Docusaurus',
  drizzle: 'Drizzle',
  elastic: 'Elastic',
  eleventy: 'Eleventy',
  equinix: 'Equinix',
  exame: 'Exame',
  forrester: 'Forrester',
  fourbank: 'Fourbank',
  'frost-and-sullivan': 'Frost & Sullivan',
  g2: 'G2',
  gartner: 'Gartner',
  gatsby: 'Gatsby',
  gcp: 'Google Cloud',
  gigaom: 'GigaOm',
  github: 'GitHub',
  'global-fashion-group': 'Global Fashion Group',
  gpa: 'GPA',
  grafana: 'Grafana',
  graphql: 'GraphQL',
  groq: 'Groq',
  herospark: 'HeroSpark',
  hexo: 'Hexo',
  hono: 'Hono',
  hugo: 'Hugo',
  itau: 'Itaú',
  jekyll: 'Jekyll',
  kafka: 'Kafka',
  madeiramadeira: 'MadeiraMadeira',
  magalu: 'Magalu',
  netshoes: 'Netshoes',
  nextjs: 'Next.js',
  nodejs: 'Node.js',
  nuxt: 'Nuxt',
  nzn: 'NZN',
  openai: 'OpenAI',
  preact: 'Preact',
  'prime-video': 'Prime Video',
  qwik: 'Qwik',
  radware: 'Radware',
  react: 'React',
  remix: 'Remix',
  renner: 'Renner',
  sqlite: 'SQLite',
  terraform: 'Terraform',
  vite: 'Vite',
  vitepress: 'VitePress',
  vue: 'Vue',
  'workers-cloudflare': 'Cloudflare Workers'
}

/** Sorted mark names — the values `marks` accepts, for docs and stories. */
export const brandMarkNames = Object.keys(brandMarks).sort() as BrandMarkName[]

/** The loader for `name`, or `null` when nothing is registered under it. */
export function resolveBrandMark(name: string): BrandMarkLoader | null {
  if (!Object.hasOwn(brandMarks, name)) return null
  return brandMarks[name as BrandMarkName]
}

/** The label for `name`; falls back to the name itself so an unregistered mark still reads. */
export function brandMarkLabel(name: string): string {
  return brandMarkLabels[name as BrandMarkName] ?? name
}
