<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    ref,
    useAttrs,
    useSlots
  } from 'vue'

  import Button from '../../actions/button/button.vue'
  import CopyButton from '../../actions/copy-button/copy-button.vue'

  // A prompt the reader runs, not reads: a sentence, not code — no language, gutter or
  // highlighting — set in the mono BODY register because the label-code registers
  // collapse line height and a wrapping mono paragraph's lines would touch. `block`
  // wraps, capped past four lines behind a fade plus a disclosure; `line` never wraps
  // and scrolls sideways. Cap and fades are measured; the full text stays in the DOM.
  defineOptions({ name: 'DocPrompt', inheritAttrs: false })

  /** How the prompt occupies its row: a wrapping paragraph, or one unbroken line. */
  export type DocPromptKind = 'block' | 'line'

  interface Props {
    /** Wrapping paragraph capped at four lines, or one line that scrolls sideways. */
    kind?: DocPromptKind
    /** What the block is, in a word or two. Renders as a titled row above the prompt. */
    title?: string
    /** PrimeIcons class for the glyph beside the title. */
    icon?: string
    /** Fallback prompt text when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'block',
    title: '',
    icon: 'pi pi-sparkles',
    label: ''
  })

  defineSlots<{
    /** The prompt itself: one or more sentences of literal text. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-prompt')

  /** Anything to copy? Answered from the slot's presence, never by calling it, so it settles in the first render. */
  const hasPrompt = computed(() => Boolean(slots['default']) || props.label.length > 0)

  /** What the clipboard carries: the prompt element's own rendered text, whitespace collapsed. */
  const promptText = ref('')

  const promptRef = ref<globalThis.HTMLElement | null>(null)
  /** `block`, and the reader asked for the whole thing. */
  const expanded = ref(false)
  /** `block`, and the prompt is taller than its cap — the only case that earns a button. */
  const capped = ref(false)
  /** `line`, and there is text scrolled off an edge: which one, or both. */
  const overflow = ref<'start' | 'end' | 'both' | ''>('')
  /** `block`, and the whole sentence fits on one line — measured, never assumed. */
  const blockFitsOneLine = ref(false)
  /** The pinned `max-height` while a disclosure move is in flight. `''` hands it back to CSS. */
  const capOverride = ref('')

  /** The only case where the row centres: `line` by definition, a `block` by measurement. */
  const singleLine = computed(() => props.kind === 'line' || blockFitsOneLine.value)

  /** The collapsed cap in px, read off the element so the class stays its only declaration. */
  let capPx = 0

  /** One reader for both shapes: is there text outside the box, and on which side. */
  const measure = () => {
    const el = promptRef.value
    if (!el) return

    if (props.kind === 'line') {
      const start = el.scrollLeft > 1
      const end = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1
      overflow.value = start && end ? 'both' : start ? 'start' : end ? 'end' : ''
      return
    }

    // Only answerable while collapsed AND at rest: expanded, the two heights agree and
    // re-reading would remove the very button just pressed; mid-move the cap is pinned.
    if (expanded.value || capOverride.value) return

    const style = globalThis.getComputedStyle(el)

    capped.value = el.scrollHeight > el.clientHeight + 1

    const cap = Number.parseFloat(style.maxHeight)
    if (Number.isFinite(cap)) capPx = cap

    // Read off the face's own line box rather than restated as a number here.
    const lineHeight = Number.parseFloat(style.lineHeight)
    blockFitsOneLine.value = Number.isFinite(lineHeight) && el.scrollHeight <= lineHeight * 1.5
  }

  // From the rendered element, not slot vnodes: a slot invoked outside render tracks
  // nothing, so a ref-driven prompt would be captured once and silently go stale.
  const readPromptText = () => {
    promptText.value = (promptRef.value?.textContent ?? '').replace(/\s+/g, ' ').trim()
  }

  /** Long enough to outlast `duration-moderate-02` (240ms) with room for a late frame. */
  const RELEASE_FALLBACK_MS = 600

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  /** Lands the move currently in flight, if there is one. */
  let releaseMove: (() => void) | null = null

  const toggle = () => {
    const el = promptRef.value
    const next = !expanded.value

    if (!el || prefersReducedMotion()) {
      expanded.value = next
      nextTick(measure)
      return
    }

    // A second press mid-move lands the first, so `from` is a real height.
    releaseMove?.()

    const from = el.clientHeight
    // Growing ends at the content's own height, shrinking at the cap — both real lengths.
    const to = next ? el.scrollHeight : capPx

    // The class cap flips with `expanded`, but the pin below lands in the same render
    // flush and inline style outranks it, so nothing paints at the wrong height.
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
      capOverride.value = '' // the cap goes back to CSS, so the box tracks its content again
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
        // Both frames are load-bearing: one can land inside the frame already painting,
        // so the start value never commits and the box snaps. The guard covers a
        // release that happened between the two frames.
        if (releaseMove === finish) capOverride.value = `${to}px`
      })
    )
  }

  let observer: globalThis.ResizeObserver | null = null

  onMounted(() => {
    // Text needs only the DOM; the measurement waits a tick for a laid-out box.
    readPromptText()
    nextTick(measure)

    // The column's width decides both answers, and in a docs page it changes without a
    // window resize: the rail appears, the sidebar collapses, an image finishes loading.
    if (typeof globalThis.ResizeObserver === 'function' && promptRef.value) {
      observer = new globalThis.ResizeObserver(() => measure())
      observer.observe(promptRef.value)
    }
  })

  // A re-render can change the sentence; re-take both answers that depend on it.
  onUpdated(() => {
    readPromptText()
    measure()
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    releaseMove?.()
  })
