<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionGap from '@aziontech/webkit/section-gap'
</script>

<template>
  <div>
    <FrameBox borders="y">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="small" — one --spacing-xxl below
      </div>
    </FrameBox>
    <SectionGap size="small" />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="medium" — two below
      </div>
    </FrameBox>
    <SectionGap size="medium" />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="large" — three below
      </div>
    </FrameBox>
    <SectionGap size="large" />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">End</div>
    </FrameBox>
  </div>
</template>
