import type {
  VersionDetailEnvironment,
  VersionDetailResource,
  VersionDetailRevertDiff,
  VersionDetailSettings,
  VersionDetailVersion
} from './detail-version.vue'

export const sampleResource: VersionDetailResource = {
  name: 'web-app',
  href: '/resources/1784552864'
}

export const sampleVersions: VersionDetailVersion[] = [
  {
    id: 'ADA8FMMR',
    name: 'ADA8FMMR',
    state: 'draft',
    comment: 'Cache static assets for 30 days',
    author: 'John Smith',
    createdAgo: '14 hours ago',
    createdOn: 'Nov 11, 2026'
  },
  {
    id: 'AEO25I38',
    name: 'AEO25I38',
    state: 'deployed',
    comment: 'Remove rule"Legacy load balancer"',
    author: 'Sam Lee',
    createdAgo: '1 day ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AG1VVDJP',
    name: 'AG1VVDJP',
    state: 'ready',
    comment: 'Enable image optimization',
    author: 'Priya Patel',
    createdAgo: '3 days ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AHFPL906',
    name: 'AHFPL906',
    state: 'ready',
    comment: 'Update function"ab-test" arguments',
    author: 'Chris Taylor',
    createdAgo: '3 days ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AITJB4GN',
    name: 'AITJB4GN',
    state: 'ready',
    comment: 'Add variable"API_URL"',
    author: 'Riley Carter',
    createdAgo: '4 days ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AK7D0ZX4',
    name: 'AK7D0ZX4',
    state: 'ready',
    comment: 'Cache static assets for 30 days',
    author: 'Ethan Brooks',
    createdAgo: '6 days ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'ALL6QVDL',
    name: 'ALL6QVDL',
    state: 'ready',
    comment: 'Remove rule"Legacy load balancer"',
    author: 'Jordan Kim',
    createdAgo: '1 week ago',
    createdOn: 'Nov 5, 2026'
  }
]

export const sampleSettings: VersionDetailSettings = {
  name: 'web-app',
  active: true,
  modules: {
    protocol_optimization: true,
    cache: true,
    device_detection: false,
    custom_code: true,
    image_optimization: false,
    load_balancing: false,
    web_socket_proxy: false
  }
}

export const sampleEarlierSettings: VersionDetailSettings = {
  ...sampleSettings,
  modules: { ...sampleSettings.modules, device_detection: true, load_balancing: true }
}

export const sampleRevertDiff: VersionDetailRevertDiff = {
  settings: [
    { setting: 'Device Detection', from: 'Off', to: 'On' },
    { setting: 'Load Balancing', from: 'Off', to: 'On' },
    { setting: 'Image Optimization', from: 'On', to: 'Off' }
  ],
  rulesAdded: 1,
  rulesRemoved: 0,
  rulesNote: 'The rule"Legacy load balancer" comes back.'
}

export const sampleEnvironments: VersionDetailEnvironment[] = [
  { name: 'Production', policy: 'Single', serves: 'AEO25I38' },
  { name: 'Preview', policy: 'Versioned', serves: 'AG1VVDJP' },
  { name: 'Staging', policy: 'Versioned', serves: '' }
]
