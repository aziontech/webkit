<script setup>
  import ModuleHeader from '@aziontech/webkit/module-header'
</script>

<template>
  <div>
    <ModuleHeader
      align="center"
      eyebrow="Centered"
      title="A symmetric section opener"
      description="Copy capped at the reading width and centered in the frame — the default."
    />
    <ModuleHeader
      align="start"
      eyebrow="Left"
      title="The same stack, at the start edge"
      description="Same anatomy, aligned to the start — for a section that reads rather than announces."
    />
    <ModuleHeader
      align="split"
      eyebrow="Horizontal"
      title="Headline in the first column"
      description="The description takes the third column, with the middle one left as air. Below the md breakpoint the grid collapses and this falls back under the headline."
    />
  </div>
</template>
