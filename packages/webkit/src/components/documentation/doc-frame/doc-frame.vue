<script setup lang="ts">
  import { useEventListener, useScrollLock } from '@vueuse/core'
  import type { VNode } from 'vue'
  import { cloneVNode, computed, nextTick, ref, useAttrs, useSlots, watch } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap/index.js'
  import { flattenSlot } from './flatten-slot'

  /**
   * A framed figure: the bordered surface a screenshot, diagram or clip sits on,
   * with an optional caption underneath and an optional lead-in above. Keeps
   * media from floating loose on the canvas and gives every piece of it the same
   * border, radius and inset.
   *
   * THE CAPTION AND THE HINT EACH COME TWO WAYS. A string prop covers the plain
   * case in one attribute; a named slot of the same name carries the sentence
   * that needs a link, a bold run or a code chip. The slot wins when both are
   * given — the prop is the fallback content inside it — so the rich case is
   * real markup the page's own prose layer styles, not a string this component
   * parses. The elements arrive unclassed, so a link in a caption is the same
   * link as in the paragraph above it.
   *
   * THE CAPTION IS CENTERED AND THE HINT IS NOT. They are two different jobs. A
   * caption belongs to the image: it is read after it, as one unit with it, so it
   * centers on the frame the way a plate's title does. A hint is read before the
   * frame, in the flow of the sentence that led the reader here, so it stays on
   * the text's own left edge and does not pretend to be part of the picture.
   *
   * IT DECIDES image-or-clip FROM THE SOURCE, not from a prop. Mintlify frames a
   * clip by taking a raw media tag as a child; this layer's MDX subset carries no
   * raw HTML, so the source is a prop here and the extension is the only honest
   * signal of what it points at. An author writes one attribute and gets the
   * right element.
   *
   * A STILL OPENS FULL SCREEN, AND IT GROWS OUT OF ITS OWN FRAME. A screenshot in a
   * docs column is legible at the measure or it is not legible at all — the column is
   * capped by line length, not by what the picture needs — so a capture of a console
   * screen lands at roughly half the size it was taken at. Full screen is the reading
   * size, and the way in is the picture itself.
   *
   * The zoom is a FLIP: the frame measures where the thumbnail sits, mounts the overlay,
   * measures where the full-size copy lands, and animates the second from the first. Not
   * decoration — it is what says THIS picture opened, so the reader does not have to
   * re-find in a full-screen view the thing they were already looking at. A canned
   * scale-in cannot do it, because the starting rectangle is wherever that one image
   * happens to sit on that one page.
   *
   * The transform is inline because it is a MEASUREMENT, not a style choice, and the
   * transition is a class so a consumer can still override it. Naming `transform` is
   * correct here and only here: the pair that must never be named is Tailwind's own
   * translate/scale utilities, which compile to the standalone `translate` and `scale`
   * properties — this animates an inline `transform`, which is the property it says.
   *
   * A CLIP DOES NOT ZOOM. It carries controls a click would fight, and a player already
   * has fullscreen of its own. Composed slot content does not zoom either: it is markup,
   * so there is no source to open.
   *
   * AUTOPLAY DRAGS THREE ATTRIBUTES BEHIND IT. A clip set to play on its own is
   * decoration: it must not seize the reader's speakers, must not take over an
   * iOS viewport by going fullscreen, and — since nobody is there to replay it —
   * must loop. So autoplay implies muted, inline and looping, and the reader gets
   * no controls to operate a clip that operates itself. Without autoplay the
   * inverse holds: the clip is content the reader chooses to play, so it ships
   * controls and nothing else. That rule is applied twice, because a frame is
   * authored two ways: on the prop path here, and on the slot path by rewriting a
   * clip the author wrote by hand — same rule either way, so the two paths cannot
   * drift.
   */
  defineOptions({ name: 'DocFrame', inheritAttrs: false })

  interface Props {
    /** Caption under the frame, centered; plain-text fallback for the caption slot. */
    caption?: string
    /** Lead-in above the frame, left aligned; plain-text fallback for the hint slot. */
    hint?: string
    /** Media source; omit to frame slot content instead. */
    src?: string
    /** Alternative text for the framed media. */
    alt?: string
    /** Plays the clip on its own, muted, inline and looping, with no controls. */
    autoplay?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    caption: '',
    hint: '',
    src: '',
    alt: '',
    autoplay: false
  })

  defineSlots<{
    /** Framed content when no `src` is given. */
    default(): unknown
    /** Rich caption content; the `caption` prop is its plain-text fallback. */
    caption(): unknown
    /** Rich lead-in content; the `hint` prop is its plain-text fallback. */
    hint(): unknown
  }>()

  const slots = useSlots()
  const attrs = useAttrs()

  // A consumer-supplied data-testid wins; otherwise the derived fallback. Every
  // addressable part below derives its own testid from this one with a
  // double-underscore suffix, so an override renames the whole family at once.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-frame')

  /** Sources this component frames as a clip rather than as a still. */
  const CLIP_EXTENSIONS = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i

  const isClip = computed(() => CLIP_EXTENSIONS.test(props.src))

  /** What autoplay implies, applied to a clip the author wrote by hand. */
  const AUTOPLAY_ATTRS = { playsinline: '', loop: '', muted: '' }

  /**
   * True when a hand-written clip asks to play on its own.
   *
   * Both spellings count: a Vue template writes the attribute in lowercase, and
   * markup pasted out of a React or Mintlify page carries the camelCase one.
   */
  const playsOnItsOwn = (nodeAttrs: Record<string, unknown> | null) => {
    if (!nodeAttrs) return false
    const value = nodeAttrs['autoplay'] ?? nodeAttrs['autoPlay']
    return value !== undefined && value !== null && value !== false
  }

  /**
   * Give a hand-written autoplaying clip the three attributes it must not ship
   * without. Anything else in the slot passes through untouched.
   */
  const normalizeClip = (node: VNode) =>
    node?.type === 'video' && playsOnItsOwn(node.props) ? cloneVNode(node, AUTOPLAY_ATTRS) : node

  const framed = computed(() => flattenSlot(slots['default']?.() ?? []).map(normalizeClip))

  /* Only a still opens: a clip owns its controls, and slot markup has no source. */
  const zoomable = computed(() => Boolean(props.src) && !isClip.value)

  const zoomed = ref(false)
  const triggerRef = ref<HTMLButtonElement | null>(null)
  const overlayRef = ref<HTMLElement | null>(null)
  const zoomImageRef = ref<HTMLImageElement | null>(null)

  /* The measured transform that puts the full-size copy back over the thumbnail. */
  const flip = ref('')

  /*
   * Whether the transition is armed. The FLIP needs one frame with the transform
   * applied and NO transition — otherwise the browser animates the jump *to* the
   * thumbnail as well, and the picture visibly flies backwards before it opens. So
   * this drives a `data-flip` attribute that turns the transition on, and the class
   * that names `transform` only exists under `data-[flip=armed]`.
   */
  const armed = ref(false)

  const isScrollLocked = useScrollLock(document.body)

  /**
   * Map the full-size copy back onto the rectangle the thumbnail occupies.
   *
   * Both rectangles are read in viewport coordinates, and the overlay copy is
   * `position: fixed`, so the two share an origin and no scroll offset enters the
   * arithmetic. Scale is per-axis: a frame insets its picture, so the thumbnail and
   * the full-size copy do not always share an aspect ratio, and a single factor
   * would let the image visibly stretch on the way out. Returns a transform, or an
   * empty string when either rectangle is degenerate.
   */
  const flipTransform = (from: DOMRect, to: DOMRect) => {
    if (!to.width || !to.height) return ''
    const scaleX = from.width / to.width
    const scaleY = from.height / to.height
    const shiftX = from.left + from.width / 2 - (to.left + to.width / 2)
    const shiftY = from.top + from.height / 2 - (to.top + to.height / 2)
    return `translate(${shiftX}px, ${shiftY}px) scale(${scaleX}, ${scaleY})`
  }

  /*
   * Whether the reader asked for less motion, read at the moment of the gesture rather
   * than cached: the setting can change mid-session, and this is cheap.
   *
   * The FLIP is skipped in JS, not only in CSS, and that is deliberate on two counts.
   * A transition only interpolates a CHANGE, so never writing the transform is what
   * actually guarantees no animation — belt to the class's braces. And the close path
   * unmounts on `transitionend`, which never fires when no transition runs: gating only
   * in CSS would have left the overlay impossible to close for exactly the readers who
   * asked for less motion.
   */
  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /** Open the overlay and run the picture out from where the thumbnail sits. */
  const open = async () => {
    if (!zoomable.value) return
    const from = triggerRef.value?.getBoundingClientRect()
    zoomed.value = true
    armed.value = false
    flip.value = ''
    if (prefersReducedMotion()) return
    await nextTick()
    const image = zoomImageRef.value
    if (!from || !image) return
    flip.value = flipTransform(from, image.getBoundingClientRect())
    /*
     * Two frames, deliberately. The first commits the un-transitioned starting
     * transform; only in the second is the transition armed and the transform
     * released, so the browser has a previous value to interpolate FROM. Arming and
     * releasing together in one frame is the classic FLIP bug: the style resolves
     * once and nothing animates.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        armed.value = true
        flip.value = ''
      })
    })
  }

  /** Send the picture back to its frame, and unmount once it has arrived. */
  const close = () => {
    const image = zoomImageRef.value
    const from = triggerRef.value?.getBoundingClientRect()
    if (!image || !from || prefersReducedMotion()) {
      zoomed.value = false
      return
    }
    flip.value = flipTransform(from, image.getBoundingClientRect())
  }

  /*
   * Unmount on the way back, not on a timer: a duration in JS and a duration in a
   * class are two sources for one number, and they drift. `transitionend` fires on the
   * property we animate, and the guard keeps a bubbled transition on some other
   * element from tearing the overlay down early.
   */
  const onZoomTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== zoomImageRef.value || event.propertyName !== 'transform') return
    if (flip.value) zoomed.value = false
  }

  watch(zoomed, (isOpen) => {
    isScrollLocked.value = isOpen
  })

  /*
   * Focus goes to the close button, which sits OUTSIDE the element being transformed.
   * That is not only tidier — moving focus into a node while it animates cancels the
   * transition outright, with no error and no frames interpolated.
   */
  useFocusTrap(overlayRef, zoomed)

  useEventListener(document, 'keydown', (event: KeyboardEvent) => {
    if (!zoomed.value || event.key !== 'Escape') return
    event.preventDefault()
    close()
  })

  /* Hand focus back to the picture the reader opened, once the overlay is gone. */
  watch(zoomed, async (isOpen, wasOpen) => {
    if (isOpen || !wasOpen) return
    await nextTick()
    triggerRef.value?.focus()
  })
