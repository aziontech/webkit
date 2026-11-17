<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import { usePromptInputContext } from '../composables/use-prompt-input-context'
  import type { PromptInputMenuOption } from '../prompt-input.vue'

  defineOptions({
    name: 'PromptInputModelPicker',
    inheritAttrs: false
  })

  export interface PromptInputModelPickerProps {
    /** The models to choose from, each with an optional description. */
    models?: PromptInputMenuOption[]
    /** The modes of the chosen model, such as reasoning effort. Empty hides the mode group. */
    modes?: PromptInputMenuOption[]
    /** Label of the mode group, such as `Effort`. Empty uses the locale catalog (`Mode`). */
    modeLabel?: string
  }

  const props = withDefaults(defineProps<PromptInputModelPickerProps>(), {
    models: () => [],
    modes: () => [],
    modeLabel: ''
  })

  /** The chosen model's value. */
  const model = defineModel<string>({ default: '' })
  /** The chosen mode's value. */
  const mode = defineModel<string>('mode', { default: '' })

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput })
  const { disabled } = usePromptInputContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'prompt-input-model-picker'
  )
  const modelLabel = computed<string>(
    () =>
      props.models.find((option) => option.value === model.value)?.label ?? t('promptInput.model')
  )
  const modeName = computed<string>(
    () => props.modes.find((option) => option.value === mode.value)?.label ?? ''
  )

  function onSelect(_event: MouseEvent | KeyboardEvent, value: string | number): void {
    const key = String(value)
    if (key.startsWith('model:')) model.value = key.slice(6)
    else if (key.startsWith('mode:')) mode.value = key.slice(5)
  }
</script>

<template>
  <DropdownMenu
    side="top"
    align="end"
    :disabled="disabled || models.length === 0"
    @select="onSelect"
  >
    <DropdownMenuTrigger>
      <Button
        v-bind="$attrs"
        variant="ghost"
        size="small"
        icon="az az-chevron-down"
        icon-position="trailing"
        :disabled="disabled || models.length === 0"
        :data-testid="testId"
        class="max-w-full min-w-0"
      >
        <span class="truncate">{{ modelLabel }}</span>
        <span
          v-if="modeName"
          class="truncate text-(--text-muted)"
          >{{ modeName }}</span
        >
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuGroup :label="t('promptInput.model')">
      <DropdownMenuItem
        v-for="option in models"
        :key="option.value"
        :value="`model:${option.value}`"
        type="radio"
        :selected="option.value === model"
        :label="option.label"
      >
        <template
          v-if="option.description"
          #trailing
        >
          <span class="max-w-48 truncate text-body-xs text-(--text-muted)">{{
            option.description
          }}</span>
        </template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup
      v-if="modes.length"
      :label="modeLabel || t('promptInput.mode')"
    >
      <DropdownMenuItem
        v-for="option in modes"
        :key="option.value"
        :value="`mode:${option.value}`"
        :label="option.label"
        type="radio"
        :selected="option.value === mode"
      />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
