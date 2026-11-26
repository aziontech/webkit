import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
import copilotMark from '@aziontech/webkit/assets/copilot-symbol-color.svg'
import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
import opencodeMark from '@aziontech/webkit/assets/opencode-symbol-mono.svg'

type Workflow = 'Terminal' | 'IDE' | 'Extension'

type Agent = {
  slug: string
  name: string
  vendor: string
  icon: string
  logo: string
  mono: boolean
  workflows: Workflow[]
  pricing: string
  model: string
  context: string
  openSource: boolean
  description: string
}

const agents: Agent[] = [
  {
    slug: 'claude-code',
    name: 'Claude Code',
    vendor: 'Anthropic',
    icon: 'az az-claude',
    logo: claudeMark,
    mono: false,
    workflows: ['Terminal'],
    pricing: 'Subscription',
    model: 'Locked',
    context: 'Project memory',
    openSource: false,
    description:
      'Terminal agent that reads your codebase, runs commands and edits files. One CLI command connects the Azion MCP server.'
  },
  {
    slug: 'cursor',
    name: 'Cursor',
    vendor: 'Cursor',
    icon: 'az az-cursor',
    logo: cursorMark,
    mono: true,
    workflows: ['IDE'],
    pricing: 'Subscription',
    model: 'Multi-provider',
    context: 'Indexed codebase',
    openSource: false,
    description:
      'AI-first IDE with multi-file edits and background agents. Azion plugs into its MCP settings.'
  },
  {
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    vendor: 'GitHub',
    icon: 'az az-github',
    logo: copilotMark,
    mono: false,
    workflows: ['Extension', 'IDE'],
    pricing: 'Subscription',
    model: 'Multi-provider',
    context: 'Indexed codebase',
    openSource: false,
    description:
      'Agent mode inside your editor, with workspace context and pull-request integration. A file in the project connects Azion.'
  },
  {
    slug: 'windsurf',
    name: 'Windsurf',
    vendor: 'Cognition',
    icon: 'az az-windsurf',
    logo: '',
    mono: true,
    workflows: ['IDE'],
    pricing: 'Subscription',
    model: 'Multi-provider',
    context: 'Indexed codebase',
    openSource: false,
    description: 'Agentic IDE built around multi-step tasks. Connects to Azion through mcp-remote.'
  },
  {
    slug: 'codex',
    name: 'Codex',
    vendor: 'OpenAI',
    icon: 'az az-code',
    logo: codexMark,
    mono: true,
    workflows: ['Terminal'],
    pricing: 'Hybrid',
    model: 'Locked',
    context: 'Project memory',
    openSource: true,
    description:
      'Terminal agent that runs commands in a sandbox and reads AGENTS.md natively. Azion goes in config.toml.'
  },
  {
    slug: 'gemini-cli',
    name: 'Gemini CLI',
    vendor: 'Google',
    icon: 'az az-gemini',
    logo: geminiMark,
    mono: false,
    workflows: ['Terminal'],
    pricing: 'Hybrid',
    model: 'Locked',
    context: 'Project memory',
    openSource: true,
    description:
      'Open source terminal agent with a free tier. Declare Azion once in settings.json and verify with /mcp.'
  },
  {
    slug: 'opencode',
    name: 'OpenCode',
    vendor: 'SST',
    icon: 'az az-desktop',
    logo: opencodeMark,
    mono: true,
    workflows: ['Terminal'],
    pricing: 'BYOK',
    model: 'Multi-provider',
    context: 'Project memory',
    openSource: true,
    description:
      'Open source, provider-agnostic terminal agent. Azion is one entry in its MCP block, whichever model you choose.'
  }
]

export const agentHref = (agent: Agent) => `/docs/agent-setup/${agent.slug}`

export const crumbs = [{ label: 'Dev tools', href: '/docs/dev-tools' }, { label: 'Agent setup' }]

export const metaActions = [
  { value: 'copy', label: 'Copy as Markdown', icon: 'az az-copy' },
  { value: 'markdown', label: 'View as Markdown', icon: 'az az-eye' }
]

const filters: Array<'All' | Workflow> = ['All', 'Terminal', 'IDE', 'Extension']

