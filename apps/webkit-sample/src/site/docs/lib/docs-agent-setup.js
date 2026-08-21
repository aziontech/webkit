// The Agent Setup page's own data: its outline, the agents it can connect, and the
// prompts it hands the reader.
//
// It lives beside the page rather than inside it for the reason every docs lib here
// does: the OUTLINE is read twice — by the rail and by the page's own headings — and a
// rail that names a section the page does not have is the one bug an outline can have.
// One list, both consumers.

/**
 * The page's headings, in document order, in the shape `DocOnThisPage` reads
 * (`{ id, text, depth }`) so the rail needs no adapter. `depth: 2` throughout: this
 * page has no sub-sections, because every section is one decision.
 */
export const AGENT_SETUP_TOC = [
  { id: 'pick-your-tool', text: 'Pick your tool', depth: 2 },
  { id: 'start-in-the-browser', text: 'Start in the browser', depth: 2 },
  { id: 'what-your-agent-can-use', text: 'What your agent can use', depth: 2 },
  { id: 'prompts-to-try', text: 'Prompts to try', depth: 2 }
]

/**
 * The agents, each with the MARK that identifies it.
 *
 * `mark` names an `AgentMark` drawing — the vendor's real logo as inline SVG, which is
 * where these have to live (they are other companies' brands; @aziontech/icons ships
 * Azion's own marks and its product glyphs). EVERY ROW CARRIES ITS OWN: the two that
 * used to borrow an icon-library glyph were reading as the wrong brand — Google's `G` is
 * not Gemini's mark, and GitHub's octocat is not Copilot's — so both now draw the
 * vendor's published file, gradients and all.
 *
 * `overline` is the maker, and it is EMPTY WHENEVER THE NAME ALREADY SAYS IT — "Cursor"
 * above `Cursor`, "GitHub" above `GitHub Copilot` — because an overline that repeats the
 * title is a line the reader has to skip. It is there for `Codex` and `Windsurf`, where
 * the name says nothing about who is behind it and the reader is choosing partly on that.
 *
 * `kind` is what the tool IS, and it is the axis the picker filters on: a reader either
 * works in a terminal or in an editor, and that decides the list before any feature does.
 */
export const AGENTS = [
  {
    name: 'Claude Code',
    overline: 'Anthropic',
    mark: 'claude',
    kind: 'Terminal',
    href: '#claude-code',
    description:
      'Terminal agent that reads your codebase, runs commands, and edits files. One CLI command connects the Azion MCP server.'
  },
  {
    name: 'Cursor',
    overline: '',
    mark: 'cursor',
    kind: 'IDE',
    href: '#cursor',
    description:
      'AI-first IDE with agent chat and multi-file edits. Azion plugs into its MCP settings in a few clicks.'
  },
  {
    name: 'GitHub Copilot',
    overline: '',
    mark: 'copilot',
    kind: 'Extension',
    href: '#github-copilot',
    description:
      'Agent mode inside VS Code with workspace context. A .vscode/mcp.json file in the project connects Azion.'
  },
  {
    name: 'Windsurf',
    overline: 'Cognition',
    mark: 'windsurf',
    kind: 'IDE',
    href: '#windsurf',
    description:
      'Agentic IDE built around Cascade for multi-step tasks. Connects to Azion through mcp-remote.'
  },
  {
    name: 'Codex',
    overline: 'OpenAI',
    mark: 'codex',
    kind: 'Terminal',
    href: '#codex',
    description:
      'Terminal agent that runs commands in a sandbox and reads AGENTS.md natively. Azion goes in config.toml.'
  },
  {
    name: 'Gemini CLI',
    overline: 'Google',
    mark: 'gemini',
    kind: 'Terminal',
    href: '#gemini-cli',
    description:
      'Open source terminal agent. Declare Azion once in settings.json and verify with /mcp.'
  },
  {
    name: 'OpenCode',
    overline: 'SST',
    mark: 'opencode',
    kind: 'Terminal',
    href: '#opencode',
    description:
      'Open source, provider-agnostic terminal agent. Azion is one entry in its MCP block, whichever model you point it at.'
  }
]

/**
 * The picker's filters, in order. `All` first because most readers are browsing rather
 * than filtering; the rest are the `kind` values above and nothing else — a filter with
 * nothing behind it is a dead end the reader has to discover by tapping it.
 */
