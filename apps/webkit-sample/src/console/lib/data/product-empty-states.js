// Product first use — what a module shows before it owns anything.
//
// Home's empty state answers "this account has nothing yet" for whichever
// resource is selected: an EmptyState lead plus an Item.List of the ways to
// create a first one (see components/Home.vue). This is the same idea one level
// down, in the PRODUCT's own context — the SAME shape, so a reader who met the
// empty state on Overview meets no second design one level in. Its first tier is
// that block, verbatim:
//
//   THE WAYS IN (`headline` + `lead` + `methods`) — the EmptyState lead, then the
//   two or three doors into the product as rows in the same card. They were three
//   side-by-side cards, on the argument that a vertical list ranks them; what it
//   actually cost was a second first-use design, one screen away from Home's. A
//   row carries the same three things a card did (title, one line, the verb) and
//   reads them left to right, so nothing about the alternatives is lost by
//   stacking them.
//   Each method carries its OWN glyph (`icon`), never the product's mark: three
//   identical marks stacked in a column read as a rendering bug, and the glyph
//   is the only part of a row that can say "this one is GitHub" before the title
//   is read.
//
// Every gate that CREATES or IMPORTS carries a `route` into the flow that already
// owns it — first use is the entrance to the create flow, never a second copy of it.
//
// ── AND, UNDER IT, START FAST (`startFast`) ──
//
// The screen is two tiers, in this order:
//
//   1. THE EMPTY (above) — what the product is and the doors into it. What the reader
//      needs to have read before anything else on the screen makes sense.
//   2. START FAST (`startFast`, below) — the Marketplace's own providers for this
//      product: a boilerplate or a Hello World that produces a working resource in
//      one step, each row opening the flow that installs it.
//
// The order is the argument. Tier 1 answers "what is this and how do I make one";
// tier 2 answers "make one for me". A reader who knows what they want skips straight
// to a row; a reader who does not reads the lead first. Reversed, the screen would
// open by offering to pick a framework for a product it has not named yet.
//
// This is NOT the old templates half. That one was a hand-written per-product list of
// "starting points" living beside the gates, an `Or` between them claiming the two were
// equal — a third catalog that drifted from the create page's and the Marketplace's on
// the first edit. `startFast` is a PROJECTION of a catalog that lives elsewhere: the
// framework rows are derived from lib/frameworks.js (the same array the create page
// renders, same marks, same slugs, same deploy), and the Functions rows name real
// Marketplace integrations and open the Marketplace on that entry.
//
// A product with no Marketplace offering has no `startFast`, and its screen is the
// gates card plus the agent card alone — an empty "providers" card under a module the
// Marketplace publishes nothing for would be a section that failed to load. Three
// products earn one today: Applications and Workloads (framework boilerplates, on the
// TEMPLATES tab) and Functions and Firewall (installable functions, on INTEGRATIONS).
//
// ── EVERY MODULE, NOT THREE ──
//
// This list covers every first-level module in the sidebar that owns resources: the
// three that started it (Applications, Workloads, Functions) plus Variables, Connectors,
// Custom Pages, Firewall, WAF Rules, Certificate Manager, Network Lists, Data Stream,
// Object Storage, SQL Database and Edge DNS. A module whose first use was left
// unwritten fell back to its "no rows in this scope" card — a title, a line and one
// button — which is the right shape for a list that filtered to nothing and the wrong
// one for an account that owns nothing, and it made the console's own answer to "how do
// I start" depend on which module you happened to open first.
//
// The gates are checked against the routes that exist, per module: the resource's own
// create page (`/<id>/new`, hand-written for four and generated from the API for the
// rest — lib/create-resources.js), the create flow for an import, the Marketplace for a
// catalog, and — for Variables, the one module whose create flow is a DRAWER —
// `/variables?create=variable`, which that module reads on arrival. The one door that is
// neither a form nor a command — Object Storage's S3 credentials — keeps the toast.
//
// The CLI door does not route and does not toast: it CARRIES the command (`command`), shown
// in the row as a copyable field. A door whose whole content is one line of shell had a
// button that opened nothing and said so — printing the line is strictly more than the
// button could ever do, and it is the only gate on this screen that works in the demo
// exactly as it works in production, because the clipboard is the whole flow.
//
// The Observe modules (Real-Time Metrics, Events, Purge, Edge Pulse) are deliberately
// absent: none of them owns a resource you create, so "you have none yet" is not a
// thing they can say. What they show before there is data is a chart with no series,
// which is a different problem and a different screen.
//
// Why per product and not one shared block: "create your first X" is the only
// part a generic empty state can write. Which doors exist (editor / CLI / import
// / S3 client) and what each one is called are facts about the product. A shared
// component with a `productName` prop would have to bury those in the caller
// anyway.
//
// The copy lives here and not in the component so the two are edited by different
// people: this file is microcopy (`webkit-microcopy` rules — sentence case, no
// trailing period on a title, the verb on the button says what it does), and the
// component is layout.

