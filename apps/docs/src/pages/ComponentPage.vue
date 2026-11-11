<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Tag from '@aziontech/webkit/tag'
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import ApiTable from '../components/ApiTable.vue'
  import ExampleCard from '../components/ExampleCard.vue'
  import OnThisPage from '../components/OnThisPage.vue'
  import RawHtml from '../components/RawHtml.vue'
  import { componentMarkdown, copyText } from '../lib/copy'
  import { cached, index, keys } from '../lib/data'
  import { messages } from '../lib/i18n'
  import { titleCase } from '../lib/nav'
  import type { ComponentDoc } from '../lib/types'
  import NotFound from './NotFound.vue'

  const route = useRoute()
  const t = messages

  const name = computed(() => {
    const value = route.params.name
    return Array.isArray(value) ? value.join('/') : String(value ?? '')
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
      icon: 'pi pi-copy',
      tip: 'Copy this page as Markdown, ready to paste into an assistant.'
    },
    ...(item.value?.llms
      ? [
          {
            value: 'markdown',
            label: t.value.viewMarkdown,
            icon: 'pi pi-file',
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
        :breadcrumb="[
          { label: t.components, href: '/components' },
          { label: titleCase(item.category) }
        ]"
        :meta-actions="metaActions"
        @meta-action="onMetaAction"
      >
        <template #details>
          <div class="flex flex-wrap items-center gap-(--spacing-xs)">
            <Tag
              :label="item.surface"
              severity="secondary"
              size="small"
            />
            <Tag
              v-if="doc.structure"
              :label="doc.structure"
              severity="secondary"
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
          <div
            v-if="doc.useWhen.length"
            class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-md)"
          >
            <h2 class="mb-(--spacing-sm) text-heading-xs">{{ t.whenToUse }}</h2>
            <ul class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm">
              <RawHtml
                v-for="line in doc.useWhen"
                :key="line"
                tag="li"
                :html="line"
              />
            </ul>
          </div>
          <div
            v-if="doc.avoidWhen.length"
            class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-md)"
          >
            <h2 class="mb-(--spacing-sm) text-heading-xs">{{ t.whenNotToUse }}</h2>
            <ul class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm">
              <RawHtml
                v-for="line in doc.avoidWhen"
                :key="line"
                tag="li"
                :html="line"
              />
            </ul>
          </div>
        </div>
        <div
          v-if="doc.related.length"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <h2 class="text-heading-xs">{{ t.related }}</h2>
          <ul class="flex list-disc flex-col gap-(--spacing-xxs) ps-(--spacing-md) text-body-sm">
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
            >
              <code
                class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-label-code-sm"
                >{{ sub.import }}</code
              >
            </li>
          </ul>
        </template>
      </section>

      <section
        v-if="doc.bestPractices.length || dont"
        id="do-dont"
        class="grid scroll-mt-20 grid-cols-1 gap-(--spacing-md) md:grid-cols-2"
      >
        <div
          v-if="doc.bestPractices.length"
          class="rounded-(--shape-card) border border-(--success-border) p-(--spacing-md)"
        >
          <h2 class="mb-(--spacing-sm) flex items-center gap-(--spacing-xs) text-heading-xs">
            <i
              class="pi pi-check-circle text-(--success)"
              aria-hidden="true"
            />{{ t.bestPractices }}
          </h2>
          <ul class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm">
            <RawHtml
              v-for="line in doc.bestPractices"
              :key="line"
              tag="li"
              :html="line"
            />
          </ul>
        </div>
        <div
          v-if="dont"
          class="rounded-(--shape-card) border border-(--danger-border) p-(--spacing-md)"
        >
          <h2 class="mb-(--spacing-sm) flex items-center gap-(--spacing-xs) text-heading-xs">
            <i
              class="pi pi-times-circle text-(--danger)"
              aria-hidden="true"
            />{{ t.constraints }}
          </h2>
          <DocProse>
            <RawHtml :html="dont" />
          </DocProse>
        </div>
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
    <OnThisPage :items="toc" />
  </div>
</template>
