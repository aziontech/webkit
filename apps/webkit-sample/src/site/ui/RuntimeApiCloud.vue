<script setup>
  // RuntimeApiCloud — the Web APIs the Azion Runtime ships, as a field of Content Pills:
  // fixed rows that drift on scroll, with a few pills lit at any moment.
  //
  // This is the Figma hero's pill cloud (nodes 1683:14144 → 1683:14184), given the two
  // behaviours the design implies but a static frame cannot show.
  //
  // 1. THE HIGHLIGHT IS NOT A FIXED SET. Every tick, three lit pills hand off to three dark
  //    ones, so the field reads as a surface with something running on it rather than a
  //    decorated list. Nothing moves and nothing resizes — only the rim light changes — so a
  //    tick costs no layout.
  //
  // 2. THE ROWS DRIFT, IN OPPOSITE DIRECTIONS, ON SCROLL. Odd rows travel one way and even
  //    rows the other, tied to scroll POSITION rather than to a timer: scroll back up and the
  //    rows come back. Two facts make it cheap — the transform is composited (no layout, no
  //    paint), and the rows are wider than the frame by design, so the drift moves type that
  //    was always going to be cropped rather than opening a gap at either end.
  //
  // THE ROWS ARE ELEMENTS, NOT WRAPPING
  //
  // A `flex-wrap` field has no rows to move: the lines it renders are a function of the
  // container's width, and nothing in the DOM corresponds to one. So the list is chunked into
  // fixed rows of `PER_ROW`, each `flex-nowrap`. That is also what the design draws — four
  // rows wider than their 492px frame, alternately offset — so the two agree by construction.
  //
  // THREE READS, ALL FROM ONE PART
  //
  // The reference interaction paints its highlights in four different fills. The design
  // system has one emphasis switch — `IllustrationPill`'s `active`, which lights the brand
  // rim on the border and leaves the surface alone — so the tones collapse onto what the
  // part actually offers, and the third read comes from the label colour instead:
  //
  //   muted   default pill, muted label      — the long tail of the API surface
  //   lit     `active` pill, default label   — what the shuffle moves through
  //   azion   `active` pill, accent label    — the Azion-specific globals (FetchEvent,
  //                                            FirewallEvent, EdgeRuntime). Pinned: they
  //                                            are the point of the field, so they never dim.
  //
  // `pinned` also covers the four APIs the headline promises (fetch, Request, CryptoKey,
  // WebAssembly) — a highlight that blinks out from under the claim beside it is worse than
  // no highlight.
  //
  // Both behaviours stop under `prefers-reduced-motion`: no interval, no scroll listener, and
  // the rows render at offset 0 — which is the designed composition, not a degraded one.
  import IllustrationPill from '@aziontech/webkit/illustration-pill'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import { useScrollProgress } from '../composables/useScrollProgress.js'

  // Every entry is a real global of the Azion Runtime, in the order the runtime docs group
  // them (network → streams → encoding → crypto → standards → events → globals → buffers →
  // language) so the field reads as an inventory rather than a word cloud. It runs past the
  // Web APIs into the language globals for the same reason the reference does: what is in
  // scope inside a Function is the claim, and `Math` is as much a part of that as `fetch`.
  //
  //   pinned — never dims (the headline's four, plus the Azion-specific globals)
  //   azion  — an Azion-specific surface: accent label, pinned by definition
  //   lit    — seeds the initial highlight, so the field opens already alive
  //
  // The one pair left out is ReadableStreamDefaultReader / WritableStreamDefaultWriter: at 27
  // characters each, one of them eats a whole row on its own and the rows stop reading as rows.
  // Everything else the runtime exposes is here, which is what makes the field dense enough to
  // read as a surface rather than as a selection someone curated.
  const APIS = [
    // Network
    { label: 'fetch', pinned: true, lit: true },
    { label: 'Request', pinned: true, lit: true },
    { label: 'Response' },
    { label: 'Headers' },
    { label: 'FetchEvent', azion: true },
    { label: 'FirewallEvent', azion: true },
    { label: 'ExtendableEvent' },
    { label: 'addEventListener' },
    { label: 'removeEventListener' },
    { label: 'dispatchEvent' },
    { label: 'FormData', lit: true },
    { label: 'Blob' },
    { label: 'URL' },
    { label: 'URLSearchParams' },
    { label: 'URLPattern', lit: true },
    // Streams
    { label: 'ReadableStream' },
    { label: 'WritableStream' },
    { label: 'TransformStream', lit: true },
    { label: 'ReadableStreamBYOBReader' },
    { label: 'CompressionStream' },
    { label: 'DecompressionStream' },
    { label: 'TextEncoderStream' },
    { label: 'TextDecoderStream' },
    { label: 'CountQueuingStrategy' },
    // Encoding
    { label: 'TextEncoder' },
    { label: 'TextDecoder' },
    { label: 'atob' },
    { label: 'btoa' },
    { label: 'encodeURIComponent' },
    { label: 'decodeURIComponent' },
    // Crypto
    { label: 'crypto' },
    { label: 'Crypto' },
    { label: 'CryptoKey', pinned: true, lit: true },
    { label: 'SubtleCrypto' },
    // Standards & primitives
    { label: 'structuredClone', lit: true },
    { label: 'WebAssembly', pinned: true, lit: true },
    { label: 'Intl' },
    { label: 'Atomics' },
    { label: 'SharedArrayBuffer' },
    { label: 'Reflect' },
    { label: 'Proxy' },
    { label: 'JSON' },
    { label: 'Math' },
    { label: 'BigInt' },
    { label: 'Symbol' },
    // Events & control flow
    { label: 'EventTarget' },
    { label: 'Event' },
    { label: 'CustomEvent' },
    { label: 'AbortController', lit: true },
    { label: 'AbortSignal' },
    { label: 'DOMException' },
    { label: 'setTimeout' },
    { label: 'clearTimeout' },
    { label: 'setInterval' },
    { label: 'clearInterval' },
    { label: 'queueMicrotask' },
    { label: 'Promise' },
    // Globals
    { label: 'globalThis' },
    { label: 'self' },
    { label: 'console' },
    { label: 'EdgeRuntime', azion: true },
    { label: 'performance.now()' },
    { label: 'Map' },
    { label: 'Set' },
    { label: 'WeakMap' },
    { label: 'WeakSet' },
    // Buffers & views
    { label: 'ArrayBuffer' },
    { label: 'DataView' },
    { label: 'Uint8Array' },
    { label: 'Uint8ClampedArray' },
    { label: 'Uint16Array' },
    { label: 'Uint32Array' },
    { label: 'Int8Array' },
    { label: 'Int32Array' },
    { label: 'Float32Array' },
    { label: 'Int16Array' },
    { label: 'Float64Array' },
    { label: 'BigInt64Array' },
    { label: 'BigUint64Array' },
    // Language globals — the rest of what is in scope inside a Function
    { label: 'File' },
    { label: 'Date' },
    { label: 'RegExp' },
    { label: 'Number' },
    { label: 'String' },
    { label: 'Boolean' },
    { label: 'Object' },
    { label: 'Array' },
    { label: 'Function' },
    { label: 'Error' },
    { label: 'TypeError' },
    { label: 'RangeError' },
    { label: 'AggregateError' },
    { label: 'WeakRef' },
    { label: 'FinalizationRegistry' },
    { label: 'parseInt' },
    { label: 'parseFloat' },
    { label: 'isNaN' },
    { label: 'isFinite' },
    { label: 'crypto.randomUUID()' }
  ].map((api) => ({ ...api, pinned: api.pinned || api.azion }))

  // How many pills change hands per tick, and how long a tick lasts. Three of ~55 every
  // 1.1s: fast enough that the field is visibly working while the hero is on screen, slow
  // enough that the pill's own 150ms fade still reads as a hand-off rather than a blink.
  const HANDOFF = 3
  const TICK = 1100

  // Pills per row — a LENS, not a constant. The row lengths taper from two at the top edge
  // out to eight across the middle and back to two at the bottom, so the field is widest where
  // the eye lands and narrowest where it dissolves. A constant count makes a rectangle of type
  // whose only shape is the box it is in; tapering gives the field a shape of its own, and it
  // is what puts the weight of the list in the middle of the band.
  //
  // Twenty-two rows also OVERFILL a band-tall frame, so the field runs off the top and bottom
  // edges instead of sitting in the middle of the band with air above and below it — the
  // outermost rows are cropped by the fade rather than ending inside it.
  //
  // The counts sum to the length of APIS. They are written out rather than computed from a
  // curve because the shape is a composition — a reviewer should be able to read it as one.
  const ROW_SHAPE = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8, 8, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2]

  // How far a row travels, end to end, across one viewport of scrolling. 72px is a little
  // over half a pill: enough to see the two directions separate, not enough to make the
  // field feel like it is sliding away.
  const DRIFT = 72

  // The offset a row carries at rest, before any scrolling — the design's own alternating
  // inset (its rows 1 and 3 sit at -26.1px against rows 2 and 4). Rows of unlike width already
  // stagger a little when centred; stating it makes that read as composition instead of as
  // accident, and it puts every row's travel on the same axis as its rest position.
  const REST = 26

  // The rows, each carrying its pills' INDEXES into APIS — so the lit state stays one flat
  // array and a row never has to know about it.
  const rows = computed(() => {
    const chunks = []
    let cursor = 0
    // Walk the shape; a row takes what it asks for or what is left, and the walk stops when the
    // list runs out — so a shape that no longer sums to APIS.length degrades to a shorter field
    // instead of dropping entries silently.
    for (const count of ROW_SHAPE) {
      if (cursor >= APIS.length) break
      const slice = APIS.slice(cursor, cursor + count).map((api, offset) => ({
        api,
        index: cursor + offset
      }))
      chunks.push(slice)
      cursor += count
    }
    return chunks
  })

  // ── The highlight ───────────────────────────────────────────────────────────────
  // The lit set, as one boolean per pill. Indices rather than labels: the list is fixed at
  // module scope, so an index is a stable identity and the template reads it directly.
  const lit = ref(APIS.map((api) => Boolean(api.lit || api.azion)))

  // Only the unpinned pills take part. Computed once — the list never changes.
  const shufflable = APIS.reduce((indexes, api, index) => {
    if (!api.pinned) indexes.push(index)
    return indexes
  }, [])

  // `n` distinct shufflable pills whose lit state is `state`. Allocation-light: shuffle a
  // filtered copy and take the head.
  const pick = (state, n) => {
    const candidates = shufflable.filter((index) => lit.value[index] === state)
    for (let i = candidates.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }
    return candidates.slice(0, n)
  }

  const handoff = () => {
    const next = [...lit.value]
    pick(true, HANDOFF).forEach((index) => {
      next[index] = false
    })
    pick(false, HANDOFF).forEach((index) => {
      next[index] = true
    })
    lit.value = next
  }

  // ── The drift ───────────────────────────────────────────────────────────────────
  // One number for the whole field — where it sits relative to the viewport, in viewport
  // heights — and every row multiplies it by its own direction, so the rows can never drift
  // out of step. Position, not an event: scroll back up and the rows come back.
  const field = ref(null)
  const { progress } = useScrollProgress(field)

  const rowStyle = (rowIndex) => {
    const direction = rowIndex % 2 === 0 ? 1 : -1
    const x = (REST + progress.value * DRIFT) * direction
    return { transform: `translate3d(${x}px, 0, 0)` }
  }

  let timer = null

  onMounted(() => {
    // The pill's colour fade is CSS and carries its own motion-reduce fallback; a state change
    // on a timer does not, so stopping the hand-off is this component's job. (The drift stops
    // itself — useScrollProgress holds at 0, which is the rows' rest position.) A reader who
    // asked for less motion gets the seeded, unshifted field: the design's own composition.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timer = window.setInterval(handoff, TICK)
  })

  onBeforeUnmount(() => {
    if (timer) window.clearInterval(timer)
  })
