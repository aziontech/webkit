<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import CopyText from '@aziontech/webkit/copy-text'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Tag from '@aziontech/webkit/tag'
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import ApiTable from '../components/api-table.vue'
  import DoDont from '../components/do-dont.vue'
  import ExampleCard from '../components/example-card.vue'
  import RawHtml from '../components/raw-html.vue'
  import TableOfContents from '../components/table-of-contents.vue'
  import { componentMarkdown, copyText } from '../lib/copy'
  import { cached, index, keys } from '../lib/data'
  import { messages } from '../lib/i18n'
  import { categoryLabel } from '../lib/nav'
  import type { ComponentDoc } from '../lib/types'
  import NotFound from './not-found-page.vue'

  const route = useRoute()
  const t = messages

  const name = computed(() => {
    const value = route.params.name
    return (Array.isArray(value) ? value.join('/') : String(value ?? '')).replace(/\/+$/, '')
  })
  const item = computed(() => index.components.find((entry) => entry.name === name.value))
  const doc = computed(() => cached<ComponentDoc>(keys.component(name.value)))

  useHead({
    title: computed(() => (item.value ? `${item.value.title} — WebKit` : 'WebKit')),
    meta: [{ name: 'description', content: computed(() => item.value?.purpose ?? '') }]
  })

  const anchor = (value: string) => `example-${value.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`

  const importTabs = computed(() => [
    {
      label: 'Import',
      value: 'import',
      language: 'javascript',
      code: `import ${item.value?.title ?? ''} from '${doc.value?.import ?? ''}'`
    }
  ])

  const accessibility = computed(() => doc.value?.spec['Accessibility (WCAG 2.1 AA)'] ?? '')
  const rtl = computed(() => doc.value?.spec['Right-to-left'] ?? '')

  const firstExample = computed(() => doc.value?.examples[0])
  const moreExamples = computed(() => doc.value?.examples.slice(1) ?? [])

  const toc = computed(() => {
    if (!doc.value) return []
    const items: { id: string; text: string; depth: number }[] = []
    if (firstExample.value && doc.value.exampleDir)
      items.push({ id: anchor(firstExample.value.name), text: firstExample.value.name, depth: 2 })
    items.push({ id: 'usage', text: t.value.whenToUse, depth: 2 })
    if (moreExamples.value.length && doc.value.exampleDir) {
      items.push({ id: 'examples', text: t.value.moreExamples, depth: 2 })
      for (const example of moreExamples.value)
        items.push({ id: anchor(example.name), text: example.name, depth: 3 })
    }
    if (doc.value.props.length || doc.value.events.length || doc.value.slots.length)
      items.push({ id: 'api', text: t.value.api, depth: 2 })
    if (doc.value.bestPractices.length || doc.value.avoidPractices.length)
      items.push({
        id: 'do-dont',
        text: `${t.value.do} / ${t.value.dont}`,
        depth: 2
      })
    if (doc.value.purposeRest)
      items.push({ id: 'how-it-is-built', text: t.value.howItIsBuilt, depth: 2 })
    if (accessibility.value)
      items.push({ id: 'accessibility', text: t.value.accessibility, depth: 2 })
    if (rtl.value) items.push({ id: 'rtl', text: t.value.rightToLeftSection, depth: 2 })
    return items
  })

  const metaActions = computed(() => [
    {
      value: 'copy',
      label: t.value.copyForAi,
      icon: 'az az-copy',
      tip: 'Copy this page as Markdown, ready to paste into an assistant.'
    },
    ...(item.value?.llms
      ? [
          {
            value: 'markdown',
            label: t.value.viewMarkdown,
            icon: 'az az-file',
            href: item.value.llms,
            target: '_blank' as const
          }
        ]
      : [])
  ])

  async function onMetaAction(_event: MouseEvent, action: { value?: string }) {
    if (action.value !== 'copy' || !item.value || !doc.value) return
    await copyText(componentMarkdown(item.value, doc.value), item.value.llms)
  }
</script>

