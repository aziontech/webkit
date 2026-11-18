<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DocCallToAction from '@aziontech/webkit/doc-call-to-action'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'
  import { ref } from 'vue'

  defineSlots<{
    /** The page body: the route's article; the sample guide stands in for RouterView. */
    default(): unknown
  }>()

  const sections = [
    { label: 'Reference', href: '/docs/reference' },
    { label: 'Guides', href: '/docs/guides' },
    { label: 'Dev tools', href: '/docs/dev-tools' }
  ]

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Get started',
      items: [
        { id: 'overview', label: 'Overview', href: '/docs' },
        {
          id: 'get-started',
          label: 'Get started',
          type: 'inline',
          defaultOpen: true,
          children: [
            {
              id: 'create-an-account',
              label: 'Create an account',
              href: '/docs/get-started/create-an-account'
            },
            { id: 'first-deploy', label: 'First deploy', href: '/docs/get-started/first-deploy' }
          ]
        }
      ]
    },
    {
      label: 'Functions',
      items: [
        { id: 'functions-overview', label: 'Overview', href: '/docs/functions' },
        {
          id: 'functions-getting-started',
          label: 'Getting started',
          href: '/docs/functions/getting-started'
        },
        { id: 'functions-limits', label: 'Limits', href: '/docs/functions/limits' }
      ]
    },
    {
      label: 'Applications',
      items: [
        { id: 'applications-overview', label: 'Overview', href: '/docs/applications' },
        { id: 'applications-cache', label: 'Cache', href: '/docs/applications/cache' }
      ]
    },
    {
      label: 'Dev tools',
      items: [
        { id: 'azion-cli', label: 'Azion CLI', href: '/docs/dev-tools/cli' },
        {
          id: 'agent-setup-group',
          label: 'Agent setup',
          type: 'inline',
          defaultOpen: true,
          children: [
            { id: 'agent-setup', label: 'Overview', href: '/docs/agent-setup' },
            { id: 'claude-code', label: 'Claude Code', href: '/docs/agent-setup/claude-code' }
          ]
        }
      ]
    }
  ]

  const crumbs = [{ label: 'Functions', href: '/docs/functions' }, { label: 'Getting started' }]

  const outlineGroups = [
    {
      label: 'GitHub',
      links: [
        { label: 'Azion ShellDocs', href: 'https://github.com/aziontech', icon: 'az az-github' },
        {
          label: 'Contribute to this page',
          href: 'https://github.com/aziontech/azion',
          icon: 'az az-pencil'
        }
      ]
    },
    {
      label: 'Community',
      links: [
        { label: 'Discord', href: 'https://discord.gg/azion', icon: 'az az-discord' },
        { label: 'X', href: 'https://x.com/aziontech', icon: 'az az-x-brand' }
      ]
    }
  ]

  const { mode: theme } = useColorMode()

  const columns = [
    {
      title: 'Products',
      links: [
        'Functions',
        'Cache',
        'Object Storage',
        'SQL Database',
        'WAF',
        'Edge DNS',
        'Data Stream'
      ]
    },
    {
      title: 'Solutions',
      links: [
        'Web Apps',
        'AI',
        'Application Security',
        'Financial Services',
        'Retail',
        'Technology'
      ]
    },
    {
      title: 'Developers',
      links: ['ShellDocs', 'API Reference', 'Dev Tools', 'Release Notes', 'Marketplace', 'Status']
    },
    { title: 'Company', links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact'] }
  ]

  const socials = [
    { icon: 'az az-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
    {
      icon: 'az az-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    {
      icon: 'az az-youtube',
      label: 'Azion on YouTube',
      href: 'https://www.youtube.com/aziontech'
    },
    { icon: 'az az-x-brand', label: 'Azion on X', href: 'https://x.com/aziontech' },
    {
      icon: 'az az-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    { icon: 'az az-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
    { icon: 'az az-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
  ]

  const languages = ['EN', 'PT-BR', 'ES']
  const language = ref('EN')
</script>

<template>
  <DocLayout
    :navigation="navigation"
    :sections="sections"
    home="/docs"
    :outline-groups="outlineGroups"
  >
    <slot>
      <article
        class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-2xl)"
      >
        <DocPageHeader
          title="Getting started"
          description="Create a function, instantiate it in an application, and verify the response from the edge."
          :breadcrumbs="crumbs"
        />
        <DocProse>
          <DocHeading
            anchor="prerequisites"
            :level="2"
            >Prerequisites</DocHeading
          >
          <p>An Azion account and an application that already answers on its Azion domain.</p>
          <DocHeading
            anchor="create-the-function"
            :level="2"
            >Create the function</DocHeading
          >
          <p>
            Open Functions in the console, select Create Function, paste the handler below and save
            it.
          </p>
          <DocHeading
            anchor="instantiate-the-function"
            :level="2"
            >Instantiate it in your application</DocHeading
          >
          <p>
            On the application's Functions tab, add an instance pointing at the function you just
            created.
          </p>
          <DocHeading
            anchor="verify-the-response"
            :level="2"
            >Verify the response</DocHeading
          >
          <p>Request the domain and read the header the function sets.</p>
          <DocHeading
            anchor="next-steps"
            :level="2"
            >Next steps</DocHeading
          >
          <p>Read the limits before you move a production route onto the function.</p>
        </DocProse>
      </article>
    </slot>

    <template #actions>
      <IconButton
        icon="az az-github"
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
            v-for="column in columns"
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

          <template #social>
            <IconButton
              v-for="social in socials"
              :key="social.label"
              variant="ghost"
              size="small"
              :icon="social.icon"
              :aria-label="social.label"
              :href="social.href"
              target="_blank"
            />
          </template>

          <template #status>
            <StatusIndicator
              severity="success"
              label="All systems operational"
            />
          </template>

          <template #language>
            <div class="w-28">
              <Select
                v-model="language"
                placeholder="Language"
              >
                <Select.Trigger aria-label="Language">
                  <template #leading>
                    <i
                      class="az az-globe text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </template>
                </Select.Trigger>
                <Select.Content>
                  <Select.Item
                    v-for="option in languages"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
          </template>

          <template #brand>
            <a
              href="/"
              aria-label="Azion home"
              class="inline-flex w-fit items-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
            >
              <Brand size="small" />
            </a>
          </template>
        </Footer>
      </div>
    </template>
  </DocLayout>
</template>
