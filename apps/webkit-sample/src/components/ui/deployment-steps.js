// Canonical template-deploy steps used by DeploymentLogs — each owns its slice of
// the deploy log and how long it takes (per-step feedback in static mode, measured
// live). Kept in a plain module so it can seed the `steps` prop default without
// tripping the <script setup> hoisting rules.
//
// This is the TEMPLATE deploy: the flow behind "Deploy to Azion" in the Marketplace
// (components/DeployTemplate.vue) and behind the async deploy scenario
// (components/AsyncDeployment.vue). It does the GitHub side too — mint a token,
// clone the template into the user's scope, wire the repository secret — which is
// why it is a longer pipeline than the `azion deploy` one a deployment PAGE renders
// (src/lib/azion-deploys.js). Same anatomy, different story.
//
// One step per stage that can FAIL ON ITS OWN, which is the same rule the deploy
// page's pipeline follows: `npm install` failing on a peer range and the Rules
// Engine rejecting a duplicate rule are different problems with different fixes, so
// they are different rows. A row that bundles four stages can only tell you that
// "something in there" broke.
//
// `failLogs` is the output the step produces when it is the one that FAILS
// (DeploymentLogs' `failAt`). It is the step's WHOLE output on that path, preamble
// included — never an error appended to the success log, which would leave a
// "completed successfully!" line sitting above the error that contradicts it.
export const DEFAULT_DEPLOYMENT_STEPS = [
  {
    key: 'token',
    title: 'Azion Token',
    description: 'Deploy token created and added to the CLI',
    duration: 3,
    logs: [
      ['13:47:33', '[TASK] - #. Deploy started successfully!'],
      ['13:47:33', '[TASK] - #. Creating Azion token!'],
      ['13:47:35', '[TASK] - #. Add to Azion CLI!'],
      ['13:47:36', '[TASK] - #. Token added successfully!']
    ],
    failLogs: [
      ['13:47:33', '[TASK] - #. Deploy started successfully!'],
      ['13:47:34', '[TASK] - #. Creating Azion token!'],
      ['13:47:35', '[ERROR] - # Could not create an Azion token'],
      ['13:47:35', '401 Unauthorized: the personal token has expired'],
      ['13:47:36', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'clone',
    title: 'Clone Template',
    description: 'Template cloned into the GitHub scope',
    duration: 4,
    logs: [
      ['13:47:37', '[TASK] - # Current directory: vue/vue3-vite-static/'],
      ['13:47:38', '[TASK] - #. Cloning template!'],
      ['13:47:39', 'Receiving objects: 100% (312/312), 1.14 MiB'],
      ['13:47:40', '[TASK] - #. Template cloned successfully!']
    ],
    failLogs: [
      ['13:47:37', '[TASK] - # Current directory: vue/vue3-vite-static/'],
      ['13:47:38', '[TASK] - #. Cloning template!'],
      ['13:47:39', '[ERROR] - # Could not clone the template repository'],
      ['13:47:39', '403 Forbidden: the GitHub App is not installed on this scope'],
      ['13:47:40', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'install',
    title: 'Install Dependencies',
    description: '478 packages installed',
    duration: 9,
    logs: [
      ['13:47:41', '[TASK] - # npm install'],
      ['13:47:45', 'npm warn deprecated inflight@1.0.6: this module is not supported'],
      ['13:47:48', 'added 478 packages, and audited 479 packages in 9s'],
      ['13:47:48', '24 vulnerabilities (5 low, 7 moderate, 10 high, 2 critical)'],
      ['13:47:49', '[TASK] - # Dependencies installed successfully!']
    ],
    failLogs: [
      ['13:47:41', '[TASK] - # npm install'],
      ['13:47:47', '[ERROR] - # npm install exited with code 1'],
      ['13:47:48', 'ERESOLVE could not resolve peer dependency vue@^3.5.0'],
      ['13:47:49', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'build',
    title: 'Build',
    description: 'Project built into dist/',
    duration: 8,
    logs: [
      ['13:47:50', '[TASK] - # Build template'],
      ['13:47:52', 'vite v6.0.7 building for production...'],
      ['13:47:56', '214 modules transformed · dist/assets 1.2 MB'],
      ['13:47:57', '[TASK] - # Build completed successfully!']
    ],
    failLogs: [
      ['13:47:50', '[TASK] - # Build template'],
      ['13:47:52', 'vite v6.0.7 building for production...'],
      ['13:47:56', '[ERROR] - # Build failed with exit code 1'],
      ['13:47:56', "src/main.js: Cannot find module '@azion/config'"],
      ['13:47:57', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'upload',
    title: 'Upload',
    description: 'Static assets uploaded to Edge Storage',
    duration: 5,
    logs: [
      ['13:47:58', '[TASK] - # Uploading static assets to Edge Storage'],
      ['13:47:59', 'create mode 100644 src/main.js'],
      ['13:47:59', 'create mode 100644 src/router/index.js'],
      ['13:48:01', '[TASK] - # 24 files uploaded (1.2 MB)'],
      ['13:48:02', '[TASK] - # Upload completed successfully!']
    ],
    failLogs: [
      ['13:47:58', '[TASK] - # Uploading static assets to Edge Storage'],
      ['13:48:00', '[ERROR] - # Edge Storage returned 503 Service Unavailable'],
      ['13:48:02', '[ERROR] - # Upload interrupted at 14/24 files.']
    ]
  },
  {
    key: 'application',
    title: 'Edge Application',
    description: 'Application and cache settings created',
    duration: 5,
    logs: [
      ['13:48:03', '[TASK] - # Creating Edge Application'],
      ['13:48:05', '[TASK] - # Cache Setting __DEFAULT__ created'],
      ['13:48:07', '[TASK] - # Edge Application created successfully!']
    ],
    failLogs: [
      ['13:48:03', '[TASK] - # Creating Edge Application'],
      ['13:48:05', '[ERROR] - # Edge Application could not be created'],
      ['13:48:06', '403 Forbidden: the account has reached its application limit'],
      ['13:48:07', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'rules',
    title: 'Rules Engine',
    description: 'Request rules and cache policies applied',
    duration: 4,
    logs: [
      ['13:48:08', '[TASK] - # Configuring Rules Engine and cache policies'],
      ['13:48:09', "[TASK] - # Rule 'Deliver Static Assets' created"],
      ['13:48:11', '[TASK] - # Rules Engine configured successfully!']
    ],
    // The DEFAULT failure (src/lib/deploy-runs.js names this step): everything is
    // built, uploaded and created, and only the rules are rejected. That is what
    // makes a redeploy cheap and the failure worth recovering from rather than
    // starting over — and it is the same failure the deploy page's error record
    // renders, so the two surfaces tell one story.
    failLogs: [
      ['13:48:08', '[TASK] - # Configuring Rules Engine and cache policies'],
      ['13:48:09', '[ERROR] - # Rules Engine rejected the configuration'],
      ['13:48:10', "409 Conflict: rule 'default-cache' already bound to this domain"],
      ['13:48:11', '[ERROR] - # Deploy finalized with errors. Nothing was published.']
    ]
  },
  {
    key: 'deploy',
    title: 'Publish',
    description: 'Repository wired and the deploy published',
    duration: 4,
    logs: [
      ['13:48:12', "branch 'main' set up to track 'origin/main'."],
      ['13:48:13', '[TASK] - #. Set Azion Personal Token in the repository.'],
      ['13:48:15', '[TASK] - #. Deploy finalized successfully!']
    ],
    failLogs: [
      ['13:48:12', "branch 'main' set up to track 'origin/main'."],
      ['13:48:13', '[ERROR] - # Could not set the Azion Personal Token in the repository'],
      ['13:48:14', '403 Forbidden: the GitHub App cannot write repository secrets'],
      ['13:48:15', '[ERROR] - # Deploy finalized with errors. Nothing was published.']
    ]
  }
]

// ── Timings ────────────────────────────────────────────────────────────────
// The deploy view's fixed costs, kept here beside the steps because the two are
// one shape: anything that has to predict how long a deploy takes on screen
// needs both the step model and these.

/** How long DeploymentFlow holds the "cloning" splash before the logs start. */
export const DEPLOY_SPLASH_MS = 2400

/** The pause DeploymentLogs leaves between two steps. */
export const STEP_GAP_MS = 450

// ── The two views ──────────────────────────────────────────────────────────
// The Phased / Complete switch, in one place because the control can be rendered
// by DeploymentLogs itself (its Logs row) or by the card that HOSTS it (the
// deployment page puts it in the card header, beside the card's own title). Two
// surfaces, one option list — otherwise the day a third view is added, only one of
// them learns about it.
//
// `phased` is first because it is the default: arriving at a deployment, the
// question is which step it is on (or which one broke), and the step rows answer
// that in one glance. `complete` is the deliberate second step — the raw stream,
// for when the summary is not enough.
export const LOG_VIEWS = [
  { label: 'Phased', value: 'phased' },
  { label: 'Complete', value: 'complete' }
]

/**
 * The log lines a run actually plays.
 *
 * A failing step plays its `failLogs` in place of its `logs`, and the steps behind
 * it never play at all.
 *
 * @param {string} [failAt] Key of the failing step; empty when the deploy succeeds.
 * @param {Array<object>} [steps] Step model.
 * @returns {{ lines: number, steps: number }} Lines played and steps entered.
 */
export function playedLines(failAt = '', steps = DEFAULT_DEPLOYMENT_STEPS) {
  const failIndex = failAt ? steps.findIndex((step) => step.key === failAt) : -1
  const played = failIndex === -1 ? steps : steps.slice(0, failIndex + 1)
  const lines = played.reduce(
    (total, step, i) =>
      total + (i === failIndex ? (step.failLogs?.length ?? step.logs.length) : step.logs.length),
    0
  )
  return { lines, steps: played.length }
}

/**
 * Pace the log stream to a target wall-clock duration.
 *
 * A deploy that is owned by an async run (src/lib/deploy-runs.js) settles on the
 * run's own timer, so the on-screen stream has to land on its last line at the
 * same moment. Deriving the per-line interval from the run's duration is what
 * keeps the card and the toast from contradicting each other.
 *
 * @param {object} input
 * @param {number} input.durationMs Wall-clock length of the run.
 * @param {string} [input.failAt] Key of the failing step; empty when it succeeds.
 * @returns {number} Milliseconds between revealed log lines.
 */
export function logIntervalFor({ durationMs, failAt = '' }) {
  const { lines, steps } = playedLines(failAt)
  const fixed = DEPLOY_SPLASH_MS + STEP_GAP_MS * Math.max(0, steps - 1)
  return Math.max(80, Math.round((durationMs - fixed) / Math.max(1, lines)))
}
