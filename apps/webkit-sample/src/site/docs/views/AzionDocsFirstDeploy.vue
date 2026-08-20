<script setup>
  // Routed docs example, the READING-PAGE shape: one `.mdx` file rendered end to end
  // by the documentation layer, inside the same docs shell the Get Started landing
  // uses. Between the two, the sample shows both ways a docs page gets built —
  // hand-composed Vue when the page is a designed object (a hero, card bands), MDX
  // when it is prose with components in it, which is most of a documentation site.
  //
  // EVERYTHING DOC-SHAPED COMES FROM THE LAYER, including the rail: `DocOnThisPage`
  // is the outline component, not a local list of anchors. It is presentation only —
  // it does not know which heading is active or how to reach one, because the PAGE
  // owns the scroll container. So this view supplies both, from the layer's own
  // pieces: `useScrollSpy` says which heading is in view, `scrollToHeading` takes the
  // reader to one inside the column that actually scrolls, and `provideHeadingNav`
  // hands that same function to every heading's own anchor. Rail and heading link
  // therefore land identically, which is the whole reason the nav is provided rather
  // than left to a native hash jump.
  //
  // The page contributes three things and the shell places all of them: the page bar
  // (breadcrumb + Copy page, pinned above the scroll), the body, and the rail. Its own
  // masthead is title + deck only — see DocsMdxPage.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import SplitButton from '@aziontech/webkit/split-button'
  import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'
  import { provideHeadingNav } from '@aziontech/webkit-docs/heading-nav'
  import { scrollToHeading } from '@aziontech/webkit-docs/heading-scroll'
  import { collectHeadings, parseMdx } from '@aziontech/webkit-docs/mdx'
  import { useScrollSpy } from '@aziontech/webkit-docs/use-scroll-spy'
  import { computed, ref } from 'vue'

  import DocsLayout from '../components/DocsLayout.vue'
  import DocsMdxPage from '../components/DocsMdxPage.vue'
  import SOURCE from '../content/first-deploy.mdx?raw'
  import { useDocsPageActions } from '../lib/docs-page-actions.js'
  import { docsRailGroups } from '../lib/docs-rail-groups.js'

  // One parse feeds the rail; the body parses the same source for itself. Deriving the
  // outline from the page's own markdown is what makes it impossible for the rail to
  // name a section the page does not have, or to miss one an author just added.
  const headings = computed(() => collectHeadings(parseMdx(SOURCE).nodes))

  // The rail's other half: the repository and the community. They are not the
  // page's outline, so the rail draws them flush under their own overlines rather
  // than indented among the headings — and the edit link addresses this page's
  // own markdown, which is why the groups are built from its source path.
  const RAIL_GROUPS = docsRailGroups('src/content/docs/en/pages/start/first-deploy.mdx')

  const body = ref(null)
  const { activeId } = useScrollSpy(body, headings)

  // The shell's `<main>` is the scroll container — the docs top bar and both rails are
  // fixed around it — so it, not the window, is what gets scrolled.
  const scroller = () => body.value?.closest('main') ?? null

  const goToHeading = (event, item) => scrollToHeading(scroller(), body.value, item.id, event)

  provideHeadingNav(goToHeading)

  // Reading order through the Start section, matching the rail's own order.
  const PREVIOUS = { title: 'Agent Setup', href: '/site/docs' }
  const NEXT = { title: 'Go live', href: '/site/docs' }

  const CRUMBS = [
    { label: 'Documentation', href: '/site/docs' },
    { label: 'Start', href: '/site/docs' },
    { label: 'First deploy', current: true }
  ]

  // The markdown IS the page here, so every action operates on the exact source the
  // body was rendered from — no second copy of the text to keep in sync.
  const {
    actions: PAGE_ACTIONS,
    label: copyLabel,
    icon: copyIcon,
    copyPage,
    onPageAction
  } = useDocsPageActions(() => SOURCE)
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

    <div ref="body">
      <DocsMdxPage
        :source="SOURCE"
        :previous="PREVIOUS"
        :next="NEXT"
      />
    </div>

    <template #toc>
      <DocOnThisPage
        :items="headings"
        :active-id="activeId"
        :groups="RAIL_GROUPS"
        class="sticky top-0"
        @select="goToHeading"
      />
    </template>
  </DocsLayout>
</template>
