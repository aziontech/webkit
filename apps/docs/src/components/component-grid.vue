<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import { computed, ref } from 'vue'

  import { index } from '../lib/data'
  import { format, messages } from '../lib/i18n'
  import { CATEGORY_LEADS, componentGroups } from '../lib/nav'
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
      :description="`${index.components.length} components, each with its examples, API and guidelines.`"
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
    <nav
      v-if="groups.length > 1"
      :aria-label="t.jumpToCategory"
      class="-mx-(--spacing-md) overflow-x-auto border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs) md:sticky md:top-14 md:z-10 md:overflow-visible lg:-mx-(--spacing-xl) lg:px-(--spacing-xl)"
    >
      <ul class="flex gap-(--spacing-2xs) md:flex-wrap">
        <li
          v-for="group in groups"
          :key="group.id"
          class="shrink-0"
        >
          <a
            :href="`#category-${group.id}`"
            class="inline-flex min-h-8 items-center gap-(--spacing-2xs) rounded-(--shape-button) border border-(--border-default) px-(--spacing-xs) text-label-sm whitespace-nowrap text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none motion-reduce:transition-none"
          >
            {{ group.label }}
            <span class="text-body-xs text-(--text-muted)">{{ group.items.length }}</span>
          </a>
        </li>
      </ul>
    </nav>
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
              class="px-(--spacing-md) pt-(--spacing-sm) text-body-sm text-(--text-muted) md:hidden"
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
