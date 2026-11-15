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
      /** Input placeholder text. Empty uses the locale catalog (`Search everything`). */
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

  const onPage = computed(() => ctx.page.value !== '')
  const backLabel = computed(() => t('command.back', { page: ctx.pageHeading.value }))

  function focusField() {
    const root = fieldRef.value?.$el as HTMLElement | undefined
    root?.querySelector('input')?.focus()
  }

  function goBack() {
    ctx.popPage()
    nextTick(focusField)
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__input`
  )

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
    <button
      v-if="onPage"
      type="button"
      :aria-label="backLabel"
      :data-testid="`${testId}__back`"
      class="flex h-8 max-w-[40%] shrink-0 items-center gap-(--spacing-2xs) rounded-(--shape-control) px-(--spacing-xs) text-label-sm text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
      @click="goBack"
    >
      <i
        class="ai ai-chevron-left shrink-0 text-label-sm text-(--text-muted) rtl:-scale-x-100"
        aria-hidden="true"
      />
      <span class="truncate">{{ ctx.pageHeading.value }}</span>
    </button>
    <Input
      ref="fieldRef"
      v-bind="attrs"
      :model-value="ctx.query.value"
      :placeholder="placeholderText"
      :aria-label="ariaLabel || placeholderText"
      size="large"
      class="min-w-0 flex-1"
      role="combobox"
      autocomplete="off"
      :aria-expanded="ctx.isOpen.value"
      :aria-controls="ctx.listId"
      :aria-activedescendant="ctx.activeId.value"
      @update:model-value="ctx.setQuery"
      @keydown="ctx.onInputKeydown"
    >
      <template #prefix>
        <span
          class="ai ai-search"
          aria-hidden="true"
        />
      </template>
      <template #suffix>
        <Kbd
          size="small"
          key-name="escape"
          aria-hidden="true"
        />
      </template>
    </Input>
  </div>
</template>
