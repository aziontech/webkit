import type {
  DeploymentSettingsBindingPolicy,
  DeploymentSettingsDeploymentPolicy,
  DeploymentSettingsService,
  DeploymentSettingsSetting
} from './account-deployment-settings.vue'

/** A row of the settings table: the setting and the services that publish with it. */
export type SettingsRowData = DeploymentSettingsSetting & {
  type: string
  reach: 'Shared' | 'Dedicated' | 'Unused'
  services: string[]
}

export const BINDING_POLICIES: {
  value: DeploymentSettingsBindingPolicy
  label: string
  description: string
}[] = [
  {
    value: 'STRICT',
    label: 'Strict',
    description: 'Lock resource IDs to each version. Promoted versions stay Strict.'
  },
  {
    value: 'FLEXIBLE',
    label: 'Flexible',
    description: 'Allow resource IDs to change across versions.'
  }
]
export const DEPLOYMENT_POLICIES: {
  value: DeploymentSettingsDeploymentPolicy
  label: string
  description: string
}[] = [
  {
    value: 'single_version',
    label: 'Single',
    description: 'One version serves the environment. Deploying replaces what is live.'
  },
  {
    value: 'versioned_urls',
    label: 'Versioned',
    description: 'Each version keeps its own URL, so several are reachable at once.'
  }
]

export const bindingLabel = (value: unknown): string =>
  BINDING_POLICIES.find((policy) => policy.value === value)?.label ?? String(value ?? '')

export const deploymentLabel = (value: unknown): string =>
  DEPLOYMENT_POLICIES.find((policy) => policy.value === value)?.label ?? String(value ?? '')

export const reachLabel = (count: number): string =>
  count === 0 ? 'No services' : count === 1 ? '1 service' : `${count} services`

export const settingNameIn = (settings: DeploymentSettingsSetting[], id: unknown): string =>
  settings.find((setting) => setting.id === String(id))?.name ?? ''

export const servicesBoundTo = (
  services: DeploymentSettingsService[],
  id: string
): DeploymentSettingsService[] =>
  services.filter((service) =>
    service.environments.some((environment) => environment.settingId === id)
  )

export const settingRows = (
  settings: DeploymentSettingsSetting[],
  services: DeploymentSettingsService[]
): SettingsRowData[] =>
  settings.map((setting) => {
    const bound = servicesBoundTo(services, setting.id).map((service) => service.name)
    return {
      ...setting,
      type: setting.system ? 'System' : 'Custom',
      reach: bound.length > 1 ? 'Shared' : bound.length === 1 ? 'Dedicated' : 'Unused',
      services: bound
    }
  })