</script>

<template>
  <div
    v-bind="$attrs"
    data-doc-block
    data-doc-chrome
    :data-testid="testId"
    :data-kind="kind"
    :data-capped="kind === 'block' && capped ? '' : undefined"
    class="w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
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

    <!-- The prompt row takes a rule and the canvas only when a title divides it; alone
         it IS the block. It publishes its own surface as a custom property so every
         fade below ends in the right color. The single-line flag lives on the row, not
         the control: the control is the taller item, so it already sets the height. -->
    <div
      :data-titled="title ? '' : undefined"
      :data-single-line="singleLine ? '' : undefined"
      class="flex items-start gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) [--prompt-bg:var(--bg-surface)] data-[single-line]:items-center data-[titled]:border-t data-[titled]:border-(--border-default) data-[titled]:bg-(--bg-canvas) data-[titled]:[--prompt-bg:var(--bg-canvas)]"
    >
      <div class="min-w-0 flex-1">
        <!-- The fades anchor to the text box, not the column: a gradient stretched over
             the sibling disclosure would wash out the very button it points at. -->
        <div class="relative">
          <!-- One element for both shapes. The cap cuts the fourth line mid-glyph on
               purpose: a cut at a line boundary reads as the end of the prompt. The curve
               is picked by direction. A line prompt is focusable because a scroll
               container with no focusable child is a keyboard dead end (axe
               scrollable-region-focusable); the block shape scrolls nothing. -->
          <p
            ref="promptRef"
            :data-kind="kind"
            :data-expanded="kind === 'block' && expanded ? '' : undefined"
            :data-overflow="kind === 'line' && overflow ? overflow : undefined"
            :tabindex="kind === 'line' ? 0 : undefined"
            :style="{ maxHeight: capOverride || undefined }"
            class="m-0 text-body-code-sm text-(--text-default) motion-reduce:transition-none data-[kind=block]:max-h-[3.5lh] data-[kind=block]:overflow-hidden data-[kind=block]:whitespace-pre-wrap data-[kind=block]:transition-[max-height] data-[kind=block]:duration-moderate-02 data-[kind=block]:ease-productive-exit data-[kind=line]:overflow-x-auto data-[kind=line]:whitespace-nowrap data-[kind=line]:rounded-(--shape-elements) data-[kind=line]:[scrollbar-width:none] data-[kind=block]:data-[expanded]:max-h-none data-[kind=block]:data-[expanded]:ease-productive-entrance data-[kind=line]:focus-visible:outline-2 data-[kind=line]:focus-visible:outline-offset-2 data-[kind=line]:focus-visible:outline-(--ring-color) data-[kind=line]:[&::-webkit-scrollbar]:hidden"
            @scroll="measure"
          >
            <slot>{{ label }}</slot>
          </p>

          <!-- One fade per overflowing edge, rendered only when text is behind it. The
               block's fade stays mounted and rides opacity, so it leaves with the move it
               belongs to instead of being cut on the expand's first frame. -->
          <div
            v-if="kind === 'block' && capped"
            :data-hidden="expanded ? '' : undefined"
            class="pointer-events-none absolute inset-x-0 bottom-0 h-(--spacing-lg) bg-gradient-to-b from-transparent to-(--prompt-bg) transition-opacity duration-moderate-01 ease-productive-exit data-[hidden]:opacity-0 motion-reduce:transition-none"
            aria-hidden="true"
          />
          <div
            v-if="kind === 'line' && (overflow === 'start' || overflow === 'both')"
            class="pointer-events-none absolute inset-y-0 left-0 w-(--spacing-lg) bg-gradient-to-r from-(--prompt-bg) to-transparent"
            aria-hidden="true"
          />
          <div
            v-if="kind === 'line' && (overflow === 'end' || overflow === 'both')"
            class="pointer-events-none absolute inset-y-0 right-0 w-(--spacing-lg) bg-gradient-to-l from-(--prompt-bg) to-transparent"
            aria-hidden="true"
          />
        </div>

        <!-- The disclosure belongs to the prompt (it changes the prompt's own height);
             it sits centred under the fade, where the text stopped. -->
        <div
          v-if="kind === 'block' && capped"
          class="flex justify-center pt-(--spacing-sm)"
        >
          <Button
            :label="expanded ? 'Show less' : 'Show more'"
            :icon="expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            kind="outlined"
            size="small"
            @click="toggle"
          />
        </div>
      </div>

      <!-- Wrapped rather than aligned on the control itself: the control merges a passed
           class into its variants, and an alignment depending on that can silently not land. -->
      <div
        v-if="hasPrompt"
        class="flex shrink-0 justify-end"
      >
        <CopyButton
          :value="promptText"
          aria-label="Copy prompt"
          copied-label="Prompt copied"
          kind="outlined"
          size="small"
        />
      </div>
    </div>
  </div>
</template>
