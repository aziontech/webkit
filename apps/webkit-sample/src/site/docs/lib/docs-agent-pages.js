// One agent's SETUP page: the four steps that connect it, what it reaches once connected,
// the prompts to prove it, and the answers to the two questions everybody asks next.
//
// Split from docs-agent-setup.js on purpose. That file is the SECTION's data — who the
// agents are, and how they differ — and it is read by the rail, the index and every agent
// page. This file is the per-agent CONTENT, read by exactly one page, and it is the half
// that grows: each new tool brings an install line, a config file, a verification command
// and its own two gotchas.
//
// WHAT IS SHARED IS WRITTEN ONCE AND PROJECTED. The MCP server, the token, the tools it
// exposes, the documentation an agent can read, the example prompts and most of the FAQ
// are facts about AZION, identical on all seven pages — so they live here as one value and
// the page interpolates the tool's name into them. Only what is genuinely per-agent (the
// install line, the config snippet, the verification command, the tips) is written seven
// times, because there is no way to say those once.

/** The one MCP endpoint. Every client on every page points at this URL. */
export const MCP_SERVER_URL = 'https://mcp.azion.com'

/** Where the reader creates the credential every client needs. */
export const PERSONAL_TOKEN_URL = 'https://console.azion.com/personal-tokens'

/**
 * The nine tools the Azion MCP server exposes, as the reader will see them named in their
 * agent's tool picker. Six are searches over a corpus (docs, samples, CLI, two API
 * versions, Terraform) and three DO something — which is the distinction that decides
 * whether a reader needs a Personal Token with write scope.
 */
export const MCP_TOOLS = [
  {
    id: 'search_azion_docs_and_site',
    title: 'search_azion_docs_and_site',
    description: 'Search the documentation and the product pages.'
  },
  {
    id: 'search_azion_code_samples',
    title: 'search_azion_code_samples',
    description: 'Retrieve working examples from the code-samples library.'
  },
  {
    id: 'search_azion_cli_commands',
    title: 'search_azion_cli_commands',
    description: 'Look up an Azion CLI command and its flags.'
  },
  {
    id: 'search_azion_api_v4_commands',
    title: 'search_azion_api_v4_commands',
    description: 'The current REST API — Connectors, Workloads, Applications.'
  },
  {
    id: 'search_azion_api_v3_commands',
    title: 'search_azion_api_v3_commands',
    description: 'The legacy API, for accounts still on v3 resources.'
  },
  {
    id: 'search_azion_terraform',
    title: 'search_azion_terraform',
    description: 'The Terraform provider’s resources and arguments.'
  },
  {
    id: 'create_rules_engine',
    title: 'create_rules_engine',
    description: 'Generate a Rules Engine configuration from a description.'
  },
  {
    id: 'create_graphql_query',
    title: 'create_graphql_query',
    description: 'Build a GraphQL query against the analytics API.'
  },
  {
    id: 'deploy_azion_static_site',
    title: 'deploy_azion_static_site',
    description: 'Walk a static project through to a deployed application.'
  }
]

/**
 * The tool table's columns.
 *
 * A TABLE, not a list of rows, because the tool NAME is the thing a reader takes away —
 * they will type it into a prompt ("use search_azion_api_v4_commands for this") — and a
 * name sitting against its own one-line description is a scan down one column.
 *
 * NOTHING IS FROZEN, and the whole row scrolls together. A pinned first column keeps the
 * name in view while the description slides under it, which is worth having on a laptop
 * and unaffordable on a phone: at 300px it took all but 56px of a 356px viewport, so
 * every description arrived through a slot. Scrolling the table as one piece costs the
 * name its permanence and gives the reader a whole row at a time.
 *
 * `minWidth`, not `width`: the DS measures the header and every rendered cell and
 * resolves ONE width from the larger — so the column lands on the widest tool name with
 * no dead space, and re-measures if a name changes. The old 300 was a fixed bet sized
 * around a copy control that is no longer there. It has to be one key or the other:
 * with neither, each row is its own flex container and the header drifts off the body.
 */
export const MCP_TOOL_COLUMNS = [
  { id: 'title', accessorKey: 'title', header: 'Tool', minWidth: 80 },
  { id: 'description', accessorKey: 'description', header: 'What it does', grow: 2 }
]

