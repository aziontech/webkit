<script setup lang="ts">
  import CopyText from '@aziontech/ui/copy-text'
  import Select from '@aziontech/ui/select'
  import ToggleGroup from '@aziontech/ui/toggle-group'
  import tokens from 'virtual:docs-tokens'
  import { computed, ref, watch } from 'vue'

  import { messages } from '../../lib/i18n'
  import { tailwindClass } from '../../lib/tokens'
  import type { Token, TokenPreview } from '../../lib/types'

  type Category = 'theme' | 'background' | 'text' | 'border'

  const t = messages
  const THEME_GROUPS = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'info']

  const byCategory = computed<Record<Category, Token[]>>(() => {
    const groups = new Map(tokens.semantic.map((group) => [group.id, group.vars]))
    return {
      theme: THEME_GROUPS.flatMap((id) => groups.get(id) ?? []),
      background: groups.get('bg') ?? [],
      text: groups.get('text') ?? [],
      border: groups.get('border') ?? []
    }
  })

  const categories = computed(() => [
    { label: t.value.categoryTheme, value: 'theme' },
    { label: t.value.categoryBackground, value: 'background' },
    { label: t.value.categoryText, value: 'text' },
    { label: t.value.categoryBorder, value: 'border' }
  ])

  const category = ref<Category>('theme')
  const selected = ref('--primary')

  const options = computed(() => byCategory.value[category.value])
  const token = computed(
    () => options.value.find((item) => item.name === selected.value) ?? options.value[0]
  )
  const preview = computed<TokenPreview>(
    () =>
      token.value?.preview ?? {
        foreground: '--text-default',
        background: '--bg-surface',
        fill: 'swatch'
      }
  )
  const swatch = computed(() => preview.value.fill === 'swatch' && category.value !== 'border')
  const label = computed(() =>
    preview.value.fill === 'foreground' ? t.value.sampleText : (token.value?.name ?? '')
  )

  watch(category, () => {
    selected.value = options.value[0]?.name ?? ''
  })
</script>

<template>
  <section
    class="flex flex-col gap-(--spacing-md)"
    aria-labelledby="color-explorer"
  >
    <div class="flex flex-col gap-(--spacing-2xs)">
      <h2
        id="color-explorer"
        class="text-heading-sm"
      >
        {{ t.playgroundTitle }}
      </h2>
      <p class="text-body-sm text-(--text-muted)">{{ t.playgroundLead }}</p>
    </div>
    <div class="flex flex-wrap items-end gap-(--spacing-sm)">
      <ToggleGroup
        v-model="category"
        :options="categories"
        :aria-label="t.category"
        size="medium"
      />
      <div class="w-full max-w-xs">
        <Select
          v-model="selected"
          size="medium"
        >
          <Select.Trigger :aria-label="t.token" />
          <Select.Content>
            <Select.Item
              v-for="item in options"
              :key="item.name"
              :value="item.name"
            >
              {{ item.name }}
            </Select.Item>
          </Select.Content>
        </Select>
      </div>
    </div>
    <div
      v-if="token"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <div
        :data-category="category"
        :data-fill="preview.fill"
        :data-swatch="swatch || null"
        class="flex min-h-48 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--color-playground-background) p-(--spacing-lg) text-(--color-playground-foreground) data-[category=border]:border-2 data-[category=border]:border-(--color-playground-token) data-[swatch]:bg-(--color-playground-token)"
        :style="{
          '--color-playground-token': `var(${token.name})`,
          '--color-playground-foreground': `var(${preview.foreground})`,
          '--color-playground-background': `var(${preview.background})`
        }"
      >
        <span
          :data-swatch="swatch || null"
          class="text-heading-sm data-[swatch]:rounded-(--shape-control) data-[swatch]:bg-(--bg-surface) data-[swatch]:px-(--spacing-xs) data-[swatch]:text-(--text-default)"
          >{{ label }}</span
        >
      </div>
      <div
        class="flex flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-2xs) text-body-xs text-(--text-muted)"
      >
        <span class="flex items-center gap-(--spacing-2xs)"
          >{{ t.tailwind }}
          <CopyText
            size="small"
            :value="tailwindClass(token.name, 'color')"
        /></span>
        <span class="flex items-center gap-(--spacing-2xs)"
          >{{ t.cssVariable }}
          <CopyText
            size="small"
            :value="`var(${token.name})`"
        /></span>
      </div>
    </div>
  </section>
</template>
