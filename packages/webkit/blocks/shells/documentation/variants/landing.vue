<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Command from '@aziontech/webkit/command'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocHero from '@aziontech/webkit/doc-hero'
  import DocPagination from '@aziontech/webkit/doc-pagination'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Footer from '@aziontech/webkit/footer'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const sections = ['Reference', 'Guides', 'Dev tools']
  const theme = ref<ThemeSwitcherValue>('system')

  const gettingStarted = ['Fundamentals', 'Agent setup', 'Use cases', 'Support', 'Marketplace']
  const platform = [
    'Workloads',
    'Applications',
    'Firewall',
    'Functions',
    'Connectors',
    'Object Storage',
    'SQL Database',
    'KV Store'
  ]

  const prompt =
    'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'

  const interfaces = [
    {
      title: 'Console',
      icon: 'ai ai-azion',
      link: 'Access the Console',
      text: 'Configure it visually: applications, firewall rules, metrics, and events.'
    },
    {
      title: 'CLI',
      icon: 'ai ai-azion-cli',
      link: 'Install the CLI',
      text: 'Stay in the terminal: link a project, run it locally, and deploy with a single binary.'
    },
    {
      title: 'API',
      icon: 'ai ai-azion-api',
      link: 'Call the API',
      text: 'Drive it from your own systems: create and change resources over REST, token authenticated.'
    }
  ]
  const objectives = [
    {
      title: 'Build your application',
      icon: 'pi pi-box',
      text: 'Deploy from a template, a repo, or the CLI.'
    },
    {
      title: 'Accelerate your application',
      icon: 'pi pi-gauge',
      text: 'Cache responses so your origin stops repeating itself.'
    },
    {
      title: 'Secure your application',
      icon: 'pi pi-shield',
      text: 'A firewall in front, with a block rule you can verify.'
    },
    {
      title: 'Execute AI inference',
      icon: 'pi pi-sparkles',
      text: 'A hosted model behind an OpenAI-compatible endpoint.'
    }
  ]
  const templates = [
    { title: 'React', icon: 'ai-cor ai-react' },
    { title: 'Next.js', icon: 'ai-cor ai-next' },
    { title: 'Astro', icon: 'ai-cor ai-astro' },
    { title: 'Vue.js', icon: 'ai-cor ai-vue' },
    { title: 'Angular', icon: 'ai-cor ai-angular' },
    { title: 'Gatsby Blog', icon: 'ai ai-gatsby' },
    { title: 'Hono', icon: 'ai ai-hono' },
    { title: 'Hugo', icon: 'ai ai-hugo' }
  ]
  const attacks = [
    {
      title: 'Add a firewall',
      icon: 'pi pi-shield',
      text: 'Bind it to your workload and prove a deny rule with curl.'
    },
    {
      title: 'Block injection attacks',
      icon: 'pi pi-filter',
      text: 'A SQL Injection rule set, with the blocks visible in events.'
    },
    {
      title: 'Tune false positives',
      icon: 'pi pi-list-check',
      text: 'Turn WAF false positives into allowed rules.'
    },
    {
      title: 'Deny bad bots',
      icon: 'pi pi-microchip',
      text: 'Deny automated requests that score above your threshold.'
    },
    {
      title: 'Network blocklists',
      icon: 'pi pi-map',
      text: 'Drop unwanted traffic before it reaches your application.'
    },
    {
      title: 'Install TLS certificates',
      icon: 'pi pi-key',
      text: 'Upload a certificate and key, then check the handshake.'
    }
  ]
  const compliance = [
    {
      title: 'Shared Responsibility Model',
      icon: 'pi pi-verified',
      text: 'What Azion covers, and what stays yours.'
    },
    {
      title: 'Governance, Risk and Compliance',
      icon: 'pi pi-id-card',
      text: 'The tools and certifications behind your compliance work.'
    },
    {
      title: 'PCI DSS compliance',
      icon: 'pi pi-wallet',
      text: 'PCI DSS 4.0 Level 1, and what it covers for cardholder data.'
    },
    {
      title: 'SOC compliance',
      icon: 'pi pi-lock',
      text: 'SOC 2 Type 2 and SOC 3 reports, twice a year.'
    },
    {
      title: 'Activity History',
      icon: 'pi pi-history',
      text: 'The audit trail: who changed what, and when.'
    },
    {
      title: 'Security Response Team',
      icon: 'pi pi-users',
      text: 'Azion security specialists to analyze threats and investigate attacks.'
    }
  ]
  const followAlong: {
    title: string
    icon: string
    link?: string
    text: string
    target?: '_blank' | '_self'
  }[] = [
    {
      title: 'Release notes',
      icon: 'pi pi-megaphone',
      text: 'What changed in Azion products, as it ships.'
    },
    {
      title: 'Blog',
      icon: 'pi pi-book',
      text: 'Engineering posts and how customers run on Azion.',
      link: 'Read the blog',
      target: '_blank'
    },
    {
      title: 'YouTube',
      icon: 'pi pi-youtube',
      text: 'Walkthroughs, demos, and recorded sessions.',
      link: 'Watch on YouTube',
      target: '_blank'
    },
    {
      title: 'Discord',
      icon: 'pi pi-discord',
      text: 'Ask questions and compare notes with other builders.',
      link: 'Join the Discord',
      target: '_blank'
    }
  ]

  const footerColumns = [
    { title: 'Company', links: ['About us', 'Careers', 'Compliance', 'Privacy Policy'] },
    { title: 'Resources', links: ['Blog', 'Learning', 'Marketplace', 'Success cases'] },
    { title: 'Getting started', links: ['Start for free', 'Pricing', 'Contact'] },
    { title: 'Developer', links: ['Documentation', 'API', 'Release notes'] }
  ]
  const searchPages = ['Get started', 'Applications', 'Functions', 'Firewall', 'Azion CLI']
  const searchOpen = ref(false)
