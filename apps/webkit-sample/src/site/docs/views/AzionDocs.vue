<script setup>
  // Routed docs example: the Azion documentation's home ("Welcome to Azion Docs")
  // rendered inside the docs shell (docs top bar and the real documentation
  // sidebar, no console chrome). A landing page is scanned through its own card
  // grids, not through a heading list, so it passes no `toc` slot — DocsLayout then
  // renders no "On this page" rail and the content takes the full width.
  //
  // THE PAGE BAR COMES FROM HERE, not from the content component, exactly as it does
  // on the two reading pages: the breadcrumb and the "Copy page" control belong to the
  // shell's layout but to the page's data, so the view fills the shell's `page-bar`
  // slot and the shell decides it is pinned to the top of the scroll region. That is
  // what makes the home and a tutorial the same shape — the home's one difference is
  // the banner it opens on.
  //
  // The page is composed rather than written, so its markdown is a short outline of the
  // same sections the body renders — enough for a reader who hands the page to an
  // assistant, without a second copy of every card's sentence to keep in sync.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import SplitButton from '@aziontech/webkit/split-button'

  import DocsGetStarted from '../components/DocsGetStarted.vue'
  import DocsLayout from '../components/DocsLayout.vue'
  import { useDocsPageActions } from '../lib/docs-page-actions.js'

  const CRUMBS = [
    { label: 'Documentation', href: '/site/docs' },
    { label: 'Home', current: true }
  ]

  const PAGE_MARKDOWN =
    `# Welcome to Azion Docs\n\n` +
    `We make every application fast and reliable. Deploy on a global network, with ` +
    `enterprise-grade security and no cold starts.\n\n` +
    `## Start by objective\n\n## Start by interface\n\n` +
    `### Your AI agent, fluent in Azion\n\n## Ready-made templates\n\n` +
    `## Stop attacks\n\n## Assess risk and prove compliance\n\n## Follow along\n`

  // One SplitButton, because the control IS a split: the primary segment does the one
  // thing a reader wants most (the page as Markdown, on the clipboard) and the attached
  // menu carries the variants — the link, the raw markdown, and "ask <assistant> about
  // this page". One definition of that vendor list, the clipboard confirmation and the
  // markdown view, shared with every other docs page (docs-page-actions.js).
  const {
    actions: PAGE_ACTIONS,
    label: copyLabel,
    icon: copyIcon,
    copyPage,
    onPageAction
  } = useDocsPageActions(() => PAGE_MARKDOWN)
</script>

<template>
  <DocsLayout>
    <template #page-bar>
      <!-- The trail wraps rather than truncates, and a two-line trail would double a
           bar pinned for the whole scroll. Full trail from `md` up, the current page
           alone below it — where the only ancestor is "Documentation", which the
           shell's own brand already says. -->
      <Breadcrumb
        :items="CRUMBS"
        class="hidden min-w-0 flex-1 md:inline-flex"
      />
      <Breadcrumb
        :items="CRUMBS.slice(-1)"
        class="min-w-0 flex-1 md:hidden"
      />
      <SplitButton
        :label="copyLabel"
        :icon="copyIcon"
        :model="PAGE_ACTIONS"
        kind="outlined"
        size="small"
        class="shrink-0"
        @click="copyPage"
        @item-click="onPageAction"
      />
    </template>

    <DocsGetStarted />
  </DocsLayout>
</template>
