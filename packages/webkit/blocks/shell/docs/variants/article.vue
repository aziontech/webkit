<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocItem from '@aziontech/webkit/doc-item'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPreviousNext from '@aziontech/webkit/doc-previous-next'
  import DocPrompt from '@aziontech/webkit/doc-prompt'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocSteps from '@aziontech/webkit/doc-steps'
  import ItemList from '@aziontech/webkit/item-list'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'

  const crumbs = [
    { label: 'Fundamentals', href: '/docs/fundamentals' },
    { label: 'Get started', href: '/docs/get-started' },
    { label: 'First deploy' }
  ]

  const metaActions = [
    { value: 'copy', label: 'Copy as Markdown', icon: 'ai ai-copy' },
    { value: 'markdown', label: 'View as Markdown', icon: 'ai ai-eye' },
    {
      value: 'agent-setup',
      label: 'Agent setup',
      icon: 'ai ai-microchip-ai',
      href: '/docs/agent-setup'
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
      icon: 'ai ai-layout-grid',
      href: '/docs/applications',
      text: 'Route requests, cache responses and run code with rules.'
    },
    {
      title: 'Functions',
      icon: 'ai ai-code',
      href: '/docs/functions',
      text: 'Serverless code that runs close to your users.'
    },
    {
      title: 'Azion CLI',
      icon: 'ai ai-desktop',
      href: '/docs/azion-cli',
      text: 'Build and deploy from your terminal.'
    }
  ]
</script>

<template>
  <article
    class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-2xl)"
  >
    <DocPageHeader
      title="First deploy in a few minutes"
      description="By the end of this tutorial, an application will be live on the Azion Web Platform, answering HTTP 200 on its own Azion domain."
      :breadcrumbs="crumbs"
      last-updated="2026-11-11"
      :meta-actions="metaActions"
    />
    <DocProse>
      <p>
        Three complete paths get you there. Pick one; each ends with the same application live on
        its domain.
      </p>
      <DocCardGroup :columns="3">
        <DocCard
          title="Deploy a template"
          icon="ai ai-layout-grid"
          href="#deploy-a-template"
          >A ready-made project, live in a few clicks.</DocCard
        >
        <DocCard
          title="Import from GitHub"
          icon="ai ai-github"
          href="/docs/get-started/import-from-github"
          >Connect a repository; every push deploys.</DocCard
        >
        <DocCard
          title="Deploy with CLI"
          icon="ai ai-desktop"
          href="#deploy-with-cli"
          >Build and deploy from your terminal.</DocCard
        >
      </DocCardGroup>
      <DocCallout variant="tip">
        New to Azion? Start with the template: it needs no local tooling.
      </DocCallout>

      <DocHeading
        anchor="before-you-start"
        :level="2"
        >Before you start</DocHeading
      >
      <p>
        You need an Azion account. The CLI path also needs a terminal with
        <code>curl</code> and a project folder.
      </p>

      <DocHeading
        anchor="deploy-a-template"
        :level="2"
        >Deploy a template via Console</DocHeading
      >
      <DocCallout variant="info">
        Templates create the workload, the application and the domain for you.
      </DocCallout>
      <DocSteps>
        <DocSteps.Step title="Open Azion Console." />
        <DocSteps.Step title="Select + Create on the home page." />
        <DocSteps.Step title="Pick a template and fill in the fields it asks for." />
        <DocSteps.Step title="Select Deploy and wait for the status to read Live." />
      </DocSteps>
      <DocHeading
        anchor="test-the-template"
        :level="3"
        >Test it</DocHeading
      >
      <CodeBlock
        :tabs="testTabs"
        default-value="shell"
      />

      <DocHeading
        anchor="deploy-with-cli"
        :level="2"
        >Deploy with Azion CLI</DocHeading
      >
      <DocPrompt title="AI Assistant">
        Install the Azion CLI, link this folder as an Azion project and deploy it. Show me the
        domain when it is live.
      </DocPrompt>
      <DocSteps>
        <DocSteps.Step title="Set up the Azion CLI">
          <CodeBlock
            :tabs="installTabs"
            default-value="shell"
            :show-line-numbers="false"
          />
        </DocSteps.Step>
        <DocSteps.Step title="Log in and deploy">
          <CodeBlock
            :tabs="deployTabs"
            default-value="shell"
            :show-line-numbers="false"
          />
        </DocSteps.Step>
      </DocSteps>

      <DocHeading
        anchor="next-steps"
        :level="2"
        >Next steps</DocHeading
      >
      <DocCardGroup :columns="3">
        <DocCard
          title="Go live"
          icon="ai ai-globe"
          href="/docs/get-started/go-live"
          >Point your own domain at the workload.</DocCard
        >
        <DocCard
          title="Secure your application"
          icon="ai ai-shield"
          href="/docs/secure"
          >Add a firewall and WAF rules.</DocCard
        >
        <DocCard
          title="Observe your application"
          icon="ai ai-chart-line"
          href="/docs/observe"
          >Read metrics and events in real time.</DocCard
        >
      </DocCardGroup>

      <DocHeading
        anchor="related-resources"
        :level="2"
        >Related resources</DocHeading
      >
      <RegistrationFrame class="w-full bg-(--bg-surface)">
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
      </RegistrationFrame>
    </DocProse>
    <DocPreviousNext
      :previous="{ label: 'Create an account', href: '/docs/get-started/create-an-account' }"
      :next="{ label: 'Migrate to Azion', href: '/docs/get-started/migrate-to-azion' }"
    />
  </article>
</template>