/**
 * The documentation an agent can read on its own, without a tool call. This is the escape
 * hatch for a tool with no MCP support and the correction for a model that learned Azion
 * in 2023 — `llms.txt` is the index, and For AI Agents is the canonical-facts page that
 * names the products as they are named today.
 */
export const AGENT_DOC_LINKS = [
  {
    title: 'llms.txt',
    icon: 'pi pi-list',
    href: 'https://www.azion.com/llms.txt',
    target: '_blank',
    description: 'Machine-readable index of the whole documentation.'
  },
  {
    title: 'For AI Agents',
    icon: 'pi pi-sparkles',
    href: 'https://www.azion.com/en/documentation/devtools/for-ai-agents/',
    target: '_blank',
    description: 'Canonical facts: current product names, API base URL, auth format.'
  },
  {
    title: 'API v4 reference',
    icon: 'pi pi-cloud',
    href: 'https://api.azion.com/v4',
    target: '_blank',
    description: 'The REST surface behind every tool call, with the Token auth header.'
  },
  {
    title: 'AGENTS.md',
    icon: 'pi pi-file-edit',
    href: '/site/docs/first-deploy',
    description:
      'Your own conventions, committed at the repository root: workload names, connector ids, what not to touch.'
  }
]

/**
 * The context a browser session needs before it is useful — the prompt to paste into an
 * assistant with no MCP support at all.
 *
 * It points at the docs index and the canonical-facts page, names the products as they are
 * named TODAY, and gives the API base plus the two v4 renames — which is the whole
 * difference between an assistant that writes current Azion and one that writes 2023's.
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
 * Five prompts, each exercising a different half of the connection — the documentation
 * search, the CLI, the configuration it writes, the analytics API, the deploy — so a
 * reader who runs them has proven the whole thing rather than one fifth of it.
 */
export const SAMPLE_PROMPTS = [
  'Search the Azion docs for how rate limiting works in Firewall, then add it to my application.',
  'Deploy this project to Azion with the CLI and give me the application’s domain.',
  'Create a Rules Engine rule that redirects /old-blog/* to /blog/*.',
  'Write a GraphQL query for my 5xx rate by edge node over the last 24 hours.',
  'Move my images to Object Storage and point a connector at the bucket.'
]

/** The Azion CLI — the same two commands on every page, so they are written once. */
export const CLI_SAMPLES = [
  {
    label: 'Install',
    language: 'bash',
    code: 'npm install -g azion\nazion login'
  },
  {
    label: 'Deploy',
    language: 'bash',
    code: '# From the project root — the agent runs these for you\nazion init\nazion deploy'
  }
]

/**
 * PER-AGENT, keyed by the slug in `AGENTS`.
 *
 * `install` and `connect` are the two things only this tool can say: where the binary
 * comes from, and which file (or which command) declares an MCP server. `verify` is the
 * one command that proves it worked — the step every reader skips and then needs.
 *
 * `note` is a real difference from the other six, not a restatement of the snippet: Cursor
 * wants `Token` where everyone else wants `Bearer`, Windsurf shells out through
 * `mcp-remote`. A note that only repeats the code above it trains the reader to skip
 * notes.
 */
