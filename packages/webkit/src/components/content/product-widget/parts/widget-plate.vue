<script setup lang="ts">
  import { type Component, computed } from 'vue'

  import ShellMockup, { type ShellMockupKind } from '../../shell-mockup/shell-mockup.vue'
  import type { ProductWidgetPlating } from '../plates'

  defineOptions({ name: 'WidgetPlate' })

  interface Props {
    /** Testid of the ProductWidget root the widget is drawn in. */
    testId: string
    /** Plating of a fragment; a window frames it, anything else draws the widget alone. */
    kind?: ShellMockupKind | null
    /** Registry plating of the widget; its title labels the window's console bar. */
    plate?: ProductWidgetPlating | null
    /** The loaded widget. */
    widget: Component
    /** Props the loaded widget declares. */
    declared: string[]
    /** The ProductWidget props, forwarded to the widget when it declares them. */
    values: Record<string, unknown>
  }

  const props = withDefaults(defineProps<Props>(), { kind: null, plate: null })

  const FORWARDED = [
    'active',
    'hover',
    'kind',
    'chrome',
    'width',
    'fade',
    'texture',
    'tab',
    'interval'
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
  <ShellMockup
    v-if="kind === 'window'"
    :data-testid="`${testId}__frame`"
    kind="window"
    fade="bottom"
    :title="plate?.title"
    :chrome="values['chrome'] !== false"
    :active="values['active'] !== false"
    :width="468"
    :mobile-width="428"
    style="--mockup-fade-start: 80%"
  >
    <div
      :data-testid="`${testId}__frame-body`"
      class="h-full w-full px-(--spacing-lg) pt-(--spacing-lg)"
      style="--mockup-fade-color: var(--bg-canvas); --mockup-fade-start: initial"
    >
      <component
        :is="widget"
        v-bind="forwarded"
      />
    </div>
  </ShellMockup>
  <component
    :is="widget"
    v-else
    v-bind="forwarded"
  />
</template>
