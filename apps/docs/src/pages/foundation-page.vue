<script setup lang="ts">
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import FoundationDemo from '../components/foundation-demo.vue'
  import MarkdownParts from '../components/markdown-parts.vue'
  import TableOfContents from '../components/table-of-contents.vue'
  import TokensView from '../components/tokens-view.vue'
  import { cached, index, keys } from '../lib/data'
  import { FOUNDATIONS } from '../lib/foundations'
  import { messages } from '../lib/i18n'
  import type { MarkdownDoc } from '../lib/types'
  import NotFound from './not-found-page.vue'

  const route = useRoute()
  const t = messages

  const page = computed(() => FOUNDATIONS.find((item) => item.slug === route.params.slug))
  const doc = computed(() =>
    page.value?.markdown ? cached<MarkdownDoc>(keys.markdown(page.value.markdown)) : undefined
  )

  const toc = computed(() => doc.value?.toc ?? [])

  const llms = computed(() => (page.value ? index.foundationLlms[page.value.slug] : undefined))
  const metaActions = computed(() =>
    llms.value
      ? [
          {
            value: 'markdown',
            label: t.value.viewMarkdown,
            icon: 'az az-file',
            href: llms.value,
            target: '_blank' as const
          }
        ]
      : []
  )

  useHead({
    title: computed(() => (page.value ? `${page.value.title} — WebKit` : 'WebKit')),
    meta: [{ name: 'description', content: computed(() => page.value?.summary ?? '') }]
  })
</script>

<template>
  <NotFound v-if="!page" />
  <div
    v-else
    class="flex w-full gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <article class="flex min-w-0 flex-1 flex-col gap-(--spacing-xl)">
      <DocPageHeader
        :title="page.title"
        :description="page.summary"
        :breadcrumbs="[{ label: t.foundations, href: '/foundations' }, { label: page.title }]"
        :meta-actions="metaActions"
      />
      <TableOfContents
        :items="toc"
        compact
      />
      <FoundationDemo
        v-if="page.demo"
        :kind="page.demo"
      />
      <TokensView
        v-if="page.tokens"
        :kind="page.tokens"
      />
      <section
        v-if="doc"
        class="flex max-w-4xl flex-col gap-(--spacing-sm)"
      >
        <h2
          v-if="page.tokens"
          class="text-heading-md"
        >
          {{ doc.title }}
        </h2>
        <MarkdownParts :parts="doc.parts" />
      </section>
    </article>
    <TableOfContents :items="toc" />
  </div>
</template>
