<script setup>
/**
 * SectionHeader - Section title with optional description
 * Used for major sections within documentation pages
 */
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'sm',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  marginBottom: {
    type: String,
    default: 'mb-12'
  }
})
</script>

<template>
  <div :class="marginBottom">
    <h2
      :class="[
        'text-default m-0 mb-2',
        {
          'text-heading-sm': size === 'sm',
          'text-heading-md': size === 'md',
          'text-heading-lg': size === 'lg'
        }
      ]"
    >
      {{ title }}
    </h2>
    <p
      v-if="description || $slots.default"
      class="text-body-sm text-muted m-0 max-w-[620px] leading-relaxed"
    >
      <slot>{{ description }}</slot>
    </p>
  </div>
</template>
