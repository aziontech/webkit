<script setup>
  // THE routed reading page — one view for every `.mdx` in `content/`.
  //
  // A documentation page is prose with components in it, which is most of a documentation
  // site, so it is written as MDX and rendered end to end by `@aziontech/webkit-docs`. This
  // view is the wiring that MDX cannot express, and it is written ONCE: the sample used to
  // carry a routed view per page repeating all of it with three constants changed.
  //
  // EVERYTHING DOC-SHAPED COMES FROM THE LAYER, including the rail: `DocOnThisPage` is the
  // outline component, not a local list of anchors. It is presentation only — it does not
  // know which heading is active or how to reach one, because the PAGE owns the scroll
  // container. So this view supplies both, from the layer's own pieces: `useScrollSpy` says
  // which heading is in view, `scrollToHeading` takes the reader to one inside the column
  // that actually scrolls, and `provideHeadingNav` hands that same function to every
  // heading's own anchor. Rail and heading link therefore land identically, which is the
  // whole reason the nav is provided rather than left to a native hash jump.
  //
  // The page contributes three things and the shell places all of them: the page bar
  // (breadcrumb + Copy page, pinned above the scroll), the body, and the rail. Its own
  // masthead is title + deck only — see DocsMdxPage.
  //
  // The trail and the previous/next pair are DERIVED FROM THE RAIL (see docs-pages.js), not
  // typed here: the tree already knows where a page sits and what is next to it.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import SplitButton from '@aziontech/webkit/split-button'
  import DocCta from '@aziontech/webkit-docs/doc-cta'
  import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'
  import { provideHeadingNav } from '@aziontech/webkit-docs/heading-nav'
  import { scrollToHeading } from '@aziontech/webkit-docs/heading-scroll'
  import { collectHeadings, parseMdx } from '@aziontech/webkit-docs/mdx'
  import { useScrollSpy } from '@aziontech/webkit-docs/use-scroll-spy'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import DocsLayout from '../components/DocsLayout.vue'
  import DocsMdxPage from '../components/DocsMdxPage.vue'
  import { useDocsPageActions } from '../lib/docs-page-actions.js'
  import { docsPageChrome, docsPageSource, docsPageSourcePath } from '../lib/docs-pages.js'
  import { docsRailGroups } from '../lib/docs-rail-groups.js'

  const route = useRoute()

  const slug = computed(() => String(route.params.page ?? ''))
  const source = computed(() => docsPageSource(slug.value))

  // One parse feeds the rail; the body parses the same source for itself. Deriving the
  // outline from the page's own markdown is what makes it impossible for the rail to name a
  // section the page does not have, or to miss one an author just added.
  const headings = computed(() => collectHeadings(parseMdx(source.value).nodes))

  const chrome = computed(() => docsPageChrome(route.path))

  // The rail's other half: the repository and the community. They are not the page's
  // outline, so the rail draws them flush under their own overlines rather than indented
  // among the headings — and the edit link addresses THIS page's own markdown, which the
  // page declares in its frontmatter.
  const railGroups = computed(() => docsRailGroups(docsPageSourcePath(slug.value)))

  const body = ref(null)
  const { activeId } = useScrollSpy(body, headings)

  // The shell's `<main>` is the scroll container — the docs top bar and both rails are
  // fixed around it — so it, not the window, is what gets scrolled.
  const scroller = () => body.value?.closest('main') ?? null

  const goToHeading = (event, item) => scrollToHeading(scroller(), body.value, item.id, event)

  provideHeadingNav(goToHeading)

  // The markdown IS the page here, so every action operates on the exact source the body was
  // rendered from — no second copy of the text to keep in sync.
  const {
    actions: PAGE_ACTIONS,
    label: copyLabel,
    icon: copyIcon,
    copyPage,
    onPageAction
  } = useDocsPageActions(() => source.value)
</script>

<template>
  <!-- Keyed on the slug so a move between two MDX pages REMOUNTS rather than re-rendering.
       The body element, the scroll-spy observer and the heading nav are all bound to one
       page's DOM; re-rendering in place would leave the spy watching headings that have been
       replaced and the reader halfway down the previous page's scroll. -->
  <DocsLayout :key="slug">
    <template #page-bar>
      <!-- The trail wraps rather than truncates, and a two-line trail would double a bar
           pinned for the whole scroll. Full trail from `md` up, the current page alone below
           it — where the only ancestor is "Documentation", which the shell's own brand
           already says. -->
      <!-- OPTICALLY COMPENSATED: the crumb is a hover pill with `px-(--spacing-xs)`, so left
           alone its LABEL starts 8px inside the column edge while the title below is flush
           with it — the trail reads indented against the whole page. The negative margin is
           exactly the pill's own padding, so the ink lands on the column edge and the hover
           surface keeps its 8px, bleeding into the gutter where there is nothing to collide
           with. -->
      <Breadcrumb
        :items="chrome.crumbs"
        class="hidden -ml-(--spacing-xs) min-w-0 flex-1 md:inline-flex"
      />
      <Breadcrumb
        :items="chrome.crumbs.slice(-1)"
        class="-ml-(--spacing-xs) min-w-0 flex-1 md:hidden"
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
        :source="source"
        :previous="chrome.previous"
        :next="chrome.next"
      />
    </div>

    <template #toc>
      <!-- Outline, then the complementary groups, then — at the FOOT of the column — the
           offer. The rail serves the page before it asks for anything, so the one commercial
           block on the screen is both the last thing in the order and the furthest thing
           from the reader's eye when they arrive. The wrapper claims the whole column
           (`flex-1`) so `mt-auto` has room to push against; the gap stays the floor between
           the two, for the case where a long outline fills it. -->
      <div class="flex flex-1 flex-col gap-(--spacing-xl)">
        <DocOnThisPage
          :items="headings"
          :active-id="activeId"
          :groups="railGroups"
          @select="goToHeading"
        />
        <DocCta
          class="mt-auto"
          label="Deploy your first application for free and scale as your traffic grows. No credit card required."
          primary-href="https://console.azion.com/signup"
          secondary-label="See our plans"
          secondary-href="https://www.azion.com/en/pricing/"
        />
      </div>
    </template>
  </DocsLayout>
</template>
