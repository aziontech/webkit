// Deployments with a PAGE behind them — the record `/deployments/:id` renders.
//
// Every other deployment surface in this sample reads a deployment as a ROW:
// version, status, resource, environment, who and when. That is all a row can
// hold, and all the read-only drawer needs. A deployment somebody has to diagnose
// needs more: which artifacts it touched, and the PIPELINE it ran — step by step,
// including the step that broke and the ones that never ran after it. Those are
// things you link to, reload and come back to, so they live at a URL (see
// components/DeploymentDetail.vue).
//
// The vocabulary this module does NOT own: `status` is the shared deployment
// status (src/lib/deployments.js), so these read `Ready` / `Building` / `Error`
// exactly like every other deployment in the console.
//
// ── The pipeline is the real one ────────────────────────────────────────────
// The steps below are what `azion deploy` actually does (Azion CLI 4.22), in its
// order, and the log lines are the CLI's own messages:
//
//   azion build         bundle the project with the preset (writes .edge/)
//   upload              push .edge/storage to the Storage bucket
//   read manifest       "Reading manifest.json file"
//   apply the manifest  Function → Function Instance → Application →
//                       Cache Settings → Connector → Rules Engine →
//                       Workload → Workload Deployment
//   purge               "Initializing cache warming..." (rt-purge)
//   finish              "To visualize your application access the Domain: %s"
//
// One step per RESOURCE the manifest applies, not one per phase of the CLI. The
// manifest stage alone creates or updates six different resources, and each of
// them is a separate call that can be the one that fails — so collapsing them
// into a single "apply the manifest" row would hide exactly what a person opens
// this page to find out. A step earns its own row when it can fail on its own.
//
// ── Grounded in the real deploy ────────────────────────────────────────────
// This app is really deployed by Azion, so the records use the real artifacts.
// From apps/webkit-sample/azion.config.js (`build.preset: 'vue'`) and
// apps/webkit-sample/azion/azion.json:
//
//   workload / bucket   webkit-sample  ·  storage prefix 20260722112530
//   domain              mh2saqc1un.map.azionedge.net   (id 1784675753)
//   edge function       53089 (__DEFAULT__) → .edge/worker.js, instance 47458
//   connector           origin-storage-default (263718)
//   rules engine        604943 Set Storage Origin · 604944 Deliver Static Assets
//                       604945 Redirect to index.html
//
// The one identity taken from the console rather than from azion.json is the
// APPLICATION: the CLI named it `__DEFAULT__` (id 1782139818), which means
// nothing on screen, while the Applications module lists this same app as
// `webkit-sample-vue` (id 1784552864). Using the console's record is what lets
// the deployment row link to a page that exists.
import { daysAgo, formatListDate, hoursAgo } from './dates'
import { authorAt, emailOf } from './people'

// ── Triggers ───────────────────────────────────────────────────────────────
// Azion starts a deployment from exactly two places: the Console (the UI you are
// looking at) and the CLI (`azion deploy` in a terminal). The glyph is part of the
// vocabulary, not a per-screen choice, so the trigger reads the same on the page,
// in a row and in a log line.
export const TRIGGERS = {
  console: {
    label: 'Console',
    icon: 'pi pi-desktop',
    // What the first log line says the deployment came from.
    source: 'Azion Console (UI)'
  },
  cli: {
    label: 'CLI',
    icon: 'ai ai-azion-cli',
    source: 'azion deploy --auto --local'
  }
}

/** The label / glyph / log source for a trigger, falling back to the Console. */
export const triggerMeta = (trigger) => TRIGGERS[trigger] ?? TRIGGERS.console

/** Trigger options for a Select / filter field. */
export const triggerOptions = Object.entries(TRIGGERS).map(([value, meta]) => ({
  value,
  label: meta.label
}))

// ── The pipeline ───────────────────────────────────────────────────────────
// The ten steps of an `azion deploy`, in the order the CLI runs them. Each one
// owns the line it reports when it completes, the line that describes it before it
// has (`pendingDescription`), and its log — `logs` when it runs to the end,
// `failLogs` when it is the step that FAILS.
//
// A step carries no glyph of its own. The step view (ui/DeploymentLogs.vue) draws
// one status glyph per row, and a second, decorative icon beside the title read as
// a second status signal — so the row here is exactly the row the deploy flow
// streams: status glyph, title, feedback Tag, duration.
//
// `failLogs` is the step's WHOLE output on that path, preamble included, not an
// error tail appended to the success log: a log that says "successfully updated"
// three lines above its own error contradicts itself, which is worse than no log.
//
// Both are functions of the deployment, because a log that names the wrong bucket,
// rule or domain is worse than no log — and these are real artifacts.