<template>
  <NotFound v-if="!item || !doc" />
  <div
    v-else
    class="flex w-full gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <article class="flex min-w-0 flex-1 flex-col gap-(--spacing-xl)">
      <DocPageHeader
        :title="item.title"
        :description="item.purpose"
        :breadcrumbs="[
          { label: t.components, href: '/components' },
          { label: categoryLabel(item.category) }
        ]"
        :meta-actions="metaActions"
        @action-click="onMetaAction"
      >
        <template #details>
          <div class="flex flex-wrap items-center gap-(--spacing-xs)">
            <Tag
              :label="item.surface"
              severity="neutral"
              size="small"
            />
            <Tag
              v-if="doc.structure"
              :label="doc.structure"
              severity="neutral"
              size="small"
            />
          </div>
        </template>
      </DocPageHeader>

      <div class="max-w-3xl">
        <CodeBlock
          :tabs="importTabs"
          default-value="import"
        />
      </div>

      <ExampleCard
        v-if="firstExample && doc.exampleDir"
        :dir="doc.exampleDir"
        :example="firstExample"
        :anchor="anchor(firstExample.name)"
        :heading-level="2"
      />

      <section
        id="usage"
        class="flex scroll-mt-20 flex-col gap-(--spacing-md)"
      >
        <DoDont
          type="usage"
          :do-items="doc.useWhen"
          :dont-items="doc.avoidWhen"
        />
        <div
          v-if="doc.related.length"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <h2 class="text-heading-xs">{{ t.related }}</h2>
          <ul class="flex list-disc flex-col gap-(--spacing-2xs) ps-(--spacing-md) text-body-sm">
            <RawHtml
              v-for="line in doc.related"
              :key="line"
              tag="li"
              :html="line"
            />
          </ul>
        </div>
      </section>

      <section
        v-if="moreExamples.length && doc.exampleDir"
        id="examples"
        class="flex scroll-mt-20 flex-col gap-(--spacing-xl)"
      >
        <h2 class="text-heading-md">{{ t.moreExamples }}</h2>
        <ExampleCard
          v-for="example in moreExamples"
          :key="example.file"
          :dir="doc.exampleDir"
          :example="example"
          :anchor="anchor(example.name)"
        />
      </section>

      <section
        v-if="doc.props.length || doc.events.length || doc.slots.length"
        id="api"
        class="flex scroll-mt-20 flex-col gap-(--spacing-md)"
      >
        <h2 class="text-heading-md">{{ t.api }}</h2>
        <template v-if="doc.props.length">
          <h3 class="text-heading-sm">{{ t.props }}</h3>
          <ApiTable
            :caption="`${item.title} ${t.props}`"
            :rows="doc.props"
            :columns="[
              { key: 'name', label: t.name, code: true },
              { key: 'type', label: t.type, code: true },
              { key: 'default', label: t.default, code: true },
              { key: 'doc', label: t.description, html: true }
            ]"
          />
        </template>
        <template v-if="doc.events.length">
          <h3 class="text-heading-sm">{{ t.events }}</h3>
          <ApiTable
            :caption="`${item.title} ${t.events}`"
            :rows="doc.events"
            :columns="[
              { key: 'name', label: t.name, code: true },
              { key: 'payload', label: t.payload, code: true },
              { key: 'notes', label: t.description, html: true }
            ]"
          />
        </template>
        <template v-if="doc.slots.length">
          <h3 class="text-heading-sm">{{ t.slots }}</h3>
          <ApiTable
            :caption="`${item.title} ${t.slots}`"
            :rows="doc.slots"
            :columns="[
              { key: 'name', label: t.name, code: true },
              { key: 'scope', label: t.scope, code: true },
              { key: 'notes', label: t.description, html: true }
            ]"
          />
        </template>
        <template v-if="doc.subcomponents.length">
          <h3 class="text-heading-sm">{{ t.subcomponents }}</h3>
          <ul class="flex flex-wrap gap-(--spacing-xs)">
            <li
              v-for="sub in doc.subcomponents"
              :key="sub.name"
              class="max-w-full min-w-0"
            >
              <CopyText
                :value="sub.import"
                size="small"
              />
            </li>
          </ul>
        </template>
      </section>

      <section
        v-if="doc.bestPractices.length || doc.avoidPractices.length"
        id="do-dont"
        class="scroll-mt-20"
      >
        <DoDont
          :do-items="doc.bestPractices"
          :dont-items="doc.avoidPractices"
        />
      </section>

      <section
        v-if="doc.purposeRest"
        id="how-it-is-built"
        class="scroll-mt-20"
      >
        <details class="group flex flex-col gap-(--spacing-sm)">
          <summary
            class="flex cursor-pointer list-none items-center gap-(--spacing-xs) rounded-(--shape-button) text-heading-md focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none [&::-webkit-details-marker]:hidden"
          >
            <i
              class="az az-chevron-down -rotate-90 text-label-md text-(--text-muted) transition-[rotate] duration-fast-02 ease-productive-entrance group-open:rotate-0 motion-reduce:transition-none rtl:rotate-90 rtl:group-open:rotate-0"
              aria-hidden="true"
            />
            {{ t.howItIsBuilt }}
          </summary>
          <DocProse class="pt-(--spacing-sm)">
            <RawHtml :html="doc.purposeRest" />
          </DocProse>
        </details>
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

      <section
        v-if="rtl"
        id="rtl"
        class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-md">{{ t.rightToLeftSection }}</h2>
        <DocProse>
          <RawHtml :html="rtl" />
        </DocProse>
      </section>
    </article>
    <TableOfContents :items="toc" />
  </div>
</template>
