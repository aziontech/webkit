<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import { computed } from 'vue'

  /**
   * One or more code samples of the same thing in different languages, rendered
   * on the webkit CodeBlock so the docs inherit its gutter, copy control and
   * syntax surface. A single sample renders as a plain block; several render as
   * the joined tab strip Mintlify calls a CodeGroup.
   */
  defineOptions({ name: 'DocCodeGroup' })

  /** One sample in the group. */
  export type DocCodeSample = {
    /** Tab label; falls back to the language. */
    label?: string
    /** Language id used for highlighting. */
    language?: string
    /** File name shown in the block header. */
    fileName?: string
    /** The source itself. */
    code: string
  }

  interface Props {
    /** The samples to render, in tab order. */
    samples?: DocCodeSample[]
    /** Shows the line-number gutter. */
    showLineNumbers?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    samples: () => [],
    showLineNumbers: false
  })

  const tabs = computed(() =>
    props.samples.map((sample, position) => ({
      label: sample.label || sample.language || `Tab ${position + 1}`,
      value: `sample-${position}`,
      code: sample.code,
      language: sample.language || 'text',
      fileName: sample.fileName
    }))
  )
</script>

<template>
  <div
    data-doc-block
    data-doc-chrome
    data-testid="doc-code-group"
    class="w-full"
  >
    <CodeBlock
      :tabs="tabs"
      :show-line-numbers="showLineNumbers"
    />
  </div>
</template>
