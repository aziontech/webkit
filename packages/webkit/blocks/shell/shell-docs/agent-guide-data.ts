import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
import copilotMark from '@aziontech/webkit/assets/copilot-symbol-color.svg'
import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
import opencodeMark from '@aziontech/webkit/assets/opencode-symbol-mono.svg'
import type { DocCodeGroupSample } from '@aziontech/webkit/doc-code-group'

type Step = {
  title: string
  body: string
  samples?: DocCodeGroupSample[]
  note?: string
  prompt?: string
}

export const MCP_SERVER_URL = 'https://mcp.azion.com'

export const others = [
  {
    slug: 'cursor',
    name: 'Cursor',
    vendor: 'Cursor',
    icon: 'az az-cursor',
    logo: cursorMark,
    mono: true,
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
    description:
      'Agent mode inside your editor, with workspace context and pull-request integration.'
  },
  {
    slug: 'windsurf',
    name: 'Windsurf',
    vendor: 'Cognition',
    icon: 'az az-windsurf',
    logo: '',
    mono: true,
    description: 'Agentic IDE built around multi-step tasks. Connects through mcp-remote.'
  },
  {
    slug: 'codex',
    name: 'Codex',
    vendor: 'OpenAI',
    icon: 'az az-code',
    logo: codexMark,
    mono: true,
    description: 'Terminal agent that runs commands in a sandbox and reads AGENTS.md natively.'
  },
  {
    slug: 'gemini-cli',
    name: 'Gemini CLI',
    vendor: 'Google',
    icon: 'az az-gemini',
    logo: geminiMark,
    mono: false,
    description: 'Open source terminal agent with a free tier. Verify the server with /mcp.'
  },
  {
    slug: 'opencode',
    name: 'OpenCode',
    vendor: 'SST',
    icon: 'az az-desktop',
    logo: opencodeMark,
    mono: true,
    description: 'Open source, provider-agnostic terminal agent, whichever model you choose.'
  }
]

export const crumbs = [
  { label: 'Dev tools', href: '/docs/dev-tools' },
  { label: 'Agent setup', href: '/docs/agent-setup' },
  { label: 'Claude Code' }
]

export const metaActions = [
  { value: 'copy', label: 'Copy as Markdown', icon: 'az az-copy' },
  { value: 'markdown', label: 'View as Markdown', icon: 'az az-eye' }
]

export const facts = ['Terminal', 'Subscription', 'Locked', 'Project memory']

export const headerLinks = [
  { label: 'Azion MCP server', href: 'https://www.azion.com/en/documentation/devtools/mcp/' },
  {
    label: 'MCP configuration',
    href: 'https://www.azion.com/en/documentation/devtools/mcp/configuration/'
  },
  { label: 'Azion CLI', href: 'https://www.azion.com/en/documentation/devtools/cli/' }
]

export const steps: Step[] = [
  {
    title: 'Install Claude Code',
    body: 'Install the CLI globally, then run it once from your project so it can index the repository.',
    samples: [{ label: 'npm', language: 'bash', code: 'npm install -g @anthropic-ai/claude-code' }]
  },
  {
    title: 'Create a Personal Token',
    body: 'In [Azion Console](https://console.azion.com/personal-tokens), open **Personal Tokens** and create one scoped to what the agent may change. The agent authenticates as you with it.',
    note: 'Treat the token like a password: keep it in your user configuration, never in a file you commit.'
  },
  {
    title: 'Connect the Azion MCP server',
    body: 'One command registers the server for every session. Claude Code stores it in your user configuration.',
    samples: [
      {
        label: 'Terminal',
        language: 'bash',
        code: `claude mcp add "azion-mcp" "${MCP_SERVER_URL}" -t http -H "Authorization: Bearer YOUR_PERSONAL_TOKEN"`
      }
    ]
  },
  {
    title: 'Verify the connection',
    body: '`claude mcp list` names the servers it knows about; `/mcp` inside a session lists the tools each one exposes.',
    samples: [{ label: 'Terminal', language: 'bash', code: 'claude mcp list' }],
    prompt:
      'List the Azion MCP tools you can call, then search the Azion docs for how caching works.'
  }
]

