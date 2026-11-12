<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <SectionContainer max-width="7xl">
    <FrameBox borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">First band</div>
    </FrameBox>
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Second band</div>
    </FrameBox>
  </SectionContainer>
</template>
