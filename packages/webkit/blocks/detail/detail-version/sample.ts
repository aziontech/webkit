import type { SchemaFormSchema } from '@aziontech/webkit/schema-form'

import type {
  VersionDetailEnvironment,
  VersionDetailResource,
  VersionDetailRevertDiff,
  VersionDetailSettings,
  VersionDetailVersion
} from './detail-version.vue'
import { blankSetting, type CacheSetting } from './detail-version-cache'

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
    createdAt: '2026-11-09T22:00:00Z',
    createdOn: 'Nov 11, 2026'
  },
  {
    id: 'AEO25I38',
    name: 'AEO25I38',
    state: 'deployed',
    comment: 'Remove rule "Legacy load balancer"',
    author: 'Sam Lee',
    createdAt: '2026-11-09T12:00:00Z',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AG1VVDJP',
    name: 'AG1VVDJP',
    state: 'ready',
    comment: 'Enable image optimization',
    author: 'Priya Patel',
    createdAt: '2026-11-07T12:00:00Z',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AHFPL906',
    name: 'AHFPL906',
    state: 'ready',
    comment: 'Update function"ab-test" arguments',
    author: 'Chris Taylor',
    createdAt: '2026-11-07T12:00:00Z',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AITJB4GN',
    name: 'AITJB4GN',
    state: 'ready',
    comment: 'Add variable "API_URL"',
    author: 'Riley Carter',
    createdAt: '2026-11-06T12:00:00Z',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AK7D0ZX4',
    name: 'AK7D0ZX4',
    state: 'ready',
    comment: 'Cache static assets for 30 days',
    author: 'Ethan Brooks',
    createdAt: '2026-11-04T12:00:00Z',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'ALL6QVDL',
    name: 'ALL6QVDL',
    state: 'ready',
    comment: 'Remove rule "Legacy load balancer"',
    author: 'Jordan Kim',
    createdAt: '2026-11-03T12:00:00Z',
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
  rulesNote: 'The rule "Legacy load balancer" comes back.'
}

export const sampleEnvironments: VersionDetailEnvironment[] = [
  { name: 'Production', policy: 'Single', serves: 'AEO25I38' },
  { name: 'Preview', policy: 'Versioned', serves: 'AG1VVDJP' },
  { name: 'Staging', policy: 'Versioned', serves: '' }
]

export type DeviceGroup = {
  id: string
  name: string
  userAgent: string
  author: string
  modifiedAt: string
}

export const sampleDeviceGroups: DeviceGroup[] = [
  {
    id: '3101',
    name: 'mobile',
    userAgent: '(Mobile|iP(hone|od)|Android|IEMobile)',
    author: 'Jane Doe',
    modifiedAt: '2026-11-08T12:00:00Z'
  },
  {
    id: '3102',
    name: 'tablet',
    userAgent: '(iPad|Tablet|Kindle|Silk)',
    author: 'Alex Morgan',
    modifiedAt: '2026-11-03T12:00:00Z'
  },
  {
    id: '3103',
    name: 'crawlers',
    userAgent: '(Googlebot|Bingbot|DuckDuckBot)',
    author: 'Sam Lee',
    modifiedAt: '2026-10-20T12:00:00Z'
  }
]

export type FunctionOption = {
  value: string
  label: string
  schema: SchemaFormSchema | null
}

export type FunctionInstance = {
  id: string
  name: string
  functionId: string
  args: Record<string, unknown>
  active: boolean
  author: string
  modifiedAt: string
}

export const sampleFunctionOptions: FunctionOption[] = [
  {
    value: 'image-resizer',
    label: 'image-resizer',
    schema: {
      type: 'object',
      required: ['width'],
      properties: {
        width: {
          type: 'integer',
          title: 'Width',
          description: 'The width in pixels images are resized to.',
          minimum: 16,
          maximum: 4096
        },
        quality: {
          type: 'integer',
          title: 'Quality',
          description: 'JPEG and WebP quality, from 1 to 100.',
          minimum: 1,
          maximum: 100
        },
        format: {
          type: 'string',
          title: 'Format',
          description: 'The format served to browsers that accept it.',
          enum: ['webp', 'avif', 'jpeg']
        }
      }
    }
  },
  {
    value: 'maintenance-page',
    label: 'maintenance-page',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          title: 'Message',
          description: 'The text visitors read while the site is down.',
          maxLength: 120
        },
        retryAfter: {
          type: 'integer',
          title: 'Retry after in seconds',
          description: 'Sent in the Retry-After header.',
          minimum: 0
        }
      }
    }
  },
  { value: 'header-rewrite', label: 'header-rewrite', schema: null }
]

