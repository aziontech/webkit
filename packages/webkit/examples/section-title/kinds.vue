<script setup>
  import SectionTitle from '@aziontech/webkit/section-title'
</script>

<template>
  <div>
    <SectionTitle
      kind="centered"
      eyebrow="Centered"
      title="A symmetric section opener"
      description="Copy capped at the reading width and centered in the frame — the default."
    />
    <SectionTitle
      kind="left"
      eyebrow="Left"
      title="The same stack, at the start edge"
      description="Same anatomy, aligned to the start — for a section that reads rather than announces."
    />
    <SectionTitle
      kind="horizontal"
      eyebrow="Horizontal"
      title="Headline in the first column"
      description="The description takes the third column, with the middle one left as air. Below the md breakpoint the grid collapses and this falls back under the headline."
    />
  </div>
</template>
