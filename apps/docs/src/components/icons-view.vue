<script setup lang="ts">
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Slider from '@aziontech/webkit/slider'
  import assets from 'virtual:docs-assets'
  import { computed, ref } from 'vue'

  import { format, messages } from '../lib/i18n'
  import { copyValue } from '../lib/tokens'
  import type { IconAsset } from '../lib/types'

  const t = messages
  const query = ref('')
  const size = ref(24)

  const matches = (icon: IconAsset, q: string) =>
    !q || icon.name.includes(q) || icon.keywords.toLowerCase().includes(q)

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return assets.icons.filter((icon) => matches(icon, q))
  })

  const sets = computed(() =>
    [
      { id: 'azionicons', title: t.value.iconsAzion, lead: t.value.iconsAzionLead, prefix: 'ai-' },
      { id: 'color', title: t.value.iconsColor, lead: t.value.iconsColorLead, prefix: 'ai-' }
    ].map((set) => ({
      ...set,
      total: assets.icons.filter((icon) => icon.set === set.id).length,
      icons: filtered.value.filter((icon) => icon.set === set.id)
    }))
  )
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <div class="flex flex-wrap items-center gap-(--spacing-md)">
      <div class="w-full max-w-md">
        <Input
          v-model="query"
          :placeholder="t.iconsSearch"
          :aria-label="t.iconsSearch"
          size="medium"
        >
          <template #prefix>
            <i
              class="ai ai-search text-(--text-muted)"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <div class="flex w-full max-w-xs items-center gap-(--spacing-sm)">
        <span class="shrink-0 text-label-sm text-(--text-muted)">{{ t.iconsSize }}</span>
        <Slider
          v-model="size"
          :min="12"
          :max="64"
          :step="4"
          unit="px"
          :aria-label="t.iconsSize"
          class="flex-1"
        />
        <code class="w-12 shrink-0 text-end text-label-code-sm text-(--text-muted)"
          >{{ size }}px</code
        >
      </div>
      <p
        class="text-body-sm text-(--text-muted)"
        aria-live="polite"
      >
        {{ filtered.length }} / {{ assets.icons.length }}
      </p>
    </div>

    <template
      v-for="set in sets"
      :key="set.id"
    >
      <section
        v-if="set.icons.length"
        class="flex flex-col gap-(--spacing-sm)"
        :aria-labelledby="`icons-${set.id}`"
      >
        <div class="flex flex-col gap-(--spacing-2xs)">
          <h2
            :id="`icons-${set.id}`"
            class="flex items-baseline gap-(--spacing-xs) text-heading-sm"
          >
            {{ set.title }}
            <span class="text-body-sm text-(--text-muted)"
              >{{ set.icons.length }} / {{ set.total }}</span
            >
          </h2>
          <p class="text-body-sm text-(--text-muted)">{{ set.lead }}</p>
        </div>
        <ul
          class="grid grid-cols-3 gap-px overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--border-default) sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8"
        >
          <li
            v-for="icon in set.icons"
            :key="icon.name"
            class="flex"
          >
            <button
              type="button"
              :title="format('{label}: {value}', { label: t.iconsCopy, value: icon.class })"
              class="group relative flex min-h-24 w-full flex-col items-center justify-center gap-(--spacing-xs) bg-(--bg-canvas) p-(--spacing-sm) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface) focus-visible:z-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              @click="copyValue(icon.class)"
            >
              <i
                :class="icon.class"
                class="text-(--text-default)"
                :style="{ fontSize: `${size}px` }"
                aria-hidden="true"
              />
              <span class="w-full truncate text-center text-label-code-sm text-(--text-muted)">{{
                icon.name.replace(set.prefix, '')
              }}</span>
              <span class="sr-only">{{ icon.class }}</span>
              <i
                class="ai ai-copy absolute end-(--spacing-xs) top-(--spacing-xs) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>
      </section>
    </template>

    <EmptyState
      v-if="!filtered.length"
      :title="t.iconsEmpty"
      :description="t.iconsEmptyLead"
      icon="ai ai-search"
      bordered
    />
  </div>
</template>