</script>

<template>
  <!-- The rows are `role="none"`: they are a layout fact (the unit the drift moves), not part
       of the list's meaning, so they step out of the accessibility tree and leave every pill a
       direct `listitem` of the field.

       Nothing here fades the field at its edges — that belongs to whatever places it (see
       FunctionsHeroCanvas), because the shape of the fade depends on the shape of the slot,
       and a mask baked in here would be wrong in the next one. -->
  <div
    ref="field"
    role="list"
    aria-label="Globals available in the Azion Runtime"
    class="flex flex-col items-center justify-center gap-(--spacing-xs)"
  >
    <div
      v-for="(row, rowIndex) in rows"
      :key="`row-${rowIndex}`"
      role="none"
      :style="rowStyle(rowIndex)"
      class="flex w-max shrink-0 items-center gap-(--spacing-xs) will-change-transform"
    >
      <!-- `role="listitem"` rides IllustrationPill's attribute passthrough onto the pill's own
           root, so the semantics need no wrapper around each pill — a wrapper would land
           between the flex row and its items and take the gap with it. -->
      <IllustrationPill
        v-for="entry in row"
        :key="entry.api.label"
        role="listitem"
        size="medium"
        :active="lit[entry.index]"
        :label="entry.api.label"
        :class="[
          entry.api.azion
            ? 'text-(--primary)'
            : lit[entry.index]
              ? 'text-(--text-default)'
              : 'text-(--text-muted)',
          'transition-colors duration-500 ease-out motion-reduce:transition-none'
        ]"
      />
    </div>
  </div>
</template>
