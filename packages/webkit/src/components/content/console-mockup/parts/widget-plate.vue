<script setup lang="ts">
  import { type Component, computed } from 'vue'

  import type { ConsoleMockupPlating } from '../plates'
  import ConsoleMockupShell, { type ConsoleMockupShellVariant } from './console-mockup-shell.vue'

  defineOptions({ name: 'WidgetPlate' })

  interface Props {
    /** Testid of the ConsoleMockup root the widget is drawn in. */
    testId: string
    /** Plating of a fragment; a window frames it, anything else draws the widget alone. */
    variant?: ConsoleMockupShellVariant | null
    /** Registry plating of the widget; its title labels the window's console bar. */
    plate?: ConsoleMockupPlating | null
    /** The loaded widget. */
    widget: Component
    /** Props the loaded widget declares. */
    declared: string[]
    /** The ConsoleMockup props, forwarded to the widget when it declares them. */
    values: Record<string, unknown>
  }

  const props = withDefaults(defineProps<Props>(), { variant: null, plate: null })

  const FORWARDED = [
    'active',
    'hovered',
    'variant',
    'chrome',
    'width',
    'fade',
    'texture',
    'tab',
    'autoplayInterval'
  ]

  const forwarded = computed(() =>
    Object.fromEntries(
      FORWARDED.filter(
        (key) => props.values[key] !== undefined && props.declared.includes(key)
      ).map((key) => [key, props.values[key]])
    )
  )
</script>

<template>
  <ConsoleMockupShell
    v-if="variant === 'window'"
    :data-testid="`${testId}__frame`"
    variant="window"
    fade="bottom"
    :title="plate?.title"
    :chrome="values['chrome'] !== false"
    :active="values['active'] !== false"
    :width="468"
    :mobile-width="428"
    :style="{ '--console-mockup-fade-start': '80%' }"
  >
    <div
      :data-testid="`${testId}__frame-body`"
      class="h-full w-full px-(--spacing-lg) pt-(--spacing-lg)"
      :style="{
        '--console-mockup-fade-color': 'var(--bg-canvas)',
        '--console-mockup-fade-start': 'initial'
      }"
    >
      <component
        :is="widget"
        v-bind="forwarded"
      />
    </div>
  </ConsoleMockupShell>
  <component
    :is="widget"
    v-else
    v-bind="forwarded"
  />
</template>
