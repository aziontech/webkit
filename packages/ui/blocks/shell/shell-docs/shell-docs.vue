<script setup lang="ts">
  import Brand from '@aziontech/ui/brand'
  import Button from '@aziontech/ui/button'
  import DocCallToAction from '@aziontech/ui/doc-call-to-action'
  import DocHeading from '@aziontech/ui/doc-heading'
  import DocLayout, {
    type DocLayoutNavGroup,
    type DocLayoutSection
  } from '@aziontech/ui/doc-layout'
  import DocPageHeader from '@aziontech/ui/doc-page-header'
  import DocProse from '@aziontech/ui/doc-prose'
  import type { DocTableOfContentsGroup } from '@aziontech/ui/doc-table-of-contents'
  import Footer from '@aziontech/ui/footer'
  import IconButton from '@aziontech/ui/icon-button'
  import LanguageSelect from '@aziontech/ui/language-select'
  import StatusIndicator from '@aziontech/ui/status-indicator'
  import ThemeSwitcher from '@aziontech/ui/theme-switcher'
  import { useColorMode } from '@aziontech/ui/use-color-mode'
  import { provide, ref } from 'vue'

  import { ShellDocsInjectionKey } from './injection-key'
  import {
    sampleFooterColumns,
    sampleNavigation,
    sampleOutlineGroups,
    sampleSections,
    sampleSocials
  } from './sample'

  /** One column of footer links. */
  export interface ShellDocsFooterColumn {
    /** The column heading. */
    title: string
    /** The link labels, in reading order. */
    links: string[]
  }

  /** One social profile in the footer. */
  export interface ShellDocsSocial {
    /** Icon class of the platform. */
    icon: string
    /** Accessible name of the icon link. */
    label: string
    /** The profile URL. */
    href: string
  }

  export interface ShellDocsProps {
    /** The top-bar sections. Left out, the sample sections render. */
    sections?: DocLayoutSection[]
    /** The sidebar tree. Left out, the sample docs tree renders. */
    navigation?: DocLayoutNavGroup[]
    /** The link groups under the table of contents. Left out, the sample groups render. */
    outlineGroups?: DocTableOfContentsGroup[]
    /** The footer's link columns. Left out, the sample columns render. */
    footerColumns?: ShellDocsFooterColumn[]
    /** The footer's social profiles. Left out, the sample profiles render. */
    socials?: ShellDocsSocial[]
  }

  withDefaults(defineProps<ShellDocsProps>(), {
    sections: () => sampleSections,
    navigation: () => sampleNavigation,
    outlineGroups: () => sampleOutlineGroups,
    footerColumns: () => sampleFooterColumns,
    socials: () => sampleSocials
  })

  const slots = defineSlots<{
    /** The page body: the route's article; the sample guide stands in for RouterView. */
    default?(): unknown
  }>()

  const crumbs = [{ label: 'Functions', href: '/docs/functions' }, { label: 'Getting started' }]

  const pageId = ref('')
  provide(ShellDocsInjectionKey, pageId)
  const activeId = () => pageId.value || (slots.default ? '' : 'functions-getting-started')

  const { mode: theme } = useColorMode()

  const language = ref('en')
</script>

<template>
  <DocLayout
    :navigation="navigation"
    :active-id="activeId()"
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
            Open Functions in the console, select Create Function, paste your handler and save it.
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
        aria-label="Azion on GitHub (opens in a new tab)"
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
          home-href="/"
          home-aria-label="Azion home"
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

          <template #social>
            <IconButton
              v-for="social in socials"
              :key="social.label"
              variant="ghost"
              size="small"
              :icon="social.icon"
              :aria-label="`${social.label} (opens in a new tab)`"
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
            <LanguageSelect
              v-model="language"
              variant="ghost"
            />
          </template>

          <template #brand>
            <Brand size="small" />
          </template>
        </Footer>
      </div>
    </template>
  </DocLayout>
</template>
