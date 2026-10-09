import { toast, toastStore } from '@aziontech/webkit/toast'
import {
  advanceConsoleDeploy,
  AZION_DEPLOY_STEPS,
  restartConsoleDeploy,
  settleConsoleDeploy,
  startConsoleDeploy
} from '@shared/lib/azion-deploys'
import { computed, reactive, ref } from 'vue'

import { provisionDeployment } from '../data/provisioning'

export const DEPLOY_DURATION_MS = 24_000

export const RESOURCE_DEPLOY_DURATION_MS = 14_000

export const DEPLOY_ERROR = {
  step: 'rules',
  code: 'rules_engine_conflict',
  message: 'The Rules Engine rejected this deployment.',
  detail:
    'The template built, its assets were uploaded and the Application was created — but a rule with the same behavior is already bound to this domain, so the Rules Engine refused the configuration. Nothing was published, so a redeploy starts from the same commit.'
}

const runs = ref([])

const timers = new Map()

let sequence = 0

export const activeRun = computed(() => runs.value.find((run) => run.status === 'running'))

export const latestRun = computed(() => runs.value[0])

export const runByToastId = (toastId) => runs.value.find((run) => run.toastId === toastId)

export const elapsedOf = (run) =>
  run.status === 'running' ? Math.max(0, Date.now() - run.startedAt) : run.durationMs

const clearRunTimer = (runId) => {
  const armed = timers.get(runId)
  if (armed === undefined) return
  armed.forEach((timer) => clearTimeout(timer))
  timers.delete(runId)
}

const armTimer = (runId, timer) => {
  timers.set(runId, [...(timers.get(runId) ?? []), timer])
}

const titleFor = (run) => {
  if (run.status === 'running') return `Deploying ${run.name}…`
  if (run.status === 'success') return `${run.name} deployed`
  return `Deploying ${run.name} failed`
}

const describeRunning = (run) =>
  `${run.subject} · attempt ${run.attempt}. Keeps running if you leave.`

const durationLabel = (run) => `${Math.round(run.durationMs / 1000)}s`

const settleResourceRun = (run, outcome) => {
  if (outcome === 'success') {
    const record = settleConsoleDeploy(run.deployId, {
      status: 'Ready',
      duration: durationLabel(run),
      url: `https://${run.domain}`
    })
    if (run.notify)
      toastStore.update(run.toastId, {
        type: 'success',
        message: titleFor(run),
        description: run.current
          ? `Now serving ${run.domain}`
          : `Deployed to ${run.workloadName} — not current`,
        duration: 6000,
        closable: true
      })
    return record
  }

  run.error = DEPLOY_ERROR
  const record = settleConsoleDeploy(run.deployId, {
    status: 'Error',
    duration: durationLabel(run),
    failedAt: DEPLOY_ERROR.step,
    error: { message: DEPLOY_ERROR.message, detail: DEPLOY_ERROR.detail }
  })
  if (run.notify)
    toastStore.update(run.toastId, {
      type: 'error',
      message: titleFor(run),
      description: DEPLOY_ERROR.message,
      duration: 0,
      closable: true
    })
  return record
}

const settle = (run, outcome) => {
  clearRunTimer(run.id)
  run.status = outcome
  run.finishedAt = Date.now()

  if (run.kind === 'resource') {
    settleResourceRun(run, outcome)
    return run
  }

  if (outcome === 'success') {
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
    duration: 0,
    closable: true
  })
  return run
}

const armSteps = (run) => {
  const lastIndex =
    run.outcome === 'error'
      ? AZION_DEPLOY_STEPS.findIndex((step) => step.key === DEPLOY_ERROR.step)
      : AZION_DEPLOY_STEPS.length - 1
  const stepMs = run.durationMs / (lastIndex + 1)

  for (let index = 1; index <= lastIndex; index += 1) {
    const step = AZION_DEPLOY_STEPS[index]
    armTimer(
      run.id,
      setTimeout(() => advanceConsoleDeploy(run.deployId, step.key), Math.round(index * stepMs))
    )
  }
}

const schedule = (run) => {
  clearRunTimer(run.id)
  armTimer(
    run.id,
    setTimeout(() => settle(run, run.outcome), run.durationMs)
  )
  if (run.kind === 'resource') armSteps(run)
}

export function startDeployRun({
  name,
  repository = '',
  scope = 'gab-az',
  framework = 'vue',
  outcome = 'success',
  durationMs = DEPLOY_DURATION_MS
} = {}) {
  const run = reactive({
    id: `deploy-run-${++sequence}`,
    toastId: `deploy-run-toast-${sequence}`,
    kind: 'clone',
    name,
    repository: repository || `${scope}/${name}`,
    subject: repository || `${scope}/${name}`,
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

  toast.loading(titleFor(run), {
    id: run.toastId,
    description: describeRunning(run)
  })

  schedule(run)
  return run
}

export function startResourceDeployRun({
  workload,
  application,
  strategy = null,
  deploymentName = '',
  current = true,
  environment = 'Production',
  preset = 'vue',
  outcome = 'success',
  durationMs = RESOURCE_DEPLOY_DURATION_MS,
  notify = true,
  version = null,
  resources = [],
  dependencies = []
} = {}) {
  const record = startConsoleDeploy({
    workload,
    application,
    version,
    resources,
    dependencies,
    environment,
    preset,
    current,
    deploymentName,
    strategyName: strategy?.name ?? ''
  })

  const run = reactive({
    id: `deploy-run-${++sequence}`,
    toastId: `deploy-run-toast-${sequence}`,
    kind: 'resource',
    deployId: record.id,
    name: application.name,
    subject: strategy?.name ? `${workload.name} · ${strategy.name}` : workload.name,
    workloadId: workload.id,
    workloadName: workload.name,
    domain: workload.domain,
    strategyName: strategy?.name ?? '',
    current,
    environment,
    outcome,
    durationMs,
    notify,
    attempt: 1,
    status: 'running',
    startedAt: Date.now(),
    finishedAt: 0,
    error: null,
    record: null
  })

  runs.value.unshift(run)

  if (notify)
    toast.loading(titleFor(run), {
      id: run.toastId,
      description: describeRunning(run),
      closable: true
    })

  schedule(run)
  return run
}

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

  if (run.kind === 'resource') restartConsoleDeploy(run.deployId)

  if (run.notify !== false)
    toast.loading(titleFor(run), {
      id: run.toastId,
      description: describeRunning(run)
    })

  schedule(run)
  return run
}

export const dismissRunToast = (run) => toast.dismiss(run.toastId)

export function resetDeployRuns() {
  runs.value.forEach((run) => {
    clearRunTimer(run.id)
    toast.dismiss(run.toastId)
  })
  runs.value = []
}
