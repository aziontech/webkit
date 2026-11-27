<script setup lang="ts">
  import { ref } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import ConsoleMockupShell, {
    type ConsoleMockupShellFade,
    type ConsoleMockupShellShell
  } from './console-mockup-shell.vue'
  import MockupCursor from './mockup-cursor.vue'

  defineOptions({ name: 'MockupFragment' })

  interface Props {
    /** Whether the fragment is the one showing. */
    active?: boolean
    /** Console generation the shell draws. */
    shell?: ConsoleMockupShellShell
    /** Edge the fragment fades out along. */
    fade?: ConsoleMockupShellFade
    /** Design width of the fragment from md up. */
    width?: number
    /** Design width of the fragment below md. */
    mobileWidth?: number
    /** Lets the viewer operate the controls inside. */
    interactive?: boolean
    /** Where the collaborator cursor points; empty draws no cursor and no stage around the parts. */
    cursor?: MockupCursorTarget
    /** The person the cursor belongs to. */
    cursorName?: string
    /** Whether the cursor is pressing. */
    pressed?: boolean
    /** Layout classes of the stage the cursor moves over. */
    stageClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    active: true,
    shell: 'console',
    fade: 'bottom',
    width: 420,
    mobileWidth: 380,
    interactive: false,
    cursor: undefined,
    cursorName: '',
    pressed: false,
    stageClass: ''
  })

  defineSlots<{
    /** The parts of the fragment. */
    default(): unknown
  }>()

  const HIDDEN: MockupCursorTarget = { key: '' }

  const stageEl = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stageEl, () => props.cursor ?? HIDDEN)
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    :shell="shell"
    :fade="fade"
    :chrome="false"
    :active="active"
    :interactive="interactive"
    :width="width"
    :mobile-width="mobileWidth"
  >
    <div
      v-if="cursor"
      ref="stageEl"
      :class="['relative', stageClass]"
    >
      <slot />

      <MockupCursor
        :name="cursorName"
        :x="position.x"
        :y="position.y"
        :pressed="pressed"
      />
    </div>
    <slot v-else />
  </ConsoleMockupShell>
</template>
