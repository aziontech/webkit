// Overview, first access — the three CORE resources, and the three DOORS the empty
// account is offered. They are not the same list, and that is the point.
//
// ── THE CORE RESOURCES (the list) ──
//
// Domains, Workloads and Applications. They are the console's core because they are
// the three things every other product hangs off: a name that resolves, a public
// entry that serves it, and the thing being served. The Overview filter offers
// exactly these three (Home.vue's filter offers a wider set today; this is the
// scoped version), so the reader's first decision is between three doors and not a
// catalog.
//
// ── THE DOORS (`firstUseDoors`) ──
//
// A door is what an empty account can usefully DO, and that is not one door per
// resource type. A Workload without an application to serve is a hostname pointing at
// nothing, so "go live" as a first move asks the reader to build the middle of the
// chain first. Its slot goes to the thing that actually shortens the first deploy:
// onboarding the AI agent the reader already codes with. So the row is
//
//   Applications  → hand the reader to the platform's real create flow
//   Domains       → take the name here, in the card
//   Agent         → copy a setup prompt into their AI tool
//
// Workloads keeps its card (`coreResources[].card`) because the RETURNING Overview
// still needs it: a core resource the account does not own yet shows its door in
// place of the table. It just is not one of the three first-access doors.
//
// ── WHY EACH CARD CARRIES ART AND NOT A GLYPH ──
//
// On a first access the reader has never seen the product. A 16px icon beside the
// title can only repeat the title; a scene can show the anatomy. The mapping is a
// design choice, swappable in one line (`illustration`):
//
//   Applications → COMPOSED  `composed:frameworks` — the frameworks the reader already
//                            builds with, arriving at a live site. `build` said "a thing
//                            gets built", which the title already says.
//   Domains      → COMPOSED  `composed:domain` — name → zone → site, with an HTTPS pill
//                            over the seam. `path` draws release branches and clips its
//                            outer pills.
//   Agent        → COMPOSED  `composed:agents` — the editors the reader codes in,
//                            pointed at a session that knows how to ship here.
//                            `ai-inference` promised a chat, which is not the offer.
//   Workloads    → `waf-rules`   traffic entering through the edge on its way in. The one
//                            door still named from the registry, and the only one the
//                            first access does not show.
//
// `build`, `deploy` and `ship` are the SAME scene distinguished only by their pill
// (Build / Deploy / Ship), so never put two of them in one row — it reads as a
// rendering bug rather than as two different things.
//
// ── THE METRICS RULE ──
//
// Usage is NOT on this screen. An account with no resources has nothing to meter, so
// four cards reading `0` teach the reader that the console is a dashboard for
// somebody else's account. Metrics appear on the first resource — see
// `hasAnyResource` in HomeEmptyState.vue — and they are still zero then, which is
// honest, because by then zero is a measurement rather than a placeholder.

/** Usage cards, shown only once the account owns at least one resource. */
export const usageMetrics = [
  {
    label: 'Data Transferred',
    value: '0',
    unit: 'GB',
    percent: 0,
    hint: 'Total bytes delivered across all your resources.'
  },
  {
    label: 'Requests / Second',
    value: '0',
    unit: '/s',
    percent: 0,
    hint: 'Average requests handled per second in the selected window.'
  },
  {
    label: 'Bandwidth Saving',
    value: '0',
    unit: 'MB',
    percent: 0,
    hint: 'Bytes served from cache instead of your origin.'
  },
  {
    label: 'Data Offload',
    value: '0',
    unit: '%',
    percent: 0,
    hint: 'Share of traffic offloaded from your origin to the edge.'
  }
]

const ACTION_COLUMN = { id: 'actions', kind: 'action', hideable: false }
const MODIFIED_COLUMN = {
  accessorKey: 'lastModified',
  header: 'Last Modified',
  grow: 2,
  enableSorting: true
}

/**
 * The three core resources. `card` is the first-access door (art + copy + the verb on
 * its control); `columns` is how the resource lists once it exists; `seed` is the row
 * the prototype creates so the returning Overview can be seen without a backend.
 */