// One wall-clock stamp per rule in `EDGE.rules`, so the Rules Engine step's log
// stays in order however many rules the manifest declares (the CLI applies them
// one at a time, about a second apart).
const RULE_TIMES = ['14:02:59', '14:03:00', '14:03:01', '14:03:02']

export const AZION_DEPLOY_STEPS = [
  {
    key: 'build',
    title: 'Build',
    description: 'Bundle written to .edge/worker.js',
    pendingDescription: 'Bundling the project with the Azion bundler',
    logs: (deploy) => [
      ['14:02:11', `[build] Running deploy command · ${triggerMeta(deploy.trigger).source}`],
      ['14:02:11', '[build] Getting presets available'],
      ['14:02:12', `[build] Building with preset "${deploy.edge.preset}" (azion bundler)`],
      ['14:02:38', `[build] vite build · ${deploy.edge.bundleSize} in dist/`],
      ['14:02:39', `[build] Wrote ${deploy.edge.worker} and .edge/manifest.json`],
      ['14:02:39', '[build] Build finished successfully']
    ],
    failLogs: (deploy) => [
      ['14:02:11', `[build] Running deploy command · ${triggerMeta(deploy.trigger).source}`],
      ['14:02:12', `[build] Building with preset "${deploy.edge.preset}" (azion bundler)`],
      ['14:02:29', '[ERROR] [build] vite build exited with code 1'],
      ['14:02:29', "src/main.js: Failed to resolve import '@aziontech/theme'"],
      ['14:02:29', '[ERROR] [build] Deploy aborted before any resource was applied.']
    ]
  },
  {
    key: 'upload',
    title: 'Upload',
    description: 'Static assets uploaded to Storage',
    pendingDescription: 'Uploading .edge/storage to the Storage bucket',
    logs: (deploy) => [
      ['14:02:39', `[upload] Uploading .edge/storage to bucket ${deploy.edge.bucket}`],
      ['14:02:40', `[upload] Prefix ${deploy.edge.prefix} (rotate-prefix)`],
      ['14:02:46', `[upload] ${deploy.edge.objects} objects updated successfully`],
      ['14:02:47', `[upload] Storage Bucket ${deploy.edge.bucket} successfully updated`]
    ],
    failLogs: (deploy) => [
      ['14:02:39', `[upload] Uploading .edge/storage to bucket ${deploy.edge.bucket}`],
      ['14:02:44', '[ERROR] [upload] Error while uploading objects: 503 Service Unavailable'],
      ['14:02:45', `[ERROR] [upload] Upload interrupted at 14/${deploy.edge.objects} objects.`]
    ]
  },
  {
    // The manifest the build wrote is READ before anything is applied — the step
    // that decides what the rest of the pipeline is going to touch.
    key: 'manifest',
    title: 'Manifest',
    description: 'manifest.json read — every resource resolved',
    pendingDescription: 'Reading the manifest the build produced',
    logs: (deploy) => [
      ['14:02:47', '[manifest] Reading manifest.json file'],
      [
        '14:02:48',
        `[manifest] Resolved 4 resources to apply: function, application, connector, workload`
      ],
      ['14:02:48', `[manifest] ${deploy.edge.rules.length} rules declared in the request phase`],
      ['14:02:49', '[manifest] manifest.json read successfully']
    ],
    failLogs: () => [
      ['14:02:47', '[manifest] Reading manifest.json file'],
      ['14:02:48', '[ERROR] [manifest] Error while parsing .edge/manifest.json'],
      ['14:02:48', 'unexpected end of JSON input at byte 4211'],
      ['14:02:49', '[ERROR] [manifest] Deploy aborted — nothing was applied.']
    ]
  },
  {
    key: 'function',
    title: 'Edge Function',
    description: 'Function and instance bound to the bundle',
    pendingDescription: 'Applying the edge function and its instance',
    logs: (deploy) => [
      [
        '14:02:49',
        `[manifest] Updated Function ${deploy.edge.functionName} with ID ${deploy.edge.function}`
      ],
      ['14:02:51', `[manifest] Bound ${deploy.edge.worker} to Function ${deploy.edge.function}`],
      [
        '14:02:53',
        `[manifest] Function Instance ${deploy.edge.functionName} with id ${deploy.edge.instance} successfully updated`
      ]
    ],
    failLogs: (deploy) => [
      [
        '14:02:49',
        `[manifest] Updated Function ${deploy.edge.functionName} with ID ${deploy.edge.function}`
      ],
      ['14:02:51', '[ERROR] [manifest] Error while creating Edge Function instance'],
      ['14:02:51', '400 Bad Request: the function args exceed the size limit'],
      ['14:02:52', '[ERROR] [manifest] Deploy aborted — nothing was published.']
    ]
  },
  {
    key: 'application',
    title: 'Edge Application',
    description: 'Application and cache settings applied',
    pendingDescription: 'Applying the application and its cache settings',
    logs: (deploy) => [
      [
        '14:02:53',
        `[manifest] Updated Application ${deploy.application.name} with ID ${deploy.application.id}`
      ],
      ['14:02:55', '[manifest] Cache Setting __DEFAULT__ successfully updated'],
      ['14:02:56', `[manifest] Application ${deploy.application.name} successfully updated`]
    ],
    failLogs: (deploy) => [
      [
        '14:02:53',
        `[manifest] Updated Application ${deploy.application.name} with ID ${deploy.application.id}`
      ],
      ['14:02:55', '[ERROR] [manifest] Error while updating Cache Setting __DEFAULT__'],
      ['14:02:55', '422 Unprocessable Entity: browser cache TTL exceeds the CDN cache TTL'],
      ['14:02:56', '[ERROR] [manifest] Deploy aborted — nothing was published.']
    ]
  },
  {
    // The connector is what points the application at the bucket the upload step
    // filled, so it is the step where a bad prefix surfaces.
    key: 'connector',
    title: 'Connector',
    description: 'Storage connector pointed at the bucket',
    pendingDescription: 'Applying the storage connector',
    logs: (deploy) => [
      ['14:02:56', `[manifest] Creating Connector ${deploy.edge.connector} (storage)`],
      ['14:02:57', `[manifest] Bucket ${deploy.edge.bucket} · prefix ${deploy.edge.prefix}`],
      [
        '14:02:58',
        `[manifest] Connector ${deploy.edge.connector} with id ${deploy.edge.connectorId} successfully updated`
      ]
    ],
    failLogs: (deploy) => [
      ['14:02:56', `[manifest] Creating Connector ${deploy.edge.connector} (storage)`],
      ['14:02:57', '[ERROR] [manifest] Error while creating Connector'],
      [
        '14:02:57',
        `422 Unprocessable Entity: prefix ${deploy.edge.prefix} does not exist in bucket ${deploy.edge.bucket}`
      ],
      ['14:02:58', '[ERROR] [manifest] Deploy aborted — nothing was published.']
    ]
  },
  {
    key: 'rules',
    title: 'Rules Engine',
    description: 'Request-phase rules applied',
    pendingDescription: 'Applying the request rules from the manifest',
    logs: (deploy) => [
      ...deploy.edge.rules.map(([id, name], index) => [
        RULE_TIMES[index] ?? RULE_TIMES[RULE_TIMES.length - 1],
        `[manifest] Rule Engine ${name} with id ${id} successfully updated`
      ]),
      ['14:03:03', `[manifest] ${deploy.edge.rules.length} rules applied in the request phase`]
    ],
    // The recoverable failure: everything is built, uploaded and configured, and
    // only the rules are rejected. Nothing is published, so the workload keeps
    // serving its previous deployment and a redeploy costs one more attempt.
    failLogs: (deploy) => [
      [
        RULE_TIMES[0],
        `[manifest] Rule Engine ${deploy.edge.rules[0][1]} with id ${deploy.edge.rules[0][0]} successfully updated`
      ],
      [
        '14:03:01',
        `[ERROR] [manifest] Error while creating Rule Engine ${deploy.edge.rules[1][1]}`
      ],
      [
        '14:03:02',
        `409 Conflict: a rule with this behavior is already bound to workload ${deploy.workload.name}`
      ],
      ['14:03:03', '[ERROR] [manifest] Deploy aborted — nothing was published.']
    ]
  },
  {
    key: 'workload',
    title: 'Workload',
    description: 'Workload deployment published to the domain',
    pendingDescription: 'Publishing the workload deployment',
    logs: (deploy) => [
      [
        '14:03:04',
        `[manifest] Workload ${deploy.workload.name} with id ${deploy.workload.id} successfully updated`
      ],
      [
        '14:03:05',
        `[manifest] Workload Deployment ${deploy.id} with id ${deploy.workload.deployment} successfully created`
      ],
      ['14:03:06', `[manifest] Environment ${deploy.environment.toLowerCase()}`],
      [
        '14:03:07',
        `[manifest] Updated Domain ${deploy.workload.name} with ID ${deploy.workload.id}`
      ]
    ],
    failLogs: (deploy) => [
      [
        '14:03:04',
        `[manifest] Workload ${deploy.workload.name} with id ${deploy.workload.id} successfully updated`
      ],
      ['14:03:06', '[ERROR] [manifest] Error while creating Workload Deployment'],
      ['14:03:06', '409 Conflict: a deployment for this environment is already being published'],
      ['14:03:07', '[ERROR] [manifest] Deploy aborted — nothing was published.']
    ]
  },
  {
    key: 'purge',
    title: 'Cache Purge',
    description: 'Edge cache purged for the domain',
    pendingDescription: 'Purging the edge cache for the domain',
    logs: (deploy) => [
      ['14:03:08', '[purge] purge_on_publish · Initializing cache warming...'],
      ['14:03:09', `[purge] Purge request accepted for ${deploy.workload.domain}`],
      ['14:03:10', '[purge] Cache warmed for 3 edge locations'],
      ['14:03:11', '[purge] Purge finished executing']
    ]
  },
  {
    // The CLI's last line is the one a person actually acts on: the domain the
    // deployment is now serving from. It is its own step because it is the only
    // one whose output is an address rather than a resource.
    key: 'finish',
    title: 'Live',
    description: 'Deployment serving traffic at the domain',
    pendingDescription: 'Waiting for the domain to answer',
    logs: (deploy) => [
      [
        '14:03:12',
        `[deploy] To visualize your application access the Domain: ${deploy.url || `https://${deploy.workload.domain}`}`
      ],
      ['14:03:12', '[deploy] Deployed finished executing']
    ]
  }
]

