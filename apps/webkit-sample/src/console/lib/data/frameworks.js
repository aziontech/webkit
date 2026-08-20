// The framework catalog — the one list of things a reader can start an Application
// from, and the one route that starts it.
//
// It lived inside components/CreationCenter.vue, which was fine while /create was the
// only screen that offered a template. It is not: Applications' FIRST USE offers the
// same thing (src/product-empty-states.js → components/ui/ProductFirstUse.vue), and
// "start from a framework" has to mean the same four frameworks, the same marks and
// the same destination in both places, or the console has two template catalogs that
// drift on the first one anybody adds to.
//
// So the catalog is here and both surfaces read it. `TECH_TO_SLUG` + `deployQuery`
// come with it, because a template the two screens agree on that opens two different
// flows is the same bug one level down.
//
// ── WHAT A FRAMEWORK CARRIES ──
//
//   tech         the key. Matches `presetMeta` in lib/presets.js, so the mark on a
//                first-use row and the mark on that application's row in the table
//                are the same glyph for the same reason.
//   title/description   the /create catalog card's copy.
//   icon         the colored brand logo (`ai-cor ai-*` from @aziontech/icons).
//   color        the framework's brand hex, for the card's soft hover glow.
//   useCases     the /create filter's Use Cases axis.
//   tag/hint     what a first-use ROW needs and a card does not: the one word that
//                says how it renders (SSR / SPA / Static), and the literal it
//                produces. Authored as parts so the copy carries no markup — see
//                src/product-empty-states.js for why.

