<script setup>
  // THE THANKS SLIDE — the last thing on the screen while the room asks its questions.
  //
  // It is the deck's only slide with a job that outlives the talk: the QR is still standing
  // there while people decide whether to scan it, so everything on it is either the way to
  // reach the speaker or the way to reach the thing the deck was about. Nothing else.
  //
  // Three decisions worth keeping.
  //
  // 1. THE PRINTED URL IS DERIVED FROM THE ENCODED ONE. `link.url` is the single source: the
  //    QR encodes it, and the muted line under the address is the same string with its scheme
  //    stripped. Two fields would let a slide show one URL and scan to another — a mistake
  //    nobody catches in review, because both halves look right and only a phone disagrees.
  //
  // 2. THE CODE IS DRAWN DARK-ON-LIGHT, ON A PLATE. Inverted symbols scan on some readers and
  //    not others, so the code gets a white plate on this black slide: `--secondary` with
  //    `--secondary-contrast` on it, which in the deck's dark theme is exactly white and black
  //    and is a real token pair rather than a hardcoded #FFF. The four-module quiet zone the
  //    standard requires is the viewBox's own margin, so the plate IS the quiet zone.
  //
  // 3. ONE ACCENT, AND IT IS THE ADDRESS. The deck's rule is one orange thing per slide; here
  //    it is the email, because that is the only thing on the slide a person acts on without
  //    a phone. Which is also why this layout renders no overline — the deck's overlines carry
  //    an orange `//`, and that would be the second.
  import { computed } from 'vue'

  import { QR } from '../lib/deck-canvas.js'
  import { encode, toPath } from '../lib/qr-code.js'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // Level Q (25% recoverable) rather than the L most generators default to: a projected code is
  // read at an angle, across a room, half of it sometimes behind somebody's head, and the extra
  // redundancy costs a denser symbol on a plate that is already as large as the slide allows.
  const symbol = computed(() => encode(props.slide.link.url, { level: 'Q' }))

  const path = computed(() => toPath(symbol.value.modules))

  /** The viewBox is one unit per module, grown by the quiet zone on all four sides. */
  const viewBox = computed(() => {
    const span = symbol.value.size + QR.quiet * 2
    return `${-QR.quiet} ${-QR.quiet} ${span} ${span}`
  })

  /** The encoded URL, printed: no scheme, no trailing slash. */
  const printed = computed(() =>
    props.slide.link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  )
</script>

<template>
  <!-- `split`'s construction: the halves sit in a `gap-px` grid over a `--border-default` fill,
       so the rule between them is that fill showing through rather than a border either half
       drew, and it meets the frame's rules at exactly one pixel.

       Six and six, not the seven-and-five the argument slides take. Those weight one side —
       the claim is the subject and the evidence supports it. Here the two halves are the same
       thing said twice, once for a person and once for a phone, so the rule lands on the
       canvas's own centre line. -->
  <div class="grid h-full grid-cols-12 gap-px bg-(--border-default)">
    <!-- ── The address ──────────────────────────────────────────────────────────────── -->
    <!-- `text-heading-2xl` is the top of the type ladder. A reference thank-you sets its line
         far larger than any token in the system, and the last slide is not the place to invent
         a step the other twenty-three cannot use — the same call the cover makes. -->
    <div
      class="col-span-6 flex flex-col justify-center gap-(--spacing-xl) bg-(--bg-canvas) p-(--spacing-xxl)"
    >
      <h2 class="m-0 text-heading-2xl text-(--text-default)">{{ slide.headline }}</h2>

      <div class="flex flex-col gap-(--spacing-lg)">
        <span class="text-heading-sm text-(--primary)">{{ slide.contact }}</span>
        <span class="text-label-lg text-(--text-muted)">{{ printed }}</span>
      </div>
    </div>

    <!-- ── The code ─────────────────────────────────────────────────────────────────── -->
    <div
      class="col-span-6 flex flex-col items-center justify-center gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xxl)"
    >
      <!-- `--shape-elements` (6px) on a 460px plate is almost square, which is the point: it
           takes the corner off the white block without turning it into a card. Anything larger
           would start eating the quiet zone's corners, which are the scanner's margin. -->
      <svg
        :width="QR.plate"
        :height="QR.plate"
        :viewBox="viewBox"
        role="img"
        :aria-label="slide.link.caption"
        class="shrink-0 rounded-(--shape-elements) bg-(--secondary)"
      >
        <path
          :d="path"
          class="fill-(--secondary-contrast)"
        />
      </svg>

      <p class="m-0 text-label-lg text-(--text-muted)">{{ slide.link.caption }}</p>
    </div>
  </div>
</template>
