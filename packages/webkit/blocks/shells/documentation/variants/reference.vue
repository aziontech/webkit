<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Diagram from '@aziontech/webkit/diagram'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocCta from '@aziontech/webkit/doc-cta'
  import DocFrame from '@aziontech/webkit/doc-frame'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
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
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const sections = ['Reference', 'Guides', 'Dev tools']
  const theme = ref('system')

  const crumbs = [{ label: 'Applications', href: '#' }, { label: 'Overview' }]

  const metaActions = [
    { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy' },
    { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye' },
    { value: 'agent-setup', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '#' }
  ]

  const outline = [
    { id: 'request-path', text: 'Request path', depth: 2 },
    { id: 'rule-structure', text: 'Rule structure', depth: 2 },
    { id: 'scope-and-limits', text: 'Scope and limits', depth: 2 },
    { id: 'next-steps', text: 'Next steps', depth: 2 }
  ]
  const activeId = ref('request-path')

  const railGroups = [
    {
      label: 'GitHub',
      links: [
        { label: 'Azion Docs', href: 'https://github.com/aziontech', icon: 'pi pi-github' },
        { label: 'Contribute to this page', href: '#', icon: 'pi pi-pencil' }
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
                aria-label="Open documentation navigation"
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
          />
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
            href="#"
          />
        </GlobalHeader.Right>
      </GlobalHeader>
    </div>

    <div class="relative flex min-h-0 flex-1">
      <aside class="hidden h-full w-(--container-2xs) shrink-0 lg:flex">
        <Sidebar
          aria-label="Applications"
          class="w-full"
        >
          <template #footer>
            <ThemeSwitcher
              v-model="theme"
              aria-label="Theme"
            />
          </template>
          <MenuRoot role="presentation">
            <MenuGroup label="Applications">
              <MenuItem
                icon=""
                label="Overview"
                href="#"
                selected
              />
              <MenuItem
                icon=""
                v-for="page in ['Quickstart', 'How it works', 'Cache', 'Limits', 'Troubleshooting']"
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
                Rolling out: this page describes API v4. Accounts still on v3 keep the previous
                reference.
              </DocCallout>
              <p>
                An application holds the rules a <a href="#">workload</a> applies to every request:
                where it goes, what is cached and which <a href="#">function</a> runs.
              </p>
              <div
                data-doc-chrome
                class="flex flex-wrap gap-(--spacing-sm)"
              >
                <Button
                  label="Quickstart"
                  kind="primary"
                  size="medium"
                  href="#"
                />
                <Button
                  label="Applications reference"
                  kind="secondary"
                  size="medium"
                  href="#"
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
                Create a rule with
                <code>POST /v4/workspace/applications/&lt;id&gt;/request_rules</code>.
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
                  href="#"
                  >Create an application and bind it to a workload.</DocCard
                >
                <DocCard
                  title="Rules Engine"
                  icon="pi pi-sliders-h"
                  href="#"
                  >Criteria and behaviors, phase by phase.</DocCard
                >
              </DocCardGroup>
            </DocProse>
            <DocPagination :next="{ title: 'Quickstart', href: '#' }" />
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

      <aside
        class="hidden w-(--container-3xs) shrink-0 flex-col gap-(--spacing-lg) border-s border-(--border-default) px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-lg) xl:flex"
      >
        <DocOnThisPage
          :items="outline"
          :active-id="activeId"
          :groups="railGroups"
          @select="(event, item) => (activeId = item.id)"
        />
        <DocCta
          title="Ready to build?"
          primary-label="Start for free"
          primary-href="#"
          secondary-label="See our plans"
          secondary-href="#"
        >
          Deploy your first application in minutes.
        </DocCta>
      </aside>
    </div>
  </div>
</template>
