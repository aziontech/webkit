<script setup lang="ts">
  import { computed, inject, nextTick, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { TransferListInjectionKey, type TransferListMoveDirection } from '../injection-key'

  defineOptions({
    name: 'TransferListControls',
    inheritAttrs: false
  })

  const ctx = inject(TransferListInjectionKey)
  if (!ctx) {
    throw new Error('TransferListControls must be used inside <TransferList>.')
  }

  const attrs = useAttrs()
  const { t } = useTranslate({ transferList: en.transferList })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'transfer-list-controls'
  )

  const rootEl = ref<HTMLElement | null>(null)

  const locked = computed(() => ctx.disabled.value || ctx.anyLoading.value)

  interface MoveControl {
    key: string
    icon: string
    label: string
    disabled: boolean
    all: boolean
    direction: TransferListMoveDirection
  }

  const controls = computed<MoveControl[]>(() => [
    {
      key: 'move-to-target',
      icon: 'az az-arrow-right',
      label: t('transferList.moveSelectedToTarget'),
      disabled: locked.value || !ctx.hasSelection('source'),
      all: false,
      direction: 'to-target'
    },
    {
      key: 'move-all-to-target',
      icon: 'az az-arrow-right-to-line',
      label: t('transferList.moveAllToTarget'),
      disabled: locked.value || ctx.count('source') === 0,
      all: true,
      direction: 'to-target'
    },
    {
      key: 'move-to-source',
      icon: 'az az-arrow-left',
      label: t('transferList.moveSelectedToSource'),
      disabled: locked.value || !ctx.hasSelection('target'),
      all: false,
      direction: 'to-source'
    },
    {
      key: 'move-all-to-source',
      icon: 'az az-arrow-left-to-line',
      label: t('transferList.moveAllToSource'),
      disabled: locked.value || ctx.count('target') === 0,
      all: true,
      direction: 'to-source'
    }
  ])

  const COUNTERPART: Record<string, string> = {
    'move-to-target': 'move-to-source',
    'move-all-to-target': 'move-all-to-source',
    'move-to-source': 'move-to-target',
    'move-all-to-source': 'move-all-to-target'
  }

  const controlEl = (key: string): HTMLButtonElement | null =>
    rootEl.value?.querySelector<HTMLButtonElement>(`[data-testid="${testId.value}__${key}"]`) ??
    null

  async function keepFocus(key: string): Promise<void> {
    await nextTick()
    const clicked = controlEl(key)
    if (!clicked?.disabled || document.activeElement !== document.body) return
    const counterpart = controlEl(COUNTERPART[key] ?? '')
    const next = counterpart && !counterpart.disabled ? counterpart : null
    const fallback = rootEl.value?.querySelector<HTMLButtonElement>('button:not(:disabled)')
    ;(next ?? fallback)?.focus()
  }

  function onClick(event: MouseEvent, control: MoveControl) {
    if (control.all) ctx?.moveAll(event, control.direction)
    else ctx?.move(event, control.direction)
    void keepFocus(control.key)
  }
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    class="flex flex-row items-center justify-center gap-(--spacing-xs) md:flex-col"
  >
    <IconButton
      v-for="control in controls"
      :key="control.key"
      :icon="control.icon"
      :aria-label="control.label"
      variant="ghost"
      size="large"
      :disabled="control.disabled"
      icon-class="max-md:rotate-90 max-md:rtl:-rotate-90"
      :data-testid="`${testId}__${control.key}`"
      @click="onClick($event, control)"
    />
  </div>
</template>
