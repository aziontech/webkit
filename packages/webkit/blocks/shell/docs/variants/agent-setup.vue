<script setup lang="ts">
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import copilotMark from '@aziontech/webkit/assets/copilot-symbol-color.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import opencodeMark from '@aziontech/webkit/assets/opencode-symbol-mono.svg'
  import DataTable from '@aziontech/webkit/data-table'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPreviousNext from '@aziontech/webkit/doc-previous-next'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocTab from '@aziontech/webkit/doc-tab'
  import DocTabs from '@aziontech/webkit/doc-tabs'
  import Logo from '@aziontech/webkit/logo'
  import Tag from '@aziontech/webkit/tag'

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
      icon: 'ai ai-claude',
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
      icon: 'ai ai-cursor',
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
      icon: 'ai ai-github',
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
      icon: 'ai ai-windsurf',
      logo: '',
      mono: true,
      workflows: ['IDE'],
      pricing: 'Subscription',
      model: 'Multi-provider',
      context: 'Indexed codebase',
      openSource: false,
      description:
        'Agentic IDE built around multi-step tasks. Connects to Azion through mcp-remote.'
    },
    {
      slug: 'codex',
      name: 'Codex',
      vendor: 'OpenAI',
      icon: 'ai ai-code',
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
      icon: 'ai ai-gemini',
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
      icon: 'ai ai-desktop',
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

  const agentHref = (agent: Agent) => `/docs/agent-setup/${agent.slug}`

  const crumbs = [{ label: 'Dev tools', href: '/docs/dev-tools' }, { label: 'Agent setup' }]

  const metaActions = [
    { value: 'copy', label: 'Copy as Markdown', icon: 'ai ai-copy' },
    { value: 'markdown', label: 'View as Markdown', icon: 'ai ai-eye' }
  ]

  const filters: Array<'All' | Workflow> = ['All', 'Terminal', 'IDE', 'Extension']

  const grids = filters.map((filter) => ({
    filter,
    agents: filter === 'All' ? agents : agents.filter((agent) => agent.workflows.includes(filter))
  }))

  const compareColumns = [
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

  const flagColumns = ['terminal', 'ide', 'extension', 'openSource'] as const

  const tagColumns = ['pricing', 'model', 'context'] as const

  const compareRows = agents.map((agent) => ({
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

  const workflowTypes = [
    {
      title: 'Terminal',
      icon: 'ai ai-desktop',
      description: 'Runs in a shell. Best for automation, scripting and CI pipelines.'
    },
    {
      title: 'IDE',
      icon: 'ai ai-code',
      description: 'A full editor with the agent first-class: visual diffs and multi-file edits.'
    },
    {
      title: 'Extension',
      icon: 'ai ai-layout-grid',
      description: 'Plugs into the editor you already use. Lightest install, keeps your setup.'
    },
    {
      title: 'Cloud',
      icon: 'ai ai-cloud',
      description: 'Hosted, with no local install. Suited to asynchronous, long-running work.'
    }
  ]

  const keyConcepts = [
    {
      title: 'MCP',
      icon: 'ai ai-server',
      description:
        'The Model Context Protocol, the standard that lets an agent call external tools. Azion ships one MCP server, and every agent on this page speaks it.'
    },
    {
      title: 'Agent context',
      icon: 'ai ai-file',
      description:
        'The files an agent reads before it answers: llms.txt for the documentation index, AGENTS.md for your project conventions.'
    },
    {
      title: 'Model flexibility',
      icon: 'ai ai-sliders-horizontal',
      description:
        'Locked ties you to the maker’s own models. BYOK takes your provider key. Multi-provider switches between several.'
    },
    {
      title: 'Context',
      icon: 'ai ai-database',
      description:
        'Session forgets at the end of a conversation. Project memory persists in a file you commit. Indexed codebase keeps a searchable index of the repository.'
    }
  ]

  const tradeoffs = [
    {
      title: 'Cloud vs. local',
      icon: 'ai ai-cloud-upload',
      description:
        'Cloud runs long tasks without holding your machine, and sends your code somewhere. Local keeps everything on disk, and stops when your laptop does.'
    },
    {
      title: 'Proprietary vs. open source',
      icon: 'ai ai-github',
      description:
        'Open source can be audited, forked and self-hosted. Proprietary tends to ship the newest capability first.'
    },
    {
      title: 'Locked model vs. BYOK',
      icon: 'ai ai-key',
      description:
        'A locked model is tuned for its own agent and priced as one subscription. BYOK lets you choose the model per task and pay per token.'
    },
    {
      title: 'Session vs. indexed codebase',
      icon: 'ai ai-search',
      description:
        'An index answers questions about code nobody opened, at the cost of a copy of the repository. A session only knows what it was shown.'
    }
  ]
</script>

<template>
  <article
    class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-2xl)"
  >
    <DocPageHeader
      title="Agent setup"
      description="Azion ships an MCP server, agent-ready documentation and a CLI, so your coding agent can build on the platform from your editor or terminal."
      :breadcrumbs="crumbs"
      last-updated="2026-08-26"
      :meta-actions="metaActions"
    />
    <DocProse>
      <DocHeading
        anchor="pick-your-agent"
        :level="2"
        >Pick your agent</DocHeading
      >
      <p>Select an agent to get step-by-step setup instructions.</p>
      <DocTabs>
        <DocTab
          v-for="grid in grids"
          :key="grid.filter"
          :title="grid.filter"
        >
          <DocCardGroup :columns="3">
            <DocCard
              v-for="agent in grid.agents"
              :key="agent.slug"
              :title="agent.name"
              :eyebrow="agent.vendor"
              :icon="agent.icon"
              :href="agentHref(agent)"
            >
              <template
                v-if="agent.logo"
                #icon
              >
                <span class="flex text-(--text-default)">
                  <Logo
                    :name="agent.name"
                    :src="agent.logo"
                    :variant="agent.mono ? 'current' : 'color'"
                    decorative
                  />
                </span>
              </template>
              {{ agent.description }}
            </DocCard>
          </DocCardGroup>
        </DocTab>
      </DocTabs>
      <p>
        Using another client that speaks MCP? The server is one HTTP endpoint: point your client at
        <code>mcp.azion.com</code> with a Personal Token and the nine tools show up.
      </p>

      <DocHeading
        anchor="compare-agents"
        :level="2"
        >Compare agents</DocHeading
      >
      <div
        data-doc-block
        data-doc-chrome
      >
        <DataTable
          :data="compareRows"
          :columns="compareColumns"
          row-key="id"
          bordered
        >
          <template #cell-agent="{ row }">
            <a
              :href="row.href"
              class="flex min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-flat) text-label-md text-(--text-default) no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
            >
              <Logo
                v-if="row.logo"
                :name="row.agent"
                :src="row.logo"
                :variant="row.mono ? 'current' : 'color'"
                decorative
                size="small"
              />
              <i
                v-else
                :class="row.icon"
                class="shrink-0 text-label-md"
                aria-hidden="true"
              />
              <span class="truncate">{{ row.agent }}</span>
            </a>
          </template>
          <template
            v-for="column in flagColumns"
            :key="column"
            #[`cell-${column}`]="{ value }"
          >
            <i
              :class="value ? 'ai-check text-(--primary)' : 'ai-minus text-(--text-muted)'"
              class="ai text-label-md"
              aria-hidden="true"
            />
            <span class="sr-only">{{ value ? 'Yes' : 'No' }}</span>
          </template>
          <template
            v-for="column in tagColumns"
            :key="column"
            #[`cell-${column}`]="{ value }"
          >
            <Tag
              :label="String(value)"
              severity="neutral"
              size="small"
            />
          </template>
        </DataTable>
      </div>
      <DocCallout variant="note">
        Every agent listed connects to the Azion MCP server. The workflow columns say where the tool
        runs, not what it can do.
      </DocCallout>

      <DocHeading
        anchor="understanding-agents"
        :level="2"
        >Understanding agents</DocHeading
      >
      <p>Common types, concepts and tradeoffs.</p>
      <DocHeading
        anchor="workflow"
        :level="3"
        >Workflow</DocHeading
      >
      <DocCardGroup :columns="2">
        <DocCard
          v-for="type in workflowTypes"
          :key="type.title"
          :title="type.title"
          :icon="type.icon"
          :label="type.description"
        />
      </DocCardGroup>
      <DocHeading
        anchor="key-concepts"
        :level="3"
        >Key concepts</DocHeading
      >
      <DocCardGroup :columns="2">
        <DocCard
          v-for="concept in keyConcepts"
          :key="concept.title"
          :title="concept.title"
          :icon="concept.icon"
          :label="concept.description"
        />
      </DocCardGroup>
      <DocHeading
        anchor="common-tradeoffs"
        :level="3"
        >Common tradeoffs</DocHeading
      >
      <DocCardGroup :columns="2">
        <DocCard
          v-for="tradeoff in tradeoffs"
          :key="tradeoff.title"
          :title="tradeoff.title"
          :icon="tradeoff.icon"
          :label="tradeoff.description"
        />
      </DocCardGroup>
    </DocProse>
    <DocPreviousNext
      :previous="{ label: 'MCP server', href: '/docs/dev-tools/mcp' }"
      :next="{ label: 'Claude Code', href: '/docs/agent-setup/claude-code' }"
    />
  </article>
</template>
