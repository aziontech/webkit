/** A tab of the console Application page the scene draws. */
export type ConsoleApplicationSceneTab =
  | 'build'
  | 'device-groups'
  | 'cache-settings'
  | 'functions-instances'
  | 'rules-engine'
  | 'main-settings'

export type ConsoleApplicationFormRow =
  { label: string; value: string } | { label: string; tag: string } | { label: string; on: boolean }

export type ConsoleApplicationFormBand = {
  title: string
  rows: ConsoleApplicationFormRow[]
}

export type ConsoleApplicationTable = {
  columns: string[]
  rows: string[][]
  statusColumn?: number
  reorderable?: boolean
}

export type ConsoleApplicationField =
  | { kind: 'text' | 'textarea' | 'select' | 'code'; label: string; value: string }
  | { kind: 'switch'; label: string; on: boolean }
  | { kind: 'choice'; label: string; options: string[]; value: string }

export type ConsoleApplicationSection = {
  title: string
  columns?: 1 | 2 | 3
  fields: ConsoleApplicationField[]
}

export type ConsoleApplicationSecondMove =
  | { kind: 'drawer'; title: string; action: string; sections: ConsoleApplicationSection[] }
  | { kind: 'save-bar'; label: string; hint: string }

export type ConsoleApplicationStep = {
  value: ConsoleApplicationSceneTab
  label: string
  heading: string
  action?: string
  table?: ConsoleApplicationTable
  form?: ConsoleApplicationFormBand[]
  second: ConsoleApplicationSecondMove
}

