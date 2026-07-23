<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, watch } from 'vue'

  import { useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandMenuInput',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Input placeholder text. */
      placeholder?: string
    }>(),
    {
      placeholder: ''
    }
  )

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()
  const inputRef = ref<HTMLInputElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__input`
  )

  function onInput(event: Event) {
    ctx.setQuery((event.target as HTMLInputElement).value)
  }

  watch(
    () => ctx.isOpen.value,
    (open) => {
      if (open) nextTick(() => inputRef.value?.focus())
    }
  )
</script>

<template>
  <div
    class="flex items-center gap-[var(--spacing-xs)] border-b border-[var(--border-default)] px-[var(--spacing-sm)]"
    :data-testid="testId"
  >
    <span
      class="pi pi-search text-[var(--text-muted)]"
      aria-hidden="true"
    />
    <input
      ref="inputRef"
      v-bind="attrs"
      :value="ctx.query.value"
      :placeholder="placeholder"
      role="combobox"
      type="text"
      autocomplete="off"
      :aria-expanded="ctx.isOpen.value"
      :aria-controls="ctx.listId"
      class="w-full bg-transparent py-[var(--spacing-sm)] text-label-sm text-[var(--text-default)] outline-none placeholder:text-[var(--text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
      @input="onInput"
      @keydown="ctx.onInputKeydown"
    />
  </div>
</template>
