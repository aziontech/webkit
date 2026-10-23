<script setup>
  defineProps({
    /** Page title, the single first-level heading of a Foundations page. */
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
  <header class="mb-(--spacing-xl) flex flex-col gap-(--spacing-sm)">
    <h1 class="m-0 text-heading-xl text-(--text-default)">
      {{ title }}
    </h1>
    <p
      v-if="description || $slots.default"
      class="m-0 max-w-(--container-3xl) text-body-md text-(--text-muted)"
    >
      <slot>
        {{ description }}
      </slot>
    </p>
  </header>
</template>
