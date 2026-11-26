<script setup lang="ts">
  import '../styles/full-utilities.css'

  import Card from '@aziontech/ui/card'
  import DocPageHeader from '@aziontech/ui/doc-page-header'
  import EmptyState from '@aziontech/ui/empty-state'
  import Input from '@aziontech/ui/input'
  import Link from '@aziontech/ui/link'
  import Tag from '@aziontech/ui/tag'
  import { computed, ref } from 'vue'

  import { index } from '../lib/data'
  import { format, messages } from '../lib/i18n'
  import { CATEGORY_LEADS, componentGroups } from '../lib/nav'
  import CategoryJump from './category-jump.vue'
  import LivePreview from './live-preview.vue'

  const t = messages
  const query = ref('')

  const byPath = new Map(index.components.map((item) => [`/components/${item.name}`, item]))

  const groups = computed(() => {
    const q = query.value.trim().toLowerCase()
    return componentGroups()
      .map((group) => ({
        ...group,
        id: group.id ?? group.label.toLowerCase().replace(/\s+/g, '-'),
        items: group.items
          .map((item) => ({ ...item, entry: byPath.get(item.to) }))
          .filter(
            (item) => !q || `${item.label} ${item.entry?.purpose ?? ''}`.toLowerCase().includes(q)
          )
      }))
      .filter((group) => group.items.length)
  })
</script>

<template>
  <div
    class="flex w-full flex-col gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <DocPageHeader
      :title="t.components"
      :description="format(t.componentsLead, { count: index.components.length })"
    />
    <div class="max-w-md">
      <Input
        v-model="query"
        :placeholder="t.filter"
        size="medium"
        :aria-label="t.filter"
      >
        <template #leading>
          <i
            class="az az-filter text-(--text-muted)"
            aria-hidden="true"
          />
        </template>
      </Input>
    </div>
    <CategoryJump
      :groups="
        groups.map((group) => ({ id: group.id, label: group.label, count: group.items.length }))
      "
    />
    <section
      v-for="group in groups"
      :key="group.label"
      class="flex scroll-mt-20 flex-col gap-(--spacing-sm) md:scroll-mt-40"
      :aria-labelledby="`category-${group.id}`"
    >
      <div class="flex flex-col gap-(--spacing-2xs)">
        <h2
          :id="`category-${group.id}`"
          class="flex items-baseline gap-(--spacing-xs) text-heading-sm"
        >
          {{ group.label }}
          <span class="text-body-sm text-(--text-muted)">{{
            format(t.categoryLead, { count: group.items.length })
          }}</span>
        </h2>
        <p
          v-if="CATEGORY_LEADS[group.id]"
          class="max-w-3xl text-body-sm text-(--text-muted)"
        >
          {{ CATEGORY_LEADS[group.id] }}
        </p>
      </div>
      <ul class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2 2xl:grid-cols-3">
        <li
          v-for="item in group.items"
          :key="item.to"
          class="flex min-w-0"
        >
          <Card
            :padded="false"
            class="w-full min-w-0 transition-colors duration-fast-02 ease-productive-entrance focus-within:border-(--border-strong) hover:border-(--border-strong) motion-reduce:transition-none"
          >
            <p
              class="line-clamp-2 px-(--spacing-md) pt-(--spacing-sm) text-body-sm text-(--text-muted) md:hidden"
            >
              {{ item.entry?.purpose }}
            </p>
            <div
              class="hidden h-48 overflow-auto bg-(--bg-canvas) p-(--spacing-md) [contain:layout_paint] md:block"
            >
              <LivePreview
                v-if="item.entry?.exampleDir && item.entry.firstExample"
                :dir="item.entry.exampleDir"
                :file="item.entry.firstExample"
              />
              <div
                v-else
                class="flex h-full items-center justify-center"
              >
                <p class="max-w-xs text-center text-body-sm text-(--text-muted)">
                  {{ item.entry?.purpose }}
                </p>
              </div>
            </div>
            <template #footer>
              <div class="flex w-full min-w-0 items-center justify-between gap-(--spacing-xs)">
                <Link
                  :href="item.to"
                  :label="item.label"
                  icon="az az-arrow-right"
                  size="small"
                  class="min-w-0"
                />
                <Tag
                  v-if="item.entry?.stability === 'preview'"
                  :label="t.stabilityPreview"
                  severity="info"
                  size="small"
                  class="ms-auto shrink-0"
                />
                <span
                  v-if="item.entry?.exampleCount"
                  class="shrink-0 text-body-xs text-(--text-muted)"
                  >{{ item.entry.exampleCount }} {{ t.examples.toLowerCase() }}</span
                >
              </div>
            </template>
          </Card>
        </li>
      </ul>
    </section>
    <EmptyState
      v-if="!groups.length"
      :title="t.noResults"
      icon="az az-filter"
      bordered
    />
  </div>
</template>