export const sampleFunctionInstances: FunctionInstance[] = [
  {
    id: '5201',
    name: 'product-images',
    functionId: 'image-resizer',
    args: { width: 640, quality: 80, format: 'webp' },
    active: true,
    author: 'Priya Patel',
    modifiedAt: '2026-11-10T07:00:00Z'
  },
  {
    id: '5202',
    name: 'security-headers',
    functionId: 'header-rewrite',
    args: { set: { 'strict-transport-security': 'max-age=31536000' } },
    active: true,
    author: 'John Smith',
    modifiedAt: '2026-11-07T12:00:00Z'
  },
  {
    id: '5203',
    name: 'planned-maintenance',
    functionId: 'maintenance-page',
    args: { message: 'We are upgrading the store. Back soon.', retryAfter: 1800 },
    active: false,
    author: 'Alex Morgan',
    modifiedAt: '2026-10-27T12:00:00Z'
  }
]

type SourceFile = { size: string; ext: string; modifiedAt: string; author: string }
type SourceFolder = { children: SourceTree }
export type SourceTreeEntry = SourceFile | SourceFolder
export interface SourceTree {
  [name: string]: SourceTreeEntry
}

export const isSourceFolder = (entry: SourceTreeEntry | undefined): entry is SourceFolder =>
  Boolean(entry && 'children' in entry)

export const sampleBucket = 'web-app-assets'
const file = (size: string, ext: string, author: string): SourceFile => ({
  size,
  ext,
  modifiedAt: '2026-11-12T14:02:38Z',
  author
})
export const sampleSourceTree: SourceTree = {
  'assets/': {
    children: {
      'index-4f2a91.js': file('182.4 KB', 'js', 'Jane Doe'),
      'index-8c03de.css': file('24.1 KB', 'css', 'Jane Doe'),
      'logo.svg': file('3.2 KB', 'svg', 'Sam Lee')
    }
  },
  'images/': {
    children: {
      'hero.webp': file('412.7 KB', 'webp', 'Sam Lee'),
      'og-card.png': file('96.3 KB', 'png', 'Sam Lee')
    }
  },
  '404.html': file('4.8 KB', 'html', 'Jane Doe'),
  'favicon.svg': file('1.2 KB', 'svg', 'Jane Doe'),
  'index.html': file('6.0 KB', 'html', 'Jane Doe'),
  'robots.txt': file('64 B', 'txt', 'Alex Morgan')
}

export const sampleCacheSettings: CacheSetting[] = [
  {
    ...blankSetting(),
    id: '7101',
    name: 'static-assets',
    browserBehavior: 'override',
    browserMaxAge: 604800,
    edgeMaxAge: 2592000,
    staleCache: true,
    tieredCache: true,
    queryStringBehavior: 'allowlist',
    queryStringFields: 'v, lang',
    author: 'Jane Doe',
    modifiedAt: '2026-11-09T22:00:00Z'
  },
  {
    ...blankSetting(),
    id: '7102',
    name: 'product-pages',
    edgeMaxAge: 3600,
    deviceBehavior: 'allowlist',
    deviceGroups: ['mobile', 'tablet'],
    author: 'Priya Patel',
    modifiedAt: '2026-11-08T12:00:00Z'
  },
  {
    ...blankSetting(),
    id: '7103',
    name: 'api-bypass',
    browserBehavior: 'no-cache',
    edgeBehavior: 'honor',
    author: 'Sam Lee',
    modifiedAt: '2026-11-03T12:00:00Z'
  }
]
