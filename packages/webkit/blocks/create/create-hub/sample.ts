import type {
  CreateHubAccount,
  CreateHubRepository,
  CreateHubTemplateSection
} from './create-hub.vue'

export const sampleAccounts: CreateHubAccount[] = [
  { label: 'jane-doe', value: 'jane-doe' },
  { label: 'acme', value: 'acme' },
  { label: 'acme-labs', value: 'acme-labs' }
]

export const sampleRepositories: CreateHubRepository[] = [
  { name: 'next-js-boilerplate', age: '2 hours ago', icon: 'ai-color ai-nextjs' },
  { name: 'docs-site', age: '5 hours ago', icon: 'ai-color ai-astro' },
  { name: 'api-playground', age: 'yesterday', icon: 'ai-color ai-vue' },
  { name: 'storefront-checkout', age: '3 days ago', icon: 'ai-color ai-react' },
  { name: 'observability-dashboard', age: '6 days ago', icon: 'ai-color ai-svelte' },
  { name: 'marketing-landing', age: '2 weeks ago', icon: 'ai-color ai-nuxt' },
  { name: 'internal-admin', age: 'last month', icon: 'ai-color ai-angular' },
  { name: 'image-resizer', age: 'last month', icon: 'ai ai-image' },
  { name: 'status-page', age: '2 months ago', icon: 'ai-color ai-astro' },
  { name: 'auth-gateway', age: '2 months ago', icon: 'ai ai-lock' },
  { name: 'blog', age: '3 months ago', icon: 'ai-color ai-nuxt' },
  { name: 'design-tokens', age: '5 months ago', icon: 'ai ai-palette' }
]

