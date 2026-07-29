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
    title: { type: String, default: '' },
    // Optional supporting line under the title.
    description: { type: String, default: '' },
    // Title scale: 'large' on a FIRST-LEVEL page — one the sidebar routes to
    // directly (Applications, Workloads, Edge DNS, Marketplace, …) — because
    // there the title is the page's entry point. 'small' everywhere below that:
    // detail tabs, create pages, settings sub-pages, drawer bodies, where the
    // breadcrumb already carries the context and the title only labels a
    // section of it. 'medium' is kept on the scale but no page uses it.
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
