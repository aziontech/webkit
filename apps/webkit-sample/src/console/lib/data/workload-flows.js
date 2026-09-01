// THE WORKLOAD CREATE, IN PARTS.
//
// A workload is the public entry point — the domain traffic arrives on, and what that
// domain serves. Its create assembles a CHAIN, and the parts are the chain's own order:
//
//   application  what the domain SERVES. Required, and answered the way every resource in
//                this console is answered: one that already exists, or a new one.
//   binding      the DOMAIN traffic arrives on, the environment and certificate that serve
//                it, and the deployment the first release lands in.
//
// A FIREWALL IS NOT ONE OF THE PARTS. A workload can only be deployed if it has an
// application — that is what the domain answers with — and a workload with a firewall and
// nothing to serve is not a deployable thing, so protection is not a question this create
// has to ask to finish. It is asked where it belongs instead: on the workload's own page,
// which binds one onto the release (../../pages/workloads/WorkloadDetail.vue → the
// topology's bind slots, and the Ship to production band that points at them).
//
// ── WHY THE RESOURCES COME FIRST AND THE DOMAIN LAST ──
//
// This flow used to open by naming the workload and close by picking an application. That
// reads backwards once you look at what the commit actually does: the domain is the LAST
// thing provisioned, because there is nothing to point it at until the application exists.
// Asking for the address first meant the reader named a workload before knowing whether the
// thing it serves could even be built — and the name they typed then had to be reconciled
// with the application's name and the deployment's name, both of which derive from it.
//
// Now the order matches the dependency: assemble the parts, then bind them to an address.
//
// ── EVERY RESOURCE IS THE SAME QUESTION ──
//
// Existing or new. One shape for it (../../components/resource/ResourcePicker.vue is the
// list half; the application card is the whole), which is the same shape every other
// binding question in this console wears — so a reader who has answered one has answered
// all of them.
//
// ── NAMES CASCADE FROM THE ADDRESS ──
//
// The workload, the deployment and the Azion domain all derive from ONE input: the domain
// prefix the reader types on the last part (or the name, when they bring their own
// domain). See `deriveWorkloadNames` below. A reader types one string and reads back every
// name the commit will use, rather than naming four resources by hand and hoping they
// agree.
//
// THE COMMIT IS A PROVISIONING RUN. The last part's button creates the chain and streams it
// through the same card the application deploy uses, on the workload pipeline
// (./workload-provisioning.js).

import { provisionedApplications } from '@shared/lib/provisioning'
import { computed } from 'vue'

import { strategies } from './deployment-strategies'
import { domainForWorkload } from './workload-provisioning'

/** The one flow's parts, in order. Shape matches ./application-flows.js so the shared
 *  wizard chrome (components/page/WizardPage.vue) reads both without a special case. */
export const WORKLOAD_STEPS = [
  { id: 'application', label: 'Application' },
  { id: 'binding', label: 'Domain and deployment' }
]

// The applications a workload can serve — the seeded ones, PLUS whatever this session has
// created.
//
// A COMPUTED and not a constant, because the from-scratch application create ends by
// offering "Deploy using a new workload" (../../pages/applications/CreateApplication.vue):
// the reader arrives here to publish an application they made a moment ago, and a fixture
// list would land them on a picker that cannot name it. The provisioning store is read the
// same way ./releases.js reads it, so an application created in this session is bindable
// everywhere a release is composed, and one that never existed is offered nowhere.
//
// Each row carries a DESCRIPTION now, because the picker rows show one. A list of four
// bare names asks the reader to remember which is which; the row is where the difference
// belongs. A session-provisioned application has no editorial description to give, so it
// says the one true thing about itself — that this session made it.
const SEEDED_APPLICATIONS = [
  {
    value: 'edge-shop',
    label: 'edge-shop',
    description: 'The storefront. Next.js, built on every push to main.'
  },
  {
    value: 'azion-docs-site',
    label: 'azion-docs-site',
    description: 'Static documentation. Astro, rebuilt nightly.'
  },
  {
    value: 'marketing-landing',
    label: 'marketing-landing',
    description: 'Campaign pages. Deployed from the marketing team’s repository.'
  },
  {
    value: 'internal-admin',
    label: 'internal-admin',
    description: 'The back office. Behind the corporate firewall rule set.'
  }
]

