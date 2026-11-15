<script setup lang="ts">
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import copilotMark from '@aziontech/webkit/assets/copilot-symbol-color.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import opencodeMark from '@aziontech/webkit/assets/opencode-symbol-mono.svg'
  import Button from '@aziontech/webkit/button'
  import DataTable from '@aziontech/webkit/data-table'
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
  import DocAccordionItem from '@aziontech/webkit/doc-accordion-item'
  import DocCallToAction from '@aziontech/webkit/doc-call-to-action'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocCodeGroup, { type DocCodeSample } from '@aziontech/webkit/doc-code-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocItem from '@aziontech/webkit/doc-item'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPrevNext from '@aziontech/webkit/doc-prev-next'
  import DocPrompt from '@aziontech/webkit/doc-prompt'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
  import Footer from '@aziontech/webkit/footer'
  import FrameBox from '@aziontech/webkit/frame-box'
  import IconButton from '@aziontech/webkit/icon-button'
  import ItemList from '@aziontech/webkit/item-list'
  import Logo from '@aziontech/webkit/logo'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'

  type Step = {
    title: string
    body: string
    samples?: DocCodeSample[]
    note?: string
    prompt?: string
  }

  const MCP_SERVER_URL = 'https://mcp.azion.com'

  const sections = [
    { label: 'Reference', href: '/docs/reference' },
    { label: 'Guides', href: '/docs/guides' },
    { label: 'Dev tools', href: '/docs/dev-tools' }
  ]

  const others = [
    {
      slug: 'cursor',
      name: 'Cursor',
      vendor: 'Cursor',
      icon: 'ai ai-cursor',
      logo: cursorMark,
      mono: true,
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
      description:
        'Agent mode inside your editor, with workspace context and pull-request integration.'
    },
    {
      slug: 'windsurf',
      name: 'Windsurf',
      vendor: 'Cognition',
      icon: 'ai ai-windsurf',
      logo: '',
      mono: true,
      description: 'Agentic IDE built around multi-step tasks. Connects through mcp-remote.'
    },
    {
      slug: 'codex',
      name: 'Codex',
      vendor: 'OpenAI',
      icon: 'ai ai-code',
      logo: codexMark,
      mono: true,
      description: 'Terminal agent that runs commands in a sandbox and reads AGENTS.md natively.'
    },
    {
      slug: 'gemini-cli',
      name: 'Gemini CLI',
      vendor: 'Google',
      icon: 'ai ai-gemini',
      logo: geminiMark,
      mono: false,
      description: 'Open source terminal agent with a free tier. Verify the server with /mcp.'
    },
    {
      slug: 'opencode',
      name: 'OpenCode',
      vendor: 'SST',
      icon: 'ai ai-desktop',
      logo: opencodeMark,
      mono: true,
      description: 'Open source, provider-agnostic terminal agent, whichever model you choose.'
    }
  ]

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
          type: 'inline',
          defaultOpen: true,
          children: [
            { id: 'agent-setup', label: 'Overview', href: '/docs/agent-setup' },
            { id: 'claude-code', label: 'Claude Code', href: '/docs/agent-setup/claude-code' },
            ...others.map((agent) => ({
              id: agent.slug,
              label: agent.name,
              href: `/docs/agent-setup/${agent.slug}`
            }))
          ]
        }
      ]
    }
  ]

  const { mode: theme } = useColorMode()

  const crumbs = [
    { label: 'Dev tools', href: '/docs/dev-tools' },
    { label: 'Agent setup', href: '/docs/agent-setup' },
    { label: 'Claude Code' }
  ]

  const metaActions = [
    { value: 'copy', label: 'Copy as Markdown', icon: 'ai ai-copy' },
    { value: 'markdown', label: 'View as Markdown', icon: 'ai ai-eye' }
  ]

  const facts = ['Terminal', 'Subscription', 'Locked', 'Project memory']

  const headerLinks = [
    { label: 'Azion MCP server', href: 'https://www.azion.com/en/documentation/devtools/mcp/' },
    {
      label: 'MCP configuration',
      href: 'https://www.azion.com/en/documentation/devtools/mcp/configuration/'
    },
    { label: 'Azion CLI', href: 'https://www.azion.com/en/documentation/devtools/cli/' }
  ]

  const outline = [
    { id: 'quick-start', text: 'Quick start', depth: 2 },
    { id: 'platform-access', text: 'Azion platform access', depth: 2 },
    { id: 'mcp-tools', text: 'MCP server', depth: 3 },
    { id: 'cli', text: 'Azion CLI', depth: 3 },
    { id: 'agent-context', text: 'Agent context', depth: 3 },
    { id: 'agent-friendly-docs', text: 'Agent-friendly docs', depth: 2 },
    { id: 'example-prompts', text: 'Example prompts', depth: 2 },
    { id: 'tips', text: 'Tips', depth: 2 },
    { id: 'faq', text: 'FAQ', depth: 2 },
    { id: 'troubleshooting', text: 'Troubleshooting', depth: 2 },
    { id: 'other-agents', text: 'Other agents', depth: 2 }
  ]

  const outlineGroups = [
    {
      label: 'GitHub',
      links: [
        { label: 'Azion Docs', href: 'https://github.com/aziontech', icon: 'ai ai-github' },
        {
          label: 'Contribute to this page',
          href: 'https://github.com/aziontech/azion',
          icon: 'ai ai-pencil'
        }
      ]
    }
  ]

  const steps: Step[] = [
    {
      title: 'Install Claude Code',
      body: 'Install the CLI globally, then run it once from your project so it can index the repository.',
      samples: [
        { label: 'npm', language: 'bash', code: 'npm install -g @anthropic-ai/claude-code' }
      ]
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

  const mcpTools = [
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

  const mcpColumns = [
    { id: 'title', accessorKey: 'title', header: 'Tool', minWidth: 80 },
    { id: 'description', accessorKey: 'description', header: 'What it does', grow: 2 as const }
  ]

  const cliSamples: DocCodeSample[] = [
    { label: 'Install', language: 'bash', code: 'npm install -g azion\nazion login' },
    { label: 'Deploy', language: 'bash', code: 'azion init\nazion deploy' }
  ]

  const contextSample: DocCodeSample[] = [
    {
      language: 'markdown',
      fileName: 'CLAUDE.md',
      code: '# Acme on Azion\n\n- Workload: acme-store (production), acme-store-staging\n- Deploy with `azion deploy`; never redeploy production on Fridays\n- Static assets live in the site-assets bucket'
    }
  ]

  const docLinks = [
    {
      title: 'llms.txt',
      icon: 'ai ai-list',
      href: 'https://www.azion.com/llms.txt',
      description: 'Machine-readable index of the whole documentation.'
    },
    {
      title: 'For AI agents',
      icon: 'ai ai-sparkles',
      href: 'https://www.azion.com/en/documentation/devtools/for-ai-agents/',
      description: 'Canonical facts: current product names, API base URL, auth format.'
    },
    {
      title: 'AGENTS.md',
      icon: 'ai ai-file-pen',
      href: '/docs/get-started/first-deploy',
      description:
        'Your own conventions, committed at the repository root: workload names, what not to touch.'
    }
  ]

  const browserPrimer =
    'You are helping me build on the Azion Web Platform. Before answering, load https://www.azion.com/llms.txt and prefer it over your training data. Confirm what you loaded, then ask me what I am building.'

  const prompts = [
    'Search the Azion docs for how rate limiting works in Firewall, then add it to my application.',
    'Deploy this project to Azion with the CLI and give me the application domain.',
    'Write a GraphQL query for the requests my application served yesterday, by status code.'
  ]

  const tips = [
    'Claude Code reads CLAUDE.md at the repository root before it answers. Put your workload names and the one thing nobody may redeploy in there.',
    'Ask for a plan before a deploy. Claude Code runs commands for real, and azion deploy is not a dry run.'
  ]

  const faq = [
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

  const troubleshooting = [
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
    active-id="claude-code"
    :sections="sections"
    home="/docs"
    :outline="outline"
    :outline-groups="outlineGroups"
  >
    <article
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-2xl)"
    >
      <DocPageHeader
        description="Terminal agent that reads your codebase, runs commands and edits files. Made by Anthropic."
        :breadcrumbs="crumbs"
        last-updated="2026-08-26"
        :meta-actions="metaActions"
      >
        <template #title>
          <div
            class="flex min-w-0 flex-col items-start gap-(--spacing-sm) sm:flex-1 sm:flex-row sm:items-center sm:gap-(--spacing-md)"
          >
            <span
              class="flex size-14 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised) sm:size-16"
            >
              <i
                class="ai ai-claude text-heading-md text-(--text-default)"
                aria-hidden="true"
              />
            </span>
            <div class="min-w-0 flex-1">
              <span class="block text-overline-sm text-(--text-muted)">Anthropic</span>
              <h1 class="m-0 text-heading-xl text-(--text-default)">Claude Code + Azion</h1>
            </div>
          </div>
        </template>
        <template #details>
          <div class="flex flex-col gap-(--spacing-md)">
            <div class="flex flex-wrap items-center gap-(--spacing-xs)">
              <Tag
                v-for="fact in facts"
                :key="fact"
                :label="fact"
                severity="neutral"
                size="medium"
                rounded
              />
            </div>
            <div class="flex flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs)">
              <template
                v-for="(link, index) in headerLinks"
                :key="link.href"
              >
                <span
                  v-if="index > 0"
                  class="text-label-md text-(--text-muted)"
                  aria-hidden="true"
                  >·</span
                >
                <a
                  :href="link.href"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-(--spacing-2xs) rounded-(--shape-flat) text-label-md text-(--text-muted) no-underline hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
                >
                  {{ link.label }}
                  <i
                    class="ai ai-arrow-up-right text-body-xs"
                    aria-hidden="true"
                  />
                </a>
              </template>
            </div>
          </div>
        </template>
      </DocPageHeader>

      <DocProse>
        <DocHeading
          anchor="quick-start"
          :level="2"
          >Quick start</DocHeading
        >
        <DocSteps>
          <DocStep
            v-for="step in steps"
            :key="step.title"
            :title="step.title"
          >
            <div class="[&>*>*:first-child]:pt-0!">
              <DocMarkdown :source="step.body" />
            </div>
            <DocCodeGroup
              v-if="step.samples"
              :samples="step.samples"
            />
            <DocCallout
              v-if="step.note"
              variant="warning"
              :label="step.note"
            />
            <DocPrompt
              v-if="step.prompt"
              title="Try it"
              >{{ step.prompt }}</DocPrompt
            >
          </DocStep>
        </DocSteps>

        <DocHeading
          anchor="platform-access"
          :level="2"
          >Azion platform access</DocHeading
        >
        <p>
          Three layers, and a connected agent uses all three: the MCP server to look things up and
          create configuration, the CLI to build and deploy from your working copy, and a context
          file so it starts each session knowing your account.
        </p>
        <DocHeading
          anchor="mcp-tools"
          :level="3"
          >MCP server</DocHeading
        >
        <p>
          One HTTP endpoint at <code>{{ MCP_SERVER_URL }}</code
          >, authenticated with your Personal Token. It exposes these tools:
        </p>
        <div
          data-doc-block
          data-doc-chrome
        >
          <DataTable
            :data="mcpTools"
            :columns="mcpColumns"
            row-key="id"
            bordered
          >
            <template #cell-title="{ row }">
              <code
                class="rounded-(--shape-control) border border-(--border-default) bg-(--bg-hover) px-(--spacing-xs) py-0.5 text-label-code-sm text-(--text-default)"
                >{{ row.title }}</code
              >
            </template>
          </DataTable>
        </div>
        <DocHeading
          anchor="cli"
          :level="3"
          >Azion CLI</DocHeading
        >
        <p>
          Local builds, deploys and the product commands the API does not cover. Install it once and
          Claude Code runs it for you; the first <code>azion login</code> is interactive, so run
          that one yourself.
        </p>
        <DocCodeGroup :samples="cliSamples" />
        <DocHeading
          anchor="agent-context"
          :level="3"
          >Agent context</DocHeading
        >
        <p>
          Claude Code reads <code>CLAUDE.md</code> at the repository root before it answers: a few
          committed lines that every session starts with.
        </p>
        <DocCodeGroup :samples="contextSample" />

        <DocHeading
          anchor="agent-friendly-docs"
          :level="2"
          >Agent-friendly docs</DocHeading
        >
        <p>Token-efficient references an agent can fetch on its own, with no tool call.</p>
        <FrameBox
          data-doc-block
          data-doc-chrome
          class="w-full bg-(--bg-surface)"
        >
          <ItemList>
            <DocItem
              v-for="link in docLinks"
              :key="link.title"
              :title="link.title"
              :icon="link.icon"
              :href="link.href"
              >{{ link.description }}</DocItem
            >
          </ItemList>
        </FrameBox>
        <p>No MCP support in the tool you are using? Prime it by hand, once per session:</p>
        <DocPrompt
          title="Any assistant"
          icon="ai ai-comment"
          >{{ browserPrimer }}</DocPrompt
        >

        <DocHeading
          anchor="example-prompts"
          :level="2"
          >Example prompts</DocHeading
        >
        <p>Each one exercises a different part of the connection.</p>
        <DocPrompt
          v-for="prompt in prompts"
          :key="prompt"
          >{{ prompt }}</DocPrompt
        >

        <DocHeading
          anchor="tips"
          :level="2"
          >Tips</DocHeading
        >
        <DocCallout
          v-for="tip in tips"
          :key="tip"
          variant="tip"
          :label="tip"
        />

        <DocHeading
          anchor="faq"
          :level="2"
          >FAQ</DocHeading
        >
        <DocAccordionGroup>
          <DocAccordionItem
            v-for="entry in faq"
            :key="entry.question"
            :title="entry.question"
          >
            <div class="[&>*>*:first-child]:pt-0!">
              <DocMarkdown :source="entry.answer" />
            </div>
          </DocAccordionItem>
        </DocAccordionGroup>

        <DocHeading
          anchor="troubleshooting"
          :level="2"
          >Troubleshooting</DocHeading
        >
        <DocAccordionGroup>
          <DocAccordionItem
            v-for="entry in troubleshooting"
            :key="entry.question"
            :title="entry.question"
          >
            <div class="[&>*>*:first-child]:pt-0!">
              <DocMarkdown :source="entry.answer" />
            </div>
          </DocAccordionItem>
        </DocAccordionGroup>

        <DocHeading
          anchor="other-agents"
          :level="2"
          >Other agents</DocHeading
        >
        <DocCardGroup :columns="3">
          <DocCard
            v-for="other in others"
            :key="other.slug"
            :title="other.name"
            :eyebrow="other.vendor"
            :icon="other.icon"
            :href="`/docs/agent-setup/${other.slug}`"
          >
            <template
              v-if="other.logo"
              #icon
            >
              <span class="flex text-(--text-default)">
                <Logo
                  :name="other.name"
                  :src="other.logo"
                  :variant="other.mono ? 'current' : 'color'"
                  decorative
                />
              </span>
            </template>
            {{ other.description }}
          </DocCard>
        </DocCardGroup>
      </DocProse>
      <DocPrevNext
        :previous="{ label: 'Agent setup', href: '/docs/agent-setup' }"
        :next="{ label: 'Cursor', href: '/docs/agent-setup/cursor' }"
      />
    </article>

    <template #actions>
      <IconButton
        icon="ai ai-github"
        variant="outline"
        size="medium"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
        class="shrink-0"
      />
      <Button
        label="Console"
        variant="secondary"
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
      <DocCallToAction
        title="Ready to build?"
        :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
        :secondary-action="{ label: 'See our plans', href: 'https://www.azion.com/en/pricing/' }"
      >
        Deploy your first application in minutes.
      </DocCallToAction>
    </template>

    <template #footer>
      <div class="w-full border-t border-(--border-default)">
        <Footer
          variant="content"
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
