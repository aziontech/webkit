<script setup>
/**
 * PageHeader - Page title and description component
 * Used at the top of foundation documentation pages
 */
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <header class="mb-12">
    <h1 class="text-heading-xl text-default m-0 mb-3">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="text-body-md text-muted m-0 max-w-[620px] leading-relaxed"
    >
      <slot>
        {{ description }}
      </slot>
    </p>
  </header>
</template>
