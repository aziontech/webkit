<script setup>
  // Reusable page heading block: the title over an optional supporting description
  // on the left, with the module's reference link and an optional `actions` slot for
  // the page's primary controls on the right.
  //
  // Every RESOURCE page carries one — a first-level module list (`size="medium"`)
  // as much as a settings sub-page (`size="small"`). On a list page the heading is
  // what names the page in its content and gives the module's create action one
  // fixed place, above the controls row that narrows the list
  // (./ControlsHeader.vue).
  //
  // Since the header bar's breadcrumb starts at the SECOND level
  // (../shell/AppLayout.vue), this heading is the ONLY place a first-level page's own
  // name appears in the content — including the two metric dashboards that carry no
  // list under it (Edge Pulse, Real-Time Metrics).
  //
  // Home is the one page that still doesn't use it: the content leads there, and the
  // rail's active item is the only name it needs. Neither does a page whose header
  // bottom is the full-bleed second-level nav bar (./PageTabs.vue): each tab is its
  // own page and heads itself.
  import HeadingAction from './HeadingAction.vue'

  defineProps({
    // The page title. A FIRST-LEVEL page always passes one: nothing in the chrome
    // names it any more — the bar's crumb begins at the second level — so omitting it
    // leaves the module named only by the rail's active row.
    //
    // A TAB VIEW under a second-level nav bar KEEPS its title: the tab bar is
    // navigation, not the page's heading, so the content still opens with the
    // heading that names it. Do not "de-duplicate" it against the tab label.
    title: { type: String, default: '' },
    // Optional supporting line under the title.
    description: { type: String, default: '' },
    // Title scale: 'medium' on a FIRST-LEVEL LIST page — one the sidebar routes
    // to directly (Applications, Workloads, Edge DNS, Object Storage, SQL
    // Database, Marketplace, Variables, Deployments, Personal Tokens, Forms) —
    // where the title names the collection the page lists and the content below
    // it (the table) is what the page is for. 'small' everywhere below that:
    // detail tabs, create pages, settings sub-pages, drawer bodies, where the
    // breadcrumb already carries the context and the title only labels a
    // section of it. 'large' is reserved for a page whose title IS the content —
    // the creation center's headline — not for list pages.
    size: {
      type: String,
      default: 'small',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    // Documentation URL for the MODULE this page heads. When set, a `Documentation`
    // action renders on the right, BEFORE anything in the `actions` slot — the
    // reference material a reader wants before creating, one place left of the create
    // button. Named to match SectionHeading's `documentation` prop, so both headings
    // ask for the same thing by the same name.
    //
    // It is a URL and not a boolean because the destination is per-module: every
    // first-level module already declares one in lib/data/product-empty-states.js
    // (`learnMore.href`, the same URL its first-use screen links), so a page passes
    // `firstUse.learnMore.href` rather than restating a link here.
    //
    // EVERY PAGE WHOSE CONTENT IS A LIST passes it, at any level — the first-level
    // module lists, and equally the tab pages whose content is a table (the account
    // panels, an application's Cache Settings / Rules Engine / Device Groups /
    // Functions Instances). A reader looking at a table they did not build is exactly
    // the reader who needs the reference, and which level of the tree they reached it
    // through is not their problem. Where the module has no registry entry the link
    // takes the docs root rather than a path nobody verified.
    //
    // What does NOT pass it is a BAND heading inside a detail page ("Active
    // Deployment", "Deployment topology" in WorkloadDetail): those title a section of
    // a page, not the page, and one Documentation action per band would be three on
    // one screen. Reference material for a single band is a SectionHeading
    // `documentation` link beside it (./SectionHeading.vue).
    documentation: { type: String, default: '' },
    // Label for it. `Documentation` — the affordance points at the module's reference
    // material, which is a thing with a name, not a plea for help.
    documentationLabel: { type: String, default: 'Documentation' },
    // Optional id on the <h1>, so a form/section can wire aria-labelledby to it.
    titleId: { type: String, default: undefined }
  })
</script>

<template>
  <!-- BELOW `md` THE HEADING IS A COLUMN. The trailing group is the widest thing on
       the row — a create label is prose ("Create Deployment Settings"), not a glyph —
       so on a phone the title and the description would each give up a third of the
       measure to keep it beside them, and wrap twice for the privilege. Stacked, the
       title gets the full width and the action gets its own row under it. -->
  <header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
    <div
      v-if="title || description"
      class="flex min-w-0 flex-col gap-(--spacing-xxs)"
    >
      <!-- The title row. `title-suffix` is for an affordance that belongs to the
           TITLE rather than to the page — a copy control on a page whose title is
           an id, which has to sit where the id is stated. Page-level controls go
           in `actions`, on the other side of the header. -->
      <div
        v-if="title"
        class="flex min-w-0 items-center gap-(--spacing-xs)"
      >
        <h1
          :id="titleId"
          :data-size="size"
          class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
        >
          {{ title }}
        </h1>
        <slot name="title-suffix" />
      </div>
      <p
        v-if="description"
        class="text-pretty text-body-sm text-(--text-muted)"
      >
        {{ description }}
      </p>
    </div>
    <!-- `actions` is the PAGE's action — the module's create button, first of all —
         and it is the page's only `large` (40px) control. The controls row under this
         one (./ControlsHeader.vue) runs at `medium`, so the size ladder says which is
         which: act on the module here, narrow the list there.

         THE CREATE BUTTON'S LABEL IS NOT A PER-PAGE CHOICE. A list the sidebar routes
         to reads `Create <object>`, the object lowercase because it is an instance and
         not the module ("Create workload", "Create network list", "Create bucket"); a
         list that is a TAB INSIDE a resource reads `Add <Product Module>` in that tab's
         exact capitalization ("Add Cache Settings", "Add Functions Instance"). Never a
         bare noun leaning on the plus icon, and never `New`. The page or drawer it opens
         repeats the same string as its title, so the act keeps one name from the click
         to the form. The rule and its reasons live in the webkit-microcopy skill § 5. -->
    <!-- `w-full flex-wrap` below `md` is what stacks the actions, WITHOUT this header
         counting them: a `w-full` item in a wrapping row cannot share a line, so every
         HeadingAction takes one of its own, while a natural-width utility control (a
         Refresh, a panel toggle, an ellipsis IconButton) still shares a line with its
         neighbours. Above `md` the group is back to one nowrap row that shrinks for
         nothing. -->
    <div
      v-if="documentation || $slots.actions"
      class="flex w-full flex-wrap items-center gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-nowrap"
    >
      <!-- DOCUMENTATION FIRST, so the create button keeps the outer edge: the page's
           action is what the corner is for, and a control that leaves the console must
           not sit where the eye goes for the primary one.
           It is a BUTTON, not a text link: on this row it is one of two things the
           reader can do with the module — read it or add to it — and the two read as a
           pair when they are the same shape. `outlined` beside `primary` is the pair
           the console already uses when a heading carries two actions (Edge DNS's
           "Copy nameserver values" beside "Create zone"). The BOOK glyph is what names
           it as reference material; it replaced the external-link arrow, which said
           only that the destination is elsewhere — true of every link, and not the
           useful half. The anchor is still real: `href` makes `Button` render an <a>,
           so middle-click and "copy link address" behave.
           Routed through ./HeadingAction.vue like every other action on this row, so
           it stacks and goes full width below `md` with them instead of being the one
           control that stays inline. -->
      <HeadingAction
        v-if="documentation"
        :label="documentationLabel"
        :href="documentation"
        icon="pi pi-book"
        kind="outlined"
        target="_blank"
      />
      <slot name="actions" />
    </div>
  </header>
</template>
