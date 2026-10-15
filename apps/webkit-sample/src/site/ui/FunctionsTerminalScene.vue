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

  interface ScriptLine {
    kind: 'command' | 'output' | 'gap' | 'ask' | 'progress'
    text: string
    answer?: string
    done?: string
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
    /** Playback rate; 2 types and advances twice as fast. */
    speed?: number
    /** Drops the inset and the shadow and runs the block to the frame's foot; with `fit`, the latest lines stay in its upper three quarters, above a host's fade. */
    flush?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    script: 'start',
    active: true,
    texture: true,
    fit: false,
    speed: 1,
    flush: false
  })

  const LINE_HEIGHT = 20
  const CHROME = 72
  const BLOCK_CHROME = 66
  const MAX_LINES = 14
  const FLUSH_VISIBLE = 0.75

  const lines = computed<ScriptLine[]>(
    () => (TERMINAL_SCRIPTS[props.script] ?? TERMINAL_SCRIPTS.start) as ScriptLine[]
  )

  const root = ref<HTMLElement | null>(null)
  const shown = shallowRef<TerminalLine[]>([])
  const capacity = ref(MAX_LINES)

  let observer: globalThis.ResizeObserver | null = null

  const measure = () => {
    const element = root.value
    if (!props.fit || !element?.clientHeight) return
    const inset = Number.parseFloat(getComputedStyle(element).paddingTop) * 2
    const usable = element.clientHeight * (props.flush ? FLUSH_VISIBLE : 1)
    const fits = Math.floor((usable - inset - CHROME) / LINE_HEIGHT)
    capacity.value = Math.min(MAX_LINES, Math.max(4, fits))
  }

  onMounted(() => {
    observer = new globalThis.ResizeObserver(measure)
    if (root.value) observer.observe(root.value)
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  const toText = (line: TerminalLine) => (line.kind === 'output' ? `# ${line.text}` : line.text)

  const reservedLines = computed(() => Math.min(capacity.value, lines.value.length))

  const blockStyle = computed(() => ({
    minHeight: `${reservedLines.value * LINE_HEIGHT + BLOCK_CHROME}px`
  }))

  const visibleText = computed(() => {
    const visible = shown.value.slice(-capacity.value).map(toText)
    return visible.length > 1 ? visible.join('\n') : `${visible[0] ?? ''}\n`
  })

  const tab = computed<CodeBlockTab>(() => ({
    label: 'Azion CLI',
    value: 'terminal',
    language: 'bash',
    code: visibleText.value,
    fileName: 'Azion CLI',
    fileIcon: 'ai ai-azion text-(--primary)'
  }))

  const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const SPIN_FRAME = 80
  const SPIN_FOR = 1400

  const asked = (line: ScriptLine, answer: string) => `? ${line.text}: ${answer}`
  const answered = (line: ScriptLine) => `✔ ${line.text}: ${line.answer ?? ''}`
  const resolved = (line: ScriptLine) => `✔ ${line.done ?? line.text}`

  const finalLine = (line: ScriptLine): TerminalLine => {
    if (line.kind === 'ask') return { kind: 'output', text: answered(line) }
    if (line.kind === 'progress') return { kind: 'output', text: resolved(line) }
    return { kind: line.kind, text: line.text }
  }

  const push = (line: TerminalLine) => {
    shown.value = [...shown.value, line]
  }

  const rewrite = (line: TerminalLine) => {
    shown.value = [...shown.value.slice(0, -1), line]
  }

  useSceneScript(root, {
    hold: 6000 / props.speed,
    lead: 0,
    active: () => props.active,
    reset: () => {
      shown.value = []
    },
    settle: () => {
      shown.value = lines.value.map(finalLine)
    },
    play: async (rawWait) => {
      const wait = (ms: number) => rawWait(ms / props.speed)
      for (const line of lines.value) {
        if (line.kind === 'command') {
          push({ kind: 'command', text: '' })
          await typeInto(wait, line.text, (text) => rewrite({ kind: 'command', text }), {
            step: 1,
            every: 38
          })
          await wait(420)
        } else if (line.kind === 'gap') {
          push({ kind: 'gap', text: '' })
        } else if (line.kind === 'ask') {
          await wait(220)
          push({ kind: 'output', text: asked(line, '') })
          await wait(320)
          await typeInto(
            wait,
            line.answer ?? '',
            (text) => rewrite({ kind: 'output', text: asked(line, text) }),
            { step: 1, every: 45 }
          )
          await wait(260)
          rewrite({ kind: 'output', text: answered(line) })
        } else if (line.kind === 'progress') {
          await wait(220)
          push({ kind: 'output', text: `${SPINNER[0]} ${line.text}` })
          for (let frame = 1; frame * SPIN_FRAME < SPIN_FOR; frame++) {
            await wait(SPIN_FRAME)
            rewrite({ kind: 'output', text: `${SPINNER[frame % SPINNER.length]} ${line.text}` })
          }
          rewrite({ kind: 'output', text: resolved(line) })
        } else {
          await wait(220)
          push({ kind: 'output', text: line.text })
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
    :data-flush="flush || null"
    class="pointer-events-none relative m-0 flex h-full w-full min-w-0 flex-col justify-start overflow-hidden p-(--spacing-xl) select-none data-flush:p-0"
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
    <div
      :style="blockStyle"
      :data-flush="flush || null"
      class="relative z-10 flex w-full min-w-0 flex-col rounded-(--shape-elements) shadow-(--shadow-sm) data-flush:h-full data-flush:overflow-hidden data-flush:[border:var(--illustration-rim-width)_solid_transparent] data-flush:[background-image:var(--illustration-rim-layers)] data-flush:[background-origin:var(--illustration-rim-boxes)] data-flush:[background-clip:var(--illustration-rim-boxes)] data-flush:shadow-none"
    >
      <CodeBlock
        class="flex-1"
        :tabs="[tab]"
        :show-line-numbers="false"
        :border="!flush"
        animate-lines
        copy-aria-label="Copy the terminal session"
      />
    </div>
  </figure>
</template>
