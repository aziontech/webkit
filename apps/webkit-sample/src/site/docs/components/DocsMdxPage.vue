<script setup>
  // A documentation page written as MDX, rendered through the documentation layer.
  //
  // This is the SECOND way a docs page is built in this sample, and the one a real
  // docs site uses. `DocsHome` is hand-composed Vue because a landing page is a
  // designed object — bands, a hero, a card grid. A reading page is not: it is prose
  // with a few components in it, and an author should be able to write the whole thing
  // in one `.mdx` file and never touch a class. So everything below comes from
  // `@aziontech/webkit-docs`: `DocProse` carries the type scale and rhythm,
  // `DocMarkdown` parses the MDX subset and mounts the components it finds, and
  // `DocPageHeader` renders the title and deck the frontmatter already declared.
  //
  // THE MASTHEAD CARRIES THE TRAIL AND THE PAGE'S ACTIONS. Both used to live in a sticky
  // page bar of their own, pinned above the scroll by the shell — a second header band
  // whose only content was those two controls. So the page opened on a strip of chrome,
  // the trail sat a whole band away from the title it qualifies, and the bar's rule read
  // as the page's horizon before the masthead had drawn its own. They belong to the PAGE,
  // and the masthead is where a page says what it is: trail, title, deck, and then the
  // meta line — when it last changed, and what can be done with it.
  //
  // THE TITLE'S LINE IS THE TITLE'S. It carried a `Copy page` split button until the meta
  // line existed; two action regions in one masthead meant the reader had to look in two
  // places for the same kind of thing, and the bigger of the two competed with the h1 for
  // the eye. One region, at the quietest register the masthead has.
  //
  // The page renders the body only. The VIEW derives the rail from the same source
  // and owns the scrolling, because the scroll container is the shell's — see
  // AzionDocsFirstDeploy.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
  import DocPageHeader from '@aziontech/webkit-docs/doc-page-header'
  import DocPagination from '@aziontech/webkit-docs/doc-pagination'
  import DocProse from '@aziontech/webkit-docs/doc-prose'
  import { parseMdx } from '@aziontech/webkit-docs/mdx'
  import { computed } from 'vue'

  import { useDocsCrumbNav } from '../lib/docs-crumb-nav.js'
  import { useDocsPageActions } from '../lib/docs-page-actions.js'

  const props = defineProps({
    // The raw `.mdx` source, imported with `?raw`.
    source: { type: String, default: '' },
    // The ancestor trail, current page last — derived from the rail by the view.
    crumbs: { type: Array, default: () => [] },
    // The page before this one in reading order: { title, href }.
    previous: { type: Object, default: null },
    // The page after this one.
    next: { type: Object, default: null }
  })

  const parsed = computed(() => parseMdx(props.source))

  const title = computed(() => parsed.value.frontmatter.title ?? '')
  const description = computed(() => parsed.value.frontmatter.description ?? '')
  const lastUpdated = computed(() => parsed.value.frontmatter.lastUpdated ?? '')

  // A crumb is a real anchor, so the plain left click has to be taken into the app's own
  // router — otherwise stepping back up the trail reloads the whole SPA. Same split the
  // rail makes: modified clicks stay the browser's.
  const onCrumbNavigate = useDocsCrumbNav()

  // The markdown IS the page here, so every action operates on the exact source the body
  // was rendered from — no second copy of the text to keep in sync. It is wired HERE
  // rather than in the view because the controls it drives are the masthead's, and the
  // masthead is this component's.
  const { metaActions: META_ACTIONS, onMetaAction } = useDocsPageActions(() => props.source)
</script>

<template>
  <!-- THE COLUMN COMES FROM THE CONTAINER SYSTEM, not from a width typed here.
       `layout-column-content` is the docs MEASURE — the reading column, capped by line
       length rather than by payload — so retuning it is a token edit in
       @aziontech/theme, not a sweep through pages.

       The INLINE half of the boundary only, with the vertical owned here. That is
       the sanctioned split for a band that takes the page's side inset but not its
       vertical one, and the measure still resolves identically (the cap grows by the
       inset it now contains for `.layout-boundary-inline` exactly as for the full
       boundary). A docs page needs it because its title is a masthead, not a row of
       content: it opens on the SECTION step the prose below it already uses between
       h2s — a flat 56 to open a section and 48 to close one (see DocProse) — so the
       page's first landmark is separated from the chrome by as much air as its
       sections are from each other, and the column closes on the same 48 its last
       section ends on. The boundary step — sized for a console page whose heading
       sits directly under a tab bar — reads cramped here.

       THE INLINE STEP IS NOT SET HERE ANY MORE. It used to be retuned down to `md`
       (a flat 16) because the docs measure was 752px and the column never reached it —
       the two rails claim 556px, so a 24px-a-side boundary spent air the prose needed.
       The measure is 1024px now, so that pressure is gone, and the inset has a
       different job: it is what keeps every block of the page — masthead, prose,
       pagination — on one left and right edge. They all read
       `--layout-boundary-inline` from the shell's `<main>`, which declares it once as
       `xl` (24 → 32 → 48) — see DocsLayout. Overriding it here would silently unalign
       the masthead from the prose under it.

       THE COLUMN IS CARRIED PER BLOCK, not by the article, because one thing on the
       page does not take it: the masthead's RULE. A rule that stops at the column's
       inset reads as decoration under the title; run to the edge of the reading
       region it reads as the page's own horizon, which is what every h2 below it is
       subordinate to. So the rule sits on a full-bleed wrapper and the masthead
       inside it takes the column, which is what lands the rule on the region's edge
       and the title on the prose's. -->
  <article class="pb-12">
    <div class="border-b border-(--border-default) pt-(--spacing-md)">
      <DocPageHeader
        class="layout-column-content layout-boundary-inline"
        :title="title"
        :description="description"
        :last-updated="lastUpdated"
        :meta-actions="META_ACTIONS"
        @meta-action="onMetaAction"
      >
        <!-- ONE Breadcrumb, and the DESIGN SYSTEM makes it responsive. Below 768 it
             renders the first crumb, an overflow dropdown holding the middle of the
             trail, and the current page — every step still reachable, in the width a
             phone has.

             OPTICALLY COMPENSATED: the crumb is a hover pill with `px-(--spacing-xs)`, so
             left alone its LABEL starts 8px inside the column edge while the title below
             is flush with it — the trail reads indented against its own title. The
             negative margin is exactly the pill's own padding, so the ink lands on the
             column edge and the hover surface keeps its 8px, bleeding into the gutter
             where there is nothing to collide with.

             It is passed IN rather than left to the masthead's own `breadcrumb` prop
             because this trail routes: the built-in renders the same component, but a
             plain click on it would load the document instead of pushing the route. -->
        <template #breadcrumb>
          <Breadcrumb
            :items="crumbs"
            class="-ml-(--spacing-xs) min-w-0"
            @navigate="onCrumbNavigate"
          />
        </template>
      </DocPageHeader>
    </div>
    <DocProse class="layout-column-content layout-boundary-inline pt-14">
      <DocMarkdown :source="source" />
    </DocProse>
    <!-- Where to go when the page is finished. Reading order, not the tree: the rail
         says where this page sits, the pair says what comes next. -->
    <DocPagination
      v-if="previous || next"
      :previous="previous"
      :next="next"
      class="layout-column-content layout-boundary-inline pt-12"
    />
  </article>
</template>