const SETUPS = {
  'claude-code': {
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code',
    contextFile: 'CLAUDE.md',
    install: {
      body: 'Install the CLI globally, then run it once from your project so it can index the repository.',
      samples: [
        { label: 'npm', language: 'bash', code: 'npm install -g @anthropic-ai/claude-code' }
      ]
    },
    connect: {
      body: 'One command registers the server for every session. Claude Code stores it in your user configuration, so it is not a file you commit.',
      samples: [
        {
          label: 'Terminal',
          language: 'bash',
          code: `claude mcp add "azion-mcp" "${MCP_SERVER_URL}" -t http -H "Authorization: Bearer YOUR_PERSONAL_TOKEN"`
        }
      ]
    },
    verify: {
      body: '`claude mcp list` names the servers it knows about; `/mcp` inside a session lists the tools each one exposes.',
      samples: [{ label: 'Terminal', language: 'bash', code: 'claude mcp list' }]
    },
    tips: [
      'Claude Code reads `CLAUDE.md` at the repository root before it answers. Put your workload names, connector ids and the one thing nobody may redeploy in there, and every session starts knowing them.',
      'Ask for a plan before a deploy. Claude Code runs commands for real, and `azion deploy` is not a dry run.'
    ]
  },

  cursor: {
    docsUrl: 'https://docs.cursor.com',
    contextFile: '.cursor/rules/azion.mdc',
    install: {
      body: 'Download Cursor for macOS, Windows or Linux, then open your project folder in it.',
      link: { label: 'Cursor downloads', href: 'https://cursor.com/downloads' }
    },
    connect: {
      body: 'Add the server under **Settings › Tools & Integrations › New MCP server**, or commit the file below so the whole team gets it with the repository.',
      samples: [
        {
          label: 'JSON',
          language: 'json',
          fileName: '.cursor/mcp.json',
          code: `{
  "mcpServers": {
    "azion": {
      "type": "streamable-http",
      "url": "${MCP_SERVER_URL}",
      "headers": {
        "Authorization": "Token YOUR_PERSONAL_TOKEN"
      }
    }
  }
}`
        }
      ],
      note: 'Cursor is the one client that wants `Token` in the Authorization header, not `Bearer`. A `Bearer` prefix here fails with a 401 and no other symptom.'
    },
    verify: {
      body: 'Reopen **Settings › Tools & Integrations**: `azion` should list nine tools. If the row is there but empty, the token is wrong.'
    },
    tips: [
      'Reference the file you want changed with `@azion.config.js` in a Composer prompt. Cursor edits the real configuration instead of describing one.',
      'Cursor indexes the repository, so it already knows your framework. Ask for the deploy, not for a tutorial about it.'
    ]
  },

  'github-copilot': {
    docsUrl: 'https://docs.github.com/copilot',
    contextFile: '.github/copilot-instructions.md',
    install: {
      body: 'Install the GitHub Copilot extension in VS Code, then switch the Chat view to **Agent** mode — tool calls only happen in agent mode.',
      link: {
        label: 'GitHub Copilot in VS Code',
        href: 'https://marketplace.visualstudio.com/items?itemName=GitHub.copilot'
      }
    },
    connect: {
      body: 'Declare the server in the project. The file lives in the repository, so every contributor with a token gets the same tools.',
      samples: [
        {
          label: 'JSON',
          language: 'json',
          fileName: '.vscode/mcp.json',
          code: `{
  "mcpServers": {
    "azion": {
      "type": "http",
      "url": "${MCP_SERVER_URL}",
      "headers": {
        "Authorization": "Bearer YOUR_PERSONAL_TOKEN"
      }
    }
  }
}`
        }
      ],
      note: 'Commit the file, never the token. VS Code resolves `${input:azion-token}` by prompting once per window, which keeps the credential out of git history.'
    },
    verify: {
      body: 'Open the tools picker in the Chat view: `azion` appears with its nine tools once VS Code has started the server.'
    },
    tips: [
      'Agent mode is what calls tools. In Ask mode Copilot will happily describe the Azion API from memory and never touch the MCP server.',
      'Copilot reads the open editors first. Open `azion.config.js` before asking about your build, and it stops guessing at your framework.'
    ]
  },

  windsurf: {
    docsUrl: 'https://docs.windsurf.com',
    contextFile: '.windsurfrules',
    install: {
      body: 'Download Windsurf, open your project, and start a Cascade conversation.',
      link: { label: 'Windsurf downloads', href: 'https://windsurf.com/download' }
    },
    connect: {
      body: 'Windsurf speaks stdio, so it reaches an HTTP server through `mcp-remote`. Node.js 18 or newer has to be on your PATH.',
      samples: [
        {
          label: 'JSON',
          language: 'json',
          fileName: '.codeium/windsurf/mcp_config.json',
          code: `{
  "mcpServers": {
    "azion": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "${MCP_SERVER_URL}",
        "--header",
        "Authorization: Bearer YOUR_PERSONAL_TOKEN"
      ]
    }
  }
}`
        }
      ],
      note: '`mcp-remote` is a bridge, not an Azion package: it turns the stdio transport Windsurf speaks into the HTTP one the server speaks. Cascade shows it as a local process.'
    },
    verify: {
      body: 'Open the MCP panel in Cascade and refresh. `azion` should report nine tools; a red row usually means `npx` could not reach the network.'
    },
    tips: [
      'Cascade holds a plan across steps, which suits a migration: ask it to inventory the origins first, then convert them to Connectors one at a time.',
      'A hanging server is almost always `mcp-remote` waiting on a proxy. Run the `npx` line by hand once to see its output.'
    ]
  },

  codex: {
    docsUrl: 'https://developers.openai.com/codex',
    contextFile: 'AGENTS.md',
    install: {
      body: 'Install the CLI globally and sign in with your OpenAI account.',
      samples: [
        { label: 'npm', language: 'bash', code: 'npm install -g @openai/codex\ncodex login' }
      ]
    },
    connect: {
      body: 'Codex reads one TOML configuration for every project. Add the server there and it is available in each sandbox it opens.',
      samples: [
        {
          label: 'TOML',
          language: 'toml',
          fileName: '~/.codex/config.toml',
          code: `[mcp.servers.azion]
type = "http"
url = "${MCP_SERVER_URL}"
auth = "Bearer YOUR_PERSONAL_TOKEN"`
        }
      ]
    },
    verify: {
      body: 'Start a session and ask which tools it has. The nine `azion_*` tools are listed alongside its own shell and file tools.'
    },
    tips: [
      'Codex reads `AGENTS.md` natively — it is the file this convention is named after. Everything you would have pasted into the prompt goes there instead.',
      'The sandbox has no network by default. Allow it before asking for a deploy, or `azion deploy` fails on the first API call.'
    ]
  },

  'gemini-cli': {
    docsUrl: 'https://github.com/google-gemini/gemini-cli',
    contextFile: 'GEMINI.md',
    install: {
      body: 'Install the CLI globally, then run `gemini` once to authenticate with your Google account.',
      samples: [{ label: 'npm', language: 'bash', code: 'npm install -g @google/gemini-cli' }]
    },
    connect: {
      body: 'Declare the server in the user settings file. `httpUrl` is what tells Gemini CLI to speak HTTP rather than to spawn a process.',
      samples: [
        {
          label: 'JSON',
          language: 'json',
          fileName: '~/.gemini/settings.json',
          code: `{
  "mcpServers": {
    "azion": {
      "httpUrl": "${MCP_SERVER_URL}",
      "headers": {
        "Authorization": "Bearer YOUR_PERSONAL_TOKEN"
      }
    }
  }
}`
        }
      ]
    },
    verify: {
      body: 'Type `/mcp` in a session. It prints every server with its status and the tools it exposes.',
      samples: [{ label: 'Session', language: 'bash', code: '/mcp' }]
    },
    tips: [
      '`GEMINI.md` at the repository root is this agent’s project memory. It is read on every run, so it is the cheapest place to put your account’s conventions.',
      'The free tier is rate-limited per minute. A long migration goes faster in fewer, larger prompts.'
    ]
  },

  opencode: {
    docsUrl: 'https://opencode.ai/docs',
    contextFile: 'AGENTS.md',
    install: {
      body: 'Install the TUI globally, then point it at whichever model provider you already pay for.',
      samples: [{ label: 'npm', language: 'bash', code: 'npm install -g opencode-ai' }]
    },
    connect: {
      body: 'OpenCode keeps MCP servers in the project’s own configuration file, next to the model choice.',
      samples: [
        {
          label: 'JSON',
          language: 'json',
          fileName: 'opencode.json',
          code: `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "azion": {
      "type": "remote",
      "url": "${MCP_SERVER_URL}",
      "headers": {
        "Authorization": "Bearer YOUR_PERSONAL_TOKEN"
      }
    }
  }
}`
        }
      ],
      note: 'The server is `"type": "remote"` — OpenCode’s word for an HTTP endpoint. `"local"` is for a command it spawns itself, and it will try to execute the URL.'
    },
    verify: {
      body: 'Run `/mcp` in the TUI. Each server prints its connection state and tool count.',
      samples: [{ label: 'Session', language: 'bash', code: '/mcp' }]
    },
    tips: [
      'The model is yours to choose, and they are not equally good at this. A weaker model connected to the MCP server still writes better Azion than a strong one guessing from memory.',
      'OpenCode reads `AGENTS.md`, so a project set up for Codex needs no second context file.'
    ]
  }
}

