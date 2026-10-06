const CATALOG = [
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
    icon: 'ai-cor ai-html',
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

const DARK_INK_MARKS = ['ai-next']

const DARK_INK_FILTER = '[[data-theme=dark]_&]:invert'

export const markFilterFor = (icon = '') =>
  DARK_INK_MARKS.some((mark) => icon.split(' ').includes(mark)) ? DARK_INK_FILTER : ''

export const FRAMEWORKS = CATALOG.map((framework) => ({
  ...framework,
  markClass: markFilterFor(framework.icon)
}))

export const AZION_COMMANDS = {
  buildCommand: 'azion build',
  deployCommand: 'azion deploy'
}

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

export const templateSlugForTech = (tech) => TECH_TO_SLUG[tech] ?? 'nuxt-ecommerce'

export const deployTemplateRoute = (tech) => ({
  path: '/deploy',
  query: { template: templateSlugForTech(tech) }
})

export const presetOptions = FRAMEWORKS.map(({ tech, label, icon, markClass }) => ({
  value: tech,
  label,
  icon,
  markClass
}))

export const technologyOptions = FRAMEWORKS.map(({ tech, label, icon }) => ({
  value: tech,
  label,
  icon
}))

export const useCaseOptions = [
  { value: 'ai', label: 'AI/Agent', icon: 'pi pi-star' },
  { value: 'ecommerce', label: 'Ecommerce', icon: 'pi pi-shopping-cart' },
  { value: 'blog', label: 'Blog', icon: 'pi pi-pencil' },
  { value: 'marketing', label: 'Marketing sites', icon: 'pi pi-megaphone' },
  { value: 'multi-tenant', label: 'Multi-tenant platforms', icon: 'pi pi-sitemap' },
  { value: 'delivery', label: 'Content delivery', icon: 'pi pi-bolt' }
]

export const FIRST_USE_TECHS = ['next', 'react', 'vue', 'svelte']

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
