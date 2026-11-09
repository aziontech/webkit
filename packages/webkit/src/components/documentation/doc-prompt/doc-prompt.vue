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

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-prompt')

  const hasPrompt = computed(() => Boolean(slots['default']) || props.label.length > 0)

  const promptText = ref('')

  const promptRef = ref<globalThis.HTMLElement | null>(null)
  const expanded = ref(false)
  const capped = ref(false)
  const overflow = ref<'start' | 'end' | 'both' | ''>('')
  const blockFitsOneLine = ref(false)
  const capOverride = ref('')

  const singleLine = computed(() => props.kind === 'line' || blockFitsOneLine.value)

  let capPx = 0

  const measure = () => {
    const el = promptRef.value
    if (!el) return

    if (props.kind === 'line') {
      const start = el.scrollLeft > 1
      const end = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1
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
    promptText.value = (promptRef.value?.textContent ?? '').replace(/\s+/g, ' ').trim()
  }

  const RELEASE_FALLBACK_MS = 600

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  let releaseMove: (() => void) | null = null

  const toggle = () => {
    const el = promptRef.value
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

    if (typeof globalThis.ResizeObserver === 'function' && promptRef.value) {
      observer = new globalThis.ResizeObserver(() => measure())
      observer.observe(promptRef.value)
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

    <div
      :data-titled="title ? '' : undefined"
      :data-single-line="singleLine ? '' : undefined"
      class="flex items-start gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) [--prompt-bg:var(--bg-surface)] data-[single-line]:items-center data-[titled]:border-t data-[titled]:border-(--border-default) data-[titled]:bg-(--bg-canvas) data-[titled]:[--prompt-bg:var(--bg-canvas)]"
    >
      <div class="min-w-0 flex-1">
        <div class="relative">
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