/**
 * The masthead's link row: the three Azion references this page rests on, then the tool's
 * OWN documentation.
 *
 * They sit at the top rather than at the bottom because they are what a reader who is not
 * ready to follow four steps came for — the server, the CLI, the client's own docs — and
 * every one of them leaves the documentation, so each carries the external arrow.
 *
 * @param {object} agent - the row from `AGENTS`.
 * @returns {{label: string, href: string}[]} the links, in reading order.
 */
export const agentHeaderLinks = (agent) => [
  { label: 'Azion MCP server', href: 'https://www.azion.com/en/documentation/devtools/mcp/' },
  {
    label: 'MCP configuration',
    href: 'https://www.azion.com/en/documentation/devtools/mcp/configuration/'
  },
  { label: 'Azion CLI', href: 'https://www.azion.com/en/documentation/devtools/cli/' },
  ...(SETUPS[agent.slug]?.docsUrl
    ? [{ label: `${agent.name} docs`, href: SETUPS[agent.slug].docsUrl }]
    : [])
]

/**
 * The four steps, for one agent.
 *
 * Steps 2 and 4 are the same on every page — the token is Azion's, and so is the prompt
 * that proves the connection — so they are written here once and the agent's name is
 * interpolated. `DocSteps` numbers them from the document order, so this list IS the
 * numbering.
 *
 * @param {object} agent - the row from `AGENTS`.
 * @returns {object[]} the steps, in order.
 */
