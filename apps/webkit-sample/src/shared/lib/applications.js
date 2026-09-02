// The applications the sample is seeded with.
//
// Extracted from components/Applications.vue for the same reason the workloads were
// (./workloads.js): the deployment history names the resource each deployment
// targeted, and a resource named by hand in a second file is a name that drifts —
// worse here than for a workload, because the row LINKS to `/applications/:id`, so a
// stale id is a dead link rather than a cosmetic mismatch.
//
// Each app is git-backed: it points at a `repository` + `branch` and is built from a
// framework `preset` (./presets.js), deployed by GitHub Actions running the Azion
// CLI. The first row mirrors the real reference repo gab-az/webkit-sample-vue (id,
// preset, domain from its azion/azion.json).
//
// The list page still owns its own copy (`ref([...APPLICATIONS])`): it deletes rows,
// and a page mutating a shared module-level array would leak that into every other
// surface reading it.
import { daysAgo, formatListDate } from './dates'
import { authorAt, emailOf } from './people'

/**
 * The seeded applications, in list order.
 *
 * `modifiedAt` is the real instant — the Last Modified filter compares it, the cell
 * renders it relative, and `lastModified` (the sortable / exportable display string)
 * is derived from it by one formatter instead of being hand-written per row.
 */
export const APPLICATIONS = [
  {
    id: '1784552864',
    name: 'webkit-sample-vue',
    preset: 'vue',
    repository: 'gab-az/webkit-sample-vue',
    branch: 'main',
    domainName: 'e7b4verynr.azion.run',
    infrastructure: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(2)
  },
  {
    id: '9823746510',
    name: 'react-dashboard',
    preset: 'react',
    repository: 'acme/react-dashboard',
    branch: 'main',
    domainName: 'd9m8j2k4l5.azion.run',
    infrastructure: 'Staging',
    status: 'Active',
    modifiedAt: daysAgo(375)
  },
  {
    id: '7658392017',
    name: 'analytics-pro',
    preset: 'next',
    repository: 'acme/analytics-pro',
    branch: 'main',
    domainName: 'q7w8e9r0t1.azion.run',
    infrastructure: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(320)
  },
  {
    id: '4532109876',
    name: 'ecommerce-v2',
    preset: 'nuxt',
    repository: 'shopco/ecommerce-v2',
    branch: 'develop',
    domainName: 'y6u7i8o9p0.azion.run',
    infrastructure: 'Development',
    status: 'Inactive',
    modifiedAt: daysAgo(250)
  },
  {
    id: '1122334455',
    name: 'mobile-app',
    preset: 'svelte',
    repository: 'acme/mobile-app',
    branch: 'main',
    domainName: 'a1s2d3f4g5.azion.run',
    infrastructure: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(190)
  },
  {
    id: '9988776655',
    name: 'marketing-site',
    preset: 'astro',
    repository: 'acme/marketing-site',
    branch: 'main',
    domainName: 'z9x8c7v6b5.azion.run',
    infrastructure: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(141)
  },
  {
    id: '3344556677',
    name: 'internal-tools',
    preset: 'angular',
    repository: 'acme/internal-tools',
    branch: 'develop',
    domainName: 'n0m9b8v7c6.azion.run',
    infrastructure: 'Development',
    status: 'Active',
    modifiedAt: daysAgo(88)
  },
  {
    id: '5566778899',
    name: 'blog-platform',
    preset: 'astro',
    repository: 'acme/blog-platform',
    branch: 'main',
    domainName: 'k1l2m3n4o5.azion.run',
    infrastructure: 'Staging',
    status: 'Inactive',
    modifiedAt: daysAgo(63)
  },
  {
    id: '6677889900',
    name: 'docs-portal',
    preset: 'vue',
    repository: 'acme/docs-portal',
    branch: 'main',
    domainName: 'p9o8i7u6y5.azion.run',
    infrastructure: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(47)
  },
  {
    id: '7788990011',
    name: 'status-page',
    preset: 'svelte',
    repository: 'acme/status-page',
    branch: 'main',
    domainName: 'm4n5b6v7c8.azion.run',
    infrastructure: 'Staging',
    status: 'Active',
    modifiedAt: daysAgo(21)
  },
  {
    id: '8899001122',
    name: 'auth-service',
    preset: 'next',
    repository: 'acme/auth-service',
    branch: 'main',
    domainName: 't1r2e3w4q5.azion.run',
    infrastructure: 'Production',
    status: 'Active',
    modifiedAt: daysAgo(12)
  },
  {
    id: '9900112233',
    name: 'legacy-api',
    preset: 'react',
    repository: 'acme/legacy-api',
    branch: 'develop',
    domainName: 'g6h7j8k9l0.azion.run',
    infrastructure: 'Development',
    status: 'Inactive',
    modifiedAt: daysAgo(5)
  }
].map((app, index) => {
  // The Last Modified avatar comes from the shared team roster (./people.js),
  // assigned round-robin per row; the address is derived from the name.
  const person = authorAt(index)
  return {
    ...app,
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(app.modifiedAt)
  }
})

/** A seeded application by id, or `undefined`. */
export const applicationById = (id) => APPLICATIONS.find((app) => app.id === String(id))

/** The id of a seeded application by NAME, or `''`. Deployment settings bind by name, so
 *  this is what turns a binding into a link to the resource's own page. */
export const applicationIdByName = (name) =>
  APPLICATIONS.find((app) => app.name === name)?.id ?? ''

/** The application at `index`, wrapping round — the round-robin every list uses. */
export const applicationAt = (index) => APPLICATIONS[index % APPLICATIONS.length]
