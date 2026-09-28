<script setup>
  // FrameworkStackScene — "build with familiar frameworks" (Figma node 1684:20684).
  //
  // The official `modern-frontends` scene: the app as a website window with the platform
  // behind it. The earlier version drew this out of illustration parts with the icon
  // library's framework glyphs in the pills; the library ships finished scenes now, so the
  // page names one instead of assembling its own.
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <!-- `aria-label` is what makes the root announce itself instead of being skipped — the
       scene is the argument the heading makes, so it gets a name. -->
  <Illustration
    name="modern-frontends"
    aria-label="An application window with the Azion runtime beside it, shipped from Vue, Svelte or React"
    class="shrink-0"
  />
</template>
