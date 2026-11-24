export interface ApplicationVersionColumn {
  key: string
  label: string
  width: string
}

export interface ApplicationVersionRow {
  key: string
  group?: boolean
  status?: boolean
  cells: Record<string, string>
}

export const APPLICATION_VERSION_EDITOR = 'user-956415@example.com'

export const APPLICATION_VERSION_TABS = [
  { value: 'main-settings', label: 'Main Settings' },
  { value: 'cache-settings', label: 'Cache Settings' },
  { value: 'device-groups', label: 'Device Groups' },
  { value: 'functions', label: 'Functions' },
  { value: 'rules-engine', label: 'Rules Engine' }
]

export const APPLICATION_VERSION_MODULES = [
  {
    key: 'accelerator',
    label: 'Application Accelerator',
    description: 'Optimize protocols and manage dynamic content delivery.',
    locked: ''
  },
  {
    key: 'cache',
    label: 'Cache',
    description: 'Customize advanced cache settings.',
    locked: 'Automatically enabled in all accounts.'
  },
  {
    key: 'functions',
    label: 'Functions',
    description: 'Build low-latency functions that run close to users.',
    locked: ''
  },
  {
    key: 'image-processor',
    label: 'Image Processor',
    description: 'Enable dynamic image editing options.',
    locked: ''
  }
]

export const APPLICATION_VERSION_TABLES: Record<
  string,
  { columns: ApplicationVersionColumn[]; rows: ApplicationVersionRow[] }
> = {
  'cache-settings': {
    columns: [
      { key: 'name', label: 'Name', width: '300px' },
      { key: 'browser', label: 'Browser Cache', width: '463px' },
      { key: 'cache', label: 'Cache', width: '1fr' }
    ],
    rows: [
      {
        key: 'qa-p-cache',
        cells: {
          name: 'qa-p-cache',
          browser: 'Override Cache Settings',
          cache: 'Override Cache Settings'
        }
      },
      {
        key: 'qa-p-cache2',
        cells: {
          name: 'qa-p-cache2',
          browser: 'Honor Origin Cache Headers',
          cache: 'Override Cache Settings'
        }
      }
    ]
  },
  'device-groups': {
    columns: [
      { key: 'name', label: 'Name', width: '300px' },
      { key: 'id', label: 'ID', width: '344px' },
      { key: 'userAgent', label: 'User Agent', width: '1fr' }
    ],
    rows: [
      {
        key: 'qaMobile',
        cells: { name: 'qaMobile', id: '8793', userAgent: '(?i)(Mobile|Android)' }
      }
    ]
  },
  functions: {
    columns: [
      { key: 'name', label: 'Name', width: '412px' },
      { key: 'fn', label: 'Function', width: '341px' },
      { key: 'editor', label: 'Last Editor', width: '210px' },
      { key: 'modified', label: 'Last Modified', width: '1fr' }
    ],
    rows: [
      {
        key: 'qa-p-fi',
        cells: {
          name: 'qa-p-fi',
          fn: 'qa-p-fn',
          editor: APPLICATION_VERSION_EDITOR,
          modified: 'Sep 24, 2026, 01:18:38 AM'
        }
      },
      {
        key: 'qa-p-fi2',
        cells: {
          name: 'qa-p-fi2',
          fn: 'qa-p-fn',
          editor: APPLICATION_VERSION_EDITOR,
          modified: 'Sep 24, 2026, 01:19:21 AM'
        }
      }
    ]
  },
  'rules-engine': {
    columns: [
      { key: 'name', label: 'Name', width: '234px' },
      { key: 'status', label: 'Status', width: '144px' },
      { key: 'description', label: 'Description', width: '193px' },
      { key: 'editor', label: 'Last Editor', width: '390px' },
      { key: 'modified', label: 'Last Modified', width: '1fr' }
    ],
    rows: [
      { key: 'request', group: true, cells: { name: 'Request' } },
      ...[
        'qa-p-main',
        'qa-p-fn',
        'qa-p-dg',
        'qa-p-deny',
        'qa-p-nc',
        'qa-p-301',
        'qa-p-302',
        'qa-p-sto',
        'qa-p-https',
        'qa-p-cookies'
      ].map((name) => ({
        key: name,
        status: true,
        cells: {
          name,
          status: 'Active',
          description: '-',
          editor: APPLICATION_VERSION_EDITOR,
          modified: 'Sep 24, 2026, 02:33:43 AM'
        }
      }))
    ]
  }
}
