<script setup lang="ts">
  import { computed, ref } from 'vue'

  import { useMockupAnchors } from '../composables/use-mockup-anchors'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import ConsoleMockupShell, { type ConsoleMockupShellShell } from './console-mockup-shell.vue'
  import MockupCursor from './mockup-cursor.vue'

  defineOptions({ name: 'MockupScrollColumn' })

  interface Props {
    /** Whether the fragment is the one showing. */
    active?: boolean
    /** Console generation the shell draws. */
    shell?: ConsoleMockupShellShell
    /** Index of the anchor the column is lifted to; null leaves it at rest. */
    anchor: number | null
    /** Space kept above the anchor the column is lifted to, in pixels. */
    lead: number
    /** Measures the anchors again whenever the column changes size. */
    observe?: boolean
    /** Layout classes of the column. */
    columnClass?: string
    /** Where the collaborator cursor points; empty draws no cursor. */
    cursor?: MockupCursorTarget
    /** The person the cursor belongs to. */
    cursorName?: string
    /** Whether the cursor is pressing. */
    pressed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    active: true,
    shell: 'console',
    observe: false,
    columnClass: '',
    cursor: undefined,
    cursorName: '',
    pressed: false
  })

  defineSlots<{
    /** The parts of the column; an element marked data-anchor is a place the column can be lifted to. */
    default(): unknown
  }>()

  const HIDDEN: MockupCursorTarget = { key: '' }

  const stageEl = ref<globalThis.HTMLElement | null>(null)
  const columnEl = ref<globalThis.HTMLElement | null>(null)

  const { offsets, measure } = useMockupAnchors(columnEl, { observe: props.observe })
  const { position } = useMockupCursor(stageEl, () => props.cursor ?? HIDDEN, columnEl)

  const lift = computed(() =>
    props.anchor === null ? 0 : props.lead - (offsets.value[props.anchor] ?? 0)
  )
  const scrollStyle = computed(() => ({ translate: `0 ${lift.value}px` }))

  defineExpose({
    /** Reads where each anchor sits, before the column is lifted to one. */
    measure
  })

  const COLUMN_CLASS =
    'relative py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none'
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    :shell="shell"
    :fade="anchor === null ? 'bottom' : 'y'"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      v-if="cursor"
      ref="stageEl"
      class="relative"
    >
      <div
        ref="columnEl"
        :style="scrollStyle"
        :class="[COLUMN_CLASS, columnClass]"
      >
        <slot />
      </div>

      <MockupCursor
        :name="cursorName"
        :x="position.x"
        :y="position.y"
        :pressed="pressed"
      />
    </div>
    <div
      v-else
      ref="columnEl"
      :style="scrollStyle"
      :class="[COLUMN_CLASS, columnClass]"
    >
      <slot />
    </div>
  </ConsoleMockupShell>
</template>
