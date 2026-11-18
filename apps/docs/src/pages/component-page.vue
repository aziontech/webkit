<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import CopyText from '@aziontech/webkit/copy-text'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Tag from '@aziontech/webkit/tag'
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import ApiTable from '../components/api-table.vue'
  import ExampleCard from '../components/example-card.vue'
  import TableOfContents from '../components/table-of-contents.vue'
  import RawHtml from '../components/raw-html.vue'
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
  const dont = computed(() => doc.value?.spec['Constraints — DO NOT'] ?? '')

  const toc = computed(() => {
    if (!doc.value) return []
    const items = [{ id: 'usage', text: t.value.whenToUse, depth: 2 }]
    if (doc.value.examples.length) {
      items.push({ id: 'examples', text: t.value.examples, depth: 2 })
      for (const example of doc.value.examples)
        items.push({ id: anchor(example.name), text: example.name, depth: 3 })
    }
    if (doc.value.props.length || doc.value.events.length || doc.value.slots.length)
      items.push({ id: 'api', text: t.value.api, depth: 2 })
    if (doc.value.bestPractices.length || dont.value)
      items.push({
        id: 'do-dont',
        text: `${t.value.bestPractices} / ${t.value.constraints}`,
        depth: 2
      })
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

      <section
        id="usage"
        class="flex scroll-mt-20 flex-col gap-(--spacing-md)"
      >
        <DocProse>
          <RawHtml :html="doc.purpose" />
        </DocProse>
        <div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2">
          <Card
            key="use-when"
            v-if="doc.useWhen.length"
          >
            <template #header>
              <h2 class="flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)">
                {{ t.whenToUse }}
              </h2>
            </template>
            <ul class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm">
              <RawHtml
                v-for="line in doc.useWhen"
                :key="line"
                tag="li"
                :html="line"
              />
            </ul>
          </Card>
          <Card
            key="avoid-when"
            v-if="doc.avoidWhen.length"
          >
            <template #header>
              <h2 class="flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)">
                {{ t.whenNotToUse }}
              </h2>
            </template>
            <ul class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm">
              <RawHtml
                v-for="line in doc.avoidWhen"
                :key="line"
                tag="li"
                :html="line"
              />
            </ul>
          </Card>
        </div>
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
        v-if="doc.examples.length && doc.exampleDir"
        id="examples"
        class="flex scroll-mt-20 flex-col gap-(--spacing-xl)"
      >
        <h2 class="text-heading-md">{{ t.examples }}</h2>
        <ExampleCard
          v-for="example in doc.examples"
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
        v-if="doc.bestPractices.length || dont"
        id="do-dont"
        class="grid scroll-mt-20 grid-cols-1 gap-(--spacing-md) md:grid-cols-2"
      >
        <Card
          key="do"
          v-if="doc.bestPractices.length"
        >
          <template #header>
            <h2 class="flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)">
              <i
                class="az az-circle-check text-(--success)"
                aria-hidden="true"
              />
              {{ t.bestPractices }}
            </h2>
          </template>
          <ul class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm">
            <RawHtml
              v-for="line in doc.bestPractices"
              :key="line"
              tag="li"
              :html="line"
            />
          </ul>
        </Card>
        <Card
          key="dont"
          v-if="dont"
        >
          <template #header>
            <h2 class="flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)">
              <i
                class="az az-circle-x text-(--danger)"
                aria-hidden="true"
              />
              {{ t.constraints }}
            </h2>
          </template>
          <DocProse>
            <RawHtml :html="dont" />
          </DocProse>
        </Card>
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
