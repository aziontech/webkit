<script setup lang="ts">
  import CodeBlock, { type CodeBlockTab } from '../../code/code-block/code-block.vue'

  defineOptions({ name: 'SectionCodeWindow' })

  interface SectionCodeWindowProps {
    /** The files the window shows, one tab each. */
    tabs: CodeBlockTab[]
    /** Types the lines in as the window comes into view. */
    animated?: boolean
    /** Accessible name of the copy button. */
    copyAriaLabel?: string
  }

  withDefaults(defineProps<SectionCodeWindowProps>(), {
    animated: false,
    copyAriaLabel: ''
  })
</script>

<template>
  <div class="min-w-0 rounded-(--shape-control) shadow-(--shadow-sm)">
    <CodeBlock
      :tabs="tabs"
      show-line-numbers
      v-bind="{ animateLines: animated }"
      :copy-aria-label="copyAriaLabel || undefined"
    />
  </div>
</template>
