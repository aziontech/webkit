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
    name: 'PromptInputContextPicker',
    inheritAttrs: false
  })

  export interface PromptInputContextPickerProps {
    /** The contexts to choose from, such as projects or folders. */
    options?: PromptInputMenuOption[]
    /** Text shown while nothing is chosen, such as `Choose project`. Empty uses the locale catalog (`Choose context`). */
    placeholder?: string
    /** Azion icon class shown when the chosen option has none. Empty uses `az az-folder`. */
    icon?: string
  }

  const props = withDefaults(defineProps<PromptInputContextPickerProps>(), {
    options: () => [],
    placeholder: '',
    icon: ''
  })

  /** The chosen option's value; empty means none. */
  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput })
  const { disabled } = usePromptInputContext()

  const REMOVE = 'prompt-input-context-remove'

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'prompt-input-context-picker'
  )
  const chosen = computed<PromptInputMenuOption | undefined>(() =>
    props.options.find((option) => option.value === model.value)
  )

  function onSelect(_event: MouseEvent | KeyboardEvent, value: string | number): void {
    model.value = value === REMOVE ? '' : String(value)
  }
</script>

<template>
  <DropdownMenu
    side="top"
    align="start"
    :disabled="disabled || options.length === 0"
    @select="onSelect"
  >
    <DropdownMenuTrigger>
      <Button
        v-bind="$attrs"
        variant="ghost"
        size="small"
        :icon="chosen?.icon || icon || 'az az-folder'"
        :label="chosen?.label || placeholder || t('promptInput.context')"
        :disabled="disabled || options.length === 0"
        :data-testid="testId"
        :data-selected="chosen ? true : null"
        class="rounded-full!"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
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
    <DropdownMenuGroup v-if="chosen">
      <DropdownMenuItem
        :value="REMOVE"
        :label="t('promptInput.contextRemove')"
      />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
