<script setup lang="ts">
  import {
    computed,
    createTextVNode,
    isVNode,
    nextTick,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    ref,
    Text,
    useAttrs,
    useId,
    useSlots,
    type VNode
  } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import CopyButton from '../../action/copy-button/copy-button.vue'

  defineOptions({ name: 'DocPrompt', inheritAttrs: false })

  /** How the prompt occupies its row: a wrapping paragraph, or one unbroken line. */
  export type DocPromptVariant = 'block' | 'line'

  export interface DocPromptProps {
    /** Wrapping paragraph capped at four lines, or one line that scrolls sideways. */
    variant?: DocPromptVariant
    /** What the block is, in a word or two. Renders as a titled row above the prompt. */
    title?: string
    /** Azion icon class for the glyph beside the title. */
    icon?: string
    /** Fallback prompt text when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<DocPromptProps>(), {
    variant: 'block',
    title: '',
    icon: 'az az-sparkles',
    label: ''
  })

  defineSlots<{
    /** The prompt itself: one or more sentences of literal text. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ docPrompt: en.docPrompt })
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-prompt')

  const hasPrompt = () => Boolean(slots['default']) || props.label.length > 0

  const promptText = ref('')

  const trimEdge = (nodes: VNode[], index: number, trim: (value: string) => string) => {
    const node = nodes[index]
    if (node?.type !== Text || typeof node.children !== 'string') return
    nodes[index] = createTextVNode(trim(node.children))
  }

  const promptNodes = (): VNode[] => {
    const rendered: unknown = slots['default']?.()
    const nodes = Array.isArray(rendered)
      ? rendered.filter(isVNode)
      : [createTextVNode(props.label)]
    trimEdge(nodes, 0, (value) => value.trimStart())
    trimEdge(nodes, nodes.length - 1, (value) => value.trimEnd())
    return nodes
  }

  const TrimmedPrompt = (attributes: { nodes?: VNode[] }) => attributes.nodes ?? []

  const promptEl = ref<globalThis.HTMLElement | null>(null)
  const expanded = ref(false)
  const promptId = useId()
  const capped = ref(false)
  const overflow = ref<'start' | 'end' | 'both' | ''>('')
  const blockFitsOneLine = ref(false)
  const capOverride = ref('')
  const lineDirection = ref<'ltr' | 'rtl'>('ltr')

  const lineFade = (edge: 'start' | 'end') => ({
    backgroundImage: `linear-gradient(to ${(edge === 'start') === (lineDirection.value === 'ltr') ? 'right' : 'left'}, var(--doc-prompt-background), transparent)`
  })

  const singleLine = computed(() => props.variant === 'line' || blockFitsOneLine.value)

  let capPx = 0

  const measure = () => {
    const el = promptEl.value
    if (!el) return

    if (props.variant === 'line') {
      lineDirection.value = globalThis.getComputedStyle(el).direction === 'rtl' ? 'rtl' : 'ltr'
      const scrolled = Math.abs(el.scrollLeft)
      const start = scrolled > 1
      const end = Math.ceil(scrolled + el.clientWidth) < el.scrollWidth - 1
      overflow.value = start && end ? 'both' : start ? 'start' : end ? 'end' : ''
      return
    }

    if (expanded.value || capOverride.value) return

    const style = globalThis.getComputedStyle(el)

    capped.value = el.scrollHeight > el.clientHeight + 1

    const cap = Number.parseFloat(style.maxHeight)
    if (Number.isFinite(cap)) capPx = cap

    const lineHeight = Number.parseFloat(style.lineHeight)
    blockFitsOneLine.value = Number.isFinite(lineHeight) && el.scrollHeight <= lineHeight * 1.5
  }

  const readPromptText = () => {
    promptText.value = (promptEl.value?.textContent ?? '').replace(/\s+/g, ' ').trim()
  }

  const RELEASE_FALLBACK_MS = 600

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  let releaseMove: (() => void) | null = null

  const toggle = () => {
    const el = promptEl.value
    const next = !expanded.value

    if (!el || prefersReducedMotion()) {
      expanded.value = next
      nextTick(measure)
      return
    }

    releaseMove?.()

    const from = el.clientHeight
    const to = next ? el.scrollHeight : capPx

    expanded.value = next

    if (!Number.isFinite(to) || to <= 0 || to === from) {
      nextTick(measure)
      return
    }

    capOverride.value = `${from}px`

    let timer: ReturnType<typeof globalThis.setTimeout> | null = null

    const finish = () => {
      el.removeEventListener('transitionend', onEnd)
      if (timer) globalThis.clearTimeout(timer)
      capOverride.value = ''
      releaseMove = null
      nextTick(measure)
    }

    const onEnd = (event: globalThis.TransitionEvent) => {
      if (event.propertyName === 'max-height' && event.target === el) finish()
    }

    el.addEventListener('transitionend', onEnd)
    timer = globalThis.setTimeout(finish, RELEASE_FALLBACK_MS)
    releaseMove = finish

    globalThis.requestAnimationFrame(() =>
      globalThis.requestAnimationFrame(() => {
        if (releaseMove === finish) capOverride.value = `${to}px`
      })
    )
  }

  let observer: globalThis.ResizeObserver | null = null

  onMounted(() => {
    readPromptText()
    nextTick(measure)

    if (typeof globalThis.ResizeObserver === 'function' && promptEl.value) {
      observer = new globalThis.ResizeObserver(() => measure())
      observer.observe(promptEl.value)
    }
  })

  onUpdated(() => {
    readPromptText()
    measure()
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    releaseMove?.()
  })

  const BODY_CLASS =
    'flex items-start gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) [--doc-prompt-background:var(--bg-surface)] ' +
    'flex-wrap data-[single-line]:items-center data-[line]:@max-sm/doc-prompt:items-start ' +
    'data-[titled]:border-t data-[titled]:border-(--border-default) data-[titled]:bg-(--bg-canvas) data-[titled]:[--doc-prompt-background:var(--bg-canvas)]'

  const PROMPT_CLASS =
    'm-0 text-body-code-sm text-(--text-default) motion-reduce:transition-none ' +
    'data-[variant=block]:max-h-[3.5lh] data-[variant=block]:overflow-hidden data-[variant=block]:whitespace-pre-wrap data-[variant=block]:transition-[max-height] ' +
    'data-[variant=block]:duration-moderate-02 data-[variant=block]:ease-productive-exit data-[variant=line]:overflow-x-auto data-[variant=line]:whitespace-nowrap ' +
    'data-[variant=line]:rounded-(--shape-control) data-[variant=line]:[scrollbar-width:none] data-[variant=block]:data-[state=open]:max-h-none ' +
    'data-[variant=block]:data-[state=open]:ease-productive-entrance data-[variant=line]:focus-visible:outline-2 data-[variant=line]:focus-visible:outline-offset-2 ' +
    'data-[variant=line]:focus-visible:outline-(--ring-color) data-[variant=line]:[&::-webkit-scrollbar]:hidden ' +
    'data-[variant=line]:@max-sm/doc-prompt:whitespace-pre-wrap'

  const FADE_CLASS =
    'pointer-events-none absolute inset-x-0 bottom-0 h-(--spacing-lg) bg-gradient-to-b from-transparent to-(--doc-prompt-background) transition-opacity duration-moderate-01 ' +
    'ease-productive-exit ' +
    'data-[hidden]:opacity-0 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <div
    v-bind="$attrs"
    data-doc-block
    data-doc-chrome
    :data-testid="testId"
    :data-variant="variant"
    :data-capped="variant === 'block' && capped ? '' : undefined"
    class="@container/doc-prompt w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <div
      v-if="title"
      data-title-row
      class="flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm)"
    >
      <i
        v-if="icon"
        :class="icon"
        class="shrink-0 text-label-md leading-none text-(--primary)"
        aria-hidden="true"
      />
      <p class="m-0 text-label-md text-(--text-default)">{{ title }}</p>
    </div>

    <div
      :data-titled="title ? '' : undefined"
      :data-single-line="singleLine ? '' : undefined"
      :data-line="variant === 'line' ? '' : undefined"
      :class="BODY_CLASS"
    >
      <div class="min-w-0 flex-1">
        <div
          class="relative"
          :dir="variant === 'line' ? lineDirection : undefined"
        >
          <p
            :id="promptId"
            ref="promptEl"
            dir="auto"
            :data-variant="variant"
            :data-state="variant === 'block' ? (expanded ? 'open' : 'closed') : undefined"
            :data-overflow="variant === 'line' && overflow ? overflow : undefined"
            :tabindex="variant === 'line' ? 0 : undefined"
            :style="{ maxHeight: capOverride || undefined }"
            :class="PROMPT_CLASS"
            @scroll="measure"
          >
            <TrimmedPrompt :nodes="promptNodes()" />
          </p>

          <div
            v-if="variant === 'block' && capped"
            :data-hidden="expanded ? '' : undefined"
            :class="FADE_CLASS"
            aria-hidden="true"
          />
          <div
            v-if="variant === 'line' && (overflow === 'start' || overflow === 'both')"
            :data-testid="`${testId}__fade-start`"
            :style="lineFade('start')"
            class="pointer-events-none absolute inset-y-0 start-0 w-(--spacing-lg)"
            aria-hidden="true"
          />
          <div
            v-if="variant === 'line' && (overflow === 'end' || overflow === 'both')"
            :data-testid="`${testId}__fade-end`"
            :style="lineFade('end')"
            class="pointer-events-none absolute inset-y-0 end-0 w-(--spacing-lg)"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        v-if="hasPrompt()"
        class="flex shrink-0 justify-end"
      >
        <CopyButton
          :value="promptText"
          :aria-label="t('docPrompt.copy')"
          :copied-label="t('docPrompt.copied')"
          variant="outline"
          size="small"
        />
      </div>

      <div
        v-if="variant === 'block' && capped"
        class="flex basis-full justify-center"
      >
        <Button
          :label="expanded ? t('docPrompt.showLess') : t('docPrompt.showMore')"
          :icon="expanded ? 'az az-chevron-up' : 'az az-chevron-down'"
          variant="outline"
          size="small"
          :aria-expanded="expanded"
          :aria-controls="promptId"
          @click="toggle"
        />
      </div>
    </div>
  </div>
</template>
