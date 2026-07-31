// Async deployment runs — the store for work that OUTLIVES the screen that
// started it.
//
// A deploy is the console's canonical long-running action: it takes tens of
// seconds, and nothing about it requires the user to sit and watch. So the
// screen is not allowed to own it. Everything about a run — its timer, its
// status, its toast — lives at MODULE scope, exactly like `provisioning.js`:
// the page that starts a run can unmount, the user can walk through any module
// in the sidebar, and the run still lands.
//
// That single decision is what the three surfaces below follow from:
//
//   | Surface                | Who owns it   | Why                              |
//   | ---------------------- | ------------- | -------------------------------- |
//   | the run + its timer    | this module   | must survive the page unmounting |
//   | the toast's lifecycle  | this module   | the report has to reach the user |
//   | the toast's ANATOMY    | AppToaster    | its actions navigate + retry     |
//
// The last row is why this file never sets `action` on a toast. A finished run
// is reported through ONE toast id, updated in place across the whole
// lifecycle (`loading` → `success` | `error`) so the report replaces the
// progress instead of stacking a second card on it. AppToaster reads the run
// behind that id and renders the controls the state has earned — see the
// recovery anatomy there.
//
// Reporting rules, which are the point of the scenario:
//
//   • running — `loading` (spinner), duration 0, NOT closable. Progress the
//     user did not ask to dismiss; it is transient by nature and closing it
//     would only hide work that is still happening.
//   • success — auto-dismisses. The outcome is good and the resource is in the
//     lists; nothing is owed to the user beyond the shortcut to it.
//   • error   — duration 0 (persists) and `closable: true`. A failure the user
//     was not looking at when it happened must not expire unseen, and anything
//     that never expires must be dismissible by hand.
import { toast, toastStore } from '@aziontech/webkit/toast'
import { computed, reactive, ref } from 'vue'

import { provisionDeployment } from './provisioning'

/** How long a simulated deploy runs. Long on purpose: leaving is the scenario. */
export const DEPLOY_DURATION_MS = 24_000

/**
 * The failure the API reports back, scoped to the step that produced it.
 *
 * Exported because `step` and the copy MUST agree: the view names the failing
 * step ("Failed on Rules Engine") while this text explains it, and a
 * page that picked its own failing step would caption a broken Build with a
 * story about the Edge Application. One record, read by both.
 */
export const DEPLOY_ERROR = {
  step: 'rules',
  code: 'rules_engine_conflict',
  message: 'The Rules Engine rejected this deployment.',
  detail:
    'The template built, its assets were uploaded and the Edge Application was created — but a rule with the same behavior is already bound to this domain, so the Rules Engine refused the configuration. Nothing was published, so a redeploy starts from the same commit.'
}

// Every run ever started this session, newest first. A plain module-level ref:
// the timers below close over it, so it is alive for as long as the tab is.
const runs = ref([])

/** Timer per run id, kept out of the record so the record stays serialisable. */
const timers = new Map()

let sequence = 0

/** The run currently deploying, or `undefined`. At most one at a time here. */
export const activeRun = computed(() => runs.value.find((run) => run.status === 'running'))

/** The most recent run whatever its state — what a returning page renders. */
export const latestRun = computed(() => runs.value[0])

/** Look a run up by the id of the toast reporting it (AppToaster's entry point). */
export const runByToastId = (toastId) => runs.value.find((run) => run.toastId === toastId)

/** Milliseconds a run has been going; frozen at its full length once settled. */
export const elapsedOf = (run) =>
  run.status === 'running' ? Math.max(0, Date.now() - run.startedAt) : run.durationMs

const clearRunTimer = (runId) => {
  const timer = timers.get(runId)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(runId)
  }
}

/** The one line the toast leads with, per state. */
const titleFor = (run) => {
  if (run.status === 'running') return `Deploying ${run.name}…`
  if (run.status === 'success') return `${run.name} deployed`
  return `Deploying ${run.name} failed`
}

const describeRunning = (run) =>
  `${run.repository} · attempt ${run.attempt}. Keeps running if you leave.`

/**
 * Settle a run and turn its progress toast into the report.
 *
 * The toast is updated UNDER ITS OWN ID rather than dismissed and re-raised, so
 * the card the user has been watching becomes the answer in place.
 */
