<script setup>
  // FrameworkStackScene — "build with familiar frameworks" (Figma node 1684:20684).
  //
  // The design draws its own `Functions` scene here: the app as a website window, the Azion
  // mark on the left edge, and the frameworks you ship it from as pills overhanging the
  // right edge, with a `YOUR APP` pill tagging the window from above.
  //
  // That is the registered `functions` illustration's anatomy exactly — window, box, a
  // column of pills — with different pills in it, so the parts and their coordinates come
  // from that asset rather than being re-measured off the frame. It lives here and not as a
  // new asset in the library for the reason AiAgentsScene does: the pills carry other
  // projects' brand marks, which is a fact about this page's copy, not a part of the design
  // system.
  //
  // The marks are the icon library's own COLORED brand glyphs (`ai-cor ai-vue`, …) — the
  // same three the design instances (`ai-vue-cor`, `ai-svelt-cor`, `ai-react-cor`) — so
  // nothing is inlined or committed as an asset here either.
  import Illustration from '@aziontech/webkit/illustration'
  import IllustrationBox from '@aziontech/webkit/illustration-box'
  import IllustrationPill from '@aziontech/webkit/illustration-pill'
  import IllustrationWindow from '@aziontech/webkit/illustration-window'

  // In framework order as the design lists them, top to bottom.
  const FRAMEWORKS = [
    { icon: 'ai-cor ai-vue', label: 'Vue' },
    { icon: 'ai-cor ai-svelte', label: 'Svelte' },
    { icon: 'ai-cor ai-react', label: 'React' }
  ]
</script>

<template>
  <!-- The shared illustration canvas, so this scene sits at the same scale as the
       `azion-highlight` asset in the cell beside it. `aria-label` is what makes the root an
       `img` to assistive tech instead of a presentational box — the scene is the argument
       the heading makes, so it gets a name. -->
  <Illustration
    size="large"
    aria-label="An application window with the Azion runtime beside it, shipped from Vue, Svelte or React"
    class="h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] max-w-full shrink-0"
  >
    <span class="relative block h-full w-full">
      <IllustrationWindow
        kind="website"
        size="large"
        class="absolute left-[calc(50%-1px)] top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <!-- The tag on the window: the design floats it over the top edge, left of centre,
           so it reads as a label pinned to the panel rather than as a title above it. -->
      <IllustrationPill
        size="small"
        label="YOUR APP"
        class="absolute left-[40%] top-0 -translate-y-1/2"
      />

      <!-- The runtime, lit — the only active part in the scene, as in every other asset
           that puts the mark on the canvas. -->
      <IllustrationBox
        size="medium"
        active
        icon="ai ai-azion"
        class="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--primary)]"
      />

      <!-- The frameworks, overhanging the right edge. Same column geometry as the
           `functions` asset: centred on the window's own axis, one `xxs` step apart, all
           three the width of the widest so their left edges line up and the marks form a
           column of their own. -->
      <span
        class="absolute right-[-6px] top-1/2 flex w-[94px] -translate-y-1/2 flex-col items-start gap-[var(--spacing-xxs)]"
      >
        <IllustrationPill
          v-for="framework in FRAMEWORKS"
          :key="framework.label"
          size="medium"
          :icon="framework.icon"
          :label="framework.label"
          class="w-full"
        />
      </span>
    </span>
  </Illustration>
</template>
