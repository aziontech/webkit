<script setup lang="ts">
  import DocPageHeader from '@aziontech/ui/doc-page-header'
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'

  import MarkdownParts from '../components/markdown-parts.vue'
  import TableOfContents from '../components/table-of-contents.vue'
  import { AI_DOC } from '../lib/ai-doc'
  import { cached, keys } from '../lib/data'
  import { messages } from '../lib/i18n'
  import type { MarkdownDoc } from '../lib/types'

  const t = messages
  const doc = computed(() => cached<MarkdownDoc>(keys.markdown(AI_DOC)))
  const toc = computed(() => doc.value?.toc ?? [])

  const metaActions = computed(() => [
    {
      value: 'markdown',
      label: t.value.viewMarkdown,
      icon: 'az az-file',
      href: `https://github.com/aziontech/webkit/blob/main/${AI_DOC}`,
      target: '_blank' as const
    }
  ])

  useHead({
    title: computed(() => `${t.value.forAi} — Brand`),
    meta: [{ name: 'description', content: computed(() => t.value.aiPageSummary) }]
  })
</script>

<template>
  <div
    class="flex w-full gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <article class="flex min-w-0 flex-1 flex-col gap-(--spacing-xl)">
      <DocPageHeader
        :title="t.forAi"
        :description="t.aiPageSummary"
        :breadcrumbs="[{ label: t.homeNav, href: '/' }, { label: t.forAi }]"
        :meta-actions="metaActions"
      />
      <TableOfContents
        :items="toc"
        compact
      />
      <section
        v-if="doc"
        class="flex max-w-4xl flex-col gap-(--spacing-sm)"
      >
        <MarkdownParts :parts="doc.parts" />
      </section>
    </article>
    <TableOfContents :items="toc" />
  </div>
</template>
