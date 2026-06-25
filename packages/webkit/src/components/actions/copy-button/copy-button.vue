<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, useAttrs } from 'vue'

  import type { IconButtonKind, IconButtonSize } from '../icon-button/icon-button.vue'
  import IconButton from '../icon-button/icon-button.vue'

  defineOptions({
    name: 'CopyButton',
    inheritAttrs: false
  })

  interface Props {
    /** Text copied to the clipboard on activation. */
    value: string
    /** Accessible name while idle. */
    ariaLabel?: string
    /** Accessible name while the copied state is shown. */
    copiedLabel?: string
    /** Visual variant forwarded to `IconButton`. */
    kind?: IconButtonKind
    /** Size token forwarded to `IconButton`. */
    size?: IconButtonSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: 'Copy',
    copiedLabel: 'Copied',
    kind: 'transparent',
    size: 'small',
    disabled: false
  })

  const emit = defineEmits<{
    copy: [value: string]
  }>()

  const attrs = useAttrs()

  const copied = ref(false)
  let copiedTimeoutId: ReturnType<typeof setTimeout> | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-copy-button'
  )

  const icon = computed(() => (copied.value ? 'pi pi-check' : 'pi pi-copy'))
  const label = computed(() => (copied.value ? props.copiedLabel : props.ariaLabel))
  const iconClass = computed(() => (copied.value ? 'text-[var(--success-contrast)]' : undefined))

  async function handleCopy(event: MouseEvent) {
    if (props.disabled || !props.value || typeof globalThis.navigator === 'undefined') return

    try {
      await globalThis.navigator.clipboard.writeText(props.value)
      copied.value = true
      emit('copy', props.value)

      if (copiedTimeoutId) {
        clearTimeout(copiedTimeoutId)
      }

      copiedTimeoutId = setTimeout(() => {
        copied.value = false
        copiedTimeoutId = null
      }, 2000)
    } catch {
      // Clipboard access may be denied; keep the idle state.
    }

    event.stopPropagation()
  }

  onBeforeUnmount(() => {
    if (copiedTimeoutId) {
      clearTimeout(copiedTimeoutId)
    }
  })
</script>

<template>
  <IconButton
    v-bind="attrs"
    :icon="icon"
    :iconClass="iconClass"
    :ariaLabel="label"
    :kind="kind"
    :size="size"
    :disabled="disabled"
    iconTransition
    :data-state="copied ? 'copied' : 'default'"
    :data-testid="testId"
    @click="handleCopy"
  />
</template>
