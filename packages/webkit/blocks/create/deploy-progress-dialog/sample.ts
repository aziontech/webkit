import type { DeployProgressDialogItem } from './deploy-progress-dialog.vue'

const failure = 'A rule points at an integration that does not exist, so it kept its version.'

const settings = [
  {
    id: 'production-settings',
    name: 'production-settings',
    environments: 'Production and Preview · 3 projects'
  },
  {
    id: 'storefront-settings',
    name: 'storefront-settings',
    environments: 'Production · 2 projects'
  },
  { id: 'docs-settings', name: 'docs-settings', environments: 'Production · 1 project' },
  { id: 'staging-settings', name: 'staging-settings', environments: 'Staging · 2 projects' },
  { id: 'preview-settings', name: 'preview-settings', environments: 'Preview · 1 project' }
]

export const sampleRunningItems: DeployProgressDialogItem[] = settings.map((entry, index) => ({
  ...entry,
  status: index < 2 ? 'done' : index === 2 ? 'deploying' : 'queued',
  message: ''
}))

export const sampleDeployedItems: DeployProgressDialogItem[] = settings.map((entry) => ({
  ...entry,
  status: 'done',
  message: ''
}))

export const samplePartialItems: DeployProgressDialogItem[] = settings.map((entry) =>
  entry.id === 'staging-settings'
    ? { ...entry, status: 'failed', message: failure }
    : { ...entry, status: 'done', message: '' }
)