/**
 * THE GLOSSARY, and the one place each definition is written.
 *
 * An agent-setup page is where a reader meets four Azion nouns at once — MCP, a Personal
 * Token, Connectors, Workloads — and the copy cannot stop to define them without becoming
 * a different page. A gloss is the print convention for exactly that: the term reads
 * normally in the sentence, carries a dotted underline, and gives up its definition on
 * hover or focus. `<Tooltip>` is the layer's inline component for it, and every string
 * below reaches it through `DocMarkdown`, so a definition written here renders the same
 * whether it lands in a step, an FAQ answer or a troubleshooting note.
 *
 * DEFINED ONCE, GLOSSED MANY TIMES. The term is glossed where a reader first meets it in
 * a given block and left plain afterwards — a page that underlines every occurrence of
 * "Workload" is a page nobody reads. The `cta` is the escape hatch for a reader who wants
 * more than a sentence; a term with nowhere useful to send them carries no link, because
 * a `cta` turns the panel from a passive tooltip into a small dialog and that is only
 * worth its keyboard cost when there is somewhere to go.
 */
const GLOSSARY = {
  mcp: {
    headline: 'MCP',
    tip: 'Model Context Protocol — the open standard an agent uses to call tools it did not ship with. Azion exposes nine of them over one authenticated HTTP endpoint.',
    cta: 'See the nine tools',
    href: '#mcp-server'
  },
  token: {
    headline: 'Personal Token',
    tip: 'Your own API credential, scoped to the permissions you choose and revocable at any time. The agent authenticates as you with it — it never gets one of its own.',
    cta: 'Console › Personal Tokens',
    href: PERSONAL_TOKEN_URL
  },
  cli: {
    headline: 'Azion CLI',
    tip: 'The command-line tool that builds and deploys from your working copy, and covers the product commands the API does not.',
    cta: 'Set up the CLI',
    href: '#azion-cli'
  },
  connector: {
    headline: 'Connectors',
    tip: 'Where an application fetches content from — a bucket, an origin server, a live stream. Called Origins before v4, which is why a model trained earlier still asks for one.',
    cta: 'Platform overview',
    href: '/site/docs/platform-overview'
  },
  workload: {
    headline: 'Workloads',
    tip: 'The public entry point that binds a domain and its TLS to an application. Called Domains before v4.',
    cta: 'Platform overview',
    href: '/site/docs/platform-overview'
  }
}

/**
 * One glossed term, as MDX.
 *
 * @param {keyof typeof GLOSSARY} key - which definition to attach.
 * @param {string} text - the term as it reads in the sentence, so a gloss can be
 *   singular, plural or possessive without a second entry.
 * @returns {string} the `<Tooltip>` tag `DocMarkdown` renders inline.
 */
const gloss = (key, text) => {
  const { headline, tip, cta, href } = GLOSSARY[key]
  const link = href ? ` cta="${cta}" href="${href}"` : ''
  return `<Tooltip headline="${headline}" tip="${tip}"${link}>${text}</Tooltip>`
}

