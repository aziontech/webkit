// The reader's own repositories, per connected account — the source list behind the
// Git step.
//
// This IS the Git step's only path now. Importing from Git means Azion watches the
// repository and ships every push to it, so the account that owns the code has to be
// connected; the paste-a-URL field the step used to lead with promised an import that
// stopped at the first private repository. See ./application-flows.js.
//
// Each row carries the colored brand logo (`ai-cor ai-*` from @aziontech/icons) of the
// framework it was scaffolded from, which is also what seeds the build preset when the
// row is chosen (../../shared/lib/provisioning.js maps `framework` → preset).

/** Git accounts already linked, in the order they were connected. */
export const GIT_SCOPES = [{ label: 'git-account', value: 'git-account' }]

/**
 * Repositories for the selected account. A connected account has more than one — a
 * single row in a full-height box reads as a list that failed to load the rest.
 */
export const GIT_REPOSITORIES = [
  { name: 'next-js-boilerplate', age: '2 hours ago', icon: 'ai-cor ai-next', framework: 'next' },
  { name: 'azion-docs-site', age: '5 hours ago', icon: 'ai-cor ai-astro', framework: 'astro' },
  {
    name: 'edge-functions-playground',
    age: 'yesterday',
    icon: 'ai-cor ai-vue',
    framework: 'vue'
  },
  { name: 'storefront-checkout', age: '3 days ago', icon: 'ai-cor ai-react', framework: 'react' },
  {
    name: 'observability-dashboard',
    age: '6 days ago',
    icon: 'ai-cor ai-svelte',
    framework: 'svelte'
  },
  { name: 'marketing-landing', age: '2 weeks ago', icon: 'ai-cor ai-nuxt', framework: 'nuxt' },
  { name: 'internal-admin', age: 'last month', icon: 'ai-cor ai-angular', framework: 'angular' }
]