export const grids = filters.map((filter) => ({
  filter,
  agents: filter === 'All' ? agents : agents.filter((agent) => agent.workflows.includes(filter))
}))

export const compareColumns = [
  { id: 'agent', accessorKey: 'agent', header: 'Agent', frozen: 'start' as const, width: 168 },
  {
    id: 'terminal',
    accessorKey: 'terminal',
    header: 'Terminal',
    align: 'center' as const,
    minWidth: 80
  },
  { id: 'ide', accessorKey: 'ide', header: 'IDE', align: 'center' as const, minWidth: 64 },
  {
    id: 'extension',
    accessorKey: 'extension',
    header: 'Extension',
    align: 'center' as const,
    minWidth: 96
  },
  {
    id: 'openSource',
    accessorKey: 'openSource',
    header: 'Open source',
    align: 'center' as const,
    minWidth: 112
  },
  { id: 'pricing', accessorKey: 'pricing', header: 'Pricing', minWidth: 128 },
  { id: 'model', accessorKey: 'model', header: 'Model', minWidth: 148 },
  { id: 'context', accessorKey: 'context', header: 'Context', minWidth: 164 }
]

export const flagColumns = ['terminal', 'ide', 'extension', 'openSource'] as const

export const tagColumns = ['pricing', 'model', 'context'] as const

export const compareRows = agents.map((agent) => ({
  id: agent.slug,
  agent: agent.name,
  icon: agent.icon,
  logo: agent.logo,
  mono: agent.mono,
  href: agentHref(agent),
  terminal: agent.workflows.includes('Terminal'),
  ide: agent.workflows.includes('IDE'),
  extension: agent.workflows.includes('Extension'),
  openSource: agent.openSource,
  pricing: agent.pricing,
  model: agent.model,
  context: agent.context
}))

export const workflowTypes = [
  {
    title: 'Terminal',
    icon: 'az az-desktop',
    description: 'Runs in a shell. Best for automation, scripting and CI pipelines.'
  },
  {
    title: 'IDE',
    icon: 'az az-code',
    description: 'A full editor with the agent first-class: visual diffs and multi-file edits.'
  },
  {
    title: 'Extension',
    icon: 'az az-layout-grid',
    description: 'Plugs into the editor you already use. Lightest install, keeps your setup.'
  },
  {
    title: 'Cloud',
    icon: 'az az-cloud',
    description: 'Hosted, with no local install. Suited to asynchronous, long-running work.'
  }
]

export const keyConcepts = [
  {
    title: 'MCP',
    icon: 'az az-server',
    description:
      'The Model Context Protocol, the standard that lets an agent call external tools. Azion ships one MCP server, and every agent on this page speaks it.'
  },
  {
    title: 'Agent context',
    icon: 'az az-file',
    description:
      'The files an agent reads before it answers: llms.txt for the documentation index, AGENTS.md for your project conventions.'
  },
  {
    title: 'Model flexibility',
    icon: 'az az-sliders-horizontal',
    description:
      'Locked ties you to the maker’s own models. BYOK takes your provider key. Multi-provider switches between several.'
  },
  {
    title: 'Context',
    icon: 'az az-database',
    description:
      'Session forgets at the end of a conversation. Project memory persists in a file you commit. Indexed codebase keeps a searchable index of the repository.'
  }
]

export const tradeoffs = [
  {
    title: 'Cloud vs. local',
    icon: 'az az-cloud-upload',
    description:
      'Cloud runs long tasks without holding your machine, and sends your code somewhere. Local keeps everything on disk, and stops when your laptop does.'
  },
  {
    title: 'Proprietary vs. open source',
    icon: 'az az-github',
    description:
      'Open source can be audited, forked and self-hosted. Proprietary tends to ship the newest capability first.'
  },
  {
    title: 'Locked model vs. BYOK',
    icon: 'az az-key',
    description:
      'A locked model is tuned for its own agent and priced as one subscription. BYOK lets you choose the model per task and pay per token.'
  },
  {
    title: 'Session vs. indexed codebase',
    icon: 'az az-search',
    description:
      'An index answers questions about code nobody opened, at the cost of a copy of the repository. A session only knows what it was shown.'
  }
]
