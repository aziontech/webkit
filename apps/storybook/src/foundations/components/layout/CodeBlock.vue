<script setup>
  /**
   * CodeBlock - Code snippet display with optional label
   * Used for showing import statements, usage examples, etc.
   */
  import { computed, ref } from 'vue'

  import CopyButton from '@aziontech/webkit/copy-button'

  const props = defineProps({
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

  const codeEl = ref(null)
  const copyValue = computed(() => props.content || codeEl.value?.textContent?.trim() || '')
</script>

<template>
  <div class="bg-surface border border-default rounded-lg p-5 relative">
    <p
      v-if="label"
      class="text-body-xs text-muted m-0 mb-3 uppercase tracking-wider font-semibold"
    >
      {{ label }}
    </p>
    <div class="absolute right-3 top-3">
      <CopyButton
        :value="copyValue"
        kind="outlined"
        ariaLabel="Copy code"
        copiedLabel="Copied"
      />
    </div>
    <pre
      class="font-code w-full h-auto text-wrap m-0 text-[13px] text-default leading-relaxed pr-10"
    ><code ref="codeEl" class="font-code"><template v-if="content">{{ content }}</template><slot v-else /></code></pre>
  </div>
</template>
