import type {
  DeploymentSettingsDefaults,
  DeploymentSettingsService,
  DeploymentSettingsSetting
} from './deployment-settings.vue'

const referenceTime = Date.UTC(2026, 10, 10, 12)
const daysAgo = (days: number) => new Date(referenceTime - days * 86_400_000)

export const sampleSettings: DeploymentSettingsSetting[] = [
  {
    id: 'ds-default',
    name: 'Default',
    description: 'Used by every environment that has no setting of its own.',
    system: true,
    bindingPolicy: 'STRICT',
    deploymentPolicy: 'single_version',
    status: 'Active',
    updatedAt: daysAgo(180),
    updatedBy: 'system'
  },
  {
    id: 'ds-storefront',
    name: 'storefront-production',
    description: 'Storefront and checkout publish together.',
    system: false,
    bindingPolicy: 'STRICT',
    deploymentPolicy: 'single_version',
    status: 'Active',
    updatedAt: daysAgo(2),
    updatedBy: 'jane.doe@example.com'
  },
  {
    id: 'ds-preview',
    name: 'preview-versioned',
    description: 'Every staging version keeps its own URL.',
    system: false,
    bindingPolicy: 'FLEXIBLE',
    deploymentPolicy: 'versioned_urls',
    status: 'Active',
    updatedAt: daysAgo(9),
    updatedBy: 'alex.morgan@example.com'
  },
  {
    id: 'ds-docs',
    name: 'docs-site',
    description: '',
    system: false,
    bindingPolicy: 'FLEXIBLE',
    deploymentPolicy: 'single_version',
    status: 'Active',
    updatedAt: daysAgo(21),
    updatedBy: 'sam.lee@example.com'
  },
  {
    id: 'ds-legacy',
    name: 'legacy-rollout',
    description: 'Kept for the old release pipeline.',
    system: false,
    bindingPolicy: 'FLEXIBLE',
    deploymentPolicy: 'single_version',
    status: 'Inactive',
    updatedAt: daysAgo(64),
    updatedBy: 'jane.doe@example.com'
  }
]

export const sampleServices: DeploymentSettingsService[] = [
  {
    id: 'svc-storefront',
    name: 'storefront',
    environments: [
      {
        name: 'Production',
        deploymentPolicy: 'single_version',
        settingId: 'ds-storefront',
        auto: false
      },
      { name: 'Staging', deploymentPolicy: 'versioned_urls', settingId: 'ds-preview', auto: true }
    ]
  },
  {
    id: 'svc-checkout',
    name: 'checkout-api',
    environments: [
      {
        name: 'Production',
        deploymentPolicy: 'single_version',
        settingId: 'ds-storefront',
        auto: false
      }
    ]
  },
  {
    id: 'svc-docs',
    name: 'docs-site',
    environments: [
      { name: 'Production', deploymentPolicy: 'single_version', settingId: 'ds-docs', auto: true },
      { name: 'Staging', deploymentPolicy: 'single_version', settingId: 'ds-default', auto: true }
    ]
  },
  {
    id: 'svc-status',
    name: 'status-page',
    environments: [
      {
        name: 'Production',
        deploymentPolicy: 'single_version',
        settingId: 'ds-default',
        auto: true
      }
    ]
  }
]

export const sampleDefaults: DeploymentSettingsDefaults = {
  bindingPolicy: 'STRICT',
  deploymentPolicy: 'single_version'
}

export const sampleCurrentUser = 'jane.doe@example.com'
