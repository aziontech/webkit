<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, useAttrs } from 'vue'

  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Tag from '../../content/tag/tag.vue'
  import InputText from '../../inputs/input-text/input-text.vue'
  import { useLogViewContext } from './composables/use-log-view-context'

  defineOptions({
    name: 'LogViewHeader',
    inheritAttrs: false
  })

  defineSlots<{
    left(): unknown
    right(): unknown
    search(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useLogViewContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__header`
  )

  const copied = ref(false)
  let copiedTimer: ReturnType<typeof setTimeout> | undefined

  const copyIcon = computed(() => (copied.value ? 'pi pi-check' : 'pi pi-copy'))
  const copyAriaLabel = computed(() => (copied.value ? 'Copied logs' : 'Copy logs'))

  const handleCopy = async () => {
    const didCopy = await ctx.copyLogs()

    if (!didCopy) return

    copied.value = true

    if (copiedTimer) clearTimeout(copiedTimer)

    copiedTimer = setTimeout(() => {
      copied.value = false
      copiedTimer = undefined
    }, 2000)
  }

  onBeforeUnmount(() => {
    if (copiedTimer) clearTimeout(copiedTimer)
  })

  const handleWarningsKeydown = (event: globalThis.KeyboardEvent) => {
    if (ctx.disabled.value) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ctx.toggleWarningsOnly()
    }
  }

  const handleCopyKeydown = (event: globalThis.KeyboardEvent) => {
    if (!ctx.canCopy.value) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      void handleCopy()
    }
  }
</script>

<template>
  <header
    v-bind="attrs"
    :data-testid="testId"
    class="flex shrink-0 flex-col gap-[var(--spacing-sm)] border-b border-[var(--border-muted)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] py-[var(--spacing-sm)] sm:h-[48px] sm:flex-row sm:items-center sm:justify-between sm:py-0"
  >
    <div
      :data-testid="`${testId}__left`"
      class="flex w-full min-w-0 items-center gap-[var(--spacing-sm)] sm:w-auto"
    >
      <slot name="left">
        <IconButton
          v-if="ctx.showCopy.value"
          kind="transparent"
          size="medium"
          :icon="copyIcon"
          :ariaLabel="copyAriaLabel"
          :disabled="!ctx.canCopy.value"
          :data-testid="`${testId}__copy`"
          :data-copied="copied || null"
          @click="handleCopy"
          @keydown="handleCopyKeydown"
        />

        <span
          :data-testid="`${testId}__line-count`"
          class="font-code text-label-sm text-[var(--text-muted)]"
        >
          {{ ctx.lineCountLabel.value }}
        </span>

        <button
          v-if="ctx.warningCount.value > 0"
          type="button"
          :data-testid="`${testId}__warnings-filter`"
          :aria-pressed="ctx.warningsOnly.value"
          :disabled="ctx.disabled.value"
          class="inline-flex h-8 min-w-8 items-center justify-center rounded-[var(--shape-elements)] p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:opacity-60"
          @click="ctx.toggleWarningsOnly"
          @keydown="handleWarningsKeydown"
        >
          <Tag
            severity="warning"
            icon="pi pi-exclamation-triangle"
            :value="ctx.warningTagLabel.value"
          />
        </button>
      </slot>
    </div>

    <div
      :data-testid="`${testId}__right`"
      class="flex w-full min-w-0 flex-col gap-[var(--spacing-sm)] sm:flex-row sm:items-center sm:gap-[var(--spacing-sm)] sm:w-auto"
    >
      <slot name="right">
        <slot name="search">
          <span
            :data-testid="`${testId}__search`"
            class="relative flex w-full min-w-0 items-center sm:min-w-[12rem] sm:flex-1"
          >
            <i
              class="pi pi-search pointer-events-none absolute left-[var(--spacing-xs)] z-[2] text-[length:0.875rem] leading-none text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <InputText
              size="small"
              class="w-full [&_input]:pl-[calc(var(--spacing-xs)+1.25rem)]"
              :model-value="ctx.search.value"
              :placeholder="ctx.searchPlaceholder.value"
              :disabled="ctx.disabled.value"
              aria-label="Search logs"
              :data-testid="`${testId}__search-input`"
              @update:model-value="ctx.setSearch"
            />
          </span>
        </slot>
      </slot>
    </div>
  </header>
</template>
