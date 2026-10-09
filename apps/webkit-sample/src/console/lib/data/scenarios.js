import { daysAgo, hoursAgo } from '@shared/lib/dates'

export const SCENARIO_ENVIRONMENTS = [
  {
    id: 'env-stage',
    name: 'Stage',
    description: 'A rehearsal before Production. Each version keeps its own URL.',
    deploymentPolicy: 'versioned_urls',
    robotsPolicy: 'noindex',
    days: 2
  }
]

export const SCENARIO_APPLICATIONS = [
  {
    id: '4410203040',
    name: 'azion-site',
    preset: 'astro',
    source: 'git',
    repository: 'aziontech/azion-site',
    branch: 'main',
    domainName: 'www.azion.com',
    modifiedAt: hoursAgo(5)
  },
  {
    id: '5520304050',
    name: 'black-friday-2025',
    preset: 'next',
    source: 'git',
    repository: 'aziontech/black-friday-2025',
    branch: 'main',
    domainName: 'campaign.azion.com',
    modifiedAt: daysAgo(318)
  },
  {
    id: '5520304060',
    name: 'black-friday-2026',
    preset: 'next',
    source: 'git',
    repository: 'aziontech/black-friday-2026',
    branch: 'main',
    domainName: '',
    modifiedAt: hoursAgo(20)
  },
  {
    id: '6630405060',
    name: 'azion-docs',
    preset: 'astro',
    source: 'git',
    repository: 'aziontech/azion-docs',
    branch: 'main',
    domainName: 'docs.azion.com',
    modifiedAt: daysAgo(4)
  },
  {
    id: '6630405070',
    name: 'azion-docs-next',
    preset: 'next',
    source: 'git',
    repository: 'aziontech/azion-docs-next',
    branch: 'main',
    domainName: '',
    modifiedAt: hoursAgo(9)
  }
]

const VERSIONS = {
  'azion-site': [
    {
      id: 'A2V7QK4M',
      label: 'v2',
      comment: 'Redesign the home page',
      state: 'ready',
      createdAt: hoursAgo(6),
      authorIndex: 1
    },
    {
      id: 'A1M3RT8C',
      label: 'v1',
      comment: 'Launch the site on the edge',
      state: 'active',
      createdAt: daysAgo(3),
      authorIndex: 0
    }
  ],
  'black-friday-2025': [
    {
      id: 'B5K2PX7A',
      label: 'v1',
      comment: 'Launch the Black Friday 2025 landing page',
      state: 'active',
      createdAt: daysAgo(320),
      authorIndex: 2
    }
  ],
  'black-friday-2026': [
    {
      id: 'B6R9TW3D',
      label: 'v1',
      comment: 'First cut of the Black Friday 2026 landing page',
      state: 'ready',
      createdAt: hoursAgo(20),
      authorIndex: 3
    }
  ],
  'azion-docs': [
    {
      id: 'D3H8LQ2N',
      label: 'v1',
      comment: 'Publish the documentation on the edge',
      state: 'active',
      createdAt: daysAgo(4),
      authorIndex: 4
    }
  ],
  'azion-docs-next': [
    {
      id: 'D4M1XV6P',
      label: 'v1',
      comment: 'Rebuild the documentation on Next.js',
      state: 'ready',
      createdAt: hoursAgo(9),
      authorIndex: 5
    }
  ]
}