/** Every framework the platform offers a template for, most common first. */
export const FRAMEWORKS = [
  {
    tech: 'next',
    title: 'Next.js Boilerplate',
    label: 'Next.js',
    description: 'Deploy a full-stack Next.js application to the edge in a few steps.',
    icon: 'ai-cor ai-next',
    color: '#0070f3',
    useCases: ['ai', 'ecommerce', 'marketing'],
    tag: 'SSR',
    hint: [{ code: 'next build' }, { text: ' on the edge runtime' }]
  },
  {
    tech: 'react',
    title: 'React Boilerplate',
    label: 'React',
    description: 'Automate your React.js deployment process on the edge.',
    icon: 'ai-cor ai-react',
    color: '#61dafb',
    useCases: ['ai', 'marketing'],
    tag: 'SPA',
    hint: [{ text: 'Every route falls back to ' }, { code: 'index.html' }]
  },
  {
    tech: 'vue',
    title: 'Vue.js starter',
    label: 'Vue',
    description: 'A lightweight template to rapidly build Vue.js applications on the edge.',
    icon: 'ai-cor ai-vue',
    color: '#42b883',
    useCases: ['blog', 'marketing'],
    tag: 'SPA',
    hint: [{ code: 'vite build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'angular',
    title: 'Angular Boilerplate',
    label: 'Angular',
    description: 'Automate your Angular deployment process with this template.',
    icon: 'ai-cor ai-angular',
    color: '#dd0031',
    useCases: ['multi-tenant'],
    tag: 'SPA',
    hint: [{ code: 'ng build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'nuxt',
    title: 'Nuxt E-commerce',
    label: 'Nuxt',
    description: 'Launch a Nuxt e-commerce or content app on the edge.',
    icon: 'ai-cor ai-nuxt',
    color: '#00dc82',
    useCases: ['ecommerce', 'multi-tenant'],
    tag: 'SSR',
    hint: [{ code: 'nuxt build' }, { text: ' on the edge runtime' }]
  },
  {
    tech: 'astro',
    title: 'Astro Starter',
    label: 'Astro',
    description: 'Ship a content-driven Astro site that renders at the edge.',
    icon: 'ai-cor ai-astro',
    color: '#ff5d01',
    useCases: ['blog', 'marketing'],
    tag: 'Static',
    hint: [{ text: 'Prerendered pages with islands where you need them' }]
  },
  {
    tech: 'svelte',
    title: 'Svelte Boilerplate',
    label: 'Svelte',
    description: 'Accelerate the deployment of Svelte applications to run on the edge.',
    icon: 'ai-cor ai-svelte',
    color: '#ff3e00',
    useCases: ['blog'],
    tag: 'SPA',
    hint: [{ code: 'vite build' }, { text: ' with the adapter' }]
  },
  {
    tech: 'preact',
    title: 'Preact Starter',
    label: 'Preact',
    description: 'Deploy a Preact app — the React API in a fraction of the bundle.',
    icon: 'ai ai-preact',
    color: '#673ab8',
    useCases: ['ai', 'marketing'],
    tag: 'SPA',
    hint: [{ code: 'vite build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'qwik',
    title: 'Qwik Starter',
    label: 'Qwik',
    description: 'Ship a resumable Qwik app that hydrates only what the reader touches.',
    icon: 'ai ai-qwik',
    color: '#ac7ef4',
    useCases: ['ecommerce', 'marketing'],
    tag: 'SSR',
    hint: [{ code: 'qwik build' }, { text: ' on the edge runtime' }]
  },
  {
    tech: 'opennextjs',
    title: 'OpenNext Starter',
    label: 'OpenNext',
    description: 'Deploy Next.js through the OpenNext adapter, server routes included.',
    icon: 'ai-cor ai-next',
    color: '#0070f3',
    useCases: ['ai', 'ecommerce'],
    tag: 'SSR',
    hint: [{ code: 'open-next build' }, { text: ' on the edge runtime' }]
  },
  {
    tech: 'nitro',
    title: 'Nitro Starter',
    label: 'Nitro',
    description: 'Deploy a Nitro server build — the engine behind Nuxt, on its own.',
    icon: 'pi pi-server',
    useCases: ['multi-tenant'],
    tag: 'SSR',
    hint: [{ code: 'nitro build' }, { text: ' on the edge runtime' }]
  },
  {
    tech: 'gatsby',
    title: 'Gatsby Starter',
    label: 'Gatsby',
    description: 'Publish a Gatsby site built at deploy time and served from the edge.',
    icon: 'ai ai-gatsby',
    color: '#663399',
    useCases: ['blog', 'marketing'],
    tag: 'Static',
    hint: [{ code: 'gatsby build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'docusaurus',
    title: 'Docusaurus Starter',
    label: 'Docusaurus',
    description: 'Publish a Docusaurus documentation site on the edge.',
    icon: 'ai ai-docusaurus',
    color: '#3ecc5f',
    useCases: ['blog'],
    tag: 'Static',
    hint: [{ code: 'docusaurus build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'vitepress',
    title: 'VitePress Starter',
    label: 'VitePress',
    description: 'Publish a VitePress documentation site on the edge.',
    icon: 'ai ai-vitepress',
    color: '#646cff',
    useCases: ['blog'],
    tag: 'Static',
    hint: [{ code: 'vitepress build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'vuepress',
    title: 'VuePress Starter',
    label: 'VuePress',
    description: 'Publish a VuePress documentation site on the edge.',
    icon: 'ai ai-vuepress',
    color: '#3eaf7c',
    useCases: ['blog'],
    tag: 'Static',
    hint: [{ code: 'vuepress build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'hugo',
    title: 'Hugo Starter',
    label: 'Hugo',
    description: 'Publish a Hugo site — thousands of pages built in seconds.',
    icon: 'ai ai-hugo',
    color: '#ff4088',
    useCases: ['blog', 'marketing'],
    tag: 'Static',
    hint: [{ code: 'hugo' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'jekyll',
    title: 'Jekyll Starter',
    label: 'Jekyll',
    description: 'Publish a Jekyll site straight from its source.',
    icon: 'ai ai-jekyll',
    color: '#cc0000',
    useCases: ['blog'],
    tag: 'Static',
    hint: [{ code: 'jekyll build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'hexo',
    title: 'Hexo Starter',
    label: 'Hexo',
    description: 'Publish a Hexo blog on the edge.',
    icon: 'ai ai-hexo',
    color: '#0e83cd',
    useCases: ['blog'],
    tag: 'Static',
    hint: [{ code: 'hexo generate' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'eleventy',
    title: 'Eleventy Starter',
    label: 'Eleventy',
    description: 'Publish an Eleventy site with no framework runtime shipped to the reader.',
    icon: 'ai ai-eleventy',
    useCases: ['blog', 'marketing'],
    tag: 'Static',
    hint: [{ code: 'eleventy' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'stencil',
    title: 'Stencil Starter',
    label: 'Stencil',
    description: 'Build framework-agnostic web components with Stencil.',
    icon: 'pi pi-code',
    useCases: ['multi-tenant'],
    tag: 'SPA',
    hint: [{ code: 'stencil build' }, { text: ' output served from the edge' }]
  },
  {
    tech: 'html',
    title: 'Static HTML Starter',
    label: 'HTML',
    description: 'Serve a folder of HTML, CSS and JavaScript with no build step.',
    icon: 'pi pi-code',
    color: '#e34f26',
    useCases: ['marketing'],
    tag: 'Static',
    hint: [{ text: 'No build step — the folder is the site' }]
  },
  {
    tech: 'javascript',
    title: 'JavaScript Starter',
    label: 'JavaScript',
    description: 'Run plain JavaScript at the edge — no framework, just a handler.',
    icon: 'ai-cor ai-js',
    color: '#f7df1e',
    useCases: ['ai'],
    tag: 'Function',
    hint: [{ text: 'A handler module, bundled as it is' }]
  },
  {
    tech: 'typescript',
    title: 'TypeScript Starter',
    label: 'TypeScript',
    description: 'Run a TypeScript handler at the edge, compiled on build.',
    icon: 'ai-cor ai-ts',
    color: '#3178c6',
    useCases: ['ai'],
    tag: 'Function',
    hint: [{ text: 'Compiled and bundled on deploy' }]
  },
  {
    tech: 'rustwasm',
    title: 'Rust WASM Starter',
    label: 'Rust + WASM',
    description: 'Compile Rust to WebAssembly and run it at the edge.',
    icon: 'pi pi-microchip',
    color: '#654ff0',
    useCases: ['ai'],
    tag: 'WASM',
    hint: [{ code: 'wasm-pack build' }, { text: ' output run as WebAssembly' }]
  },
  {
    tech: 'emscripten',
    title: 'Emscripten Starter',
    label: 'Emscripten',
    description: 'Bring C or C++ to the edge, compiled to WebAssembly with Emscripten.',
    icon: 'pi pi-microchip',
    useCases: ['ai'],
    tag: 'WASM',
    hint: [{ code: 'emcc' }, { text: ' output run as WebAssembly' }]
  }
]

// A chosen framework → the deploy flow's catalog slug. Techs with no dedicated demo
// template fall back to the closest available boilerplate.
const TECH_TO_SLUG = {
  next: 'next-boilerplate',
  react: 'react-boilerplate',
  vue: 'vue-boilerplate',
  angular: 'angular-boilerplate',
  nuxt: 'nuxt-ecommerce',
  astro: 'astro-starter',
  svelte: 'svelte-boilerplate',
  preact: 'preact-starter',
  qwik: 'qwik-starter',
  opennextjs: 'opennextjs-starter',
  nitro: 'nitro-starter',
  gatsby: 'gatsby-starter',
  docusaurus: 'docusaurus-starter',
  vitepress: 'vitepress-starter',
  vuepress: 'vuepress-starter',
  hugo: 'hugo-starter',
  jekyll: 'jekyll-starter',
  hexo: 'hexo-starter',
  eleventy: 'eleventy-starter',
  stencil: 'stencil-starter',
  html: 'html-starter',
  javascript: 'javascript-starter',
  typescript: 'typescript-starter',
  rustwasm: 'rustwasm-starter',
  emscripten: 'emscripten-starter'
}

/** The catalog slug a framework clones from. Falls back to the closest boilerplate. */
export const templateSlugForTech = (tech) => TECH_TO_SLUG[tech] ?? 'nuxt-ecommerce'

/**
 * Where picking a framework goes — the deploy flow, cloning that catalog template.
 * One destination for both surfaces: /create's catalog card and Applications' own
 * first-use row start the identical flow, because they are the identical choice.
 */
export const deployTemplateRoute = (tech) => ({
  path: '/deploy',
  query: { template: templateSlugForTech(tech) }
})

/** The /create filter's Technology axis, derived so the list and the catalog agree. */
export const technologyOptions = FRAMEWORKS.map(({ tech, label, icon }) => ({
  value: tech,
  label,
  icon
}))

/** The /create filter's Use Cases axis. */
export const useCaseOptions = [
  { value: 'ai', label: 'AI/Agent', icon: 'pi pi-star' },
  { value: 'ecommerce', label: 'Ecommerce', icon: 'pi pi-shopping-cart' },
  { value: 'blog', label: 'Blog', icon: 'pi pi-pencil' },
  { value: 'marketing', label: 'Marketing sites', icon: 'pi pi-megaphone' },
  { value: 'multi-tenant', label: 'Multi-tenant platforms', icon: 'pi pi-sitemap' }
]

/**
 * The four frameworks a first-use screen shows for "start fast".
 *
 * NAMED, not `slice(0, 4)`. FRAMEWORKS is ordered for the create page's catalog — most
 * common first — and its first four happen to be Next, React, Vue and Angular. What the
 * first-use cluster needs is a different thing: four marks a reader RECOGNISES at 18px,
 * spanning the shapes the platform serves (a full-stack framework, the two dominant SPA
 * libraries, and a compiler-first one). Svelte earns the fourth slot over Angular on
 * exactly that: it is the one of the two whose mark is unmistakable at this size.
 *
 * Reordering FRAMEWORKS to get this would have moved the create page's cards too, which
 * is the wrong screen to reorder for a 104px cluster.
 */
export const FIRST_USE_TECHS = ['next', 'react', 'vue', 'svelte']

/**
 * The boilerplates a first-use screen offers under "start fast".
 *
 * Derived from FRAMEWORKS rather than listed again: a first-use row that offered "Vue"
 * and opened a different flow than the create page's "Vue" card would be two products
 * (see ../product-empty-states.js → `startFast`). Same mark, same slug, same deploy.
 *
 * FOUR, not ten: this block is an invitation, and a ten-row list is a catalog the
 * reader has to shop before they can start. The full set is one click away in the
 * create flow, which is what the block's own "Learn more" says.
 */
export const frameworkBoilerplates = (techs = FIRST_USE_TECHS) =>
  techs
    .map((tech) => FRAMEWORKS.find((framework) => framework.tech === tech))
    .filter(Boolean)
    .map((framework) => ({
      id: framework.tech,
      title: framework.title,
      description: framework.description,
      icon: framework.icon,
      action: 'Create',
      route: deployTemplateRoute(framework.tech)
    }))
