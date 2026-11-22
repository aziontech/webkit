<script setup lang="ts">
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'

  defineOptions({ name: 'AppLayoutSplitPanel' })

  interface Props {
    /** Whether the panel sits beside the content instead of under it. */
    side: boolean
    /** Height (under) or width (beside) in pixels. */
    size: number
    /** Smallest size the separator allows. */
    minSize: number
    /** Largest size the separator allows. */
    maxSize: number
    /** Whether the separator is being dragged. */
    resizing: boolean
    /** Whether the layout is compact; hides the position toggle. */
    compact: boolean
    /** Heading of the panel. */
    title: string
    /** Id of the panel. */
    panelId: string
    /** Id of the heading. */
    titleId: string
    /** Test id of the layout that owns the panel. */
    layoutTestId: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    /** The separator was pressed to start a resize. */
    resize: [event: PointerEvent]
    /** A key was pressed on the separator. */
    'separator-keydown': [event: KeyboardEvent]
    /** The position toggle was pressed. */
    'toggle-position': [event: MouseEvent]
    /** The close control was pressed. */
    close: [event: MouseEvent]
  }>()

  defineSlots<{
    /** The panel's body. */
    default(): unknown
  }>()

  const { t } = useTranslate({ appLayout: en.appLayout })

  const SEPARATOR_ROW_CLASS =
    'absolute inset-x-0 top-0 z-10 h-(--spacing-2xs) cursor-row-resize bg-transparent outline-none transition-colors duration-fast-02 ease-productive-entrance ' +
    "before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] hover:bg-(--border-strong) focus-visible:bg-(--accent) focus-visible:ring-2 focus-visible:ring-(--ring-color) " +
    'data-[resizing]:bg-(--accent) ' +
    'motion-reduce:transition-none'

  const SEPARATOR_COLUMN_CLASS =
    'absolute inset-y-0 start-0 z-10 w-(--spacing-2xs) cursor-col-resize bg-transparent outline-none transition-colors duration-fast-02 ease-productive-entrance ' +
    "before:absolute before:inset-y-0 before:-inset-x-2 before:content-[''] hover:bg-(--border-strong) focus-visible:bg-(--accent) focus-visible:ring-2 focus-visible:ring-(--ring-color) " +
    'data-[resizing]:bg-(--accent) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <section
    :id="panelId"
    :aria-labelledby="titleId"
    :data-testid="`${layoutTestId}__split-panel`"
    :class="
      side
        ? 'relative flex h-full min-h-0 shrink-0 flex-col border-s border-(--border-default) bg-(--bg-surface)'
        : 'relative flex min-h-0 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)'
    "
    :style="side ? { width: `${size}px` } : { height: `${size}px` }"
  >
    <div
      role="separator"
      tabindex="0"
      :aria-orientation="side ? 'vertical' : 'horizontal'"
      :aria-label="t('appLayout.resizeSplitPanel')"
      :aria-controls="panelId"
      :aria-valuenow="size"
      :aria-valuemin="minSize"
      :aria-valuemax="maxSize"
      :data-testid="`${layoutTestId}__split-separator`"
      :data-resizing="resizing || null"
      :class="side ? SEPARATOR_COLUMN_CLASS : SEPARATOR_ROW_CLASS"
      @pointerdown="emit('resize', $event)"
      @keydown="emit('separator-keydown', $event)"
    />
    <div
      class="flex h-(--spacing-2xl) shrink-0 items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md)"
    >
      <h2
        :id="titleId"
        class="m-0 min-w-0 flex-1 truncate text-heading-2xs text-(--text-default)"
      >
        {{ title || t('appLayout.splitPanel') }}
      </h2>
      <IconButton
        v-if="side || !compact"
        :icon="side ? 'az az-window-minimize' : 'az az-app-window'"
        :ariaLabel="side ? t('appLayout.showAtBottom') : t('appLayout.showAtSide')"
        variant="ghost"
        size="small"
        :data-testid="`${layoutTestId}__split-position`"
        @click="emit('toggle-position', $event)"
      />
      <IconButton
        icon="az az-x"
        :ariaLabel="t('appLayout.closeSplitPanel')"
        variant="ghost"
        size="small"
        :data-testid="`${layoutTestId}__split-close`"
        @click="emit('close', $event)"
      />
    </div>
    <div
      tabindex="0"
      role="group"
      :aria-labelledby="titleId"
      class="min-h-0 flex-1 overflow-auto p-(--spacing-md) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
    >
      <slot />
    </div>
  </section>
</template>
