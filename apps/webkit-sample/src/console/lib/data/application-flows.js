// THE THREE WAYS TO CREATE AN APPLICATION — the wizard's own catalog.
//
// An application is code plus the configuration that serves it, and the only real
// question at creation time is WHERE THE CODE COMES FROM. Everything else the create
// endpoint accepts (the seven module flags, `active`, `debug`) already carries a
// working default, so it is not a decision — it is a disclosure.
//
// That question has exactly three answers, and they are the three flows here:
//
//   git       the reader already has code, in a repository
//   scratch   the reader has no code yet and wants the application layer on its own
//   template  the reader has no code yet and wants a framework starter
//
// ── WHY THE FLOWS DECLARE THEIR OWN STEPS ──
//
// The flows are not the same length, and pretending they are costs the reader a step
// with nothing in it. Git and template both need a SOURCE chosen — a repository, a
// starter — before anything can be configured; from scratch IS its own source, so
// there is nothing to choose and it goes straight to configuration. So each flow
// carries `steps`, the rail renders THAT list, and a two-step flow reads as a
// two-step flow instead of showing a third marker the reader can never visit.
//
// `steps[i].id` is what the wizard switches on, so the order in this array IS the
// order of the flow. The method step is the first entry of every flow because the
// choice of method is itself a step the reader can go back to.
//
// ── WHY THE TEMPLATE FLOW HAS A FOURTH PART, AND WHEN IT DOES NOT ──
//
// A FRAMEWORK STARTER IS CLONED. Choosing "Next.js Boilerplate" does not deploy Azion's
// copy of it — it copies that project into the reader's OWN GitHub account and deploys
// from there, so every later push is theirs to make. That copy cannot happen without a
// connected account and somewhere to put it, so the template flow has a `repository`
// part: connect, then either create a new repository or point at one already there.
// It is a gate and not a field, which is why it is a part rather than a card at the top
// of Configure — a reader who has not authorized an account would otherwise be looking
// at a form they cannot submit.
//
// AN AZION TEMPLATE IS CONFIGURED. Azion Proxy and Azion Static Site have no project to
// copy: the settings ARE the template (./templates.js → `requiresRepository`). So they
// skip the part entirely — the rail drops to three, the reader goes from the catalog
// straight to Configure, and nobody is asked to authorize GitHub for a clone that never
// happens. The wizard filters the part out
// (../../pages/applications/CreateApplication.vue → `steps`); the flow declares the
// longer shape here because a total that SHRINKS on an answer is the right direction to
// be wrong in, and the same reasoning as PROVISIONAL_STEPS below.
//
// ── WHY THE GIT STEP CONNECTS AN ACCOUNT ──
//
// Importing from Git means Azion watches the repository and ships every push to it, so
// the account that owns the code is connected in the step — there is no paste-a-URL
// shortcut past it. A URL cannot grant the watch, and offering it as the primary path
// promised an import that stopped at the first private repository. The reader who has
// no repository to connect has the other two doors: a template, or from scratch.

/** The build defaults a flow starts the Configure step with. */
const NPM_BUILD = { buildCommand: 'npm run build', deployCommand: 'npm run deploy' }

/**
 * The flows, keyed by id. `steps` is the ordered rail for that flow; `icon` is the
 * glyph on the method row; `title`/`description` are the row's copy AND the heading
 * of the flow's own steps, so the reader never loses which door they came through.
 */
export const APPLICATION_FLOWS = {
  git: {
    id: 'git',
    icon: 'pi pi-github',
    title: 'Import from Git',
    description:
      'Deploy from a repository you already have. Connect the Git account that owns it and select the repository to import.',
    steps: [
      { id: 'method', label: 'Select a method' },
      { id: 'source', label: 'Select a repository' },
      { id: 'configure', label: 'Create and deploy' }
    ],
    defaults: NPM_BUILD
  },

  scratch: {
    id: 'scratch',
    icon: 'pi pi-file',
    title: 'Start from scratch',
    description:
      'Create the Azion application layer on its own: a name, Cache Settings, and a connector. No repository, no build. Connect your code to it whenever it exists.',
    // TWO steps, on purpose: from scratch IS the source, so there is nothing to pick.
    // And the second part CREATES rather than deploying — there is no code to ship, so
    // the label says what the press does and the outcome offers the deploy separately
    // (../../pages/applications/wizard/ScratchStep.vue).
    steps: [
      { id: 'method', label: 'Select a method' },
      { id: 'configure', label: 'Configure and create' }
    ],
    defaults: NPM_BUILD
  },

  template: {
    id: 'template',
    icon: 'pi pi-objects-column',
    title: 'Start from a template',
    description:
      'Clone a framework starter already wired to build and deploy on Azion. Next, Astro, Vue, Nuxt, and more.',
    // FOUR parts, and the fourth is conditional — see the note above this object.
    steps: [
      { id: 'method', label: 'Select a method' },
      { id: 'source', label: 'Select a template' },
      { id: 'repository', label: 'Connect a repository' },
      { id: 'configure', label: 'Create and deploy' }
    ],
    defaults: NPM_BUILD
  }
}

/**
 * The parts shown BEFORE a method is chosen.
 *
 * The flow's real length is not knowable until the reader answers the first question, but
 * a progress bar that only appears after that answer is worse than a provisional one: the
 * first screen of a stepped flow would show no progress at all, which reads as "nothing
 * counted yet" rather than "part one of a few".
 *
 * So the provisional shape is the MODAL one — three parts, which is what two of the three
 * flows actually have. Choosing from scratch then drops the total to two, and a total that
 * SHRINKS is the right direction to be wrong in: from scratch is the fast path, and
 * learning it is one part shorter than expected is good news. Growing would be the
 * opposite.
 */
export const PROVISIONAL_STEPS = [
  { id: 'method', label: 'Select a method' },
  { id: 'source', label: 'Select a source' },
  { id: 'configure', label: 'Create and deploy' }
]

/**
 * The method step's rows, in reading order: the reader's own code first (the most
 * common reason anyone opens this flow), then the two ways to start without any.
 */
export const APPLICATION_METHODS = [
  APPLICATION_FLOWS.git,
  APPLICATION_FLOWS.scratch,
  APPLICATION_FLOWS.template
]

/** The flow a deep link or a method row resolves to; `null` when the id is unknown. */
export const getApplicationFlow = (id) => APPLICATION_FLOWS[id] ?? null

/**
 * The from-scratch source, shaped like a template so the Configure step and the
 * provisioning call do not need to know which door the reader came through.
 */
export const SCRATCH_SOURCE = {
  kind: 'scratch',
  title: 'From scratch',
  description: 'The Azion application layer only. Connect it to your code later.',
  framework: 'javascript',
  icon: 'pi pi-file',
  repoOwner: 'aziontech',
  // The starter the run clones for the log — it is the upstream repository's own path,
  // not the method's name, so it stays what it is called upstream.
  repoPath: 'templates/hello-world',
  defaultName: 'my-application',
  // NO BUILD. This is not a project that happens to have an empty build command — it is
  // the Azion layer with no code behind it yet, so the Configure part does not ask for a
  // build at all (../../pages/applications/wizard/ConfigureStep.vue). A repository or a
  // template sets this true: those arrive WITH code, and code has to be built.
  requiresBuild: false,
  settings: []
}