</script>

<template>
  <div class="flex h-screen min-h-0 w-full flex-col bg-(--bg-canvas) text-(--text-default)">
    <div class="@container w-full">
      <GlobalHeader aria-label="Azion documentation">
        <GlobalHeader.Left>
          <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
            <div class="shrink-0 lg:hidden">
              <IconButton
                icon="pi pi-bars"
                kind="outlined"
                size="medium"
                ariaLabel="Open documentation navigation"
              />
            </div>
            <GlobalHeader.Brand>
              <a
                href="#"
                aria-label="Azion Docs home"
                class="inline-flex w-fit items-center gap-(--spacing-xs) rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
              >
                <Brand size="small" />
                <span
                  class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) text-overline-sm text-(--text-muted)"
                  >Docs</span
                >
              </a>
            </GlobalHeader.Brand>
            <div class="ms-(--spacing-xs) hidden shrink-0 lg:flex">
              <NavigationMenu aria-label="Documentation sections">
                <NavigationMenu.List>
                  <NavigationMenu.Item
                    v-for="section in sections"
                    :key="section"
                  >
                    <NavigationMenu.Trigger href="#">{{ section }}</NavigationMenu.Trigger>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </NavigationMenu>
            </div>
          </div>
        </GlobalHeader.Left>
        <GlobalHeader.Nav />
        <GlobalHeader.Right>
          <SearchTrigger
            collapsible
            label="Search docs"
            @open="searchOpen = true"
          />
          <IconButton
            icon="pi pi-github"
            kind="outlined"
            size="medium"
            ariaLabel="Azion on GitHub"
            href="https://github.com/aziontech"
            target="_blank"
            class="shrink-0"
          />
          <Button
            label="Console"
            kind="secondary"
            size="medium"
            class="shrink-0"
            href="#"
          />
        </GlobalHeader.Right>
      </GlobalHeader>
      <Command v-model:open="searchOpen">
        <Command.Input placeholder="Search docs" />
        <Command.List>
          <Command.Empty>No page matches your search.</Command.Empty>
          <Command.Group heading="Pages">
            <Command.Item
              v-for="page in searchPages"
              :key="page"
              :value="page"
              >{{ page }}</Command.Item
            >
          </Command.Group>
        </Command.List>
      </Command>
    </div>

    <div class="relative flex min-h-0 flex-1">
      <aside class="hidden h-full w-(--container-2xs) shrink-0 lg:flex">
        <Sidebar
          aria-label="Documentation"
          class="w-full"
        >
          <template #footer>
            <ThemeSwitcher
              v-model="theme"
              aria-label="Theme"
            />
          </template>
          <MenuRoot role="presentation">
            <MenuGroup label="Getting started">
              <MenuItem
                icon=""
                label="Overview"
                href="#"
                selected
              />
              <MenuItem
                icon=""
                v-for="page in gettingStarted"
                :key="page"
                :label="page"
                href="#"
              />
            </MenuGroup>
            <MenuGroup label="Platform resources">
              <MenuItem
                icon=""
                v-for="page in platform"
                :key="page"
                :label="page"
                href="#"
              />
            </MenuGroup>
          </MenuRoot>
        </Sidebar>
      </aside>

      <main class="flex min-h-0 min-w-0 flex-1 flex-col">
        <ScrollArea class="w-full">
          <article class="layout-column layout-boundary-inline flex flex-col pb-(--spacing-xxl)">
            <DocHero
              title="Welcome to Azion Docs"
              description="We make every application fast and reliable. Deploy on a global network with enterprise-grade security and no cold starts."
            >
              <template #actions>
                <Button
                  label="Get started"
                  kind="primary"
                  size="large"
                  href="#"
                />
                <CopyPromptButton :value="prompt" />
              </template>
              <template #note>
                The prompt hands your coding agent the CLI, live docs over MCP, and this project
                linked.
              </template>
            </DocHero>

            <DocProse>
              <div class="flex flex-col gap-(--spacing-xxl)">
                <section
                  aria-labelledby="start-by-interface"
                  class="flex flex-col"
                >
                  <DocHeading
                    id="start-by-interface"
                    :level="2"
                    >Start by interface</DocHeading
                  >
                  <p>
                    Hand the Console to a coding agent, or drive it yourself: visually, from the
                    terminal, or over the API.
                  </p>
                  <DocAgentCard
                    :prompt="prompt"
                    action-href="#"
                  />
                  <DocCardGroup :cols="3">
                    <DocCard
                      v-for="item in interfaces"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      :link-label="item.link"
                      href="#"
                      >{{ item.text }}</DocCard
                    >
                  </DocCardGroup>
                </section>

                <section
                  aria-labelledby="start-by-objective"
                  class="flex flex-col"
                >
                  <DocHeading
                    id="start-by-objective"
                    :level="2"
                    >Start by objective</DocHeading
                  >
                  <p>Build something, make it faster, lock it down, or run AI on it.</p>
                  <DocCardGroup :cols="2">
                    <DocCard
                      v-for="item in objectives"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      href="#"
                      >{{ item.text }}</DocCard
                    >
                    <div class="sm:col-span-2">
                      <DocCard
                        title="Explore use cases"
                        icon="pi pi-sitemap"
                        href="#"
                        >Validated designs that show how Azion products combine to solve each use
                        case, grouped by solution.</DocCard
                      >
                    </div>
                  </DocCardGroup>
                  <p>Also useful: <a href="#">Observe</a></p>
                </section>

                <section
                  aria-labelledby="templates"
                  class="flex flex-col"
                >
                  <DocHeading
                    id="templates"
                    :level="2"
                    >Ready-made templates</DocHeading
                  >
                  <p>Deploy in one step, with CI/CD already wired up.</p>
                  <DocCardGroup
                    :cols="4"
                    :mobile-columns="2"
                  >
                    <DocCard
                      v-for="item in templates"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      href="#"
                    />
                  </DocCardGroup>
                  <p>
                    Also useful: <a href="#">First deploy</a>,
                    <a href="#">Frameworks compatibility</a>
                  </p>
                </section>

                <section
                  aria-labelledby="stop-attacks"
                  class="flex flex-col"
                >
                  <DocHeading
                    id="stop-attacks"
                    :level="2"
                    >Stop attacks</DocHeading
                  >
                  <p>
                    Everything you need to protect applications, APIs, and the traffic that reaches
                    them.
                  </p>
                  <DocCardGroup :cols="3">
                    <DocCard
                      v-for="item in attacks"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      href="#"
                      >{{ item.text }}</DocCard
                    >
                  </DocCardGroup>
                  <p>
                    Reference, when you need the details: <a href="#">DDoS Protection</a>,
                    <a href="#">WAF Rule Sets</a>, <a href="#">Bot Manager</a>
                  </p>
                </section>

                <section
                  aria-labelledby="compliance"
                  class="flex flex-col"
                >
                  <DocHeading
                    id="compliance"
                    :level="2"
                    >Assess risk and prove compliance</DocHeading
                  >
                  <p>
                    What the platform covers, what stays with you, and where the evidence lives when
                    an auditor asks for it.
                  </p>
                  <DocCardGroup :cols="3">
                    <DocCard
                      v-for="item in compliance"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      href="#"
                      >{{ item.text }}</DocCard
                    >
                  </DocCardGroup>
                </section>

                <section
                  aria-labelledby="follow-along"
                  class="flex flex-col"
                >
                  <DocHeading
                    id="follow-along"
                    :level="2"
                    >Follow along</DocHeading
                  >
                  <p>
                    Release notes as things ship, plus the blog, the YouTube channel, and the
                    Discord where questions get answered.
                  </p>
                  <DocCardGroup :cols="3">
                    <DocCard
                      v-for="item in followAlong"
                      :key="item.title"
                      :title="item.title"
                      :icon="item.icon"
                      :link-label="item.link"
                      :target="item.target"
                      href="#"
                      >{{ item.text }}</DocCard
                    >
                    <div class="lg:col-span-2">
                      <DocCard
                        title="Style guide"
                        icon="pi pi-pencil"
                        href="#"
                        >How Azion writes documentation: voice, structure, and conventions.</DocCard
                      >
                    </div>
                  </DocCardGroup>
                </section>
              </div>
            </DocProse>
            <div class="mt-(--spacing-xxl)">
              <DocPagination :next="{ title: 'Agent setup', href: '#' }" />
            </div>
          </article>

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
        </ScrollArea>
      </main>
    </div>
  </div>
</template>
