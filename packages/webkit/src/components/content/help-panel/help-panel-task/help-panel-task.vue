<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { useHelpPanelTutorialContext } from '../composables/use-help-panel-tutorial-context'
  import type { HelpPanelTaskStatus } from '../injection-key'

  defineOptions({
    name: 'HelpPanelTask',
    inheritAttrs: false
  })

  interface Props {
    /** What the reader does, in their words. */
    title?: string
    /** Where the reader is in the tutorial; set by the owner from what the real UI confirmed. */
    status?: HelpPanelTaskStatus
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    status: 'upcoming'
  })

  defineSlots<{
    /** The task's instructions. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const context = useHelpPanelTutorialContext()

  const id = Symbol('HelpPanelTask')
  const { index } = context.register(id, () => props.status)
  const root = ref<globalThis.HTMLElement | null>(null)

  onMounted(() => context.attach(id, root.value))
  onBeforeUnmount(() => context.unregister(id))

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-help-panel-task'
  )

  const statusLabel = computed<string>(() => {
    if (props.status === 'complete') return 'Complete'
    if (props.status === 'current') return 'Current task'
    return 'Not started'
  })
</script>

<template>
  <li
    ref="root"
    v-bind="$attrs"
    :data-testid="testId"
    :data-status="status"
    :aria-current="status === 'current' ? 'step' : undefined"
    class="group/task flex w-full items-start gap-(--spacing-xxs)"
  >
    <span
      aria-hidden="true"
      class="flex size-6 shrink-0 items-center justify-center rounded-(--radius-full) border border-(--border-default) bg-(--bg-surface) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[status=current]/task:border-(--secondary) group-data-[status=current]/task:text-(--text-default) group-data-[status=complete]/task:border-(--secondary) group-data-[status=complete]/task:bg-(--secondary) group-data-[status=complete]/task:text-(--secondary-contrast) motion-reduce:transition-none"
    >
      <span
        v-if="status === 'complete'"
        class="pi pi-check text-label-sm"
      />
      <span v-else>{{ index }}</span>
    </span>
    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
      <span
        class="flex min-h-6 items-center text-label-md text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[status=current]/task:text-(--text-default) group-data-[status=complete]/task:text-(--text-default) motion-reduce:transition-none"
        >{{ title }}</span
      >
      <span class="sr-only">{{ statusLabel }}</span>
      <div
        v-if="$slots['default']"
        class="text-body-sm text-(--text-muted)"
      >
        <slot />
      </div>
    </div>
  </li>
</template>
