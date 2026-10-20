<script setup>
  import SectionHeader from './SectionHeader.vue'

  defineProps({
    /** Section title. */
    title: {
      type: String,
      required: true
    },
    /** Optional lede under the title; the `description` slot replaces it for rich text. */
    description: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <section class="mb-(--spacing-xxl) last:mb-0">
    <SectionHeader :title="title">
      <slot
        v-if="$slots.description"
        name="description"
      />
      <template v-else-if="description">{{ description }}</template>
    </SectionHeader>
    <slot />
  </section>
</template>
