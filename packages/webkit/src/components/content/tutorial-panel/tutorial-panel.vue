<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import HelpPanel from '../help-panel/help-panel.vue'
  import HelpPanelHeader from '../help-panel/help-panel-header/help-panel-header.vue'
  import HelpPanelTask from '../help-panel/help-panel-task/help-panel-task.vue'
  import HelpPanelTutorial from '../help-panel/help-panel-tutorial/help-panel-tutorial.vue'
  import type { HelpPanelTaskStatus } from '../help-panel/injection-key'
  import Tag from '../tag/tag.vue'
  import { useTutorialContext } from './composables/use-tutorial-context'
  import type { Tutorial } from './injection-key'

  defineOptions({
    name: 'TutorialPanel',
    inheritAttrs: false
  })

  interface Props {
    /** The panel's heading. Empty uses the locale catalog (`Tutorials`). */
    title?: string
    /** One line under the heading. Empty uses the locale catalog. */
    description?: string
    /** Accessible name for the panel's landmark. Empty uses the title. */
    ariaLabel?: string
    /** Renders skeleton lines in place of the content while the tutorials load. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    ariaLabel: '',
    loading: false
  })

  defineSlots<{
    /** Extra content on the completion screen, such as a feedback link. */
    completion?(scope: { tutorial: Tutorial }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tutorialPanel: en.tutorialPanel })
  const context = useTutorialContext()
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-tutorial-panel'
  )

  const heading = computed<string>(() => props.title || t('tutorialPanel.title'))
  const lede = computed<string>(() => props.description || t('tutorialPanel.description'))

  const listHeading = ref<globalThis.HTMLElement | null>(null)
  const doneHeading = ref<globalThis.HTMLElement | null>(null)
  const root = ref<globalThis.HTMLElement | null>(null)

  const taskRanges = computed(() => {
    const ranges: { first: number; last: number }[] = []
    let cursor = 0
    context.active.value?.tasks.forEach((task) => {
      ranges.push({ first: cursor, last: cursor + task.steps.length - 1 })
      cursor += task.steps.length
    })
    return ranges
  })

  const taskStatus = (taskIndex: number): HelpPanelTaskStatus => {
    const range = taskRanges.value[taskIndex]
    if (!range) return 'upcoming'
    if (context.step.value > range.last) return 'complete'
    if (context.step.value >= range.first) return 'current'
    return 'upcoming'
  }

  const stepIndex = (taskIndex: number, local: number): number =>
    (taskRanges.value[taskIndex]?.first ?? 0) + local

  const stepCount = (tutorial: Tutorial): number =>
    tutorial.tasks.reduce((sum, task) => sum + task.steps.length, 0)

  const focusCurrentStep = () => {
    root.value
      ?.querySelector<globalThis.HTMLElement>('[data-tutorial-step][aria-current="step"]')
      ?.focus({ preventScroll: true })
  }

  watch(
    () => context.focusRequest.value,
    async () => {
      await nextTick()
      if (context.finished.value) return
      const current = context.steps.value[context.step.value]
      if (current && !context.hasHotspot(current.hotspotId)) focusCurrentStep()
    },
    { flush: 'post' }
  )

  watch(
    () => context.finished.value,
    async (finished) => {
      if (!finished) return
      await nextTick()
      doneHeading.value?.focus({ preventScroll: true })
    },
    { flush: 'post' }
  )

  const exit = async () => {
    context.exit()
    await nextTick()
    listHeading.value?.focus({ preventScroll: true })
  }
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    :data-testid="testId"
    :data-view="context.active.value ? (context.finished.value ? 'complete' : 'running') : 'list'"
    class="flex w-full flex-col"
  >
    <HelpPanel
      :aria-label="ariaLabel || heading"
      :loading="loading"
      :data-testid="`${testId}__panel`"
    >
      <HelpPanelHeader
        :title="heading"
        :description="lede"
      />

      <template v-if="!context.active.value">
        <h3
          ref="listHeading"
          tabindex="-1"
          class="sr-only"
        >
          {{ t('tutorialPanel.listLabel') }}
        </h3>
        <p
          v-if="context.tutorials.value.length === 0"
          :data-testid="`${testId}__empty`"
          class="text-body-sm text-(--text-muted)"
        >
          {{ t('tutorialPanel.empty') }}
        </p>
        <ul
          v-else
          :data-testid="`${testId}__list`"
          class="flex w-full flex-col gap-(--spacing-sm)"
        >
          <li
            v-for="tutorial in context.tutorials.value"
            :key="tutorial.id"
            :data-testid="`${testId}__item`"
            :data-completed="tutorial.completed || null"
            class="flex w-full flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
          >
            <div class="flex flex-wrap items-center gap-(--spacing-xs)">
              <h3
                :id="`${uid}-${tutorial.id}`"
                class="text-heading-xxs text-(--text-default)"
              >
                {{ tutorial.title }}
              </h3>
              <Tag
                v-if="tutorial.completed"
                :label="t('tutorialPanel.completed')"
                severity="success"
                size="small"
              />
            </div>
            <p
              v-if="tutorial.description"
              class="text-body-sm text-(--text-muted)"
            >
              {{ tutorial.description }}
            </p>
            <p class="text-label-sm text-(--text-muted)">
              {{ t('tutorialPanel.taskCount', { count: tutorial.tasks.length }) }} ·
              {{ t('tutorialPanel.stepCount', { count: stepCount(tutorial) }) }}
            </p>
            <div class="flex">
              <Button
                :label="tutorial.completed ? t('tutorialPanel.restart') : t('tutorialPanel.start')"
                :kind="tutorial.completed ? 'outlined' : 'primary'"
                size="small"
                :aria-describedby="`${uid}-${tutorial.id}`"
                :data-testid="`${testId}__start`"
                @click="context.start(tutorial.id)"
              />
            </div>
          </li>
        </ul>
      </template>

      <template v-else>
        <section
          v-if="context.finished.value"
          :aria-labelledby="`${uid}-done`"
          :data-testid="`${testId}__completion`"
          class="flex w-full flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
        >
          <h3
            :id="`${uid}-done`"
            ref="doneHeading"
            tabindex="-1"
            class="flex items-center gap-(--spacing-xxs) text-heading-xxs text-(--text-default) outline-none"
          >
            <span
              aria-hidden="true"
              class="pi pi-check-circle text-(--text-success)"
            />
            {{ t('tutorialPanel.completedTitle') }}
          </h3>
          <p class="text-body-sm text-(--text-muted)">
            {{ t('tutorialPanel.completedDescription', { title: context.active.value.title }) }}
          </p>
          <slot
            name="completion"
            :tutorial="context.active.value"
          />
          <div class="flex flex-wrap items-center gap-(--spacing-xs)">
            <Button
              :label="t('tutorialPanel.restart')"
              kind="outlined"
              size="small"
              :data-testid="`${testId}__restart`"
              @click="context.start(context.active.value.id)"
            />
            <Button
              :label="t('tutorialPanel.back')"
              kind="transparent"
              size="small"
              :data-testid="`${testId}__back`"
              @click="exit"
            />
          </div>
        </section>

        <HelpPanelTutorial
          :title="context.active.value.title"
          :description="context.active.value.description"
          :completed="context.finished.value"
          :data-testid="`${testId}__tutorial`"
        >
          <HelpPanelTask
            v-for="(task, taskIndex) in context.active.value.tasks"
            :key="`${context.active.value.id}-${taskIndex}`"
            :title="task.title"
            :status="taskStatus(taskIndex)"
          >
            <ol class="flex w-full flex-col gap-(--spacing-xxs)">
              <li
                v-for="(item, local) in task.steps"
                :key="item.hotspotId"
                data-tutorial-step
                :tabindex="stepIndex(taskIndex, local) === context.step.value ? -1 : undefined"
                :aria-current="
                  stepIndex(taskIndex, local) === context.step.value ? 'step' : undefined
                "
                class="text-body-sm text-(--text-muted) outline-none aria-[current=step]:text-label-md aria-[current=step]:text-(--text-default)"
              >
                {{ item.title }}
              </li>
            </ol>
          </HelpPanelTask>
          <template
            v-if="!context.finished.value"
            #actions
          >
            <Button
              :label="t('tutorialPanel.exit')"
              kind="outlined"
              size="small"
              icon="pi pi-sign-out"
              :data-testid="`${testId}__exit`"
              @click="exit"
            />
          </template>
        </HelpPanelTutorial>
      </template>
    </HelpPanel>
  </div>
</template>
