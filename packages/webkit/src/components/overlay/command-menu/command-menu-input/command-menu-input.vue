<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, watch } from 'vue'

  import Kbd from '../../../content/kbd/kbd.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import { useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandMenuInput',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Input placeholder text. */
      placeholder?: string
      /** Accessible name for the search field. Falls back to the placeholder text. */
      ariaLabel?: string
    }>(),
    {
      placeholder: 'Search Everything',
      ariaLabel: ''
    }
  )

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()
  const fieldRef = ref<InstanceType<typeof InputText> | null>(null)

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
    class="w-full border-b border-[var(--border-default)] p-[var(--spacing-sm)]"
    :data-testid="testId"
  >
    <InputText
      ref="fieldRef"
      v-bind="attrs"
      :model-value="ctx.query.value"
      :placeholder="placeholder"
      :aria-label="ariaLabel || placeholder"
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
          aria-hidden="true"
          >ESC</Kbd
        >
      </template>
    </InputText>
  </div>
</template>
