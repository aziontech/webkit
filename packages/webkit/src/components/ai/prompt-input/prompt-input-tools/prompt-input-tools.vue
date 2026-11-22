<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import Chip from '../../../input/chip/chip.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import { usePromptInputContext } from '../composables/use-prompt-input-context'
  import type { PromptInputMenuOption } from '../prompt-input.vue'

  defineOptions({
    name: 'PromptInputTools',
    inheritAttrs: false
  })

  export interface PromptInputToolsProps {
    /** The tools the reader can turn on for the next prompt, such as web search. */
    tools?: PromptInputMenuOption[]
    /** Visible label of the menu control, such as `Plugins`. Empty uses the locale catalog (`Tools`). */
    label?: string
  }

  const props = withDefaults(defineProps<PromptInputToolsProps>(), {
    tools: () => [],
    label: ''
  })

  /** The enabled tools' values, in `tools` order. */
  const model = defineModel<string[]>({ default: () => [] })

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput })
  const { disabled } = usePromptInputContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'prompt-input-tools'
  )
  const enabled = computed<PromptInputMenuOption[]>(() =>
    props.tools.filter((tool) => model.value.includes(tool.value))
  )

  function toggle(value: string): void {
    const next = model.value.includes(value)
      ? model.value.filter((item) => item !== value)
      : [...model.value, value]
    model.value = props.tools.map((tool) => tool.value).filter((item) => next.includes(item))
  }

  function onSelect(_event: MouseEvent | KeyboardEvent, value: string | number): void {
    toggle(String(value))
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 flex-wrap items-center gap-(--spacing-2xs)"
  >
    <DropdownMenu
      side="top"
      align="start"
      :disabled="disabled || tools.length === 0"
      @select="onSelect"
    >
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="small"
          icon="az az-wrench"
          :label="label || t('promptInput.tools')"
          :disabled="disabled || tools.length === 0"
          :data-testid="`${testId}__trigger`"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          type="checkbox"
          :selected="model.includes(tool.value)"
          :label="tool.label"
        >
          <template
            v-if="tool.icon"
            #leading
          >
            <i
              :class="tool.icon"
              aria-hidden="true"
            />
          </template>
          <template
            v-if="tool.description"
            #trailing
          >
            <span class="max-w-48 truncate text-body-xs text-(--text-muted)">{{
              tool.description
            }}</span>
          </template>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenu>
    <ul
      v-if="enabled.length"
      :aria-label="t('promptInput.toolsEnabled')"
      :data-testid="`${testId}__enabled`"
      class="m-0 flex list-none flex-wrap gap-(--spacing-2xs) p-0"
    >
      <li
        v-for="tool in enabled"
        :key="tool.value"
      >
        <Chip
          :label="tool.label"
          size="small"
          removable
          :disabled="disabled"
          @remove="toggle(tool.value)"
        />
      </li>
    </ul>
  </div>
</template>
