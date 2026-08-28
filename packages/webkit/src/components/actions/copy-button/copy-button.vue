<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, useAttrs } from 'vue'

  import Tooltip from '../../overlay/tooltip/tooltip.vue'
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

  /**
   * One string names the control and labels its tooltip, so the two can never
   * disagree: it is `ariaLabel` while idle and `copiedLabel` for the two seconds
   * after a write. An icon-only button says nothing to a pointer user until it is
   * hovered — the tooltip is what makes the glyph legible, and because it tracks
   * the same state, the confirmation is visible and not only announced.
   */
  const label = computed(() => (copied.value ? props.copiedLabel : props.ariaLabel))

  async function handleCopy(event: MouseEvent) {
    event.stopPropagation()

    if (props.disabled || !props.value || typeof globalThis.navigator === 'undefined') return

    try {
      await globalThis.navigator.clipboard.writeText(props.value)
    } catch {
      // Clipboard access may be denied; keep the idle state.
      return
    }

    copied.value = true
    emit('copy', props.value)

    if (copiedTimeoutId) {
      clearTimeout(copiedTimeoutId)
    }

    copiedTimeoutId = setTimeout(() => {
      copied.value = false
      copiedTimeoutId = null
    }, 2000)
  }

  onBeforeUnmount(() => {
    if (copiedTimeoutId) {
      clearTimeout(copiedTimeoutId)
    }
  })
</script>

<template>
  <span
    class="inline-flex"
    :data-state="copied ? 'copied' : 'default'"
    :data-disabled="disabled ? '' : undefined"
    :data-testid="testId"
  >
    <Tooltip
      :text="label"
      :disabled="disabled"
      :data-testid="`${testId}__tooltip`"
    >
      <IconButton
        :icon="icon"
        :ariaLabel="label"
        :kind="kind"
        :size="size"
        :disabled="disabled"
        iconTransition
        @click="handleCopy"
      />
    </Tooltip>
  </span>
</template>
