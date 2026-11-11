<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import CodeBlock from '../../code/code-block/code-block.vue'

  defineOptions({ name: 'DocCodeGroup', inheritAttrs: false })

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
    /** The samples, in tab order: one renders a plain block, several render a joined tab strip. */
    samples?: DocCodeSample[]
    /** Shows the line-number gutter. */
    showLineNumbers?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    samples: () => [],
    showLineNumbers: false
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-code-group'
  )

  const tabs = computed(() =>
    props.samples.map((sample, position) => ({
      label: sample.label || sample.language || `${position + 1}`,
      value: `sample-${position}`,
      code: sample.code,
      language: sample.language || 'text',
      fileName: sample.fileName
    }))
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-doc-block
    data-doc-chrome
    :data-testid="testId"
    class="w-full"
  >
    <CodeBlock
      v-if="tabs.length"
      :tabs="tabs"
      :show-line-numbers="showLineNumbers"
    />
  </div>
</template>
