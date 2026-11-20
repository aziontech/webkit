import { toast } from '@aziontech/webkit/toast'
import { reactive } from 'vue'

import { router } from '../router'
import { type Resource, updateResource } from './store'

export type RunStatus = 'idle' | 'running' | 'success' | 'error'

export const RUN_TOAST = 'demo-deploy-run'
const RUN_MS = 6000

export const run = reactive({
  status: 'idle' as RunStatus,
  outcome: 'success' as 'success' | 'error',
  resourceId: '',
  name: '',
  domain: ''
})

let timer: ReturnType<typeof setTimeout> | undefined

const edit = () => {
  toast.dismiss(RUN_TOAST)
  router.push(`/resources/${run.resourceId}/edit`)
}

const redeploy = () => startDeploy()

export function startDeploy(resource?: Resource) {
  if (resource) {
    run.resourceId = resource.id
    run.name = resource.name
    run.domain = resource.domain
  }
  clearTimeout(timer)
  run.status = 'running'
  toast.loading(`Deploying ${run.name}…`, {
    id: RUN_TOAST,
    description: `acme/${run.name}. It keeps running if you leave.`
  })
  timer = setTimeout(finish, RUN_MS)
}

function finish() {
  const actions = [
    { label: 'Edit', onClick: edit },
    { label: 'Redeploy', onClick: redeploy }
  ]
  if (run.outcome === 'error') {
    run.status = 'error'
    toast.error(`${run.name} wasn't deployed.`, {
      id: RUN_TOAST,
      description: 'The routing rules were refused.',
      duration: 0,
      closable: true,
      actions
    })
    return
  }
  run.status = 'success'
  updateResource(run.resourceId, { status: 'Live' })
  toast.success(`${run.name} is live.`, {
    id: RUN_TOAST,
    description: `It is available at ${run.domain}.`,
    closable: true,
    actions
  })
}

export function resetDeploy() {
  clearTimeout(timer)
  toast.dismiss(RUN_TOAST)
  run.status = 'idle'
}