export const agentSteps = (agent) => {
  const setup = SETUPS[agent.slug] ?? {}

  return [
    { key: 'install', title: `Install ${agent.name}`, ...setup.install },
    {
      key: 'token',
      title: 'Create a Personal Token',
      body: `The ${gloss('mcp', 'MCP server')} authenticates as you. Create a ${gloss('token', 'Personal Token')} in the Console, give it only the scopes you want ${agent.name} to have, and copy it — it is shown once.`,
      link: { label: 'Console › Personal Tokens', href: PERSONAL_TOKEN_URL }
    },
    { key: 'connect', title: 'Connect the Azion MCP server', ...setup.connect },
    {
      key: 'verify',
      title: 'Verify, then try a prompt',
      ...setup.verify,
      prompt: SAMPLE_PROMPTS[1]
    }
  ]
}

/** The agent's own tips — the two things that are true of this tool and of no other. */
export const agentTips = (agent) => SETUPS[agent.slug]?.tips ?? []

/**
 * The file THIS agent reads before it answers.
 *
 * Every tool has one and they all have different names — `CLAUDE.md`, `GEMINI.md`,
 * `.windsurfrules`, `AGENTS.md` — which is exactly the fact a reader cannot guess and the
 * reason this is per-agent rather than one sentence about "your context file".
 */
export const agentContextFile = (agent) => SETUPS[agent.slug]?.contextFile ?? 'AGENTS.md'

/**
 * What belongs in that file, as an example.
 *
 * The same five lines whatever the tool is called, because the content is a fact about the
 * READER'S account, not about their agent: which workload is production, which connector
 * points where, and the one thing no agent may do unasked. Every session starts by reading
 * it, so it is the cheapest context in the whole setup.
 */
export const CONTEXT_EXAMPLE = `# Azion
- Account: acme-prod · region: global
- Workload: acme-www — production. Never deploy to it from a branch.
- Connector: images-r2 (Object Storage bucket \`acme-media\`)
- Deploy with \`azion deploy\`; edit azion.config.js, never the built manifest.
- Ask before creating anything that bills: Applications, Workloads, Databases.`

/**
 * The three questions every reader asks after the fourth step, with the tool's name in
 * them. They are about the SHAPE of the integration — which piece does what, what the
 * credential can do, whether it can deploy — so they are the same three questions
 * whichever tool the reader picked, and writing them seven times would only guarantee
 * seven slightly different answers.
 */
export const agentFaq = (agent) => [
  {
    question: 'Should I use the MCP server, the CLI, or both?',
    answer: `Both, and they do different jobs. The ${gloss('mcp', 'MCP server')} is how ${agent.name} looks things up and creates configuration through the API; the ${gloss('cli', 'Azion CLI')} is how it builds and deploys from your working copy. Ask for a deploy and a connected agent will reach for the CLI on its own.`
  },
  {
    question: `What can ${agent.name} do with my Personal Token?`,
    answer: `Exactly what you scoped it for. The ${gloss('token', 'Personal Token')} is yours, not the agent’s — six of the nine tools only read documentation, and the three that write go through the same API a person would. Scope a token per project, and revoke it in the Console the moment the experiment is over.`
  },
  {
    question: `Can ${agent.name} deploy to Azion without leaving ${agent.workflows.includes('Terminal') ? 'the terminal' : 'the editor'}?`,
    answer:
      'Yes. It runs `azion deploy` for you and reads back the application’s domain. First deploy on a new account also needs `azion login`, which is interactive — run that one yourself.'
  }
]

/**
 * What goes wrong, and what it looks like when it does. Two are the same for every client
 * (a server that never connects, a model answering from 2023) because they are properties
 * of the token and of the training data; the third is the tool's own.
 */
export const agentTroubleshooting = (agent) => {
  const setup = SETUPS[agent.slug] ?? {}

  return [
    {
      question: `The server never connects in ${agent.name}`,
      answer: `Check the header before anything else — a wrong prefix or an expired token fails as a silent 401, not as an error in the tool. ${setup.connect?.note ? setup.connect.note : 'Then restart the client: every one of them reads its MCP configuration at startup.'}`
    },
    {
      question: 'It answers with product names that no longer exist',
      answer: `That is the training data, not the connection: Origins became ${gloss('connector', 'Connectors')} and Domains became ${gloss('workload', 'Workloads')} in v4. Point it at the For AI Agents page once per session, or paste the primer above, and it corrects itself.`
    },
    {
      question: 'It writes configuration that the CLI then rejects',
      answer:
        'Ask it to look the resource up first — `search_azion_api_v4_commands` returns the current shape, where the model’s memory returns last year’s. A rejected deploy almost always means it skipped the lookup.'
    }
  ]
}

