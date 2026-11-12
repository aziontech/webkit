<script setup>
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocCta from '@aziontech/webkit/doc-cta'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocItem from '@aziontech/webkit/doc-item'
  import DocLayout from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPagination from '@aziontech/webkit/doc-pagination'
  import DocPrompt from '@aziontech/webkit/doc-prompt'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
  import Footer from '@aziontech/webkit/footer'
  import FrameBox from '@aziontech/webkit/frame-box'
  import IconButton from '@aziontech/webkit/icon-button'
  import ItemList from '@aziontech/webkit/item-list'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const sections = [
    { label: 'Reference', to: '/docs/reference' },
    { label: 'Guides', to: '/docs/guides' },
    { label: 'Dev tools', to: '/docs/dev-tools' }
  ]

  const navigation = [
    {
      label: 'Fundamentals',
      items: [
        { id: 'overview', label: 'Overview', to: '/docs/fundamentals' },
        {
          id: 'how-azion-works',
          label: 'How Azion works',
          to: '/docs/fundamentals/how-azion-works'
        },
        {
          id: 'get-started',
          label: 'Get started',
          kind: 'inline',
          defaultOpen: true,
          children: [
            {
              id: 'create-an-account',
              label: 'Create an account',
              to: '/docs/get-started/create-an-account'
            },
            { id: 'first-deploy', label: 'First deploy', to: '/docs/get-started/first-deploy' },
            {
              id: 'migrate-to-azion',
              label: 'Migrate to Azion',
              to: '/docs/get-started/migrate-to-azion'
            }
          ]
        },
        { id: 'billing', label: 'Billing', to: '/docs/fundamentals/billing' },
        { id: 'security', label: 'Security', to: '/docs/fundamentals/security' }
      ]
    }
  ]

  const theme = ref('system')

  const crumbs = [
    { label: 'Fundamentals', href: '/docs/fundamentals' },
    { label: 'Get started', href: '/docs/get-started' },
    { label: 'First deploy' }
  ]

  const metaActions = [
    { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy' },
    { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye' },
    {
      value: 'agent-setup',
      label: 'Agent setup',
      icon: 'pi pi-microchip-ai',
      href: '/docs/agent-setup'
    }
  ]

  const outline = [
    { id: 'before-you-start', text: 'Before you start', depth: 2 },
    { id: 'deploy-a-template', text: 'Deploy a template via Console', depth: 2 },
    { id: 'test-the-template', text: 'Test it', depth: 3 },
    { id: 'deploy-with-cli', text: 'Deploy with Azion CLI', depth: 2 },
    { id: 'next-steps', text: 'Next steps', depth: 2 },
    { id: 'related-resources', text: 'Related resources', depth: 2 }
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
    },
    {
      label: 'Community',
      links: [
        { label: 'Discord', href: 'https://discord.gg/azion', icon: 'pi pi-discord' },
        { label: 'X', href: 'https://x.com/aziontech', icon: 'ai ai-x' }
      ]
    }
  ]

  const testTabs = [
    {
      label: 'Shell',
      value: 'shell',
      language: 'bash',
      code: 'curl -I https://<your-azion-domain>',
      output: 'HTTP/2 200'
    }
  ]
  const installTabs = [
    {
      label: 'Shell',
      value: 'shell',
      language: 'bash',
      code: 'curl -fsSL https://cli.azion.app/install.sh | bash'
    }
  ]
  const deployTabs = [
    { label: 'Shell', value: 'shell', language: 'bash', code: 'azion login\nazion deploy' }
  ]

  const related = [
    {
      title: 'Applications',
      icon: 'pi pi-th-large',
      href: '/docs/applications',
      text: 'Route requests, cache responses and run code with rules.'
    },
    {
      title: 'Functions',
      icon: 'pi pi-code',
      href: '/docs/functions',
      text: 'Serverless code that runs close to your users.'
    },
    {
      title: 'Azion CLI',
      icon: 'pi pi-desktop',
      href: '/docs/azion-cli',
      text: 'Build and deploy from your terminal.'
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
    active-id="first-deploy"
    :sections="sections"
    home="/docs"
    :outline="outline"
    :outline-groups="outlineGroups"
  >
    <article
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-xxl)"
    >
      <DocPageHeader
        title="First deploy in a few minutes"
        description="By the end of this tutorial, an application will be live on the Azion Web Platform, answering HTTP 200 on its own Azion domain."
        :breadcrumb="crumbs"
        last-updated="2026-11-11"
        :meta-actions="metaActions"
      />
      <DocProse>
        <p>
          Three complete paths get you there. Pick one; each ends with the same application live on
          its domain.
        </p>
        <DocCardGroup :cols="3">
          <DocCard
            title="Deploy a template"
            icon="pi pi-th-large"
            href="#deploy-a-template"
            >A ready-made project, live in a few clicks.</DocCard
          >
          <DocCard
            title="Import from GitHub"
            icon="pi pi-github"
            href="/docs/get-started/import-from-github"
            >Connect a repository; every push deploys.</DocCard
          >
          <DocCard
            title="Deploy with CLI"
            icon="pi pi-desktop"
            href="#deploy-with-cli"
            >Build and deploy from your terminal.</DocCard
          >
        </DocCardGroup>
        <DocCallout kind="tip">
          New to Azion? Start with the template: it needs no local tooling.
        </DocCallout>

        <DocHeading
          id="before-you-start"
          :level="2"
          >Before you start</DocHeading
        >
        <p>
          You need an Azion account. The CLI path also needs a terminal with
          <code>curl</code> and a project folder.
        </p>

        <DocHeading
          id="deploy-a-template"
          :level="2"
          >Deploy a template via Console</DocHeading
        >
        <DocCallout kind="info">
          Templates create the workload, the application and the domain for you.
        </DocCallout>
        <DocSteps>
          <DocStep title="Open Azion Console." />
          <DocStep title="Select + Create on the home page." />
          <DocStep title="Pick a template and fill in the fields it asks for." />
          <DocStep title="Select Deploy and wait for the status to read Live." />
        </DocSteps>
        <DocHeading
          id="test-the-template"
          :level="3"
          >Test it</DocHeading
        >
        <CodeBlock
          :tabs="testTabs"
          default-value="shell"
        />

        <DocHeading
          id="deploy-with-cli"
          :level="2"
          >Deploy with Azion CLI</DocHeading
        >
        <DocPrompt title="AI Assistant">
          Install the Azion CLI, link this folder as an Azion project and deploy it. Show me the
          domain when it is live.
        </DocPrompt>
        <DocSteps>
          <DocStep title="Set up the Azion CLI">
            <CodeBlock
              :tabs="installTabs"
              default-value="shell"
              :show-line-numbers="false"
            />
          </DocStep>
          <DocStep title="Log in and deploy">
            <CodeBlock
              :tabs="deployTabs"
              default-value="shell"
              :show-line-numbers="false"
            />
          </DocStep>
        </DocSteps>

        <DocHeading
          id="next-steps"
          :level="2"
          >Next steps</DocHeading
        >
        <DocCardGroup :cols="3">
          <DocCard
            title="Go live"
            icon="pi pi-globe"
            href="/docs/get-started/go-live"
            >Point your own domain at the workload.</DocCard
          >
          <DocCard
            title="Secure your application"
            icon="pi pi-shield"
            href="/docs/secure"
            >Add a firewall and WAF rules.</DocCard
          >
          <DocCard
            title="Observe your application"
            icon="pi pi-chart-line"
            href="/docs/observe"
            >Read metrics and events in real time.</DocCard
          >
        </DocCardGroup>

        <DocHeading
          id="related-resources"
          :level="2"
          >Related resources</DocHeading
        >
        <FrameBox class="w-full bg-(--bg-surface)">
          <ItemList>
            <DocItem
              v-for="item in related"
              :key="item.title"
              :title="item.title"
              :icon="item.icon"
              :href="item.href"
              >{{ item.text }}</DocItem
            >
          </ItemList>
        </FrameBox>
      </DocProse>
      <DocPagination
        :previous="{ title: 'Create an account', href: '/docs/get-started/create-an-account' }"
        :next="{ title: 'Migrate to Azion', href: '/docs/get-started/migrate-to-azion' }"
      />
    </article>

    <template #actions>
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
