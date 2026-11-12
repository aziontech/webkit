<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CopyPromptButton from '@aziontech/webkit/copy-prompt-button'
  import DocAgentCard from '@aziontech/webkit/doc-agent-card'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocHero from '@aziontech/webkit/doc-hero'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocPagination from '@aziontech/webkit/doc-pagination'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const sections = [
    { label: 'Reference', href: '/docs/reference' },
    { label: 'Guides', href: '/docs/guides' },
    { label: 'Dev tools', href: '/docs/dev-tools' }
  ]

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

  const slug = (label: string) => label.toLowerCase().replaceAll(' ', '-')

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Getting started',
      items: [
        { id: 'overview', label: 'Overview', href: '/docs' },
        ...gettingStarted.map((label) => ({ id: slug(label), label, href: `/docs/${slug(label)}` }))
      ]
    },
    {
      label: 'Platform resources',
      items: platform.map((label) => ({ id: slug(label), label, href: `/docs/${slug(label)}` }))
    }
  ]

  const theme = ref<ThemeSwitcherValue>('system')

  const prompt =
    'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'

  const interfaces = [
    {
      title: 'Console',
      href: '/docs/console',
      icon: 'ai ai-azion',
      link: 'Access the Console',
      text: 'Configure it visually: applications, firewall rules, metrics, and events.'
    },
    {
      title: 'CLI',
      href: '/docs/cli',
      icon: 'ai ai-azion-cli',
      link: 'Install the CLI',
      text: 'Stay in the terminal: link a project, run it locally, and deploy with a single binary.'
    },
    {
      title: 'API',
      href: '/docs/api',
      icon: 'ai ai-azion-api',
      link: 'Call the API',
      text: 'Drive it from your own systems: create and change resources over REST, token authenticated.'
    }
  ]
  const objectives = [
    {
      title: 'Build your application',
      href: '/docs/build-your-application',
      icon: 'pi pi-box',
      text: 'Deploy from a template, a repo, or the CLI.'
    },
    {
      title: 'Accelerate your application',
      href: '/docs/accelerate-your-application',
      icon: 'pi pi-gauge',
      text: 'Cache responses so your origin stops repeating itself.'
    },
    {
      title: 'Secure your application',
      href: '/docs/secure-your-application',
      icon: 'pi pi-shield',
      text: 'A firewall in front, with a block rule you can verify.'
    },
    {
      title: 'Execute AI inference',
      href: '/docs/execute-ai-inference',
      icon: 'pi pi-sparkles',
      text: 'A hosted model behind an OpenAI-compatible endpoint.'
    }
  ]
  const templates = [
    { title: 'React', icon: 'ai-cor ai-react', href: '/docs/templates/react' },
    { title: 'Next.js', icon: 'ai-cor ai-next', href: '/docs/templates/next-js' },
    { title: 'Astro', icon: 'ai-cor ai-astro', href: '/docs/templates/astro' },
    { title: 'Vue.js', icon: 'ai-cor ai-vue', href: '/docs/templates/vue-js' },
    { title: 'Angular', icon: 'ai-cor ai-angular', href: '/docs/templates/angular' },
    { title: 'Gatsby Blog', icon: 'ai ai-gatsby', href: '/docs/templates/gatsby-blog' },
    { title: 'Hono', icon: 'ai ai-hono', href: '/docs/templates/hono' },
    { title: 'Hugo', icon: 'ai ai-hugo', href: '/docs/templates/hugo' }
  ]
  const attacks = [
    {
      title: 'Add a firewall',
      href: '/docs/add-a-firewall',
      icon: 'pi pi-shield',
      text: 'Bind it to your workload and prove a deny rule with curl.'
    },
    {
      title: 'Block injection attacks',
      href: '/docs/block-injection-attacks',
      icon: 'pi pi-filter',
      text: 'A SQL Injection rule set, with the blocks visible in events.'
    },
    {
      title: 'Tune false positives',
      href: '/docs/tune-false-positives',
      icon: 'pi pi-list-check',
      text: 'Turn WAF false positives into allowed rules.'
    },
    {
      title: 'Deny bad bots',
      href: '/docs/deny-bad-bots',
      icon: 'pi pi-microchip',
      text: 'Deny automated requests that score above your threshold.'
    },
    {
      title: 'Network blocklists',
      href: '/docs/network-blocklists',
      icon: 'pi pi-map',
      text: 'Drop unwanted traffic before it reaches your application.'
    },
    {
      title: 'Install TLS certificates',
      href: '/docs/install-tls-certificates',
      icon: 'pi pi-key',
      text: 'Upload a certificate and key, then check the handshake.'
    }
  ]
  const compliance = [
    {
      title: 'Shared Responsibility Model',
      href: '/docs/shared-responsibility-model',
      icon: 'pi pi-verified',
      text: 'What Azion covers, and what stays yours.'
    },
    {
      title: 'Governance, Risk and Compliance',
      href: '/docs/governance-risk-and-compliance',
      icon: 'pi pi-id-card',
      text: 'The tools and certifications behind your compliance work.'
    },
    {
      title: 'PCI DSS compliance',
      href: '/docs/pci-dss-compliance',
      icon: 'pi pi-wallet',
      text: 'PCI DSS 4.0 Level 1, and what it covers for cardholder data.'
    },
    {
      title: 'SOC compliance',
      href: '/docs/soc-compliance',
      icon: 'pi pi-lock',
      text: 'SOC 2 Type 2 and SOC 3 reports, twice a year.'
    },
    {
      title: 'Activity History',
      href: '/docs/activity-history',
      icon: 'pi pi-history',
      text: 'The audit trail: who changed what, and when.'
    },
    {
      title: 'Security Response Team',
      href: '/docs/security-response-team',
      icon: 'pi pi-users',
      text: 'Azion security specialists to analyze threats and investigate attacks.'
    }
  ]
  const followAlong = [
    {
      title: 'Release notes',
      href: '/docs/release-notes',
      icon: 'pi pi-megaphone',
      text: 'What changed in Azion products, as it ships.'
    },
    {
      title: 'Blog',
      href: 'https://www.azion.com/en/blog/',
      icon: 'pi pi-book',
      text: 'Engineering posts and how customers run on Azion.',
      link: 'Read the blog',
      target: '_blank' as const
    },
    {
      title: 'YouTube',
      href: 'https://www.youtube.com/aziontech',
      icon: 'pi pi-youtube',
      text: 'Walkthroughs, demos, and recorded sessions.',
      link: 'Watch on YouTube',
      target: '_blank' as const
    },
    {
      title: 'Discord',
      href: 'https://discord.gg/azion',
      icon: 'pi pi-discord',
      text: 'Ask questions and compare notes with other builders.',
      link: 'Join the Discord',
      target: '_blank' as const
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
    active-id="overview"
    :sections="sections"
    home="/docs"
  >
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
            href="/docs/get-started"
          />
          <CopyPromptButton :value="prompt" />
        </template>
        <template #note>
          The prompt hands your coding agent the CLI, live docs over MCP, and this project linked.
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
              Hand the Console to a coding agent, or drive it yourself: visually, from the terminal,
              or over the API.
            </p>
            <DocAgentCard
              :prompt="prompt"
              action-href="/docs/agent-setup"
            />
            <DocCardGroup :cols="3">
              <DocCard
                v-for="item in interfaces"
                :key="item.title"
                :title="item.title"
                :icon="item.icon"
                :link-label="item.link"
                :href="item.href"
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
                :href="item.href"
                >{{ item.text }}</DocCard
              >
              <div class="sm:col-span-2">
                <DocCard
                  title="Explore use cases"
                  icon="pi pi-sitemap"
                  href="/docs/use-cases"
                  >Validated designs that show how Azion products combine to solve each use case,
                  grouped by solution.</DocCard
                >
              </div>
            </DocCardGroup>
            <p>Also useful: <a href="/docs/observe">Observe</a></p>
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
                :href="item.href"
              />
            </DocCardGroup>
            <p>
              Also useful: <a href="/docs/get-started/first-deploy">First deploy</a>,
              <a href="/docs/frameworks-compatibility">Frameworks compatibility</a>
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
              Everything you need to protect applications, APIs, and the traffic that reaches them.
            </p>
            <DocCardGroup :cols="3">
              <DocCard
                v-for="item in attacks"
                :key="item.title"
                :title="item.title"
                :icon="item.icon"
                :href="item.href"
                >{{ item.text }}</DocCard
              >
            </DocCardGroup>
            <p>
              Reference, when you need the details:
              <a href="/docs/ddos-protection">DDoS Protection</a>,
              <a href="/docs/waf-rule-sets">WAF Rule Sets</a>,
              <a href="/docs/bot-manager">Bot Manager</a>
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
              What the platform covers, what stays with you, and where the evidence lives when an
              auditor asks for it.
            </p>
            <DocCardGroup :cols="3">
              <DocCard
                v-for="item in compliance"
                :key="item.title"
                :title="item.title"
                :icon="item.icon"
                :href="item.href"
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
              Release notes as things ship, plus the blog, the YouTube channel, and the Discord
              where questions get answered.
            </p>
            <DocCardGroup :cols="3">
              <DocCard
                v-for="item in followAlong"
                :key="item.title"
                :title="item.title"
                :icon="item.icon"
                :link-label="item.link"
                :target="item.target"
                :href="item.href"
                >{{ item.text }}</DocCard
              >
              <div class="lg:col-span-2">
                <DocCard
                  title="Style guide"
                  icon="pi pi-pencil"
                  href="/docs/style-guide"
                  >How Azion writes documentation: voice, structure, and conventions.</DocCard
                >
              </div>
            </DocCardGroup>
          </section>
        </div>
      </DocProse>
      <div class="mt-(--spacing-xxl)">
        <DocPagination :next="{ title: 'Agent setup', href: '/docs/agent-setup' }" />
      </div>
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
