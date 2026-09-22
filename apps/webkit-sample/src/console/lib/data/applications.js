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
// here yet — how does code get in? There are four answers, and the list carries all of
// them so each has somewhere to be seen:
//
//   git        a repository Azion watches. Every push to `branch` ships.
//   cli        no repository. The reader pushes from their own terminal with
//              `azion link` + `azion deploy`, and the application's page tells them how
//              (../../components/application/GetStarted.vue).
//   drop       a project handed over as FILES — dragged onto /drop, Overview or the
//              Creation Center, or picked through the same control. It has no repository
//              either, and it updates the same two ways `cli` does; what it carries that
//              `cli` cannot is where it came from. An application with no repository has
//              nothing to name under Source, so the one that arrived this way names the
//              gesture that made it (../../components/application/ApplicationSummary.vue)
//              — and its page keeps taking a drop, so the gesture that created it is also
//              the one that updates it.
//   platform   Azion built it. `hello-edge` is the starter the platform provisions —
//              a Function that returns the page, an instance of it, and a rule that
//              redirects — so a reader who asks for nothing still lands somewhere that
//              already works and can be read.
//
// IT IS NOT A COLUMN. `source` decides BEHAVIOUR — which repository a row shows (none, for
// the two that have none), whether the application's Build tab offers a repository
// connection or reports one, and whether its Overview carries the CLI commands at all.
// The list does not spend a column on it, because the
// Repository column already answers the only question a list can usefully ask: a repo, or
// an em dash. A Source chip beside that said the same thing twice.
//
// It replaces `infrastructure: Production | Staging | Development`, which was a flat label
// pretending to be an environment: it spelled Stage as "Staging", offered a "Development"
// that is not an environment this platform has, and belonged to a DEPLOYMENT anyway — an
// application does not live in an environment, a deployment of it lands in one
// (./environments.js).
//
// Seven frameworks appear TWICE, once git-backed and once with no repository, because the
// pair is the point: the same stack reached two ways. Two of the second halves arrived as
// a drop rather than through the CLI, so the surface that reports where an application
// came from has something to report without the reader having to make one first.
//
// ── NO `status` FIELD, BY THE SAME REASONING ──
//
// An application has no status of its own. What every surface reports under "Status" is
// the state of the DEPLOYMENT that last shipped it — Ready, Building, Queued, Error, Draft
// (./deployments.js) — so the list column, its filter and the application's own summary
// all read that record (`latestApplicationDeployment` in ./deployment-history.js) instead
// of a flag stored here. The seed used to carry `status: Active | Inactive`, which named
// the wrong fact twice over: it was the application's `active` SETTING wearing the word a
// deployment owns, so a list of applications could say "Active" about one whose last build
// had failed.
//
// `active` survives as what it actually is — the switch in Main Settings ("when disabled,
// the application stops serving traffic"). It is absent on a row that is on, and only
// `legacy-api` carries `active: false`.
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
 *
 * `active` is the Main Settings switch, absent when it is on. It is not a status: the
 * status a list shows is the newest deployment's (see the note above).
 *
 * `domainName` is the hostname Azion generates and always answers on; `customDomains` are
 * the reader's own addresses bound to it — `{ id, domain, environment, certificate }[]`,
 * `certificate: ''` meaning the free platform one — and the first of them is where traffic
 * arrives. A domain names the ENVIRONMENT it answers in for the same reason a workload's
 * does (./environments.js): an application is deployed through a workload, and it is the
 * environment that decides which Deployment Settings can serve it.
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
    modifiedAt: daysAgo(1)
  },
  // The static pair — the same site, once watched and once handed over as a folder.
  {
    id: '3344556677',
    name: 'edgeflow-site',
    preset: 'html',
    source: 'git',
    repository: 'edgeflow/edgeflow-site',
    branch: 'main',
    domainName: 'w2e3r4t5y6.azion.run',
    customDomains: [
      {
        id: 'domain-edgeflow-www',
        domain: 'www.edgeflow.com',
        environment: 'Production',
        certificate: 'cert-8801'
      },
      { id: 'domain-edgeflow-apex', domain: 'edgeflow.com', environment: 'Stage', certificate: '' }
    ],
    modifiedAt: daysAgo(4)
  },
  {
    id: '8899001122',
    name: 'edgeflow-docs',
    preset: 'html',
    source: 'drop',
    repository: '',
    branch: '',
    domainName: 'u7i8o9p0a1.azion.run',
    customDomains: [
      {
        id: 'domain-edgeflow-docs',
        domain: 'docs.edgeflow.com',
        environment: 'Production',
        certificate: 'cert-8801'
      }
    ],
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
    active: false,
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
    customDomains: [
      {
        id: 'domain-shopco-shop',
        domain: 'shop.shopco.com',
        environment: 'Production',
        certificate: ''
      }
    ],
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
    modifiedAt: daysAgo(141)
  },
  {
    id: '5566778899',
    name: 'blog-platform',
    preset: 'astro',
    source: 'drop',
    repository: '',
    branch: '',
    domainName: 'k1l2m3n4o5.azion.run',
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
export const applicationIdByName = (name) => APPLICATIONS.find((app) => app.name === name)?.id ?? ''

/** The application at `index`, wrapping round — the round-robin every list uses. */
export const applicationAt = (index) => APPLICATIONS[index % APPLICATIONS.length]
