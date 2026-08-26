// The Agent Setup SECTION's own data: the agents it can connect, the axes they differ
// on, and the concepts the index page explains.
//
// It lives beside the pages rather than inside them because it is read by FOUR consumers
// now, not one: the index's card grid and comparison table, every agent page's masthead
// and its closing "Other agents" grid, the rail (docs-nav.js generates one row per agent
// from this list), and the markdown the Copy page control hands to an assistant. A second
// copy of the agent list is the copy that rots — and it would rot invisibly in the two
// consumers nobody looks at, the rail's ordering and the clipboard.
//
// IT IMPORTS NOTHING. `docs-nav.js` reads `AGENTS` from here to build the section's rows,
// and `docs-pages.js` derives every page's trail and reading order from that nav — so a
// dependency of this file on either would close a cycle. Everything here is literal data.

/**
 * The agents, each with the MARK that identifies it and the facts the comparison table
 * ranks it on.
 *
 * `mark` names an `AgentMark` drawing — the vendor's real logo as inline SVG, which is
 * where these have to live (they are other companies' brands; @aziontech/icons ships
 * Azion's own marks and its product glyphs). EVERY ROW CARRIES ITS OWN: the two that used
 * to borrow an icon-library glyph were reading as the wrong brand — Google's `G` is not
 * Gemini's mark, and GitHub's octocat is not Copilot's — so both draw the vendor's
 * published file, gradients and all.
 *
 * `vendor` NAMES THE MAKER ON EVERY CARD, including the two where the title already says
 * it ("Cursor" over `Cursor`, "GitHub" over `GitHub Copilot`). It used to be omitted
 * exactly there, on the theory that a line repeating the title is a line to skip — and
 * the grid it produced was worse than the repetition: five cards opened on a small muted
 * maker and two opened on the title, so the titles in one row did not sit on one
 * baseline and the two odd cards read as a different KIND of card rather than as the same
 * card with less to say. The maker is also what a reader picking a tool scans first, so
 * it is a column of the grid, not a footnote on five of seven.
 *
 * `workflows` is what the tool IS, and it is both the axis the picker filters on and the
 * ✓ columns of the comparison table. It is a LIST because the honest answer for some
 * tools is two: Copilot is an editor extension that is also an IDE experience, and a
 * reader filtering for either should find it. The first entry is the primary shape.
 *
 * `pricing` / `model` / `context` / `openSource` are the comparison table's remaining
 * columns, in that table's own vocabulary (see COMPARE_LEGEND) so a reader who learns the
 * words once can read every row.
 */
export const AGENTS = [
  {
    slug: 'claude-code',
    name: 'Claude Code',
    vendor: 'Anthropic',
    mark: 'claude',
    workflows: ['Terminal'],
    pricing: 'Subscription',
    model: 'Locked',
    context: 'Project memory',
    openSource: false,
    description:
      'Terminal agent that reads your codebase, runs commands, and edits files. One CLI command connects the Azion MCP server.'
  },
  {
    slug: 'cursor',
    name: 'Cursor',
    vendor: 'Cursor',
    mark: 'cursor',
    workflows: ['IDE'],
    pricing: 'Subscription',
    model: 'Multi-provider',
    context: 'Indexed codebase',
    openSource: false,
    description:
      'AI-first IDE built on VS Code, with multi-file Composer edits and background agents. Azion plugs into its MCP settings.'
  },
  {
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    vendor: 'GitHub',
    mark: 'copilot',
    workflows: ['Extension', 'IDE'],
    pricing: 'Subscription',
    model: 'Multi-provider',
    context: 'Indexed codebase',
    openSource: false,
    description:
      'Agent mode inside VS Code, with workspace context and native pull-request integration. A file in the project connects Azion.'
  },
  {
    slug: 'windsurf',
    name: 'Windsurf',
    vendor: 'Cognition',
    mark: 'windsurf',
    workflows: ['IDE'],
    pricing: 'Subscription',
    model: 'Multi-provider',
    context: 'Indexed codebase',
    openSource: false,
    description:
      'Agentic IDE built around Cascade for multi-step tasks. Connects to Azion through mcp-remote.'
  },
  {
    slug: 'codex',
    name: 'Codex',
    vendor: 'OpenAI',
    mark: 'codex',
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
    mark: 'gemini',
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
    mark: 'opencode',
    workflows: ['Terminal'],
    pricing: 'BYOK',
    model: 'Multi-provider',
    context: 'Project memory',
    openSource: true,
    description:
      'Open source, provider-agnostic terminal agent. Azion is one entry in its MCP block, whichever model you point it at.'
  }
]