export const sampleTemplates: CreateHubTemplateSection[] = [
  {
    id: 'recommended',
    label: 'Recommended',
    kind: 'cards',
    items: [
      {
        slug: 'next-boilerplate',
        title: 'Next.js Boilerplate',
        description: 'Deploy a full-stack Next.js application in a few steps.',
        icon: 'ai-color ai-nextjs',
        markClass: '[[data-theme=dark]_&]:invert'
      },
      {
        slug: 'react-boilerplate',
        title: 'React Boilerplate',
        description: 'Automate your React.js deployment process.',
        icon: 'ai-color ai-react',
        markClass: ''
      },
      {
        slug: 'vue-boilerplate',
        title: 'Vue.js starter',
        description: 'A lightweight template to rapidly build Vue.js applications.',
        icon: 'ai-color ai-vue',
        markClass: ''
      },
      {
        slug: 'angular-boilerplate',
        title: 'Angular Boilerplate',
        description: 'Automate your Angular deployment process with this template.',
        icon: 'ai-color ai-angular',
        markClass: ''
      },
      {
        slug: 'nuxt-ecommerce',
        title: 'Nuxt E-commerce',
        description: 'Launch a Nuxt e-commerce or content app.',
        icon: 'ai-color ai-nuxt',
        markClass: ''
      },
      {
        slug: 'astro-starter',
        title: 'Astro Starter',
        description: 'Ship a content-driven Astro site that renders.',
        icon: 'ai-color ai-astro',
        markClass: ''
      },
      {
        slug: 'svelte-boilerplate',
        title: 'Svelte Boilerplate',
        description: 'Accelerate the deployment of Svelte applications.',
        icon: 'ai-color ai-svelte',
        markClass: ''
      },
      {
        slug: 'preact-starter',
        title: 'Preact Starter',
        description: 'Deploy a Preact app: the React API in a fraction of the bundle.',
        icon: 'ai ai-preact',
        markClass: ''
      },
      {
        slug: 'qwik-starter',
        title: 'Qwik Starter',
        description: 'Ship a resumable Qwik app that hydrates only what the reader touches.',
        icon: 'ai ai-qwik',
        markClass: ''
      }
    ]
  },
  {
    id: 'starters',
    label: 'Starter templates',
    kind: 'list',
    items: [
      {
        slug: 'static-site',
        title: 'Static Site',
        description: 'Publish a folder of built files and serve it as-is.',
        vendor: 'Acme',
        icon: 'ai ai-file',
        markClass: ''
      },
      {
        slug: 'reverse-proxy',
        title: 'Reverse Proxy',
        description: 'Front an origin you already run and pass its traffic on.',
        vendor: 'Acme',
        icon: 'ai ai-server',
        markClass: ''
      },
      {
        slug: 'api-service',
        title: 'API Service',
        description: 'Run a small HTTP API with routing and JSON responses.',
        vendor: 'Acme',
        icon: 'ai ai-code',
        markClass: ''
      },
      {
        slug: 'scheduled-job',
        title: 'Scheduled Job',
        description: 'Run a task on a schedule, with its runs and logs kept.',
        vendor: 'Acme',
        icon: 'ai ai-clock',
        markClass: ''
      },
      {
        slug: 'ai-inference',
        title: 'AI Inference',
        description: 'Serve a model behind an endpoint that streams its answers.',
        vendor: 'Acme',
        icon: 'ai ai-bolt',
        markClass: ''
      },
      {
        slug: 'image-optimization',
        title: 'Image Optimization',
        description: 'Resize and compress images on request, cached after the first.',
        vendor: 'Acme',
        icon: 'ai ai-image',
        markClass: ''
      },
      {
        slug: 'storefront',
        title: 'Storefront',
        description: 'A server-rendered commerce storefront with cart and checkout.',
        vendor: 'Acme',
        icon: 'ai ai-shopping-cart',
        markClass: ''
      },
      {
        slug: 'multi-tenant-app',
        title: 'Multi-tenant App',
        description: 'One codebase that serves each tenant on its own domain.',
        vendor: 'Acme',
        icon: 'ai ai-users',
        markClass: ''
      },
      {
        slug: 'auth-gateway',
        title: 'Auth Gateway',
        description: 'Check a token before a request reaches the service behind it.',
        vendor: 'Acme',
        icon: 'ai ai-lock',
        markClass: ''
      },
      {
        slug: 'database-app',
        title: 'Database App',
        description: 'A starter wired to a database, with a table and its queries.',
        vendor: 'Acme',
        icon: 'ai ai-database',
        markClass: ''
      },
      {
        slug: 'blog',
        title: 'Blog',
        description: 'A content site with posts, tags and a feed.',
        vendor: 'Community',
        icon: 'ai ai-pencil',
        markClass: ''
      },
      {
        slug: 'landing-page',
        title: 'Landing Page',
        description: 'A single page with a hero, features and a sign-up form.',
        vendor: 'Community',
        icon: 'ai ai-desktop',
        markClass: ''
      },
      {
        slug: 'docs-site',
        title: 'Documentation Site',
        description: 'Searchable docs with versioned sections.',
        vendor: 'Community',
        icon: 'ai ai-book',
        markClass: ''
      },
      {
        slug: 'status-page',
        title: 'Status Page',
        description: 'Publish uptime and incidents for the services you run.',
        vendor: 'Community',
        icon: 'ai ai-chart-line',
        markClass: ''
      }
    ]
  },
  {
    id: 'frameworks',
    label: 'All frameworks',
    kind: 'list',
    items: [
      {
        slug: 'opennextjs-starter',
        title: 'OpenNext Starter',
        description: 'Deploy Next.js through the OpenNext adapter, server routes included.',
        vendor: '',
        icon: 'ai-color ai-nextjs',
        markClass: '[[data-theme=dark]_&]:invert'
      },
      {
        slug: 'nitro-starter',
        title: 'Nitro Starter',
        description: 'Deploy a Nitro server build, the engine behind Nuxt, on its own.',
        vendor: '',
        icon: 'ai ai-server',
        markClass: ''
      },
      {
        slug: 'gatsby-starter',
        title: 'Gatsby Starter',
        description: 'Publish a Gatsby site built at deploy time and served worldwide.',
        vendor: '',
        icon: 'ai ai-gatsby',
        markClass: ''
      },
      {
        slug: 'docusaurus-starter',
        title: 'Docusaurus Starter',
        description: 'Publish a Docusaurus documentation site.',
        vendor: '',
        icon: 'ai ai-docusaurus',
        markClass: ''
      },
      {
        slug: 'vitepress-starter',
        title: 'VitePress Starter',
        description: 'Publish a VitePress documentation site.',
        vendor: '',
        icon: 'ai ai-vitepress',
        markClass: ''
      },
      {
        slug: 'vuepress-starter',
        title: 'VuePress Starter',
        description: 'Publish a VuePress documentation site.',
        vendor: '',
        icon: 'ai ai-vuepress',
        markClass: ''
      },
      {
        slug: 'hugo-starter',
        title: 'Hugo Starter',
        description: 'Deploy a Hugo site with thousands of pages built in seconds.',
        vendor: '',
        icon: 'ai ai-hugo',
        markClass: ''
      },
      {
        slug: 'jekyll-starter',
        title: 'Jekyll Starter',
        description: 'Publish a Jekyll site straight from its source.',
        vendor: '',
        icon: 'ai ai-jekyll',
        markClass: ''
      },
      {
        slug: 'hexo-starter',
        title: 'Hexo Starter',
        description: 'Publish a Hexo blog.',
        vendor: '',
        icon: 'ai ai-hexo',
        markClass: ''
      },
      {
        slug: 'eleventy-starter',
        title: 'Eleventy Starter',
        description: 'Publish an Eleventy site with no framework runtime shipped to the reader.',
        vendor: '',
        icon: 'ai ai-eleventy',
        markClass: ''
      },
      {
        slug: 'stencil-starter',
        title: 'Stencil Starter',
        description: 'Build framework-agnostic web components with Stencil.',
        vendor: '',
        icon: 'ai ai-code',
        markClass: ''
      },
      {
        slug: 'html-starter',
        title: 'Static HTML Starter',
        description: 'Serve a folder of HTML, CSS and JavaScript with no build step.',
        vendor: '',
        icon: 'ai-color ai-html',
        markClass: ''
      },
      {
        slug: 'javascript-starter',
        title: 'JavaScript Starter',
        description: 'Run plain JavaScript with no framework, only a handler.',
        vendor: '',
        icon: 'ai-color ai-javascript',
        markClass: ''
      },
      {
        slug: 'typescript-starter',
        title: 'TypeScript Starter',
        description: 'Run a TypeScript handler, compiled on build.',
        vendor: '',
        icon: 'ai-color ai-typescript',
        markClass: ''
      },
      {
        slug: 'rustwasm-starter',
        title: 'Rust WASM Starter',
        description: 'Compile Rust to WebAssembly and run it.',
        vendor: '',
        icon: 'ai ai-microchip',
        markClass: ''
      },
      {
        slug: 'emscripten-starter',
        title: 'Emscripten Starter',
        description: 'Bring C or C++, compiled to WebAssembly with Emscripten.',
        vendor: '',
        icon: 'ai ai-microchip',
        markClass: ''
      }
    ]
  }
]
