<script setup>
/**
 * Card - Generic card component for documentation
 * Used for architecture diagrams, info boxes, etc.
 */
defineProps({
  overline: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: ''
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :class="[
      'p-5 border border-default rounded-lg',
      hoverable
        ? 'cursor-pointer no-underline transition-colors duration-150 hover:border-primary hover:bg-primary/5'
        : 'bg-surface/5'
    ]"
  >
    <p
      v-if="overline"
      class="text-overline-xs text-muted m-0 mb-1.5"
    >
      {{ overline }}
    </p>
    <h3
      v-if="title"
      :class="[
        'text-default m-0 mb-2',
        href ? 'text-heading-md' : 'text-body-sm font-semibold'
      ]"
    >
      {{ title }}
    </h3>
    <slot />
  </component>
</template>