export const WORKLOAD_APPLICATIONS = computed(() => [
  ...provisionedApplications.value.map((application) => ({
    value: application.name,
    label: application.name,
    description: 'Created in this session. Its latest version is ready to serve.'
  })),
  ...SEEDED_APPLICATIONS
])

/** The environment the release binds to. */
// THE ENVIRONMENTS A BINDING CAN LAND ON. Each carries a DESCRIPTION because the create
// offers them as cards rather than as a dropdown's two words: an environment decides which
// hostname answers (a workload's Stage binding is served on its own `stage-` host — see
// ../../pages/workloads/WorkloadDetail.vue → `domainsByEnvironment`), which is exactly the
// difference two bare labels leave the reader to already know.
export const WORKLOAD_ENVIRONMENTS = [
  {
    value: 'Production',
    label: 'Production',
    description: 'The live binding. Traffic on the workload’s domain is served from it.'
  },
  {
    value: 'Stage',
    label: 'Stage',
    description: 'A rehearsal binding, answering on its own hostname rather than the live one.'
  }
]

// THE DEPLOYMENTS THE FIRST RELEASE CAN LAND IN.
//
// A deployment IS a deployment setting — the strategies store is the one place they live
// (./deployment-strategies.js), and the release composer projects that same store. A
// parallel fixture list here would let this create offer a deployment the Deployments page
// has never heard of. Inactive strategies are dropped rather than offered disabled: this
// is a create, and a deployment that cannot be applied is not a choice.
export const WORKLOAD_DEPLOYMENTS = computed(() =>
  strategies.value
    .filter((strategy) => strategy.status !== 'Inactive')
    .map((strategy) => ({
      value: strategy.id,
      label: strategy.name,
      description:
        strategy.description ||
        (strategy.system
          ? 'The platform’s own deployment. Versions keep the resource IDs they shipped with.'
          : 'Authored in this workspace.')
    }))
)

/** The name of a deployment by id, or `''`. */
export const workloadDeploymentName = (id) =>
  WORKLOAD_DEPLOYMENTS.value.find((deployment) => deployment.value === id)?.label ?? ''

/**
 * The one string the create's names are built from: lowercased, with whitespace and
 * anything that is not a hostname character folded to a hyphen.
 *
 * The same normalization ./workload-provisioning.js applies when it builds the domain, so
 * the prefix a reader types and the domain the run reports cannot disagree.
 */
export const workloadNameInput = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * EVERY NAME THE COMMIT USES, FROM ONE INPUT.
 *
 * The reader types a domain prefix (or, when they bring their own domain, a name) and this
 * derives the rest: the workload, the deployment created for it, and the Azion domain. The
 * application is NOT in here — it is answered on its own part, where a reader can name it
 * or pick an existing one, and a derivation would overwrite what they chose.
 *
 * One function, so the preview a reader reads before pressing the button, the logs the run
 * streams, and the chain the success screen lists are the same three strings.
 *
 * @param {object} input
 * @param {string} input.input        The prefix or name the reader typed.
 * @param {string} [input.customDomain] Their own hostname, when they brought one.
 * @returns {{workload: string, deployment: string, domain: string}}
 */
export const deriveWorkloadNames = ({ input, customDomain = '' } = {}) => {
  const slug = workloadNameInput(input)
  return {
    workload: slug,
    deployment: slug ? `${slug}-deployment` : '',
    domain: customDomain.trim().toLowerCase() || domainForWorkload(slug)
  }
}

/**
 * The names for a create form, whichever domain branch it is on.
 *
 * The two branches feed the cascade from different fields — an Azion domain derives
 * everything from the PREFIX the reader typed, a custom one from the NAME they typed
 * beside the hostname — and every surface that shows a derived name needs the same answer.
 * So the branch is read once, here, rather than in the part that renders the address, the
 * summary that projects it, and the run that narrates it.
 *
 * Each branch reads its OWN key. A single `domain` key holding "a prefix or a hostname,
 * depending" meant switching branches carried `checkout` into a field asking for a full
 * hostname and printed `https://checkout` as the address — the same reason every
 * existing-or-new answer in this flow keeps a key per branch
 * (../../components/resource/ResourceBinding.vue).
 *
 * @param {object} form The create wizard's reactive form.
 * @returns {{workload: string, deployment: string, domain: string}}
 */
export const workloadNamesFromForm = (form) =>
  form?.domainType === 'own'
    ? deriveWorkloadNames({ input: form.name, customDomain: form.domainHost })
    : deriveWorkloadNames({ input: form?.domainPrefix })