/** The section's in-app route for an agent — one place, so the rail and the cards agree. */
export const agentHref = (agent) => `/site/docs/agent-setup/${agent.slug}`

/** One agent by slug, or `undefined` when the route names a tool that does not exist. */
export const agentBySlug = (slug) => AGENTS.find((agent) => agent.slug === slug)

/** Every agent except one — the closing grid of an agent's own page. */
export const otherAgents = (slug) => AGENTS.filter((agent) => agent.slug !== slug)

/**
 * The facts an agent page's masthead states as tags — the same vocabulary the comparison
 * table uses, in the same order the table's columns run.
 *
 * A masthead that only tagged the workflow would carry one pill for five of the seven
 * tools, which reads as a label nobody finished. These four axes are what a reader is
 * choosing on, and stating them at the top means the page answers "is this my tool?"
 * before the reader scrolls into the setup they may not want.
 *
 * @param {object} agent - the row from `AGENTS`.
 * @returns {string[]} the tag labels, in reading order.
 */
export const agentFacts = (agent) => [
  ...agent.workflows,
  agent.pricing,
  agent.model,
  agent.context,
  ...(agent.openSource ? ['Open source'] : [])
]

/**
 * The picker's filters, in order. `All` first because most readers are browsing rather
 * than filtering; the rest are the `workflows` values above and nothing else — a filter
 * with nothing behind it is a dead end the reader has to discover by tapping it.
 */
export const AGENT_FILTERS = ['All', 'Terminal', 'IDE', 'Extension']

/** The agents a filter tab shows. `All` is not a workflow — it is the absence of one. */
export const agentsByFilter = (filter) =>
  filter === 'All' ? AGENTS : AGENTS.filter((agent) => agent.workflows.includes(filter))

/**
 * The comparison table's columns, in the shape the webkit `Table` reads.
 *
 * The three workflow columns are BOOLEAN and render as a check or a dash through the
 * page's `cell-*` slots, because a ✓ column the eye can skim is the whole reason to put
 * this on a table rather than in the cards. `Agent` is frozen to the start edge: eight
 * columns do not fit the reading measure, and a horizontal scroll that carries the row's
 * own name away leaves the reader scrolling nameless numbers.
 *
 * Every column declares a `minWidth` floor rather than a fixed `width`, so the table
 * measures up from it — a column reserves nothing it is not using, and a longer value in
 * a later row cannot clip.
 */
export const COMPARE_COLUMNS = [
  { id: 'agent', accessorKey: 'agent', header: 'Agent', frozen: 'start', width: 168 },
  { id: 'terminal', accessorKey: 'terminal', header: 'Terminal', align: 'center', minWidth: 80 },
  { id: 'ide', accessorKey: 'ide', header: 'IDE', align: 'center', minWidth: 64 },
  { id: 'extension', accessorKey: 'extension', header: 'Extension', align: 'center', minWidth: 96 },
  {
    id: 'openSource',
    accessorKey: 'openSource',
    header: 'Open source',
    align: 'center',
    minWidth: 112
  },
  { id: 'pricing', accessorKey: 'pricing', header: 'Pricing', minWidth: 128 },
  { id: 'model', accessorKey: 'model', header: 'Model', minWidth: 148 },
  { id: 'context', accessorKey: 'context', header: 'Context', minWidth: 164 }
]