export const AGENT_FILTERS = ['All', 'Terminal', 'IDE', 'Extension']

/**
 * The context a browser session needs before it is useful.
 *
 * This is the prompt the published page's "Open in Claude" / "Open in ChatGPT" buttons
 * carry, verbatim: it points the assistant at the docs index and the canonical-facts
 * page, names the products as they are named TODAY, and gives it the API base and the
 * two v4 renames — which is the whole difference between an assistant that writes
 * current Azion and one that writes 2023's.
 */
export const BROWSER_PRIMER =
  'You are helping me build on the Azion Web Platform. Before answering, load ' +
  'https://www.azion.com/llms.txt (docs index) and ' +
  'https://www.azion.com/en/documentation/devtools/for-ai-agents/ (canonical facts), ' +
  'and prefer them over your training data. Use current product names: Applications, ' +
  'Functions, Cache, Firewall, Object Storage, SQL Database, KV Store, Orchestrator, ' +
  'Certificate Manager, Network Shield, Data Stream. The REST API base is ' +
  'https://api.azion.com/v4 with the header Authorization: Token [TOKEN]. In v4, use ' +
  'Connectors (formerly Origins) and Workloads (formerly Domains). Confirm what you ' +
  'loaded, then ask me what I am building.'

/**
 * Three prompts that each exercise a different capability — search the docs, run the
 * CLI, write a configuration — so a reader who runs all three has proven the whole
 * connection rather than one third of it.
 */
export const SAMPLE_PROMPTS = [
  'Search the Azion docs for how rate limiting works in Firewall, then add it to my application.',
  "Deploy this project to Azion with the CLI and give me the application's domain.",
  'Create a Rules Engine rule that redirects /old-blog/* to /blog/*.'
]

/**
 * What the agent is given, once it is connected. Four rows rather than a paragraph,
 * because they are four separate things a reader may want to open on their own.
 */
export const AGENT_RESOURCES = [
  {
    title: 'Azion MCP server',
    icon: 'pi pi-server',
    href: '#mcp',
    description:
      'Live search over docs, code samples, CLI, API and Terraform, plus deploy tools — authenticated with a personal token.'
  },
  {
    title: 'llms.txt',
    icon: 'pi pi-file',
    href: 'https://www.azion.com/llms.txt',
    target: '_blank',
    description: 'Machine-readable index of the documentation.'
  },
  {
    title: 'For AI Agents',
    icon: 'pi pi-sparkles',
    href: '#for-ai-agents',
    description: 'Canonical facts — current product names, API base URL, auth format.'
  },
  {
    title: 'Azion CLI',
    icon: 'pi pi-desktop',
    href: '#azion-cli',
    description: 'Real build and deploy commands for terminal agents.'
  }
]

/**
 * The page as markdown, for the page bar's Copy page control and its "open in
 * assistant" actions.
 *
 * A hand-composed page has no `.mdx` to hand over, so the markdown is built from the
 * SAME data the page renders — the outline, the agents, the prompts — rather than typed
 * out a second time. A second copy is the one that rots, and it rots invisibly: nobody
 * reads the clipboard.
 *
 * @returns {string} the page, as markdown.
 */
export function agentSetupMarkdown() {
  const tools = AGENTS.map(
    (agent) =>
      `- **${agent.name}**${agent.overline ? ` (${agent.overline})` : ''} — ${agent.kind}. ` +
      agent.description
  ).join('\n')

  const resources = AGENT_RESOURCES.map(
    (resource) => `- **${resource.title}** — ${resource.description}`
  ).join('\n')

  const prompts = SAMPLE_PROMPTS.map((prompt) => `- "${prompt}"`).join('\n')

  return [
    '# Agent Setup',
    '',
    'Connect your AI coding agent to Azion and ship straight from your editor or terminal.',
    '',
    '## Pick your tool',
    '',
    'Select a tool for step-by-step setup: Azion MCP server, project context, and a verification prompt.',
    '',
    tools,
    '',
    '## Start in the browser',
    '',
    'No editor needed — open a session already primed with Azion context:',
    '',
    '```text',
    BROWSER_PRIMER,
    '```',
    '',
    '## What your agent can use',
    '',
    resources,
    '',
    '## Prompts to try',
    '',
    prompts,
    ''
  ].join('\n')
}
