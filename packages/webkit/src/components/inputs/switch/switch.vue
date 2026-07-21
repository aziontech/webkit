<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'

  defineOptions({
    name: 'Switch',
    inheritAttrs: false
  })

  export type SwitchType = 'default' | 'privacy'

  interface Props {
    /** Toggled-on state. Bind with `v-model`. */
    modelValue?: boolean
    /** Visual variant. Privacy renders a lock icon inside the handle. */
    kind?: SwitchType
    /** Forces the focused visual state regardless of keyboard focus. */
    focused?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    kind: 'default',
    focused: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-switch')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  const isChecked = computed(() => props.modelValue === true)

  const buttonRef = ref<globalThis.HTMLButtonElement | null>(null)

  watch(
    () => props.focused,
    (next) => {
      if (next) buttonRef.value?.focus()
      else buttonRef.value?.blur()
    },
    { immediate: true, flush: 'post' }
  )

  function handleToggle() {
    emit('update:modelValue', !isChecked.value)
  }

  function handleKeydown(event: globalThis.KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      handleToggle()
    }
  }

  const ROOT_CLASS =
    'group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-0.5 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[focused]:ring-2 data-[focused]:ring-[var(--ring-color)] data-[focused]:ring-offset-2 data-[focused]:ring-offset-[var(--bg-canvas)] hover:shadow-[inset_0_0_0_999px_var(--bg-hover)] data-[checked]:border-transparent data-[checked]:bg-[var(--success-contrast)]'

  const HANDLE_CLASS =
    'pointer-events-none relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--text-muted)] transition-transform duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none group-data-[checked]:translate-x-4 group-data-[checked]:bg-[var(--bg-canvas)]'

  const LOCK_ICON_CLASS = 'pi text-body-xxs leading-none'
  const LOCK_OFF_CLASS = `${LOCK_ICON_CLASS} pi-lock text-[var(--bg-surface)]`
  const LOCK_ON_CLASS = `${LOCK_ICON_CLASS} pi-lock-open text-[var(--success-contrast)]`

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :data-testid="testId"
    :data-kind="kind"
    :data-checked="isChecked || null"
    :data-focused="focused || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
    @click="handleToggle"
    @keydown="handleKeydown"
  >
    <span
      aria-hidden="true"
      :class="HANDLE_CLASS"
      :data-testid="`${testId}__handle`"
    >
      <i
        v-if="kind === 'privacy'"
        aria-hidden="true"
        :class="isChecked ? LOCK_ON_CLASS : LOCK_OFF_CLASS"
      />
    </span>
  </button>
</template>