// ── Step state ─────────────────────────────────────────────────────────────
// A step's state is DERIVED from the deployment, never stored per step: the same
// six steps read differently depending on where the run got to, and storing both
// would let a "Complete" step sit under a deployment that never started.
//
// The state is only used HERE to pick the step's line and its output. Rendering it
// (the glyph, the Tag, the skipped copy) belongs to the one step view every
// deployment surface shares — ui/DeploymentLogs.vue — which derives the same
// states from `failAt` / `activeAt`.

// The milestone a step prints when that part of it worked — the only lines that
// earn LogView's success mark. `[ERROR]` (the CLI's own marker) is a warning,
// which is the strongest type LogView's vocabulary carries.
const MILESTONE = /successfully|rules applied|objects updated|finished executing/

/**
 * A step's output as DeploymentLogs tuples: `[time, message, type]`.
 *
 * The type is stated rather than left to be derived, because the same sentence
 * means different things in different states: inside a FAILED step nothing is a
 * milestone — its lines are the account of a step that did not work, and a green
 * check three lines above the error would be read as progress.
 */
const toTuples = (tuples, failed = false) =>
  tuples.map(([time, message]) => [
    time,
    message,
    message.includes('[ERROR]')
      ? 'warning'
      : !failed && MILESTONE.test(message)
        ? 'success'
        : 'text'
  ])