export const CONSOLE_APPLICATION_STEPS: ConsoleApplicationStep[] = [
  {
    value: 'build',
    label: 'Build',
    heading: 'Build',
    action: 'Deploy',
    form: [
      {
        title: 'Git repository',
        rows: [
          { label: 'Connected repository', value: 'azion/storefront-vue' },
          { label: 'Production branch', value: 'main' }
        ]
      },
      {
        title: 'Build configuration',
        rows: [
          { label: 'Framework preset', value: 'Vue' },
          { label: 'Build command', value: 'azion build' }
        ]
      },
      {
        title: 'Latest deployment',
        rows: [{ label: 'production', tag: 'Ready' }]
      }
    ],
    second: {
      kind: 'save-bar',
      label: 'Build configuration changed.',
      hint: 'Saving applies it to the next build of this application.'
    }
  },
  {
    value: 'device-groups',
    label: 'Device Groups',
    heading: 'Device Groups',
    action: 'Add Device Group',
    table: {
      columns: ['Name', 'ID', 'User-agent match', 'Last Editor', 'Last Modified'],
      rows: [
        ['mobiledevices', 'dg-mobile', '(Mobile|iPhone|Android|BlackBerry)', 'gab', '9 days ago'],
        ['desktop', 'dg-desktop', 'Mozilla.*(Windows|Macintosh)', 'gab', '9 days ago'],
        ['tablets', 'dg-tablet', '(iPad|Tablet|Nexus 7)', 'gab', 'last month'],
        ['crawlers', 'dg-bots', '(Googlebot|bingbot|DuckDuckBot)', 'gab', 'last month'],
        ['consoles', 'dg-console', '(PlayStation|Xbox|Nintendo)', 'gab', '2 months ago']
      ]
    },
    second: {
      kind: 'drawer',
      title: 'Add Device Group',
      action: 'Save',
      sections: [
        { title: 'General', fields: [{ kind: 'text', label: 'Name', value: 'smart-tv' }] },
        {
          title: 'Match to User-Agent',
          fields: [{ kind: 'text', label: 'Regular expression', value: '(SmartTV|AppleTV|HbbTV)' }]
        }
      ]
    }
  },
  {
    value: 'cache-settings',
    label: 'Cache Settings',
    heading: 'Cache Settings',
    action: 'Add Cache Settings',
    table: {
      statusColumn: 4,
      columns: ['Name', 'ID', 'Browser cache', 'Edge cache', 'Tiered cache'],
      rows: [
        ['Default Cache', 'cs-default', 'Honor origin', '60 seconds', 'Disabled'],
        ['Static Assets', 'cs-static', '7 days', '30 days', 'Enabled'],
        ['API responses', 'cs-api', 'No cache', '5 seconds', 'Disabled'],
        ['Image variants', 'cs-images', '1 day', '7 days', 'Enabled'],
        ['Feed endpoints', 'cs-feeds', 'No cache', '30 seconds', 'Disabled']
      ]
    },
    second: {
      kind: 'drawer',
      title: 'Add Cache Settings',
      action: 'Save',
      sections: [
        { title: 'General', fields: [{ kind: 'text', label: 'Name', value: 'Product pages' }] },
        {
          title: 'Browser Cache',
          fields: [
            { kind: 'select', label: 'Behavior', value: 'Override cache settings' },
            { kind: 'text', label: 'Maximum TTL (seconds)', value: '3600' }
          ]
        },
        {
          title: 'Edge Cache',
          fields: [
            { kind: 'select', label: 'Behavior', value: 'Override cache settings' },
            { kind: 'text', label: 'Maximum TTL (seconds)', value: '2592000' }
          ]
        }
      ]
    }
  },
  {
    value: 'functions-instances',
    label: 'Functions Instances',
    heading: 'Functions Instances',
    action: 'Add Functions Instance',
    table: {
      statusColumn: 4,
      columns: ['Name', 'ID', 'Function', 'Arguments', 'Status'],
      rows: [
        ['auth-gate', 'fi-4821', 'auth-handler', '{ "issuer": "azion" }', 'Active'],
        ['thumbnails', 'fi-4822', 'image-optimizer', '{ "width": 640 }', 'Active'],
        ['geo-split', 'fi-4823', 'geo-router', '{ "default": "br" }', 'Active'],
        ['rewrite-docs', 'fi-4824', 'html-rewriter', '{ "prefix": "/docs" }', 'Inactive'],
        ['bot-score', 'fi-4825', 'bot-score-tagger', '{ "header": "x-bot" }', 'Active']
      ]
    },
    second: {
      kind: 'drawer',
      title: 'Add Functions Instance',
      action: 'Save',
      sections: [
        { title: 'General', fields: [{ kind: 'text', label: 'Name', value: 'ab-test' }] },
        {
          title: 'Function',
          fields: [
            { kind: 'select', label: 'Function', value: 'ab-test-splitter' },
            { kind: 'code', label: 'Arguments', value: '{\n  "split": 50\n}' }
          ]
        }
      ]
    }
  },
  {
    value: 'rules-engine',
    label: 'Rules Engine',
    heading: 'Rules Engine',
    action: 'Add Rule',
    table: {
      reorderable: true,
      statusColumn: 4,
      columns: ['Name', 'Phase', 'Criteria', 'Behavior', 'Status'],
      rows: [
        ['Maintenance page', 'Request', '${uri} starts with /maintenance', 'Deliver', 'Active'],
        ['Redirect www', 'Request', '${host} is equal www.azion.com', 'Redirect 301', 'Active'],
        ['API gateway', 'Request', '${uri} starts with /api', 'Set origin', 'Active'],
        ['Cache bypass', 'Response', '${status} is equal 503', 'Bypass cache', 'Active'],
        ['Security headers', 'Response', '${uri} matches ^/', 'Add headers', 'Active']
      ]
    },
    second: {
      kind: 'drawer',
      title: 'Add Rule',
      action: 'Save',
      sections: [
        {
          title: 'General',
          fields: [
            { kind: 'text', label: 'Name', value: 'Compress assets' },
            {
              kind: 'textarea',
              label: 'Description',
              value: 'Compress static assets on the way out.'
            }
          ]
        },
        {
          title: 'Phase',
          fields: [
            {
              kind: 'choice',
              label: 'Phase',
              options: ['Request Phase', 'Response Phase'],
              value: 'Response Phase'
            }
          ]
        },
        {
          title: 'Criteria',
          columns: 3,
          fields: [
            { kind: 'select', label: 'Variable', value: '${uri}' },
            { kind: 'select', label: 'Operator', value: 'matches' },
            { kind: 'text', label: 'Argument', value: '\\.(js|css|svg)$' }
          ]
        },
        {
          title: 'Behaviors',
          fields: [{ kind: 'select', label: 'Behavior', value: 'Enable Gzip' }]
        },
        { title: 'Status', fields: [{ kind: 'switch', label: 'Active', on: true }] }
      ]
    }
  },
  {
    value: 'main-settings',
    label: 'Settings',
    heading: 'Settings',
    form: [
      {
        title: 'General',
        rows: [
          { label: 'Name', value: 'storefront-vue' },
          { label: 'Active', on: true }
        ]
      },
      {
        title: 'Modules',
        rows: [
          { label: 'Application Accelerator', on: true },
          { label: 'Cache', on: true }
        ]
      },
      {
        title: 'Subscription modules',
        rows: [{ label: 'Load Balancer', on: false }]
      }
    ],
    second: {
      kind: 'save-bar',
      label: 'Application settings changed.',
      hint: 'Saving publishes them on the next deployment.'
    }
  }
]
