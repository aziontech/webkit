<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useSlots } from 'vue'

  /**
   * A prompt the reader is meant to RUN, not read — the block a docs page uses when
   * the next step is "say this to your agent". It is the one component in this layer
   * whose content is addressed to a machine, so it is the one that ships an
   * affordance for handing it to one.
   *
   * IT IS A LINE WITH A HANDLE, NOT A CODE BLOCK. A prompt looks like code and is
   * not: it is a sentence, so it carries no language, no gutter and no highlighting,
   * and it is set in the mono face only to say "this is the literal text, copy it as
   * it stands". Routing it through `CodeBlock` would give it a language tab strip for
   * a language that does not exist. It is set in `--text-default` rather than the
   * muted body ink for the same reason: the prompt IS the payload of the block, and
   * everything around it — the label, the copy control — is chrome.
   *
   * The mono face it takes is `text-body-code-sm`, the code face's BODY register. The
   * `text-label-code-*` set is all `leading-none`, which is right for what those were
   * made for — one row per line, the row's own padding doing the spacing, as a code
   * viewer does it — and wrong here, because a mono paragraph that WRAPS has no rows
   * to pad and its lines would touch.
   *
   * THE ONE CONTROL IS THE CLIPBOARD. It used to also offer a row of "Try in Claude" /
   * "Try in ChatGPT" buttons that carried the prompt inside a vendor URL, and they are
   * gone: a docs prompt is read by someone who already has an agent open — in a
   * terminal, in their editor, in a tab — and a block that names two of the possible
   * destinations is wrong for everyone using the third. Copy works for all of them,
   * and it is the one action that cannot be aimed at the wrong tool.
   *
   * A PROMPT HAS TWO LENGTHS, AND THEY WANT OPPOSITE THINGS (`kind`):
   *
   * - `block` — the priming paragraph. It wraps at the measure, and past four lines it
   *   is CAPPED rather than shown whole: a nine-line prompt above the step it belongs
   *   to pushes that step off the screen, and the reader who wants the whole thing
   *   wants it deliberately. The cut is a fade into the block's own surface plus a
   *   `Show more` / `Show less` button, never an ellipsis — an ellipsis says "text was
   *   removed", and nothing here was.
   * - `line` — the one-sentence prompt, the shape the first-deploy page uses. It does
   *   NOT wrap: a single instruction broken across three lines reads as three
   *   instructions. It scrolls sideways instead, with a fade on whichever edge has
   *   text behind it, so the overflow is visible rather than guessed.
   *
   * That split is also why the copy control's vertical alignment is not one value. The
   * control is 28px (`size-7`) and a single line of `text-body-code-sm` is 19.5px, so
   * top-aligning them leaves the prompt sitting 4.25px above the control's centre —
   * which is correct for `block`, where the paragraph grows downward and a centred
   * control would drift to the middle of four lines, and plainly wrong for `line`,
   * which is always exactly one line. So `line` centres the control against its text
   * and `block` keeps it at the top.
   *
   * The cap and the fades are MEASURED, never assumed. A `block` prompt that fits in
   * four lines gets no button, and a `line` prompt that fits gets no fade — an
   * affordance for scrolling that is not there is worse than none. And neither hides
   * anything from a screen reader: the full text is in the DOM either way, so the
   * button is a visual convenience and the state it reports is the change in its own
   * label.
   *
   * THE DISCLOSURE IS AN ANIMATED HEIGHT, WHICH IS NOT A KEYFRAME. One end of the move
   * is the cap (a real length) and the other is the prompt's own content height — a
   * runtime fact, different on every instance and every viewport — so a catalogued
   * `animate-*` could only ever be right for the one prompt it was authored against.
   * It is the measured-height recipe instead: read the height now, pin it, commit that
   * value across TWO `requestAnimationFrame`s, then set the other end and hand the cap
   * back to CSS on `transitionend`. Both frames are load-bearing — one can land inside
   * the frame the browser is already painting, so the start value never commits and
   * the box snaps. The timing is the tokens (`duration-moderate-02`, and the entrance
   * / exit curves picked by direction), and `prefers-reduced-motion` skips the move
   * entirely rather than shortening it.
   *
   * THE PROMPT IS WRITTEN ONCE, AND THE CLIPBOARD READS WHAT IS ON SCREEN. The default
   * slot is the only place the sentence exists; the copy button's value is that
   * element's own rendered text. A `prompt` prop beside the children would mean
   * authoring it twice, and the copy that silently rots is always the one nobody can
   * see.
   *
   * The text is read from the RENDERED ELEMENT rather than by walking the slot's
   * vnodes, which is the same string by a route that cannot go stale. Invoking a slot
   * outside the render function does not register what the slot depends on (Vue warns
   * about exactly this), so a prompt whose text comes from a ref would be captured
   * once and then quietly diverge from the sentence on screen — the one failure this
   * block is built to make impossible. Whether the copy button exists at all is a
   * separate, cheaper question — is there a slot or a label — so its presence is
   * decided in the first render and never waits for a measurement.
   *
   * THE TITLE IS A SEPARATE REGISTER, so it gets a separate row: it names what the
   * block IS ("AI Assistant"), above the payload. A block with no title is the bare
   * line — the shape a "Prompts to try" list wants, where the heading above has
   * already said what these are and a framed title on each of three one-line prompts
   * would be three times the chrome of the content.
   */
  defineOptions({ name: 'DocPrompt' })

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

  const slots = useSlots()

  /**
   * Is there anything to copy. Answered from the slot's PRESENCE, never by calling it,
   * so it is settled during the first render and the control never pops in a frame late.
   */
  const hasPrompt = computed(() => Boolean(slots['default']) || props.label.length > 0)

  /**
   * What the clipboard carries: the prompt element's own text, whitespace collapsed —
   * a slot authored across three indented template lines is one sentence, and the
   * indentation is the author's formatting rather than part of the string.
   */
  const promptText = ref('')

  const promptRef = ref<globalThis.HTMLElement | null>(null)
  /** `block`, and the reader asked for the whole thing. */
  const expanded = ref(false)
  /** `block`, and the prompt is taller than its cap — the only case that earns a button. */
  const capped = ref(false)
  /** `line`, and there is text scrolled off an edge: which one, or both. */
  const overflow = ref<'start' | 'end' | 'both' | ''>('')
  /** The pinned `max-height` while a disclosure move is in flight. `''` hands it back to CSS. */
  const capOverride = ref('')

  /**
   * The collapsed cap, resolved to px. Read off the element rather than restated here,
   * so `3.5lh` stays declared once — in the class that applies it — and a change there
   * cannot leave the collapse animating to a height the class does not use.
   */
  let capPx = 0

  /**
   * One reader for both shapes, because both answers are the same question asked on a
   * different axis: is there text outside the box, and on which side.
   */
  const measure = () => {
    const el = promptRef.value
    if (!el) return

    if (props.kind === 'line') {
      const start = el.scrollLeft > 1
      const end = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1
      overflow.value = start && end ? 'both' : start ? 'start' : end ? 'end' : ''
      return
    }

    // Only answerable while collapsed AND at rest. Expanded, the cap is off and the two
    // heights agree, so re-reading it would conclude "it fits" and take away the very
    // button the reader just pressed; mid-move, `max-height` is the pinned value the
    // animation is easing through, which is not the cap.
    if (expanded.value || capOverride.value) return

    capped.value = el.scrollHeight > el.clientHeight + 1
    const cap = Number.parseFloat(globalThis.getComputedStyle(el).maxHeight)
    if (Number.isFinite(cap)) capPx = cap
  }

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

    // A second press mid-move: land the first one so `from` is a real height and not a
    // value the previous run is still easing through.
    releaseMove?.()

    const from = el.clientHeight
    // Growing, the far end is the content's own height; shrinking, it is the cap — both
    // real lengths, which is what makes them interpolable.
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
        // Guard against a release that happened between the two frames.
        if (releaseMove === finish) capOverride.value = `${to}px`
      })
    )
  }

  let observer: globalThis.ResizeObserver | null = null

  onMounted(() => {
    // Reading the text needs the DOM, not layout, so it happens as early as it can: here,
    // rather than behind the tick the measurement has to wait for. The measurement is the
    // opposite case, since it needs a laid-out box.
    readPromptText()
    nextTick(measure)

    // The column's width decides both answers, and in a docs page it changes without a
    // window resize — the rail appears at `lg`, the sidebar collapses, an image above
    // finishes loading.
    if (typeof globalThis.ResizeObserver === 'function' && promptRef.value) {
      observer = new globalThis.ResizeObserver(() => measure())
      observer.observe(promptRef.value)
    }
  })

  // Every re-render is a chance the sentence changed, so both answers that depend on it
  // are taken again: what the clipboard carries, and whether it still overflows.
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
    data-doc-block
    data-doc-chrome
    data-testid="doc-prompt"
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

    <!-- The prompt row. It only takes a rule and the page's own canvas when there is a
         title above it to be divided from; on its own it IS the block, and a second
         surface inside a bordered box would read as a box in a box. Which of the two
         surfaces it lands on is also what every fade below has to end in, so the row
         publishes it once as `--prompt-bg` instead of each gradient guessing.

         THE COPY BUTTON DROPS BELOW THE PROMPT ON A PHONE. It cannot shrink, so beside
         the prompt at 390px it takes width the sentence needs more. Under it, the prompt
         gets the whole measure and the control still reads as belonging to it. -->
    <div
      :data-titled="title ? '' : undefined"
      class="flex flex-col gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) [--prompt-bg:var(--bg-surface)] sm:flex-row sm:items-start data-[titled]:border-t data-[titled]:border-(--border-default) data-[titled]:bg-(--bg-canvas) data-[titled]:[--prompt-bg:var(--bg-canvas)]"
    >
      <div class="min-w-0 flex-1">
        <!-- The fades anchor to the TEXT BOX, not to the column: the disclosure below is a
             sibling of the prompt, and a gradient stretched over both would wash out the very
             button it is telling the reader to press. -->
        <div class="relative">
          <!-- One element for both shapes: same ink, same measure, opposite overflow. The cap
               is `3.5lh` rather than a round number of lines so the fourth line is cut through
               the middle of its glyphs — a clean cut at a line boundary reads as the end of the
               prompt, and the whole point of the fade is to say "this continues".

               The curve is picked by DIRECTION, and `data-expanded` is already the destination
               when the move starts: growing gets the entrance curve, shrinking the exit one.

               A `line` prompt is FOCUSABLE because it scrolls: a scroll container holding no
               focusable child is unreachable by keyboard, which is a real dead end (and an axe
               `scrollable-region-focusable` violation). The `block` shape scrolls nothing — its
               overflow is the disclosure's job — so it takes no tab stop. -->
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

          <!-- Fades, one per overflowing edge, each ending in the row's own surface. Rendered
               only when there is something behind them: a permanent gradient over a prompt
               that fits is a promise of text that does not exist.

               The block's fade stays MOUNTED once the prompt is capped and rides opacity
               instead, so it leaves with the move it belongs to — a `v-if` would cut it on
               the first frame of a 240ms expand and read as a flicker. -->
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

        <!-- The disclosure belongs to the prompt, not to the copy control: it changes the
             prompt's own height, while the button beside it is about where the prompt GOES.
             It sits centred under the fade, which is where the text stopped. -->
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

      <!-- Wrapped rather than aligned with `self-end`, because the control's own root
           merges the class it is handed into its variant classes — an alignment that
           depends on that landing is an alignment that can silently not.

           The wrapper is also where the two shapes part company vertically. The control
           is 28px and one line of the prompt face is 19.5px, so the row's `items-start`
           leaves a `line` prompt sitting 4.25px high — right for `block`, which grows
           downward, wrong for `line`, which never has a second line to grow into. -->
      <div
        v-if="hasPrompt"
        :data-kind="kind"
        class="flex shrink-0 justify-end data-[kind=line]:sm:self-center"
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
