<script setup>
  defineProps({
    /** Section title, rendered as the page's second heading level. */
    title: {
      type: String,
      required: true
    },
    /** Optional lede under the title; the default slot replaces it when rich text is needed. */
    description: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <div class="mb-(--spacing-lg) flex flex-col gap-(--spacing-xs)">
    <h2 class="m-0 text-heading-lg text-(--text-default)">
      {{ title }}
    </h2>
    <p
      v-if="description || $slots.default"
      class="m-0 max-w-(--container-3xl) text-body-md text-(--text-muted)"
    >
      <slot>{{ description }}</slot>
    </p>
  </div>
</template>
