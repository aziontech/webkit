<script setup lang="ts">
  import { computed } from 'vue'

  import { useLazyChunks } from '../../../../composables/use-lazy-chunks'
  import { cn } from '../../../../utils/cn'
  import type { CodeBlockDisplayLine, CodeBlockSplitRow } from '../composables/use-code-block-lines'
  import { formatLineNumber, getHighlightTokenClass } from '../lib/highlight-code'
  import { type CodeBlockLineState, getDiffMarker } from '../lib/line-decorations'
  import {
    type CodeBlockLineMotionMode,
    getCodeBlockLineSwapTransitionStyle,
    getCodeBlockLineTransitionStyle
  } from '../presets/transitions'

  defineOptions({ name: 'CodeBlockLines', inheritAttrs: false })

  interface Props {
    /** The lines to render in the unified view. */
    lines: CodeBlockDisplayLine[]
    /** The paired rows to render in the split view. */
    rows: CodeBlockSplitRow[]
    /** Renders the split view. */
    split: boolean
    /** Accessible name of the original side. */
    originalLabel: string
    /** Accessible name of the modified side. */
    modifiedLabel: string
    /** Value of the shown tab; part of each line key. */
    tabValue: string
    /** Shows the line number gutter. */
    showLineNumbers: boolean
    /** Screen reader text of an added line. */
    addedLabel: string
    /** Screen reader text of a removed line. */
    removedLabel: string
    /** Test id of the owning CodeBlock; each part appends its own name. */
    testId: string
    /** Shows the diff marker column. */
    showDiffGutter: boolean
    /** Swap counter; part of each line key so a swap remounts the lines. */
    version: number
    /** Which per-line stagger is running. */
    mode: CodeBlockLineMotionMode
    /** The stagger may start. */
    ready: boolean
    /** Lines below this index wait hidden. */
    revealed: number
    /** Where hidden lines enter from: the line itself, a tab side, or nowhere. */
    enterFrom: string
  }

  const props = defineProps<Props>()

  const { split: splitChunksOf, observe } = useLazyChunks({ rowHeight: 24 })
  const chunks = computed(() => splitChunksOf(props.split ? [] : props.lines))
  const splitChunks = computed(() => splitChunksOf(props.rows))
  const changeLabel = (state: string) =>
    state === 'added' ? props.addedLabel : state === 'removed' ? props.removedLabel : ''

  const motionState = (index: number) => {
    if (!props.mode) return undefined
    return props.ready && index < props.revealed ? 'shown' : 'hidden'
  }

  const motionStyle = (index: number) => {
    if (props.mode === 'swap') return getCodeBlockLineSwapTransitionStyle(index)
    return props.mode === 'enter' ? getCodeBlockLineTransitionStyle(index) : undefined
  }

  const LINE_CLASS =
    'group relative flex min-w-full w-max shrink-0 items-center gap-(--spacing-xs) px-(--spacing-lg) py-(--spacing-2xs) text-label-code-sm ' +
    'data-[state=added]:bg-(--success)/40 data-[state=removed]:bg-(--danger)/40 data-[state=highlighted]:bg-(--info)/40'

  const LINE_MOTION_CLASS =
    'data-[motion]:transform data-[motion]:motion-reduce:transform-none data-[motion]:motion-reduce:opacity-100 data-[motion]:motion-reduce:transition-none ' +
    'data-[motion=shown]:translate-x-0 data-[motion=shown]:opacity-100 data-[motion=hidden]:opacity-0 ' +
    'data-[motion=hidden]:data-[enter-from=line]:-translate-x-2 ' +
    'data-[motion=hidden]:data-[enter-from=right]:translate-x-(--spacing-md) data-[motion=hidden]:data-[enter-from=right]:rtl:-translate-x-(--spacing-md) ' +
    'data-[motion=hidden]:data-[enter-from=left]:-translate-x-(--spacing-md) data-[motion=hidden]:data-[enter-from=left]:rtl:translate-x-(--spacing-md) ' +
    'data-[motion=hidden]:data-[enter-from=none]:translate-x-0'

  const LINE_HOVER_CLASS =
    'pointer-events-none absolute inset-0 z-0 bg-(--bg-hover) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none group-hover:opacity-100 ' +
    'group-data-[state=added]:hidden group-data-[state=removed]:hidden'

  const SIDE_CLASS =
    'min-w-0 overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset ' +
    'data-[side=start]:border-e data-[side=start]:border-(--border-muted)'

  const SPLIT_LINE_CLASS =
    'relative flex min-w-full w-max shrink-0 items-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-2xs) text-label-code-sm ' +
    'data-[state=added]:bg-(--success)/40 data-[state=removed]:bg-(--danger)/40 data-[state=highlighted]:bg-(--info)/40 data-[state=empty]:bg-(--bg-canvas)'

  const SPLIT_LINE_MARKER_CLASS =
    'pointer-events-none absolute inset-y-0 start-0 w-[2px] ' +
    'in-data-[state=added]:bg-(--success-border) in-data-[state=removed]:bg-(--danger-border) in-data-[state=highlighted]:bg-(--info-border)'
</script>

