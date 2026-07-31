<script setup>
  // Reusable page heading block for SECOND-LEVEL pages (module / list / settings
  // pages): the title over an optional supporting description on the left, with
  // an optional `actions` slot for the page's primary controls on the right.
  // Home doesn't use it — there the module name lives in the collapsible header
  // crumb and the content leads.
  defineProps({
    // The page title. Omit on a `collapsible` module page, where the module
    // name is surfaced as the header breadcrumb crumb instead — printing it
    // here too would duplicate it.
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
    // Optional id on the <h1>, so a form/section can wire aria-labelledby to it.
    titleId: { type: String, default: undefined }
  })
</script>

<template>
  <header class="flex items-start justify-between gap-[var(--spacing-md)]">
    <div
      v-if="title || description"
      class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]"
    >
      <h1
        v-if="title"
        :id="titleId"
        :data-size="size"
        class="text-balance text-[var(--text-default)] data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-pretty text-body-sm text-[var(--text-muted)]"
      >
        {{ description }}
      </p>
    </div>
    <div
      v-if="$slots.actions"
      class="flex shrink-0 items-center gap-[var(--spacing-xs)]"
    >
      <slot name="actions" />
    </div>
  </header>
</template>
