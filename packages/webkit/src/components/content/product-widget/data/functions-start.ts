export interface TerminalScriptLine {
  kind: 'command' | 'output' | 'gap' | 'ask' | 'progress'
  text: string
  answer?: string
  done?: string
}

export type TerminalScriptName = 'start' | 'deploy'

export interface AgentClient {
  mark: string
  name: string
  label: string
  icon: string
}

export interface AgentTranscriptEntry {
  kind: 'user' | 'agent' | 'tool'
  text?: string
  server?: string
  action?: string
  state?: 'preview' | 'running' | 'done'
  detail?: [string, string][]
}

const FUNCTION_NAME = 'auth-handler'
const FUNCTION_DOMAIN = 'k7q2fmx4ze.map.azionedge.net'
const FUNCTION_APPLICATION = 'azion-site'

const command = (text: string): TerminalScriptLine => ({ kind: 'command', text })
const out = (text: string): TerminalScriptLine => ({ kind: 'output', text })
const ask = (text: string, answer: string): TerminalScriptLine => ({ kind: 'ask', text, answer })
const progress = (text: string, done: string): TerminalScriptLine => ({
  kind: 'progress',
  text,
  done
})
const gap: TerminalScriptLine = { kind: 'gap', text: '' }

export const TERMINAL_SCRIPTS: Record<TerminalScriptName, TerminalScriptLine[]> = {
  start: [
    command('azion init'),
    ask("Your application's name", FUNCTION_NAME),
    ask('Choose a preset', 'JavaScript'),
    ask('Choose a template', 'Hello World'),
    command('azion dev'),
    progress('Building your function', 'Build completed successfully'),
    out('Function running on port 0.0.0.0:3333'),
    command('azion deploy'),
    progress('Uploading source files', 'Upload completed successfully!'),
    progress('Deploying your application', 'Your Application was deployed successfully'),
    out(`Domain: https://${FUNCTION_DOMAIN}`),
    command(`curl https://${FUNCTION_DOMAIN}/`),
    out('Hello World')
  ],
  deploy: [
    command(`azion link --preset javascript --name ${FUNCTION_NAME} --auto`),
    progress('Configuring project', 'Project successfully configured'),
    gap,
    command('azion deploy --auto'),
    progress('Uploading source files', 'Upload completed successfully!'),
    progress('Deploying your application', 'Your Application was deployed successfully'),
    out(`Domain: https://${FUNCTION_DOMAIN}`),
    gap,
    command(`curl https://${FUNCTION_DOMAIN}/`),
    out('Hello World')
  ]
}

export const AGENT_CLIENTS: AgentClient[] = [
  { mark: 'claude', name: 'Claude Code', label: 'Claude Code', icon: 'ai-cor ai-claude' },
  { mark: 'cursor', name: 'Cursor', label: 'Cursor', icon: 'ai-cor ai-cursor' },
  { mark: 'chatgpt', name: 'ChatGPT', label: 'ChatGPT', icon: 'ai-cor ai-open' }
]

export const AGENT_TRANSCRIPT: AgentTranscriptEntry[] = [
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
