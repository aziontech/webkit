<script setup>
  import SectionGap from '@aziontech/webkit/section-gap'
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div>
    <FrameBox borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section above</div>
    </FrameBox>
    <SectionGap size="medium" />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section below</div>
    </FrameBox>
  </div>
</template>
