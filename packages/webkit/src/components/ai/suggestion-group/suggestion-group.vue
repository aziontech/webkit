<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'

  export type SuggestionGroupOrientation = 'horizontal' | 'vertical'

  export interface SuggestionGroupItem {
    /** Stable identity, returned in `select`. */
    id: string
    /** The prompt as the reader would say it, under 72 characters. */
    label: string
    /** Optional Azion icon class drawn before the label. */
    icon?: string
  }

  defineOptions({
    name: 'SuggestionGroup',
    inheritAttrs: false
  })

  export interface SuggestionGroupProps {
    /** Up to five prompts, most likely first. */
    items?: SuggestionGroupItem[]
    /** Accessible name of the group. Empty uses the locale catalog (`Suggested prompts`). */
    ariaLabel?: string
    /** `horizontal` wraps chips in a row (follow-up questions under a response); `vertical` stacks them (support prompts on an empty conversation). */
    orientation?: SuggestionGroupOrientation
    /** Disables every prompt, while a response is being generated. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<SuggestionGroupProps>(), {
    items: () => [],
    ariaLabel: '',
    orientation: 'horizontal',
    disabled: false
  })

  const emit = defineEmits<{
    /** The reader chose a prompt; send it, or put it in the prompt input to edit first. */
    select: [event: MouseEvent, item: SuggestionGroupItem]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ suggestionGroup: en.suggestionGroup })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'suggestion-group'
  )

  function choose(event: MouseEvent, item: SuggestionGroupItem): void {
    if (props.disabled) return
    emit('select', event, item)
  }

  const ITEM_CLASS =
    'inline-flex min-h-10 items-center gap-(--spacing-xs) rounded-(--shape-button) border border-(--border-default) bg-[color-mix(in_srgb,var(--bg-surface-raised)_88%,transparent)] ' +
    'px-(--spacing-md) py-(--spacing-xs) text-start text-body-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none hover:not-disabled:border-(--border-strong) hover:not-disabled:bg-(--bg-selected) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:text-(--text-disabled) ' +
    'data-[orientation=vertical]:w-full ' +
    'pointer-coarse:min-h-11'
</script>

<template>
  <div
    v-if="items.length"
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || t('suggestionGroup.label')"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-disabled="disabled || null"
    class="flex flex-wrap gap-(--spacing-xs) data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :disabled="disabled"
      :data-orientation="orientation"
      :data-testid="`${testId}__item`"
      :class="ITEM_CLASS"
      @click="(event: MouseEvent) => choose(event, item)"
    >
      <i
        v-if="item.icon"
        :class="item.icon"
        class="shrink-0 text-(--text-muted)"
        aria-hidden="true"
      />
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>