/**
 * The output of a step that failed.
 *
 * A step that declares `failLogs` owns its whole failure output. One that does not
 * (a failure it was never modelled for) keeps its preamble, drops its closing line
 * — a step that fails never reaches it — and closes with the deployment's own
 * error, so the log never claims something worked.
 */
const failureTuples = (step, deploy) => {
  if (step.failLogs) return step.failLogs(deploy)
  const tuples = step.logs(deploy)
  const [closingTime] = tuples[tuples.length - 1]
  return [...tuples.slice(0, -1), [closingTime, `[ERROR] ${deploy.error.message}`]]
}

/**
 * The output of the step that is still running.
 *
 * A running step must never print its closing milestone: the whole success log
 * under a step that is still working claims an outcome that has not happened, so
 * it shows only what it has reached — by default the line where it started.
 */
const runningTuples = (step, deploy) =>
  step.runningLogs ? step.runningLogs(deploy) : step.logs(deploy).slice(0, 1)

/**
 * The deployment's pipeline in the step model ui/DeploymentLogs.vue reads —
 * `{ key, title, description, durationLabel, logs }` — each step resolved against
 * the run that produced it: the line it reports, the timing the CLI measured, and
 * the output it actually left behind.
 *
 * The states are NOT passed along: DeploymentLogs derives them from `failAt` /
 * `activeAt` (which the page hands it from the same record), so there is one
 * renderer of a step's state for every deployment surface in the console. What is
 * resolved here is only what the state changes about the CONTENT.
 *
 * @param {object} deploy A deployment record.
 * @returns {Array<object>} One entry per step, in pipeline order.
 */
