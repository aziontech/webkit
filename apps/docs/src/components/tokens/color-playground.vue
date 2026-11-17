<script setup lang="ts">
  import Select from '@aziontech/webkit/select'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import tokens from 'virtual:docs-tokens'
  import { computed, ref, watch } from 'vue'

  import { messages } from '../../lib/i18n'
  import { resolvedTheme, settings } from '../../lib/settings'
  import { tailwindClass } from '../../lib/tokens'
  import type { Token } from '../../lib/types'
  import CopyChip from './copy-chip.vue'
  import InlineCode from './inline-code.vue'

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
  const mode = computed(() => resolvedTheme(settings.theme))
  const current = computed(() =>
    mode.value === 'dark' ? (token.value?.dark ?? token.value?.value) : token.value?.value
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
      class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2"
    >
      <div
        :data-category="category"
        class="flex min-h-48 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg) data-[category=background]:bg-(--preview) data-[category=border]:border-2 data-[category=border]:border-(--preview) data-[category=theme]:bg-(--preview)"
        :style="{ '--preview': `var(${token.name})` }"
      >
        <span
          :data-category="category"
          class="text-heading-sm text-(--text-default) data-[category=text]:text-(--preview) data-[category=theme]:rounded-(--shape-control) data-[category=theme]:bg-(--bg-surface) data-[category=theme]:px-(--spacing-xs)"
          >{{ category === 'text' ? t.sampleText : token.name }}</span
        >
      </div>
      <dl
        class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
      >
        <div class="flex flex-col gap-(--spacing-2xs)">
          <dt class="text-overline-sm text-(--text-muted)">{{ t.tailwind }}</dt>
          <dd><CopyChip :value="tailwindClass(token.name, 'color')" /></dd>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <dt class="text-overline-sm text-(--text-muted)">{{ t.cssVariable }}</dt>
          <dd><CopyChip :value="`var(${token.name})`" /></dd>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <dt class="text-overline-sm text-(--text-muted)">
            {{ t.current }} · {{ mode === 'dark' ? t.dark : t.light }}
          </dt>
          <dd class="flex items-center gap-(--spacing-xs)">
            <span
              class="size-4 rounded-(--shape-control) border border-(--border-default)"
              :style="{ background: `var(${token.name})` }"
              aria-hidden="true"
            />
            <code class="text-label-code-sm">{{ current }}</code>
          </dd>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <dt class="text-overline-sm text-(--text-muted)">{{ t.light }} → {{ t.dark }}</dt>
          <dd class="flex flex-wrap items-center gap-(--spacing-xs)">
            <span
              data-theme="light"
              class="size-4 rounded-(--shape-control) border border-(--border-default)"
              :style="{ background: `var(${token.name})` }"
              aria-hidden="true"
            />
            <code class="text-label-code-sm">{{ token.value }}</code>
            <i
              class="az az-arrow-right text-(--text-muted) rtl:rotate-180"
              aria-hidden="true"
            />
            <span
              data-theme="dark"
              class="size-4 rounded-(--shape-control) border border-(--border-default)"
              :style="{ background: `var(${token.name})` }"
              aria-hidden="true"
            />
            <code class="text-label-code-sm">{{ token.dark ?? token.value }}</code>
          </dd>
        </div>
        <div
          v-if="token.usage"
          class="flex flex-col gap-(--spacing-2xs)"
        >
          <dt class="text-overline-sm text-(--text-muted)">{{ t.usage }}</dt>
          <dd class="flex flex-col gap-(--spacing-2xs)">
            <span class="text-body-sm">{{ token.usage.job }}</span>
            <span class="text-body-xs text-(--text-muted)">
              {{ t.usedBy }}: <InlineCode :text="token.usage.usedBy" />
            </span>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
