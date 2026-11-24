<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import Kbd from '../../../content/kbd/kbd.vue'
  import Input from '../../../input/input/input.vue'
  import { useCommandMenuContext } from '../composables/use-command-menu-context'

  defineOptions({
    name: 'CommandInput',
    inheritAttrs: false
  })

  export interface CommandInputProps {
    /** Input placeholder text. Empty uses the locale catalog (`Search everything`). */
    placeholder?: string
    /** Accessible name for the search field. Falls back to the placeholder text. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<CommandInputProps>(), {
    placeholder: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ command: en.command })
  const placeholderText = computed(() => props.placeholder || t('command.placeholder'))
  const ctx = useCommandMenuContext()
  const fieldEl = ref<InstanceType<typeof Input> | null>(null)

  const onPage = computed(() => ctx.page.value !== '')
  const backLabel = computed(() => t('command.back', { page: ctx.pageHeading.value }))

  function focusField() {
    const root = fieldEl.value?.$el as HTMLElement | undefined
    root?.querySelector('input')?.focus()
  }

  function goBack() {
    ctx.popPage()
    nextTick(focusField)
  }

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'command-input')

  watch(
    () => ctx.isOpen.value,
    (open) => {
      if (!open) return
      nextTick(focusField)
    }
  )
</script>

<template>
  <div
    class="flex w-full items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-sm)"
    :data-testid="testId"
    :data-page="onPage ? ctx.page.value : undefined"
  >
    <Button
      v-if="onPage"
      variant="ghost"
      size="medium"
      icon="az az-chevron-left"
      :label="ctx.pageHeading.value"
      :aria-label="backLabel"
      :data-testid="`${testId}__previous`"
      class="max-w-[40%] shrink-0"
      @click="goBack"
    />
    <Input
      ref="fieldEl"
      v-bind="attrs"
      :model-value="ctx.query.value"
      :placeholder="placeholderText"
      :aria-label="ariaLabel || placeholderText"
      size="large"
      class="min-w-0 flex-1"
      data-autofocus
      role="combobox"
      autocomplete="off"
      :aria-expanded="ctx.isOpen.value"
      :aria-controls="ctx.listId"
      :aria-activedescendant="ctx.activeId.value"
      @update:model-value="ctx.setQuery"
      @keydown="ctx.onInputKeydown"
    >
      <template #leading>
        <span
          class="az az-search"
          aria-hidden="true"
        />
      </template>
      <template #trailing>
        <Kbd
          size="small"
          key-name="escape"
          aria-hidden="true"
        />
      </template>
    </Input>
  </div>
</template>
