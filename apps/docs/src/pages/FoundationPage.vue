<script setup lang="ts">
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import FoundationDemo from '../components/FoundationDemo.vue'
  import RawHtml from '../components/RawHtml.vue'
  import TokensView from '../components/TokensView.vue'
  import { cached, index, keys } from '../lib/data'
  import { FOUNDATIONS } from '../lib/foundations'
  import { messages } from '../lib/i18n'
  import type { MarkdownDoc } from '../lib/types'
  import NotFound from './NotFound.vue'

  const route = useRoute()
  const t = messages

  const page = computed(() => FOUNDATIONS.find((item) => item.slug === route.params.slug))
  const doc = computed(() =>
    page.value?.markdown ? cached<MarkdownDoc>(keys.markdown(page.value.markdown)) : undefined
  )

  const llms = computed(() => (page.value ? index.foundationLlms[page.value.slug] : undefined))
  const metaActions = computed(() =>
    llms.value
      ? [
          {
            value: 'markdown',
            label: t.value.viewMarkdown,
            icon: 'pi pi-file',
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
    class="flex w-full flex-col gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <DocPageHeader
      :title="page.title"
      :description="page.summary"
      :breadcrumb="[{ label: t.foundations, href: '/foundations' }, { label: page.title }]"
      :meta-actions="metaActions"
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
      <DocProse>
        <RawHtml :html="doc.html" />
      </DocProse>
    </section>
  </div>
</template>