</script>

<template>
  <figure
    v-bind="$attrs"
    data-doc-block
    :data-testid="testId"
    class="m-0 w-full"
  >
    <div
      v-if="$slots['hint'] || hint"
      :data-testid="`${testId}__hint`"
      class="pb-(--spacing-xs) text-body-xs text-(--text-muted)"
    >
      <slot name="hint">{{ hint }}</slot>
    </div>
    <div
      class="flex flex-col items-center justify-center overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm)"
    >
      <video
        v-if="isClip"
        :src="src"
        :aria-label="alt || undefined"
        :autoplay="autoplay || undefined"
        :playsinline="autoplay || undefined"
        :loop="autoplay || undefined"
        :muted="autoplay || undefined"
        :controls="!autoplay || undefined"
        class="block h-auto w-full rounded-(--shape-elements)"
      ></video>
      <!-- The picture is the button, and it says so twice. `cursor-zoom-in` is the
           conventional signal but a weak one: it exists only under the pointer, it is
           invisible to anyone arriving by keyboard, and how faithfully it draws is the
           OS's business, not ours. So the affordance is also a thing on the page — a
           badge that fades in on hover AND on keyboard focus, which is the half a cursor
           can never cover. `group` is what lets the badge react to the button's state
           without a second handler or any JS. -->
      <button
        v-else-if="zoomable"
        ref="triggerRef"
        type="button"
        :data-testid="`${testId}__zoom-trigger`"
        :aria-label="alt ? `View full screen: ${alt}` : 'View image full screen'"
        class="group relative block w-full cursor-zoom-in rounded-(--shape-elements) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
        @click="open"
      >
        <img
          :src="src"
          :alt="alt"
          class="block h-auto w-full rounded-(--shape-elements)"
        />
        <span
          aria-hidden="true"
          :data-testid="`${testId}__zoom-hint`"
          class="pointer-events-none absolute top-(--spacing-xs) right-(--spacing-xs) inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-default) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        >
          <i class="pi pi-search-plus text-body-xs"></i>
          Full screen
        </span>
      </button>
      <img
        v-else-if="src"
        :src="src"
        :alt="alt"
        class="block h-auto w-full rounded-(--shape-elements)"
      />
      <template v-else>
        <component
          :is="node"
          v-for="(node, position) in framed"
          :key="position"
        />
      </template>
    </div>
    <figcaption
      v-if="$slots['caption'] || caption"
      :data-testid="`${testId}__caption`"
      class="pt-(--spacing-xs) text-center text-body-xs text-(--text-muted)"
    >
      <slot name="caption">{{ caption }}</slot>
    </figcaption>

    <!-- Teleported, so the overlay is never clipped by the prose column's own
         `overflow-hidden` frame, and `fixed` resolves against the viewport rather than
         against a scrolled ancestor. z sits above the dialog shell (1001) and the input
         overlay (1100): a lightbox is the topmost thing on the page while it is open. -->
    <Teleport to="body">
      <div
        v-if="zoomed"
        ref="overlayRef"
        role="dialog"
        aria-modal="true"
        data-state="open"
        :data-testid="`${testId}__zoom`"
        :aria-label="alt || 'Image, full screen'"
        class="fixed inset-0 z-1200 flex items-center justify-center p-(--spacing-lg) animate-fade-in motion-reduce:animate-none"
      >
        <!-- The dismiss surface is its own element, hidden from the a11y tree, exactly as
             the DS dialog's backdrop is. A click target belongs on something that is not
             also the dialog container: the container would swallow every click inside it,
             and a bare div with a click handler and no keyboard path is the thing
             `click-events-have-key-events` is right to reject. The keyboard path is
             Escape and the Close button, both real.

             The picture itself is `pointer-events-none`, which does two jobs with one
             declaration. It stops a near-full-viewport image from sitting on top of the
             Close button and swallowing it — the image is later in the DOM and also
             positioned, so at equal z-index it wins, and the button became unclickable.
             And it lets a click ON the picture fall through to the backdrop, so the
             obvious gesture in a lightbox — click the thing you opened — closes it,
             without a second handler or a button wrapped around content. -->
        <div
          aria-hidden="true"
          :data-testid="`${testId}__zoom-backdrop`"
          class="absolute inset-0 cursor-zoom-out bg-(--bg-backdrop)"
          @click="close"
        ></div>
        <button
          type="button"
          :data-testid="`${testId}__zoom-close`"
          aria-label="Close full screen"
          class="fixed top-(--spacing-lg) right-(--spacing-lg) cursor-pointer rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xxs) text-label-md text-(--text-default) hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
          @click="close"
        >
          Close
        </button>
        <img
          ref="zoomImageRef"
          :src="src"
          :alt="alt"
          :style="{ transform: flip }"
          :data-flip="armed ? 'armed' : 'start'"
          class="pointer-events-none relative block max-h-full max-w-full rounded-(--shape-elements) object-contain data-[flip=armed]:transition-[transform] data-[flip=armed]:duration-moderate-02 data-[flip=armed]:ease-expressive-entrance motion-reduce:transition-none!"
          @transitionend="onZoomTransitionEnd"
        />
      </div>
    </Teleport>
  </figure>
</template>
