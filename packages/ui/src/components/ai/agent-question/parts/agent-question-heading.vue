<script setup lang="ts">
  import { computed, ref } from 'vue'

  import MarkdownInline from '../../lib/markdown-inline'
  import { parseInline } from '../../lib/parse-markdown'

  defineOptions({ name: 'AgentQuestionHeading' })

  interface Props {
    /** Id of the heading, the card's accessible name. */
    titleId: string
    /** Id of the description, the card's accessible description. */
    descriptionId: string
    /** Heading text, with inline Markdown. */
    title: string
    /** Sentence under the heading, with inline Markdown; empty renders none. */
    description: string
    /** Test id of the card; the heading takes it as its prefix. */
    testId: string
    /** Extra utilities for the heading element. */
    titleClass?: string
  }

  const props = withDefaults(defineProps<Props>(), { titleClass: '' })

  const headingEl = ref<HTMLElement | null>(null)

  const titleNodes = computed(() => parseInline(props.title))
  const plainTitle = computed(() => {
    const [first] = titleNodes.value
    return titleNodes.value.length === 1 && first?.type === 'text' ? first.value : ''
  })
  const descriptionNodes = computed(() => parseInline(props.description))

  defineExpose({
    /** Moves focus to the heading. */
    focus: () => headingEl.value?.focus()
  })
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
    <h3
      :id="titleId"
      ref="headingEl"
      tabindex="-1"
      :data-testid="`${testId}__title`"
      :class="titleClass"
      class="m-0 text-heading-2xs text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
    >
      <template v-if="plainTitle">{{ plainTitle }}</template>
      <MarkdownInline
        v-else
        :nodes="titleNodes"
      />
    </h3>
    <p
      v-if="description"
      :id="descriptionId"
      class="m-0 text-body-sm text-(--text-muted)"
    >
      <MarkdownInline :nodes="descriptionNodes" />
    </p>
  </div>
</template>