/** The four yes/no columns — one cell shape, declared once (see the page's `cell-*` slots). */
export const COMPARE_FLAGS = ['terminal', 'ide', 'extension', 'openSource']

/**
 * The one severity every comparison tag takes.
 *
 * THE TAG SAYS "THIS IS A VALUE FROM A SET", AND NOTHING ELSE. Colouring by value was
 * tried and reverted: mapping `BYOK` / `Hybrid` / `Subscription` onto three severities
 * puts a solid fill on one row and a tint on another, so the table starts recommending —
 * and a colour that means "different" is indistinguishable, at a glance, from a colour
 * that means "better". Uniform `secondary` keeps the chip doing the one job it is here
 * for: separating a vocabulary word from the prose in the cell beside it.
 */
export const COMPARE_TAG_SEVERITY = 'secondary'

/**
 * The comparison rows, PROJECTED FROM `AGENTS` — never typed a second time. A table that
 * ranks the same seven tools the grid offers has to be the same seven tools, in the same
 * order, saying the same things about each.
 */
export const COMPARE_ROWS = AGENTS.map((agent) => ({
  id: agent.slug,
  agent: agent.name,
  mark: agent.mark,
  href: agentHref(agent),
  terminal: agent.workflows.includes('Terminal'),
  ide: agent.workflows.includes('IDE'),
  extension: agent.workflows.includes('Extension'),
  openSource: agent.openSource,
  pricing: agent.pricing,
  model: agent.model,
  context: agent.context
}))

/**
 * What each workflow means — the four shapes an agent comes in, which is the first thing
 * a reader is choosing between and the axis the picker filters on.
 */
export const WORKFLOW_TYPES = [
  {
    title: 'Terminal',
    icon: 'pi pi-desktop',
    description: 'Runs in a shell. Best for automation, scripting, and CI pipelines.'
  },
  {
    title: 'IDE',
    icon: 'pi pi-code',
    description: 'A full editor with the agent first-class: visual diffs and multi-file edits.'
  },
  {
    title: 'Extension',
    icon: 'pi pi-th-large',
    description: 'Plugs into the editor you already use. Lightest install, keeps your setup.'
  },
  {
    title: 'Cloud',
    icon: 'pi pi-cloud',
    description:
      'Hosted, with no local install. Ideal for asynchronous, long-running work — and the shape the AI Assistant in the Console takes.'
  }
]

/**
 * The vocabulary the rest of the page uses. Four terms, each defined once: the reader
 * meets them in the comparison table's columns and needs them to read a row.
 */
export const KEY_CONCEPTS = [
  {
    title: 'MCP',
    icon: 'pi pi-server',
    description:
      'The Model Context Protocol — the standard that lets an agent call external tools. Azion ships one MCP server, at mcp.azion.com, and every agent on this page speaks it.'
  },
  {
    title: 'Agent context',
    icon: 'pi pi-file',
    description:
      'The files an agent reads before it answers: llms.txt for the documentation index, AGENTS.md for your project’s own conventions.'
  },
  {
    title: 'Model flexibility',
    icon: 'pi pi-sliders-h',
    description:
      'Locked ties you to the maker’s own models. BYOK takes your provider key. Multi-provider switches between several.'
  },
  {
    title: 'Context',
    icon: 'pi pi-database',
    description:
      'Session forgets at the end of a conversation. Project memory persists in a file you commit. Indexed codebase keeps a searchable index of the whole repository.'
  }
]

/**
 * The four decisions that have no right answer — stated as the tradeoff rather than as a
 * recommendation, because which side is correct is a fact about the reader's team.
 */
