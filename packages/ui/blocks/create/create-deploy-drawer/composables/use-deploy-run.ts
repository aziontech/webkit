import { toast } from '@aziontech/ui/toast'
import { onScopeDispose, type Ref, ref, watch } from 'vue'

import type { DeployDrawerValues } from '../types'

const RUN_MS = 3200

/** How a deploy run ends, raised in the run toast. */
export interface DeployRunOutcome {
  /** Whether the run went live or failed. */
  status: 'success' | 'error'
  /** The toast title. */
  title: string
  /** The toast description. */
  description: string
}

/** Options of `useDeployRun`. */
export interface UseDeployRunOptions {
  /** The id of the run toast. */
  toastId: string
  /** Whether the drawer is open; Edit reopens it. */
  open: Ref<boolean>
  /** The values the drawer opens with; Edit reopens it on the deployed ones. */
  defaults: Ref<Partial<DeployDrawerValues>>
  /** The values the drawer opens with when it closes. */
  initialValues: Partial<DeployDrawerValues>
  /** The loading toast of a run that starts. */
  start: (values: DeployDrawerValues) => { title: string; description: string }
  /** How the run ends; attempt counts the runs, from 1. */
  finish: (values: DeployDrawerValues, attempt: number) => DeployRunOutcome
}

/** What `useDeployRun` returns. */
export interface UseDeployRunReturn {
  /** Starts a run with the submitted values. */
  onSubmit: (event: Event, values: DeployDrawerValues) => void
}

export function useDeployRun(options: UseDeployRunOptions): UseDeployRunReturn {
  const { toastId, open, defaults, initialValues } = options
  const deployed = ref<DeployDrawerValues | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined
  let attempts = 0

  watch(open, (isOpen) => {
    if (!isOpen) defaults.value = initialValues
  })

  const edit = () => {
    toast.dismiss(toastId)
    if (deployed.value) defaults.value = deployed.value
    open.value = true
  }

  const startRun = () => {
    const values = deployed.value
    if (!values) return
    clearTimeout(timer)
    attempts += 1
    const attempt = attempts
    const actions = [
      { label: 'Edit', onClick: edit },
      { label: 'Redeploy', onClick: startRun }
    ]
    const loading = options.start(values)
    toast.loading(loading.title, { id: toastId, description: loading.description })
    timer = setTimeout(() => {
      const outcome = options.finish(values, attempt)
      toast[outcome.status](outcome.title, {
        id: toastId,
        description: outcome.description,
        duration: 0,
        closable: true,
        actions
      })
    }, RUN_MS)
  }

  const onSubmit = (_event: Event, values: DeployDrawerValues) => {
    deployed.value = values
    startRun()
  }

  onScopeDispose(() => {
    clearTimeout(timer)
    toast.dismiss(toastId)
  })

  return { onSubmit }
}
