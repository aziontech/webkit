<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { useTutorialPanelTasksContext } from '../composables/use-tutorial-panel-tasks-context'
  import type { TutorialTaskStatus } from '../injection-key'

  defineOptions({
    name: 'TutorialPanelTask',
    inheritAttrs: false
  })

  interface Props {
    /** What the reader does, in their words. */
    title?: string
    /** Whether the reader has done the task; set by the owner from what the real UI confirmed. */
    status?: TutorialTaskStatus
    /** The task the reader is on; renders aria-current="step". */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    status: 'pending',
    active: false
  })

  defineSlots<{
    /** The task's instructions. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ helpPanel: en.helpPanel, tutorialPanel: en.tutorialPanel })
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
    if (props.active) return t('tutorialPanel.taskCurrent')
    if (props.status === 'success') return t('tutorialPanel.taskComplete')
    return t('tutorialPanel.taskNotStarted')
  })
</script>

<template>
  <li
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    :data-status="status"
    :data-active="active || null"
    :aria-current="active ? 'step' : undefined"
    class="group/task flex w-full items-start gap-(--spacing-2xs)"
  >
    <span
      aria-hidden="true"
      class="flex size-6 shrink-0 items-center justify-center rounded-(--radius-full) border border-(--border-default) bg-(--bg-surface) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[active]/task:border-(--secondary) group-data-[active]/task:text-(--text-default) group-data-[status=success]/task:border-(--secondary) group-data-[status=success]/task:bg-(--secondary) group-data-[status=success]/task:text-(--secondary-foreground) motion-reduce:transition-none"
    >
      <span
        v-if="status === 'success' && !active"
        class="ai ai-check text-label-sm"
      />
      <span v-else>{{ index }}</span>
    </span>
    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
      <span
        class="flex min-h-6 items-center text-label-md text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[active]/task:text-(--text-default) group-data-[status=success]/task:text-(--text-default) motion-reduce:transition-none"
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
