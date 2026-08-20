<script setup lang="ts">
  import type { VNode } from 'vue'
  import { cloneVNode, computed, useSlots } from 'vue'

  import { renderInline } from '../lib/inline'
  import { flattenSlot } from '../lib/slot'

  /**
   * A framed figure: the bordered surface a screenshot, diagram or clip sits on,
   * with an optional caption underneath and an optional lead-in above. Keeps
   * media from floating loose on the canvas and gives every piece of it the same
   * border, radius and inset.
   *
   * THE CAPTION AND THE HINT ARE PROSE, NOT STRINGS. A caption is where an author
   * writes "the Create dialog, see the CLI reference" with the reference linked,
   * and a plain interpolation would print the markdown as punctuation. Both run
   * through the same inline renderer the page's paragraphs use, so a link, a bold
   * run, an emphasis or a code span reads identically whether it sits in a
   * caption or in the paragraph above it — and the elements come out unclassed so
   * DocProse styles them from the page rather than this component styling them
   * twice.
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
  defineOptions({ name: 'DocFrame' })

  interface Props {
    /** Caption rendered under the frame; inline markdown, centered. */
    caption?: string
    /** Lead-in rendered above the frame; inline markdown, left aligned. */
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
  }>()

  const slots = useSlots()

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
   *
   * @param {Record<string, unknown> | null} attrs - the child's props.
   * @returns {boolean}
   */
  const playsOnItsOwn = (attrs: Record<string, unknown> | null) => {
    if (!attrs) return false
    const value = attrs.autoplay ?? attrs.autoPlay
    return value !== undefined && value !== null && value !== false
  }

  /**
   * Give a hand-written autoplaying clip the three attributes it must not ship
   * without. Anything else in the slot passes through untouched.
   *
   * @param {import('vue').VNode} node - one flattened slot child.
   * @returns {import('vue').VNode} the child, cloned only when it is such a clip.
   */
  const normalizeClip = (node: VNode) =>
    node?.type === 'video' && playsOnItsOwn(node.props) ? cloneVNode(node, AUTOPLAY_ATTRS) : node

  const framed = computed(() => flattenSlot(slots.default?.() ?? []).map(normalizeClip))

  /*
   * The two prose props render through functional components rather than through
   * the `v-for` the slot uses, because inline markdown yields bare strings for
   * the text between the markup — and a string handed to `is` is read as a
   * component NAME, not as text, so the caption would come out empty. A
   * component that returns the whole token list keeps text and elements in one
   * flow. Each is defined once so its identity is stable across renders.
   */
  const HintText = () => renderInline(props.hint)
  const CaptionText = () => renderInline(props.caption)
</script>

<template>
  <figure
    data-doc-block
    data-testid="doc-frame"
    class="m-0 w-full"
  >
    <div
      v-if="hint"
      data-testid="doc-frame-hint"
      class="pb-(--spacing-xs) text-body-xs text-(--text-muted)"
    >
      <component :is="HintText" />
    </div>
    <div
      class="flex flex-col items-center justify-center overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm)"
    >
      <video
        v-if="isClip"
        :src="src"
        :aria-label="alt || null"
        :autoplay="autoplay || null"
        :playsinline="autoplay ? '' : null"
        :loop="autoplay || null"
        :muted="autoplay || null"
        :controls="!autoplay || null"
        class="block h-auto w-full rounded-(--shape-elements)"
      ></video>
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
      v-if="caption"
      data-testid="doc-frame-caption"
      class="pt-(--spacing-xs) text-center text-body-xs text-(--text-muted)"
    >
      <component :is="CaptionText" />
    </figcaption>
  </figure>
</template>
