<script setup lang="ts">
  import { type Component, computed, useAttrs } from 'vue'

  import { useAppNavigation } from '../../../composables/use-app-navigation'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { createDocMarkdownTags } from './lib/doc-markdown-tags'
  import { renderNodes } from './lib/render-doc-markdown'
  import { readDocMarkdown } from './parse-doc-markdown'

  defineOptions({ name: 'DocMarkdown', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      /** The page source: optional frontmatter, then Markdown with MDX component tags. */
      source?: string
      /** Replaces the component a block tag mounts, or adds a block tag, keyed by tag name. The tag's attributes become props. */
      components?: Record<string, Component>
    }>(),
    {
      source: '',
      components: () => ({})
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ common: en.common })
  const { follow } = useAppNavigation()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'doc-markdown')

  const tags = createDocMarkdownTags()

  const parsed = computed(() => readDocMarkdown(props.source, Object.keys(props.components)))

  const Body = () =>
    renderNodes(
      {
        testId: testId.value,
        newTab: t('common.newTab'),
        follow,
        overrides: props.components,
        tags
      },
      parsed.value.nodes,
      false
    )
</script>

<script lang="ts">
  export {
    type DocMarkdownHeading,
    type DocMarkdownParsed,
    parseDocMarkdown
  } from './parse-doc-markdown'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="w-full min-w-0"
  >
    <Body />
  </div>
</template>