/**
 * A hint is authored as PARTS rather than one string so the literal keeps its
 * mono face without HTML in the copy: `{ text }` renders muted prose, `{ code }`
 * renders in the code face at full contrast. Order is the sentence's order, so a
 * hint can open with the literal (`GET/POST with no origin`) or end with it.
 *
 * `unit` is the ONE thing this product creates, singular and in the product's own
 * words (a function, a DNS zone, a bucket) — sentence case, because it names a
 * generic instance and not the Console entity the PAGE is named for. It exists
 * because the plural module name cannot be dropped into a sentence: "Creating a
 * Edge DNS" and "a new Functions resource" are both wrong, and a screen about
 * first use is the worst place to read machine-assembled English.
 *
 * `route` (on a method, and on a `startFast` row) is a real destination, and every gate
 * that CREATES or IMPORTS has one wherever the prototype owns that flow:
 *
 *   import a repository → `/create`           (the create flow's importer)
 *   create one → the resource's own create page: the hand-written flows
 *                (`/applications/new`, `/workloads/new`, `/edge-dns/new`) and the ones
 *                the generic create flow generates from the API (`/functions/new`,
 *                `/object-storage/new` — see lib/create-resources.js)
 *   start fast → the deploy flow for a framework boilerplate, or the Marketplace
 *                opened on the named entry for a Functions integration
 *
 * `primary` (on exactly one method per product) is the gate the screen RECOMMENDS — its
 * control is filled while the others stay outlined. It is the import wherever the product
 * has one, because a reader who already has code is the common case and reading three
 * descriptions to find the row that serves them is the cost of treating the three as
 * equals. Two flags in one list would be two recommendations, which is none.
 *
 * `command` (on the CLI / API gate, and there only) is the ONE line of shell that creates
 * this product's unit — `azion deploy` where the door ships a repository, `azion create
 * <noun>` where it declares a resource. A gate that carries one renders no button: the row
 * shows the command in a copyable field ($ on the left, copy on the right — see
 * components/ui/ProductFirstUse.vue), because the command IS the instruction and a button
 * labelled "View commands" beside a visible command is a step with nothing behind it.
 * One command per door, never a script: the field is a starting point the reader pastes,
 * and the docs link at the top of the card is where the flags live.
 *
 * A gate WITHOUT a `route` and without a `command` says what it would have done and that
 * the demo stops there. Exactly one door is left in that shape — Object Storage's S3
 * credentials, which are neither a form nor a command. The split exists because first use
 * is not a DESCRIPTION of the create flow, it is the entrance to it: a screen that mimicked
 * a flow the console already has is the thing this file exists to avoid.
 *
 * `startFast` (optional) is the second tier: `{ title, description, route, learnMore, items }`.
 * `route` is where the promo card sends the reader — the Marketplace TAB that actually
 * holds this product's offering (`templates` for a framework boilerplate, `integrations`
 * for an installable function). It is data and not a branch in the component because it
 * is a fact about the product, and getting it wrong lands the reader on a catalog that
 * does not contain what the card just offered.
 * `title` names the offer ONCE — it is the card's only heading, so it says whose catalog
 * the rows come from — `description` is the one line under it, and `learnMore` points at
 * the full catalog. Each `item` is `{ id, title, description, icon, action, route }`, the
 * same row anatomy as a gate, so the two tiers read as one family.
 *
 * `lead` is the EmptyState's one line under the headline: what the product IS,
 * for a reader who has never owned one. It is deliberately the same sentence
 * Home's per-resource empty state uses (components/Home.vue) wherever Home has
 * one — the two surfaces answer the same question, and answering it twice in two
 * wordings is how a console starts sounding like two products.
 */

