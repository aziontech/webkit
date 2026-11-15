<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import { transferListContextKey } from '../injection-key'

  defineOptions({
    name: 'TransferListControls',
    inheritAttrs: false
  })

  const ctx = inject(transferListContextKey)
  if (!ctx) {
    throw new Error('TransferListControls must be used inside <TransferList>.')
  }

  const attrs = useAttrs()
  const { t } = useTranslate({ transferList: en.transferList })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'transfer-list-controls'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex flex-row items-center justify-center gap-(--spacing-xs) md:flex-col"
  >
    <button
      type="button"
      :disabled="ctx.disabled.value || ctx.anyLoading.value || !ctx.hasSelection('source')"
      :aria-label="t('transferList.moveSelectedToTarget')"
      :data-testid="`${testId}__move-to-target`"
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
      @click="ctx.move($event, 'to-target')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4 rotate-90 md:rotate-0"
      >
        <path d="M4 12h13" />
        <path d="M11 6l6 6-6 6" />
      </svg>
    </button>
    <button
      type="button"
      :disabled="ctx.disabled.value || ctx.anyLoading.value || ctx.count('source') === 0"
      :aria-label="t('transferList.moveAllToTarget')"
      :data-testid="`${testId}__move-all-to-target`"
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
      @click="ctx.moveAll($event, 'to-target')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4 rotate-90 md:rotate-0"
      >
        <path d="M3 12h11" />
        <path d="M9 7l5 5-5 5" />
        <path d="M20 5v14" />
      </svg>
    </button>
    <button
      type="button"
      :disabled="ctx.disabled.value || ctx.anyLoading.value || !ctx.hasSelection('target')"
      :aria-label="t('transferList.moveSelectedToSource')"
      :data-testid="`${testId}__move-to-source`"
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
      @click="ctx.move($event, 'to-source')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4 rotate-90 md:rotate-0"
      >
        <path d="M20 12H7" />
        <path d="M13 6l-6 6 6 6" />
      </svg>
    </button>
    <button
      type="button"
      :disabled="ctx.disabled.value || ctx.anyLoading.value || ctx.count('target') === 0"
      :aria-label="t('transferList.moveAllToSource')"
      :data-testid="`${testId}__move-all-to-source`"
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
      @click="ctx.moveAll($event, 'to-source')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4 rotate-90 md:rotate-0"
      >
        <path d="M21 12H10" />
        <path d="M15 7l-5 5 5 5" />
        <path d="M4 5v14" />
      </svg>
    </button>
  </div>
</template>
