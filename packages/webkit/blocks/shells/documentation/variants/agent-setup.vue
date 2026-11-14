<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocCta from '@aziontech/webkit/doc-cta'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPagination from '@aziontech/webkit/doc-pagination'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocTab from '@aziontech/webkit/doc-tab'
  import DocTabs from '@aziontech/webkit/doc-tabs'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  type Workflow = 'Terminal' | 'IDE' | 'Extension'

  type Agent = {
    slug: string
    name: string
    vendor: string
    icon: string
    workflows: Workflow[]
    pricing: string
    model: string
    context: string
    openSource: boolean
    description: string
  }

  const sections = [
    { label: 'Reference', href: '/docs/reference' },
    { label: 'Guides', href: '/docs/guides' },
    { label: 'Dev tools', href: '/docs/dev-tools' }
  ]

  const agents: Agent[] = [
    {
      slug: 'claude-code',
      name: 'Claude Code',
      vendor: 'Anthropic',
      icon: 'ai ai-claude',
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
      icon: 'pi pi-code',
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
      icon: 'pi pi-desktop',
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

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Dev tools',
      items: [
        { id: 'dev-tools-overview', label: 'Overview', href: '/docs/dev-tools' },
        { id: 'azion-cli', label: 'Azion CLI', href: '/docs/dev-tools/cli' },
        { id: 'mcp-server', label: 'MCP server', href: '/docs/dev-tools/mcp' },
        {
          id: 'agent-setup-group',
          label: 'Agent setup',
          kind: 'inline',
          defaultOpen: true,
          children: [
            { id: 'agent-setup', label: 'Overview', href: '/docs/agent-setup' },
            ...agents.map((agent) => ({
              id: agent.slug,
              label: agent.name,
              href: agentHref(agent)
            }))
          ]
        }
      ]
    }
  ]

  const theme = ref<ThemeSwitcherValue>('system')

  const crumbs = [{ label: 'Dev tools', href: '/docs/dev-tools' }, { label: 'Agent setup' }]

  const metaActions = [
    { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy' },
    { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye' }
  ]

  const outline = [
    { id: 'pick-your-agent', text: 'Pick your agent', depth: 2 },
    { id: 'compare-agents', text: 'Compare agents', depth: 2 },
    { id: 'understanding-agents', text: 'Understanding agents', depth: 2 },
    { id: 'workflow', text: 'Workflow', depth: 3 },
    { id: 'key-concepts', text: 'Key concepts', depth: 3 },
    { id: 'common-tradeoffs', text: 'Common tradeoffs', depth: 3 }
  ]

  const outlineGroups = [
    {
      label: 'GitHub',
      links: [
        { label: 'Azion Docs', href: 'https://github.com/aziontech', icon: 'pi pi-github' },
        {
          label: 'Contribute to this page',
          href: 'https://github.com/aziontech/azion',
          icon: 'pi pi-pencil'
        }
      ]
    }
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
      icon: 'pi pi-desktop',
      description: 'Runs in a shell. Best for automation, scripting and CI pipelines.'
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
      description: 'Hosted, with no local install. Suited to asynchronous, long-running work.'
    }
  ]

  const keyConcepts = [
    {
      title: 'MCP',
      icon: 'pi pi-server',
      description:
        'The Model Context Protocol, the standard that lets an agent call external tools. Azion ships one MCP server, and every agent on this page speaks it.'
    },
    {
      title: 'Agent context',
      icon: 'pi pi-file',
      description:
        'The files an agent reads before it answers: llms.txt for the documentation index, AGENTS.md for your project conventions.'
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
        'Session forgets at the end of a conversation. Project memory persists in a file you commit. Indexed codebase keeps a searchable index of the repository.'
    }
  ]

  const tradeoffs = [
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

  const footerColumns = [
    { title: 'Company', links: ['About us', 'Careers', 'Compliance', 'Privacy Policy'] },
    { title: 'Resources', links: ['Blog', 'Learning', 'Marketplace', 'Success cases'] },
    { title: 'Getting started', links: ['Start for free', 'Pricing', 'Contact'] },
    { title: 'Developer', links: ['Documentation', 'API', 'Release notes'] }
  ]
</script>

<template>
  <DocLayout
    :navigation="navigation"
    active-id="agent-setup"
    :sections="sections"
    home="/docs"
    :outline="outline"
    :outline-groups="outlineGroups"
  >
    <article
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-xxl)"
    >
      <DocPageHeader
        title="Agent setup"
        description="Azion ships an MCP server, agent-ready documentation and a CLI, so your coding agent can build on the platform from your editor or terminal."
        :breadcrumb="crumbs"
        last-updated="2026-08-26"
        :meta-actions="metaActions"
      />
      <DocProse>
        <DocHeading
          id="pick-your-agent"
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
            <DocCardGroup :cols="3">
              <DocCard
                v-for="agent in grid.agents"
                :key="agent.slug"
                :title="agent.name"
                :eyebrow="agent.vendor"
                :icon="agent.icon"
                :href="agentHref(agent)"
                >{{ agent.description }}</DocCard
              >
            </DocCardGroup>
          </DocTab>
        </DocTabs>
        <p>
          Using another client that speaks MCP? The server is one HTTP endpoint: point your client
          at <code>mcp.azion.com</code> with a Personal Token and the nine tools show up.
        </p>

        <DocHeading
          id="compare-agents"
          :level="2"
          >Compare agents</DocHeading
        >
        <div
          data-doc-block
          data-doc-chrome
        >
          <Table
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
                <i
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
                :class="value ? 'pi-check text-(--primary)' : 'pi-minus text-(--text-muted)'"
                class="pi text-label-md"
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
                severity="secondary"
                size="small"
              />
            </template>
          </Table>
        </div>
        <DocCallout kind="note">
          Every agent listed connects to the Azion MCP server. The workflow columns say where the
          tool runs, not what it can do.
        </DocCallout>

        <DocHeading
          id="understanding-agents"
          :level="2"
          >Understanding agents</DocHeading
        >
        <p>Common types, concepts and tradeoffs.</p>
        <DocHeading
          id="workflow"
          :level="3"
          >Workflow</DocHeading
        >
        <DocCardGroup :cols="2">
          <DocCard
            v-for="type in workflowTypes"
            :key="type.title"
            :title="type.title"
            :icon="type.icon"
            :label="type.description"
          />
        </DocCardGroup>
        <DocHeading
          id="key-concepts"
          :level="3"
          >Key concepts</DocHeading
        >
        <DocCardGroup :cols="2">
          <DocCard
            v-for="concept in keyConcepts"
            :key="concept.title"
            :title="concept.title"
            :icon="concept.icon"
            :label="concept.description"
          />
        </DocCardGroup>
        <DocHeading
          id="common-tradeoffs"
          :level="3"
          >Common tradeoffs</DocHeading
        >
        <DocCardGroup :cols="2">
          <DocCard
            v-for="tradeoff in tradeoffs"
            :key="tradeoff.title"
            :title="tradeoff.title"
            :icon="tradeoff.icon"
            :label="tradeoff.description"
          />
        </DocCardGroup>
      </DocProse>
      <DocPagination
        :previous="{ title: 'MCP server', href: '/docs/dev-tools/mcp' }"
        :next="{ title: 'Claude Code', href: '/docs/agent-setup/claude-code' }"
      />
    </article>

    <template #actions>
      <IconButton
        icon="pi pi-github"
        kind="outlined"
        size="medium"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
        class="shrink-0"
      />
      <Button
        label="Console"
        kind="secondary"
        size="medium"
        class="shrink-0"
        href="https://console.azion.com"
      />
    </template>

    <template #navigation-footer>
      <ThemeSwitcher
        v-model="theme"
        aria-label="Theme"
      />
    </template>

    <template #aside>
      <DocCta
        title="Ready to build?"
        primary-label="Start for free"
        primary-href="https://console.azion.com/signup"
        secondary-label="See our plans"
        secondary-href="https://www.azion.com/en/pricing/"
      >
        Deploy your first application in minutes.
      </DocCta>
    </template>

    <template #footer>
      <div class="w-full border-t border-(--border-default)">
        <Footer
          kind="content"
          aria-label="Footer"
        >
          <Footer.Column
            v-for="column in footerColumns"
            :key="column.title"
            :title="column.title"
          >
            <Footer.Link
              v-for="link in column.links"
              :key="link"
              href="#"
              >{{ link }}</Footer.Link
            >
          </Footer.Column>
          <template #status>
            <StatusIndicator
              severity="success"
              label="All systems operational"
            />
          </template>
        </Footer>
      </div>
    </template>
  </DocLayout>
</template>
