<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import CodeBlock, { type CodeBlockKind } from '../../code/code-block/code-block.vue'
  import { languageName } from '../../code/code-block/utils/language-name'

  defineOptions({ name: 'DocCodeGroup', inheritAttrs: false })

  /** One sample in the group. */
  export type DocCodeSample = {
    /** Tab label, and the block's label header when the group has one sample; falls back to the language name (Shell, JavaScript). */
    label?: string
    /** Language id used for highlighting and for the label. */
    language?: string
    /** File name shown in the block header. */
    fileName?: string
    /** The source itself: only what the reader runs or reads, never what a command prints. */
    code: string
    /** What the command prints, drawn under it in a separate muted "Output" block with no copy control. */
    output?: string
  }

  interface Props {
    /** The samples, in tab order: one renders a plain block, several render a joined tab strip. */
    samples?: DocCodeSample[]
    /** Shows the line-number gutter. */
    showLineNumbers?: boolean
    /** Shows the label header (the sample label or the language name) on a single sample. */
    showLabel?: boolean
    /** What the samples hold: `code` the reader runs, or `output` — what a command prints — drawn muted under an "Output" label, without a copy control. */
    kind?: CodeBlockKind
  }

  const props = withDefaults(defineProps<Props>(), {
    samples: () => [],
    showLineNumbers: false,
    showLabel: true,
    kind: 'code'
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-code-group'
  )

  const tabs = computed(() =>
    props.samples.map((sample, position) => ({
      label: sample.label || (sample.language ? languageName(sample.language) : `${position + 1}`),
      value: `sample-${position}`,
      code: sample.code,
      language: sample.language || 'text',
      fileName: sample.fileName,
      output: sample.output
    }))
  )

  const active = ref<string | undefined>(undefined)

  watch(
    tabs,
    (next) => {
      if (!next.some((tab) => tab.value === active.value)) active.value = next[0]?.value
    },
    { immediate: true }
  )

  const output = computed(() => tabs.value.find((tab) => tab.value === active.value)?.output ?? '')

  const outputTabs = computed(() =>
    output.value ? [{ label: 'Output', value: 'output', code: output.value, language: 'text' }] : []
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-doc-block
    data-doc-chrome
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <CodeBlock
      v-if="tabs.length"
      key="code"
      v-model="active"
      :tabs="tabs"
      :kind="kind"
      :show-label="showLabel"
      :show-line-numbers="showLineNumbers"
      :data-testid="`${testId}__code`"
    />
    <CodeBlock
      v-if="outputTabs.length"
      key="output"
      :tabs="outputTabs"
      kind="output"
      :show-line-numbers="false"
      :data-testid="`${testId}__output`"
    />
  </div>
</template>
