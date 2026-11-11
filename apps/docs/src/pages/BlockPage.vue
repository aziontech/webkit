<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useHead } from '@unhead/vue'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import BlockFrame from '../components/BlockFrame.vue'
  import CodeView from '../components/CodeView.vue'
  import OnThisPage from '../components/OnThisPage.vue'
  import RawHtml from '../components/RawHtml.vue'
  import { blockMarkdown, copyText } from '../lib/copy'
  import { cached, findBlock, index, keys } from '../lib/data'
  import { messages } from '../lib/i18n'
  import { titleCase } from '../lib/nav'
  import type { Highlighted, MarkdownDoc } from '../lib/types'
  import NotFound from './NotFound.vue'

  const route = useRoute()
  const t = messages

  const id = computed(() => {
    const value = route.params.id
    return Array.isArray(value) ? value.join('/') : String(value ?? '')
  })
  const block = computed(() => findBlock(id.value))
  const manifest = computed(() =>
    block.value
      ? cached<{ summary?: string; intents?: string[] }>(keys.blockManifest(block.value.dir))
      : undefined
  )
  const guidelines = computed(() =>
    block.value ? cached<MarkdownDoc>(keys.blockGuidelines(block.value.dir)) : undefined
  )

  const stateSlug = ref('')
  watch(
    block,
    (value) => {
      stateSlug.value = value?.states[0]?.slug ?? ''
    },
    { immediate: true }
  )
  const state = computed(() => block.value?.states.find((entry) => entry.slug === stateSlug.value))
  const source = computed(() =>
    block.value && state.value
      ? cached<Highlighted>(keys.blockSource(block.value.dir, state.value.file))
      : undefined
  )

  const uses = computed(() =>
    (block.value?.uses ?? []).map((name) => ({
      name,
      title: index.components.find((item) => item.name === name)?.title ?? name,
      linked: index.components.some((item) => item.name === name)
    }))
  )

  const installTabs = computed(() => [
    {
      label: 'CLI',
      value: 'cli',
      language: 'bash',
      code: `npx @aziontech/webkit add ${block.value?.id ?? ''}`
    }
  ])

  useHead({
    title: computed(() => (block.value ? `${block.value.title} — WebKit blocks` : 'WebKit')),
    meta: [{ name: 'description', content: computed(() => block.value?.summary ?? '') }]
  })

  const toc = computed(() => [
    { id: 'preview', text: t.value.preview, depth: 2 },
    { id: 'code', text: t.value.code, depth: 2 },
    ...(guidelines.value?.html ? [{ id: 'guidelines', text: t.value.guidelines, depth: 2 }] : [])
  ])

  const metaActions = computed(() => [
    {
      value: 'copy',
      label: t.value.copyForAi,
      icon: 'pi pi-copy',
      tip: 'Copy this block as Markdown, ready to paste into an assistant.'
    },
    ...(block.value?.llms
      ? [
          {
            value: 'markdown',
            label: t.value.viewMarkdown,
            icon: 'pi pi-file',
            href: block.value.llms,
            target: '_blank' as const
          }
        ]
      : [])
  ])

  async function onMetaAction(_event: MouseEvent, action: { value?: string }) {
    if (action.value !== 'copy' || !block.value) return
    await copyText(blockMarkdown(block.value, manifest.value?.summary ?? ''), block.value.llms)
  }
</script>

<template>
  <NotFound v-if="!block" />
  <div
    v-else
    class="flex w-full gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <article class="flex min-w-0 flex-1 flex-col gap-(--spacing-xl)">
      <DocPageHeader
        :title="block.title"
        :description="block.summary"
        :breadcrumb="[{ label: t.blocks, href: '/blocks' }, { label: titleCase(block.group) }]"
        :meta-actions="metaActions"
        @meta-action="onMetaAction"
      >
        <template #details>
          <div class="flex flex-wrap items-center gap-(--spacing-xs)">
            <Tag
              :label="block.surface"
              severity="secondary"
              size="small"
            />
            <Tag
              :label="`${block.states.length} ${t.states.toLowerCase()}`"
              severity="secondary"
              size="small"
            />
          </div>
        </template>
      </DocPageHeader>

      <div class="flex max-w-3xl flex-col gap-(--spacing-xs)">
        <h2 class="text-heading-xs">{{ t.install }}</h2>
        <CodeBlock
          :tabs="installTabs"
          default-value="cli"
        />
      </div>

      <div
        v-if="uses.length"
        class="flex flex-col gap-(--spacing-xs)"
      >
        <h2 class="text-heading-xs">{{ t.usedComponents }}</h2>
        <ul class="flex flex-wrap gap-(--spacing-xs)">
          <li
            v-for="item in uses"
            :key="item.name"
          >
            <a
              v-if="item.linked"
              :href="`/components/${item.name}`"
              class="inline-flex rounded-(--shape-elements) border border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
              >{{ item.title }}</a
            >
            <span
              v-else
              class="inline-flex rounded-(--shape-elements) border border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm"
              >{{ item.title }}</span
            >
          </li>
        </ul>
      </div>

      <section
        id="preview"
        class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-md">{{ t.preview }}</h2>
        <div
          v-if="block.states.length > 1"
          class="max-w-full overflow-x-auto"
        >
          <ToggleGroup
            v-model="stateSlug"
            :options="block.states.map((entry) => ({ label: entry.name, value: entry.slug }))"
            :aria-label="t.states"
            size="small"
          />
        </div>
        <BlockFrame
          v-if="state"
          :src="`/frame/${state.slug}/${block.id}/`"
          :title="`${block.title}: ${state.name}`"
        />
      </section>

      <section
        id="code"
        class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-md">{{ t.code }}</h2>
        <CodeView
          v-if="source && state"
          :source="source"
          :label="`blocks/${block.dir}/${state.file}`"
          tall
        />
      </section>

      <section
        v-if="guidelines?.html"
        id="guidelines"
        class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-md">{{ t.guidelines }}</h2>
        <DocProse>
          <RawHtml :html="guidelines.html" />
        </DocProse>
      </section>
    </article>
    <OnThisPage :items="toc" />
  </div>
</template>
