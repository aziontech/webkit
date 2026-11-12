<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DocCta from '@aziontech/webkit/doc-cta'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
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
      label: 'Functions',
      items: [
        { id: 'functions-overview', label: 'Overview', to: '/docs/functions' },
        {
          id: 'functions-getting-started',
          label: 'Getting started',
          to: '/docs/functions/getting-started'
        },
        { id: 'functions-how-it-works', label: 'How it works', to: '/docs/functions/how-it-works' },
        { id: 'functions-examples', label: 'Examples', to: '/docs/functions/examples' },
        { id: 'functions-reference', label: 'Reference', to: '/docs/functions/reference' },
        { id: 'functions-limits', label: 'Limits', to: '/docs/functions/limits' },
        {
          id: 'functions-best-practices',
          label: 'Best practices',
          to: '/docs/functions/best-practices'
        },
        {
          id: 'functions-troubleshooting',
          label: 'Troubleshooting',
          to: '/docs/functions/troubleshooting'
        }
      ]
    }
  ]

  const crumbs = [{ label: 'Functions', href: '/docs/functions' }, { label: 'Getting started' }]

  const outline = [
    { id: 'prerequisites', text: 'Prerequisites', depth: 2 },
    { id: 'create-the-function', text: 'Create the function', depth: 2 },
    { id: 'instantiate-the-function', text: 'Instantiate it in your application', depth: 2 },
    { id: 'verify-the-response', text: 'Verify the response', depth: 2 },
    { id: 'next-steps', text: 'Next steps', depth: 2 }
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

  const theme = ref('dark')

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
      links: ['Docs', 'API Reference', 'Dev Tools', 'Release Notes', 'Marketplace', 'Status']
    },
    { title: 'Company', links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact'] }
  ]

  const socials = [
    { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
    {
      icon: 'pi pi-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    {
      icon: 'pi pi-youtube',
      label: 'Azion on YouTube',
      href: 'https://www.youtube.com/aziontech'
    },
    { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
    {
      icon: 'pi pi-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
    { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
  ]

  const languages = ['EN', 'PT-BR', 'ES']
  const language = ref('EN')
</script>

<template>
  <DocLayout
    :navigation="navigation"
    active-id="functions-getting-started"
    :sections="sections"
    home="/docs"
    :outline="outline"
    :outline-groups="outlineGroups"
  >
    <article
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-xxl)"
    >
      <DocPageHeader
        title="Getting started"
        description="Create a function, instantiate it in an application, and verify the response from the edge."
        :breadcrumb="crumbs"
      />
      <DocProse>
        <DocHeading
          id="prerequisites"
          :level="2"
          >Prerequisites</DocHeading
        >
        <p>An Azion account and an application that already answers on its Azion domain.</p>
        <DocHeading
          id="create-the-function"
          :level="2"
          >Create the function</DocHeading
        >
        <p>
          Open Functions in the console, select Create Function, paste the handler below and save
          it.
        </p>
        <DocHeading
          id="instantiate-the-function"
          :level="2"
          >Instantiate it in your application</DocHeading
        >
        <p>
          On the application's Functions tab, add an instance pointing at the function you just
          created.
        </p>
        <DocHeading
          id="verify-the-response"
          :level="2"
          >Verify the response</DocHeading
        >
        <p>Request the domain and read the header the function sets.</p>
        <DocHeading
          id="next-steps"
          :level="2"
          >Next steps</DocHeading
        >
        <p>Read the limits before you move a production route onto the function.</p>
      </DocProse>
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
          signature="compact"
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
            <a
              href="/"
              aria-label="Azion home"
              class="me-(--spacing-xs) hidden w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none lg:inline-flex"
            >
              <Brand size="small" />
            </a>
            <IconButton
              v-for="social in socials"
              :key="social.label"
              kind="transparent"
              size="small"
              :icon="social.icon"
              :ariaLabel="social.label"
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
                  <template #iconLeft>
                    <i
                      class="pi pi-globe text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </template>
                </Select.Trigger>
                <Select.Content>
                  <Select.Option
                    v-for="option in languages"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>
          </template>

          <template #brand>
            <a
              href="/"
              aria-label="Azion home"
              class="mx-auto inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
            >
              <Brand size="small" />
            </a>
          </template>
        </Footer>
      </div>
    </template>
  </DocLayout>
</template>
