<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DocCta from '@aziontech/webkit/doc-cta'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Fundamentals',
      items: [
        { id: 'overview', label: 'Overview', to: '/docs' },
        {
          id: 'get-started',
          label: 'Get started',
          defaultOpen: true,
          children: [
            { id: 'create-account', label: 'Create an account', to: '/docs/create-account' },
            { id: 'first-deploy', label: 'First deploy', to: '/docs/first-deploy' }
          ]
        }
      ]
    }
  ]

  const outline = [
    { id: 'before-you-start', text: 'Before you start', depth: 2 },
    { id: 'deploy-with-cli', text: 'Deploy with Azion CLI', depth: 2 },
    { id: 'next-steps', text: 'Next steps', depth: 2 }
  ]

  const theme = ref<ThemeSwitcherValue>('system')
</script>

<template>
  <DocLayout
    :navigation="navigation"
    :sections="[
      { label: 'Guides', to: '/docs' },
      { label: 'Reference', to: '/docs/reference' }
    ]"
    :outline="outline"
    active-id="first-deploy"
  >
    <template #actions>
      <Button
        label="Console"
        kind="secondary"
        size="medium"
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
        label="Deploy your first application for free."
        primary-label="Start for free"
        primary-href="https://console.azion.com/signup"
      />
    </template>

    <div class="layout-boundary">
      <div class="layout-column-content flex flex-col gap-(--spacing-lg)">
        <DocPageHeader
          title="First deploy"
          description="Deploy a template and see it served from the edge."
          :breadcrumb="[
            { label: 'Get started', href: '/docs/get-started' },
            { label: 'First deploy' }
          ]"
        />
        <DocProse>
          <DocHeading
            id="before-you-start"
            :level="2"
            >Before you start</DocHeading
          >
          <p>You need an Azion account and a GitHub account.</p>
          <DocHeading
            id="deploy-with-cli"
            :level="2"
            >Deploy with Azion CLI</DocHeading
          >
          <p>Install the CLI, log in and run the deploy command from your project folder.</p>
          <DocHeading
            id="next-steps"
            :level="2"
            >Next steps</DocHeading
          >
          <p>Add a domain and turn on the cache for your static assets.</p>
        </DocProse>
      </div>
    </div>
  </DocLayout>
</template>
