<script setup lang="ts">
  import type { CodeBlockTab } from '@aziontech/webkit/code-block'
  import CodeBlock from '@aziontech/webkit/code-block'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { computed, onMounted, onScopeDispose, ref, shallowRef } from 'vue'

  import { typeInto, useSceneScript } from '../composables/use-scene-script'
  import { TERMINAL_SCRIPTS } from '../data/functions-start.js'

  type ScriptName = keyof typeof TERMINAL_SCRIPTS

  interface TerminalLine {
    kind: 'command' | 'output' | 'gap'
    text: string
  }

  interface Props {
    /** Which recorded session plays: the full init-to-curl run, or the two-command deploy. */
    script?: ScriptName
    /** Whether this scene is the one showing; a scene that shares a frame plays only while it is. */
    active?: boolean
    /** Draws the pixel texture behind the block, for a frame with no backdrop of its own. */
    texture?: boolean
    /** Keeps only the latest lines that fit the frame's height, for a frame of fixed height. */
    fit?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    script: 'start',
    active: true,
    texture: true,
    fit: false
  })

  const LINE_HEIGHT = 20
  const CHROME = 72
  const MAX_LINES = 14

  const lines = computed<TerminalLine[]>(
    () => TERMINAL_SCRIPTS[props.script] ?? TERMINAL_SCRIPTS.start
  )

  const root = ref<HTMLElement | null>(null)
  const shown = shallowRef<TerminalLine[]>([])
  const capacity = ref(MAX_LINES)

  let observer: globalThis.ResizeObserver | null = null

  const measure = () => {
    const element = root.value
    if (!props.fit || !element?.clientHeight) return
    const inset = Number.parseFloat(getComputedStyle(element).paddingTop) * 2
    const fits = Math.floor((element.clientHeight - inset - CHROME) / LINE_HEIGHT)
    capacity.value = Math.min(MAX_LINES, Math.max(4, fits))
  }

  onMounted(() => {
    observer = new globalThis.ResizeObserver(measure)
    if (root.value) observer.observe(root.value)
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  const toText = (line: TerminalLine) => (line.kind === 'output' ? `# ${line.text}` : line.text)

  const tab = computed<CodeBlockTab>(() => ({
    label: 'Terminal',
    value: 'terminal',
    language: 'bash',
    code: shown.value.slice(-capacity.value).map(toText).join('\n') || ' ',
    fileName: 'terminal',
    fileIcon: 'pi pi-code'
  }))

  const push = (line: TerminalLine) => {
    shown.value = [...shown.value, line]
  }

  const rewrite = (line: TerminalLine) => {
    shown.value = [...shown.value.slice(0, -1), line]
  }

  useSceneScript(root, {
    hold: 6000,
    active: () => props.active,
    reset: () => {
      shown.value = []
    },
    settle: () => {
      shown.value = lines.value
    },
    play: async (wait) => {
      for (const line of lines.value) {
        if (line.kind === 'command') {
          push({ ...line, text: '' })
          await typeInto(wait, line.text, (text) => rewrite({ ...line, text }), {
            step: 1,
            every: 38
          })
          await wait(420)
        } else if (line.kind === 'gap') {
          push(line)
        } else {
          await wait(line.text.startsWith('Uploading') ? 900 : 220)
          push(line)
        }
      }
    }
  })
</script>

<template>
  <figure
    ref="root"
    inert
    aria-hidden="true"
    class="pointer-events-none relative m-0 flex h-full w-full min-w-0 flex-col justify-start overflow-hidden p-(--spacing-xl) select-none"
  >
    <div
      v-if="texture"
      class="contents"
    >
      <TextureMaterial
        kind="pixelate"
        size="small"
        fade="top"
      />
    </div>
    <div class="relative z-10 w-full min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
      <CodeBlock
        :tabs="[tab]"
        copy-aria-label="Copy the terminal session"
      />
    </div>
  </figure>
</template>