export const mcpTools = [
  {
    id: 'search-docs',
    title: 'search_docs',
    description: 'Search the documentation and the product pages.'
  },
  {
    id: 'search-code-samples',
    title: 'search_code_samples',
    description: 'Retrieve working examples from the code-samples library.'
  },
  {
    id: 'search-cli-commands',
    title: 'search_cli_commands',
    description: 'Look up an Azion CLI command and its flags.'
  },
  {
    id: 'search-api-commands',
    title: 'search_api_commands',
    description: 'The REST API: connectors, workloads and applications.'
  },
  {
    id: 'search-terraform',
    title: 'search_terraform',
    description: 'The Terraform provider resources and arguments.'
  },
  {
    id: 'create-rules',
    title: 'create_rules',
    description: 'Generate a rules configuration from a description.'
  },
  {
    id: 'create-graphql-query',
    title: 'create_graphql_query',
    description: 'Build a GraphQL query against the analytics API.'
  },
  {
    id: 'deploy-static-site',
    title: 'deploy_static_site',
    description: 'Walk a static project through to a deployed application.'
  }
]

export const mcpColumns = [
  { id: 'title', accessorKey: 'title', header: 'Tool', minWidth: 80 },
  { id: 'description', accessorKey: 'description', header: 'What it does', grow: 2 as const }
]

export const cliSamples: DocCodeGroupSample[] = [
  { label: 'Install', language: 'bash', code: 'npm install -g azion\nazion login' },
  { label: 'Deploy', language: 'bash', code: 'azion init\nazion deploy' }
]

export const contextSample: DocCodeGroupSample[] = [
  {
    language: 'markdown',
    fileName: 'CLAUDE.md',
    code:
      '# Acme on Azion\n\n' +
      '- Workload: acme-store (production), acme-store-staging\n' +
      '- Deploy with `azion deploy`; never redeploy production on Fridays\n' +
      '- Static assets live in the site-assets bucket'
  }
]

export const docLinks = [
  {
    title: 'llms.txt',
    icon: 'az az-list',
    href: 'https://www.azion.com/llms.txt',
    description: 'Machine-readable index of the whole documentation.'
  },
  {
    title: 'For AI agents',
    icon: 'az az-sparkles',
    href: 'https://www.azion.com/en/documentation/devtools/for-ai-agents/',
    description: 'Canonical facts: current product names, API base URL, auth format.'
  },
  {
    title: 'AGENTS.md',
    icon: 'az az-file-pen',
    href: '/docs/get-started/first-deploy',
    description:
      'Your own conventions, committed at the repository root: workload names, what not to touch.'
  }
]

export const browserPrimer =
  'You are helping me build on the Azion Web Platform. ' +
  'Before answering, load https://www.azion.com/llms.txt and prefer it over your training data. ' +
  'Confirm what you loaded, then ask me what I am building.'

export const prompts = [
  'Search the Azion docs for how rate limiting works in Firewall, then add it to my application.',
  'Deploy this project to Azion with the CLI and give me the application domain.',
  'Write a GraphQL query for the requests my application served yesterday, by status code.'
]

export const tips = [
  'Claude Code reads CLAUDE.md at the repository root before it answers. Put your workload names and the one thing nobody may redeploy in there.',
  'Ask for a plan before a deploy. Claude Code runs commands for real, and azion deploy is not a dry run.'
]

export const faq = [
  {
    question: 'Does the agent get its own credentials?',
    answer:
      'No. It authenticates as you with your **Personal Token**, so it can do exactly what you can, and you revoke it in Console at any time.'
  },
  {
    question: 'Which plan do I need?',
    answer:
      'Any plan. The MCP server and the CLI are free to use; what the agent creates is billed like anything you create yourself.'
  }
]

export const troubleshooting = [
  {
    question: 'The server shows no tools',
    answer:
      'The token is missing or expired. Run `claude mcp list`, remove the entry and add it again with a new token.'
  },
  {
    question: 'Requests fail with 401',
    answer:
      'Check the header: Claude Code sends `Authorization: Bearer` followed by the token, with no quotes around the token.'
  }
]
