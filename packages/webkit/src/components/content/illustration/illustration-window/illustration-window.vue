<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationWindow',
    inheritAttrs: false
  })

  export type IllustrationWindowKind = 'icon' | 'chat' | 'website'

  /** A window has no `small` step — 32px leaves no room for a scene. */
  export type IllustrationWindowSize = 'medium' | 'large'

  interface Props {
    /** Which scene fills the window body. */
    kind?: IllustrationWindowKind
    /** Scale of the window; inherits the scene scale when omitted, clamped to `medium`. */
    size?: IllustrationWindowSize
    /** Lights the window with the brand rim; inherits the scene emphasis when omitted. */
    active?: boolean
    /** Icon class pair from the icon library; used by `kind: 'icon'`. */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'icon',
    size: undefined,
    active: undefined,
    icon: ''
  })

  defineSlots<{
    /** Replaces the scene, keeping the window chrome. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const { size: sceneSize, active } = useIllustrationContext(
    () => props.size,
    () => props.active,
    'large'
  )

  // The scene may be `small`; a window clamps up to its smallest real step.
  const resolvedSize = computed<IllustrationWindowSize>(() =>
    sceneSize.value === 'large' ? 'large' : 'medium'
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-window'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // The window sits on the canvas, not on a surface, so it overrides the rim's fill layer.
  const ROOT_CLASS =
    'flex shrink-0 flex-col border-solid border-transparent border-[length:var(--illustration-rim-width)] rounded-[var(--illustration-shape-large)] text-[var(--text-default)] [--illustration-fill:var(--bg-canvas)] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)] transition-[background-image] duration-150 ease-out motion-reduce:transition-none data-[active]:[background-image:var(--illustration-rim-layers-active)] data-[size=medium]:size-16 data-[size=medium]:gap-[var(--spacing-xxs)] data-[size=medium]:p-[var(--spacing-xs)] data-[size=large]:size-32 data-[size=large]:gap-[var(--spacing-sm)] data-[size=large]:p-[var(--spacing-sm)]'

  const CHROME_CLASS =
    'flex shrink-0 items-center gap-[var(--spacing-xxs)] group-data-[size=medium]/window:*:size-0.5 group-data-[size=large]/window:*:size-1'

  const BODY_CLASS = 'min-h-0 flex-1'

  const BLOCK_CLASS = 'rounded-[var(--shape-button)] bg-[var(--bg-placeholder)]'

  // ── The chat scene ────────────────────────────────────────────────────────────
  //
  // A copilot conversation, not four static blocks: messages arriving bottom-to-top, with the
  // assistant thinking about the next answer underneath them. Four pieces make it work.
  //
  // 1. The TRACK is `h-[200%]` of the transcript and the animation travels a flat -50%, so the
  //    scroll is exactly one screenful at any window size — no per-size keyframe, no measured
  //    height. It is absolutely positioned so its 200% resolves against the transcript's own box
  //    rather than stretching the flex column.
  // 2. The MESSAGES are four per screenful, EQUAL in height, rendered TWICE. All three facts are
  //    load-bearing. Equal heights make one step exactly one message (the keyframe steps a fixed
  //    12.5% of the track); four per screenful keeps the asked/answered alternation unbroken
  //    across the loop's seam; and the second copy is what makes the seam invisible — after four
  //    steps the track shows the copy, pixel-identical to where it started. Message length is
  //    carried by WIDTH, which is the axis a chat actually varies in at this scale.
  //    The gap is a bottom MARGIN on every bubble rather than a flex `gap`, because a gap sits
  //    only BETWEEN items — the track would then be one gap short of two screenfuls and the loop
  //    would jump by that much on every repeat.
  // 3. Each bubble POPS into the gap the step just opened at the bottom.
  //    `animate-illustration-chat-pop` runs on the same duration as the scroll, offset by a
  //    negative delay per message (see MESSAGES), so its 4% pop fires ON the step boundary —
  //    when that message has stopped moving and is standing whole at the bottom of the view.
  //    Re-triggering an entrance per pass is not something CSS can do; phase-locking one long
  //    loop to another is.
  // 4. The MASK fades the two ends unevenly, and on purpose: a deep fade at the TOP, where
  //    messages leave and should dissolve rather than be guillotined by the clip, and a shallow
  //    one at the BOTTOM, where they arrive — a bottom fade as deep as the top one is exactly
  //    one message tall, so every new message would pop in already half-faded.
  // 5. The THINKING row stays outside the scroll, pinned at the bottom: a spinner beside a
  //    short pulsing bar — the "…thinking" line, which is what says the conversation is
  //    still going rather than finished. Both are catalog loops (`animate-spin` on the
  //    ring, `animate-pulse` on the bar, the same pulse every loading placeholder uses).
  const TRANSCRIPT_CLASS =
    'relative min-h-0 flex-1 overflow-hidden mask-t-from-72% mask-b-from-92% mask-y-to-100%'

  const TRACK_CLASS =
    'absolute inset-x-0 top-0 flex h-[200%] flex-col motion-safe:animate-illustration-chat-scroll motion-reduce:animate-none'

  // Asked (short, right) and answered (long, left) — the alternation is what makes eight
  // rounded blocks read as a dialogue rather than as a loading placeholder. The origin puts the
  // pop's growth on the bubble's own side, so it expands away from its edge of the window.
  const MESSAGE_CLASS = `${BLOCK_CLASS} min-h-0 shrink-0 basis-0 grow group-data-[size=medium]/window:mb-0.5 group-data-[size=large]/window:mb-[var(--spacing-xxs)] motion-safe:animate-illustration-chat-pop motion-reduce:animate-none`
  const ASKED_CLASS = `${MESSAGE_CLASS} self-end origin-bottom-right`
  const ANSWERED_CLASS = `${MESSAGE_CLASS} origin-bottom-left`

  // One screenful of conversation, rendered twice (see 2 above).
  //
  // `delay` is where in the 9s cycle each message pops. The scroll's four steps land on 0, ¼, ½
  // and ¾ of the cycle; a message pops on the step that brings it to the bottom, so the four
  // delays are `-(1 - step) × 9s` — and because the copies are the same messages one screenful
  // apart, the same four delays serve all eight bubbles. A negative delay starts the loop
  // already in progress, which is what puts each pop at its own moment instead of all at once.
  const MESSAGES = [
    { answered: false, width: 'w-[52%]', delay: '-6.75s' },
    { answered: true, width: 'w-[88%]', delay: '-4.5s' },
    { answered: false, width: 'w-[64%]', delay: '-2.25s' },
    { answered: true, width: 'w-[78%]', delay: '0s' }
  ]

  const TRANSCRIPT = [...MESSAGES, ...MESSAGES]

  const THINKING_CLASS =
    'flex shrink-0 items-center group-data-[size=medium]/window:h-1.5 group-data-[size=medium]/window:gap-0.5 group-data-[size=large]/window:h-2.5 group-data-[size=large]/window:gap-1'

  // A ring with one lit quarter: the border is the track and `border-t-*` the head, which is
  // only legible as motion — hence `animate-spin`, and hence `aspect-square` + `h-full`, so the
  // ring scales with the row instead of needing a size per window step.
  const SPINNER_CLASS =
    'h-full aspect-square shrink-0 rounded-full border-[length:var(--illustration-rim-width-hairline)] border-solid border-[var(--border-default)] border-t-[var(--text-muted)] motion-safe:animate-spin motion-reduce:animate-none'

  const THINKING_LABEL_CLASS = `${BLOCK_CLASS} h-full w-[34%] motion-safe:animate-pulse motion-reduce:animate-none`

  const rootClass = computed(() =>
    cn(ROOT_CLASS, 'group/window', attrs.class as string | undefined)
  )
</script>

<template>
  <span
    :data-testid="testId"
    :data-kind="kind"
    :data-size="resolvedSize"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <span
      aria-hidden="true"
      :class="CHROME_CLASS"
    >
      <span class="rounded-full bg-[var(--danger-contrast)]" />
      <span class="rounded-full bg-[var(--warning-contrast)]" />
      <span class="rounded-full bg-[var(--success-contrast)]" />
    </span>

    <slot>
      <span
        v-if="kind === 'icon'"
        :class="BODY_CLASS"
        class="grid place-items-center group-data-[size=medium]/window:text-[length:var(--size-6)] group-data-[size=large]/window:text-[length:var(--size-12)]"
      >
        <i
          v-if="icon"
          aria-hidden="true"
          :class="icon"
          class="leading-none"
        />
      </span>

      <span
        v-else-if="kind === 'chat'"
        :class="BODY_CLASS"
        class="flex flex-col group-data-[size=medium]/window:gap-0.5 group-data-[size=large]/window:gap-[var(--spacing-xxs)]"
      >
        <span :class="TRANSCRIPT_CLASS">
          <span :class="TRACK_CLASS">
            <span
              v-for="(message, index) in TRANSCRIPT"
              :key="index"
              :class="[message.answered ? ANSWERED_CLASS : ASKED_CLASS, message.width]"
              :style="{ animationDelay: message.delay }"
            />
          </span>
        </span>

        <span :class="THINKING_CLASS">
          <span :class="SPINNER_CLASS" />
          <span :class="THINKING_LABEL_CLASS" />
        </span>
      </span>

      <span
        v-else
        :class="BODY_CLASS"
        class="grid grid-rows-[14fr_57fr_23fr] gap-[var(--spacing-xxs)]"
      >
        <span :class="BLOCK_CLASS" />
        <span :class="BLOCK_CLASS" />
        <span :class="BLOCK_CLASS" />
      </span>
    </slot>
  </span>
</template>
