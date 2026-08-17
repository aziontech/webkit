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
    tech: 'solidjs',
    title: 'SolidJS Starter',
    label: 'SolidJS',
    description: 'Build a fine-grained reactive SolidJS app on the edge.',
    icon: 'ai-cor ai-solidjs',
    color: '#4f88c6',
    useCases: ['ai'],
    tag: 'SPA',
    hint: [{ text: 'Fine-grained reactivity, no virtual DOM' }]
  },
  {
    tech: 'redwood',
    title: 'RedwoodJS Boilerplate',
    label: 'RedwoodJS',
    description: 'Deploy a full-stack RedwoodJS application on the edge.',
    icon: 'ai-cor ai-redwood',
    color: '#bf4722',
    useCases: ['ecommerce', 'multi-tenant'],
    tag: 'SSR',
    hint: [{ text: 'Full-stack React with an API side' }]
  },
  {
    tech: 'flutter',
    title: 'Flutter Web',
    label: 'Flutter',
    description: 'Serve a cross-platform Flutter web build from the edge.',
    icon: 'ai-cor ai-flutter',
    color: '#54c5f8',
    useCases: ['marketing'],
    tag: 'Static',
    hint: [{ code: 'flutter build web' }, { text: ' served from the edge' }]
  }
]

// A chosen framework → the deploy flow's catalog slug. Techs with no dedicated demo
// template fall back to the closest available boilerplate.
const TECH_TO_SLUG = {
  next: 'next-boilerplate',
  react: 'react-boilerplate',
  vue: 'vue-boilerplate',
  angular: 'angular-boilerplate',
  astro: 'astro-starter',
  svelte: 'svelte-boilerplate',
  nuxt: 'nuxt-ecommerce',
  solidjs: 'solidjs-starter',
  redwood: 'redwood-boilerplate',
  flutter: 'flutter-web'
}

/**
 * Where picking a framework goes — the deploy flow, cloning that catalog template.
 * One destination for both surfaces: /create's catalog card and Applications' own
 * first-use row start the identical flow, because they are the identical choice.
 */
export const deployTemplateRoute = (tech) => ({
  path: '/deploy',
  query: { template: TECH_TO_SLUG[tech] ?? 'nuxt-ecommerce' }
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