<template>
  <div
    v-if="!split"
    v-bind="$attrs"
    dir="ltr"
    class="flex min-w-full w-max flex-col"
    :data-testid="`${testId}__lines`"
  >
    <template
      v-for="chunk in chunks"
      :key="chunk.index"
    >
      <div
        v-if="!chunk.mounted"
        :ref="(el) => observe(el, chunk.index)"
        :data-chunk="chunk.index"
        aria-hidden="true"
        class="shrink-0"
        :style="{ height: `${chunk.estimatedHeight}px` }"
      />
      <template v-else>
        <div
          v-for="(line, offset) in chunk.items"
          :key="`${tabValue}-${version}-${chunk.start + offset}`"
          :class="[LINE_CLASS, LINE_MOTION_CLASS]"
          :style="motionStyle(chunk.start + offset)"
          :data-motion="motionState(chunk.start + offset)"
          :data-enter-from="mode ? enterFrom : undefined"
          :data-testid="`${testId}__line`"
          :data-state="line.state"
        >
          <span
            :class="LINE_HOVER_CLASS"
            aria-hidden="true"
          />
          <span
            v-if="showDiffGutter"
            class="relative z-1 w-2 shrink-0 text-center group-data-[state=added]:text-(--success-foreground) group-data-[state=removed]:text-(--danger-foreground)"
            :data-testid="`${testId}__diff-marker`"
            aria-hidden="true"
          >
            {{ getDiffMarker(line.state) }}
          </span>
          <span
            v-if="showLineNumbers"
            class="relative z-1 w-4 shrink-0 text-center text-(--code-syntax-line-number)"
            :data-testid="`${testId}__line-number`"
          >
            {{ formatLineNumber(line.number) }}
          </span>
          <span
            v-if="changeLabel(line.state)"
            class="sr-only"
            >{{ changeLabel(line.state) }}</span
          >
          <code
            class="text-label-code-sm relative z-1 shrink-0 whitespace-pre pe-(--spacing-sm) group-data-[copyable]/code-block:pe-11"
            :data-testid="`${testId}__line-content`"
          >
            <span
              v-for="(token, tokenIndex) in line.tokens"
              :key="tokenIndex"
              :class="getHighlightTokenClass(token.type)"
            >
              {{ token.text }}
            </span>
          </code>
          <span
            v-if="line.state !== 'default'"
            :class="
              cn(
                'pointer-events-none absolute bottom-0 start-0 top-0 z-2 w-[2px]',
                'group-data-[state=added]:bg-(--success-border) group-data-[state=removed]:bg-(--danger-border) group-data-[state=highlighted]:bg-(--info-border)'
              )
            "
            aria-hidden="true"
            :data-testid="`${testId}__line-indicator`"
          />
        </div>
      </template>
    </template>
  </div>
  <div
    v-else
    v-bind="$attrs"
    dir="ltr"
    class="grid w-full grid-cols-2"
    :data-testid="`${testId}__split`"
  >
    <div
      v-for="side in ['start', 'end'] as const"
      :key="side"
      role="group"
      tabindex="0"
      :aria-label="side === 'start' ? originalLabel : modifiedLabel"
      :data-side="side"
      :data-testid="`${testId}__side`"
      :class="SIDE_CLASS"
    >
      <div class="flex min-w-full w-max flex-col">
        <template
          v-for="chunk in splitChunks"
          :key="chunk.index"
        >
          <div
            v-if="!chunk.mounted"
            :ref="(el) => side === 'start' && observe(el, chunk.index)"
            :data-chunk="chunk.index"
            aria-hidden="true"
            class="shrink-0"
            :style="{ height: `${chunk.estimatedHeight}px` }"
          />
          <template v-else>
            <div
              v-for="(pair, offset) in chunk.items"
              :key="`${tabValue}-${side}-${chunk.start + offset}`"
              :class="SPLIT_LINE_CLASS"
              :data-state="pair[side]?.state ?? 'empty'"
              :data-testid="`${testId}__split-line`"
            >
              <span
                class="w-2 shrink-0 text-center in-data-[state=added]:text-(--success-foreground) in-data-[state=removed]:text-(--danger-foreground)"
                aria-hidden="true"
                >{{ getDiffMarker((pair[side]?.state ?? 'default') as CodeBlockLineState) }}</span
              >
              <span
                v-if="showLineNumbers"
                class="w-4 shrink-0 text-center text-(--code-syntax-line-number)"
                >{{ pair[side] ? formatLineNumber(pair[side].number) : '' }}</span
              >
              <span
                v-if="pair[side] && changeLabel(pair[side].state)"
                class="sr-only"
                >{{ changeLabel(pair[side].state) }}</span
              >
              <code
                class="text-label-code-sm shrink-0 whitespace-pre pe-(--spacing-sm)"
                :data-testid="`${testId}__split-content`"
                ><span
                  v-for="(token, tokenIndex) in pair[side]?.tokens ?? []"
                  :key="tokenIndex"
                  :class="getHighlightTokenClass(token.type)"
                  >{{ token.text }}</span
                >{{ pair[side] ? '' : ' ' }}</code
              >
              <span
                v-if="pair[side] && pair[side].state !== 'default'"
                :class="SPLIT_LINE_MARKER_CLASS"
                aria-hidden="true"
              />
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