/**
 * The agent page's headings, in document order, for `DocOnThisPage`.
 *
 * Fixed for every agent, because every agent page IS the same page with a different tool
 * in it — which is the point of a section like this one: the reader who has set up two of
 * them already knows where "Tips" is.
 */
export const AGENT_PAGE_TOC = [
  { id: 'quick-start', text: 'Quick start', depth: 2 },
  { id: 'platform-access', text: 'Azion platform access', depth: 2 },
  { id: 'mcp-server', text: 'MCP server', depth: 3 },
  { id: 'azion-cli', text: 'Azion CLI', depth: 3 },
  { id: 'agent-context', text: 'Agent context', depth: 3 },
  { id: 'agent-friendly-docs', text: 'Agent-friendly docs', depth: 2 },
  { id: 'example-prompts', text: 'Example prompts', depth: 2 },
  { id: 'tips', text: 'Tips', depth: 2 },
  { id: 'faq', text: 'FAQ', depth: 2 },
  { id: 'troubleshooting', text: 'Troubleshooting', depth: 2 },
  { id: 'other-agents', text: 'Other agents', depth: 2 }
]

/**
 * The page as markdown, for the masthead's action belt — built from the same values
 * the page renders, so what an assistant receives is what the reader is looking at.
 *
 * @param {object} agent - the row from `AGENTS`.
 * @returns {string} the page, as markdown.
 */
export function agentPageMarkdown(agent) {
  const fence = (sample) => ['```' + (sample.language ?? 'text'), sample.code, '```'].join('\n')

  const steps = agentSteps(agent).flatMap((step, index) => [
    `### ${index + 1}. ${step.title}`,
    '',
    ...(step.body ? [step.body, ''] : []),
    ...(step.link ? [`${step.link.label}: ${step.link.href}`, ''] : []),
    ...(step.samples ?? []).flatMap((sample) => [
      ...(sample.fileName ? [`\`${sample.fileName}\``, ''] : []),
      fence(sample),
      ''
    ]),
    ...(step.note ? [`> ${step.note}`, ''] : []),
    ...(step.prompt ? [fence({ language: 'text', code: step.prompt }), ''] : [])
  ])

  const list = (items) =>
    items.map((item) => `- **${item.title}** — ${item.description}`).join('\n')

  const qa = (items) =>
    items.flatMap((item) => [`**${item.question}**`, '', item.answer, '']).join('\n')

  return [
    `# ${agent.name} + Azion`,
    '',
    `${agent.description} Made by ${agent.vendor}.`,
    '',
    '## Quick start',
    '',
    ...steps,
    '## Azion platform access',
    '',
    '### MCP server',
    '',
    `${MCP_SERVER_URL} — nine tools:`,
    '',
    list(MCP_TOOLS),
    '',
    '### Azion CLI',
    '',
    ...CLI_SAMPLES.flatMap((sample) => [fence(sample), '']),
    '### Agent context',
    '',
    `${agent.name} reads \`${agentContextFile(agent)}\` before it answers:`,
    '',
    fence({ language: 'markdown', code: CONTEXT_EXAMPLE }),
    '',
    '## Agent-friendly docs',
    '',
    list(AGENT_DOC_LINKS),
    '',
    'No MCP support in your tool? Paste this primer into any assistant:',
    '',
    fence({ language: 'text', code: BROWSER_PRIMER }),
    '',
    '## Example prompts',
    '',
    SAMPLE_PROMPTS.map((prompt) => `- "${prompt}"`).join('\n'),
    '',
    '## Tips',
    '',
    agentTips(agent)
      .map((tip) => `- ${tip}`)
      .join('\n'),
    '',
    '## FAQ',
    '',
    qa(agentFaq(agent)),
    '## Troubleshooting',
    '',
    qa(agentTroubleshooting(agent))
  ].join('\n')
}
