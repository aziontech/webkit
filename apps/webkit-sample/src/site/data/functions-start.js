export const FUNCTION_NAME = 'auth-handler'
export const FUNCTION_DOMAIN = 'k7q2fmx4ze.map.azionedge.net'
export const FUNCTION_APPLICATION = 'azion-site'

export const START_TABS = [
  {
    value: 'agents',
    title: 'Ask your coding agent',
    description:
      'Connect the Azion MCP servers to Claude Code, Cursor or Copilot, and the agent creates, instances and routes the function, with a dry run before every write.'
  },
  {
    value: 'console',
    title: 'Build it in the Console',
    description:
      'Choose the application it runs on, write the handler in the editor, name it, and create it. The rule that runs it is drafted for you.'
  },
  {
    value: 'cli',
    title: 'Ship it from the terminal',
    description:
      'azion init scaffolds from 25 presets, azion dev serves it on localhost:3333, and azion deploy puts it on a live domain.'
  }
]

const command = (text) => ({ kind: 'command', text })
const out = (text) => ({ kind: 'output', text })
const gap = { kind: 'gap', text: '' }

export const TERMINAL_SCRIPTS = {
  start: [
    command('azion init'),
    out(`Your application's name: ${FUNCTION_NAME}`),
    out('Choose a preset: Javascript'),
    out('Choose a template: Hello World'),
    command('azion dev'),
    out('✔ Build completed successfully'),
    out('✔ Function running on port 0.0.0.0:3333'),
    command('azion deploy'),
    out('Uploading source files'),
    out('Upload completed successfully!'),
    out('Your Application was deployed successfully'),
    out(`Domain: https://${FUNCTION_DOMAIN}`),
    command(`curl https://${FUNCTION_DOMAIN}/`),
    out('Hello World')
  ],
  deploy: [
    command(`azion link --preset javascript --name ${FUNCTION_NAME} --auto`),
    out('Project successfully configured'),
    gap,
    command('azion deploy --auto'),
    out('Uploading source files'),
    out('Upload completed successfully!'),
    out('Your Application was deployed successfully'),
    out(`Domain: https://${FUNCTION_DOMAIN}`),
    gap,
    command(`curl https://${FUNCTION_DOMAIN}/`),
    out('Hello World')
  ]
}

export const AGENT_CLIENTS = [
  { mark: 'claude', name: 'Claude Code' },
  { mark: 'cursor', name: 'Cursor' },
  { mark: 'copilot', name: 'GitHub Copilot' }
]

export const AGENT_TRANSCRIPT = [
  {
    kind: 'user',
    text: `Create a function that answers 401 when a request has no Authorization header, and run it on ${FUNCTION_APPLICATION}.`
  },
  {
    kind: 'agent',
    text: 'I wrote the handler. Creating it with the Azion build server, previewing first.'
  },
  {
    kind: 'tool',
    server: 'build',
    action: 'Create function',
    state: 'preview',
    detail: [
      ['name', FUNCTION_NAME],
      ['runtime', 'JavaScript'],
      ['execution environment', 'Application']
    ]
  },
  { kind: 'agent', text: 'The preview matches. Applying it.' },
  {
    kind: 'tool',
    server: 'build',
    action: 'Create function',
    state: 'done',
    detail: [[FUNCTION_NAME, 'created']]
  },
  {
    kind: 'tool',
    server: 'build',
    action: 'Create function instance',
    state: 'done',
    detail: [[`${FUNCTION_NAME} instance`, `on ${FUNCTION_APPLICATION}`]]
  },
  {
    kind: 'tool',
    server: 'build',
    action: 'Create rule',
    state: 'done',
    detail: [[`Run ${FUNCTION_NAME}`, 'Request phase']]
  },
  {
    kind: 'agent',
    text: `${FUNCTION_NAME} runs on ${FUNCTION_APPLICATION}. A request without a token now gets 401 Unauthorized.`
  }
]

export const CONSOLE_APPLICATIONS = [
  'azion-site',
  'black-friday-2025',
  'black-friday-2026',
  'azion-docs',
  'azion-docs-next',
  'webkit-sample-vue'
]

export const CONSOLE_HIDDEN_APPLICATIONS = 14

export const CONSOLE_CODE = `export default {
  async fetch(request, env, ctx) {
    const token = request.headers.get('authorization')
    if (!token) return new Response('Unauthorized', { status: 401 })

    return fetch(request)
  }
}
`

export const CONSOLE_STEPS = [
  {
    value: 'where-it-runs',
    title: 'Where it runs',
    description: 'Select the Application or Firewall that runs it.'
  },
  {
    value: 'code',
    title: 'Code',
    description: 'The function body, and the arguments it is called with.'
  },
  {
    value: 'settings',
    title: 'Settings',
    description: 'What the function is called, where it runs, and whether it is active.'
  }
]

export const CONSOLE_ENVIRONMENTS = [
  {
    value: 'application',
    label: 'Application',
    description: 'Runs on requests an application serves, after routing.'
  },
  {
    value: 'firewall',
    label: 'Firewall',
    description:
      'Runs inside Firewall, before the request reaches an application, where a request can still be refused.'
  }
]