export function stepsOf(deploy) {
  const steps = AZION_DEPLOY_STEPS
  const failIndex = deploy.failedAt ? steps.findIndex((step) => step.key === deploy.failedAt) : -1
  const activeIndex = deploy.activeStep
    ? steps.findIndex((step) => step.key === deploy.activeStep)
    : -1

  const stateAt = (index) => {
    if (failIndex !== -1) {
      if (index < failIndex) return 'done'
      return index === failIndex ? 'failed' : 'skipped'
    }
    if (activeIndex === -1) return 'done'
    if (index < activeIndex) return 'done'
    return index === activeIndex ? 'running' : 'pending'
  }

  // The step that broke, so a skipped step can name what stopped it instead of
  // repeating its own (never-earned) report line.
  const failTitle = failIndex === -1 ? '' : steps[failIndex].title

  // Each state answers a different question, so each gets its own line:
  //   done    → what it did          ("Static assets uploaded to Storage")
  //   failed  → why it broke         (the deployment's own error)
  //   running → what it is doing     (present tense)
  //   pending → what it will do      (present tense)
  //   skipped → why it has no output (the step that stopped the deployment)
  const describe = (step, state) => {
    if (state === 'done') return step.description
    if (state === 'failed') return deploy.error.message
    if (state === 'skipped') {
      return failTitle ? `Never ran — the deployment stopped at ${failTitle}` : 'Never ran'
    }
    return step.pendingDescription
  }

  return steps.map((step, index) => {
    const state = stateAt(index)

    const tuples =
      state === 'failed'
        ? failureTuples(step, deploy)
        : state === 'running'
          ? runningTuples(step, deploy)
          : state === 'done'
            ? step.logs(deploy)
            : []

    return {
      key: step.key,
      title: step.title,
      description: describe(step, state),
      // What the CLI measured for that step, passed through verbatim so the view
      // never re-derives a number the platform already reported.
      durationLabel: deploy.timings[step.key] ?? '',
      logs: toTuples(tuples, state === 'failed')
    }
  })
}

// ── The records ────────────────────────────────────────────────────────────
// Three deployments of the same application, one per outcome the page has to
// render: the deploy that actually shipped this app, a failure that stopped
// mid-pipeline, and one still in flight.
const WORKLOAD = {
  // The real domain id from azion/azion.json, so the Source link and the log lines
  // name the same record.
  id: '1784675753',
  name: 'webkit-sample',
  domain: 'mh2saqc1un.map.azionedge.net',
  deployment: '5591028'
}

// The application as the CONSOLE knows it (the Applications module lists this id
// and name); the CLI's own `__DEFAULT__` naming is never shown on screen.
const APPLICATION = { id: '1784552864', name: 'webkit-sample-vue' }

// The edge artifacts this app really has (azion/azion.json + azion.config.js).
const EDGE = {
  preset: 'vue',
  worker: '.edge/worker.js',
  bundleSize: '1.69 MB',
  objects: 24,
  function: '53089',
  functionName: '__DEFAULT__',
  instance: '47458',
  bucket: 'webkit-sample',
  prefix: '20260722112530',
  connector: 'origin-storage-default',
  connectorId: '263718',
  rules: [
    ['604943', 'Set Storage Origin for All Requests'],
    ['604944', 'Deliver Static Assets'],
    ['604945', 'Redirect to index.html']
  ]
}

