<script setup lang="ts">
  import { computed, defineAsyncComponent, onBeforeUnmount, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import type { IconButtonSize, IconButtonVariant } from '../icon-button/icon-button.vue'
  import IconButton from '../icon-button/icon-button.vue'

  defineOptions({
    name: 'CopyButton',
    inheritAttrs: false
  })

  export interface CopyButtonProps {
    /** Text copied to the clipboard on activation. */
    value: string
    /** Accessible name while idle. Empty uses the locale catalog (`Copy`). */
    ariaLabel?: string
    /** Accessible name while the copied state is shown. Empty uses the locale catalog (`Copied`). */
    copiedLabel?: string
    /** Visual variant forwarded to `IconButton`. */
    variant?: IconButtonVariant
    /** Size token forwarded to `IconButton`. */
    size?: IconButtonSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<CopyButtonProps>(), {
    ariaLabel: '',
    copiedLabel: '',
    variant: 'ghost',
    size: 'large',
    disabled: false
  })

  const emit = defineEmits<{
    copy: [event: MouseEvent, value: string]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ copyButton: en.copyButton, common: en.common })

  const CopyButtonFallback = defineAsyncComponent(() => import('./copy-button-fallback.vue'))

  const rootEl = ref<globalThis.HTMLElement | null>(null)
  const fallbackRequested = ref(false)
  const fallbackOpen = ref(false)

  const copied = ref(false)
  let copiedTimeoutId: ReturnType<typeof setTimeout> | null = null

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'copy-button')

  const icon = computed(() => (copied.value ? 'ai ai-check' : 'ai ai-copy'))

  const label = computed(() =>
    copied.value ? props.copiedLabel || t('common.copied') : props.ariaLabel || t('common.copy')
  )

  async function onCopy(event: MouseEvent) {
    event.stopPropagation()

    if (props.disabled || !props.value || typeof globalThis.navigator === 'undefined') return

    try {
      await globalThis.navigator.clipboard.writeText(props.value)
    } catch {
      fallbackRequested.value = true
      fallbackOpen.value = true
      return
    }

    copied.value = true
    emit('copy', event, props.value)

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
    v-bind="$attrs"
    ref="rootEl"
    class="inline-flex"
    :data-state="copied ? 'copied' : 'idle'"
    :data-disabled="disabled ? '' : undefined"
    :data-testid="testId"
  >
    <Tooltip
      :content="label"
      :disabled="disabled"
      :data-testid="`${testId}__tooltip`"
    >
      <IconButton
        :icon="icon"
        :ariaLabel="label"
        :variant="variant"
        :size="size"
        :disabled="disabled"
        iconTransition
        @click="onCopy"
      />
    </Tooltip>
    <span
      role="status"
      class="sr-only"
      :data-testid="`${testId}__status`"
      >{{ copied ? label : '' }}</span
    >
    <CopyButtonFallback
      v-if="fallbackRequested"
      v-model:open="fallbackOpen"
      :value="value"
      :anchor="rootEl?.querySelector('button') ?? rootEl"
      :test-id="testId"
    />
  </span>
</template>
