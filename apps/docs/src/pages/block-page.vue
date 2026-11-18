<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useHead } from '@unhead/vue'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import BlockFrame from '../components/block-frame.vue'
  import CodeView from '../components/code-view.vue'
  import DoDont from '../components/do-dont.vue'
  import MarkdownParts from '../components/markdown-parts.vue'
  import OnThisPage from '../components/on-this-page.vue'
  import RawHtml from '../components/raw-html.vue'
  import { blockMarkdown, copyText } from '../lib/copy'
  import { cached, findBlock, index, keys } from '../lib/data'
  import { messages } from '../lib/i18n'
  import { titleCase } from '../lib/nav'
  import type { GuidelinesDoc, Highlighted } from '../lib/types'
  import NotFound from './not-found-page.vue'

  const route = useRoute()
  const t = messages

  const id = computed(() => {
    const value = route.params.id
    return (Array.isArray(value) ? value.join('/') : String(value ?? '')).replace(/\/+$/, '')
  })
  const block = computed(() => findBlock(id.value))
  const manifest = computed(() =>
    block.value
      ? cached<{
          summary?: string
          primary?: { file: string }
          variants?: { file: string; summary?: string }[]
        }>(keys.blockManifest(block.value.dir))
      : undefined
  )
  const guidelines = computed(() =>
    block.value ? cached<GuidelinesDoc>(keys.blockGuidelines(block.value.dir)) : undefined
  )

  const KNOWN = [
    'When to use',
    'When not to use',
    'Building blocks',
    'Do',
    "Don't",
    'Copy',
    'States',
    'Accessibility',
    'Related'
  ]
  const section = (heading: string) =>
    guidelines.value?.sections.find((entry) => entry.heading === heading)?.html ?? ''
  const slug = (value: string) => value.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()
  const extra = computed(() =>
    (guidelines.value?.sections ?? [])
      .filter((entry) => !KNOWN.includes(entry.heading))
      .map((entry) => ({ ...entry, id: `guide-${slug(entry.heading)}` }))
  )
  const useWhen = computed(() => section('When to use'))
  const avoidWhen = computed(() => section('When not to use'))
  const related = computed(() => section('Related'))
  const anatomy = computed(() => section('Building blocks'))
  const doList = computed(() => section('Do'))
  const dontList = computed(() => section("Don't"))
  const writing = computed(() => section('Copy'))
  const statesGuide = computed(() => section('States'))
  const accessibility = computed(() => section('Accessibility'))

  const stateSlug = ref('')
  watch(
    block,
    (value) => {
      stateSlug.value = value?.states[0]?.slug ?? ''
    },
    { immediate: true }
  )
  const state = computed(() => block.value?.states.find((entry) => entry.slug === stateSlug.value))
  const stateSummary = computed(() =>
    state.value && state.value.file !== manifest.value?.primary?.file
      ? (manifest.value?.variants?.find((entry) => entry.file === state.value?.file)?.summary ?? '')
      : ''
  )
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

  const toc = computed(() => {
    const items = [{ id: 'usage', text: t.value.whenToUse, depth: 2 }]
    items.push({ id: 'preview', text: t.value.preview, depth: 2 })
    items.push({ id: 'code', text: t.value.code, depth: 2 })
    if (uses.value.length || anatomy.value)
      items.push({ id: 'anatomy', text: t.value.anatomy, depth: 2 })
    for (const entry of extra.value) items.push({ id: entry.id, text: entry.heading, depth: 2 })
    if (doList.value || dontList.value)
      items.push({
        id: 'do-dont',
        text: `${t.value.bestPractices} / ${t.value.constraints}`,
        depth: 2
      })
    if (writing.value) items.push({ id: 'writing', text: t.value.writing, depth: 2 })
    if (statesGuide.value) items.push({ id: 'states', text: t.value.states, depth: 2 })
    if (accessibility.value)
      items.push({ id: 'accessibility', text: t.value.accessibility, depth: 2 })
    return items
  })

  const metaActions = computed(() => [
    {
      value: 'copy',
      label: t.value.copyForAi,
      icon: 'az az-copy',
      tip: 'Copy this block as Markdown, ready to paste into an assistant.'
    },
    ...(block.value?.llms
      ? [
          {
            value: 'markdown',
            label: t.value.viewMarkdown,
            icon: 'az az-file',
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
        :breadcrumbs="[{ label: t.blocks, href: '/blocks' }, { label: titleCase(block.group) }]"
        :meta-actions="metaActions"
        @action-click="onMetaAction"
      >
        <template #details>
          <div class="flex flex-wrap items-center gap-(--spacing-xs)">
            <Tag
              :label="block.surface"
              severity="neutral"
              size="small"
            />
            <Tag
              :label="`${block.states.length} ${t.states.toLowerCase()}`"
              severity="neutral"
              size="small"
            />
          </div>
        </template>
      </DocPageHeader>

      <div class="max-w-3xl">
        <CodeBlock
          :tabs="installTabs"
          default-value="cli"
        />
      </div>

      <section
        id="usage"
        class="flex scroll-mt-20 flex-col gap-(--spacing-md)"
      >
        <DocProse v-if="guidelines?.intro">
          <RawHtml :html="guidelines.intro" />
        </DocProse>
        <DoDont
          type="usage"
          :do-html="useWhen"
          :dont-html="avoidWhen"
        />
        <div
          v-if="related"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <h2 class="text-heading-xs">{{ t.related }}</h2>
          <DocProse>
            <RawHtml :html="related" />
          </DocProse>
        </div>
      </section>

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
        <RawHtml
          v-if="stateSummary"
          tag="p"
          :html="stateSummary"
          class="text-body-sm text-(--text-muted)"
        />
        <BlockFrame
          v-if="state"
          :src="`/frame/block/${block.id}/${state.slug}/`"
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
        v-if="uses.length || anatomy"
        id="anatomy"
        class="flex scroll-mt-20 flex-col gap-(--spacing-md)"
      >
        <h2 class="text-heading-md">{{ t.anatomy }}</h2>
        <template v-if="uses.length">
          <h3 class="text-heading-sm">{{ t.usedComponents }}</h3>
          <ul class="flex flex-wrap items-center gap-(--spacing-xs)">
            <li
              v-for="item in uses"
              :key="item.name"
            >
              <Button
                v-if="item.linked"
                :href="`/components/${item.name}`"
                :label="item.title"
                variant="outline"
                size="small"
              />
              <Tag
                v-else
                :label="item.title"
                severity="neutral"
              />
            </li>
          </ul>
        </template>
        <DocProse v-if="anatomy">
          <RawHtml :html="anatomy" />
        </DocProse>
      </section>

      <section
        v-for="entry in extra"
        :id="entry.id"
        :key="entry.id"
        class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-md">{{ entry.heading }}</h2>
        <MarkdownParts :parts="entry.parts" />
      </section>

      <section
        v-if="doList || dontList"
        id="do-dont"
        class="scroll-mt-20"
      >
        <DoDont
          :do-html="doList"
          :dont-html="dontList"
        />
      </section>

      <section
        v-if="writing"
        id="writing"
        class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-md">{{ t.writing }}</h2>
        <DocProse>
          <RawHtml :html="writing" />
        </DocProse>
      </section>

      <section
        v-if="statesGuide"
        id="states"
        class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-md">{{ t.states }}</h2>
        <DocProse>
          <RawHtml :html="statesGuide" />
        </DocProse>
      </section>

      <section
        v-if="accessibility"
        id="accessibility"
        class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-md">{{ t.accessibility }}</h2>
        <DocProse>
          <RawHtml :html="accessibility" />
        </DocProse>
      </section>
    </article>
    <OnThisPage :items="toc" />
  </div>
</template>