import { frameworkBoilerplates } from './frameworks'

/**
 * The AGENT promo — the second card of tier 2, on every product's first use.
 *
 * One const rather than a line per product, because it is the one offer on this screen
 * that is not about the product: whatever module the reader is standing in, the move is
 * the same (point the editor they already code in at Azion) and so is the prompt
 * (lib/agent-onboarding.js). Nine copies of this sentence would drift on the first edit
 * and would imply nine different offers.
 *
 * It is the same offer the pill on Overview makes, deliberately: a reader who dismissed
 * the pill and then met a differently-worded version of it inside a module would read the
 * two as unrelated features.
 */
export const AGENT_PROMO = {
  title: 'Set up Azion with your agent',
  description: 'Give your editor a prompt that teaches it to build and deploy here.'
}

export const productEmptyStates = [
  {
    // Functions leads — it is the one designed in Figma, and the product where
    // "start from a template" carries the most weight.
    id: 'functions',
    label: 'Functions',
    icon: 'ai ai-edge-functions',
    headline: 'Deploy your first function',
    lead: 'Write an edge function to run serverless code close to your users.',
    unit: 'function',
    methods: [
      {
        // /functions/new is the real create page (lib/create-resources.js → the
        // `functions` descriptor, whose last section IS the code editor), so the
        // editor door opens the editor instead of a toast about it.
        id: 'editor',
        title: 'Via Editor',
        description: 'Write it in JavaScript and publish without leaving the Console.',
        action: 'Open editor',
        icon: 'pi pi-code',
        route: { path: '/functions/new' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Develop locally and deploy from your own repository.',
        command: 'azion create edge-function --name my-function',
        icon: 'pi pi-desktop'
      },
      {
        id: 'cli-import',
        title: 'From a repository',
        description: 'Bring a function you already have in Git and deploy it.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-github',
        route: { path: '/create' }
      }
    ],
    // The gate that used to say "From a template" is this whole tier now — the four
    // Application Functions the Marketplace publishes under "Testing and validation"
    // and "Content segmentation", named exactly as that catalog names them
    // (components/Marketplace.vue) so a reader who follows a row recognises what they
    // land on. `q` opens the catalog filtered to the entry; `tab` picks the
    // Integrations half, because a function is an integration and not a framework.
    startFast: {
      title: 'Start from a Marketplace function',
      description:
        'Install a ready-made edge function and get a working response before writing any code.',
      // INTEGRATIONS, not templates: what the Marketplace publishes for Functions is
      // installable functions, and they live on that tab (components/Marketplace.vue).
      route: { path: '/marketplace', query: { tab: 'integrations' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: [
        {
          id: 'hello-world',
          title: 'Hello World',
          description: 'A minimal edge function that returns a message, to see the edge run.',
          icon: 'pi pi-code',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Hello World' } }
        },
        {
          id: 'ab-tests',
          title: 'A/B Tests',
          description: 'Split traffic at the edge to validate a page, an interface or a flow.',
          icon: 'pi pi-chart-bar',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'A/B Tests' } }
        },
        {
          id: 'content-targeting',
          title: 'Content Targeting',
          description: 'Manipulate cookies and headers to build content-targeting logic.',
          icon: 'pi pi-users',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Content Targeting' } }
        },
        {
          id: 'send-to-queue',
          title: 'Send Messages to a Queue',
          description: 'Queue messages for asynchronous processing between your systems.',
          icon: 'pi pi-inbox',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Send Messages' } }
        }
      ]
    },
    learnMore: {
      label: 'How Functions work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
    }
  },
  {
    // Applications is the one the console is scoped around — it is what a Workload
    // serves and what a Function runs on — so its ways in are the platform's real
    // create flow (import a repo, run the CLI, start blank), not module-local
    // shortcuts.
    id: 'applications',
    label: 'Applications',
    icon: 'ai ai-edge-application',
    headline: 'Deploy your first application',
    lead: 'Deploy a static site or a full-stack app, with compute, AI, storage and media on the same build.',
    unit: 'application',
    // APPLICATIONS IS THE ONE PRODUCT WHOSE FIRST USE IS AN EXISTING FLOW.
    // /create already answers "start an Application": import a repository, or clone a
    // framework template, both ending in /deploy. So this screen does not describe a
    // second way in — it ROUTES into that one, and the framework catalog it used to
    // reprint below stays where it is maintained (lib/frameworks.js, rendered by the
    // create page).
    methods: [
      {
        id: 'github',
        title: 'From GitHub',
        description: 'Import a repository and Azion deploys it on every push.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-github',
        route: { path: '/create' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Run azion deploy and ship the branch you are on.',
        command: 'azion deploy',
        icon: 'pi pi-desktop'
      },
      {
        id: 'scratch',
        title: 'From scratch',
        description: 'Configure the build, the runtime and the cache.',
        action: 'Create',
        icon: 'pi pi-file',
        route: { path: '/applications/new' }
      }
    ],
    // The create page's own framework catalog, projected — not copied (see
    // `frameworkBoilerplates` in lib/frameworks.js). Each row wears the framework's
    // brand mark and opens the same /deploy the create page's card opens.
    startFast: {
      title: 'Start from a Marketplace template',
      description:
        'Clone a framework starter and Azion builds and deploys it. Nothing to configure first.',
      // TEMPLATES, not integrations: a boilerplate is a template, and the Marketplace
      // opens on that tab by default (components/Marketplace.vue). The rows below carry
      // the same frameworks the /create catalog does, so the card and the tab it opens
      // hold the same set.
      route: { path: '/marketplace', query: { tab: 'templates' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: frameworkBoilerplates()
    },
    learnMore: {
      label: 'How Applications work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/'
    }
  },
  {
    id: 'workloads',
    label: 'Workloads',
    icon: 'ai ai-workloads',
    headline: 'Deploy your first workload',
    lead: 'Create your first deploy starting from scratch, a template or importing your code.',
    unit: 'workload',
    // A Workload is what SERVES an Application, so importing code for one is the same
    // entrance Applications uses — the create flow, which ends in /deploy and produces
    // both. "From scratch" is the Workload form itself.
    methods: [
      {
        id: 'github',
        title: 'From GitHub',
        description: 'Import a repository and Azion deploys it on every push.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-github',
        route: { path: '/create' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Run azion deploy and ship the branch you are on.',
        command: 'azion deploy',
        icon: 'pi pi-desktop'
      },
      {
        id: 'scratch',
        title: 'From scratch',
        description: 'Point a domain at an application you already have.',
        action: 'Create',
        icon: 'pi pi-globe',
        route: { path: '/workloads/new' }
      }
    ],
    // The same four boilerplates, from the same array: the deploy flow a framework row
    // opens creates the Application AND the Workload that serves it, which is exactly
    // what a reader with no workloads is asking for. Two products offering one catalog
    // is right here — offering two hand-written copies of it is what was wrong before.
    startFast: {
      title: 'Start from a Marketplace template',
      description: 'Deploy a framework starter and the workload that serves it, in one step.',
      // Templates, like Applications above — same catalog, same tab.
      route: { path: '/marketplace', query: { tab: 'templates' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: frameworkBoilerplates()
    },
    learnMore: {
      label: 'How Workloads work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/workloads/'
    }
  },
  {
    // DEPLOYMENTS IS THE ONE MODULE WITH NOTHING TO CREATE.
    //
    // Every other product's first use offers a create page for the thing the list holds.
    // A deployment is not authored — it is the RECORD of having shipped something, so
    // the only honest way to fill this list is to deploy an application or compose a
    // release, and both of those live in another module. Its gates therefore leave
    // Deployments entirely, which is exactly the same shape Applications and Workloads
    // use (import a repo → /create → /deploy) rather than a fourth idea.
    //
    // The lead says the causal fact out loud — deploy something and it appears here —
    // because "no deployments yet" alone reads as a list that failed to load.
    id: 'deployments',
    label: 'Deployments',
    icon: 'ai ai-deploy-pillar',
    headline: 'Ship your first deploy',
    lead: 'Every build, release and rollback lands here. Deploy an application and the history starts.',
    unit: 'deployment',
    methods: [
      {
        id: 'github',
        title: 'From GitHub',
        description: 'Import a repository and Azion deploys it on every push.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-github',
        route: { path: '/create' }
      },
      {
        // The release composer is the one deploy path that starts INSIDE this module:
        // it picks the workloads and the resources a release carries. It needs
        // something to release, so it is the second gate and not the first.
        id: 'release',
        title: 'Compose a release',
        description: 'Pick the workloads and resources to promote in one deploy.',
        action: 'Create release',
        icon: 'pi pi-cloud-upload',
        route: { path: '/deployments/releases/new' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Run azion deploy and watch the run appear here.',
        command: 'azion deploy --auto',
        icon: 'pi pi-desktop'
      }
    ],
    // The same boilerplates Applications and Workloads offer, for the same reason: the
    // fastest way to a first deployment is to deploy something that already builds.
    startFast: {
      title: 'Start from a Marketplace boilerplate',
      description: 'Deploy a framework starter and watch the run land in this list.',
      route: { path: '/marketplace', query: { tab: 'templates' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: frameworkBoilerplates()
    },
    learnMore: {
      label: 'How deploying works on Azion',
      href: 'https://www.azion.com/en/documentation/products/deploy/'
    }
  },
  {
    id: 'edge-dns',
    label: 'Edge DNS',
    icon: 'ai ai-edge-dns',
    headline: 'Create your first DNS zone',
    lead: 'Add a zone to manage records and route traffic through Azion Edge DNS.',
    unit: 'DNS zone',
    // Both doors are the same flow here: /edge-dns/new is where a zone is declared,
    // and importing a BIND export is that form with a file instead of typed records.
    // One destination rather than a toast that stops the reader at the door.
    methods: [
      {
        id: 'create',
        title: 'New zone',
        description: 'Declare the zone, then point your registrar at Azion.',
        action: 'Create',
        icon: 'pi pi-plus',
        route: { path: '/edge-dns/new' }
      },
      {
        id: 'import',
        title: 'Import a zone file',
        description: 'Bring every record over from a BIND export in one step.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-upload',
        route: { path: '/edge-dns/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Manage zones and records as code, from your own pipeline.',
        command: 'azion create dns-zone --domain example.com',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Edge DNS works on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-dns/'
    }
  },
  {
    id: 'object-storage',
    label: 'Object Storage',
    icon: 'ai ai-edge-storage',
    headline: 'Create your first bucket',
    lead: 'Create a bucket to store and serve static assets from the edge.',
    unit: 'bucket',
    methods: [
      {
        // The bucket form the generic create flow generates from the API's own
        // properties (lib/create-resources.js → `object-storage`).
        id: 'create',
        title: 'New bucket',
        description: 'Name it, pick the access level and start uploading.',
        action: 'Create',
        icon: 'pi pi-plus',
        route: { path: '/object-storage/new' }
      },
      {
        id: 'cli',
        title: 'Via CLI',
        description: 'Sync a local folder with the Azion CLI, in your own pipeline.',
        command: 'azion storage sync ./dist --bucket my-bucket',
        icon: 'pi pi-desktop'
      },
      {
        id: 's3',
        title: 'S3-compatible client',
        description: 'Point a client you already use at Azion.',
        action: 'View credentials',
        icon: 'pi pi-key'
      }
    ],
    learnMore: {
      label: 'How Object Storage works on Azion',
      href: 'https://www.azion.com/en/documentation/products/store/edge-storage/'
    }
  },
  {
    id: 'sql-database',
    label: 'SQL Database',
    icon: 'ai ai-edge-sql',
    headline: 'Create your first database',
    lead: 'Store relational and vector data at the edge, close to the code that reads it.',
    unit: 'database',
    methods: [
      {
        id: 'create',
        title: 'New database',
        description: 'Name it and start writing tables from the Console.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/sql-database/new' }
      },
      {
        id: 'function',
        title: 'From a Function',
        description: 'Query it with the SQL client inside an edge function.',
        action: 'Open editor',
        icon: 'pi pi-code',
        route: { path: '/functions/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Create databases and run migrations from your own pipeline.',
        command: 'azion sql create my-db',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How SQL Database works on Azion',
      href: 'https://www.azion.com/en/documentation/products/store/edge-sql/'
    }
  },
  {
    id: 'variables',
    label: 'Variables',
    icon: 'ai ai-variables',
    headline: 'Add your first variable',
    lead: 'Keep configuration and secrets out of your code and scoped per environment.',
    unit: 'variable',
    // Variables is the one module whose create flow is a DRAWER and not a page
    // (components/AddVariableDrawer.vue). Both doors route to `/variables?create=variable`,
    // which the module reads on arrival and opens that drawer — so the gate works from
    // the module's own first use AND from the gallery, and the URL is shareable, which a
    // click handler on a local ref would not be.
    methods: [
      {
        id: 'create',
        title: 'New variable',
        description: 'Add a key and value, and pick the environments it applies to.',
        action: 'Create',
        icon: 'pi pi-plus',
        route: { path: '/variables', query: { create: 'variable' } }
      },
      {
        // The same drawer: its footer holds Import, and pasting a `.env` into any Key
        // field expands into one row per pair (the pattern Edge DNS now shares).
        id: 'import',
        title: 'Import a .env',
        description: 'Bring every key over from a file, or paste its contents.',
        action: 'Import',
        primary: true,
        icon: 'pi pi-upload',
        route: { path: '/variables', query: { create: 'variable' } }
      },
      {
        id: 'cli',
        title: 'Via CLI or API',
        description: 'Set variables from your own pipeline, per environment.',
        command: 'azion create variables --key API_TOKEN',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Variables work on Azion',
      href: 'https://www.azion.com/en/documentation/devtools/cli/'
    }
  },
  {
    id: 'connectors',
    label: 'Connectors',
    icon: 'ai ai-edge-connectors',
    headline: 'Add your first connector',
    lead: 'Add a connector so your applications have somewhere to fetch from on a cache miss.',
    unit: 'connector',
    methods: [
      {
        id: 'http',
        title: 'An HTTP origin',
        description: 'Point at a host you already run, with TLS and load balancing.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-globe',
        route: { path: '/connectors/new' }
      },
      {
        // A connector can serve a bucket, and an account with no buckets has to make one
        // first — so this gate is the BUCKET's create page, not a second trip to the
        // connector form under the same verb.
        id: 'storage',
        title: 'From an Object Storage bucket',
        description: 'Create the bucket first, then point a connector at it.',
        action: 'New bucket',
        icon: 'ai ai-edge-storage',
        route: { path: '/object-storage/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Declare connectors as code, alongside the application.',
        command: 'azion create connector --name my-connector',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Connectors work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/'
    }
  },
  {
    id: 'custom-pages',
    label: 'Custom Pages',
    icon: 'ai ai-custom-pages',
    headline: 'Create your first custom page',
    lead: 'Create a custom page so an error or a maintenance window still looks like your product.',
    unit: 'custom page',
    methods: [
      {
        id: 'create',
        title: 'New page set',
        description: 'Map a status code to a page you serve from your own origin.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/custom-pages/new' }
      },
      {
        // The page set names the connector that serves it, so an account with none has
        // to create that first. The gate goes there, under its own verb.
        id: 'connector',
        title: 'From a connector',
        description: 'Create the connector that serves the pages you author.',
        action: 'New connector',
        icon: 'ai ai-edge-connectors',
        route: { path: '/connectors/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Ship the page set with the rest of your configuration.',
        command: 'azion create custom-page --status-code 404',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Custom Pages work on Azion',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/'
    }
  },
  {
    id: 'firewall',
    label: 'Firewall',
    icon: 'ai ai-edge-firewall',
    headline: 'Create your first firewall',
    lead: 'Create a firewall to put DDoS protection, WAF and bot management in front of an application.',
    unit: 'firewall',
    methods: [
      {
        id: 'create',
        title: 'New firewall',
        description: 'Pick the modules to run and attach it to a workload.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/firewall/new' }
      },
      {
        id: 'waf',
        title: 'With a WAF rule set',
        description: 'Create the rule set first, then run it inside the firewall.',
        action: 'New rule set',
        icon: 'ai ai-waf-rules',
        route: { path: '/waf-rules/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Declare firewalls and rules as code, from your own pipeline.',
        command: 'azion create firewall --name my-firewall',
        icon: 'pi pi-desktop'
      }
    ],
    // Firewall is the third product the Marketplace really publishes for: its
    // integrations are FIREWALL functions (bot management, captcha, credential
    // protection), on the same Integrations tab as the Functions catalog.
    startFast: {
      title: 'Start from a Marketplace function',
      description: 'Install bot management, a captcha or credential protection and run it here.',
      route: { path: '/marketplace', query: { tab: 'integrations' } },
      learnMore: {
        label: 'Learn more',
        href: 'https://www.azion.com/en/documentation/products/marketplace/'
      },
      items: [
        {
          id: 'bot-manager-lite',
          title: 'Azion Bot Manager Lite',
          description: 'Score incoming requests on rules and behaviour, and block bad bots.',
          icon: 'pi pi-shield',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Bot Manager' } }
        },
        {
          id: 'recaptcha',
          title: 'reCAPTCHA',
          description: 'Challenge suspicious traffic and watch it from the Google dashboard.',
          icon: 'pi pi-verified',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'reCAPTCHA' } }
        },
        {
          id: 'axur-leakstream',
          title: 'Axur Leakstream',
          description: 'Watch for leaked credentials and stop checker attacks.',
          icon: 'pi pi-key',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Leakstream' } }
        },
        {
          id: 'send-event-endpoint',
          title: 'Send Event to Endpoint',
          description: 'Stream request data to an endpoint of your own from the edge.',
          icon: 'pi pi-send',
          action: 'Create',
          route: { path: '/marketplace', query: { tab: 'integrations', q: 'Send Event' } }
        }
      ]
    },
    learnMore: {
      label: 'How Firewall works on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/'
    }
  },
  {
    id: 'waf-rules',
    label: 'WAF Rules',
    icon: 'ai ai-waf-rules',
    headline: 'Create your first rule set',
    lead: 'Create a rule set to inspect traffic for injection, scripting and file-inclusion attempts.',
    unit: 'rule set',
    methods: [
      {
        id: 'create',
        title: 'New rule set',
        description: 'Set a sensitivity per threat family and start in learning mode.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/waf-rules/new' }
      },
      {
        id: 'firewall',
        title: 'Inside a firewall',
        description: 'Create the firewall that will run the rule set on a workload.',
        action: 'New firewall',
        icon: 'ai ai-edge-firewall',
        route: { path: '/firewall/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Version the rule set with the rest of your security config.',
        command: 'azion create waf-rule-set --name my-rule-set',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How WAF works on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/web-application-firewall/'
    }
  },
  {
    id: 'certificates',
    label: 'Certificate Manager',
    icon: 'ai ai-digital-certificates',
    headline: 'Add your first certificate',
    lead: "Upload a certificate or request one from Let's Encrypt to serve your domains over TLS.",
    unit: 'certificate',
    methods: [
      {
        id: 'letsencrypt',
        title: "Request from Let's Encrypt",
        description: 'Azion validates the domain and renews the certificate for you.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-verified',
        route: { path: '/certificates/new' }
      },
      {
        id: 'upload',
        title: 'Upload a certificate',
        description: 'Paste the PEM and its private key for a certificate you own.',
        action: 'Upload',
        icon: 'pi pi-upload',
        route: { path: '/certificates/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Rotate certificates from the pipeline that issues them.',
        command: 'azion create certificate --crt ./fullchain.pem',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Digital Certificates work on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/digital-certificates/'
    }
  },
  {
    id: 'network-lists',
    label: 'Network Lists',
    icon: 'ai ai-network-lists',
    headline: 'Create your first network list',
    lead: 'Create a network list to allow or deny traffic by IP range, autonomous system or country.',
    unit: 'network list',
    methods: [
      {
        id: 'create',
        title: 'New list',
        description: 'Paste the IP ranges, ASNs or countries the list holds.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/network-lists/new' }
      },
      {
        id: 'firewall',
        title: 'Inside a firewall rule',
        description: 'Create the firewall whose rules will match against the list.',
        action: 'New firewall',
        icon: 'ai ai-edge-firewall',
        route: { path: '/firewall/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Keep the list in sync with the source that generates it.',
        command: 'azion create network-list --type ip_cidr',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Network Lists work on Azion',
      href: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/network-lists/'
    }
  },
  {
    id: 'data-stream',
    label: 'Data Stream',
    icon: 'ai ai-data-stream',
    headline: 'Create your first stream',
    lead: 'Create a stream to ship edge events to your own observability or storage platform.',
    unit: 'stream',
    methods: [
      {
        id: 'create',
        title: 'New stream',
        description: 'Pick the events, the destination and how they are batched.',
        action: 'Create',
        primary: true,
        icon: 'pi pi-plus',
        route: { path: '/data-stream/new' }
      },
      {
        // Shipping to storage needs a bucket to ship to, so this gate creates that —
        // the stream form then offers it as a destination.
        id: 'storage',
        title: 'To Object Storage',
        description: 'Create the bucket the events land in, then point a stream at it.',
        action: 'New bucket',
        icon: 'ai ai-edge-storage',
        route: { path: '/object-storage/new' }
      },
      {
        id: 'api',
        title: 'Via CLI or API',
        description: 'Declare the stream and its endpoint alongside your services.',
        command: 'azion create data-stream --template http',
        icon: 'pi pi-desktop'
      }
    ],
    learnMore: {
      label: 'How Data Stream works on Azion',
      href: 'https://www.azion.com/en/documentation/products/observe/data-stream/'
    }
  }
]

/**
 * One product's copy, by id — how a module page reaches its own first use when the
 * sample is in its EMPTY version (src/lib/sample-mode.js).
 */
export const productFirstUse = (id) => productEmptyStates.find((product) => product.id === id)

/** The switcher's options, derived so the list and the map cannot drift. */
export const productOptions = productEmptyStates.map(({ id, label, icon }) => ({
  value: id,
  label,
  icon
}))
