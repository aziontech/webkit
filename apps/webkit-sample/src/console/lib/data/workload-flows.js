import { computed } from 'vue'

import { presetLabel } from '../format/presets'
import { APPLICATIONS } from './applications'
import { strategies } from './deployment-strategies'
import { DEFAULT_ENVIRONMENTS } from './environments'
import { provisionedApplications } from './provisioning'
import { domainForWorkload } from './workload-provisioning'

export const WORKLOAD_STEPS = [
  { id: 'application', label: 'Application' },
  { id: 'binding', label: 'Domain and deployment' }
]

export const WORKLOAD_APPLICATIONS = computed(() => [
  ...provisionedApplications.value.map((application) => ({
    value: application.name,
    label: application.name,
    description: 'Created in this session. Its latest version is ready to serve.'
  })),
  ...APPLICATIONS.filter((application) => application.active !== false).map((application) => ({
    value: application.name,
    label: application.name,
    description: `${presetLabel(application.preset)} · ${application.repository}`
  }))
])

export const WORKLOAD_ENVIRONMENTS = computed(() =>
  DEFAULT_ENVIRONMENTS.value.map((environment) => ({
    value: environment.name,
    label: environment.name,
    description: environment.description
  }))
)

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

export const workloadDeploymentName = (id) =>
  WORKLOAD_DEPLOYMENTS.value.find((deployment) => deployment.value === id)?.label ?? ''

export const workloadNameInput = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const deriveWorkloadNames = ({ input, customDomain = '' } = {}) => {
  const slug = workloadNameInput(input)
  return {
    workload: slug,
    deployment: slug ? `${slug}-deployment` : '',
    domain: customDomain.trim().toLowerCase() || domainForWorkload(slug)
  }
}

export const workloadNamesFromForm = (form) =>
  form?.domainType === 'own'
    ? deriveWorkloadNames({ input: form.name, customDomain: form.domainHost })
    : deriveWorkloadNames({ input: form?.domainPrefix })
