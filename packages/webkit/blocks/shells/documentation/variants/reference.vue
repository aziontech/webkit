<script setup>
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Diagram from '@aziontech/webkit/diagram'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocCta from '@aziontech/webkit/doc-cta'
  import DocFrame from '@aziontech/webkit/doc-frame'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPagination from '@aziontech/webkit/doc-pagination'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const sections = [
    { label: 'Reference', href: '/docs/reference' },
    { label: 'Guides', href: '/docs/guides' },
    { label: 'Dev tools', href: '/docs/dev-tools' }
  ]

  const navigation = [
    {
      label: 'Applications',
      items: [
        { id: 'applications-overview', label: 'Overview', href: '/docs/applications' },
        {
          id: 'applications-quickstart',
          label: 'Quickstart',
          href: '/docs/applications/quickstart'
        },
        {
          id: 'applications-how-it-works',
          label: 'How it works',
          href: '/docs/applications/how-it-works'
        },
        { id: 'applications-cache', label: 'Cache', href: '/docs/applications/cache' },
        { id: 'applications-limits', label: 'Limits', href: '/docs/applications/limits' },
        {
          id: 'applications-troubleshooting',
          label: 'Troubleshooting',
          href: '/docs/applications/troubleshooting'
        }
      ]
    }
  ]

  const theme = ref('system')

  const crumbs = [{ label: 'Applications', href: '/docs/applications' }, { label: 'Overview' }]

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
    { id: 'request-path', text: 'Request path', depth: 2 },
    { id: 'rule-structure', text: 'Rule structure', depth: 2 },
    { id: 'scope-and-limits', text: 'Scope and limits', depth: 2 },
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

  const ruleTabs = [
    {
      label: 'JSON',
      value: 'json',
      language: 'json',
      code: '{\n  "name": "Cache images",\n  "active": true,\n  "criteria": [[{ "variable": "${uri}", "operator": "starts_with", "argument": "/images" }]],\n  "behaviors": [{ "type": "set_cache_policy", "attributes": { "value": 1020 } }]\n}'
    }
  ]

  const scope = [
    { term: 'Phases', text: 'Request rules run before the origin, response rules after it.' },
    { term: 'Origins', text: 'A connector names where a request goes when the cache misses.' },
    { term: 'Functions', text: 'An instance runs your code on the request or the response.' },
    { term: 'Limits', text: 'Up to 1,000 rules per application, evaluated in order.' }
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
    active-id="applications-overview"
    :sections="sections"
    home="/docs"
    :outline="outline"
    :outline-groups="outlineGroups"
  >
    <article
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-xxl)"
    >
      <DocPageHeader
        title="Applications"
        description="Route requests to your origins, cache responses, and run code with the rules of an Application."
        :breadcrumb="crumbs"
        last-updated="2026-11-11"
        :meta-actions="metaActions"
      />
      <DocProse>
        <DocCallout kind="info">
          Rolling out: this page describes API v4. Accounts still on v3 keep the previous reference.
        </DocCallout>
        <p>
          An application holds the rules a <a href="/docs/workloads">workload</a> applies to every
          request: where it goes, what is cached and which
          <a href="/docs/functions">function</a> runs.
        </p>
        <div
          data-doc-chrome
          class="flex flex-wrap gap-(--spacing-sm)"
        >
          <Button
            label="Quickstart"
            kind="primary"
            size="medium"
            href="/docs/applications/quickstart"
          />
          <Button
            label="Applications reference"
            kind="secondary"
            size="medium"
            href="/docs/reference/applications"
          />
        </div>

        <DocHeading
          id="request-path"
          :level="2"
          >Request path</DocHeading
        >
        <DocFrame caption="A request through a workload, its firewall and its application">
          <Diagram name="applications" />
        </DocFrame>

        <DocHeading
          id="rule-structure"
          :level="2"
          >Rule structure</DocHeading
        >
        <p>
          Send the rule below to
          <code>POST /v4/workspace/applications/&lt;id&gt;/request_rules</code> to create it.
        </p>
        <CodeBlock
          :tabs="ruleTabs"
          default-value="json"
        />

        <DocHeading
          id="scope-and-limits"
          :level="2"
          >Scope and limits</DocHeading
        >
        <ul>
          <li
            v-for="item in scope"
            :key="item.term"
          >
            <strong>{{ item.term }}.</strong> {{ item.text }}
          </li>
        </ul>

        <DocHeading
          id="next-steps"
          :level="2"
          >Next steps</DocHeading
        >
        <DocCardGroup :cols="2">
          <DocCard
            title="Quickstart"
            icon="pi pi-bolt"
            href="/docs/applications/quickstart"
            >Create an application and bind it to a workload.</DocCard
          >
          <DocCard
            title="Rules Engine"
            icon="pi pi-sliders-h"
            href="/docs/applications/rules-engine"
            >Criteria and behaviors, phase by phase.</DocCard
          >
        </DocCardGroup>
      </DocProse>
      <DocPagination :next="{ title: 'Quickstart', href: '/docs/applications/quickstart' }" />
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
