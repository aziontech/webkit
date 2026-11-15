<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Item from '../../content/item/item.vue'
  import ItemActions from '../../content/item/item-actions.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemTitle from '../../content/item/item-title.vue'
  import Hint from '../../input/hint/hint.vue'

  /** Where the control sits: `field` in a right cell capped at the 3xs container, `compact` hard right at its natural width, `stacked` under the copy at the full measure. */
  export type SettingsRowVariant = 'field' | 'compact' | 'stacked'
  /** Indent depth of a child setting under the row that enables it. */
  export type SettingsRowDepth = 0 | 1 | 2

  defineOptions({
    name: 'SettingsRow',
    inheritAttrs: false
  })

  export interface SettingsRowProps {
    /** The setting name; the control takes the same text as its aria-label. */
    title: string
    /** One sentence under the title that says what the setting does. */
    description?: string
    /** Where the control sits relative to the copy. */
    variant?: SettingsRowVariant
    /** Indent depth under a rule, for a setting that only applies when its parent is on. */
    depth?: SettingsRowDepth
    /** Below the md container of the row, move a field control under the copy at full width. */
    stackable?: boolean
    /** Extra guidance in a Hint glyph beside the title; empty renders no glyph. */
    hint?: string
  }

  withDefaults(defineProps<SettingsRowProps>(), {
    description: '',
    variant: 'field',
    depth: 0,
    stackable: false,
    hint: ''
  })

  defineSlots<{
    /** The control, plus the FieldDescription message under it when there is one. */
    default(): unknown
    /** Rich title content (a Tag); replaces the title prop. */
    title(): unknown
    /** Rich description content (links, inline code); replaces the description prop. */
    description(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'settings-row')
</script>

<template>
  <Item
    v-bind="$attrs"
    :data-testid="testId"
    :data-row-variant="variant"
    :data-depth="depth"
    :data-stackable="stackable || null"
    role="listitem"
    size="small"
    class="@container/settings-row items-start"
  >
    <div
      :data-variant="variant"
      class="contents data-[variant=stacked]:flex data-[variant=stacked]:w-full data-[variant=stacked]:flex-col data-[variant=stacked]:items-stretch data-[variant=stacked]:gap-(--spacing-sm)"
    >
      <ItemContent>
        <div
          :data-depth="depth"
          class="flex flex-col data-[depth=1]:border-s data-[depth=2]:border-s data-[depth=1]:border-(--border-default) data-[depth=2]:border-(--border-default) data-[depth=1]:ps-(--spacing-md) data-[depth=2]:ps-(--spacing-md) data-[depth=2]:ms-(--spacing-md)"
        >
          <ItemTitle :data-testid="`${testId}__title`">
            <slot name="title">{{ title }}</slot>
            <Hint
              v-if="hint"
              :content="hint"
              :data-testid="`${testId}__hint`"
            />
          </ItemTitle>
          <ItemDescription
            v-if="$slots['description'] || description"
            :data-testid="`${testId}__description`"
          >
            <slot name="description">{{ description }}</slot>
          </ItemDescription>
        </div>
      </ItemContent>
      <div
        :data-variant="variant"
        :data-stackable="stackable || null"
        class="contents data-[variant=field]:flex data-[variant=field]:min-w-0 data-[variant=field]:max-w-(--container-3xs) data-[variant=field]:flex-1 data-[variant=field]:justify-end @max-md/settings-row:data-[variant=field]:data-[stackable]:max-w-none @max-md/settings-row:data-[variant=field]:data-[stackable]:basis-full @max-md/settings-row:data-[variant=field]:data-[stackable]:justify-start"
      >
        <ItemActions
          :data-testid="`${testId}__control`"
          :data-variant="variant"
          class="data-[variant=field]:w-full data-[variant=stacked]:w-full"
        >
          <div
            v-if="variant !== 'compact'"
            class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
          >
            <slot />
          </div>
          <slot v-else />
        </ItemActions>
      </div>
    </div>
  </Item>
</template>
