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
  },
  content: {
    type: String,
    default: ''
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
    <pre class="font-code w-full h-auto text-wrap m-0 text-[13px] text-default leading-relaxed"><code class="font-code"><template v-if="content">{{ content }}</template><slot v-else /></code></pre>
  </div>
</template>
