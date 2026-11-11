<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Item from '../../content/item/item.vue'
  import ItemActions from '../../content/item/item-actions.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemTitle from '../../content/item/item-title.vue'

  /** Where the control sits: `field` in a right cell capped at the 3xs container, `compact` hard right at its natural width, `stacked` under the copy at the full measure. */
  export type SettingRowKind = 'field' | 'compact' | 'stacked'
  /** Indent depth of a child setting under the row that enables it. */
  export type SettingRowLevel = 0 | 1 | 2

  defineOptions({
    name: 'SettingRow',
    inheritAttrs: false
  })

  interface Props {
    /** The setting name; the control takes the same text as its aria-label. */
    title: string
    /** One sentence under the title that says what the setting does. */
    description?: string
    /** Where the control sits relative to the copy. */
    kind?: SettingRowKind
    /** Indent depth under a rule, for a setting that only applies when its parent is on. */
    level?: SettingRowLevel
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    kind: 'field',
    level: 0
  })

  defineSlots<{
    /** The control, plus the HelperText message under it when there is one. */
    default(): unknown
    /** Rich title content (a Tag, a Hint); replaces the title prop. */
    title(): unknown
    /** Rich description content (links, inline code); replaces the description prop. */
    description(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-setting-row'
  )
</script>

<template>
  <Item
    v-bind="$attrs"
    :data-testid="testId"
    :data-row-kind="kind"
    :data-level="level"
    role="listitem"
    size="small"
    class="@container/setting-row"
  >
    <div
      :data-kind="kind"
      class="contents data-[kind=stacked]:flex data-[kind=stacked]:w-full data-[kind=stacked]:flex-col data-[kind=stacked]:items-stretch data-[kind=stacked]:gap-(--spacing-sm)"
    >
      <ItemContent>
        <div
          :data-level="level"
          class="flex flex-col data-[level=1]:border-s data-[level=2]:border-s data-[level=1]:border-(--border-default) data-[level=2]:border-(--border-default) data-[level=1]:ps-(--spacing-md) data-[level=2]:ps-(--spacing-md) data-[level=2]:ms-(--spacing-md)"
        >
          <ItemTitle :data-testid="`${testId}__title`">
            <slot name="title">{{ title }}</slot>
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
        :data-kind="kind"
        class="contents data-[kind=field]:flex data-[kind=field]:max-w-(--container-3xs) data-[kind=field]:flex-1 data-[kind=field]:justify-end @max-md/setting-row:data-[kind=field]:max-w-none @max-md/setting-row:data-[kind=field]:basis-full @max-md/setting-row:data-[kind=field]:justify-start"
      >
        <ItemActions
          :data-testid="`${testId}__control`"
          :data-kind="kind"
          class="data-[kind=field]:w-full data-[kind=stacked]:w-full"
        >
          <div
            v-if="kind !== 'compact'"
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