export const coreResources = [
  {
    id: 'applications',
    label: 'Applications',
    icon: 'ai ai-edge-application',
    unit: 'application',
    card: {
      illustration: 'composed:frameworks',
      title: 'Ship something new',
      description:
        'Deploy a static site or a full-stack app, with compute, AI, storage and media on the same build.',
      // `create` hands the reader to the platform's own create flow (/create) instead
      // of inventing a shortcut here. It is the main road into Azion, it is where
      // importing from Git and starting from a template already live, and a first
      // access is the worst place to teach a path that only exists on one screen.
      action: { kind: 'create', label: 'Create app' }
    },
    columns: [
      { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
      { accessorKey: 'runtime', header: 'Runtime' },
      { accessorKey: 'status', header: 'Status' },
      MODIFIED_COLUMN,
      ACTION_COLUMN
    ],
    seed: () => ({
      id: 'app-1',
      name: 'my-application',
      runtime: 'Edge runtime',
      status: 'Active',
      lastModified: 'Just now'
    })
  },
  {
    id: 'domains',
    label: 'Domains',
    icon: 'ai ai-edge-dns',
    unit: 'domain',
    card: {
      // Not a registry name: the sentinel for the scene composed in
      // ui/DomainIllustration.vue. Prefixed so it can never collide with a real asset.
      illustration: 'composed:domain',
      title: 'Add a domain',
      description:
        'Register a new one or bring your own. DNS, automatic HTTPS and DDoS protection come with it.',
      // The action is the FIELD itself: the reader already knows their domain, and
      // asking them to press Create first to then type it adds a step that carries no
      // decision. The field answers the one question a name raises — is it free — in a
      // Popover anchored to it (see HomeEmptyState.vue).
      //
      // Register then hands that name to /domains/new, seeded, because the rest of what
      // a domain needs is not something the card can ask: the environment it binds, the
      // certificate that serves it, the TLS floor (`POST /workspace/workloads`, see
      // ./lib/create-resources.js). The page returns to Overview with the domain it made,
      // which is what seeds the row below.
      action: { kind: 'domain' }
    },
    // No Environment column, though the domain does bind one (../lib/create-resources.js):
    // this table lives in the half-width Resources panel, and a fifth content column put
    // three of the five headers into ellipsis ("Envir…", "Workl…", "Last Modi…"). A
    // column whose own name does not fit is worse than an absent one.
    columns: [
      { accessorKey: 'name', header: 'Domain', principal: true, enableSorting: true },
      { accessorKey: 'workload', header: 'Workload', grow: 2 },
      { accessorKey: 'status', header: 'Status' },
      MODIFIED_COLUMN,
      ACTION_COLUMN
    ],
    // The workload is whatever the create page bound, and an em dash when it bound
    // nothing: it is an optional field there (a workload can adopt the domain later from
    // its own Domains section), so a row that always read `my-workload` would be
    // reporting a binding that does not exist.
    seed: (domain, { workload } = {}) => ({
      id: 'domain-1',
      name: domain || 'example.com',
      workload: workload || '—',
      status: 'Pending DNS',
      lastModified: 'Just now'
    })
  },
  {
    id: 'workloads',
    label: 'Workloads',
    icon: 'ai ai-workloads',
    unit: 'workload',
    card: {
      illustration: 'waf-rules',
      title: 'Go live',
      description:
        'Put traffic on a hostname you control, with TLS, edge caching and firewall on the same entry.',
      // Reached only from the RETURNING Overview (a core resource with no rows shows
      // its door). It is not a first-access door — see the header note.
      action: { kind: 'seed', label: 'Create workload' }
    },
    columns: [
      { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
      { accessorKey: 'domain', header: 'Domain', grow: 2 },
      { accessorKey: 'status', header: 'Status' },
      MODIFIED_COLUMN,
      ACTION_COLUMN
    ],
    seed: () => ({
      id: 'workload-1',
      name: 'my-workload',
      domain: 'my-workload.azion.app',
      status: 'Active',
      lastModified: 'Just now'
    })
  }
]

/** The Overview filter's options, derived so the list and the map cannot drift. */
export const coreResourceOptions = coreResources.map(({ id, label, icon }) => ({
  value: id,
  label,
  icon
}))

const cardFor = (id) => coreResources.find((resource) => resource.id === id).card

/**
 * The AGENT door. Not a resource: nothing is created, nothing appears in a list. It
 * belongs on this row because it is the move that most shortens a first deploy — the
 * reader leaves with their own editor able to ship to Azion — and because it is the
 * one door that pays off outside the console.
 *
 * Its control copies the prompt (lib/agent-onboarding.js), and copying is the whole
 * action: there is no flow to route to, and a button that opened a page to then offer
 * a copy button would be a step with no decision in it.
 */
export const agentDoor = {
  id: 'agent',
  illustration: 'composed:agents',
  title: 'Onboard your agent',
  description:
    'Give Claude, Cursor, Windsurf, Codex or OpenCode a prompt that sets your project up to deploy on Azion.',
  action: { kind: 'copy-prompt', label: 'Copy prompt' }
}

/**
 * The three doors of a first access, in reading order. Derived from the resource cards
 * above so the copy cannot drift between the first access and the returning Overview's
 * per-resource empty.
 */
export const firstUseDoors = [cardFor('applications'), cardFor('domains'), agentDoor]
