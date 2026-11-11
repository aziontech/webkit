<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import Kbd from '../../../content/kbd/kbd.vue'
  import Input from '../../../inputs/input/input.vue'
  import { useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandInput',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Input placeholder text. Empty uses the locale catalog (`Search Everything`). */
      placeholder?: string
      /** Accessible name for the search field. Falls back to the placeholder text. */
      ariaLabel?: string
    }>(),
    {
      placeholder: '',
      ariaLabel: ''
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ command: en.command })
  const placeholderText = computed(() => props.placeholder || t('command.placeholder'))
  const ctx = useCommandMenuContext()
  const fieldRef = ref<InstanceType<typeof Input> | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__input`
  )

  watch(
    () => ctx.isOpen.value,
    (open) => {
      if (!open) return
      nextTick(() => {
        const root = fieldRef.value?.$el as HTMLElement | undefined
        root?.querySelector('input')?.focus()
      })
    }
  )
</script>

<template>
  <div
    class="w-full border-b border-(--border-default) p-(--spacing-sm)"
    :data-testid="testId"
  >
    <Input
      ref="fieldRef"
      v-bind="attrs"
      :model-value="ctx.query.value"
      :placeholder="placeholderText"
      :aria-label="ariaLabel || placeholderText"
      size="large"
      role="combobox"
      autocomplete="off"
      :aria-expanded="ctx.isOpen.value"
      :aria-controls="ctx.listId"
      @update:model-value="ctx.setQuery"
      @keydown="ctx.onInputKeydown"
    >
      <template #iconLeft>
        <span
          class="pi pi-search"
          aria-hidden="true"
        />
      </template>
      <template #iconRight>
        <Kbd
          size="small"
          key-name="escape"
          aria-hidden="true"
        />
      </template>
    </Input>
  </div>
</template>
