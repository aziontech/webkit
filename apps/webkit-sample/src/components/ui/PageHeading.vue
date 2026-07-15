<script setup>
  // Reusable page heading, modeled on the Account Settings header: a title over
  // an optional supporting description, with an optional `actions` slot on the
  // right for the page's primary controls. Shared by every module page so the
  // in-content heading reads the same everywhere.
  defineProps({
    // The page title.
    title: { type: String, required: true },
    // Optional supporting line under the title.
    description: { type: String, default: '' },
    // Title scale: 'large' for the top-level module (Home); 'small' for every
    // second-level page (modules, resources, settings). 'medium' is kept on the
    // scale but is not used by any page.
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
    <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
      <h1
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
