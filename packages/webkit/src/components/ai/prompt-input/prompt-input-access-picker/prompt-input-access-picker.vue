<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import ToggleGroup from '../../../action/toggle-group/toggle-group.vue'
  import Popover from '../../../overlay/popover/popover.vue'
  import PopoverContent from '../../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTrigger from '../../../overlay/popover/popover-trigger/popover-trigger.vue'
  import { usePromptInputContext } from '../composables/use-prompt-input-context'
  import type { PromptInputMenuOption } from '../prompt-input.vue'

  defineOptions({
    name: 'PromptInputAccessPicker',
    inheritAttrs: false
  })

  export interface PromptInputAccessPickerProps {
    /** The access modes, each with an icon, a label and a description of what it lets the agent do. */
    options?: PromptInputMenuOption[]
    /** Heading of the panel, such as `Permissions`. Empty uses the locale catalog (`Permissions`). */
    title?: string
  }

  const props = withDefaults(defineProps<PromptInputAccessPickerProps>(), {
    options: () => [],
    title: ''
  })

  /** The chosen access mode's value. */
  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput })
  const { disabled } = usePromptInputContext()

  const open = ref(false)

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'prompt-input-access-picker'
  })
  const chosen = computed<PromptInputMenuOption | undefined>(() =>
    props.options.find((option) => option.value === model.value)
  )
  const heading = computed<string>(() => props.title || t('promptInput.access'))
  const segments = computed(() =>
    props.options.map((option) => ({
      label: option.label,
      value: option.value,
      icon: option.icon || 'az az-shield'
    }))
  )
</script>

<template>
  <Popover
    v-model:open="open"
    side="top"
    align="end"
    size="medium"
    :disabled="disabled || options.length === 0"
  >
    <PopoverTrigger>
      <Button
        v-bind="$attrs"
        variant="ghost"
        size="small"
        icon="az az-chevron-up"
        icon-position="trailing"
        aria-haspopup="dialog"
        :aria-label="`${heading}: ${chosen?.label ?? ''}`"
        :disabled="disabled || options.length === 0"
        :data-testid="testId"
        class="max-w-full min-w-0"
      >
        <i
          :class="[chosen?.icon || 'az az-shield', 'shrink-0 text-(--text-default)']"
          aria-hidden="true"
        />
        <span class="truncate">{{ chosen?.label ?? heading }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent :data-testid="`${testId}__panel`">
      <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-sm)">
        <span class="text-label-sm text-(--text-muted)">{{ heading }}</span>
        <ToggleGroup
          v-model="model"
          :options="segments"
          :aria-label="heading"
          :show-labels="false"
          size="medium"
          fluid
        />
        <div
          v-if="chosen"
          aria-live="polite"
          class="flex min-h-12 flex-col gap-(--spacing-2xs)"
        >
          <span class="text-body-md text-(--text-default)">{{ chosen.label }}</span>
          <span
            v-if="chosen.description"
            class="text-body-sm text-(--text-muted)"
            >{{ chosen.description }}</span
          >
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
