import type {
  TemplateBrowserCategory,
  TemplateBrowserFramework,
  TemplateBrowserTemplate
} from './template-browser.vue'

const template = (
  slug: string,
  title: string,
  category: TemplateBrowserCategory,
  framework: TemplateBrowserFramework,
  icon: string,
  description: string,
  updated: string
): TemplateBrowserTemplate => ({
  id: slug,
  title,
  category,
  framework,
  icon,
  description,
  updated,
  repository: `example-org/templates/${slug}`
})

export const sampleTemplates: TemplateBrowserTemplate[] = [
  template(
    'next-starter',
    'Next.js Starter',
    'frameworks',
    'next',
    'ai-color ai-nextjs',
    'A Next.js app with server rendering and static pages, ready to deploy.',
    'Oct 28, 2026'
  ),
  template(
    'astro-blog',
    'Astro Blog',
    'frameworks',
    'astro',
    'ai-color ai-astro',
    'A content-first blog with Markdown posts, an RSS feed and a sitemap.',
    'Oct 21, 2026'
  ),
  template(
    'nuxt-store',
    'Nuxt Storefront',
    'frameworks',
    'nuxt',
    'ai-color ai-nuxt',
    'A product catalog with a cart, rendered on the server and cached close to buyers.',
    'Oct 14, 2026'
  ),
  template(
    'angular-dashboard',
    'Angular Dashboard',
    'frameworks',
    'angular',
    'ai-color ai-angular',
    'A single-page admin dashboard with routing and lazy-loaded modules.',
    'Sep 30, 2026'
  ),
  template(
    'hugo-docs',
    'Hugo Docs',
    'frameworks',
    'hugo',
    'ai ai-hugo',
    'A documentation site with search, versioned sections and dark mode.',
    'Sep 22, 2026'
  ),
  template(
    'static-site',
    'Static Site',
    'starters',
    'vite',
    'ai ai-edge-storage',
    'Publish a folder of built files and serve it from the closest location.',
    'Nov 2, 2026'
  ),
  template(
    'reverse-proxy',
    'Reverse Proxy',
    'starters',
    'javascript',
    'ai ai-edge-connectors',
    'Front an origin you already run and pass every request on to it.',
    'Oct 30, 2026'
  ),
  template(
    'rest-api',
    'REST API',
    'starters',
    'hono',
    'ai ai-hono',
    'A small JSON API with routing, validation and a key-value store.',
    'Oct 18, 2026'
  ),
  template(
    'hello-function',
    'Hello Function',
    'functions',
    'javascript',
    'ai ai-edge-functions',
    'The smallest function that answers a request, to see how a deploy works.',
    'Nov 4, 2026'
  ),
  template(
    'ab-test',
    'A/B Test',
    'functions',
    'javascript',
    'ai ai-edge-functions',
    'Split traffic between two versions of a page with a sticky cookie.',
    'Oct 9, 2026'
  ),
  template(
    'geo-redirect',
    'Geo Redirect',
    'functions',
    'javascript',
    'ai ai-edge-functions',
    'Send visitors to the regional version of a site from their location.',
    'Sep 27, 2026'
  )
]
