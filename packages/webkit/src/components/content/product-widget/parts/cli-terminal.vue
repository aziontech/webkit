<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, shallowRef } from 'vue'

  import CodeBlock, { type CodeBlockTab } from '../../../code/code-block/code-block.vue'
  import TextureMaterial from '../../../marketing/texture-material/texture-material.vue'
  import { typeInto, useSceneScript } from '../composables/use-scene-script'
  import {
    TERMINAL_SCRIPTS,
    type TerminalScriptLine,
    type TerminalScriptName
  } from '../data/functions-start'

  defineOptions({ name: 'CliTerminal' })

  interface TerminalLine {
    kind: 'command' | 'output' | 'gap'
    text: string
  }

  interface Props {
    /** Which recorded session plays: the init-to-curl run, or the two-command deploy. */
    script?: TerminalScriptName
    /** Whether this terminal is the one showing; it plays only while it is. */
    active?: boolean
    /** Draws the pixel texture behind the block, for a frame with no backdrop of its own. */
    texture?: boolean
    /** Keeps only the latest lines that fit the frame's height. */
    fit?: boolean
    /** Playback rate; 2 types and advances twice as fast. */
    speed?: number
    /** Drops the inset and the shadow and runs the block to the frame's foot. */
    flush?: boolean
    /** Shows the block's copy control. */
    copyable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    script: 'start',
    active: true,
    texture: true,
    fit: false,
    speed: 1,
    flush: false,
    copyable: true
  })

  const LINE_HEIGHT = 20
  const CHROME = 72
  const BLOCK_CHROME = 66
  const MAX_LINES = 14
  const FLUSH_VISIBLE = 0.75

  const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const SPIN_FRAME = 80
  const SPIN_FOR = 1400

  const lines = computed(() => TERMINAL_SCRIPTS[props.script] ?? TERMINAL_SCRIPTS.start)

  const root = ref<HTMLElement | null>(null)
  const shown = shallowRef<TerminalLine[]>([])
  const capacity = ref(MAX_LINES)

  let observer: globalThis.ResizeObserver | null = null

  const reservedLines = computed(() => Math.min(capacity.value, lines.value.length))

  const blockStyle = computed(() => ({
    minHeight: `${reservedLines.value * LINE_HEIGHT + BLOCK_CHROME}px`
  }))

  const toText = (line: TerminalLine) => (line.kind === 'output' ? `# ${line.text}` : line.text)

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

  const measure = () => {
    const element = root.value
    if (!props.fit || !element?.clientHeight) return
    const inset = Number.parseFloat(globalThis.getComputedStyle(element).paddingTop) * 2
    const usable = element.clientHeight * (props.flush ? FLUSH_VISIBLE : 1)
    const fits = Math.floor((usable - inset - CHROME) / LINE_HEIGHT)
    capacity.value = Math.min(MAX_LINES, Math.max(4, fits))
  }

  onMounted(() => {
    if (typeof globalThis.ResizeObserver !== 'function') return
    observer = new globalThis.ResizeObserver(measure)
    if (root.value) observer.observe(root.value)
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  const asked = (line: TerminalScriptLine, answer: string) => `? ${line.text}: ${answer}`
  const answered = (line: TerminalScriptLine) => `✔ ${line.text}: ${line.answer ?? ''}`
  const resolved = (line: TerminalScriptLine) => `✔ ${line.done ?? line.text}`

  const finalLine = (line: TerminalScriptLine): TerminalLine => {
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
  <div
    ref="root"
    :data-flush="flush || null"
    class="relative flex h-full w-full min-w-0 flex-col justify-start overflow-hidden p-(--spacing-xl) data-flush:p-0"
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
      class="relative z-10 flex w-full min-w-0 flex-col rounded-(--shape-elements) shadow-(--shadow-sm) data-flush:h-full data-flush:overflow-hidden data-flush:[border:var(--illustration-rim-width,var(--border-2))_solid_transparent] data-flush:[background-image:var(--illustration-rim-layers,linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))),var(--illustration-rim,linear-gradient(135deg,var(--border-default)_0%,var(--border-default)_18%,transparent_45%,transparent_55%,var(--border-default)_82%,var(--border-default)_100%)),linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))))] data-flush:[background-origin:var(--illustration-rim-boxes,padding-box,border-box,border-box)] data-flush:[background-clip:var(--illustration-rim-boxes,padding-box,border-box,border-box)] data-flush:shadow-none"
    >
      <CodeBlock
        class="flex-1"
        :tabs="[tab]"
        :show-line-numbers="false"
        :border="!flush"
        :copyable="copyable"
        :animateLines="true"
        copy-aria-label="Copy the terminal session"
      />
    </div>
  </div>
</template>
