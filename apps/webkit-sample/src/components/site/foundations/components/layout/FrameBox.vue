<script setup>
  /**
   * FrameBox — the Azion "registration frame" container.
   *
   * A thin bordered box with small crosshair marks centered on each corner and
   * an optional vertical hatch-line texture behind the content, matching the
   * framed sections on azion.com. Wrap any content in the default slot.
   *
   *   • marks — show the four corner crosshair (registration) marks.
   *   • hatch — show the faint vertical hatch-line texture, faded at the edges.
   */
  defineProps({
    marks: {
      type: Boolean,
      default: true
    },
    hatch: {
      type: Boolean,
      default: false
    }
  })

  // Corner placement: each mark is centered on its corner via a half-size
  // translate so the crosshair straddles the border line.
  const corners = [
    'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
    'right-0 top-0 translate-x-1/2 -translate-y-1/2',
    'left-0 bottom-0 -translate-x-1/2 translate-y-1/2',
    'right-0 bottom-0 translate-x-1/2 translate-y-1/2'
  ]
</script>

<template>
  <div class="relative border border-[var(--border-muted)]">
    <!-- Vertical hatch-line texture, faded toward the edges. -->
    <div
      v-if="hatch"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(to_right,var(--border-muted)_0,var(--border-muted)_1px,transparent_1px,transparent_var(--spacing-lg))] mask-[radial-gradient(ellipse_at_center,black,transparent_85%)]"
    />

    <!-- Corner crosshair marks (registration marks). -->
    <template v-if="marks">
      <span
        v-for="corner in corners"
        :key="corner"
        aria-hidden="true"
        :class="['pointer-events-none absolute z-20 block size-[11px]', corner]"
      >
        <span
          class="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--border-default)]"
        />
        <span
          class="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--border-default)]"
        />
      </span>
    </template>

    <!-- Content sits above the hatch texture. -->
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