export const TRADEOFFS = [
  {
    title: 'Cloud vs. local',
    icon: 'pi pi-cloud-upload',
    description:
      'Cloud runs long tasks without holding your machine, and sends your code somewhere. Local keeps everything on disk, and stops when your laptop does.'
  },
  {
    title: 'Proprietary vs. open source',
    icon: 'pi pi-github',
    description:
      'Open source can be audited, forked and self-hosted. Proprietary tends to ship the newest capability first.'
  },
  {
    title: 'Locked model vs. BYOK',
    icon: 'pi pi-key',
    description:
      'A locked model is tuned for its own agent and priced as one subscription. BYOK lets you choose the model per task and pay per token.'
  },
  {
    title: 'Session vs. indexed codebase',
    icon: 'pi pi-search',
    description:
      'An index answers questions about code nobody opened, at the cost of a copy of the repository. A session only knows what it was shown.'
  }
]

/** The legend under the comparison table — what a ✓ and the three word-columns mean. */
export const COMPARE_LEGEND =
  'Every agent listed connects to the Azion MCP server. The workflow columns say where the tool runs, not what it can do.'

/**
 * The index page's headings, in document order, in the shape `DocOnThisPage` reads
 * (`{ id, text, depth }`) so the rail needs no adapter. The three sections a reader moves
 * between are `depth: 2`; the last one's three parts are `depth: 3`, which is the rail's
 * one indent — an outline that flattens them would claim the page has six sections.
 */
export const AGENT_SETUP_TOC = [
  { id: 'pick-your-agent', text: 'Pick your agent', depth: 2 },
  { id: 'compare-agents', text: 'Compare agents', depth: 2 },
  { id: 'understanding-agents', text: 'Understanding agents', depth: 2 },
  { id: 'workflow', text: 'Workflow', depth: 3 },
  { id: 'key-concepts', text: 'Key concepts', depth: 3 },
  { id: 'common-tradeoffs', text: 'Common tradeoffs', depth: 3 }
]

/** The index page's deck — its own one-sentence claim, and the markdown's lead. */
export const AGENT_SETUP_DESCRIPTION =
  'Azion ships an MCP server, agent-ready documentation, and a CLI, so your coding agent can build on the platform from your editor or terminal.'

/**
 * The index page as markdown, for the page bar's Copy page control and its "open in
 * assistant" actions.
 *
 * A hand-composed page has no `.mdx` to hand over, so the markdown is built from the SAME
 * data the page renders — the agents, their comparison, the concepts — rather than typed
 * out a second time. A second copy is the one that rots, and it rots invisibly: nobody
 * reads the clipboard.
 *
 * @returns {string} the page, as markdown.
 */
export function agentSetupMarkdown() {
  const agents = AGENTS.map(
    (agent) =>
      `- **${agent.vendor} ${agent.name}** (${agent.workflows.join(', ')}) — ${agent.description} ` +
      `Setup: https://www.azion.com/en/documentation/agent-setup/${agent.slug}/`
  ).join('\n')

  const header = [
    'Agent',
    'Terminal',
    'IDE',
    'Extension',
    'Open source',
    'Pricing',
    'Model',
    'Context'
  ]
  const rows = COMPARE_ROWS.map((row) =>
    [
      row.agent,
      ...COMPARE_FLAGS.map((flag) => (row[flag] ? 'yes' : 'no')),
      row.pricing,
      row.model,
      row.context
    ].join(' | ')
  )

  const definitions = (items) =>
    items.map((item) => `- **${item.title}** — ${item.description}`).join('\n')

  return [
    '# Agent Setup',
    '',
    AGENT_SETUP_DESCRIPTION,
    '',
    '## Pick your agent',
    '',
    'Select an agent to get step-by-step setup instructions.',
    '',
    agents,
    '',
    '## Compare agents',
    '',
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row} |`),
    '',
    COMPARE_LEGEND,
    '',
    '## Understanding agents',
    '',
    'Common types, concepts, and tradeoffs.',
    '',
    '### Workflow',
    '',
    definitions(WORKFLOW_TYPES),
    '',
    '### Key concepts',
    '',
    definitions(KEY_CONCEPTS),
    '',
    '### Common tradeoffs',
    '',
    definitions(TRADEOFFS),
    ''
  ].join('\n')
}
