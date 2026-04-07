<script setup>
/**
 * CategoryCard - Link card for navigating between token categories
 * Used in the Colors overview for Background/Text/Border navigation
 */
defineProps({
  overline: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tokens: {
    type: String,
    required: true
  },
  storyId: {
    type: String,
    required: true
  }
})

function navigate(storyId) {
  const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
  if (channel) {
    channel.emit('selectStory', { storyId, viewMode: 'story' });
  }
}
</script>

<template>
  <button
    @click="navigate(storyId)"
    class="block w-full text-left p-5 border border-default rounded-lg cursor-pointer transition-colors duration-150 hover:border-primary bg-transparent"
  >
    <p class="text-overline-xs text-muted m-0 mb-1.5">{{ overline }}</p>
    <p class="text-heading-md text-default m-0 mb-2">{{ title }}</p>
    <p class="text-body-xs text-muted m-0 leading-relaxed">{{ description }}</p>
    <p class="text-body-xs text-muted m-0 mt-2 font-code">{{ tokens }}</p>
  </button>
</template>
