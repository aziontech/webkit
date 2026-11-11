<script setup>
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'
  import { ref } from 'vue'

  const sent = ref('')
  const items = [
    { id: 'ttl', label: 'What TTL should my images use?' },
    { id: 'wildcard', label: 'How do I purge a whole folder?' },
    { id: 'origin', label: 'Why does the origin still get requests?' }
  ]
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <SuggestionGroup
      :items="items"
      aria-label="Follow-up questions"
      @select="(item) => (sent = item.label)"
    />
    <p
      v-if="sent"
      class="text-body-sm text-(--text-muted)"
    >
      Sent: {{ sent }}
    </p>
  </div>
</template>