export const SCENARIO_SETTINGS = [
  {
    id: 's11',
    name: 'azion-site-prod',
    description: 'Production traffic for the Azion site.',
    bindingPolicy: 'STRICT',
    deploymentPolicy: 'single_version',
    safeguards: { skew: true },
    days: 3
  },
  {
    id: 's12',
    name: 'azion-site-preview',
    description: 'Per-version preview URLs for the Azion site.',
    bindingPolicy: 'STRICT',
    deploymentPolicy: 'versioned_urls',
    days: 3
  },
  {
    id: 's13',
    name: 'azion-site-stage',
    description: 'Stage rehearsals for the Azion site.',
    bindingPolicy: 'STRICT',
    deploymentPolicy: 'versioned_urls',
    days: 2
  },
  {
    id: 's14',
    name: 'campaign-landing-prod',
    description: 'Production traffic for the seasonal campaign page.',
    bindingPolicy: 'FLEXIBLE',
    deploymentPolicy: 'single_version',
    days: 320
  },
  {
    id: 's15',
    name: 'campaign-landing-preview',
    description: 'Per-version preview URLs for the seasonal campaign page.',
    bindingPolicy: 'FLEXIBLE',
    deploymentPolicy: 'versioned_urls',
    days: 320
  },
  {
    id: 's16',
    name: 'azion-docs-prod',
    description: 'Production traffic for the documentation site.',
    bindingPolicy: 'STRICT',
    deploymentPolicy: 'single_version',
    days: 4
  },
  {
    id: 's17',
    name: 'azion-docs-preview',
    description: 'Per-version preview URLs for the documentation site.',
    bindingPolicy: 'FLEXIBLE',
    deploymentPolicy: 'versioned_urls',
    days: 4
  }
]

export const SCENARIO_WORKLOADS = [
  {
    id: '1031410001',
    name: 'azion-com-prod',
    applicationId: '4410203040',
    days: 3,
    environments: {
      Production: { settingsId: 's11', domains: ['www.azion.com'] },
      Preview: { settingsId: 's12', domains: ['*-preview.azion.com'] }
    }
  },
  {
    id: '1031410002',
    name: 'azion-com-br-prod',
    applicationId: '4410203040',
    days: 3,
    environments: {
      Production: { settingsId: 's11', domains: ['www.azion.com.br'] },
      Preview: { settingsId: 's12', domains: ['*-preview.azion.com.br'] },
      Stage: { settingsId: 's13', domains: ['*-stage2.azion.run'] }
    }
  },
  {
    id: '1031410003',
    name: 'azion-stage-preview',
    applicationId: '4410203040',
    days: 2,
    environments: {
      Preview: { settingsId: 's13', domains: ['*-preview.azion.run'] },
      Stage: { settingsId: 's13', domains: ['*-stage.azion.run'] }
    }
  },
  {
    id: '1031410004',
    name: 'campaign-landing',
    applicationId: '5520304050',
    days: 318,
    environments: {
      Production: { settingsId: 's14', domains: ['campaign.azion.com'] },
      Preview: { settingsId: 's15', domains: ['*-preview.campaign.azion.com'] }
    }
  },
  {
    id: '1031410005',
    name: 'docs-azion',
    applicationId: '6630405060',
    days: 4,
    environments: {
      Production: { settingsId: 's16', domains: ['docs.azion.com'] },
      Preview: { settingsId: 's17', domains: ['*-preview.docs.azion.com'] }
    }
  }
]

export const SCENARIO_DEPLOYMENTS = [
  { applicationId: '4410203040', versionId: 'A1M3RT8C', settingsId: 's11', hours: 70 },
  { applicationId: '4410203040', versionId: 'A2V7QK4M', settingsId: 's13', hours: 5 },
  { applicationId: '5520304050', versionId: 'B5K2PX7A', settingsId: 's14', hours: 7630 },
  { applicationId: '6630405060', versionId: 'D3H8LQ2N', settingsId: 's16', hours: 96 },
  { applicationId: '6630405060', versionId: 'D3H8LQ2N', settingsId: 's17', hours: 95 }
]

export const scenarioApplicationById = (id) =>
  SCENARIO_APPLICATIONS.find((application) => application.id === String(id))

export const scenarioVersionsFor = (name) => VERSIONS[name] ?? []

export const scenarioWorkloadById = (id) =>
  SCENARIO_WORKLOADS.find((workload) => workload.id === String(id))

export const scenarioApplicationForWorkload = (workloadId) =>
  scenarioApplicationById(scenarioWorkloadById(workloadId)?.applicationId)

export const isScenarioApplication = (id) => Boolean(scenarioApplicationById(id))
