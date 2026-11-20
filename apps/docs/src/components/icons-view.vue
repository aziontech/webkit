<script setup lang="ts">
  import '@aziontech/icons/azionicons-color'

  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item-root'
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

  const GROUPS = ['azion', 'interface', 'external'] as const

  const groups = computed(() =>
    GROUPS.map((id) => {
      const all = assets.icons.filter((icon) => icon.group === id)
      const shown = filtered.value.filter((icon) => icon.group === id)
      const categories = [...new Set(all.map((icon) => icon.category))]
        .map((category) => ({
          id: category,
          title: t.value.iconCategories[category] ?? category,
          icons: shown.filter((icon) => icon.category === category)
        }))
        .filter((category) => category.icons.length)
      return {
        id,
        title: {
          azion: t.value.iconsAzion,
          interface: t.value.iconsInterface,
          external: t.value.iconsExternal
        }[id],
        lead: {
          azion: t.value.iconsAzionLead,
          interface: t.value.iconsInterfaceLead,
          external: t.value.iconsExternalLead
        }[id],
        total: all.length,
        count: shown.length,
        categories
      }
    })
  )

  const shortName = (icon: IconAsset) => icon.name.replace(/^az-/, '')
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
          <template #leading>
            <i
              class="az az-search text-(--text-muted)"
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
      v-for="group in groups"
      :key="group.id"
    >
      <section
        v-if="group.count"
        class="flex flex-col gap-(--spacing-md)"
        :aria-labelledby="`icons-${group.id}`"
      >
        <div class="flex flex-col gap-(--spacing-2xs)">
          <h2
            :id="`icons-${group.id}`"
            class="flex items-baseline gap-(--spacing-xs) text-heading-sm"
          >
            {{ group.title }}
            <span class="text-body-sm text-(--text-muted)"
              >{{ group.count }} / {{ group.total }}</span
            >
          </h2>
          <p class="text-body-sm text-(--text-muted)">{{ group.lead }}</p>
        </div>
        <div
          v-for="category in group.categories"
          :key="category.id"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <h3 class="text-label-md text-(--text-muted)">{{ category.title }}</h3>
          <div class="overflow-hidden rounded-(--shape-card) border border-(--border-default)">
            <ul class="-me-px -mb-px grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
              <li
                v-for="icon in category.icons"
                :key="icon.class"
                class="flex border-e border-b border-(--border-default)"
              >
                <Item
                  clickable
                  size="small"
                  :title="`${icon.label} · ${format('{label}: {value}', { label: t.iconsCopy, value: icon.class })}`"
                  class="min-h-24 flex-col justify-center gap-(--spacing-xs) rounded-none bg-(--bg-canvas) focus-visible:z-1 focus-visible:ring-inset focus-visible:ring-offset-0"
                  @click="copyValue(icon.class)"
                >
                  <i
                    :class="icon.class"
                    class="text-(--text-default)"
                    :style="{ fontSize: `${size}px` }"
                    aria-hidden="true"
                  />
                  <span class="w-full text-center wrap-break-word [hyphens:none] text-label-code-sm text-(--text-muted)"
                    >{{ shortName(icon)
                    }}<template v-if="icon.set === 'color'"> · {{ t.iconsColor }}</template></span
                  >
                  <span class="sr-only">{{ icon.class }}, {{ icon.label }}</span>
                  <i
                    class="az az-copy absolute end-(--spacing-xs) top-(--spacing-xs) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 group-hover/item:opacity-100 group-focus-visible/item:opacity-100 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </Item>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </template>

    <EmptyState
      v-if="!filtered.length"
      :title="t.iconsEmpty"
      :description="t.iconsEmptyLead"
      icon="az az-search"
      bordered
    />
  </div>
</template>
