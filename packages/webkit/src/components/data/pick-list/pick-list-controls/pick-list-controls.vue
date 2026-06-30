<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { pickListContextKey } from '../injection-key'

  defineOptions({
    name: 'PickListControls',
    inheritAttrs: false
  })

  const ctx = inject(pickListContextKey)
  if (!ctx) {
    throw new Error('PickListControls must be used inside <PickList>.')
  }

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'pick-list-controls'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex flex-row items-center justify-center gap-[var(--spacing-xs)] md:flex-col"
  >
    <button
      type="button"
      :disabled="ctx.disabled.value || ctx.anyLoading.value || !ctx.hasSelection('source')"
      aria-label="Move selected to target"
      :data-testid="`${testId}__move-to-target`"
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
      @click="ctx.move('to-target')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4"
      >
        <path d="M4 12h13" />
        <path d="M11 6l6 6-6 6" />
      </svg>
    </button>
    <button
      type="button"
      :disabled="ctx.disabled.value || ctx.anyLoading.value || ctx.count('source') === 0"
      aria-label="Move all to target"
      :data-testid="`${testId}__move-all-to-target`"
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
      @click="ctx.moveAll('to-target')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4"
      >
        <path d="M3 12h11" />
        <path d="M9 7l5 5-5 5" />
        <path d="M20 5v14" />
      </svg>
    </button>
    <button
      type="button"
      :disabled="ctx.disabled.value || ctx.anyLoading.value || !ctx.hasSelection('target')"
      aria-label="Move selected to source"
      :data-testid="`${testId}__move-to-source`"
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
      @click="ctx.move('to-source')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4"
      >
        <path d="M20 12H7" />
        <path d="M13 6l-6 6 6 6" />
      </svg>
    </button>
    <button
      type="button"
      :disabled="ctx.disabled.value || ctx.anyLoading.value || ctx.count('target') === 0"
      aria-label="Move all to source"
      :data-testid="`${testId}__move-all-to-source`"
      class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
      @click="ctx.moveAll('to-source')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4"
      >
        <path d="M21 12H10" />
        <path d="M15 7l-5 5 5 5" />
        <path d="M4 5v14" />
      </svg>
    </button>
  </div>
</template>
