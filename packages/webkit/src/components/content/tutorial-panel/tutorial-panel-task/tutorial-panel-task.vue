<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import { useTutorialPanelTasksContext } from '../composables/use-tutorial-panel-tasks-context'
  import type { TutorialTaskStatus } from '../injection-key'

  defineOptions({
    name: 'TutorialPanelTask',
    inheritAttrs: false
  })

  interface Props {
    /** What the reader does, in their words. */
    title?: string
    /** Where the reader is in the tutorial; set by the owner from what the real UI confirmed. */
    status?: TutorialTaskStatus
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
  const { t } = useTranslate({ helpPanel: en.helpPanel })
  const context = useTutorialPanelTasksContext()

  const id = Symbol('TutorialPanelTask')
  const { index } = context.register(id, () => props.status)
  const rootEl = ref<globalThis.HTMLElement | null>(null)

  onMounted(() => context.attach(id, rootEl.value))
  onBeforeUnmount(() => context.unregister(id))

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-tutorial-panel-task'
  )

  const statusLabel = computed<string>(() => {
    if (props.status === 'complete') return t('helpPanel.taskComplete')
    if (props.status === 'current') return t('helpPanel.taskCurrent')
    return t('helpPanel.taskNotStarted')
  })
</script>

<template>
  <li
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    :data-status="status"
    :aria-current="status === 'current' ? 'step' : undefined"
    class="group/task flex w-full items-start gap-(--spacing-2xs)"
  >
    <span
      aria-hidden="true"
      class="flex size-6 shrink-0 items-center justify-center rounded-(--radius-full) border border-(--border-default) bg-(--bg-surface) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[status=current]/task:border-(--secondary) group-data-[status=current]/task:text-(--text-default) group-data-[status=complete]/task:border-(--secondary) group-data-[status=complete]/task:bg-(--secondary) group-data-[status=complete]/task:text-(--secondary-foreground) motion-reduce:transition-none"
    >
      <span
        v-if="status === 'complete'"
        class="ai ai-check text-label-sm"
      />
      <span v-else>{{ index }}</span>
    </span>
    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
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
