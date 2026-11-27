<script setup lang="ts">
  import DocCard from '@aziontech/ui/doc-card'
  import DocCardGroup from '@aziontech/ui/doc-card-group'
  import DocPageHeader from '@aziontech/ui/doc-page-header'
  import EmptyState from '@aziontech/ui/empty-state'
  import Input from '@aziontech/ui/input'
  import Tag from '@aziontech/ui/tag'
  import { computed, ref } from 'vue'

  import { BLOCK_THUMBNAIL } from '../lib/block-thumbnails'
  import { messages } from '../lib/i18n'
  import CategoryJump from './category-jump.vue'

  const props = defineProps<{
    title: string
    description: string
    groups: {
      label: string
      items: {
        title: string
        to: string
        text: string
        preview?: boolean
        image?: { light: string; dark: string }
      }[]
    }[]
  }>()

  const t = messages
  const query = ref('')

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return props.groups
    return props.groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(q))
      }))
      .filter((group) => group.items.length)
  })

  const groupId = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const jumps = computed(() =>
    filtered.value.map((group) => ({
      id: groupId(group.label),
      label: group.label,
      count: group.items.length
    }))
  )
</script>

<template>
  <div
    class="flex w-full flex-col gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <DocPageHeader
      :title="title"
      :description="description"
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
    <CategoryJump :groups="jumps" />
    <section
      v-for="group in filtered"
      :key="group.label"
      class="flex scroll-mt-20 flex-col gap-(--spacing-sm) md:scroll-mt-40"
      :aria-labelledby="`category-${groupId(group.label)}`"
    >
      <h2
        :id="`category-${groupId(group.label)}`"
        class="text-heading-sm"
      >
        {{ group.label }}
        <span class="text-body-sm text-(--text-muted)">{{ group.items.length }}</span>
      </h2>
      <DocCardGroup :columns="3">
        <DocCard
          v-for="item in group.items"
          :key="item.to"
          :title="item.title"
          :href="item.to"
        >
          <span
            v-if="item.image"
            data-docs-thumbnail
            class="mb-(--spacing-sm) block overflow-hidden rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface)"
          >
            <img
              :src="item.image.light"
              alt=""
              :width="BLOCK_THUMBNAIL.width"
              :height="BLOCK_THUMBNAIL.height"
              loading="lazy"
              decoding="async"
              class="block aspect-[8/5] h-auto w-full dark:hidden"
            />
            <img
              :src="item.image.dark"
              alt=""
              :width="BLOCK_THUMBNAIL.width"
              :height="BLOCK_THUMBNAIL.height"
              loading="lazy"
              decoding="async"
              class="hidden aspect-[8/5] h-auto w-full dark:block"
            />
          </span>
          <span class="flex flex-col items-start gap-(--spacing-2xs)">
            <Tag
              v-if="item.preview"
              :label="t.stabilityPreview"
              severity="info"
              size="small"
            />
            <span class="line-clamp-3">{{ item.text }}</span>
          </span>
        </DocCard>
      </DocCardGroup>
    </section>
    <EmptyState
      v-if="!filtered.length"
      :title="t.noResults"
      icon="az az-filter"
      bordered
      data-docs-empty
    />
  </div>
</template>