export const DEPLOYMENTS = [
  {
    // The deploy that actually shipped this app: `pnpm run deploy` from a terminal
    // (`azion deploy --auto --local`), production, live at the domain
    // azion/azion.json records.
    id: 'd_7Kq2mVbHZ',
    status: 'Ready',
    environment: 'Production',
    trigger: 'cli',
    createdAt: daysAgo(8),
    // The wall-clock between the pipeline's first log line and its last, so the
    // header's total and the steps under it cannot contradict each other.
    duration: '1m 1s',
    failedAt: '',
    activeStep: '',
    error: null,
    url: 'https://mh2saqc1un.map.azionedge.net',
    workload: WORKLOAD,
    application: APPLICATION,
    edge: EDGE,
    timings: {
      build: '28s',
      upload: '8.1s',
      manifest: '1.9s',
      function: '3.6s',
      application: '2.8s',
      connector: '1.9s',
      rules: '4.8s',
      workload: '3.7s',
      purge: '3.4s',
      finish: '0.9s'
    }
  },
  {
    id: 'd_xyCGVY2X4',
    status: 'Error',
    environment: 'Preview',
    trigger: 'console',
    createdAt: hoursAgo(1),
    duration: '48s',
    // The step the platform rejected. Everything behind it is `skipped`.
    failedAt: 'rules',
    activeStep: '',
    error: {
      message: 'The Rules Engine rejected this deployment (409 Conflict).',
      detail:
        'A rule with the same behavior is already bound to this workload, so the manifest was refused. Nothing was published — the workload keeps serving its previous deployment.'
    },
    // No URL: the deployment never reached the workload, so nothing was published
    // under it.
    url: '',
    workload: WORKLOAD,
    application: APPLICATION,
    edge: { ...EDGE, prefix: '20260730140211' },
    // Only the steps that ran. `rules` is the one that broke, so it has a timing
    // (it took 4.1s to be rejected); everything behind it has none, because a
    // step that never ran has no duration to report.
    timings: {
      build: '26s',
      upload: '7.8s',
      manifest: '1.7s',
      function: '3.4s',
      application: '2.6s',
      connector: '1.8s',
      rules: '4.1s'
    }
  },
  {
    id: 'd_p4Rt9LmQ2',
    status: 'Building',
    environment: 'Preview',
    trigger: 'console',
    createdAt: hoursAgo(0),
    duration: '',
    failedAt: '',
    // Still working through the pipeline: this step is running, the two behind it
    // are queued.
    activeStep: 'rules',
    error: null,
    url: '',
    workload: WORKLOAD,
    application: APPLICATION,
    edge: { ...EDGE, prefix: '20260730141902' },
    // The step it is ON carries no timing — it has not finished, so there is no
    // number to report yet.
    timings: {
      build: '31s',
      upload: '9.3s',
      manifest: '2.1s',
      function: '3.8s',
      application: '2.9s',
      connector: '2.0s'
    }
  }
].map((deploy, index) => {
  // The author comes from the shared team roster, the same round-robin every other
  // list uses, so the same person owns the row and the page.
  const person = authorAt(index + 2)
  return {
    ...deploy,
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar
  }
})

/** A deployment by its id, or `undefined` — also the "has a deploy page?" test. */
export const deployById = (id) => DEPLOYMENTS.find((deploy) => deploy.id === id)

/**
 * A deployment as a Deployments-table ROW.
 *
 * The row contract is owned by ui/DeploymentsTable.vue and shared by every
 * deployment surface; mapping here (rather than re-declaring these rows inside the
 * page) is what keeps them reading like every other deployment in the list while
 * the PAGE shows what only a deployment being diagnosed needs.
 *
 * @param {object} deploy A deployment record.
 * @returns {object} A row for ui/DeploymentsTable.vue.
 */
export const deployRow = (deploy) => ({
  id: deploy.id,
  // Which workload published it, so this row satisfies the same contract as the
  // seeded history (src/lib/deployment-history.js) and a workload's own list can be
  // a filter of the module's list rather than a second fixture.
  workloadId: deploy.workload.id,
  workloadName: deploy.workload.name,
  // The deployment id IS its version here: `azion deploy` creates one Workload
  // Deployment per run, and its id is what the CLI, the URL and a support thread
  // all refer to.
  versionId: deploy.id,
  environment: deploy.environment,
  current: deploy.status === 'Ready' && deploy.environment === 'Production',
  status: deploy.status,
  duration: deploy.duration,
  deployedAt: deploy.createdAt,
  date: formatListDate(deploy.createdAt),
  resourceType: 'application',
  resourceName: deploy.application.name,
  resourceId: deploy.application.id,
  // The one resource it deployed, under the field the details drawer reads it as.
  application: deploy.application.name,
  author: deploy.author,
  authorEmail: deploy.authorEmail,
  authorAvatar: deploy.authorAvatar
})

/** Every deployment that has a page, as table rows. */
export const deployRows = () => DEPLOYMENTS.map(deployRow)
