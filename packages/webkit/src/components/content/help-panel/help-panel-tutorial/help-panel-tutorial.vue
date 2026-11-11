<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId, useSlots } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import { hasRenderedContent } from '../../../../utils/rendered-content'
  import Tag from '../../tag/tag.vue'
  import type { HelpPanelTaskHandle, HelpPanelTaskStatus } from '../injection-key'
  import { HelpPanelTutorialInjectionKey } from '../injection-key'

  defineOptions({
    name: 'HelpPanelTutorial',
    inheritAttrs: false
  })

  interface Props {
    /** The tutorial's name. */
    title?: string
    /** One line on what the reader will have done at the end; not rendered when empty. */
    description?: string
    /** The owner marks the whole tutorial done; renders a Completed tag beside the title. */
    completed?: boolean
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    completed: false
  })

  defineSlots<{
    /** HelpPanel.Task items, in order. */
    default(): unknown
    /** The Start, Continue or Restart controls; the row is not rendered when empty. */
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useLocale({ helpPanel: en.helpPanel })
  const slots = useSlots()
  const headingId = useId()

  const tasks = ref<symbol[]>([])
  const statuses = new Map<symbol, () => HelpPanelTaskStatus>()
  const elements = new Map<symbol, globalThis.HTMLElement>()

  const ordered = computed(() =>
    [...tasks.value].sort((a, b) => {
      const left = elements.get(a)
      const right = elements.get(b)
      if (!left || !right) return 0
      const relation = left.compareDocumentPosition(right)
      if (relation & globalThis.Node.DOCUMENT_POSITION_FOLLOWING) return -1
      if (relation & globalThis.Node.DOCUMENT_POSITION_PRECEDING) return 1
      return 0
    })
  )

  const total = computed<number>(() => tasks.value.length)

  const complete = computed<number>(
    () => tasks.value.filter((id) => statuses.get(id)?.() === 'complete').length
  )

  const register = (id: symbol, status: () => HelpPanelTaskStatus): HelpPanelTaskHandle => {
    statuses.set(id, status)
    tasks.value.push(id)
    return {
      index: computed(() => ordered.value.indexOf(id) + 1)
    }
  }

  const attach = (id: symbol, el: globalThis.HTMLElement | null) => {
    if (el) elements.set(id, el)
    else elements.delete(id)
    tasks.value = [...tasks.value]
  }

  const unregister = (id: symbol) => {
    elements.delete(id)
    statuses.delete(id)
    const at = tasks.value.indexOf(id)
    if (at !== -1) tasks.value.splice(at, 1)
  }

  provide(HelpPanelTutorialInjectionKey, {
    register,
    attach,
    unregister,
    total,
    complete
  })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-help-panel-tutorial'
  )

  const hasActions = () => hasRenderedContent(slots['actions']?.() ?? [])
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-labelledby="title ? headingId : undefined"
    :data-testid="testId"
    :data-completed="completed || null"
    class="flex w-full flex-col gap-(--spacing-sm)"
  >
    <div class="flex w-full flex-col gap-(--spacing-xs)">
      <div
        v-if="title || completed"
        class="flex flex-wrap items-center gap-(--spacing-xs)"
      >
        <h3
          v-if="title"
          :id="headingId"
          class="text-heading-xxs text-(--text-default)"
        >
          {{ title }}
        </h3>
        <Tag
          v-if="completed"
          :data-testid="`${testId}__completed`"
          :label="t('helpPanel.tutorialCompleted')"
          severity="success"
          size="small"
        />
      </div>
      <p
        v-if="description"
        class="text-body-sm text-(--text-muted)"
      >
        {{ description }}
      </p>
      <p
        :data-testid="`${testId}__progress`"
        aria-live="polite"
        class="text-label-sm text-(--text-muted)"
      >
        {{ t('helpPanel.tutorialProgress', { complete, total }) }}
      </p>
    </div>
    <ol class="flex w-full flex-col gap-(--spacing-sm)">
      <slot />
    </ol>
    <div
      v-if="hasActions()"
      :data-testid="`${testId}__actions`"
      class="flex flex-wrap items-center gap-(--spacing-xs)"
    >
      <slot name="actions" />
    </div>
  </section>
</template>