const settle = (run, outcome) => {
  clearRunTimer(run.id)
  run.status = outcome
  run.finishedAt = Date.now()

  if (outcome === 'success') {
    // A finished deploy provisions the real resource chain (Workload →
    // Application → Connector → Storage), so "View deployment" lands on
    // something the rest of the console already knows about.
    run.record = provisionDeployment({
      repoName: run.name,
      scope: run.scope,
      framework: run.framework,
      templateTitle: run.name
    })
    toastStore.update(run.toastId, {
      type: 'success',
      message: titleFor(run),
      description: `Live at ${run.record.workload.domain}`,
      duration: 6000,
      closable: true
    })
    return run
  }

  run.error = DEPLOY_ERROR
  toastStore.update(run.toastId, {
    type: 'error',
    message: titleFor(run),
    description: DEPLOY_ERROR.message,
    // Persist: a failure the user may not have been present for cannot expire
    // unseen. Persisting is exactly what earns the close control.
    duration: 0,
    closable: true
  })
  return run
}

/** Arm the timer that settles a run. Module-level, so unmounting cannot cancel it. */
const schedule = (run) => {
  clearRunTimer(run.id)
  timers.set(
    run.id,
    setTimeout(() => settle(run, run.outcome), run.durationMs)
  )
}

/**
 * Start a deployment and report it through a toast that survives navigation.
 *
 * @param {object} input
 * @param {string} input.name Repository / application name being deployed.
 * @param {string} [input.repository] `scope/name`, shown as the toast's subject.
 * @param {string} [input.scope] Git scope the repository lives under.
 * @param {string} [input.framework] Template framework, for the provisioned app.
 * @param {'success'|'error'} [input.outcome] Which ending to simulate.
 * @param {number} [input.durationMs] How long the run takes.
 * @returns {object} The live run record.
 */
export function startDeployRun({
  name,
  repository = '',
  scope = 'gab-az',
  framework = 'vue',
  outcome = 'success',
  durationMs = DEPLOY_DURATION_MS
} = {}) {
  // `reactive` per record, not just the array: the timers below settle a run by
  // mutating the object they closed over. Mutating a raw object that merely
  // LIVES in a ref would not trigger anything — the proxy has to be the thing
  // the timer holds, or the page would sit on "Deploying…" forever.
  const run = reactive({
    id: `deploy-run-${++sequence}`,
    toastId: `deploy-run-toast-${sequence}`,
    name,
    repository: repository || `${scope}/${name}`,
    scope,
    framework,
    outcome,
    durationMs,
    attempt: 1,
    status: 'running',
    startedAt: Date.now(),
    finishedAt: 0,
    error: null,
    record: null
  })

  runs.value.unshift(run)

  // `toast.loading` renders the DS Spinner and defaults to duration 0 — the
  // progress card stays put until this module settles it. It is deliberately
  // not closable: there is nothing to acknowledge yet.
  toast.loading(titleFor(run), {
    id: run.toastId,
    description: describeRunning(run)
  })

  schedule(run)
  return run
}

/**
 * Retry a failed run — the recovery the error toast offers.
 *
 * The retry reuses the SAME run record (bumping `attempt`) instead of opening a
 * new one, so the history reads as one deployment that took two tries. Its
 * toast id is reused too, so the error card turns straight back into progress.
 *
 * A retry always succeeds: the simulated failure is the transient kind
 * (a rules-engine conflict), and a redeploy that fails forever would make the
 * recovery path in the toast a dead end.
 *
 * @param {string} runId Id of the run to retry.
 * @returns {object|undefined} The restarted run, or `undefined` if unknown/running.
 */
export function redeployRun(runId) {
  const run = runs.value.find((item) => item.id === runId)
  if (!run || run.status === 'running') return undefined

  run.attempt += 1
  run.outcome = 'success'
  run.status = 'running'
  run.startedAt = Date.now()
  run.finishedAt = 0
  run.error = null
  run.record = null

  toast.loading(titleFor(run), {
    id: run.toastId,
    description: describeRunning(run)
  })

  schedule(run)
  return run
}

/** Drop the report for a run (the toast's own close control does this too). */
export const dismissRunToast = (run) => toast.dismiss(run.toastId)

/**
 * Clear every run and its report — the scenario's reset.
 *
 * Provisioned resources are intentionally left alone: they are real records the
 * rest of the console now lists, and silently deleting them on a demo reset
 * would contradict the success screen that just linked to them.
 */
export function resetDeployRuns() {
  runs.value.forEach((run) => {
    clearRunTimer(run.id)
    toast.dismiss(run.toastId)
  })
  runs.value = []
}
