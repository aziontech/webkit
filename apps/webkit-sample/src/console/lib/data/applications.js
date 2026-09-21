// The applications the sample is seeded with.
//
// Extracted from ../../pages/applications/Applications.vue for the same reason the
// workloads were (./workloads.js): the deployment history names the resource each
// deployment targeted, and a resource named by hand in a second file is a name that drifts
// — worse here than for a workload, because the row LINKS to `/applications/:id`, so a
// stale id is a dead link rather than a cosmetic mismatch.
//
// ── THE AXIS THIS SEED EXISTS TO SHOW: `source` ──
//
// Every seeded application used to be git-backed, which made the list answer one question
// ("which framework?") and hide the one a reader actually arrives with: I have no files
// here yet — how does code get in? There are three answers, and the list carries all of
// them so each has somewhere to be seen:
//
//   git        a repository Azion watches. Every push to `branch` ships.
//   cli        no repository. The reader pushes from their own terminal with
//              `azion link` + `azion deploy`, and the application's page tells them how
//              (../../components/application/GetStartedCli.vue). A project dropped on
//              /drop lands here too: it has no repo, and the CLI is how it updates.
//   platform   Azion built it. `hello-edge` is the starter the platform provisions —
//              a Function that returns the page, an instance of it, and a rule that
//              redirects — so a reader who asks for nothing still lands somewhere that
//              already works and can be read.
//
// IT IS NOT A COLUMN. `source` decides BEHAVIOUR — which repository a row shows (none, for
// the two that have none), and whether the application's Build tab offers a repository
// connection or the CLI commands. The list does not spend a column on it, because the
// Repository column already answers the only question a list can usefully ask: a repo, or
// an em dash. A Source chip beside that said the same thing twice.
//
// It replaces `infrastructure: Production | Staging | Development`, which was a flat label
// pretending to be an environment: it spelled Stage as "Staging", offered a "Development"
// that is not an environment this platform has, and belonged to a DEPLOYMENT anyway — an
// application does not live in an environment, a deployment of it lands in one
// (./environments.js).
//
// Seven frameworks appear TWICE, once git-backed and once CLI-only, because the pair is
// the point: the same stack reached two ways.
//
// The list page still owns its own copy (`ref([...APPLICATIONS])`): it deletes rows, and a
// page mutating a shared module-level array would leak that into every other surface
// reading it.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

/**
 * The seeded applications, in list order.
 *
 * `modifiedAt` is the real instant — the Last Modified filter compares it, the cell
 * renders it relative, and `lastModified` (the sortable / exportable display string)
 * is derived from it by one formatter instead of being hand-written per row.
 *
 * `repository` and `branch` are `''` for anything that is not `source: 'git'`. They are
 * left empty rather than filled with a plausible-looking repo, because a CLI-linked
 * application genuinely has none and a row that invents one is a row that lies about the
 * only thing this list is trying to show.
 */
export const APPLICATIONS = [
  // The real reference repo, down to its id, preset and domain (azion/azion.json).
  {
    id: '1784552864',
    name: 'webkit-sample-vue',
    preset: 'vue',
    source: 'git',
    repository: 'gab-az/webkit-sample-vue',
    branch: 'main',
    domainName: 'e7b4verynr.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(2)
  },
  // THE PLATFORM STARTER. Nobody authored this: a Function that returns the page, an
  // instance of it on the application, and a rule that redirects — provisioned so a reader
  // with no code at all still lands on something that serves and can be read.
  {
    id: '2041778390',
    name: 'hello-edge',
    preset: 'javascript',
    source: 'platform',
    repository: '',
    branch: '',
    domainName: 'h3l1oedge42.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(1)
  },
  // The static pair — the same site, once watched and once pushed by hand.
  {
    id: '3344556677',
    name: 'edgeflow-site',
    preset: 'html',
    source: 'git',
    repository: 'edgeflow/edgeflow-site',
    branch: 'main',
    domainName: 'w2e3r4t5y6.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(4)
  },
  {
    id: '8899001122',
    name: 'edgeflow-docs',
    preset: 'html',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'u7i8o9p0a1.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(6)
  },
  // Next.js
  {
    id: '7658392017',
    name: 'analytics-pro',
    preset: 'next',
    source: 'git',
    repository: 'acme/analytics-pro',
    branch: 'main',
    domainName: 'q7w8e9r0t1.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(320)
  },
  {
    id: '5120983746',
    name: 'analytics-edge',
    preset: 'next',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'z1x2c3v4b5.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(17)
  },
  // React
  {
    id: '9823746510',
    name: 'react-dashboard',
    preset: 'react',
    source: 'git',
    repository: 'acme/react-dashboard',
    branch: 'main',
    domainName: 'd9m8j2k4l5.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(375)
  },
  // Retired, and the one resource in the account with nothing deployable: its only
  // version is a draft that was never built (./releases.js `NO_READY_VERSION`).
  {
    id: '9900112233',
    name: 'legacy-api',
    preset: 'react',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'g6h7j8k9l0.azion.run',
    status: 'Inactive',
    modifiedAt: daysAgo(5)
  },
  // Vue — the CLI half of the pair the reference repo opens.
  {
    id: '6677889900',
    name: 'docs-portal',
    preset: 'vue',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'p9o8i7u6y5.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(47)
  },
  // Nuxt
  {
    id: '4532109876',
    name: 'ecommerce-v2',
    preset: 'nuxt',
    source: 'git',
    repository: 'shopco/ecommerce-v2',
    branch: 'develop',
    domainName: 'y6u7i8o9p0.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(250)
  },
  {
    id: '6284013975',
    name: 'ecommerce-storefront',
    preset: 'nuxt',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'n4m5b6v7c8.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(33)
  },
  // Astro
  {
    id: '9988776655',
    name: 'marketing-site',
    preset: 'astro',
    source: 'git',
    repository: 'acme/marketing-site',
    branch: 'main',
    domainName: 'z9x8c7v6b5.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(141)
  },
  {
    id: '5566778899',
    name: 'blog-platform',
    preset: 'astro',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'k1l2m3n4o5.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(63)
  },
  // Svelte
  {
    id: '7788990011',
    name: 'status-page',
    preset: 'svelte',
    source: 'git',
    repository: 'acme/status-page',
    branch: 'main',
    domainName: 'm4n5b6v7c8.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(21)
  },
  {
    id: '1122334455',
    name: 'mobile-app',
    preset: 'svelte',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'a1s2d3f4g5.azion.run',
    status: 'Active',
    modifiedAt: daysAgo(190)
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
