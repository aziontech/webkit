<script setup>
/**
 * CodeBlock - Code snippet display with optional label
 * Used for showing import statements, usage examples, etc.
 */
defineProps({
  label: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  }
})
</script>

<template>
  <div class="bg-surface border border-default rounded-lg p-5">
    <p
      v-if="label"
      class="text-body-xs text-muted m-0 mb-3 uppercase tracking-wider font-semibold"
    >
      {{ label }}
    </p>
    <pre class="font-code m-0 text-[13px] text-default leading-relaxed"><code class="font-code"><slot /></code></pre>
  </div>
</template>
