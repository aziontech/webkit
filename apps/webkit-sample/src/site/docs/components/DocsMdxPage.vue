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
  // THE MASTHEAD CARRIES NEITHER A BREADCRUMB NOR COPY PAGE. Both are page-bar
  // concerns and the shell renders them once, above the scroll (see DocsLayout's
  // `page-bar` slot) — repeating them under the title would state the reader's
  // location twice on one screen and put two Copy controls a thumb apart.
  //
  // The page renders the body only. The VIEW derives the rail from the same source
  // and owns the scrolling, because the scroll container is the shell's — see
  // AzionDocsFirstDeploy.
  import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
  import DocPageHeader from '@aziontech/webkit-docs/doc-page-header'
  import DocPagination from '@aziontech/webkit-docs/doc-pagination'
  import DocProse from '@aziontech/webkit-docs/doc-prose'
  import { parseMdx } from '@aziontech/webkit-docs/mdx'
  import { computed } from 'vue'

  const props = defineProps({
    // The raw `.mdx` source, imported with `?raw`.
    source: { type: String, default: '' },
    // The page before this one in reading order: { title, href }.
    previous: { type: Object, default: null },
    // The page after this one.
    next: { type: Object, default: null }
  })

  const parsed = computed(() => parseMdx(props.source))

  const title = computed(() => parsed.value.frontmatter.title ?? '')
  const description = computed(() => parsed.value.frontmatter.description ?? '')
  const lastUpdated = computed(() => parsed.value.frontmatter.lastUpdated ?? '')
</script>

<template>
  <!-- THE COLUMN COMES FROM THE CONTAINER SYSTEM, not from a width typed here.
       `layout-column-docs` is the docs MEASURE — the reading column, capped by line
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
       different job: it is what makes the reading column line up with the page bar
       above it. Both read `--layout-boundary-inline` from the shell's `<main>`, which
       declares it once as `xl` (24 → 32 → 48) — see DocsLayout. Overriding it here
       would silently unalign the trail from the title. -->
  <article class="layout-column-docs layout-boundary-inline pt-14 pb-12">
    <DocPageHeader
      :title="title"
      :description="description"
      :last-updated="lastUpdated"
      :copyable="false"
    />
    <DocProse class="pt-14">
      <DocMarkdown :source="source" />
    </DocProse>
    <!-- Where to go when the page is finished. Reading order, not the tree: the rail
         says where this page sits, the pair says what comes next. -->
    <DocPagination
      v-if="previous || next"
      :previous="previous"
      :next="next"
      class="pt-12"
    />
  </article>
</template>
