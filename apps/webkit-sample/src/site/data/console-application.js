// The six tabs of a console Application, as the Hub's own band reads them.
//
// ONE LIST, TWO READERS. `ConsoleApplicationBand.vue` renders the right column from
// `label` + `lead`; `ConsoleApplicationScene.vue` draws the left mock from everything
// else. They cannot fall out of order or disagree about how many tabs there are,
// because there is one array and it lives here.
//
// EVERY LABEL IS THE CONSOLE'S OWN. The tab ids and labels are the `tabs` array of
// ApplicationDetail.vue; the column headers are the `columns` of each panel; the button
// labels, the drawer titles and the save-bar sentences are the strings those panels pass
// to PageHeading / ResourceDrawer / SettingsSaveBar; the Build values are `buildConfig`'s
// defaults. Nothing in the CHROME is invented — inventing a seventh tab or a nicer button
// label would make this a drawing of a console we do not ship.
//
// THE ROWS ARE A TABLE'S WORTH OF THE SAME DATA. Each list leads with the records
// lib/data/{cache-settings,device-groups,rules-engine,functions}.js actually seed
// ('Default Cache', 'mobiledevices', 'Maintenance page', …) and continues in their
// vocabulary up to five, because a table drawn with two rows reads as an empty state and
// the frame is a fixed height whatever tab is showing. They are row VALUES, not API
// surface: nothing downstream reads them, and the columns above them are the real ones.
//
// (The Hub is a separate area from the console — src/README.md § "The one rule" — so
// these are restated, not imported. That is the cost of the boundary, and the reason
// each entry names where it came from.)
//
// SHAPE. Every tab carries the heading of its own page and its primary action, then
// EITHER a `table` (the four list tabs) or a `form` (the two that are stacked forms),
// then a `second` move — the beat the scene plays after the content settles:
//
//   table  { columns, rows, handle? }   five columns, principal first; `handle` draws
//                                       the reorder grip Rules Engine rows carry
//   form   [{ title, rows }]            rows are { label, value } | { label, on } |
//                                       { label, tag }
//   second { kind: 'drawer', … }        the create drawer that tab's button opens
//          { kind: 'save-bar', … }      the commit bar that mounts on the first edit
//
// A DRAWER'S SECTIONS AND FIELDS ARE THE REAL FORM'S. Each `sections` entry is a `Section`
// of the console's own drawer, in its order, with its title; each field carries the label
// that drawer's `FieldStack` renders and — this is the part a generic form gets wrong — the
// CONTROL it renders: `text`, `textarea`, `select`, `switch`, `radio`, `code`. Rules Engine
// is not four text inputs: it is a name and a description, then a phase picked from two
// blocks, then a criteria ROW of variable / operator / argument, then a behavior, then a
// status switch. Functions Instances is a name, a function selected from a list, and its
// arguments in a code editor. `columns` is how many tracks a section's fields sit on, for
// the two that are a row rather than a stack. A drawer whose form runs past the frame
// clips, which is what the real one does — it scrolls.
export const APPLICATION_TABS = [
  {
    value: 'main-settings',
    label: 'Main Settings',
    lead: 'Name the application, switch it on, and pick the modules it runs. One form, one save.',
    heading: 'Main Settings',
    form: [
      {
        title: 'General',
        rows: [
          { label: 'Name', value: 'webkit-sample-vue' },
          { label: 'Active', on: true }
        ]
      },
      // Two of the tab's module rows, for the same reason the third band carries one: the
      // frame is a fixed height, and what the reader needs from this band is that modules
      // are switches — not the whole inventory.
      {
        title: 'Modules',
        rows: [
          { label: 'Application Accelerator', on: true },
          { label: 'Cache', on: true }
        ]
      },
      // One row, not the two the tab lists: the frame is a fixed height and the third
      // band is what runs past it. The console's page scrolls; a picture of it cannot.
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
  },
  {
    value: 'build',
    label: 'Build',
    lead: 'Connect a repository, pick the framework preset, and deploy a branch. The build settings live with the application.',
    heading: 'Build',
    action: 'Deploy',
    form: [
      {
        title: 'Git repository',
        rows: [
          { label: 'Connected repository', value: 'gab-az/webkit-sample-vue' },
          { label: 'Production branch', value: 'main' }
        ]
      },
      {
        title: 'Build configuration',
        // Two of the tab's four fields, for the frame's sake (see the note on Main
        // Settings' Modules band): the preset and the command it runs.
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
    lead: 'Group requests by user-agent, so a rule can treat a phone differently from a desktop.',
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
    lead: 'Set browser and edge TTLs per policy, and turn tiered cache on where it pays.',
    heading: 'Cache Settings',
    action: 'Add Cache Settings',
    table: {
      tagColumn: 4,
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
    lead: 'Bind a function to this application and pass it the arguments it runs with.',
    heading: 'Functions Instances',
    action: 'Add Functions Instance',
    table: {
      tagColumn: 4,
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
            { kind: 'select', label: 'Edge Function', value: 'ab-test-splitter' },
            // Monaco in the real drawer — a code surface under a label, which is what the
            // design system's CodeBlock is.
            { kind: 'code', label: 'Arguments', value: '{\n  "split": 50\n}' }
          ]
        }
      ]
    }
  },
  {
    value: 'rules-engine',
    label: 'Rules Engine',
    lead: 'Order what happens on request and on response — every rule, in the phase it runs in.',
    heading: 'Rules Engine',
    action: 'Add Rule',
    table: {
      handle: true,
      tagColumn: 4,
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
        // Two blocks side by side, and the phase is set at creation — the drawer's own
        // wording for why it cannot be changed later.
        {
          title: 'Phase',
          columns: 2,
          fields: [
            { kind: 'radio', label: 'Request Phase' },
            { kind: 'radio', label: 'Response Phase', on: true }
          ]
        },
        // One condition, as the repeater lays it out: the variable, the operator that tests
        // it, and the argument it is tested against.
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
  }
]
