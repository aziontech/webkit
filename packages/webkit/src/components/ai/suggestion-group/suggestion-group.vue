<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'

  export type SuggestionGroupOrientation = 'horizontal' | 'vertical'

  export interface SuggestionItem {
    /** Stable identity, returned in `select`. */
    id: string
    /** The prompt as the reader would say it, under 72 characters. */
    label: string
    /** Optional PrimeIcons or Azion icon class drawn before the label. */
    icon?: string
  }

  defineOptions({
    name: 'SuggestionGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Up to five prompts, most likely first. */
    items?: SuggestionItem[]
    /** Accessible name of the group. Empty uses the locale catalog (`Suggested prompts`). */
    ariaLabel?: string
    /** `horizontal` wraps chips in a row (follow-up questions under a response); `vertical` stacks them (support prompts on an empty conversation). */
    orientation?: SuggestionGroupOrientation
    /** Disables every prompt, while a response is being generated. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    ariaLabel: '',
    orientation: 'horizontal',
    disabled: false
  })

  const emit = defineEmits<{
    /** The reader chose a prompt; send it, or put it in the prompt input to edit first. */
    select: [event: MouseEvent, item: SuggestionItem]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ suggestionGroup: en.suggestionGroup })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-suggestion-group'
  )

  function choose(event: MouseEvent, item: SuggestionItem): void {
    if (props.disabled) return
    emit('select', event, item)
  }
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
      class="inline-flex min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xxs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:border-(--border-strong) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:text-(--text-disabled) disabled:hover:bg-(--bg-surface) data-[orientation=vertical]:w-full pointer-coarse:min-h-11"
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
